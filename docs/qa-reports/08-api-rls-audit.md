# QA Audit Report 08 — API Routes + RLS Security Audit

**Date:** 2026-04-21
**Auditor:** Claude Code (Opus 4.6)
**Scope:** All 14 API route handlers in `app/api/**`, 6 Supabase migrations, `lib/supabase/admin.ts`, `lib/ratelimit.ts`

---

## 1. Route x Auth Guard x Rate Limit x `as any` Matrix

| Route | Method | Auth Guard | Rate Limit | `as any` | Admin/Cron Auth | Notes |
|---|---|---|---|---|---|---|
| `/api/questions` | GET | supabase.auth.getUser() | None | **YES (line 46)** | -- | `as any` on difficulty cast |
| `/api/questions` | POST | getUser() + x-admin-key | None | No | ADMIN_API_KEY header | -- |
| `/api/questions/random` | GET | supabase.auth.getUser() | None | No | -- | `as DifficultyLevel` cast (safe) |
| `/api/questions/categories` | GET | **NONE** | None | No | -- | **Public endpoint -- no auth** |
| `/api/questions/seed` | POST | x-admin-key only | None | No | ADMIN_API_KEY header | No user auth -- admin-only |
| `/api/questions/seed` | GET | x-admin-key only | None | No | ADMIN_API_KEY header | -- |
| `/api/questions/seed` | PUT | x-admin-key only | None | No | ADMIN_API_KEY header | -- |
| `/api/explain` | POST | supabase.auth.getUser() | **30/min + 200/hr** | No | -- | Two-tier rate limit |
| `/api/challenges` | POST | supabase.auth.getUser() | None | No | -- | -- |
| `/api/challenges/[id]` | GET | supabase.auth.getUser() | None | No | -- | -- |
| `/api/challenges/[id]/result` | POST | supabase.auth.getUser() | None | No | -- | -- |
| `/api/leaderboard` | GET | getUser() called but **not enforced** | None | No | -- | **Unauthenticated access possible** |
| `/api/leaderboard/update` | POST | supabase.auth.getUser() | **60/min** | No | -- | -- |
| `/api/leaderboard/leagues` | GET | getUser() called but **not enforced** | None | No | -- | **Unauthenticated access possible** |
| `/api/leaderboard/leagues` | POST | Bearer CRON_SECRET | None | No | CRON_SECRET | -- |
| `/api/parent` | POST | supabase.auth.getUser() | **5/hr (generate), 10/hr (link)** | No | -- | -- |
| `/api/parent` | GET | supabase.auth.getUser() | **60/min** | No | -- | -- |
| `/api/parent/approve` | POST | supabase.auth.getUser() | **10/min** | No | -- | -- |
| `/api/cron/digest` | POST | Bearer CRON_SECRET | None | No | CRON_SECRET | Uses admin client |

---

## 2. RLS Policy Matrix

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE | Notes |
|---|---|---|---|---|---|---|
| `question_categories` | YES (001) | Everyone (`true`) | None | None | None | Read-only for all |
| `questions` | YES (001) | Everyone (`true`) | None | None | None | Read-only; seed uses service_role |
| `user_question_progress` | YES (001) | Own (`uid()=user_id`) | Own | Own | Own | Full CRUD scoped to user |
| `user_quiz_sessions` | YES (001) | Own (`uid()=user_id`) | Own | Own | Own | Full CRUD scoped to user |
| `quiz_session_answers` | YES (001) | Via session join | Via session join | None | None | Checked via `user_quiz_sessions` FK |
| `profiles` | YES (002) | All authenticated | Own insert | Own update | None | No delete policy -- intentional |
| `user_stats` | YES (002) | All authenticated | Own insert | Own update | None | Leaderboard needs global read |
| `challenges` | YES (004) | Creator + participants | Creator only | Creator only | None | Participant via `challenge_results` join |
| `challenge_results` | YES (004) | Self + creator + peers | Self only | None | None | No update/delete -- intentional |
| `parent_links` | YES (004) | Teen or parent | Teen only | Teen or parent | Teen or parent | |
| `ai_explanations` | YES (004, **006 tightened**) | All authenticated | **DROPPED in 006** | **DROPPED in 006** | None | Writes via service_role only |
| `user_attempts` | YES (004) | Own | Own | Own | None | No delete -- intentional |
| `league_seasons` | YES (004) | All authenticated | None | None | None | Read-only reference data |
| `user_leagues` | YES (004) | Own | Own | Own | None | Leaderboard reads via SECURITY DEFINER RPC |
| `leaderboard_entries` | **VIEW** | Via underlying table policies | N/A | N/A | N/A | View joins profiles + user_leagues |

