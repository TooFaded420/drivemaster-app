/**
 * Data Module Exports
 * Central export point for all data-related functionality
 */

// Question data (types, categories, difficulty, questions)
export * from './questions';

// Question loader utilities (explicit exports to avoid conflicts)
export {
  loadQuestions,
  loadQuestionById,
  loadQuizQuestions,
  calculateCategoryStats,
  getRecommendedQuestions,
  searchQuestions as searchQuestionsAdvanced,
  getQuestionsBySource,
  preloadQuestions,
  clearQuestionCache,
  getQuestionBankMetadata,
} from './question-loader';

// Category statistics
export * from './category-stats';

// Adaptive difficulty
export * from './adaptive-difficulty';

// Content seeder
export { seedDatabase, validateQuestions, generateMigrationSQL, exportQuestionsAsJSON } from './content-seeder';

// Question validator
export { validateQuestionBank, verifyAnswerKeys, verifySourceCitations, findSimilarQuestions, generateValidationReport } from './question-validator';
