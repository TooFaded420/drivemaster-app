# QA Report 03 — Quiz Engine
**Date:** 2026-04-21
**Auditor:** QA Tester (code inspection + live API curl)
**Branch:** master
**Production URL:** https://drivemaster-app.vercel.app

---

## 1. Environment

| Item | Value |
|---|---|
| Method | Static code inspection + live `Invoke-WebRequest` against production |
| Auth scope | Anonymous (no session cookie) |
| Files inspected | app/(quiz)/quiz/page.tsx, practice/page.tsx, timed/page.tsx, marathon/page.tsx, mistakes/page.tsx, category/[id]/page.tsx, results/page.tsx, components/quiz/\*.tsx, hooks/use-quiz.ts, app/api/questions/\*.ts, app/api/explain/route.ts, app/api/leaderboard/update/route.ts |

---

## 2. Quiz Lobby — `app/(quiz)/quiz/page.tsx`

### 2.1 Mode Cards

| Mode | Expected `href` | Actual `href` | Status |
|---|---|---|---|
| Quick Practice | /quiz/practice | /quiz/practice | PASS |
| Timed Test | /quiz/timed | /quiz/timed | PASS |
| Marathon Mode | /quiz/marathon | /quiz/marathon | PASS |
| Review Mistakes | /quiz/mistakes | /quiz/mistakes | PASS |

**Note:** There is no fifth "category" mode card in `quizModes[]`. Category is surfaced as a separate `<section>` grid below. The lobby therefore presents 4 mode cards + 4 category shortcuts = 8 interactive entries. Scope said "5 mode cards" — if the category grid entry is counted as the fifth mode, routing is PASS; there is no single "Category" card linking to `/quiz/category`.

### 2.2 Palette / Design System

No `purple`, `violet`, `#7C3AED`, `#8B5CF6`, or `#6D28D9` found in `quiz/page.tsx`. All icon bg colors use blue, red, orange, yellow, green — within DESIGN.md palette. **PASS.**

Quick Stats cards use `from-blue-50 to-blue-100`, `from-orange-50 to-orange-100`, `from-green-50 to-green-100`. Compliant.

Daily Goal banner uses `from-blue-600 to-blue-700`. Compliant.

### 2.3 Touch Targets

Mode cards: icon container is `w-12 h-12` (48px). Category cards: icon container `w-10 h-10` (40px) — **4px below the 44px minimum**. **FAIL — category icon containers are 40px.**

The wrapping `<Link><Card>` tap area covers the full card, so actual tap target is safe in practice. However the icon element itself does not meet the 44px spec in isolation.

### 2.4 Reduced-Motion

`useReducedMotion()` is imported and applied at line 189:
```
transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.1 }}
```
Applied to both mode cards and category cards. **PASS.**

Daily Goal progress bar animation (`animate={{ width: "75%" }}`) is **not gated** on `shouldReduceMotion`. **FAIL — one motion element ignores prefers-reduced-motion.**

### 2.5 Hardcoded Stats

Quick Stats values (Quizzes: 12, Streak: 5, Accuracy: 78%) and Daily Goal (15/20) are all **hardcoded constants**. They are never loaded from Supabase or any user state hook. **CRITICAL FINDING — lobby stats are fake and do not reflect real user data.**

---

## 3. Per-Mode Pages

### 3.1 Practice (`/quiz/practice`) — Grade: B

- Question loading: calls `useQuiz({ quizType: "practice", questionCount: 10 })` which fetches `/api/questions/random?count=10`. Correct.
- Results stored in `sessionStorage` before router push to `/quiz/results`. Correct.
- No `userId` passed to `useQuiz` — all Supabase write paths (`user_attempts`, `user_wrong_answers`, `quiz_sessions`) are skipped silently. User progress is **never persisted** unless `userId` is threaded. **FINDING.**
- Error boundary with "Try Again" button: present. **PASS.**
- `completeQuiz()` is exposed but only called from `QuizControls`. The results `useEffect` calls `router.push("/quiz/results")` after 3 s; if the user never calls `completeQuiz()` (e.g., closes the explanation card on the last question without advancing), `quiz.results` is null and `sessionStorage` is never written, sending the results page to `/quiz` with a toast. **FINDING.**