### RPCs

| Function | SECURITY | Auth Guard | Grant | Notes |
|---|---|---|---|---|
| `increment_weekly_xp(uuid, int, int)` | DEFINER | `auth.uid() <> user_id` raises exception (006) | `authenticated` | Allows service_role (NULL uid) to touch any row |
| `get_random_questions(int, text, text)` | INVOKER (default) | None | None (default = public) | Safe -- questions table is SELECT for all |
| `get_questions_by_difficulty_distribution(int,int,int)` | INVOKER | None | None | Same as above |
| `get_user_weak_areas(uuid)` | INVOKER | None | None | **Accepts arbitrary user_id -- leaks another user weak areas** |
| `handle_new_user()` | DEFINER | Trigger-only (on auth.users INSERT) | N/A | Correctly uses SECURITY DEFINER + `SET search_path` |

---

## 3. Issues Found

### CRITICAL

#### C1 -- `get_user_weak_areas` RPC accepts arbitrary `user_id`, leaking study data
**File:** `supabase/migrations/001_create_questions_tables.sql:320`
**Issue:** The `get_user_weak_areas(p_user_id UUID)` function has no `auth.uid()` guard. Any authenticated user can call `supabase.rpc("get_user_weak_areas", { p_user_id: "<victim_uuid>" })` and see another user per-category accuracy and which questions they struggle with.
**Impact:** PII/study-behavior leak. For a teen-targeted app this is a COPPA/privacy concern.
**Fix:** Add `IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() THEN RAISE EXCEPTION "forbidden"; END IF;` at the top of the function body, mirroring the pattern used in `increment_weekly_xp` (migration 006).

---

### HIGH

#### H1 -- Leaderboard GET has no auth enforcement
**File:** `app/api/leaderboard/route.ts:21`
**Issue:** `getUser()` is called but the result is only used for `isCurrentUser` tagging. If `user` is null, the query still executes and returns all leaderboard entries. An unauthenticated caller can enumerate usernames, display names, avatar URLs, states, XP, and league info.
**Fix:** Add a 401 return if `!user` before the query executes.

#### H2 -- Leaderboard leagues GET has no auth enforcement
**File:** `app/api/leaderboard/leagues/route.ts:14`
**Issue:** Same pattern as H1. `getUser()` is called but not enforced. An unauthenticated request gets league metadata and -- if a season exists -- potentially fails silently but still returns `leagues` and `leagueOrder` static data.
**Fix:** Add the same 401 guard before any DB access.

#### H3 -- Leaderboard update has non-atomic total_xp increment (TOCTOU race)
**File:** `app/api/leaderboard/update/route.ts:72-85`
**Issue:** After the atomic `increment_weekly_xp` RPC, the route does a read-then-write on `user_stats.total_xp`. Two concurrent requests can read the same value and both write `old + xp`, losing one increment. The weekly XP was fixed with an RPC, but total XP still has the same race.
**Fix:** Create an `increment_total_xp` RPC with the same atomic upsert pattern, or extend `increment_weekly_xp` to also bump `user_stats.total_xp` atomically.

---

### MEDIUM

#### M1 -- `challenges/[id]` GET relies on RLS for access control instead of explicit checks
**File:** `app/api/challenges/[id]/route.ts:25-31`
**Issue:** The route has no application-level check that the caller is the creator or a participant. It relies entirely on the `challenges` RLS policy. If RLS is ever misconfigured or bypassed, any authenticated user with a challenge ID could see the full question set. Defense in depth recommends an explicit check.
**Fix:** After fetching the challenge, verify `challenge.creator_id === user.id` or that a `challenge_results` row exists for `user.id`. If neither, return 403.

