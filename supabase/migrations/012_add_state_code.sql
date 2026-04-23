-- ============================================================
-- Migration: 012_add_state_code
-- Purpose:   Add state_code to questions and question_categories
--            so each row can be scoped to a US state.
--            Existing rows default to 'IL' (Illinois).
-- ============================================================

-- questions table
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS state_code TEXT NOT NULL DEFAULT 'IL';

ALTER TABLE questions
  ADD CONSTRAINT questions_state_code_check
  CHECK (state_code ~ '^[A-Z]{2}$');

CREATE INDEX IF NOT EXISTS questions_state_code_idx
  ON questions (state_code);

-- question_categories table
ALTER TABLE question_categories
  ADD COLUMN IF NOT EXISTS state_code TEXT NOT NULL DEFAULT 'IL';

ALTER TABLE question_categories
  ADD CONSTRAINT question_categories_state_code_check
  CHECK (state_code ~ '^[A-Z]{2}$');

CREATE INDEX IF NOT EXISTS question_categories_state_code_idx
  ON question_categories (state_code);

-- Documentation
COMMENT ON COLUMN questions.state_code IS
  'Two-letter US state postal code. Questions are state-scoped (e.g. IL, NY, TX).';

COMMENT ON COLUMN question_categories.state_code IS
  'Two-letter US state postal code. Categories are state-scoped.';
