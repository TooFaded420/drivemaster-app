# Security Sweep Report -- DriveMaster

**Date:** 2026-04-21
**Reviewer:** Security Reviewer (Claude Opus 4.6)
**Scope:** Full codebase -- `app/api/**`, `supabase/migrations/*.sql`, `middleware.ts`, `lib/`, `components/providers/`, `next.config.ts`, `vercel.json`, dependencies
**Risk Level:** HIGH

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2     |
| High     | 5     |
| Medium   | 6     |
| Low      | 4     |
| Info     | 3     |
| **Total**| **20**|

---

## Top 10 Findings (Ranked by Severity x Exploitability x Blast Radius)

### 1. [CRITICAL] Open Redirect in Auth Callback

**Severity:** CRITICAL
**Category:** A01 Broken Access Control / CWE-601 Open Redirect
**Location:** `app/auth/callback/route.ts:7,39`
**Exploitability:** Remote, unauthenticated. Attacker crafts: `/auth/callback?code=VALID&next=https://evil.com`
**Blast Radius:** Credential theft via phishing. Supabase exchanges the code, then the server redirects to `evil.com`. Because the redirect comes from the real domain, browser trust indicators reinforce the attack. Especially dangerous for the teen demographic.

**Issue:** The `next` query parameter is used directly in a redirect without origin validation:
```typescript
// BAD (current code)
const next = searchParams.get('next') ?? '/dashboard'
return NextResponse.redirect(`${origin}${next}`)
// Attacker sends: ?next=//evil.com  ->  redirects to evil.com
```

**Remediation:**
```typescript
// GOOD -- validate next is a relative path starting with /
const next = searchParams.get('next') ?? '/dashboard'
const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
return NextResponse.redirect(`${origin}${safePath}`)
```

---

### 2. [CRITICAL] Rate Limiting is a No-Op in Production

**Severity:** CRITICAL
**Category:** A05 Security Misconfiguration
**Location:** `lib/ratelimit.ts:42-46`
**Exploitability:** Remote, unauthenticated/authenticated. Attacker can call any rate-limited endpoint unlimited times.
**Blast Radius:** AI credit exhaustion (`/api/explain`), brute-force invite codes (`/api/parent` -- 6-char hex = 16M combos), XP manipulation (`/api/leaderboard/update`), denial-of-service.

**Issue:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are not set in production. The `createStubLimiter()` always returns `{ success: true }`, making all rate limits decorative. Affected endpoints:

- `POST /api/explain` -- 30/min and 200/hour limits -> no-op
- `POST /api/leaderboard/update` -- 60/min limit -> no-op
- `POST /api/parent` (generate) -- 5/hour -> no-op
- `POST /api/parent` (link) -- 10/hour -> no-op
- `GET /api/parent` -- 60/min -> no-op
- `POST /api/parent/approve` -- 10/min -> no-op

**Remediation:** Deploy Upstash Redis and set env vars in Vercel. Until then, add an in-memory fallback rate limiter.

---

### 3. [HIGH] Prompt Injection in AI Explain Endpoint

**Severity:** HIGH
**Category:** A03 Injection (LLM Prompt Injection)
**Location:** `app/api/explain/route.ts:97-108`
**Exploitability:** Remote, authenticated. User controls `questionText`, `selectedAnswerText`, `correctAnswerText` fields interpolated directly into the LLM prompt.
**Blast Radius:** Override system prompt, generate harmful content, abuse API as general-purpose LLM proxy. Cached results persist the poisoned response for all users via `ai_explanations` table.

**Issue:** User-controlled strings from `request.json()` are interpolated into the prompt with no validation that they match actual question data. An attacker can send arbitrary text.

**Remediation:** Look up question server-side by `questionId` from the `questions` table instead of trusting client-supplied text. Validate `selectedAnswerIndex` is 0-3 and use `question.options[selectedAnswerIndex]`.

---

### 4. [HIGH] No Content-Security-Policy Header

**Severity:** HIGH
**Category:** A05 Security Misconfiguration
**Location:** `next.config.ts:67-91`, `vercel.json` (empty `{}`)
**Exploitability:** Remote. Any XSS vulnerability becomes fully exploitable without CSP as defense-in-depth.
**Blast Radius:** Arbitrary script execution. Third-party script supply chain attacks (GA, Meta Pixel, TikTok, Clarity, PostHog all load external scripts).