### 3.2 Timed (`/quiz/timed`) — Grade: B-

- Question count: 35. Timer: 45 minutes (`timeLimit * 60 = 2700 s`). Pass threshold: 28 correct. All match Illinois DMV spec. **PASS.**
- Timer logic (lines 114–136 of use-quiz.ts): `setInterval` ticks every 1 s. When `timeRemaining <= 0`, calls `completeQuiz()` inside a `setState` updater — **this is a stale-closure bug**. `completeQuiz` is declared as a `useCallback` that closes over `state`, but the callback inside `setState((prev) => { completeQuiz(); return ... })` calls the closure-captured `completeQuiz`, not one that sees the latest `prev`. In practice the quiz will complete but XP will be calculated against potentially stale `state.answers`. **CRITICAL FINDING.**
- Time warning at 5 minutes: implemented correctly with a 10-second window (`< 300 && > 290`). Could miss the window if the component re-renders skip a tick, but acceptable.
- `animate-pulse` on the "Time Running Out!" badge is not gated on `shouldReduceMotion`. Minor violation.
- `sessionStorage` write is **missing** in timed mode's completion `useEffect`. Practice writes it at line 76–78; timed mode's completion `useEffect` (lines 60–87) calls `router.push("/quiz/results")` after 3 s but never writes `sessionStorage`. **CRITICAL BUG — results page will receive null and redirect back to /quiz.**

### 3.3 Marathon (`/quiz/marathon`) — Grade: C

- `questionCount: 100` is passed but the hook overrides to `1000` at line 145: `String(quizType === "marathon" ? 1000 : questionCount)`. Requests 1000 questions, gets however many exist in the static bank (197 total across all categories from the categories endpoint counts). No infinite loop — it is bounded by the question bank size. **PASS for termination.**
- Progress bar uses `progressPercentage = (currentQuestionIndex / questions.length) * 100` — this reaches 100% only after answering the very last question because the index hasn't advanced past the last. Minor UX issue.
- "Take a Break" reminder fires at every multiple of 25 using `quiz.currentQuestionIndex % 25 === 0` with `quiz.currentQuestionIndex > 0`. This re-renders on every state change; it will show on question 25, 50, 75... but also flicker if the component re-renders while on those indices without advancing. Acceptable.
- **sessionStorage write missing** — same as timed mode. The completion `useEffect` (lines 61–77) never writes `sessionStorage`. Results page will redirect to `/quiz`. **CRITICAL BUG.**

### 3.4 Mistakes (`/quiz/mistakes`) — Grade: D

- `useQuiz({ quizType: "mistakes", questionCount: 20 })` is called. In `loadQuestions()` (hooks/use-quiz.ts lines 138–188), there is **no branching on `quizType === "mistakes"`**. The `mistakes` type is treated identically to `practice`: it fetches `/api/questions/random?count=20` — completely random questions, not the user's wrong answers.
- The `user_wrong_answers` table is written to during `submitAnswer` when `!isCorrect`, but it is **never queried** when loading questions for mistakes mode. The Supabase `user_wrong_answers` table is populated but ignored by this flow.
- Result: "Review Mistakes" always shows 20 random questions for any user, including new users who have never answered anything. The empty-state check (`quiz.questions.length === 0`) will never trigger because random questions always load. **CRITICAL BUG — entire mode is non-functional.**
- **sessionStorage write missing** — same as timed/marathon. Results page will redirect. **CRITICAL BUG.**

### 3.5 Category (`/quiz/category/[id]`) — Grade: C+

- `categoryId` from URL params is parsed via `parseInt(params.id as string)` — expects a numeric ID (e.g., `/quiz/category/1`). The lobby links are `href={/quiz/category/${category.id}}` where `category.id` is a **number** (1–4). However, the data layer uses **string** category IDs (e.g., `"traffic-laws"`, `"traffic-signs"`).
- In `useQuiz`, `params.set("category", String(categoryId))` sends `"1"` or `"2"` to `/api/questions/random`. The API's random route filters `pool.filter(q => q.category_id === category)` which compares string `"traffic-laws"` to `"1"` — **this always fails and returns the full unfiltered question pool**. Category filtering is silently broken. **CRITICAL BUG.**
- `CATEGORY_INFO` map in category/[id]/page.tsx has entry for `id: 5` with `color: "text-purple-600"` — **off-brand purple**. DESIGN.md forbids purple. **FINDING.**
- `CATEGORY_INFO` also has entry for `id: 6` with `color: "text-pink-600"` — not in DESIGN.md palette. **FINDING.**
- Empty-state handling is present. **PASS.**
- **sessionStorage write missing** — no write before results redirect. **CRITICAL BUG.**

