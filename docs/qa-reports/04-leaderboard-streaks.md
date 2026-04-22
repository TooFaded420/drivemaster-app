# QA Report 04 — Leaderboard, Leagues & Streak Systems

**Date:** 2026-04-21
**Auditor:** QA Tester (static analysis)
**Scope:** leaderboard page, leaderboard API routes, `use-leaderboard.ts`, streak logic in quiz hooks, migrations 003/006, league seasons, privacy

---

## Overall Grade: C+

The architecture is well-designed and the atomic-XP and auth-guard fixes from migrations 003/006 are solid. However several critical gaps prevent a higher grade: the two database views the entire UI depends on (`leaderboard_entries`, `friend_leaderboard`) are never created in any migration; the daily streak (`current_streak` / `longest_streak`) is never written back to `user_stats` after a quiz; and there is no cron job wired to process weekly league resets. These are not latent risks — they are runtime failures for any user who actually plays.

---

## 1. Data Integrity Risks

### RISK-01 (Critical): `leaderboard_entries` and `friend_leaderboard` views do not exist in any migration

Both `hooks/use-leaderboard.ts` and `app/api/leaderboard/route.ts` query a table/view called `leaderboard_entries`. `use-leaderboard.ts` line 230 also queries `friend_leaderboard`. Neither is defined anywhere across all six migrations. The migrations create `profiles`, `user_stats`, `user_leagues`, `league_seasons`, `challenges`, `challenge_results`, `parent_links`, `ai_explanations`, and `user_attempts` — but no leaderboard projection. Every tab on the leaderboard page (global, league, state) will return a Supabase "relation does not exist" error, and the friends tab will also error. The page falls to the error branch silently (hook catches and sets `error` state but the UI does not surface an error message — it simply renders empty tables with the loading skeleton having already resolved).

**Files:** `supabase/migrations/` (all six), `hooks/use-leaderboard.ts:186,230,274,319`, `app/api/leaderboard/route.ts:24`

### RISK-02 (High): XP race condition on `user_stats.total_xp` survives

Migration 003 fixed the race on `user_leagues.weekly_xp` via an atomic `INSERT … ON CONFLICT DO UPDATE`. However `app/api/leaderboard/update/route.ts:72-84` still uses a read-then-write pattern for `user_stats.total_xp`:

```ts
const { data: userStats } = await supabase.from("user_stats").select("total_xp")…
await supabase.from("user_stats").update({ total_xp: userStats.total_xp + xpEarned })…
```

Two concurrent quiz completions from the same user can produce a lost update. The same pattern appears in `hooks/use-quiz.ts:428-440` and `hooks/quiz/use-quiz-submission.ts:195-210`. The RPC fix was applied only to the league path; `total_xp` is unprotected. A companion `increment_total_xp` RPC or a Postgres `UPDATE user_stats SET total_xp = total_xp + $1` is needed.

### RISK-03 (High): No active season causes silent XP drop

`increment_weekly_xp` (migration 006 lines 80-87) raises an exception `'No active league season'` when no season row matches `is_active = TRUE AND week_start <= now AND week_end >= now`. The API route at `app/api/leaderboard/update/route.ts:63-68` catches the RPC error and returns HTTP 500. Any XP earned during a gap between seasons is silently lost from the weekly leaderboard. There is no fallback upsert and no user-facing message. This also means first-run environments with no seeded season will reject all XP updates.

### RISK-04 (Medium): League process endpoint has an N+1 write loop

`app/api/leaderboard/leagues/route.ts:145-173` iterates every user in every league tier and fires an individual `supabase.from("user_leagues").update(…).eq("user_id", user.user_id)` per user. For a league with 200 participants this is 200 sequential round-trips inside a single HTTP handler. This will time out on Vercel's 10-second serverless limit before processing completes. A single bulk `UPDATE … SET … WHERE user_id = ANY($1)` or an RPC is required.

### RISK-05 (Medium): Season boundary mismatch — week starts on Sunday in UI, Monday in cron

