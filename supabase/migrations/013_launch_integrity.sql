-- ============================================
-- Launch Integrity
-- Migration: 013_launch_integrity
--
-- IMPORTANT: This migration is written against the LIVE production schema
-- (types/database.ts, generated from the production database). The files in
-- supabase/migrations/001-012 predate the current production schema and do
-- NOT recreate it from scratch. Every statement here is idempotent and
-- guarded, so it is safe to run on production, staging, or a fresh DB.
--
-- Addresses:
--   SEC-1 — The "Users can update own stats" policy on user_stats allowed
--           any authenticated user to set total_xp / miles_currency to
--           arbitrary values directly via PostgREST. No client code performs
--           a direct UPDATE on user_stats (verified: all writes go through
--           the SECURITY DEFINER RPCs or the service role), so the policy is
--           dropped outright.
--   SEC-2 — increment_total_xp had no per-call or per-day ceiling. XP is
--           computed client-side, so the RPC is the last line of defense
--           against leaderboard farming. Adds a per-call cap (600, sized to
--           cover full marathon completions) and a per-day cap (3000, far
--           above any realistic day of legit play) using a locked row plus
--           daily ledger columns on user_stats.
--   SEC-3 — increment_weekly_xp could be called in a loop to farm weekly
--           league XP (per-call cap only). Adds the same per-day cap via
--           daily ledger columns on user_leagues.
--   FIX-1 — Challenge share loop was broken for invitees: the challenges
--           SELECT policy required a prior challenge_results row, so an
--           invitee opening /challenge/[id] got 404 and could never reach
--           the (allowed) result insert. Challenge rows carry no PII
--           (id, creator, question ids, status) → capability-URL model:
--           readable by any authenticated user holding the UUID link.
--   FIX-2 — challenge_results SELECT hid peer results from invitees before
--           they submitted, and the challenges.status → 'completed' flip
--           after the second submission silently failed for non-creators
--           (creator-only UPDATE policy). SELECT opens to authenticated
--           users; UPDATE allows the creator OR any participant.
-- ============================================

-- ============================================
-- SEC-2/SEC-3 prep: daily XP ledger columns
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_stats') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'user_stats'
                     AND column_name = 'daily_xp') THEN
      ALTER TABLE public.user_stats ADD COLUMN daily_xp INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'user_stats'
                     AND column_name = 'xp_day') THEN
      ALTER TABLE public.user_stats ADD COLUMN xp_day DATE;
    END IF;
    -- Existing balances start with a full daily allowance: backfill xp_day to
    -- yesterday so today's first grant is not reduced by legacy totals.
    UPDATE public.user_stats SET xp_day = CURRENT_DATE - 1 WHERE xp_day IS NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_leagues') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'user_leagues'
                     AND column_name = 'daily_xp') THEN
      ALTER TABLE public.user_leagues ADD COLUMN daily_xp INTEGER NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'user_leagues'
                     AND column_name = 'xp_day') THEN
      ALTER TABLE public.user_leagues ADD COLUMN xp_day DATE;
    END IF;
    UPDATE public.user_leagues SET xp_day = CURRENT_DATE - 1 WHERE xp_day IS NULL;
  END IF;
END $$;

-- ============================================
-- SEC-1: drop the open user_stats UPDATE policy
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_stats') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats';
  END IF;
END $$;

