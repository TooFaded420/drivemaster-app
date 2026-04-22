# Full-App Audit — Master Scoreboard

**Date:** 2026-04-21
**Method:** 10 parallel audit lanes (qa-tester + security-reviewer + code-reviewer subagents) via code inspection + live curl against https://drivemaster-app.vercel.app
**Total findings:** 90+
**Branch:** `session/2026-04-21-full-audit`

## Individual lane reports
- [01 new-user journey](01-new-user-journey.md) — **B-** (12 issues, 1 critical)
- [02 returning user + nav](02-returning-user-nav.md) — **C+** (12 tests, 10 failing)
- [03 quiz engine (5 modes)](03-quiz-engine.md) — **practice B / timed D / marathon D / mistakes F / category C**
- [04 leaderboard + streaks](04-leaderboard-streaks.md) — **C+** (21 findings, 2 critical)
- [05 settings + privacy + consent](05-settings-privacy-consent.md) — **B-** (9 tests, 3 failing)
- [06 SEO landing pages](06-seo-landing-pages.md) — **A- to B** across 5 pages
- [07 CSO security sweep](07-security-sweep.md) — **HIGH risk** (20 findings, 2 critical)
- [08 API + RLS audit](08-api-rls-audit.md) — **REQUEST CHANGES** (16 findings, 1 critical)
- [09 design + a11y](09-design-a11y.md) — **REQUEST CHANGES** (WCAG AA blocker on reduced-motion)
- [10 full-site smoke + PWA + parent](10-smoke-pwa-parent.md) — **52/63 pass** (11 failing)

## P0 — Critical (blocking for any real user)

| # | Finding | File | Fix lane |
|---|---|---|---|
| C1 | Quiz sessionStorage only written in Practice — all other modes redirect back to lobby | `app/(quiz)/quiz/{timed,marathon,mistakes,category}/page.tsx` | A |
| C2 | `userId` never passed to useQuiz — zero quiz progress persists for any user | all 5 quiz pages | A |
| C3 | `leaderboard_entries` view queried but never created in any migration — leaderboard silently empty | migrations | C |
| C4 | Dashboard displays mock data only — XP=1,250, streak=5, level=8 for every user | `app/(dashboard)/dashboard/page.tsx:27-48` | C |
| C5 | Open redirect in `/auth/callback` — `?next=//evil.com` enables phishing | `app/auth/callback/route.ts` | B |
| C6 | `get_user_weak_areas` RPC has no `auth.uid()` guard — cross-user privacy leak | `migrations/001_create_questions_tables.sql:320` | A (migration 007) |
| C7 | `window.innerHeight` in Framer Motion animate object crashes on SSR/Strict | `step-complete.tsx:59` | B |

## P1 — High (broken product surface)

| # | Finding | Fix lane |
|---|---|---|
| H1 | `/test`, `/categories`, `/profile` — 3 dead routes linked from dashboard + nav | B+C |
| H2 | Dual-nav rendering on every dashboard page (2 headers, 2 bottom bars) | C |
| H3 | `/settings` + `/onboarding` not in middleware `protectedRoutes` | B |
| H4 | `/api/questions/categories` returns 200 unauth | B |
| H5 | Rate limiting is no-op in prod (Upstash vars missing) | infra — user sets vars |
| H6 | Leaderboard GET has no auth check (full user roster scrapeable) | B |
| H7 | `total_xp` still has read-then-write race (only `weekly_xp` was fixed in migration 003) | A (migration 007) |
| H8 | `/api/leaderboard/update` never called from client — weekly XP RPC never fires | A |
| H9 | Mistakes mode fetches random questions (no wrong-answer branch in useQuiz) | A |
| H10 | Category filter type mismatch (numeric vs string slugs) — all categories return randoms | A |
| H11 | Email signup redirects to `/onboarding` before email verified | B |
| H12 | `fireConversion()` never called anywhere (signup / first-quiz / upgrade all dark) | A+B |

## P2 — Medium (polish + compliance)

