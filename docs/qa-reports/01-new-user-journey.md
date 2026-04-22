# QA Report: New-User Journey
**Date:** 2026-04-21
**Auditor:** QA Agent (code inspection + live curl)
**Branch:** session/2026-04-21-full-audit
**Production URL:** https://drivemaster-app.vercel.app

---

## Summary

**Health Grade: B-**

The core happy path is functional: pages return HTTP 200, form fields are present and typed correctly, Google OAuth is wired up, the onboarding state persists to Supabase on every step, and the final step redirects to `/dashboard`. However there are two high-severity logic gaps—one silent (the `?new_signup=true` conversion event is never consumed) and one that causes a **runtime crash** on the confetti animation in Step 6—plus several medium and low issues around UX dead-ends, copy tone, and a missing "forgot password" flow.

---

## Bugs Found

### CRITICAL

#### BUG-001 — `window.innerHeight` access in SSR/initial render causes potential crash
- **File:** `app/(onboarding)/onboarding/step-complete.tsx:59`
- **Severity:** Critical (runtime crash on cold hydration in some environments)
- **Description:** The confetti `animate` prop accesses `window.innerHeight` directly inside a Framer Motion `animate` object that is evaluated during render:
  ```tsx
  animate={{
    y: window.innerHeight + 40,   // ← evaluated at render time
    ...
  }}
  ```
  `window` is unavailable during server-side rendering. Although this component is inside a `"use client"` file and Next.js defers execution, the value is read synchronously when the module first evaluates in a React Server Components boundary context. In practice this will throw `ReferenceError: window is not defined` on any edge-runtime or static prerender invocation. Even in a pure client render, if React strict-mode double-invokes the render, the value may be `undefined` on the first pass and produce a `NaN` animation target, silently breaking the effect.
- **Fix direction:** Use `useEffect` + `useState` to capture `window.innerHeight` after mount, or replace with a fixed large pixel value (e.g., `2000`).

---

### HIGH

#### BUG-002 — `?new_signup=true` query param is emitted by `/auth/callback` but never consumed
- **File:** `app/auth/callback/route.ts:34` (emitter); `app/(onboarding)/onboarding/page.tsx` (missing consumer)
- **Severity:** High (conversion tracking / analytics gap)
- **Description:** The callback route correctly redirects OAuth new-users to `/onboarding?new_signup=true`. The TODO comment in the route (lines 17–21) explicitly notes that the onboarding page should read this param on mount and call `fireConversion('signup_completed')`, then strip the param. The onboarding `page.tsx` has **no `useSearchParams` import, no `new_signup` read, and no conversion event call**. The param passes through unobserved and stays in the URL until the user navigates away.
- **Impact:** Every Google OAuth new signup goes untracked. Email signups also do not fire the conversion event (they redirect directly to `/onboarding` without the param, so even if the consumer were implemented, email signups would still be missed).
- **Fix direction:** Add `useSearchParams` to `onboarding/page.tsx`, read `new_signup` in a `useEffect`, call `fireConversion('signup_completed')`, and replace the URL with `router.replace('/onboarding')` to strip the param.

#### BUG-003 — Email signup pushes to `/onboarding` before email is verified
- **File:** `app/(auth)/signup/page.tsx:56`
- **Severity:** High (UX / data integrity)
- **Description:** After `supabase.auth.signUp()` succeeds, the code immediately calls `router.push("/onboarding")`. With Supabase's default email-confirmation flow enabled, the user is **not yet authenticated** at this point—the session is not established until the email confirmation link is clicked. The onboarding layout (`app/(onboarding)/layout.tsx:13`) will redirect the unauthenticated user back to `/login`, silently dropping them from the onboarding flow. There is no "check your email" interstitial shown.
- **Evidence:** The signup page HTML confirms no confirmation-pending state is rendered (visible text ends at "Create Account / Already have an account? Sign in").
- **Fix direction:** Check `supabase.auth.signUp()` response: if `data.session === null`, show a "Check your email to confirm your account" message instead of redirecting to onboarding.

---

### MEDIUM

