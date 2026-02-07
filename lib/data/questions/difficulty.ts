/**
 * Difficulty Classification System for Illinois DMV Questions
 * Based on question complexity, knowledge depth required, and common error rates
 */

import { DifficultyLevel, Question, DifficultyAdjustment } from './types';

// Difficulty weights for scoring
interface DifficultyCriteria {
  word_count: number;
  concept_complexity: 1 | 2 | 3;
  exception_count: number;
  numerical_data: boolean;
  similar_options: boolean;
  illinois_specific: boolean;
}

// Criteria thresholds for classification
const DIFFICULTY_THRESHOLDS = {
  easy: {
    max_word_count: 25,
    max_concept_complexity: 1,
    max_exceptions: 0,
    allow_numerical: false,
    allow_similar_options: false,
  },
  medium: {
    max_word_count: 45,
    max_concept_complexity: 2,
    max_exceptions: 1,
    allow_numerical: true,
    allow_similar_options: true,
  },
  hard: {
    // No limits - anything above medium is hard
  },
};

/**
 * Analyze question characteristics to determine difficulty
 */
export function analyzeQuestionDifficulty(question: Question): DifficultyCriteria {
  const word_count = question.question_text.split(' ').length;
  
  // Count exceptions (words like "except", "unless", "however")
  const exceptionWords = ['except', 'unless', 'however', 'but', 'not', 'never', 'always'];
  const exception_count = exceptionWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = question.question_text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Check for numerical data (speed limits, distances, percentages)
  const numerical_data = /\d+/.test(question.question_text);
  
  // Check for similar options (indicates trickier questions)
  const optionTexts = question.options.map(opt => opt.toLowerCase());
  const similar_options = optionTexts.some((opt, i) => 
    optionTexts.slice(i + 1).some(other => {
      // Check for high similarity
      const words1 = opt.split(' ');
      const words2 = other.split(' ');
      const common = words1.filter(w => words2.includes(w));
      return common.length / Math.max(words1.length, words2.length) > 0.7;
    })
  );
  
  // Check for Illinois-specific content
  const illinoisTerms = ['illinois', 'scott\'s law', 'move over', 'secretary of state', 'graduated driver license', 'gdl'];
  const illinois_specific = illinoisTerms.some(term => 
    question.question_text.toLowerCase().includes(term)
  );
  
  // Determine concept complexity based on explanation length and content
  let concept_complexity: 1 | 2 | 3 = 1;
  const explanationLength = question.explanation.split(' ').length;
  if (explanationLength > 50 || question.explanation.includes('however') || question.explanation.includes('additionally')) {
    concept_complexity = 3;
  } else if (explanationLength > 25) {
    concept_complexity = 2;
  }
  
  return {
    word_count,
    concept_complexity,
    exception_count,
    numerical_data,
    similar_options,
    illinois_specific,
  };
}

/**
 * Classify question difficulty based on analysis
 */
export function classifyDifficulty(question: Question): DifficultyLevel {
  const criteria = analyzeQuestionDifficulty(question);
  
  // Easy criteria
  if (
    criteria.word_count <= DIFFICULTY_THRESHOLDS.easy.max_word_count &&
    criteria.concept_complexity <= DIFFICULTY_THRESHOLDS.easy.max_concept_complexity &&
    criteria.exception_count <= DIFFICULTY_THRESHOLDS.easy.max_exceptions &&
    !criteria.numerical_data &&
    !criteria.similar_options
  ) {
    return 'easy';
  }
  
  // Medium criteria
  if (
    criteria.word_count <= DIFFICULTY_THRESHOLDS.medium.max_word_count &&
    criteria.concept_complexity <= DIFFICULTY_THRESHOLDS.medium.max_concept_complexity &&
    criteria.exception_count <= DIFFICULTY_THRESHOLDS.medium.max_exceptions
  ) {
    return 'medium';
  }
  
  // Hard - everything else
  return 'hard';
}

/**
 * Calculate adaptive difficulty adjustment based on user performance
 */
export function calculateAdaptiveDifficulty(
  recentAccuracy: number,
  currentStreak: number,
  totalAnswered: number,
  currentDifficulty: DifficultyLevel
): DifficultyAdjustment {
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const currentIndex = difficulties.indexOf(currentDifficulty);
  
  let adjustment = 0;
  let reason = '';
  let confidence = 0;
  
  // Accuracy-based adjustment
  if (recentAccuracy >= 0.9 && currentStreak >= 5) {
    adjustment = 1;
    reason = 'Excellent performance - increasing difficulty';
    confidence = Math.min(recentAccuracy * currentStreak / 10, 1);
  } else if (recentAccuracy >= 0.8 && currentStreak >= 3) {
    adjustment = 1;
    reason = 'Strong performance - increasing difficulty';
    confidence = recentAccuracy * 0.8;
  } else if (recentAccuracy < 0.5 && totalAnswered >= 5) {
    adjustment = -1;
    reason = 'Struggling with current difficulty - decreasing';
    confidence = 1 - recentAccuracy;
  } else if (recentAccuracy < 0.3) {
    adjustment = -1;
    reason = 'Low accuracy - decreasing difficulty for better learning';
    confidence = 0.9;
  } else {
    reason = 'Maintaining current difficulty level';
    confidence = 0.5;
  }
  
  // Calculate new difficulty
  const newIndex = Math.max(0, Math.min(difficulties.length - 1, currentIndex + adjustment));
  const recommendedDifficulty = difficulties[newIndex];
  
  return {
    current_difficulty: currentDifficulty,
    recommended_difficulty: recommendedDifficulty,
    reason,
    confidence,
  };
}

/**
 * Get difficulty distribution for a balanced quiz
 */
export function getDifficultyDistribution(
  totalQuestions: number,
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced'
): Record<DifficultyLevel, number> {
  const distributions = {
    beginner: { easy: 0.6, medium: 0.3, hard: 0.1 },
    intermediate: { easy: 0.3, medium: 0.5, hard: 0.2 },
    advanced: { easy: 0.1, medium: 0.4, hard: 0.5 },
  };
  
  const dist = distributions[userSkillLevel];
  return {
    easy: Math.round(totalQuestions * dist.easy),
    medium: Math.round(totalQuestions * dist.medium),
    hard: Math.round(totalQuestions * dist.hard),
  };
}

/**
 * Get XP multiplier based on difficulty
 */
export function getDifficultyMultiplier(difficulty: DifficultyLevel): number {
  const multipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };
  return multipliers[difficulty];
}

/**
 * Get time limit recommendation based on difficulty
 */
export function getRecommendedTimeLimit(difficulty: DifficultyLevel): number {
  const timeLimits = {
    easy: 30,    // 30 seconds
    medium: 45,  // 45 seconds
    hard: 60,    // 60 seconds
  };
  return timeLimits[difficulty];
}

/**
 * Validate that difficulty is correctly assigned
 */
export function validateDifficulty(question: Question): {
  valid: boolean;
  assigned: DifficultyLevel;
  calculated: DifficultyLevel;
  mismatch: boolean;
} {
  const calculated = classifyDifficulty(question);
  const assigned = question.difficulty;
  
  // Allow one level of difference (e.g., easy can be marked medium if intentionally tricky)
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const assignedIndex = difficulties.indexOf(assigned);
  const calculatedIndex = difficulties.indexOf(calculated);
  
  return {
    valid: true,
    assigned,
    calculated,
    mismatch: Math.abs(assignedIndex - calculatedIndex) > 1,
  };
}