**Issue:** `next.config.ts` sets X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy but NOT Content-Security-Policy. `vercel.json` is empty `{}`.

**Remediation:** Add CSP header to `next.config.ts` headers() covering script-src, style-src, font-src, img-src, connect-src, and frame-ancestors.

---

### 5. [HIGH] Next.js 16.1.6 Has Multiple Known Vulnerabilities

**Severity:** HIGH
**Category:** A06 Vulnerable and Outdated Components
**Location:** `package.json` -> `next: 16.1.6`
**Exploitability:** Remote, varies by CVE.
**Blast Radius:** DoS via Server Components (GHSA-q4gf-8mx6-v5v3, CVSS 7.5), HTTP request smuggling (GHSA-ggv3-7p47-pfv8), CSRF bypass via null origin (GHSA-mq59-m269-xvcx), unbounded image disk cache (GHSA-3x4c-7xq6-9pq8).

**Issue:** `npm audit` reports 6 advisories against `next@16.1.6`.

**Remediation:** `npm install next@16.2.4`

---

### 6. [HIGH] Leaderboard API Exposes All Users Data Without Auth

**Severity:** HIGH
**Category:** A01 Broken Access Control
**Location:** `app/api/leaderboard/route.ts:8-69`
**Exploitability:** Remote, unauthenticated. No auth check -- endpoint only optionally reads user for `isCurrentUser` tagging.
**Blast Radius:** Enumeration of all usernames, weekly XP, league status, and user IDs.

**Issue:** The GET handler calls `supabase.auth.getUser()` but does not gate on auth failure. It proceeds to query `leaderboard_entries` regardless.

**Remediation:** Add auth gate: return 401 if `!user` before any data access.

---

### 7. [HIGH] `leaderboard_entries` Table Missing RLS

**Severity:** HIGH
**Category:** A01 Broken Access Control
**Location:** No migration covers `leaderboard_entries` or `leaderboard` tables
**Exploitability:** Remote, authenticated. Any authenticated user can read/write any row via Supabase client SDK directly.
**Blast Radius:** Full read access to all leaderboard data; potential write access to manipulate rankings.

**Issue:** The `leaderboard_entries` table is referenced in `hooks/use-leaderboard.ts` and `app/api/leaderboard/route.ts` but none of the 6 migrations (001-006) create or enable RLS on it.

**Remediation:** Create migration 007 enabling RLS with read-only authenticated policy and no write policies for authenticated role.

---

### 8. [MEDIUM] `increment_xp` RPC Used Without Auth Guard

**Severity:** MEDIUM
**Category:** A01 Broken Access Control
**Location:** `app/api/challenges/[id]/result/route.ts:85`
**Exploitability:** Remote, authenticated. The `increment_xp` RPC (distinct from `increment_weekly_xp`) has no corresponding SQL function in any migration.
**Blast Radius:** Users could potentially increment XP for arbitrary user IDs if the RPC exists without authorization checks.

**Remediation:** Either remove the call or create the RPC with proper `auth.uid()` guard matching migration 006 pattern.

---

### 9. [MEDIUM] Weak CRON_SECRET and ADMIN_API_KEY

**Severity:** MEDIUM
**Category:** A07 Identification and Authentication Failures
**Location:** `.env.local:6-7`
**Exploitability:** Remote if production uses similarly weak values.
**Blast Radius:** Full question database manipulation, league manipulation, sending email to all parents.

**Issue:** `.env.local` contains predictable secrets (`drivemaster-cron-2026-secret`, `drivemaster-admin-2026-key`). If production uses similarly weak values, multiple admin endpoints are vulnerable.

**Remediation:** Generate cryptographically random secrets: `openssl rand -base64 32`

---

### 10. [MEDIUM] `profiles` and `user_stats` SELECT Policies Use `USING (true)`

