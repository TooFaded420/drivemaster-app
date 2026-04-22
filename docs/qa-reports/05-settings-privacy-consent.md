# QA Report 05 — Settings, Privacy Policy & Analytics Consent

**Date:** 2026-04-21
**Auditor:** QA Agent (static code review; tmux not available in environment)
**Scope:** Settings page, AnalyticsConsentToggle, Privacy Policy, consent provider, PostHog/Meta/TikTok/GA/Clarity pixel providers, fireConversion wire-up

---

## Overall Grade: **B-**

Core consent architecture is sound and privacy-first defaults are correct. Grade is held down by three concrete issues: a consent race condition in `grant()`, `fireConversion` not wired at any real callsite, and a COPPA enforcement gap that remains open with a TODO in code.

---

## TC1 — Settings Page Renders, AnalyticsConsentToggle Mounted

**File:** `app/(dashboard)/settings/page.tsx`

**Findings:**
- Page is a pure Server Component (no `"use client"`). `AnalyticsConsentToggle` is imported and placed in the Privacy card. Correct.
- Account section shows "Profile management coming soon." — no editable fields exist. No regression risk; just a stub.
- Notifications section shows "Notification preferences coming soon." — same.
- `MobileLayout` wraps the page — consistent with other dashboard pages.
- No draft banner present.

**Status:** PASS — toggle is mounted, page renders correctly as designed, stubs clearly marked.

---

## TC2 — AnalyticsConsentToggle Copy and Privacy Link

**File:** `components/analytics-consent-toggle.tsx`

**Findings:**
- Copy is inclusive: "Share anonymous usage data" / "Help us make DriveMaster better" / "No names, no answers — just clicks and timing." No teen-exclusive language; removed per the in-file comment (COPPA age-gate deferred — documented).
- Privacy link `href="/privacy"` present and correct.
- Toggle state reads `consent === "granted"` — correctly shows `false` for both `"unknown"` and `"denied"`.
- `grant()` and `deny()` called on `onCheckedChange` — correct wiring.
- `aria-label` on Switch is correct.

**Status:** PASS — copy is inclusive, link is correct, toggle maps state cleanly.

---

## TC3 — Privacy Policy: Section Count and Draft Banner

**File:** `app/privacy/page.tsx`

**Findings:**
- All 11 sections present: (1) Who we are, (2) Signup data, (3) Quiz data, (4) Analytics, (5) Never collect, (6) Parental link, (7) Sub-processors, (8) Retention, (9) COPPA/BIPA, (10) Rights, (11) Contact.
- No draft banner in the rendered JSX.
- `LAST_UPDATED` constant is `"2026-04-21"` — current date. Good.
- `privacy@drivemaster.app` appears in sections 1, 4, 8, 10, 11. `hello@drivemaster.app` appears in section 11. These email addresses are present as intended per the audit scope ("flag still there") — they are structural contacts, not placeholders to remove.

**Status:** PASS on section count and draft banner. Email addresses confirmed present (by design).

---

## TC4 — Sub-processor Table Accuracy

**File:** `app/privacy/page.tsx` (section 7)

**Listed sub-processors:** Supabase, Vercel, Resend, synthetic.new, PostHog, Microsoft Clarity.

**Discrepancies:**
- **Meta Pixel** (`lib/providers/meta-pixel.tsx`) and **TikTok Pixel** (`lib/providers/tiktok-pixel.tsx`) and **Google Analytics** (`lib/providers/google-analytics.tsx`) are all installed and can fire when `consent === "granted"`. None of these three are listed in the sub-processor table.
- Section 4 ("Analytics") only mentions PostHog and Microsoft Clarity as optional analytics tools. Meta, TikTok, and GA are unmentioned throughout the privacy policy.
- `synthetic.new` is listed as an AI wrong-answer explanation sub-processor — no corresponding provider file exists in `lib/providers/`; this appears to be a future integration but is declared in the policy as current.

**Status:** FAIL — Three active pixel providers (Meta, TikTok, GA4) absent from the sub-processor table and from the policy narrative. This is a material accuracy gap: the policy says "we use two optional analytics tools" (PostHog + Clarity) but three additional tracking pixels are wired and ready to fire on consent grant.

---

## TC5 — Consent Provider: Default 'unknown' Treated as Denied, Hydration Safety