---

## 4. Component Audits

### 4.1 QuestionCard (`components/quiz/question-card.tsx`)

- Image rendering: uses a real `<img>` tag (not Next.js `<Image>`) with `onError={() => setImgError(true)}` fallback to `<ImageIcon>`. Previous broken state is fixed. **PASS.**
- Flag button: `aria-label` is set correctly ("Flag this question" / "Unflag this question"). SVG has `aria-hidden="true"` and `focusable="false"`. **PASS.**
- No keyboard shortcuts implemented beyond the flag button's natural keyboard focusability. No `accessKey` or shortcut hints. Acceptable per spec.
- Question text transitions use `AnimatePresence` + `motion.div`. No `shouldReduceMotion` gate on this specific transition. Minor.

### 4.2 AnswerOptions (`components/quiz/answer-options.tsx`)

| Criterion | Finding | Status |
|---|---|---|
| `role="radiogroup"` on container | Present at line 50 | PASS |
| `role="radio"` on each option | Present on `<motion.button>` at line 86 | PASS |
| `aria-checked` on each option | `aria-checked={isSelected}` at line 89 | PASS |
| Arrow key navigation | `handleKeyDown` wraps with `ArrowDown`/`ArrowRight`/`ArrowUp`/`ArrowLeft` at lines 36–47 | PASS |
| Contrast — unselected options | `text-gray-700` on white background | PASS (4.7:1) |
| Contrast — post-answer unselected | `text-gray-600` with `opacity-60` on white | **FAIL — effective contrast ~2.2:1, below 4.5:1 WCAG AA** |
| Disabled state after answering | `disabled={isAnswered}` at line 91 | PASS |

Arrow-key navigation: refs use `useRef<(HTMLButtonElement | null)[]>([])` correctly. Focus wraps around (modulo). **PASS.**

Note: `<motion.button>` with `role="radio"` is technically valid but some AT may announce it oddly. Low risk.

### 4.3 ExplanationCard (`components/quiz/explanation-card.tsx`)

| Criterion | Finding | Status |
|---|---|---|
| Never says "incorrect" | Wrong-answer label is "Not quite" (line 48) | PASS |
| Emoji count <= 1 | No emoji in component source (emojis come from mascot speech strings, not this card) | PASS |
| Dash tone (hype-beast, max 3 sentences) | Card is static text; AI explanation via `/api/explain` enforces tone via system prompt | PASS |
| Retry CTA | No retry CTA within explanation card itself | FINDING |

The explanation card has no action button. Users must use `QuizControls` to advance. The scope asked for a "retry CTA" — none exists. **FINDING.**

Motion: `initial={{ opacity: 0, y: 10 }}` with no `shouldReduceMotion` gate. Minor.

### 4.4 StreakIndicator (`components/quiz/streak-indicator.tsx`)

| Criterion | Finding | Status |
|---|---|---|
| Tier 10+ uses orange-to-red gradient | `bg-gradient-to-br from-orange-500 to-red-500 text-white` at line 26 | PASS |
| Tier 7–9 | `bg-red-100 text-red-700` — distinct from tier 10+ | PASS |
| Tier 5–6 | `bg-orange-100 text-orange-700` | PASS |
| Tier 2–4 | `bg-yellow-100 text-yellow-700` | PASS |
| Pulse animation gated on reduced-motion | `streak >= 5 && !shouldReduceMotion` at line 46 | PASS |
| Flame wobble gated on reduced-motion | `streak >= 3 && !shouldReduceMotion` at line 59 | PASS |

StreakIndicator is the most complete reduced-motion implementation in the quiz engine. **All criteria PASS.**

---