**Severity:** MEDIUM
**Category:** A01 Broken Access Control
**Location:** `supabase/migrations/002_create_profiles_and_user_stats.sql:50-52,66-68`
**Exploitability:** Remote, authenticated. Any authenticated user can read all profiles and user stats.
**Blast Radius:** Exposure of all user data: usernames, display names, avatar URLs, test dates, onboarding data (JSONB -- may contain PII), XP, levels, streaks, currency.

**Remediation:** Create a SECURITY DEFINER view for leaderboard returning only username + XP; restrict SELECT policy to own rows.

---

## All Findings by Category

### A01: Broken Access Control

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 1 | Open redirect in auth callback | CRITICAL | `app/auth/callback/route.ts:7` |
| 6 | Leaderboard GET has no auth gate | HIGH | `app/api/leaderboard/route.ts` |
| 7 | `leaderboard_entries` missing RLS | HIGH | No migration |
| 8 | `increment_xp` RPC no auth guard | MEDIUM | `app/api/challenges/[id]/result/route.ts:85` |
| 10 | `profiles`/`user_stats` open SELECT | MEDIUM | `migrations/002:50-68` |
| 11 | Challenges: any auth user can read via ID | LOW | `app/api/challenges/[id]/route.ts` |

### A03: Injection

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 3 | LLM prompt injection via user-controlled fields | HIGH | `app/api/explain/route.ts:97-108` |
| 12 | `dangerouslySetInnerHTML` in theme-provider uses prop interpolation | LOW | `components/providers/theme-provider.tsx:148-157` |

### A05: Security Misconfiguration

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 2 | Rate limiting is no-op (Upstash not configured) | CRITICAL | `lib/ratelimit.ts:42-46` |
| 4 | No Content-Security-Policy | HIGH | `next.config.ts`, `vercel.json` |
| 13 | `vercel.json` is empty -- no production security headers | MEDIUM | `vercel.json` |
| 14 | No CORS configuration -- relies on browser same-origin | LOW | N/A |

### A06: Vulnerable and Outdated Components

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 5 | Next.js 16.1.6 -- 6 CVEs including CVSS 7.5 DoS | HIGH | `package.json` |
| 15 | flatted <=3.4.1 -- prototype pollution (HIGH) | MEDIUM | transitive via eslint |
| 16 | minimatch <=3.1.3 -- ReDoS (HIGH) | MEDIUM | transitive via typescript-estree |
| 17 | picomatch <=2.3.1 -- ReDoS (HIGH) | MEDIUM | transitive via vite/vitest |

### A07: Authentication Failures

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 9 | Weak/predictable CRON_SECRET and ADMIN_API_KEY | MEDIUM | `.env.local:6-7` |

### A09: Logging and Monitoring Failures

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 18 | No security event logging | LOW | All API routes |

### A10: SSRF

| # | Finding | Severity | Location |
|---|---------|----------|----------|
| 19 | PostHog proxy rewrite -- no path validation | INFO | `next.config.ts:108-111` |

---

## RLS Matrix

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|-------------|--------|--------|--------|--------|-------|
| `question_categories` | YES | `USING (true)` | - | - | - | Public read. OK. |
| `questions` | YES | `USING (true)` | - | - | - | Public read. Acceptable. |
| `user_question_progress` | YES | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | Properly scoped. |
| `user_quiz_sessions` | YES | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | Properly scoped. |
| `quiz_session_answers` | YES | via session join | via session join | - | - | Properly scoped via FK. |
| `profiles` | YES | **`USING (true)`** | `uid()=id` | `uid()=id` | - | **MEDIUM: open SELECT** |
| `user_stats` | YES | **`USING (true)`** | `uid()=user_id` | `uid()=user_id` | - | **MEDIUM: open SELECT** |
| `challenges` | YES | participants only | `uid()=creator_id` | `uid()=creator_id` | - | Good. |
| `challenge_results` | YES | participants+creator | `uid()=user_id` | - | - | Good. |
| `parent_links` | YES | `uid()=teen OR parent` | `uid()=teen` | `uid()=teen OR parent` | `uid()=teen OR parent` | Good. |
| `ai_explanations` | YES | `USING (true)` | **DROPPED (006)** | **DROPPED (006)** | - | Good after 006. |
| `user_attempts` | YES | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | - | Properly scoped. |
| `league_seasons` | YES | `USING (true)` | - | - | - | Public reference. OK. |
| `user_leagues` | YES | `uid()=user_id` | `uid()=user_id` | `uid()=user_id` | - | Properly scoped. |
| **`leaderboard_entries`** | **NO MIGRATION** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **UNKNOWN** | **HIGH: No RLS** |