**File:** `lib/providers/analytics-consent.tsx`

**Findings:**
- Initial state is `"unknown"` (line 40). All pixel providers guard on `consent !== "granted"` — `"unknown"` therefore fires no pixels. Correct default-deny posture.
- Hydration uses `useEffect` + `Promise.resolve().then(() => setConsent(...))` (lines 47-58). The micro-task deferral means hydration lands after the first render, so pixels are never fired SSR-side. The SSR safety intent is met.
- `grant()` persists `"granted"` to `localStorage` synchronously, then fires `posthog.capture("$pageview")` with a `"posthog" in window` guard (lines 61-76).
- `deny()` persists `"denied"` — no cleanup of existing posthog session (see TC7 below).
- Only `"granted"` and `"denied"` are accepted from localStorage on hydration; invalid/stale values are silently ignored. Safe.

**RACE CONDITION — CONFIRMED:**
`grant()` calls `posthog.capture("$pageview")` synchronously at line 72-75. At the moment the user flips the toggle, `PostHogInit`'s `useEffect` (which guards on `consent !== "granted"`) has not yet run — React state updates are batched asynchronously. If PostHog has not been initialised yet (first consent grant in the session), `posthog.__loaded` is `false`, `window.posthog` does not exist, and the `"posthog" in window` guard saves the call from crashing. However: if PostHog _was_ previously loaded (e.g. the user denied, page reloaded, then re-granted without a full page reload — edge case but real), `window.posthog` is present but `opt_out_capturing()` may have been called. The `$pageview` fires before `opt_in_capturing()` runs inside PostHog's `useEffect`. This is the race the prior eng review flagged. The guard prevents a hard crash but does not guarantee the event actually reaches PostHog's servers correctly.

**Status:** PARTIAL PASS — Default-deny and SSR safety are correct. Race condition exists in `grant()` as flagged.

---

## TC6 — PostHog Provider: Consent + Key Guard, Auth Route Recording Disabled

**File:** `lib/providers/posthog-provider.tsx`

**Findings:**
- Init guard: `if (!POSTHOG_KEY || consent !== "granted") return;` (line 32). Both conditions required. Correct.
- `posthog.__loaded` checked before re-init to prevent duplicate initialisation. Correct.
- `disable_session_recording: isAuthRoute(pathname)` set at init time (line 45). Correct for the init call.
- Second `useEffect` (lines 51-58): calls `posthog.stopSessionRecording()` when navigating to auth routes, `startSessionRecording()` on non-auth routes when consent is granted. Correct.
- Third `useEffect` (lines 61-70): calls `posthog.opt_out_capturing()` when consent is not granted, `opt_in_capturing()` when granted. This is the mechanism that _should_ run before `grant()` fires `$pageview` — but as noted in TC5, the React state flush order is not guaranteed.
- `PHProvider` short-circuits entirely if `NEXT_PUBLIC_POSTHOG_KEY` is falsy (lines 76-80). Correct.
- `AUTH_ROUTES` covers `/login`, `/signup`, `/auth` — does not cover `/settings` or `/privacy`. This is acceptable since those are not credential-entry pages.

**Status:** PASS — all guards present and logic is correct in isolation. The race risk originates in the consent provider, not here.

---

## TC7 — Meta Pixel, TikTok Pixel, Google Analytics: Consent + Env Gate

**Files:** `lib/providers/meta-pixel.tsx`, `lib/providers/tiktok-pixel.tsx`, `lib/providers/google-analytics.tsx`

**Findings:**
- All three return `null` if their respective env var is unset OR `consent !== "granted"` OR the current route is in `BLOCKED_ROUTES`. Triple guard is correct.
- `BLOCKED_ROUTES` for all three: `["/login", "/signup", "/auth", "/privacy", "/settings"]` — settings and privacy pages are explicitly blocked, which is good.
- On `consent = "denied"` or `"unknown"`, the Script tags are not injected because the component returns `null` — no pixel fires. Correct.
- **Revocation gap:** When consent is revoked (toggle turned off), `deny()` sets state to `"denied"` and re-renders remove the Script tags. However, the pixel scripts are already loaded into the page's `<head>` from a prior grant. The `fbq`, `ttq`, and `gtag` globals remain in `window`. There is no `fbq('consent', 'revoke')`, `ttq.disableCookie()`, or gtag consent-mode revocation call. Revoking consent stops new page fires but does not signal to the pixel SDKs to stop their internal tracking. This is a medium-severity compliance gap.
- GA config uses `anonymize_ip: true`. Correct.
- **Clarity** (`lib/providers/clarity-script.tsx`) has only a two-condition guard (consent + CLARITY_ID), no blocked-routes list. The Clarity script will fire on `/login` and `/signup` if consent is granted and CLARITY_ID is set. Clarity's privacy policy is cited in section 4 (form field masking), but auth routes are not blocked — inconsistent with the three pixel providers.