## 5. Results Page (`app/(quiz)/quiz/results/page.tsx`)

| Criterion | Finding | Status |
|---|---|---|
| Redirect when sessionStorage empty | `loadResults()` returns null → `useEffect` calls `router.push("/quiz")` with toast | PASS |
| Toast message | "Your results expired — let's run it back. 🔁" — one emoji, Dash tone | PASS |
| Score calc correctness | `accuracy = Math.round((correctAnswers / answers.length) * 100)` in `completeQuiz()` — uses actual answered count, not `questions.length` | PASS |
| XP animation | Counter animates from 0 to `totalXP` over 2 s via `setInterval` | PASS |
| fireConversion call | **NOT PRESENT in results page or use-quiz hook** | CRITICAL FINDING |
| `/api/leaderboard/update` call | **NOT CALLED anywhere in the quiz client flow** | CRITICAL FINDING |
| Streak update in results | **NOT CALLED** — `user_stats` streak field is never updated from results | FINDING |

**Critical:** `fireConversion('first_quiz_completed')` is defined in `lib/analytics.ts` with a `ConversionName` type that includes `"first_quiz_completed"`, but it is never called from the quiz results page, `use-quiz.ts`, or any results-adjacent code. Meta Pixel `StartTrial` and TikTok `ViewContent` events are never fired on quiz completion.

**Critical:** `/api/leaderboard/update` is never called from the client quiz flow. Weekly XP increments via the atomic `increment_weekly_xp` RPC will never execute post-quiz. The leaderboard will show stale XP for all users unless another code path (not found in this audit) calls it.

---

## 6. API Surface — Anonymous Auth Enforcement

| Endpoint | Expected | Actual HTTP | Status |
|---|---|---|---|
| GET /api/questions | 401 | 401 | PASS |
| GET /api/questions/random | 401 | 401 | PASS |
| GET /api/questions/categories | 401 (scope expectation) | **200** | FINDING |
| POST /api/explain | 401 | 401 | PASS |
| POST /api/leaderboard/update | 401 | 401 | PASS |
| GET /api/leaderboard | Should return data or 401 | **500** | FAIL |

