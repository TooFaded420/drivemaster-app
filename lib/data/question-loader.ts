/**
 * Question Loader Utility
 * Handles loading, filtering, and caching of questions
 */

import {
  Question,
  QuestionFilter,
  DifficultyLevel,
  CategoryStats,
  UserQuestionProgress,
} from './questions/types';
import {
  illinoisDMVQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getRandomQuestions,
  getQuestionById,
  getPracticeTestQuestions,
  getAdaptiveQuestions,
} from './questions';

/**
 * Question cache for performance
 */
class QuestionCache {
  private cache: Map<string, Question[]> = new Map();
  private timestamp: Map<string, number> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): Question[] | null {
    const cached = this.cache.get(key);
    const time = this.timestamp.get(key);
    
    if (cached && time && Date.now() - time < this.TTL) {
      return cached;
    }
    
    // Expired or not found
    this.cache.delete(key);
    this.timestamp.delete(key);
    return null;
  }

  set(key: string, questions: Question[]): void {
    this.cache.set(key, questions);
    this.timestamp.set(key, Date.now());
  }

  clear(): void {
    this.cache.clear();
    this.timestamp.clear();
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.timestamp.delete(key);
  }
}

const cache = new QuestionCache();

/**
 * Generate cache key from filter
 */
function generateCacheKey(filter: QuestionFilter): string {
  return JSON.stringify(filter);
}

/**
 * Load questions with filtering and caching
 */
export function loadQuestions(filter: QuestionFilter = {}): Question[] {
  const cacheKey = generateCacheKey(filter);
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  let questions = [...illinoisDMVQuestions];

  // Apply category filter
  if (filter.category_id) {
    questions = questions.filter(q => q.category_id === filter.category_id);
  }

  // Apply difficulty filter
  if (filter.difficulty) {
    questions = questions.filter(q => q.difficulty === filter.difficulty);
  }

  // Apply image filter
  if (filter.has_image !== undefined) {
    questions = questions.filter(q => q.has_image === filter.has_image);
  }

  // Exclude specific IDs
  if (filter.exclude_ids && filter.exclude_ids.length > 0) {
    questions = questions.filter(q => !filter.exclude_ids!.includes(q.id));
  }

  // Randomize if requested
  if (filter.random) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  // Apply limit
  if (filter.limit && filter.limit > 0) {
    questions = questions.slice(0, filter.limit);
  }

  // Cache result
  cache.set(cacheKey, questions);
  
  return questions;
}

/**
 * Load a single question by ID
 */
export function loadQuestionById(id: string): Question | null {
  return getQuestionById(id) || null;
}

/**
 * Load questions for a quiz session
 */
export interface QuizSessionConfig {
  mode: 'practice' | 'test' | 'category' | 'adaptive' | 'marathon';
  categoryId?: string;
  questionCount?: number;
  difficulty?: DifficultyLevel;
  userPerformance?: Record<DifficultyLevel, number>;
  excludeAnswered?: string[];
}

export function loadQuizQuestions(config: QuizSessionConfig): Question[] {
  const { mode, categoryId, questionCount = 20, difficulty, userPerformance, excludeAnswered } = config;

  switch (mode) {
    case 'test':
      return getPracticeTestQuestions(questionCount);
    
    case 'category':
      if (!categoryId) throw new Error('Category ID required for category mode');
      return getQuestionsByCategory(categoryId as any).slice(0, questionCount);
    
    case 'adaptive':
      return getAdaptiveQuestions(userPerformance || { easy: 0.8, medium: 0.6, hard: 0.4 }, questionCount);
    
    case 'marathon':
      return getRandomQuestions(questionCount, excludeAnswered);
    
    case 'practice':
    default:
      return loadQuestions({
        category_id: categoryId,
        difficulty,
        exclude_ids: excludeAnswered,
        limit: questionCount,
        random: true,
      });
  }
}

/**
 * Calculate category statistics
 */
export function calculateCategoryStats(
  categoryId: string,
  userProgress: UserQuestionProgress[]
): CategoryStats {
  const categoryQuestions = getQuestionsByCategory(categoryId as any);
  const totalQuestions = categoryQuestions.length;
  
  const categoryProgress = userProgress.filter(p => 
    categoryQuestions.some(q => q.id === p.question_id)
  );
  
  const attempted = categoryProgress.length;
  const correct = categoryProgress.reduce((sum, p) => sum + p.times_correct, 0);
  const totalAttempts = categoryProgress.reduce((sum, p) => sum + p.times_seen, 0);
  
  const accuracy = totalAttempts > 0 ? correct / totalAttempts : 0;
  
  // Identify weak areas (questions answered incorrectly multiple times)
  const weakAreas = categoryProgress
    .filter(p => p.times_seen > 0 && p.times_correct / p.times_seen < 0.5)
    .map(p => p.question_id);
  
  return {
    category_id: categoryId,
    total_questions: totalQuestions,
    attempted,
    correct,
    accuracy,
    weak_areas: weakAreas,
  };
}