-- ============================================
-- SEC-2: increment_total_xp with per-call + per-day caps
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_total_xp(
  user_id uuid,
  xp_amount int
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_per_call_cap CONSTANT int := 600;
  v_daily_cap    CONSTANT int := 3000;
  v_capped        int;
  v_current_total int;
  v_gained_today  int;
  v_same_day      boolean;
  v_allowance     int;
  v_grant         int;
  v_new_total     int;
BEGIN
  -- Auth guard: authenticated callers can only mutate their own row.
  -- Service-role / cron callers have auth.uid() = NULL — allow through.
  IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot mutate another user''s XP';
  END IF;

  IF xp_amount IS NULL OR xp_amount <= 0 THEN
    RAISE EXCEPTION 'xp_amount must be a positive integer';
  END IF;

  v_capped := LEAST(xp_amount, v_per_call_cap);

  -- Ensure the row exists (FK to profiles rejects forged user_ids), then
  -- lock it so concurrent grants serialize instead of racing.
  INSERT INTO public.user_stats (user_id, total_xp, daily_xp, xp_day)
  VALUES (user_id, 0, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT user_stats.total_xp,
         user_stats.daily_xp,
         (user_stats.xp_day = CURRENT_DATE)
    INTO v_current_total, v_gained_today, v_same_day
    FROM public.user_stats
   WHERE user_stats.user_id = increment_total_xp.user_id
   FOR UPDATE;

  v_allowance := CASE WHEN v_same_day THEN v_daily_cap - v_gained_today ELSE v_daily_cap END;
  IF v_allowance < 0 THEN
    v_allowance := 0;
  END IF;

  -- Daily cap reached: silent no-op so legit client flows never break.
  IF v_allowance = 0 THEN
    RETURN v_current_total;
  END IF;

  v_grant := LEAST(v_capped, v_allowance);

  UPDATE public.user_stats
     SET total_xp = user_stats.total_xp + v_grant,
         daily_xp = CASE
                      WHEN user_stats.xp_day = CURRENT_DATE
                      THEN user_stats.daily_xp + v_grant
                      ELSE v_grant
                    END,
         xp_day   = CURRENT_DATE
   WHERE user_stats.user_id = increment_total_xp.user_id
  RETURNING user_stats.total_xp INTO v_new_total;

  RETURN v_new_total;
END;
$$;

COMMENT ON FUNCTION public.increment_total_xp(uuid, int) IS
  'Atomically adds XP to user_stats.total_xp with a per-call cap of 600 and a per-day cap of 3000 (silent no-op at the cap). Auth guard rejects cross-user mutations from authenticated callers.';

GRANT EXECUTE ON FUNCTION public.increment_total_xp(uuid, int) TO authenticated;

-- ============================================
-- SEC-3: increment_weekly_xp with per-day cap
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_weekly_xp(
  user_id     uuid,
  xp_amount   int,
  max_per_call int DEFAULT 500
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_daily_cap CONSTANT int := 3000;
  v_season_id  uuid;
  v_now        timestamptz := NOW();
  v_capped     int;
  v_gained_today int;
  v_same_day   boolean;
  v_allowance  int;
  v_grant      int;
  v_new_xp     int;
BEGIN
  IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot mutate another user''s XP';
  END IF;

  IF xp_amount IS NULL OR xp_amount <= 0 THEN
    RAISE EXCEPTION 'xp_amount must be a positive integer';
  END IF;

  v_capped := LEAST(xp_amount, max_per_call);

  SELECT id INTO v_season_id
  FROM public.league_seasons
  WHERE is_active  = TRUE
    AND week_start <= v_now
    AND week_end   >= v_now
  LIMIT 1;

  IF v_season_id IS NULL THEN
    RAISE EXCEPTION 'No active league season';
  END IF;

  -- Ensure the row exists, then lock it for the daily-allowance read.
  INSERT INTO public.user_leagues (user_id, season_id, current_league, weekly_xp, daily_xp, xp_day, updated_at)
  VALUES (user_id, v_season_id, 'bronze', 0, 0, CURRENT_DATE, v_now)
  ON CONFLICT (user_id, season_id) DO NOTHING;

  SELECT user_leagues.daily_xp,
         (user_leagues.xp_day = CURRENT_DATE)
    INTO v_gained_today, v_same_day
    FROM public.user_leagues
   WHERE user_leagues.user_id = increment_weekly_xp.user_id
     AND user_leagues.season_id = v_season_id
   FOR UPDATE;

  v_allowance := CASE WHEN v_same_day THEN v_daily_cap - v_gained_today ELSE v_daily_cap END;
  IF v_allowance < 0 THEN
    v_allowance := 0;
  END IF;

  IF v_allowance = 0 THEN
    SELECT user_leagues.weekly_xp INTO v_new_xp
      FROM public.user_leagues
     WHERE user_leagues.user_id = increment_weekly_xp.user_id
       AND user_leagues.season_id = v_season_id;
    RETURN v_new_xp;
  END IF;

  v_grant := LEAST(v_capped, v_allowance);

  UPDATE public.user_leagues
     SET weekly_xp  = user_leagues.weekly_xp + v_grant,
         daily_xp   = CASE
                        WHEN user_leagues.xp_day = CURRENT_DATE
                        THEN user_leagues.daily_xp + v_grant
                        ELSE v_grant
                      END,
         xp_day     = CURRENT_DATE,
         updated_at = v_now
   WHERE user_leagues.user_id = increment_weekly_xp.user_id
     AND user_leagues.season_id = v_season_id
  RETURNING user_leagues.weekly_xp INTO v_new_xp;

  RETURN v_new_xp;
END;
$$;

COMMENT ON FUNCTION public.increment_weekly_xp(uuid, int, int) IS
  'Atomically adds XP to user_leagues.weekly_xp for the active season. Per-call cap (default 500) plus a per-day cap of 3000 (silent no-op at the cap). Auth guard rejects cross-user mutations.';

GRANT EXECUTE ON FUNCTION public.increment_weekly_xp(uuid, int, int) TO authenticated;

-- ============================================
-- FIX-1/FIX-2: challenge access policies
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'challenges') THEN
    -- FIX-1: capability-URL model — any authenticated user holding the
    -- UUID link may view the challenge (no PII on the row).
    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges viewable by participants" ON public.challenges;
      CREATE POLICY "Challenges viewable by authenticated"
        ON public.challenges FOR SELECT
        TO authenticated
        USING (true);
    $p$;

    -- FIX-2: creator keeps full control; participants (anyone with a
    -- result row) may update so the second submission can flip status
    -- to 'completed'.
    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges updatable by creator" ON public.challenges;
      CREATE POLICY "Challenges updatable by creator or participants"
        ON public.challenges FOR UPDATE
        TO authenticated
        USING (
          auth.uid() = creator_id
          OR EXISTS (
            SELECT 1 FROM public.challenge_results cr
            WHERE cr.challenge_id = challenges.id AND cr.user_id = auth.uid()
          )
        );
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges insertable by creator" ON public.challenges;
      CREATE POLICY "Challenges insertable by creator"
        ON public.challenges FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = creator_id);
    $p$;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'challenge_results') THEN
    -- FIX-2: participants can see the scoreboard. Rows expose user_id +
    -- score only (same exposure class as the public leaderboard view).
    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenge results viewable by participants" ON public.challenge_results;
      CREATE POLICY "Challenge results viewable by authenticated"
        ON public.challenge_results FOR SELECT
        TO authenticated
        USING (true);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenge results insertable by self" ON public.challenge_results;
      CREATE POLICY "Challenge results insertable by self"
        ON public.challenge_results FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    $p$;
  END IF;
END $$;