#### M2 -- `questions/categories` GET is completely unauthenticated
**File:** `app/api/questions/categories/route.ts:14`
**Issue:** This is the only data-returning route with zero auth. While category names are not sensitive, it allows unauthenticated probing of the API and could be used for reconnaissance (how many questions per category, category IDs).
**Fix:** Add `createClient()` + `getUser()` guard, or document this as an intentionally public endpoint.

#### M3 -- `questions/seed` admin key comparison is not timing-safe
**File:** `app/api/questions/seed/route.ts:20`, `app/api/questions/route.ts:122`
**Issue:** `adminKey !== process.env.ADMIN_API_KEY` uses JavaScript `!==` which is vulnerable to timing attacks. An attacker can measure response times to iteratively guess the admin key character by character.
**Fix:** Use `crypto.timingSafeEqual(Buffer.from(adminKey), Buffer.from(process.env.ADMIN_API_KEY))` with a length check first.

#### M4 -- `parent_links` UPDATE policy allows parent to modify `status` column
**File:** `supabase/migrations/004_missing_rls.sql:113-119`
**Issue:** The UPDATE policy on `parent_links` allows both `teen_user_id` and `parent_user_id` to update any column. A malicious parent could directly update `status` from `pending_teen_approval` to `active`, bypassing the teen consent. The application code enforces the state machine, but the RLS policy does not.
**Fix:** Add a BEFORE UPDATE trigger that rejects status changes from non-teen users, or split into two policies: teens can update `status`, parents can only update non-status fields.

#### M5 -- `challenges/[id]/result` POST does not validate score range
**File:** `app/api/challenges/[id]/result/route.ts:27-29`
**Issue:** The route validates that `score`, `correctCount`, and `totalQuestions` are numbers, but does not check bounds. A client can submit `score: 999999`, `correctCount: 100`, `totalQuestions: 10` (correctCount > totalQuestions), or negative values.
**Fix:** Add: `if (score < 0 || score > 100 || correctCount < 0 || correctCount > totalQuestions || totalQuestions <= 0) return 400`.

#### M6 -- `leaderboard/update` does not validate `activityType`
**File:** `app/api/leaderboard/update/route.ts:44`
**Issue:** `activityType` is destructured from the request body and echoed back in the response without validation. While not stored in DB here, it could be used for reflected data injection in a frontend that trusts API responses.
**Fix:** Validate `activityType` against an allowlist of known types, or omit it from the response.

#### M7 -- Cron digest `test_date` exposure (documented, mitigated)
**File:** `app/api/cron/digest/route.ts:66`
**Issue:** The digest fetches `test_date` from the teen profile and includes it in the parent email. The parent link is `active` (teen-consented), so this is intentional. The digest correctly filters `status="active"` so revoked consent stops the data flow. **No action needed** -- documenting for completeness.

---

### LOW

#### L1 -- Remaining `as any` cast in questions route
**File:** `app/api/questions/route.ts:46`
**Issue:** `filter.difficulty = difficulty as any;` -- the prior purge missed this one. The value is already validated via `includes()` check on line 45, so it is safe but not type-clean.
**Fix:** Cast to `DifficultyLevel` instead: `difficulty as DifficultyLevel`.

#### L2 -- `challenges` POST queries `is_active` column not defined in migration 001
**File:** `app/api/challenges/route.ts:29`
**Issue:** `.eq("is_active", true)` -- the `questions` table in migration 001 does not define `is_active`. It exists in `types/database.ts`, suggesting it was added outside migrations (dashboard or unmigrated). If it does not exist in a fresh deployment, this query silently fails.
**Fix:** Add `is_active BOOLEAN NOT NULL DEFAULT TRUE` to the questions table in a new migration.

#### L3 -- `leaderboard/leagues` POST processes users sequentially with N+1 updates
**File:** `app/api/leaderboard/leagues/route.ts:145-174`
**Issue:** Each user league update is an individual `await supabase.from("user_leagues").update(...)` inside a loop. For 1000 users this is 1000 sequential DB calls.
**Fix:** Batch updates by new league tier, or use a single RPC that processes all promotions/demotions in one transaction.