/**
 * Get recommended questions for user
 * Based on weak areas and unattempted questions
 */
export function getRecommendedQuestions(
  userId: string,
  userProgress: UserQuestionProgress[],
  count: number = 10
): Question[] {
  const recommended: Question[] = [];
  
  // 1. Prioritize weak areas (questions answered incorrectly)
  const weakQuestionIds = userProgress
    .filter(p => p.times_seen > 0 && p.times_correct / p.times_seen < 0.5)
    .sort((a, b) => (a.times_correct / a.times_seen) - (b.times_correct / b.times_seen))
    .slice(0, Math.floor(count * 0.4)) // 40% from weak areas
    .map(p => p.question_id);
  
  weakQuestionIds.forEach(id => {
    const question = loadQuestionById(id);
    if (question) recommended.push(question);
  });
  
  // 2. Add unattempted questions
  const attemptedIds = new Set(userProgress.map(p => p.question_id));
  const unattempted = illinoisDMVQuestions
    .filter(q => !attemptedIds.has(q.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(count * 0.4)); // 40% new questions
  
  recommended.push(...unattempted);
  
  // 3. Fill remaining with random questions
  const remaining = count - recommended.length;
  if (remaining > 0) {
    const excludeIds = [...recommended.map(q => q.id), ...Array.from(attemptedIds)];
    const random = getRandomQuestions(remaining, excludeIds);
    recommended.push(...random);
  }
  
  return recommended.slice(0, count);
}

/**
 * Search questions with advanced filtering
 */
export interface SearchOptions {
  query?: string;
  category?: string;
  difficulty?: DifficultyLevel;
  hasImage?: boolean;
  source?: string;
}

export function searchQuestions(options: SearchOptions): Question[] {
  let results = [...illinoisDMVQuestions];
  
  if (options.query) {
    const query = options.query.toLowerCase();
    results = results.filter(q =>
      q.question_text.toLowerCase().includes(query) ||
      q.explanation.toLowerCase().includes(query) ||
      q.options.some(opt => opt.toLowerCase().includes(query))
    );
  }
  
  if (options.category) {
    results = results.filter(q => q.category_id === options.category);
  }
  
  if (options.difficulty) {
    results = results.filter(q => q.difficulty === options.difficulty);
  }
  
  if (options.hasImage !== undefined) {
    results = results.filter(q => q.has_image === options.hasImage);
  }
  
  if (options.source) {
    results = results.filter(q => q.source.toLowerCase().includes(options.source!.toLowerCase()));
  }
  
  return results;
}

/**
 * Get questions by source (DMV manual chapter)
 */
export function getQuestionsBySource(sourcePattern: string): Question[] {
  return illinoisDMVQuestions.filter(q => 
    q.source.toLowerCase().includes(sourcePattern.toLowerCase())
  );
}

/**
 * Preload questions into cache
 */
export function preloadQuestions(): void {
  // Preload common filter combinations
  const commonFilters: QuestionFilter[] = [
    { random: true, limit: 35 }, // Standard test
    { difficulty: 'easy', random: true, limit: 20 },
    { difficulty: 'medium', random: true, limit: 20 },
    { difficulty: 'hard', random: true, limit: 20 },
    { has_image: true, random: true, limit: 20 },
  ];
  
  commonFilters.forEach(filter => {
    loadQuestions(filter);
  });
  
  // Preload by category
  const categories = [
    'traffic-signs',
    'traffic-laws',
    'safe-driving',
    'alcohol-drugs',
    'sharing-road',
    'parking-emergency',
    'vehicle-equipment',
    'road-conditions',
    'illinois-specific',
  ];
  
  categories.forEach(cat => {
    loadQuestions({ category_id: cat, random: true });
  });
}

/**
 * Clear question cache
 */
export function clearQuestionCache(): void {
  cache.clear();
}

/**
 * Get question bank metadata
 */
export function getQuestionBankMetadata() {
  return {
    totalQuestions: illinoisDMVQuestions.length,
    categories: [...new Set(illinoisDMVQuestions.map(q => q.category_id))],
    difficultyDistribution: {
      easy: illinoisDMVQuestions.filter(q => q.difficulty === 'easy').length,
      medium: illinoisDMVQuestions.filter(q => q.difficulty === 'medium').length,
      hard: illinoisDMVQuestions.filter(q => q.difficulty === 'hard').length,
    },
    imageCount: illinoisDMVQuestions.filter(q => q.has_image).length,
    sources: [...new Set(illinoisDMVQuestions.map(q => q.source.split(' - ')[0]))],
  };
}