#### BUG-004 — `/login?error=auth-code-error` silently ignores the `error` query param
- **File:** `app/(auth)/login/page.tsx` (entire file)
- **Severity:** Medium (UX dead-end)
- **Description:** When `/auth/callback` receives an invalid or missing `code`, it redirects to `/login?error=auth-code-error`. The login page does **not** read `searchParams` or `useSearchParams`, so no error message is shown to the user. They land on a blank login page with no explanation of what went wrong.
- **Live evidence:** `curl -sL "https://drivemaster-app.vercel.app/login?error=auth-code-error"` returns the same page HTML as a plain `/login` visit. Visible text: "Welcome back / Enter your credentials to continue studying / Sign in with Google".
- **Fix direction:** Read `searchParams.error` (or `useSearchParams().get('error')`) and render a descriptive `Alert` when `error === 'auth-code-error'`.

#### BUG-005 — Assessment step: user can get stuck with no forward CTA until they select an answer
- **File:** `app/(onboarding)/onboarding/step-assessment.tsx:228`
- **Severity:** Medium (UX dead-end)
- **Description:** The "Next Question" / "See Results" button only renders after `showExplanation` is true, which only becomes true after the user selects an answer. The outer onboarding page's desktop "Next" button (`page.tsx:294`) calls `onboarding.goToNextStep()` unconditionally. If the user clicks the outer "Next" on desktop before selecting an answer in the assessment step, they skip past assessment without recording any data, which means `assessmentScore` remains 0 on `step-complete.tsx:43`.
- **Fix direction:** Disable the outer "Next" button when `currentStep` is the assessment step and the assessment sub-component has not yet called `onComplete`.

#### BUG-006 — Desktop "Skip" available on last step (StepComplete) has no guard
- **File:** `app/(onboarding)/onboarding/page.tsx:154–165`
- **Severity:** Medium
- **Description:** The desktop header only hides the Skip button when `!isLastStep`. However, `isLastStep` is computed as `onboarding.currentStep === ONBOARDING_STEPS.length - 1` (index 5 = `complete`). The `StepComplete` component auto-calls `onComplete()` after 500 ms via `useEffect`. During that 500 ms window the Skip button is correctly hidden. This is fine, but the mobile bottom nav (`page.tsx:229–238`) renders `null` for the Skip slot only when `isLastStep`—meaning if a user somehow lands on the last step and the auto-complete hasn't fired yet, they have no visible issue on mobile. No action required beyond confirming the 500 ms race is acceptable.

#### BUG-007 — `StepGoals` `targetScore` selected value is never persisted
- **File:** `app/(onboarding)/onboarding/step-goals.tsx:29–39`
- **Severity:** Medium (silent data loss)
- **Description:** `handleSubmit` only persists `testDate` and `dailyGoal`. The `targetScore` field—which the user explicitly selects from `TARGET_SCORE_OPTIONS`—is stored only in local `formData` state and is never passed to `updateData()` or `onComplete()`. The value is silently discarded on step completion.
- **Fix direction:** Include `targetScore: formData.targetScore` in both `updateData()` and `onComplete()` calls.

---

### LOW

#### BUG-008 — Login page missing "Forgot password?" link
- **File:** `app/(auth)/login/page.tsx`
- **Severity:** Low (missing feature / UX gap)
- **Description:** No forgot-password route exists anywhere in the app (`grep` across all `.tsx` files returns no results for "forgot" or "reset-password"). A locked-out user has no recovery path beyond contacting support. This is especially impactful for the target teen demographic who may set a password, forget it, and churn.

#### BUG-009 — Signup page label for "Email" field missing — rendered as generic `<Label>`
- **File:** `app/(auth)/signup/page.tsx:100`
- **Severity:** Low (accessibility)
- **Description:** The `Email` label is present in source (`<Label htmlFor="email">Email</Label>`) and the live HTML confirms it renders. However the **visible text from the live page** shows the label text "Email" is absent from the extracted text run — the label renders but the input placeholder says "you@example.com", not the label value. On closer inspection the label text IS "Email" but it is sandwiched between the Google button and the form such that screen reader order may be non-linear. No native `<form>` wraps the Google button, and the email/password inputs are in a separate `<form>`. Not a breaking bug but warrants an accessibility pass.

#### BUG-010 — `confirmPassword` field shows `type="password"` but has no show/hide toggle
- **File:** `app/(auth)/signup/page.tsx:147–155`
- **Severity:** Low
- **Description:** The password field (line 115–137) has an Eye/EyeOff toggle button. The confirmPassword field does not. The `showPassword` toggle controls both fields' visibility (line 117: `type={showPassword ? "text" : "password"}`) but only the main password field shows the toggle button. The confirm field always remains type="password". Users who toggle "show password" on the first field will see their password in plain text but cannot verify the confirm field independently.
- **Fix direction:** Either add a separate toggle to confirmPassword, or bind both fields to the same `showPassword` state (which is already the case in code—the real bug is that the confirm field is hard-coded to `type="password"` instead of using `showPassword`).

