-- ============================================
-- Illinois DMV Questions Database Schema
-- Migration: 001_create_questions_tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Question Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS question_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  question_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE question_categories IS 'Categories for Illinois DMV questions (Traffic Signs, Laws, etc.)';

-- ============================================
-- Questions Table
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES question_categories(id) ON DELETE CASCADE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  times_asked INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE questions IS 'Illinois DMV test questions';
COMMENT ON COLUMN questions.correct_answer IS 'Index 0-3 indicating which option is correct';
COMMENT ON COLUMN questions.difficulty IS 'easy, medium, or hard based on question complexity';
COMMENT ON COLUMN questions.source IS 'Reference to Illinois Rules of the Road manual section';

-- ============================================
-- User Question Progress Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_question_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

COMMENT ON TABLE user_question_progress IS 'Tracks user performance on individual questions';
COMMENT ON COLUMN user_question_progress.mastered IS 'True if user has answered correctly 3+ times consecutively';

-- ============================================
-- User Quiz Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'test', 'category', 'adaptive', 'marathon', 'timed')),
  category_id TEXT REFERENCES question_categories(id),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  score_percentage INTEGER,
  time_spent_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_quiz_sessions IS 'Records of user quiz/test sessions';

-- ============================================
-- Quiz Session Answers Table
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_session_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES user_quiz_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer INTEGER,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE quiz_session_answers IS 'Individual answers recorded during quiz sessions';

-- ============================================
-- Indexes for Performance
-- ============================================

-- Questions indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_has_image ON questions(has_image);
CREATE INDEX IF NOT EXISTS idx_questions_category_difficulty ON questions(category_id, difficulty);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question ON user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastered ON user_question_progress(user_id, mastered);

-- Quiz session indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON user_quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed ON user_quiz_sessions(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_mode ON user_quiz_sessions(user_id, mode);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_session_answers ENABLE ROW LEVEL SECURITY;

-- Categories: Everyone can read
CREATE POLICY "Categories are viewable by everyone" 
  ON question_categories FOR SELECT 
  USING (true);

-- Questions: Everyone can read
CREATE POLICY "Questions are viewable by everyone" 
  ON questions FOR SELECT 
  USING (true);

-- User progress: Users can only access their own data
CREATE POLICY "Users can view own progress" 
  ON user_question_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_question_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_question_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" 
  ON user_question_progress FOR DELETE 
  USING (auth.uid() = user_id);

-- Quiz sessions: Users can only access their own sessions
CREATE POLICY "Users can view own quiz sessions" 
  ON user_quiz_sessions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz sessions" 
  ON user_quiz_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz sessions" 
  ON user_quiz_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz sessions" 
  ON user_quiz_sessions FOR DELETE 
  USING (auth.uid() = user_id);

-- Quiz answers: Users can only access their own answers
CREATE POLICY "Users can view own quiz answers" 
  ON quiz_session_answers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_quiz_sessions 
      WHERE id = quiz_session_answers.session_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quiz answers" 
  ON quiz_session_answers FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_quiz_sessions 
      WHERE id = quiz_session_answers.session_id 
      AND user_id = auth.uid()
    )
  );

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_question_categories_updated_at 
  BEFORE UPDATE ON question_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
  BEFORE UPDATE ON questions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_question_progress_updated_at 
  BEFORE UPDATE ON user_question_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update question count in categories
CREATE OR REPLACE FUNCTION update_category_question_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE question_categories 
    SET question_count = question_count + 1 
    WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE question_categories 
    SET question_count = question_count - 1 
    WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.category_id != OLD.category_id THEN
    UPDATE question_categories SET question_count = question_count - 1 WHERE id = OLD.category_id;
    UPDATE question_categories SET question_count = question_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_question_count
  AFTER INSERT OR DELETE OR UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_category_question_count();

-- Function to check if question is mastered
CREATE OR REPLACE FUNCTION check_mastered_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark as mastered if answered correctly 3+ times with at least 80% accuracy
  IF NEW.times_seen >= 3 AND (NEW.times_correct::FLOAT / NEW.times_seen) >= 0.8 THEN
    NEW.mastered = TRUE;
  ELSE
    NEW.mastered = FALSE;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_mastered
  BEFORE INSERT OR UPDATE ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION check_mastered_status();

-- ============================================
-- Helper Functions
-- ============================================

-- Function to get random questions
CREATE OR REPLACE FUNCTION get_random_questions(
  p_limit INTEGER DEFAULT 10,
  p_category_id TEXT DEFAULT NULL,
  p_difficulty TEXT DEFAULT NULL
)
RETURNS SETOF questions AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM questions
  WHERE 
    (p_category_id IS NULL OR category_id = p_category_id)
    AND (p_difficulty IS NULL OR difficulty = p_difficulty)
  ORDER BY RANDOM()
  LIMIT p_limit;
END;
$$ language 'plpgsql';

-- Function to get questions by difficulty distribution
CREATE OR REPLACE FUNCTION get_questions_by_difficulty_distribution(
  p_easy_count INTEGER DEFAULT 10,
  p_medium_count INTEGER DEFAULT 10,
  p_hard_count INTEGER DEFAULT 10
)
RETURNS SETOF questions AS $$
BEGIN
  RETURN QUERY
  (
    SELECT * FROM questions WHERE difficulty = 'easy' ORDER BY RANDOM() LIMIT p_easy_count
  )
  UNION ALL
  (
    SELECT * FROM questions WHERE difficulty = 'medium' ORDER BY RANDOM() LIMIT p_medium_count
  )
  UNION ALL
  (
    SELECT * FROM questions WHERE difficulty = 'hard' ORDER BY RANDOM() LIMIT p_hard_count
  )
  ORDER BY RANDOM();
END;
$$ language 'plpgsql';

-- Function to get user's weak areas
CREATE OR REPLACE FUNCTION get_user_weak_areas(p_user_id UUID)
RETURNS TABLE (
  category_id TEXT,
  category_name TEXT,
  accuracy_rate FLOAT,
  questions_to_review TEXT[]
) AS $$
BEGIN
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
$$ language 'plpgsql';