**Status:** PARTIAL PASS — Consent gate works for new injections. Revocation does not signal active pixel SDKs. Clarity lacks the auth-route block that the other three providers implement.

---

## TC8 — fireConversion Wire-up at Key Funnel Events

**File:** `lib/analytics.ts` (definition), `app/auth/callback/route.ts` (only reference)

**Findings:**
- `fireConversion` is fully implemented for three conversion types: `signup_completed`, `first_quiz_completed`, `upgrade_clicked` (lines 103-153 in analytics.ts). All four pixel targets handled (Meta, TikTok, GA4, PostHog). Consent-gated. Safe to call.
- **`signup_completed`:** The auth callback (`app/auth/callback/route.ts`) detects new OAuth users via profile `created_at` heuristic and redirects to `/onboarding?new_signup=true`. The TODO comment at lines 18-21 explicitly notes that `fireConversion('signup_completed')` must be read from the `?new_signup=true` param and fired from the onboarding page. The onboarding page (`app/(onboarding)/onboarding/page.tsx`) does **not** read `searchParams`, does not import `fireConversion`, and does not call it anywhere. The wire-up is completely missing.
- **`first_quiz_completed`:** No callsite exists anywhere in `app/` — confirmed by codebase-wide grep. The quiz completion flow is not instrumented.
- **`upgrade_clicked`:** No callsite exists. No paywall or upgrade UI was found in scope.
- Email/password signup flow (non-OAuth) has no conversion detection path at all — the auth callback is OAuth-only.

**Status:** FAIL — `fireConversion` is installed but not wired at any live callsite. Three conversion events (`signup_completed`, `first_quiz_completed`, `upgrade_clicked`) are all dark. The `?new_signup=true` redirect exists but the consuming callsite in onboarding was never written.

---

## TC9 — COPPA Gap: Age Verification TODO

**Files:** `lib/providers/analytics-consent.tsx` (line 7-9), `app/privacy/page.tsx` (section 4, section 9), `components/analytics-consent-toggle.tsx` (lines 7-9)

**Findings:**
- `analytics-consent.tsx` comment: "TODO: gate grant() behind age verification when implemented."
- Privacy policy section 4 states: "Honest note: we currently rely on copy (not a technical age gate) to discourage users under 13."
- Privacy policy section 9: "If you are under 13, do not use DriveMaster." — copy-only enforcement.
- `AnalyticsConsentToggle` comment acknowledges the "under 16" eligibility line was removed because age-gate is not implemented.
- There is no age-collection field anywhere in the onboarding or signup flow.
- Any user — including a child under 13 — can sign up and grant analytics consent with zero friction.

**Status:** FAIL (known, open) — COPPA enforcement is copy-only. No technical age gate exists. This is acknowledged in the codebase with a TODO. The privacy policy is honest about this limitation, which mitigates legal risk slightly, but the gap remains open.

---

## Summary

| # | Test Case | Status |
|---|-----------|--------|
| TC1 | Settings page renders, toggle mounted | PASS |
| TC2 | AnalyticsConsentToggle copy + privacy link | PASS |
| TC3 | Privacy policy: 11 sections, no draft banner | PASS |
| TC4 | Sub-processor table accuracy | FAIL |
| TC5 | Consent provider: default-deny, SSR safety, race condition | PARTIAL PASS |
| TC6 | PostHog: consent+key guard, auth route recording | PASS |
| TC7 | Meta/TikTok/GA/Clarity: consent+env gate, revocation | PARTIAL PASS |
| TC8 | fireConversion wire-up at funnel events | FAIL |
| TC9 | COPPA age verification TODO | FAIL (known) |

**Total:** 9 | **Pass:** 3 | **Partial:** 2 | **Fail:** 3 (1 known/open)

---

## Issues Requiring Engineering Action

