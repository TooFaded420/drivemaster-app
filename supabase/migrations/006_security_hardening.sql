-- ============================================
-- Security Hardening
-- Migration: 006_security_hardening
--
-- Addresses three issues surfaced by the eng review pass:
--   ENG-#1 — parent_links rows pre-dating the `status` column default
--            to 'pending', which no state machine handles. Backfill
--            any such rows (where a parent is already attached and the
--            link_at timestamp exists) to 'active' so legacy users
--            keep working.
--   ENG-#4 — ai_explanations had authenticated-role INSERT/UPDATE
--            policies, enabling cache poisoning. Drop the write
--            policies; writes must go through service_role (which
--            bypasses RLS) from /api/explain server-side.
--   ENG-#5 — increment_weekly_xp RPC accepted any `user_id` arg,
--            letting a caller mutate another user's XP. Add an
--            auth.uid() guard and keep the GRANT EXECUTE.
-- ============================================

-- ---------- ENG-#1: parent_links backfill ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'parent_links') THEN
    EXECUTE $u$
      UPDATE public.parent_links
         SET status = 'active',
             approved_at = COALESCE(approved_at, linked_at, NOW())
       WHERE status = 'pending'
         AND parent_user_id IS NOT NULL
         AND linked_at IS NOT NULL
    $u$;
  END IF;
END $$;

-- ---------- ENG-#4: ai_explanations write lockdown ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'ai_explanations') THEN
    EXECUTE 'DROP POLICY IF EXISTS "AI explanations insertable by authenticated" ON public.ai_explanations';
    EXECUTE 'DROP POLICY IF EXISTS "AI explanations updatable by authenticated" ON public.ai_explanations';
    -- Reads remain open to all authenticated users via the policy created in 004.
    -- Writes now happen only via service_role, which bypasses RLS.
  END IF;
END $$;

-- ---------- ENG-#5: increment_weekly_xp auth.uid() guard ----------
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
  -- Caller must be mutating their own row. auth.uid() is NULL when
  -- invoked by service_role / cron, which legitimately needs to touch
  -- other users' rows; allow that path explicitly.
  IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot mutate another user''s XP';
  END IF;

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
  'Atomically adds XP to the caller''s weekly_xp row for the active season. Caps xp_amount at max_per_call (default 500). Rejects attempts to mutate another user''s row when invoked as an authenticated user.';

GRANT EXECUTE ON FUNCTION public.increment_weekly_xp(uuid, int, int) TO authenticated;
