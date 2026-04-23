-- ============================================
-- user_wrong_answers table + XP RPC hardening
-- Migration: 010_user_wrong_answers_and_xp_fix
--
-- Addresses:
--   ISSUE-DB-1 — user_wrong_answers table was referenced in code but never
--                created in any migration. Every wrong-answer write 404d
--                silently, breaking Mistakes Mode entirely.
--   ISSUE-DB-2 — increment_total_xp and increment_weekly_xp RPCs could 500
--                for users whose user_stats row was never created (e.g. if
--                the handle_new_user trigger fired before this migration ran
--                on a fresh DB, or the trigger itself failed). Re-declare
--                both RPCs with explicit ON CONFLICT guards and add an
--                updated_at column to user_stats for completeness.
-- ============================================

-- ============================================
-- ISSUE-DB-1: user_wrong_answers table
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_wrong_answers (
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id  TEXT        NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  wrong_count  INTEGER     NOT NULL DEFAULT 1,
  last_attempted TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_mastered  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

COMMENT ON TABLE public.user_wrong_answers IS
  'Tracks which questions each user has answered incorrectly, enabling Mistakes Mode to surface only non-mastered wrong answers.';

-- RLS
ALTER TABLE public.user_wrong_answers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_wrong_answers'
      AND policyname = 'Users can view own wrong answers'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can view own wrong answers"
        ON public.user_wrong_answers
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id)
    $p$;
  END IF;

  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_wrong_answers'
      AND policyname = 'Users can insert own wrong answers'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can insert own wrong answers"
        ON public.user_wrong_answers
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id)
    $p$;
  END IF;

  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_wrong_answers'
      AND policyname = 'Users can update own wrong answers'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can update own wrong answers"
        ON public.user_wrong_answers
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
    $p$;
  END IF;

  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'user_wrong_answers'
      AND policyname = 'Users can delete own wrong answers'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can delete own wrong answers"
        ON public.user_wrong_answers
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id)
    $p$;
  END IF;
END $$;

-- Index for Mistakes Mode query pattern: non-mastered rows per user, ordered by last_attempted
CREATE INDEX IF NOT EXISTS idx_user_wrong_answers_user_mastered
  ON public.user_wrong_answers (user_id, is_mastered);

-- updated_at auto-maintenance (reuses the update_updated_at_column function
-- created in migration 001 — safe to reference here since 001 always runs first)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname   = 'update_user_wrong_answers_updated_at'
      AND tgrelid  = 'public.user_wrong_answers'::regclass
  ) THEN
    EXECUTE $t$
      CREATE TRIGGER update_user_wrong_answers_updated_at
        BEFORE UPDATE ON public.user_wrong_answers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    $t$;
  END IF;
END $$;

-- ============================================
-- ISSUE-DB-2a: add updated_at to user_stats (was missing from 002)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'user_stats'
      AND column_name  = 'updated_at'
  ) THEN
    ALTER TABLE public.user_stats
      ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- ============================================
-- ISSUE-DB-2b: re-declare increment_total_xp with ON CONFLICT safety net
--
-- Migration 007 already defined this function, but it may not have been
-- applied to production. CREATE OR REPLACE is idempotent. The ON CONFLICT
-- path now also sets updated_at so the column addition above is covered.
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_total_xp(
  user_id  uuid,
  xp_amount int
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_total int;
BEGIN
  -- Auth guard: authenticated callers can only mutate their own row.
  -- Service-role / cron callers have auth.uid() = NULL — allow through.
  IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot mutate another user''s XP';
  END IF;

  IF xp_amount IS NULL OR xp_amount <= 0 THEN
    RAISE EXCEPTION 'xp_amount must be a positive integer';
  END IF;

  -- Upsert: handles both new users whose user_stats row was never created
  -- (edge case if handle_new_user trigger failed) and existing users.
  INSERT INTO public.user_stats (user_id, total_xp, updated_at)
  VALUES (user_id, xp_amount, NOW())
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp   = user_stats.total_xp + EXCLUDED.total_xp,
        updated_at = NOW()
  RETURNING total_xp INTO v_new_total;

  RETURN v_new_total;
END;
$$;

COMMENT ON FUNCTION public.increment_total_xp(uuid, int) IS
  'Atomically adds XP to user_stats.total_xp. ON CONFLICT handles users with no pre-existing row. Auth guard rejects cross-user mutations from authenticated callers.';

GRANT EXECUTE ON FUNCTION public.increment_total_xp(uuid, int) TO authenticated;

-- ============================================
-- ISSUE-DB-2c: re-declare increment_weekly_xp for the same ON CONFLICT safety
--
-- increment_weekly_xp targets user_leagues (not user_stats) but the same
-- "missing row" failure mode applies if a user_leagues entry was never
-- seeded. Migration 006 already handles this correctly; re-declaring here
-- is a no-op on prod but ensures the function is present if 006 was skipped.
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
  v_season_id uuid;
  v_now       timestamptz := NOW();
  v_capped    int;
  v_new_xp    int;
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

  INSERT INTO public.user_leagues (user_id, season_id, current_league, weekly_xp, updated_at)
  VALUES (user_id, v_season_id, 'bronze', v_capped, v_now)
  ON CONFLICT (user_id, season_id) DO UPDATE
    SET weekly_xp  = user_leagues.weekly_xp + EXCLUDED.weekly_xp,
        updated_at = v_now
  RETURNING weekly_xp INTO v_new_xp;

  RETURN v_new_xp;
END;
$$;

COMMENT ON FUNCTION public.increment_weekly_xp(uuid, int, int) IS
  'Atomically adds XP to user_leagues.weekly_xp for the active season. Caps xp_amount at max_per_call (default 500). Auth guard rejects cross-user mutations from authenticated callers.';

GRANT EXECUTE ON FUNCTION public.increment_weekly_xp(uuid, int, int) TO authenticated;