### ISSUE-05-A (HIGH) — fireConversion not wired at signup_completed
- **File:** `app/(onboarding)/onboarding/page.tsx`
- The auth callback sets `?new_signup=true` and redirects to `/onboarding`. The onboarding page never reads this param or calls `fireConversion('signup_completed')`. All signup conversions are silently dropped — Meta Lead, TikTok CompleteRegistration, GA4 event, and PostHog capture all fire zero times.
- **Fix:** In `OnboardingPage`, read `useSearchParams()` for `new_signup=true` on mount, call `fireConversion('signup_completed')`, then replace the URL to strip the param. Also instrument `first_quiz_completed` at the quiz results callsite.

### ISSUE-05-B (HIGH) — Sub-processor table missing Meta Pixel, TikTok Pixel, Google Analytics
- **File:** `app/privacy/page.tsx` (section 7), and section 4 narrative
- Three pixel providers are installed and fire on consent grant. None appear in the sub-processor table. Section 4 says "two optional analytics tools" which is factually incorrect if any of these env vars are set in production.
- **Fix:** Add Meta, TikTok, Google Analytics rows to the sub-processor table. Update section 4 narrative to say "up to five optional analytics tools" or similar. Alternatively gate the table rows behind an env-var check if these pixels are not yet active in production.

### ISSUE-05-C (MEDIUM) — grant() fires $pageview before posthog.opt_in_capturing() runs
- **File:** `lib/providers/analytics-consent.tsx` lines 71-75
- `grant()` is synchronous. It calls `posthog.capture("$pageview")` immediately. `PostHogInit`'s `useEffect([consent])` which calls `posthog.opt_in_capturing()` runs after the React render cycle. If PostHog was previously opted-out (prior deny), the $pageview fires while opt-out is still active.
- **Fix:** Remove the inline `posthog.capture("$pageview")` from `grant()`. Instead, fire the backfill pageview inside `PostHogInit`'s `useEffect` after `posthog.opt_in_capturing()` completes — this guarantees sequencing. Alternatively, rely on `capture_pageview: "history_change"` which is already configured and will capture the next navigation automatically.

### ISSUE-05-D (MEDIUM) — Pixel revocation does not signal SDK consent-mode APIs
- **Files:** `lib/providers/meta-pixel.tsx`, `lib/providers/tiktok-pixel.tsx`, `lib/providers/google-analytics.tsx`
- Removing the Script tag stops future injections but the pixel SDKs already loaded in the session continue running. On revocation, `fbq('consent', 'revoke')`, `ttq.disableCookie()`, and `gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' })` should be called.
- **Fix:** Add a `useEffect([consent])` in each pixel provider that calls the SDK's consent-mode revocation API when `consent !== "granted"`.

### ISSUE-05-E (MEDIUM) — Clarity not blocked on auth routes
- **File:** `lib/providers/clarity-script.tsx`
- Meta, TikTok, and GA all block `/login`, `/signup`, `/auth`. Clarity does not. Clarity session recording could capture auth-page interactions (though form masking is enabled).
- **Fix:** Add `BLOCKED_ROUTES` check identical to the other three providers.

### ISSUE-05-F (LOW/OPEN) — COPPA age gate is copy-only
- **Files:** `lib/providers/analytics-consent.tsx`, `app/privacy/page.tsx`
- No technical age verification exists. The TODO in `analytics-consent.tsx` is the canonical tracker. The policy is transparent about this limitation.
- **Action:** No immediate code change required. Eng ticket tracking the age-gate implementation should be linked from the TODO comment. Policy language is already appropriately hedged.

### ISSUE-05-G (LOW) — synthetic.new listed as active sub-processor without a provider
- **File:** `app/privacy/page.tsx` (section 7)
- `synthetic.new` appears in the sub-processor table with no corresponding implementation in `lib/providers/` or any import in `app/`. Either the integration is not yet built (policy is premature) or it exists elsewhere.
- **Fix:** Verify whether synthetic.new is live in production. If not, add a note "(coming soon)" or remove the row until launch.

---

## Environment Notes

- tmux was not available in the QA execution environment; all findings are based on static code analysis.
- Runtime behavior of toggle state persistence and pixel firing was assessed through code logic tracing, not live browser interaction.
- No `.env` file was read — pixel env vars are assumed unset in dev, which is the safe default.
