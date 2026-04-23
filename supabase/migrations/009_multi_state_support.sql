-- ============================================
-- Multi-State Support
-- Migration: 009_multi_state_support
--
-- Adds `state` column to `questions` and `state_code` to `profiles` with
-- CHECK constraints scoping values to the 6 currently-supported state codes
-- (IL + CA, FL, NY, PA, TX). Non-IL states ship with empty question banks;
-- seed data for those will arrive in follow-up migrations once licensed
-- handbook content is sourced.
--
-- Idempotent: safe to re-run. Uses IF NOT EXISTS / DO blocks.
-- ============================================

-- ── questions.state ────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'questions'
      AND column_name = 'state'
  ) THEN
    ALTER TABLE public.questions
      ADD COLUMN state TEXT NOT NULL DEFAULT 'IL';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'questions_state_check'
  ) THEN
    ALTER TABLE public.questions
      ADD CONSTRAINT questions_state_check
      CHECK (state IN ('IL','CA','FL','NY','PA','TX'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_questions_state_category
  ON public.questions(state, category_id);

-- ── profiles.state_code ────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'state_code'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN state_code TEXT NOT NULL DEFAULT 'IL';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_state_code_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_state_code_check
      CHECK (state_code IN ('IL','CA','FL','NY','PA','TX'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_state_code
  ON public.profiles(state_code);

COMMENT ON COLUMN public.questions.state IS
  'ISO state code. IL is seeded; CA/FL/NY/PA/TX await licensed question imports.';
COMMENT ON COLUMN public.profiles.state_code IS
  'User-selected state for question filtering. Defaults to IL.';
