import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks — must be hoisted before the route import so the module sees them
// ---------------------------------------------------------------------------

const mockGetUserById = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    auth: {
      admin: {
        getUserById: mockGetUserById,
      },
    },
    from: mockFrom,
  }),
}));

// We do NOT import createClient from server in the fixed route, but keep the
// mock in case other transitive imports pull it in.
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Stub global fetch so Resend calls don't hit the network
const mockFetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
vi.stubGlobal("fetch", mockFetch);

// ---------------------------------------------------------------------------
// Import route AFTER mocks are in place
// ---------------------------------------------------------------------------
import { POST } from "@/app/api/cron/digest/route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(authHeader?: string) {
  return new NextRequest("http://localhost/api/cron/digest", {
    method: "POST",
    headers: authHeader ? { authorization: authHeader } : {},
  });
}

const VALID_SECRET = "test-secret";

function setupEnv() {
  process.env.CRON_SECRET = VALID_SECRET;
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
}

// A chainable Supabase query builder stub
function makeQueryBuilder(resolveWith: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  builder.select = vi.fn(chain);
  builder.eq = vi.fn(chain);
  builder.gte = vi.fn(chain);
  builder.limit = vi.fn(chain);
  builder.maybeSingle = vi.fn().mockResolvedValue(resolveWith);
  // Make the builder itself thenable so `.from().select()...` resolves
  builder.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(resolveWith).then(resolve);
  return builder;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/cron/digest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupEnv();
  });

  // ── Auth gate ─────────────────────────────────────────────────────────────

  it("returns 401 when Authorization header is missing", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ error: "Unauthorized" });
  });

  it("returns 401 when Bearer token is wrong", async () => {
    const res = await POST(makeRequest("Bearer wrong-secret"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ error: "Unauthorized" });
  });

  // ── Empty parent_links ────────────────────────────────────────────────────

  it("returns { sent: 0, skipped: 0 } when no active parent links exist", async () => {
    mockFrom.mockReturnValue(makeQueryBuilder({ data: [], error: null }));

    const res = await POST(makeRequest(`Bearer ${VALID_SECRET}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ sent: 0 });
  });

  // ── Active parent link → email sent ──────────────────────────────────────

  it("calls Resend with parent email and teen stats for one active link", async () => {
    // Sequence of from() calls:
    //   1. parent_links  → returns one active link
    //   2. profiles (teen profile)
    //   3. user_attempts (weekly attempts)
    //   4. user_stats
    const parentLinksBuilder = makeQueryBuilder({
      data: [{ parent_user_id: "parent-uuid", teen_user_id: "teen-uuid" }],
      error: null,
    });
    const teenProfileBuilder = makeQueryBuilder({
      data: { username: "TestTeen", test_date: null },
      error: null,
    });
    const attemptsBuilder = makeQueryBuilder({
      data: [
        { is_correct: true, attempt_date: "2026-04-15" },
        { is_correct: false, attempt_date: "2026-04-16" },
      ],
      error: null,
    });
    const statsBuilder = makeQueryBuilder({
      data: { total_xp: 500, current_level: 3, current_streak: 5 },
      error: null,
    });

    mockFrom
      .mockReturnValueOnce(parentLinksBuilder) // parent_links
      .mockReturnValueOnce(teenProfileBuilder) // profiles
      .mockReturnValueOnce(attemptsBuilder)    // user_attempts
      .mockReturnValueOnce(statsBuilder);      // user_stats

    mockGetUserById.mockResolvedValue({
      data: { user: { email: "parent@example.com" } },
      error: null,
    });

    const res = await POST(makeRequest(`Bearer ${VALID_SECRET}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ sent: 1, skipped: 0 });

    // Resend was called
    expect(mockFetch).toHaveBeenCalledOnce();
    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toBe("https://api.resend.com/emails");
    const fetchBody = JSON.parse(fetchCall[1].body as string);
    expect(fetchBody.to).toBe("parent@example.com");
    expect(fetchBody.subject).toContain("TestTeen");
    // current_streak (not streak_count) should appear in the HTML
    expect(fetchBody.html).toContain("5");
  });

  // ── Inactive parent link → skipped ───────────────────────────────────────

  it("does not email when the only link has status pending_teen_approval", async () => {
    // The route filters by status='active' in the DB query, so inactive rows
    // are excluded before the loop. Simulate the DB returning empty data.
    mockFrom.mockReturnValue(
      makeQueryBuilder({ data: [], error: null })
    );

    const res = await POST(makeRequest(`Bearer ${VALID_SECRET}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.sent).toBe(0);
    // Resend should never have been called
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
