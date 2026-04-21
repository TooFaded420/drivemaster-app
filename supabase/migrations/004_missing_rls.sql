-- ============================================
-- Missing Row Level Security
-- Migration: 004_missing_rls
--
-- Enables RLS and adds user-scoped policies for tables referenced
-- by code but not yet protected. Uses IF EXISTS guards so running
-- against an env missing a table is a no-op rather than an error.
--
-- Tables covered (all actually used in code):
--   challenges, challenge_results, parent_links, ai_explanations,
--   user_attempts, league_seasons, user_leagues
--
-- NOTE: profiles policy is intentionally NOT modified in this pass.
-- ============================================

-- ---------- challenges ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'challenges') THEN
    EXECUTE 'ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges viewable by participants" ON public.challenges;
      CREATE POLICY "Challenges viewable by participants"
        ON public.challenges FOR SELECT
        TO authenticated
        USING (
          auth.uid() = creator_id
          OR EXISTS (
            SELECT 1 FROM public.challenge_results cr
            WHERE cr.challenge_id = challenges.id AND cr.user_id = auth.uid()
          )
        );
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges insertable by creator" ON public.challenges;
      CREATE POLICY "Challenges insertable by creator"
        ON public.challenges FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = creator_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenges updatable by creator" ON public.challenges;
      CREATE POLICY "Challenges updatable by creator"
        ON public.challenges FOR UPDATE
        TO authenticated
        USING (auth.uid() = creator_id);
    $p$;
  END IF;
END $$;

-- ---------- challenge_results ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'challenge_results') THEN
    EXECUTE 'ALTER TABLE public.challenge_results ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenge results viewable by participants" ON public.challenge_results;
      CREATE POLICY "Challenge results viewable by participants"
        ON public.challenge_results FOR SELECT
        TO authenticated
        USING (
          auth.uid() = user_id
          OR EXISTS (
            SELECT 1 FROM public.challenges c
            WHERE c.id = challenge_results.challenge_id AND c.creator_id = auth.uid()
          )
          OR EXISTS (
            SELECT 1 FROM public.challenge_results peer
            WHERE peer.challenge_id = challenge_results.challenge_id AND peer.user_id = auth.uid()
          )
        );
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Challenge results insertable by self" ON public.challenge_results;
      CREATE POLICY "Challenge results insertable by self"
        ON public.challenge_results FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    $p$;
  END IF;
END $$;

-- ---------- parent_links ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'parent_links') THEN
    EXECUTE 'ALTER TABLE public.parent_links ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "Parent links viewable by members" ON public.parent_links;
      CREATE POLICY "Parent links viewable by members"
        ON public.parent_links FOR SELECT
        TO authenticated
        USING (auth.uid() = teen_user_id OR auth.uid() = parent_user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Teens can insert own parent link" ON public.parent_links;
      CREATE POLICY "Teens can insert own parent link"
        ON public.parent_links FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = teen_user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Parent link updatable by members" ON public.parent_links;
      CREATE POLICY "Parent link updatable by members"
        ON public.parent_links FOR UPDATE
        TO authenticated
        USING (auth.uid() = teen_user_id OR auth.uid() = parent_user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Parent link deletable by members" ON public.parent_links;
      CREATE POLICY "Parent link deletable by members"
        ON public.parent_links FOR DELETE
        TO authenticated
        USING (auth.uid() = teen_user_id OR auth.uid() = parent_user_id);
    $p$;
  END IF;
END $$;

-- ---------- ai_explanations ----------
-- Non-user-scoped cache of (question_id, wrong_answer_index) → explanation.
-- All authenticated users may read the cache; writes happen server-side.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'ai_explanations') THEN
    EXECUTE 'ALTER TABLE public.ai_explanations ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "AI explanations readable by authenticated" ON public.ai_explanations;
      CREATE POLICY "AI explanations readable by authenticated"
        ON public.ai_explanations FOR SELECT
        TO authenticated
        USING (true);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "AI explanations insertable by authenticated" ON public.ai_explanations;
      CREATE POLICY "AI explanations insertable by authenticated"
        ON public.ai_explanations FOR INSERT
        TO authenticated
        WITH CHECK (true);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "AI explanations updatable by authenticated" ON public.ai_explanations;
      CREATE POLICY "AI explanations updatable by authenticated"
        ON public.ai_explanations FOR UPDATE
        TO authenticated
        USING (true);
    $p$;
  END IF;
END $$;

-- ---------- user_attempts ----------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_attempts') THEN
    EXECUTE 'ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can view own attempts" ON public.user_attempts;
      CREATE POLICY "Users can view own attempts"
        ON public.user_attempts FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can insert own attempts" ON public.user_attempts;
      CREATE POLICY "Users can insert own attempts"
        ON public.user_attempts FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can update own attempts" ON public.user_attempts;
      CREATE POLICY "Users can update own attempts"
        ON public.user_attempts FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id);
    $p$;
  END IF;
END $$;

-- ---------- league_seasons ----------
-- Seasons are public reference data; writes admin-only (no policy ⇒ denied).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'league_seasons') THEN
    EXECUTE 'ALTER TABLE public.league_seasons ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "League seasons readable by authenticated" ON public.league_seasons;
      CREATE POLICY "League seasons readable by authenticated"
        ON public.league_seasons FOR SELECT
        TO authenticated
        USING (true);
    $p$;
  END IF;
END $$;

-- ---------- user_leagues ----------
-- Users see their own row; leaderboards read via SECURITY DEFINER RPCs
-- or a dedicated view (out of scope for this pass).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_leagues') THEN
    EXECUTE 'ALTER TABLE public.user_leagues ENABLE ROW LEVEL SECURITY';

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can view own league row" ON public.user_leagues;
      CREATE POLICY "Users can view own league row"
        ON public.user_leagues FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can insert own league row" ON public.user_leagues;
      CREATE POLICY "Users can insert own league row"
        ON public.user_leagues FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);
    $p$;

    EXECUTE $p$
      DROP POLICY IF EXISTS "Users can update own league row" ON public.user_leagues;
      CREATE POLICY "Users can update own league row"
        ON public.user_leagues FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id);
    $p$;
  END IF;
END $$;