#### L4 -- `parseInt` on query params without NaN guard
**File:** `app/api/questions/route.ts:55`, `app/api/questions/random/route.ts:34`
**Issue:** `parseInt(searchParams.get("limit")!, 10)` can produce `NaN` if the value is not numeric. This would propagate as `NaN` into the filter/slice logic.
**Fix:** Add `|| defaultValue` fallback or explicit `isNaN()` check.

#### L5 -- `explain` route does not validate `questionId` format
**File:** `app/api/explain/route.ts:64`
**Issue:** `questionId` is checked for truthiness but not format. A very long or malicious string would be passed to the Supabase query and the AI prompt.
**Fix:** Validate that `questionId` matches expected format (e.g., starts with `il-`, max length 20).

---

## 4. Positive Observations

- **ai_explanations cache poisoning was correctly identified and fixed** in migration 006 by dropping authenticated-role write policies. The explain route properly uses `createAdminClient()` for cache writes with a best-effort pattern.

- **`increment_weekly_xp` auth.uid() guard** (migration 006) correctly prevents users from mutating other users XP while still allowing service_role/cron to operate.

- **Teen consent state machine** is well-designed: `pending` -> `pending_teen_approval` -> `active`/`rejected`. The parent GET route correctly strips teen PII when status is not `active`. The cron digest correctly filters on `status="active"`.

- **Rate limiting** is thoughtfully applied to abuse-prone endpoints (explain, parent generate/link/approve, leaderboard update) with graceful degradation when Upstash is not configured.

- **Self-linking prevention** in parent POST (line 130) correctly blocks a user from linking to their own account.

- **Double-submission prevention** on challenge results uses the DB UNIQUE constraint + proper 409 handling for error code 23505.

- **Defense in depth** on parent/approve: the `.eq("teen_user_id", user.id)` in the UPDATE WHERE clause ensures only the teen can approve their own link, even if the RLS policy is broader.

- **Admin client** (`lib/supabase/admin.ts`) correctly disables session persistence and auto-refresh, and has clear documentation about when/why it bypasses RLS.

---

## 5. Exploit Scenarios

### Scenario 1 -- Study behavior surveillance via `get_user_weak_areas` (C1)
An attacker with any authenticated account calls:
```js
const { data } = await supabase.rpc("get_user_weak_areas", { p_user_id: "<target_uuid>" });
```
They receive the target per-category accuracy rates and a list of question IDs the target struggles with. Combined with the public questions table, they know exactly what topics the target is weak on. For a teen-targeted app, this is a privacy violation.

### Scenario 2 -- Unauthenticated leaderboard scraping (H1)
An attacker with no account sends:
```
GET /api/leaderboard?limit=50&offset=0
```
They receive usernames, display names, avatar URLs, states, XP, and league data for all users. Repeated with increasing offsets, the full user roster is enumerable.

### Scenario 3 -- Parent bypasses teen consent via direct RLS update (M4)
A parent who knows the Supabase client can directly update their parent_link row:
```js
await supabase.from("parent_links").update({ status: "active" }).eq("parent_user_id", myId);
```
The RLS UPDATE policy allows this because `auth.uid() = parent_user_id` evaluates to true. The teen never approved.

### Scenario 4 -- Total XP inflation via concurrent requests (H3)
An attacker sends 10 simultaneous POST requests to `/api/leaderboard/update` with `xpEarned: 500`. Due to the read-then-write race on `user_stats.total_xp`, they might get 5000 XP credited as total_xp but only 500 weekly_xp (which is atomic). Over time this inflates their level.

---

## 6. Summary

| Severity | Count |
|---|---|
| CRITICAL | 1 |
| HIGH | 3 |
| MEDIUM | 7 |
| LOW | 5 |

**Verdict: REQUEST CHANGES** -- One CRITICAL (C1) and three HIGH issues must be addressed before this API surface is production-ready. The parent consent bypass (M4) should also be prioritized given the teen-user demographic.
