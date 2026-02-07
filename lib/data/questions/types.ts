/**
 * Illinois DMV Question Types
 * Based on Illinois Rules of the Road 2024
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question_text: string;
  options: [string, string, string, string];
  correct_answer: 0 | 1 | 2 | 3;
  explanation: string;
  category_id: string;
  difficulty: DifficultyLevel;
  has_image: boolean;
  image_url?: string;
  times_asked: number;
  correct_count: number;
  source: string; // Official IL DMV manual section reference
  created_at?: string;
  updated_at?: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  question_count: number;
  order: number;
}

export interface QuestionFilter {
  category_id?: string;
  difficulty?: DifficultyLevel;
  has_image?: boolean;
  exclude_ids?: string[];
  limit?: number;
  random?: boolean;
}

export interface QuestionAnalytics {
  question_id: string;
  times_asked: number;
  correct_count: number;
  accuracy_rate: number;
  average_time_seconds?: number;
}

export interface CategoryStats {
  category_id: string;
  total_questions: number;
  attempted: number;
  correct: number;
  accuracy: number;
  weak_areas: string[];
}

export interface UserQuestionProgress {
  user_id: string;
  question_id: string;
  times_seen: number;
  times_correct: number;
  last_seen: string;
  mastered: boolean;
}

export interface DifficultyAdjustment {
  current_difficulty: DifficultyLevel;
  recommended_difficulty: DifficultyLevel;
  reason: string;
  confidence: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  question_ids: string[];
  category_ids: string[];
  difficulty_distribution: Record<DifficultyLevel, number>;
  estimated_time_minutes: number;
}