`lib/gamification/leagues.ts:343-349` (`getCurrentWeekStart`) calculates Monday as the week start. `getNextWeeklyReset` (line 333-337) targets the next Sunday midnight. The `POST /api/leaderboard/leagues` cron endpoint (lines 184-196) also recalculates the new season start as Monday and end as Sunday+6. These are consistent with each other. However `formatTimeUntilReset` counts down to Sunday midnight, while the actual season `week_end` stored in the DB is the value inserted at cron time (Sunday 23:59:59). There is a ~1 minute window each Sunday where `getNextWeeklyReset` has already passed but `week_end` has not yet expired. During this window `is_active = TRUE` queries return no season, causing RISK-03.

---

## 2. Streak Logic Audit

### Streak increments on correct answers only — PASS

`hooks/use-quiz.ts:205`: `const newStreak = isCorrect ? state.currentStreak + 1 : 0` — correct answers increment, wrong answers reset to zero. Consistent with `hooks/quiz/use-quiz-state.ts:51-53` which uses identical logic in `markAnswered`.

### Streak resets on wrong answer only — PASS (in-session)

Both quiz state implementations reset `currentStreak` to 0 on any wrong answer. This is unconditional across all quiz types (practice, timed, marathon).

### `currentStreak` vs `longestStreak` tracked separately — PASS

`use-quiz.ts:206`: `const newMaxStreak = Math.max(state.maxStreak, newStreak)` — `maxStreak` is updated independently from `currentStreak`. Both are tracked throughout the session.

### RISK-06 (Critical): Streak does NOT survive page refresh — FAIL

`user_stats` has `current_streak` and `longest_streak` columns (migration 002 lines 34-35). Neither is ever written in any quiz completion path:

- `hooks/use-quiz.ts:428-440`: updates only `total_xp`
- `hooks/quiz/use-quiz-submission.ts:195-210`: updates only `total_xp`
- No API route updates `current_streak` or `longest_streak`

`current_streak` in `user_stats` represents the **daily login/activity streak** (evidenced by `last_activity_date` column alongside it and the cron digest at `app/api/cron/digest/route.ts:88` which reads `current_streak` as "days"). The in-session streak (`currentStreak` / `maxStreak` in quiz state) is a per-quiz correct-answer run counter, stored only in React state and saved to `quiz_sessions.streak_count` at completion.

The distinction is valid, but there is a separate problem: `current_streak` (daily streak) is never incremented anywhere. No API route or migration updates it on login or quiz completion. `last_activity_date` is never written either. The daily streak will always read 0 for every user.

### RISK-07 (Medium): `maxStreak` (not `currentStreak`) passed to XP calculator

`hooks/use-quiz.ts:363`: `streakCount: state.maxStreak` — the best streak of the session is used for XP bonuses, not the final streak. This is intentional design (reward peak performance), but means a user who hit 10-in-a-row then got several wrong still receives the full streak bonus. This may or may not match product intent; it is worth a product decision.

---

## 3. Privacy Exposure

### RISK-08 (Medium): Profiles SELECT policy uses `USING (true)` — all profile columns readable by any authenticated user

Migration 002 line 50-52 creates:
```sql
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);
```

The `profiles` table contains: `username`, `display_name`, `avatar_url`, `state`, `test_type`, `test_date`, `onboarding_completed`, `onboarding_step`, `onboarding_data` (JSONB).

The leaderboard itself only surfaces `username`, `display_name`, and `avatar_url` (see `leaderboard-row.tsx:96-126` — only these fields are rendered). However any authenticated user can issue `SELECT * FROM profiles` via the Supabase client and retrieve `test_date`, `onboarding_data`, and `test_type` for all users. `onboarding_data` is a JSONB blob whose contents are unspecified but likely contains answers to onboarding questions (test date, skill level, etc.).