---

## Broken Links / Dead Buttons

| Location | Element | Issue |
|----------|---------|-------|
| `/login` page | No "Forgot password?" link | No route exists; users have no password-recovery path |
| `/login?error=auth-code-error` | Error param ignored | Page renders normally, no error shown — user has no context |
| `/auth/callback` (no `?code=`) | Redirect to login | Works correctly (redirects to `/login?error=auth-code-error`) but the error is then silently swallowed by the login page (see BUG-004) |

---

## Copy / Tone Issues (DESIGN.md Violations)

DESIGN.md specifies: **"Dash tone: Hype-beast friend. Never say 'incorrect.' Max 3 sentences. One emoji max."**

### TONE-001 — Step Complete uses generic placeholder copy
- **File:** `app/(onboarding)/onboarding/step-complete.tsx:114`
- **Copy:** `"Welcome to DriveMaster, Driver!"`
- **Issue:** "Driver" reads as a generic placeholder — it should use the user's display name collected in StepProfile. The `data` prop is available and contains `data.displayName`, but `step-complete.tsx` does not reference it for the greeting.
- **Fix:** `"Welcome to DriveMaster, {data.displayName || 'Driver'}!"`

### TONE-002 — Assessment feedback says "Don't worry" (low-energy, not hype-beast)
- **File:** `app/(onboarding)/onboarding/step-assessment.tsx:88–90`
- **Copy:** `"You scored ${score}%. Don't worry - that's why we're here to help you improve!"`
- **Issue:** "Don't worry" is a soft reassurance phrase inconsistent with the hype-beast Dash voice. DESIGN.md says "Never say 'incorrect'" and the spirit is to keep energy high. Also exceeds the one-emoji limit — the `speechTitle` uses "Good Effort! 💪" and the text itself has no emoji, which is fine individually, but the combined message is 2 sentences and low-energy.
- **Fix suggestion:** `"You scored ${score}%! We've got your weak spots mapped — let's go fix 'em 💪"`

### TONE-003 — Signup page CardDescription is plain/flat
- **File:** `app/(auth)/signup/page.tsx:79`
- **Copy:** `"Create your account and start crushing practice questions"`
- **Issue:** This is fine in tone but the `CardTitle` already has the emoji (`🔥`) and the description is a second sentence. The combined title+description is 2 sentences, 1 emoji — technically within limits, but the description reads like marketing copy rather than Dash's voice. Minor.

### TONE-004 — Login page has no Dash mascot (DESIGN.md: mascot-driven)
- **File:** `app/(auth)/login/page.tsx`
- **Issue:** The signup page shows `<Dash emotion="excited" />` prominently. The login page omits the mascot entirely. DESIGN.md describes the product as "mascot-driven" and "personality-driven." Returning users see a cold, generic credential form. This is a design consistency gap, not a functional bug.

---

## Recommendations

1. **[Critical] Fix `window.innerHeight` in `step-complete.tsx`** — replace with a constant or a `useEffect`-gated state value. This is the only issue that can cause a hard runtime error.

2. **[High] Implement `?new_signup=true` consumer in `onboarding/page.tsx`** — the executor left a clear TODO. Implement `useSearchParams`, fire the conversion event, and strip the param.

3. **[High] Add email-confirmation interstitial to signup** — detect `data.session === null` after `signUp()` and render a "Check your email" screen instead of blindly pushing to `/onboarding`.

4. **[Medium] Show error on `/login?error=auth-code-error`** — one `useSearchParams` hook and one `Alert` component resolve this.

5. **[Medium] Persist `targetScore` from StepGoals** — two-line fix in `handleSubmit`.

6. **[Medium] Guard assessment's outer "Next" button** — expose a completion signal from the assessment step to the parent onboarding page.

7. **[Low] Add "Forgot password?" link to login page** — at minimum, link to the Supabase password-reset flow.

8. **[Low] Fix `confirmPassword` field to respect `showPassword` toggle** — change hard-coded `type="password"` to `type={showPassword ? "text" : "password"}`.

9. **[Design] Personalize StepComplete greeting with `data.displayName`**.

10. **[Design] Add Dash mascot to login page** for brand consistency.