---

## npm audit -- HIGH+ CVEs

| Package | Severity | Advisory | CVSS | Fix |
|---------|----------|----------|------|-----|
| `next@16.1.6` | HIGH | GHSA-q4gf-8mx6-v5v3 (DoS via Server Components) | 7.5 | Upgrade to 16.2.3+ |
| `next@16.1.6` | MODERATE | GHSA-mq59-m269-xvcx (null origin CSRF bypass) | - | Upgrade to 16.1.7+ |
| `next@16.1.6` | MODERATE | GHSA-ggv3-7p47-pfv8 (HTTP request smuggling) | - | Upgrade to 16.1.7+ |
| `next@16.1.6` | MODERATE | GHSA-3x4c-7xq6-9pq8 (image cache DoS) | - | Upgrade to 16.1.7+ |
| `next@16.1.6` | MODERATE | GHSA-h27x-g6w4-24gq (postponed resume DoS) | - | Upgrade to 16.1.7+ |
| `flatted<=3.4.1` | HIGH | GHSA-25h7-pfq9-p65f (DoS) + GHSA-rf6f-7fwh-wjgh (Prototype Pollution) | 7.5 | Update flatted |
| `minimatch<=3.1.3` | HIGH | GHSA-3ppc-4f35-3m26 + others (ReDoS) | 7.5 | Update minimatch |
| `picomatch<=2.3.1` | HIGH | GHSA-c2c7-rcm5-vvqj (ReDoS) | 7.5 | Update picomatch |
| `vite@8.0.0-8.0.4` | HIGH | GHSA-v2wj-q39q-566r (server.fs.deny bypass) | - | Update vite |
| `next-intl` | MODERATE | GHSA-8f24-v5vv-gm5j (open redirect) | - | Update to >=4.9.1 |

---

## Secrets Scan

| File:Line | Pattern | Risk |
|-----------|---------|------|
| `.env.local:3` | `eyJ...` (Supabase anon key) | INFO -- Anon keys are public-by-design. Not committed. |
| `.env.local:6` | `CRON_SECRET=drivemaster-cron-...` | MEDIUM -- Predictable value. |
| `.env.local:7` | `ADMIN_API_KEY=drivemaster-admin-...` | MEDIUM -- Predictable value. |
| `__tests__/cron-digest.test.ts:52` | `"re_test_key"` | INFO -- Test fixture, not real. |
| Git history | No `sk-`, `sbp_`, `GOCSPX`, or real API keys | CLEAN |
| `.env*` gitignore | Confirmed: `.env*` pattern in `.gitignore` | CLEAN |

---

## CSRF Analysis

| Endpoint | Method | Auth | CSRF Protection | Status |
|----------|--------|------|-----------------|--------|
| `/api/explain` | POST | Auth required | Next.js same-origin + auth token | OK |
| `/api/questions` | POST | Admin key header | Admin secret | OK |
| `/api/questions/seed` | POST | Admin key header | Admin secret | OK |
| `/api/challenges` | POST | Auth required | Same-origin + auth token | OK |
| `/api/challenges/[id]/result` | POST | Auth required | Same-origin + auth token | OK |
| `/api/leaderboard/update` | POST | Auth required | Same-origin + auth token | OK |
| `/api/leaderboard/leagues` | POST | CRON_SECRET | Secret header | OK |
| `/api/cron/digest` | POST | CRON_SECRET | Secret header | OK |
| `/api/parent` | POST | Auth required | Same-origin + auth token | OK |
| `/api/parent/approve` | POST | Auth required | Same-origin + auth token | OK |

**Note:** Next.js 16.1.6 has GHSA-mq59-m269-xvcx (null origin CSRF bypass for Server Actions). API routes using header-based auth are less affected, but any Server Actions would be vulnerable.

---

## Minor-User (COPPA / BIPA) Posture

