-- Migration 011: Add Florida (FL) to multi-state support
-- Adds a `state_code` column to questions and user_stats tables so content
-- can be scoped per state. Defaults to 'IL' for backward compatibility.
--
-- Florida question bank: pending manual import from licensed source
-- (FL Driver License Handbook 2024).

-- ─── questions table ─────────────────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS state_code TEXT NOT NULL DEFAULT 'IL'
    CHECK (state_code IN ('IL', 'FL'));

-- Index to make state-filtered queries fast
CREATE INDEX IF NOT EXISTS idx_questions_state_code
  ON questions (state_code);

-- ─── user_stats table ────────────────────────────────────────────────────────

ALTER TABLE user_stats
  ADD COLUMN IF NOT EXISTS state_code TEXT NOT NULL DEFAULT 'IL'
    CHECK (state_code IN ('IL', 'FL'));

-- ─── RLS: no change — existing policies remain valid ─────────────────────────
-- Existing per-user RLS on questions and user_stats already scopes to the
-- authenticated user. State filtering is additive via the new column.

-- ─── Florida state metadata row (for future state_configs table) ──────────────
-- If a state_configs table is added later, seed FL here.
-- Placeholder: no-op until state_configs table is created.
SELECT 'Florida infrastructure migration complete' AS status;
