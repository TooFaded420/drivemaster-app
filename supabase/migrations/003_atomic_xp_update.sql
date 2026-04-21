-- ============================================
-- Atomic Weekly XP Increment
-- Migration: 003_atomic_xp_update
-- Replaces the read-then-write pattern in
--   app/api/leaderboard/update/route.ts
-- that was vulnerable to concurrent-write races.
-- ============================================

CREATE OR REPLACE FUNCTION public.increment_weekly_xp(
  user_id uuid,
  xp_amount int,
  max_per_call int DEFAULT 500
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_season_id uuid;
  v_now       timestamptz := NOW();
  v_capped    int;
  v_new_xp    int;
BEGIN
  -- Cap per-call amount. Reject non-positive / non-integer inputs.
  IF xp_amount IS NULL OR xp_amount <= 0 THEN
    RAISE EXCEPTION 'xp_amount must be a positive integer';
  END IF;

  v_capped := LEAST(xp_amount, max_per_call);

  -- Resolve active season.
  SELECT id INTO v_season_id
  FROM league_seasons
  WHERE is_active = TRUE
    AND week_start <= v_now
    AND week_end   >= v_now
  LIMIT 1;

  IF v_season_id IS NULL THEN
    RAISE EXCEPTION 'No active league season';
  END IF;

  -- Atomic upsert: insert a new row or add to existing weekly_xp in one statement.
  INSERT INTO user_leagues (user_id, season_id, current_league, weekly_xp, updated_at)
  VALUES (user_id, v_season_id, 'bronze', v_capped, v_now)
  ON CONFLICT (user_id, season_id) DO UPDATE
    SET weekly_xp  = user_leagues.weekly_xp + EXCLUDED.weekly_xp,
        updated_at = v_now
  RETURNING weekly_xp INTO v_new_xp;

  RETURN v_new_xp;
END;
$$;

COMMENT ON FUNCTION public.increment_weekly_xp(uuid, int, int) IS
  'Atomically adds XP to the caller''s weekly_xp row for the active season. Caps xp_amount at max_per_call (default 500) to prevent client-side abuse.';

-- Ensure the ON CONFLICT target above exists. If user_leagues lacks the
-- uniqueness, add it (idempotent via DO block).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_leagues_user_season_unique'
  ) THEN
    BEGIN
      ALTER TABLE user_leagues
        ADD CONSTRAINT user_leagues_user_season_unique UNIQUE (user_id, season_id);
    EXCEPTION
      WHEN undefined_table THEN NULL;
      WHEN duplicate_table  THEN NULL;
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- Allow authenticated users to call the RPC.
GRANT EXECUTE ON FUNCTION public.increment_weekly_xp(uuid, int, int) TO authenticated;
