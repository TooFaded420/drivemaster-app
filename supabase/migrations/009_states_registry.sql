-- ============================================================
-- States Registry
-- Migration: 009_states_registry
-- Adds a supported_states table so multi-state expansion can
-- be tracked without hard-coding per-state config in TypeScript.
-- ============================================================

CREATE TABLE IF NOT EXISTS supported_states (
  code        TEXT PRIMARY KEY,          -- e.g. 'IL', 'PA'
  name        TEXT NOT NULL,             -- e.g. 'Illinois'
  permit_age  INTEGER NOT NULL,          -- minimum age for learner's permit
  test_questions INTEGER NOT NULL,       -- total questions on the written test
  pass_threshold_pct INTEGER NOT NULL,   -- passing percentage (e.g. 80 = 80%)
  pass_threshold_correct INTEGER NOT NULL, -- correct answers needed to pass
  agency_name TEXT NOT NULL,             -- e.g. 'Illinois Secretary of State'
  agency_url  TEXT,                      -- official agency URL
  handbook_name TEXT,                    -- official handbook / publication name
  active      BOOLEAN DEFAULT FALSE,     -- TRUE = question bank imported & live
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE supported_states IS 'Registry of states supported by DriveMaster. active=FALSE means infrastructure only; question bank not yet imported.';

ALTER TABLE supported_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supported_states are viewable by everyone"
  ON supported_states FOR SELECT
  USING (true);

-- Seed: Illinois (existing, active)
INSERT INTO supported_states (code, name, permit_age, test_questions, pass_threshold_pct, pass_threshold_correct, agency_name, agency_url, handbook_name, active)
VALUES (
  'IL',
  'Illinois',
  15,
  35,
  80,
  28,
  'Illinois Secretary of State',
  'https://www.ilsos.gov',
  'Illinois Rules of the Road',
  TRUE
)
ON CONFLICT (code) DO NOTHING;

-- Seed: Pennsylvania (infrastructure only — question bank pending)
-- TODO: Pennsylvania question bank: pending manual import from licensed source (PA Driver''s Manual PUB 95).
INSERT INTO supported_states (code, name, permit_age, test_questions, pass_threshold_pct, pass_threshold_correct, agency_name, agency_url, handbook_name, active)
VALUES (
  'PA',
  'Pennsylvania',
  16,
  18,
  83,
  15,
  'PennDOT (Pennsylvania Department of Transportation)',
  'https://www.dmv.pa.gov',
  'Pennsylvania Driver''s Manual (PUB 95)',
  FALSE
)
ON CONFLICT (code) DO NOTHING;

-- Trigger: keep updated_at fresh
CREATE TRIGGER update_supported_states_updated_at
  BEFORE UPDATE ON supported_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