| Check | Status | Notes |
|-------|--------|-------|
| Age gate / parental consent for <13 | NOT PRESENT | Target 15-17, but no age verification prevents <13 sign-ups. |
| BIPA (Illinois biometric data) | NOT APPLICABLE | No biometric data collected. |
| PII in client-side errors | CLEAN | Generic error messages only. |
| PII in logs | MEDIUM | `cron/digest/route.ts:148` logs parent email in error message. |
| PostHog `maskAllInputs` | YES | `lib/providers/posthog-provider.tsx:41` |
| Clarity `data-clarity-mask` | DOCUMENTED | Comment instructs adding attribute to PII elements. |
| Session recording on auth pages | DISABLED | PostHog stops on /login, /signup, /auth. Good. |
| Analytics consent | YES | All tracking providers gated on consent. Good. |
| Tracking pixels on auth pages | BLOCKED | GA, Meta, TikTok skip blocked routes. Good. |

---

## Recommendations (Priority Order)

1. **[IMMEDIATE]** Fix auth callback open redirect -- validate `next` param (Finding #1)
2. **[IMMEDIATE]** Deploy Upstash Redis or add in-memory rate limiting fallback (Finding #2)
3. **[URGENT -- 24h]** Upgrade `next` to >=16.2.3 to patch 6 CVEs including CVSS 7.5 DoS (Finding #5)
4. **[URGENT -- 24h]** Add Content-Security-Policy header (Finding #4)
5. **[THIS WEEK]** Server-side question lookup in `/api/explain` to prevent prompt injection (Finding #3)
6. **[THIS WEEK]** Add auth gate to `GET /api/leaderboard` (Finding #6)
7. **[THIS WEEK]** Create RLS migration for `leaderboard_entries` (Finding #7)
8. **[THIS WEEK]** Generate cryptographically random secrets for production (Finding #9)
9. **[THIS MONTH]** Restrict `profiles`/`user_stats` SELECT policies (Finding #10)
10. **[THIS MONTH]** Define or remove `increment_xp` RPC with auth guard (Finding #8)
11. **[THIS MONTH]** Run `npm audit fix` for transitive deps (Findings #15-17)
12. **[THIS MONTH]** Upgrade `next-intl` to >=4.9.1
13. **[BACKLOG]** Add structured security event logging (Finding #18)
14. **[BACKLOG]** Add age verification or COPPA-compliant consent flow

---

## OWASP Top 10 Coverage

| Category | Evaluated | Findings |
|----------|-----------|----------|
| A01 Broken Access Control | YES | 5 findings (1 CRITICAL, 2 HIGH, 2 MEDIUM) |
| A02 Cryptographic Failures | YES | 0 -- Supabase handles JWT signing, passwords via GoTrue |
| A03 Injection | YES | 2 findings (1 HIGH prompt injection, 1 LOW XSS risk) |
| A04 Insecure Design | YES | 0 -- consent flow, challenge expiry are sound |
| A05 Security Misconfiguration | YES | 3 findings (1 CRITICAL, 1 HIGH, 1 MEDIUM) |
| A06 Vulnerable Components | YES | 4 findings (1 HIGH direct, 3 MEDIUM transitive) |
| A07 Auth Failures | YES | 1 finding (MEDIUM -- weak secrets) |
| A08 Integrity Failures | YES | 0 -- no issues found |
| A09 Logging Failures | YES | 1 finding (LOW) |
| A10 SSRF | YES | 1 finding (INFO -- PostHog proxy) |

---

## Security Checklist

- [x] No hardcoded production secrets in source
- [ ] All inputs validated -- **FAIL**: `/api/explain` trusts client-supplied question text
- [x] SQL injection prevention -- all queries use Supabase SDK parameterized queries
- [ ] Authentication on all protected routes -- **FAIL**: `/api/leaderboard` GET has no auth gate
- [ ] Rate limiting enforced -- **FAIL**: Upstash not configured
- [ ] Dependencies audited -- **FAIL**: 5 HIGH severity vulnerabilities
- [x] Session management -- Supabase SSR handles cookie lifecycle
- [ ] Security headers -- **FAIL**: No CSP
- [x] CSRF protection -- Next.js same-origin (caveat: null origin bypass in 16.1.6)
- [x] No PII in client-side errors