`user_stats` has an identical open SELECT policy (migration 002 line 66-68), exposing `total_xp`, `current_streak`, `longest_streak`, `streak_freezes`, and `miles_currency` for all users. For a leaderboard these fields are expected to be public, but the policy should be narrowed to only the columns actually needed for the leaderboard, or a dedicated view should be used.

The flagged concern from the previous review is confirmed and unchanged.

### RISK-09 (Low): `user_leagues` SELECT policy is correctly scoped, but leaderboard fetch bypasses it

Migration 004 creates `USING (auth.uid() = user_id)` on `user_leagues`. This is correct for individual row access. However `hooks/use-leaderboard.ts:269-310` (`fetchLeagueLeaderboard`) queries `leaderboard_entries` filtered by `current_league`, not `user_leagues` directly, so the tight policy on `user_leagues` does not create a functional problem — provided `leaderboard_entries` view exists and is constructed with appropriate column projection.

---

## 4. Missing Features / Deferred Work

### MISSING-01: `leaderboard_entries` view not created (blocks entire leaderboard)

See RISK-01. This is the most pressing missing piece. The view needs to join `profiles`, `user_stats`, and `user_leagues` filtered to the active season and project only safe columns.

### MISSING-02: `friend_leaderboard` view not created (blocks friends tab)

Same as above for the friends tab. Requires a join through a `friends` table (referenced in `hooks/use-leaderboard.ts:363-388`) which is also not present in any migration.

### MISSING-03: No cron job wired for weekly league processing

`vercel.json` is empty (`{}`). The `POST /api/leaderboard/leagues` endpoint which handles promotions/demotions is documented as "called by a cron job" but no Vercel cron configuration exists. Without it, `is_active` seasons never close, `weekly_xp` is never reset, and promotions/demotions never fire. The `useLeagueChanges` hook's promotion/demotion modal logic (`hooks/use-leaderboard.ts:668-677`) will never trigger in production.

### MISSING-04: No cron job for daily streak update

`current_streak` and `last_activity_date` in `user_stats` are never written. A daily activity check to increment or reset the streak does not exist anywhere in the codebase.

### MISSING-05: Friends table not in any migration

`hooks/use-leaderboard.ts:363` queries `FROM friends`. No migration creates this table, no RLS policy protects it. This is a second unresolved schema gap alongside the two leaderboard views.

### MISSING-06: `Share Your Rank` button is a no-op

`app/(dashboard)/leaderboard/page.tsx:248` renders a `Share Your Rank` button with no `onClick` handler. It will click and do nothing.

### MISSING-07: No pagination in UI

The API route supports `limit` and `offset` with `hasMore` in the response. The `LeaderboardTable` component has a "Show More / Show Less" toggle but it only slices the already-fetched `entries` array client-side. There is no "load next page" call to the API. The hook fetches a fixed limit of 50-100 rows and that is the ceiling.

---

## 5. Performance Concerns

### PERF-01 (High): N+1 write loop in league processing endpoint

Documented as RISK-04. Up to 200+ sequential DB round-trips inside a single serverless function invocation.

### PERF-02 (Medium): League leaderboard rank calculation is O(n) in application code

`app/api/leaderboard/leagues/route.ts:43-53` fetches all `user_leagues` rows for a league tier (`SELECT user_id, weekly_xp … ORDER BY weekly_xp DESC`), loads them all into memory, then does a `findIndex` to compute the current user's rank. For large leagues this is an unbounded memory allocation. A `RANK() OVER (ORDER BY weekly_xp DESC)` window function in a view or RPC would be O(1) at the application layer.

### PERF-03 (Medium): No caching in `use-leaderboard` hook

The hook uses raw `useState` + `useEffect` with no cache layer. Every mount of the leaderboard page triggers 4 concurrent Supabase queries (global, friends, league, state) plus 2 additional queries (season, user league). React Query or SWR with a stale-while-revalidate TTL (60 seconds is reasonable for a leaderboard) would reduce Supabase read usage significantly.

### PERF-04 (Low): `isLoading` is a logical OR of four sub-states

