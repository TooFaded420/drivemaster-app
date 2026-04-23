-- ============================================================
-- Migration: 009_multi_state_support
-- Purpose  : Add state scoping to questions and profiles so
--             DriveMaster can serve multiple US states.
-- Idempotent: yes — all operations use IF NOT EXISTS / DO blocks.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Add `state` column to the `questions` table (default 'IL')
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'questions'
      AND column_name  = 'state'
  ) THEN
    ALTER TABLE public.questions
      ADD COLUMN state TEXT NOT NULL DEFAULT 'IL';
  END IF;
END;
$$;

-- Add CHECK constraint for valid state codes (idempotent via named constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema    = 'public'
      AND table_name      = 'questions'
      AND constraint_name = 'questions_state_check'
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_state_check
      CHECK (state IN ('IL', 'TX'));
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- 2. Add `state_code` column to the `profiles` table (default 'IL')
--    Note: profiles already has a `state` TEXT column used for display;
--    we add `state_code` as the normalized ISO code for filtering.
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'state_code'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN state_code TEXT NOT NULL DEFAULT 'IL';
  END IF;
END;
$$;

-- Add CHECK constraint for profiles.state_code (idempotent via named constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema    = 'public'
      AND table_name      = 'profiles'
      AND constraint_name = 'profiles_state_code_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_state_code_check
      CHECK (state_code IN ('IL', 'TX'));
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- 3. Index on questions(state, category_id) for filtered queries
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_questions_state_category
  ON public.questions (state, category_id);

-- ------------------------------------------------------------
-- 4. Update the comment on the questions table to reflect multi-state
-- ------------------------------------------------------------
COMMENT ON TABLE public.questions IS 'Permit test questions scoped by state (IL, TX, …)';
COMMENT ON COLUMN public.questions.state IS 'ISO state code for which this question applies (e.g. IL, TX)';
COMMENT ON COLUMN public.profiles.state_code IS 'Normalized ISO state code selected during onboarding (e.g. IL, TX)';
