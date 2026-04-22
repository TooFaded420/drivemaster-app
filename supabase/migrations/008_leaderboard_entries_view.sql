-- ============================================
-- Leaderboard Entries View + Friends Table
-- Migration: 008_leaderboard_entries_view
--
-- Fixes C3 (audit): `hooks/use-leaderboard.ts` queries a `leaderboard_entries`
-- relation that does not exist in the schema. This migration introduces:
--   1. A PostgreSQL view `public.leaderboard_entries` that joins profiles,
--      user_stats, and user_leagues and exposes ONLY leaderboard-safe columns.
--      test_date, onboarding_data, miles_currency, etc. are intentionally
--      excluded.
--   2. A `public.friends` table (stub) with RLS scoped to auth.uid() on
--      either participant. The hook already references this table.
--
-- Security model:
--   The view is created with SECURITY INVOKER semantics (the default). The
--   underlying base tables (`profiles`, `user_stats`, `user_leagues`) each
--   have SELECT policies granting read access to authenticated users, so a
--   plain INVOKER view is sufficient and keeps RLS enforcement predictable
--   downstream. We do NOT use SECURITY DEFINER to avoid silently bypassing
--   row-level policies on base tables.
-- ============================================

-- ============================================
-- Friends table (stub) — required by use-leaderboard.ts
-- ============================================
CREATE TABLE IF NOT EXISTS public.friends (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT friends_not_self CHECK (user_id <> friend_id),
  CONSTRAINT friends_unique_pair UNIQUE (user_id, friend_id)
);

COMMENT ON TABLE public.friends IS
  'Friend relationships for friends leaderboard. Status: pending | accepted | blocked.';

CREATE INDEX IF NOT EXISTS idx_friends_user_id   ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Only participants can read a friend row
DROP POLICY IF EXISTS "Friends readable by participants" ON public.friends;
CREATE POLICY "Friends readable by participants"
  ON public.friends FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- A user can only create a row where they are the requester
DROP POLICY IF EXISTS "Users can insert own friend requests" ON public.friends;
CREATE POLICY "Users can insert own friend requests"
  ON public.friends FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Either participant can update status (accept/block)
DROP POLICY IF EXISTS "Participants can update friend row" ON public.friends;
CREATE POLICY "Participants can update friend row"
  ON public.friends FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Either participant can remove the friendship
DROP POLICY IF EXISTS "Participants can delete friend row" ON public.friends;
CREATE POLICY "Participants can delete friend row"
  ON public.friends FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_friends_updated_at ON public.friends;
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Leaderboard Entries View
-- Exposes ONLY leaderboard-safe columns. Rank is computed via a window
-- function over weekly_xp DESC for the currently-active season.
-- ============================================
DROP VIEW IF EXISTS public.leaderboard_entries;

CREATE VIEW public.leaderboard_entries AS
SELECT
  p.id                                                   AS user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.state,
  COALESCE(us.total_xp, 0)                               AS total_xp,
  COALESCE(ul.weekly_xp, 0)                              AS weekly_xp,
  COALESCE(ul.current_league, 'bronze')                  AS current_league,
  ul.season_id,
  ROW_NUMBER() OVER (ORDER BY COALESCE(ul.weekly_xp, 0) DESC, p.id) AS rank
FROM public.profiles p
LEFT JOIN public.user_stats   us ON us.user_id = p.id
LEFT JOIN public.user_leagues ul ON ul.user_id = p.id;

COMMENT ON VIEW public.leaderboard_entries IS
  'Leaderboard-safe projection of profiles + user_stats + user_leagues. '
  'Intentionally omits test_date, onboarding_data, miles_currency, etc.';

GRANT SELECT ON public.leaderboard_entries TO authenticated;
