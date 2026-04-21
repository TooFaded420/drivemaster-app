-- ============================================
-- Parent Link Teen Consent
-- Migration: 005_parent_links_teen_consent
--
-- Introduces the pending_teen_approval / active / rejected states so
-- a parent cannot see their teen's data until the teen explicitly
-- approves the link. Backfills any pre-existing `approved` rows to
-- `active` so existing consenting users keep working.
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'parent_links') THEN

    -- Ensure `status` column exists (TEXT, default 'pending').
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'parent_links'
        AND column_name  = 'status'
    ) THEN
      EXECUTE 'ALTER TABLE public.parent_links ADD COLUMN status TEXT NOT NULL DEFAULT ''pending''';
    END IF;

    -- Ensure `approved_at` exists so the approve endpoint can timestamp.
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'parent_links'
        AND column_name  = 'approved_at'
    ) THEN
      EXECUTE 'ALTER TABLE public.parent_links ADD COLUMN approved_at TIMESTAMPTZ';
    END IF;

    -- Backfill: any prior auto-approved rows become `active` so consenting
    -- users retain access without another approval round-trip.
    EXECUTE $u$
      UPDATE public.parent_links
         SET status = 'active',
             approved_at = COALESCE(approved_at, linked_at, NOW())
       WHERE status = 'approved'
    $u$;
  END IF;
END $$;
