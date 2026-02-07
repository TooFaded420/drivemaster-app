/**
 * Adaptive Difficulty System
 * Adjusts question difficulty based on user performance
 */

import { DifficultyLevel, DifficultyAdjustment, Question } from './questions/types';
import { classifyDifficulty, getDifficultyDistribution, calculateAdaptiveDifficulty } from './questions/difficulty';

/**
 * User performance metrics for adaptive system
 */
export interface UserPerformanceMetrics {
  recent_accuracy: number;        // Accuracy over last N questions
  current_streak: number;         // Current correct answer streak
  total_answered: number;         // Total questions answered
  difficulty_performance: Record<DifficultyLevel, {
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  average_response_time: number;  // Average time to answer
  session_start_time: number;     // When current session started
}

/**
 * Adaptive session configuration
 */
export interface AdaptiveSessionConfig {
  userId: string;
  targetQuestionCount: number;
  initialDifficulty: DifficultyLevel;
  minDifficulty: DifficultyLevel;
  maxDifficulty: DifficultyLevel;
  adaptInterval: number;          // How often to adjust (questions)
}

/**
 * Session state for adaptive quiz
 */
export interface AdaptiveSessionState {
  sessionId: string;
  currentDifficulty: DifficultyLevel;
  questionsAsked: number;
  correctAnswers: number;
  currentStreak: number;
  questionHistory: {
    questionId: string;
    difficulty: DifficultyLevel;
    correct: boolean;
    timeSpent: number;
  }[];
  difficultyHistory: DifficultyLevel[];
}

/**
 * Performance threshold configuration
 */
const PERFORMANCE_THRESHOLDS = {
  excellent: { accuracy: 0.9, streak: 5 },
  good: { accuracy: 0.8, streak: 3 },
  struggling: { accuracy: 0.5, minQuestions: 5 },
  poor: { accuracy: 0.3 },
};

/**
 * Initialize adaptive session
 */
export function initializeAdaptiveSession(
  config: AdaptiveSessionConfig,
  previousPerformance?: UserPerformanceMetrics
): AdaptiveSessionState {
  // Determine starting difficulty based on previous performance
  let startingDifficulty = config.initialDifficulty;
  
  if (previousPerformance) {
    const avgAccuracy = previousPerformance.recent_accuracy;
    if (avgAccuracy >= 0.85) {
      startingDifficulty = 'hard';
    } else if (avgAccuracy >= 0.65) {
      startingDifficulty = 'medium';
    } else {
      startingDifficulty = 'easy';
    }
  }
  
  return {
    sessionId: generateSessionId(),
    currentDifficulty: startingDifficulty,
    questionsAsked: 0,
    correctAnswers: 0,
    currentStreak: 0,
    questionHistory: [],
    difficultyHistory: [startingDifficulty],
  };
}

/**
 * Record answer and update session state
 */
export function recordAnswer(
  state: AdaptiveSessionState,
  questionId: string,
  correct: boolean,
  timeSpent: number
): AdaptiveSessionState {
  const newState = { ...state };
  
  // Update basic stats
  newState.questionsAsked++;
  if (correct) {
    newState.correctAnswers++;
    newState.currentStreak++;
  } else {
    newState.currentStreak = 0;
  }
  
  // Record in history
  newState.questionHistory.push({
    questionId,
    difficulty: state.currentDifficulty,
    correct,
    timeSpent,
  });
  
  // Check if we should adjust difficulty
  if (newState.questionsAsked % 5 === 0) {
    const adjustment = calculateDifficultyAdjustment(newState);
    newState.currentDifficulty = adjustment.recommended_difficulty;
    newState.difficultyHistory.push(adjustment.recommended_difficulty);
  }
  
  return newState;
}

/**
 * Calculate difficulty adjustment based on session performance
 */
function calculateDifficultyAdjustment(state: AdaptiveSessionState): DifficultyAdjustment {
  const recentQuestions = state.questionHistory.slice(-10);
  const recentAccuracy = recentQuestions.length > 0
    ? recentQuestions.filter(q => q.correct).length / recentQuestions.length
    : 0;
  
  return calculateAdaptiveDifficulty(
    recentAccuracy,
    state.currentStreak,
    state.questionsAsked,
    state.currentDifficulty
  );
}

/**
 * Get next question difficulty recommendation
 */
export function getNextQuestionDifficulty(state: AdaptiveSessionState): DifficultyLevel {
  // If we've asked less than 5 questions, stay at current difficulty
  if (state.questionsAsked < 5) {
    return state.currentDifficulty;
  }
  
  // Calculate adjustment
  const adjustment = calculateDifficultyAdjustment(state);
  return adjustment.recommended_difficulty;
}

/**
 * Generate difficulty distribution for a session
 */
export function generateSessionDifficultyDistribution(
  targetCount: number,
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced'
): Record<DifficultyLevel, number> {
  return getDifficultyDistribution(targetCount, userSkillLevel);
}

/**
 * Determine user skill level based on performance
 */
export function determineUserSkillLevel(
  metrics: UserPerformanceMetrics
): 'beginner' | 'intermediate' | 'advanced' {
  const { recent_accuracy, difficulty_performance } = metrics;
  
  // Check performance on hard questions
  const hardPerf = difficulty_performance.hard;
  if (hardPerf.attempted >= 10 && hardPerf.accuracy >= 0.7) {
    return 'advanced';
  }
  
  // Check performance on medium questions
  const mediumPerf = difficulty_performance.medium;
  if (mediumPerf.attempted >= 10 && mediumPerf.accuracy >= 0.75) {
    return 'intermediate';
  }
  
  // Default based on overall accuracy
  if (recent_accuracy >= 0.8) return 'advanced';
  if (recent_accuracy >= 0.6) return 'intermediate';
  return 'beginner';
}

/**
 * Calculate performance trend
 */
export function calculatePerformanceTrend(
  history: { correct: boolean; difficulty: DifficultyLevel }[]
): 'improving' | 'stable' | 'declining' {
  if (history.length < 10) return 'stable';
  
  const firstHalf = history.slice(0, Math.floor(history.length / 2));
  const secondHalf = history.slice(Math.floor(history.length / 2));
  
  const firstAccuracy = firstHalf.filter(h => h.correct).length / firstHalf.length;
  const secondAccuracy = secondHalf.filter(h => h.correct).length / secondHalf.length;
  
  const diff = secondAccuracy - firstAccuracy;
  
  if (diff > 0.1) return 'improving';
  if (diff < -0.1) return 'declining';
  return 'stable';
}

/**
 * Get personalized difficulty recommendation
 */
export function getPersonalizedDifficulty(
  userId: string,
  performanceHistory: UserPerformanceMetrics
): {
  recommendedDifficulty: DifficultyLevel;
  confidence: number;
  reasoning: string;
} {
  const skillLevel = determineUserSkillLevel(performanceHistory);
  const trend = calculatePerformanceTrend(
    performanceHistory.difficulty_performance.medium?.attempted > 0
      ? Object.values(performanceHistory.difficulty_performance).flatMap(d => 
          Array(d.attempted).fill({ correct: d.accuracy > 0.5 })
        )
      : []
  );
  
  let recommendedDifficulty: DifficultyLevel = 'medium';
  let confidence = 0.7;
  let reasoning = '';
  
  switch (skillLevel) {
    case 'advanced':
      recommendedDifficulty = 'hard';
      confidence = 0.85;
      reasoning = 'Consistently performing well on difficult questions';
      break;
    case 'intermediate':
      recommendedDifficulty = trend === 'improving' ? 'hard' : 'medium';
      confidence = 0.75;
      reasoning = trend === 'improving' 
        ? 'Showing improvement, ready for harder questions'
        : 'Solid performance at medium difficulty';
      break;
    case 'beginner':
      recommendedDifficulty = trend === 'improving' ? 'medium' : 'easy';
      confidence = 0.8;
      reasoning = trend === 'improving'
        ? 'Improving - try medium difficulty'
        : 'Building foundation with easier questions';
      break;
  }
  
  return { recommendedDifficulty, confidence, reasoning };
}

/**
 * Create adaptive question selector
 */
export function createAdaptiveQuestionSelector(
  availableQuestions: Question[],
  sessionState: AdaptiveSessionState
) {
  return {
    selectNextQuestion(): Question | null {
      const targetDifficulty = getNextQuestionDifficulty(sessionState);
      
      // Filter questions by difficulty and exclude already asked
      const askedIds = new Set(sessionState.questionHistory.map(h => h.questionId));
      const eligibleQuestions = availableQuestions.filter(
        q => q.difficulty === targetDifficulty && !askedIds.has(q.id)
      );
      
      if (eligibleQuestions.length === 0) {
        // Fall back to any difficulty
        const fallbackQuestions = availableQuestions.filter(
          q => !askedIds.has(q.id)
        );
        if (fallbackQuestions.length === 0) return null;
        
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
      }
      
      // Select random question from eligible
      return eligibleQuestions[Math.floor(Math.random() * eligibleQuestions.length)];
    },
    
    getRemainingCount(): number {
      const askedIds = new Set(sessionState.questionHistory.map(h => h.questionId));
      return availableQuestions.filter(q => !askedIds.has(q.id)).length;
    },
    
    getSessionStats() {
      return {
        questionsAsked: sessionState.questionsAsked,
        correctAnswers: sessionState.correctAnswers,
        accuracy: sessionState.questionsAsked > 0
          ? sessionState.correctAnswers / sessionState.questionsAsked
          : 0,
        currentStreak: sessionState.currentStreak,
        currentDifficulty: sessionState.currentDifficulty,
      };
    },
  };
}

/**
 * Generate session report
 */
export function generateSessionReport(
  state: AdaptiveSessionState
): {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  difficultyProgression: DifficultyLevel[];
  performanceByDifficulty: Record<DifficultyLevel, { attempted: number; correct: number }>;
  averageTimePerQuestion: number;
} {
  const performanceByDifficulty: Record<DifficultyLevel, { attempted: number; correct: number }> = {
    easy: { attempted: 0, correct: 0 },
    medium: { attempted: 0, correct: 0 },
    hard: { attempted: 0, correct: 0 },
  };
  
  state.questionHistory.forEach(q => {
    performanceByDifficulty[q.difficulty].attempted++;
    if (q.correct) {
      performanceByDifficulty[q.difficulty].correct++;
    }
  });
  
  const totalTime = state.questionHistory.reduce((sum, q) => sum + q.timeSpent, 0);
  
  return {
    totalQuestions: state.questionsAsked,
    correctAnswers: state.correctAnswers,
    accuracy: state.questionsAsked > 0 ? state.correctAnswers / state.questionsAsked : 0,
    difficultyProgression: state.difficultyHistory,
    performanceByDifficulty,
    averageTimePerQuestion: state.questionsAsked > 0 ? totalTime / state.questionsAsked : 0,
  };
}

/**
 * Utility: Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export default adaptive configuration
 */
export const DEFAULT_ADAPTIVE_CONFIG: AdaptiveSessionConfig = {
  userId: '',
  targetQuestionCount: 35,
  initialDifficulty: 'medium',
  minDifficulty: 'easy',
  maxDifficulty: 'hard',
  adaptInterval: 5,
};