`hooks/use-leaderboard.ts:617-621`: `const isLoading = global.isLoading || friends.isLoading || league.isLoading || state.isLoading`. The page spinner stays up until all four tabs have resolved, even though only the active tab (default: "league") is visible. Each tab could manage its own loading state independently.

### PERF-05 (Low): No indexes defined for leaderboard query patterns

No migration adds indexes on `user_leagues(season_id, current_league, weekly_xp)` or `profiles(state)`. The leaderboard queries filter and order by these columns. On a table with thousands of rows, sequential scans will degrade response times.

---

## 6. Additional Findings

### FIND-01: `useLeagueChanges` hook fires uncached on every mount

`hooks/use-leaderboard.ts:654-722`: The hook makes 2-3 Supabase queries on mount (user_leagues, league_seasons, leaderboard_entries) to decide whether to show modals. This fires every time the leaderboard page is visited. The `promotion_shown_at` / `demotion_warning_shown_at` guards prevent re-showing, but the DB queries still run. This should be gated behind a flag or combined with the main `useLeaderboard` initialization.

### FIND-02: Duplicate quiz completion code between `use-quiz.ts` and `use-quiz-submission.ts`

`hooks/use-quiz.ts:335-446` and `hooks/quiz/use-quiz-submission.ts:105-220` both implement essentially the same quiz completion logic (XP calc, DB writes, weak category analysis). The refactored version in `use-quiz-submission.ts` is used by newer quiz components; the original in `use-quiz.ts` is the legacy path. They can diverge. The legacy path should be removed or unified.

### FIND-03: `fetchUserLeague` in hook inserts without `season_id` guard

`hooks/use-leaderboard.ts:142-178`: when no `user_leagues` row exists (`PGRST116`), the hook inserts a new row with `season_id: season.id`. If `fetchCurrentSeason()` returns `null` (no active season — RISK-03), the insert is skipped silently and `null` is returned. This is handled gracefully, but the user will have no league row, the league tab will show nothing, and there will be no indication of why.

---

## Summary Table

| ID | Severity | Area | Description |
|---|---|---|---|
| RISK-01 | Critical | Schema | `leaderboard_entries` and `friend_leaderboard` views missing from all migrations |
| RISK-06 | Critical | Streaks | Daily `current_streak` never written; always 0 for all users |
| RISK-02 | High | Data integrity | `user_stats.total_xp` still uses read-then-write; race condition |
| RISK-03 | High | Data integrity | Missing active season causes silent XP loss and 500 errors |
| RISK-04 | High | Performance | N+1 write loop in league processing will time out on Vercel |
| MISSING-03 | High | Operations | No cron job wired; weekly resets never fire in production |
| MISSING-05 | High | Schema | `friends` table missing from all migrations |
| RISK-05 | Medium | Correctness | Sunday midnight boundary gap creates ~60s no-active-season window |
| RISK-07 | Medium | Streaks | `maxStreak` (not `currentStreak`) used for XP bonus — confirm intent |
| RISK-08 | Medium | Privacy | `profiles` SELECT open to all auth users; `onboarding_data` exposed |
| PERF-01 | Medium | Performance | N+1 writes in league rollover endpoint |
| PERF-02 | Medium | Performance | Rank computed in JS, not with SQL window function |
| PERF-03 | Medium | Performance | No caching; 6 DB queries on every leaderboard mount |
| MISSING-04 | Medium | Features | Daily streak increment logic does not exist |
| MISSING-06 | Low | UX | Share Your Rank button has no handler |
| MISSING-07 | Low | UX | Pagination supported in API but not wired in UI |
| PERF-04 | Low | Performance | `isLoading` OR-gate delays render of active tab |
| PERF-05 | Low | Performance | Missing indexes on leaderboard query columns |
| FIND-01 | Low | Performance | `useLeagueChanges` fires uncached DB queries on every mount |
| FIND-02 | Low | Code quality | Duplicate quiz completion logic in legacy and refactored hooks |
| FIND-03 | Low | Correctness | Silent no-op league row creation when season is missing |
