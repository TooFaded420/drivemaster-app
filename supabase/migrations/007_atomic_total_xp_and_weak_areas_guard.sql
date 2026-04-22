-- ============================================
-- Atomic total_xp + get_user_weak_areas auth guard
-- Migration: 007_atomic_total_xp_and_weak_areas_guard
--
-- Addresses:
--   H7 — total_xp in user_stats was updated via read-then-write in the
--        client-side useQuiz hook, which is vulnerable to concurrent-write
--        races (two quiz completions finishing nearly simultaneously would
--        clobber each other's XP). Replace with an atomic RPC
--        `increment_total_xp(user_id, xp_amount)` following the same
--        auth.uid() guard pattern used for `increment_weekly_xp` in
--        migration 006.
--   C6 — `get_user_weak_areas(p_user_id uuid)` accepted an arbitrary
--        uuid with no auth guard, leaking another user's per-category
--        accuracy + which questions they struggle with. Add an
--        `auth.uid()` check identical to the one added to
--        `increment_weekly_xp` in migration 006.
-- ============================================

-- ---------- H7: atomic total_xp RPC ----------
CREATE OR REPLACE FUNCTION public.increment_total_xp(
  user_id uuid,
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
  -- Caller must be mutating their own row. auth.uid() is NULL when
  -- invoked by service_role / cron, which legitimately needs to touch
  -- other users' rows; allow that path explicitly. Matches the pattern
  -- in migration 006 for increment_weekly_xp.
  IF auth.uid() IS NOT NULL AND user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot mutate another user''s XP';
  END IF;

  IF xp_amount IS NULL OR xp_amount <= 0 THEN
    RAISE EXCEPTION 'xp_amount must be a positive integer';
  END IF;

  -- Atomic upsert. user_stats PK is user_id so ON CONFLICT is deterministic.
  INSERT INTO user_stats (user_id, total_xp)
  VALUES (user_id, xp_amount)
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = user_stats.total_xp + EXCLUDED.total_xp
  RETURNING total_xp INTO v_new_total;

  RETURN v_new_total;
END;
$$;

COMMENT ON FUNCTION public.increment_total_xp(uuid, int) IS
  'Atomically adds XP to the caller''s user_stats.total_xp. Rejects attempts to mutate another user''s row when invoked as an authenticated user. Fixes the read-then-write race in hooks/use-quiz.ts.';

GRANT EXECUTE ON FUNCTION public.increment_total_xp(uuid, int) TO authenticated;

-- ---------- C6: get_user_weak_areas auth.uid() guard ----------
CREATE OR REPLACE FUNCTION public.get_user_weak_areas(p_user_id uuid)
RETURNS TABLE (
  category_id TEXT,
  category_name TEXT,
  accuracy_rate FLOAT,
  questions_to_review TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- C6: reject lookups for another user. service_role / cron (auth.uid()
  -- is NULL) may still call this for all users. Matches the pattern
  -- established in migration 006.
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden: cannot read another user''s weak areas';
  END IF;

  RETURN QUERY
  SELECT
    qc.id,
    qc.name,
    COALESCE(
      (SELECT SUM(uqp.times_correct)::FLOAT / NULLIF(SUM(uqp.times_seen), 0)
       FROM user_question_progress uqp
       JOIN questions q ON q.id = uqp.question_id
       WHERE uqp.user_id = p_user_id AND q.category_id = qc.id),
      0
    ) as accuracy_rate,
    ARRAY(
      SELECT q.id
      FROM questions q
      LEFT JOIN user_question_progress uqp ON q.id = uqp.question_id AND uqp.user_id = p_user_id
      WHERE q.category_id = qc.id
        AND (uqp.times_seen IS NULL OR (uqp.times_correct::FLOAT / NULLIF(uqp.times_seen, 0)) < 0.6)
      LIMIT 10
    ) as questions_to_review
  FROM question_categories qc
  ORDER BY accuracy_rate ASC;
END;
$$;

COMMENT ON FUNCTION public.get_user_weak_areas(uuid) IS
  'Returns the caller''s per-category accuracy and a short list of questions to review. Guarded so an authenticated caller can only ask about their own user_id.';

GRANT EXECUTE ON FUNCTION public.get_user_weak_areas(uuid) TO authenticated;