- `leaderboard_entries` + `friends` tables absent from migrations (C creates view + friends stub)
- Daily `current_streak` column never written to — cron digest always shows "0 days"
- `vercel.json` empty — no cron wired, league rollover + digest never run
- 6 purple stragglers across `/free-illinois-dmv-practice-test`, `lib/gamification/achievements.ts`, `quiz/category/[id]`
- 8 Framer Motion components (Dash emotions + leaderboard) use `repeat: Infinity` without `useReducedMotion()` — WCAG 2.2.2 / 2.3.3 blocker
- Shadcn default button is h-9 (36px) — below 44px floor across entire app
- Favicon 404s — `layout.tsx` references PNG paths that don't exist on disk (only SVGs shipped)
- Privacy policy sub-processor table missing Meta Pixel / TikTok Pixel / Google Analytics (3 active pixels undisclosed)
- Parent can flip `status='active'` directly via Supabase client (RLS UPDATE policy too permissive)
- 3 of 5 SEO pages have wrong canonical URLs hardcoded (`getdrivemaster.com` / `drivemaster.app`, neither live)
- Next.js 16.1.6 has 6 CVEs (fix at 16.2.4)
- No CSP header anywhere
- `questions.is_active` column used in challenges but never created in migration 001
- Orange #F97316 on white fails WCAG AA 4.5:1 for small text (ratio ~3.0:1)
- `/login?error=auth-code-error` doesn't show the error
- Clarity has no blocked-routes list (unlike Meta/TikTok/GA which block auth routes)
- Consent revocation doesn't call SDK revoke APIs (already-loaded pixels keep running)
- `grant()` fires `$pageview` synchronously before `opt_in_capturing()` — race
- ImageObject JSON-LD on `/illinois-road-signs-test` uses fragment anchors as `contentUrl`
- Zero internal cross-linking between 5 SEO pages (kills topical clustering)
- 5 nav landmarks missing `aria-label` across landing + SEO pages
- Hero video ignores `prefers-reduced-motion`
- 1 remaining `as any` cast at `app/api/questions/route.ts:46`
- Admin key comparisons not timing-safe

## P3 — Low (nice-to-have)

- Skip link `#main` target too broad (skips nothing meaningful on dashboard pages)
- No forgot-password flow anywhere
- confirmPassword field show/hide toggle wired to wrong field
- Login page missing Dash mascot
- Keyboard-shortcut modal not a real dialog (`<div>` with no `role="dialog"`, `aria-modal`, or focus trap)
- `⌘` symbol shown on Windows (should be `Ctrl`)
- `targetScore` from onboarding StepGoals silently discarded
- Assessment desktop Next button skips without requiring answer selection
- Unselected answer text uses `text-gray-600` + `opacity-60` — effective contrast ~2.2:1
- `/api/questions/random` count query param has no max cap (DoS risk)
- Daily Goal progress bar animation not gated on reduced-motion
- `synthetic.new` listed as sub-processor with no provider in lib/providers/

## Fix lane assignments

**Lane A — Quiz engine:** C1, C2, C6, H7, H8, H9, H10, H12 — one PR touching `hooks/use-quiz.ts`, 5 quiz pages, migration 007.

**Lane B — Security + routes:** C5, C7, H1 (partial), H3, H4, H6, H11, CSP — touches `app/auth/callback/route.ts`, `middleware.ts`, 3 API routes, 2 onboarding pages, signup/login, new `/profile` stub, `next.config.ts`.

**Lane C — Data + dashboard + leaderboard:** C3, C4, H1 (partial), H2 — touches migration 008, `dashboard/page.tsx`, `mobile-layout.tsx`, possibly `hooks/use-leaderboard.ts`.

## Not in scope for this fix PR (tracked for follow-up)

- Daily persistent streak writer (`user_stats.current_streak` fill logic — needs cron + quiz-end write)
- Cron jobs not wired (`vercel.json` empty)
- Reduced-motion gate on 8 Framer Motion components (Dash variants + leaderboard)
- Next.js 16.2.4 upgrade (breaks need testing)
- Daily quests UI (schema doesn't exist yet)
- SEO canonical URL fix (needs decision on final domain — drivemaster.co vs drivemasterapp.com)
- Privacy policy sub-processor table update
- Default shadcn button h-9 → h-11 (risk of layout regressions across app)
- Favicon PNG generation or metadata cleanup
- 6 purple stragglers (scoped in their own mini-pass)

## What "ready for a real user" looks like

After Lanes A + B + C land and this PR merges:
- Every quiz mode completes and persists progress
- Leaderboard renders real data
- Dashboard shows real XP/streak/accuracy
- `/auth/callback?next=` is phishing-safe
- `/profile` is reachable (stub)
- OAuth new-signup conversion fires
- Email signup shows confirmation-required state
- Duplicate nav bars on dashboard gone
- 5 endpoint auth holes closed
- CSP header in place

After that: daily streak writer + cron + P2 cleanup + Next.js CVE patch before any real scale / ads.
