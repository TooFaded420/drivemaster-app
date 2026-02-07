/**
 * Illinois DMV Questions Module
 * Main exports for question data, categories, and utilities
 */

// Types
export * from './types';

// Categories
export * from './categories';

// Difficulty system
export * from './difficulty';

// Question bank
export { illinoisDMVQuestions } from './illinois-dmv-questions';

// Re-export for convenience
import { illinoisDMVQuestions } from './illinois-dmv-questions';
import { ILLINOIS_CATEGORIES } from './categories';
import { Question, QuestionCategory, DifficultyLevel } from './types';
import type { CategoryId } from './categories';

/**
 * Get total question count
 */
export const getTotalQuestionCount = (): number => illinoisDMVQuestions.length;

/**
 * Get questions by category
 */
export const getQuestionsByCategory = (categoryId: CategoryId): Question[] => {
  return illinoisDMVQuestions.filter(q => q.category_id === categoryId);
};

/**
 * Get questions by difficulty
 */
export const getQuestionsByDifficulty = (difficulty: DifficultyLevel): Question[] => {
  return illinoisDMVQuestions.filter(q => q.difficulty === difficulty);
};

/**
 * Get questions by category and difficulty
 */
export const getQuestionsByCategoryAndDifficulty = (
  categoryId: CategoryId,
  difficulty: DifficultyLevel
): Question[] => {
  return illinoisDMVQuestions.filter(
    q => q.category_id === categoryId && q.difficulty === difficulty
  );
};

/**
 * Get question by ID
 */
export const getQuestionById = (id: string): Question | undefined => {
  return illinoisDMVQuestions.find(q => q.id === id);
};

/**
 * Get random questions
 */
export const getRandomQuestions = (count: number, excludeIds?: string[]): Question[] => {
  let pool = illinoisDMVQuestions;
  if (excludeIds && excludeIds.length > 0) {
    pool = pool.filter(q => !excludeIds.includes(q.id));
  }
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Get random questions by category
 */
export const getRandomQuestionsByCategory = (
  categoryId: CategoryId,
  count: number
): Question[] => {
  const categoryQuestions = getQuestionsByCategory(categoryId);
  const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Get category question counts
 */
export const getCategoryQuestionCounts = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  ILLINOIS_CATEGORIES.forEach(cat => {
    counts[cat.id] = illinoisDMVQuestions.filter(q => q.category_id === cat.id).length;
  });
  
  return counts;
};

/**
 * Get difficulty distribution
 */
export const getDifficultyDistribution = (): Record<DifficultyLevel, number> => {
  return {
    easy: illinoisDMVQuestions.filter(q => q.difficulty === 'easy').length,
    medium: illinoisDMVQuestions.filter(q => q.difficulty === 'medium').length,
    hard: illinoisDMVQuestions.filter(q => q.difficulty === 'hard').length,
  };
};

/**
 * Get questions with images
 */
export const getQuestionsWithImages = (): Question[] => {
  return illinoisDMVQuestions.filter(q => q.has_image);
};

/**
 * Search questions by text
 */
export const searchQuestions = (searchTerm: string): Question[] => {
  const term = searchTerm.toLowerCase();
  return illinoisDMVQuestions.filter(
    q =>
      q.question_text.toLowerCase().includes(term) ||
      q.explanation.toLowerCase().includes(term) ||
      q.options.some(opt => opt.toLowerCase().includes(term))
  );
};

/**
 * Get questions for a practice test
 * Returns a balanced set of questions across categories
 */
export const getPracticeTestQuestions = (totalQuestions: number = 35): Question[] => {
  const questions: Question[] = [];
  const categories = ILLINOIS_CATEGORIES;
  
  // Calculate questions per category (roughly proportional)
  const basePerCategory = Math.floor(totalQuestions / categories.length);
  let remaining = totalQuestions - basePerCategory * categories.length;
  
  categories.forEach(cat => {
    const catQuestions = getQuestionsByCategory(cat.id as CategoryId);
    const count = basePerCategory + (remaining > 0 ? 1 : 0);
    if (remaining > 0) remaining--;
    
    const selected = catQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    
    questions.push(...selected);
  });
  
  // Shuffle final set
  return questions.sort(() => Math.random() - 0.5);
};

/**
 * Get questions for category practice
 */
export const getCategoryPracticeQuestions = (
  categoryId: CategoryId,
  count: number = 20
): Question[] => {
  return getRandomQuestionsByCategory(categoryId, count);
};

/**
 * Get questions with adaptive difficulty
 */
export const getAdaptiveQuestions = (
  userPerformance: Record<DifficultyLevel, number>,
  totalQuestions: number = 20
): Question[] => {
  const questions: Question[] = [];
  
  // Calculate distribution based on performance
  // Lower performance = more easy questions
  const easyRatio = Math.max(0.2, 1 - (userPerformance.easy || 0.8));
  const mediumRatio = 0.4;
  const hardRatio = Math.max(0.1, userPerformance.medium || 0.3);
  
  const easyCount = Math.round(totalQuestions * easyRatio);
  const mediumCount = Math.round(totalQuestions * mediumRatio);
  const hardCount = totalQuestions - easyCount - mediumCount;
  
  questions.push(...getQuestionsByDifficulty('easy').sort(() => Math.random() - 0.5).slice(0, easyCount));
  questions.push(...getQuestionsByDifficulty('medium').sort(() => Math.random() - 0.5).slice(0, mediumCount));
  questions.push(...getQuestionsByDifficulty('hard').sort(() => Math.random() - 0.5).slice(0, hardCount));
  
  return questions.sort(() => Math.random() - 0.5);
};

/**
 * Statistics for the question bank
 */
export const getQuestionBankStats = () => {
  const total = getTotalQuestionCount();
  const byCategory = getCategoryQuestionCounts();
  const byDifficulty = getDifficultyDistribution();
  const withImages = getQuestionsWithImages().length;
  
  return {
    total,
    byCategory,
    byDifficulty,
    withImages,
    percentageWithImages: Math.round((withImages / total) * 100),
    averageQuestionsPerCategory: Math.round(total / ILLINOIS_CATEGORIES.length),
  };
};