**Finding — /api/questions/categories returns 200 anonymously.** The route has no auth check (by design — category names don't include answers). This may be intentional but the scope listed it as an endpoint that "requires auth." Recommend documenting the intentional exception.

**Critical — GET /api/leaderboard returns HTTP 500 anonymously.** The route calls `supabase.from("leaderboard_entries").select(...)` without auth. The `leaderboard_entries` table likely has RLS that prevents anon reads, causing a Supabase error that surfaces as a 500 instead of a 401. The route never checks auth before querying, so the error is swallowed into a generic 500. Callers cannot distinguish auth failure from server error. **BUG.**

---

## 7. State Management Findings

### 7.1 Session Loss on Refresh

All quiz state lives in `useState` in `use-quiz.ts`. There is no persistence to `localStorage` or `sessionStorage` during an active quiz. Refreshing mid-quiz loses all answers and restarts the fetch. No warning is shown. **FINDING.**

### 7.2 Race Condition — Timer + completeQuiz

In timed mode, when the timer reaches 0 it calls `completeQuiz()` from inside a `setState` updater. `completeQuiz` is a `useCallback` that closes over the entire `state` object at the time the callback was last created. The timer's `setInterval` holds a stale closure of `completeQuiz` (from `useEffect` line 114 whose deps are `[state.timeLimit, state.timeRemaining, state.isComplete]`). If the user answers a question at the exact moment the timer fires, `completeQuiz()` may execute with stale `state.answers` — omitting the final answer from XP and score calculation. **CRITICAL FINDING.**

### 7.3 Mistakes Mode Does Not Query User Data

Described in section 3.4. The `user_wrong_answers` table is written but never read during question loading. Entire mode is non-functional.

### 7.4 userId Never Passed

All five quiz page components instantiate `useQuiz(...)` without a `userId` option. The hook's Supabase write paths (lines 226–289) are all guarded by `if (userId)` and will never execute. User attempts, wrong answers, and session records are never persisted. **CRITICAL FINDING.**

---

## 8. XP Fire Conditions — Suspect Paths

| Condition | Expected | Actual |
|---|---|---|
| Quiz completes → fire `first_quiz_completed` conversion | `fireConversion('first_quiz_completed')` | Never called |
| Quiz completes → POST `/api/leaderboard/update` | XP lands in leaderboard | Never called |
| Quiz completes → update `user_stats.total_xp` | Supabase write via `useQuiz.completeQuiz()` | Only if `userId` is passed (it never is) |
| Perfect quiz (100%) → `perfectBonus` XP | Calculated in `calculateXP()` | Calculated locally but never persisted |
| Timed quiz times out → XP calculated | `completeQuiz()` called from timer | Called, but from stale closure (see §7.2) |

---

## 9. Per-Mode Grades

| Mode | Grade | Primary Reason |
|---|---|---|
| Practice | B | Works end-to-end but userId never passed; no persistence |
| Timed | D | sessionStorage never written (results page always redirects); timer stale-closure bug |
| Marathon | D | sessionStorage never written; question count capped at bank size (ok), but results broken |
| Mistakes | F | Fetches random questions instead of user's wrong answers; entire premise non-functional |
| Category | C | Routing works but category ID type mismatch means filter is always ignored; purple color in CATEGORY_INFO |

---

## 10. Summary

| Severity | Count | Items |
|---|---|---|
| Critical | 8 | sessionStorage missing (timed, marathon, mistakes, category); mistakes mode always random; userId never passed; timer stale-closure race; leaderboard/update never called |
| High | 3 | lobby stats hardcoded; fireConversion never fired; /api/leaderboard 500 on anon |
| Medium | 3 | category ID type mismatch silently returns unfiltered questions; answer option contrast post-answer; /api/questions/categories has no auth |
| Low | 4 | lobby daily-goal motion not reduced; quiz icon 40px < 44px; explanation card no retry CTA; purple/pink in CATEGORY_INFO |

---

## 11. Test Case Evidence

| TC | Command / Observation | Expected | Actual | Verdict |
|---|---|---|---|---|
| TC-01 | GET https://drivemaster-app.vercel.app/api/questions (no cookie) | 401 | 401 | PASS |
| TC-02 | GET /api/questions/random (no cookie) | 401 | 401 | PASS |
| TC-03 | GET /api/questions/categories (no cookie) | 401 per scope | 200 | FINDING |
| TC-04 | POST /api/explain body={"questionId":"q1","selectedAnswerIndex":0} (no cookie) | 401 | 401 | PASS |
| TC-05 | POST /api/leaderboard/update body={"xpEarned":10} (no cookie) | 401 | 401 | PASS |
| TC-06 | GET /api/leaderboard (no cookie) | 401 or data | 500 | FAIL |
| TC-07 | Code: results/page.tsx `loadResults()` with null sessionStorage | redirect to /quiz | router.push("/quiz") + toast | PASS |
| TC-08 | Code: timed/page.tsx completion useEffect | write sessionStorage | not present | FAIL |
| TC-09 | Code: mistakes/page.tsx — loadQuestions for quizType="mistakes" | fetch user_wrong_answers | fetch random questions | FAIL |
| TC-10 | Code: category/[id] — categoryId=1 → API param | filter for category id "1" | compares "1" vs "traffic-laws" → no match | FAIL |
| TC-11 | Code: StreakIndicator — streak >= 10 color | orange→red gradient | bg-gradient-to-br from-orange-500 to-red-500 | PASS |
| TC-12 | Code: StreakIndicator — reduced-motion pulse gate | gated | `!shouldReduceMotion` guard present | PASS |
| TC-13 | Code: AnswerOptions — role attributes | radiogroup + radio + aria-checked | all present | PASS |
| TC-14 | Code: ExplanationCard — "incorrect" string | never present | "Not quite" used instead | PASS |
| TC-15 | Code: fireConversion after quiz complete | called in results or use-quiz | not found in any client quiz file | FAIL |
| TC-16 | Code: leaderboard/update call after quiz complete | called in use-quiz or results | not found | FAIL |

---

## 12. Cleanup
- No tmux sessions created (tmux not available in shell environment; static code inspection + live HTTP used instead)
- No artifacts left on disk beyond this report
