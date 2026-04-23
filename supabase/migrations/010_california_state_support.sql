-- Migration 010: California state support
--
-- Extends any state code CHECK constraints to include "CA".
-- If migration 009 (Texas) already introduced a states table or
-- generic CHECK constraint, alter that here; otherwise this migration
-- is a forward-compatible no-op until those constraints exist.
--
-- TODO: California question bank: pending manual import from licensed source (CA DMV handbook 2024).

-- Add CA to the questions table state_code constraint if it exists.
DO $$
BEGIN
  -- Drop and recreate the CHECK constraint on questions.state_code if present.
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'CHECK'
      AND tc.table_name = 'questions'
      AND ccu.column_name = 'state_code'
  ) THEN
    -- Remove old constraint (name may vary; use DO block with dynamic SQL).
    EXECUTE (
      SELECT 'ALTER TABLE questions DROP CONSTRAINT ' || tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'CHECK'
        AND tc.table_name = 'questions'
        AND ccu.column_name = 'state_code'
      LIMIT 1
    );

    -- Re-add constraint with IL + TX + CA.
    ALTER TABLE questions
      ADD CONSTRAINT questions_state_code_check
      CHECK (state_code IN ('IL', 'TX', 'CA'));
  END IF;
END;
$$;
