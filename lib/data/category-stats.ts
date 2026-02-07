/**
 * Category Statistics Calculator
 * Tracks and analyzes performance by question category
 */

import { Question, CategoryStats, UserQuestionProgress, DifficultyLevel } from './questions/types';
import { ILLINOIS_CATEGORIES, getCategoryById, CategoryId } from './questions/categories';
import { getQuestionsByCategory, illinoisDMVQuestions } from './questions';

/**
 * User's category performance data
 */
export interface UserCategoryPerformance {
  category_id: string;
  category_name: string;
  total_questions: number;
  questions_attempted: number;
  questions_correct: number;
  questions_mastered: number;
  accuracy_rate: number;
  completion_rate: number;
  average_time_seconds?: number;
  last_studied: string | null;
  streak_days: number;
  weak_question_ids: string[];
  strong_question_ids: string[];
}

/**
 * Study recommendations based on performance
 */
export interface StudyRecommendation {
  category_id: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  recommended_questions: number;
  focus_areas: string[];
}

/**
 * Calculate comprehensive category stats for a user
 */
export function calculateUserCategoryStats(
  userProgress: UserQuestionProgress[]
): UserCategoryPerformance[] {
  return ILLINOIS_CATEGORIES.map(category => {
    const categoryQuestions = getQuestionsByCategory(category.id as CategoryId);
    const totalQuestions = categoryQuestions.length;
    
    // Get progress for this category's questions
    const categoryProgress = userProgress.filter(p =>
      categoryQuestions.some(q => q.id === p.question_id)
    );
    
    const attempted = categoryProgress.length;
    const correct = categoryProgress.reduce((sum, p) => sum + p.times_correct, 0);
    const mastered = categoryProgress.filter(p => p.mastered).length;
    const totalAttempts = categoryProgress.reduce((sum, p) => sum + p.times_seen, 0);
    
    const accuracyRate = totalAttempts > 0 ? correct / totalAttempts : 0;
    const completionRate = totalQuestions > 0 ? attempted / totalQuestions : 0;
    
    // Find last studied date
    const lastStudied = categoryProgress.length > 0
      ? categoryProgress.sort((a, b) => 
          new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime()
        )[0].last_seen
      : null;
    
    // Identify weak and strong questions
    const weakQuestions = categoryProgress
      .filter(p => p.times_seen > 0 && p.times_correct / p.times_seen < 0.6)
      .map(p => p.question_id);
    
    const strongQuestions = categoryProgress
      .filter(p => p.times_seen >= 3 && p.times_correct / p.times_seen >= 0.8)
      .map(p => p.question_id);
    
    // Calculate streak (consecutive days studied)
    const streakDays = calculateStudyStreak(categoryProgress);
    
    return {
      category_id: category.id,
      category_name: category.name,
      total_questions: totalQuestions,
      questions_attempted: attempted,
      questions_correct: correct,
      questions_mastered: mastered,
      accuracy_rate: accuracyRate,
      completion_rate: completionRate,
      last_studied: lastStudied,
      streak_days: streakDays,
      weak_question_ids: weakQuestions,
      strong_question_ids: strongQuestions,
    };
  });
}

/**
 * Calculate study streak from progress data
 */
function calculateStudyStreak(progress: UserQuestionProgress[]): number {
  if (progress.length === 0) return 0;
  
  // Get unique dates studied
  const studyDates = [...new Set(
    progress.map(p => new Date(p.last_seen).toDateString())
  )].map(d => new Date(d).getTime()).sort((a, b) => b - a);
  
  if (studyDates.length === 0) return 0;
  
  // Check if studied today
  const today = new Date().setHours(0, 0, 0, 0);
  const lastStudyDate = new Date(studyDates[0]).setHours(0, 0, 0, 0);
  
  if (lastStudyDate < today - 86400000) return 0; // More than 1 day gap
  
  // Count consecutive days
  let streak = 1;
  for (let i = 1; i < studyDates.length; i++) {
    const current = new Date(studyDates[i - 1]).setHours(0, 0, 0, 0);
    const previous = new Date(studyDates[i]).setHours(0, 0, 0, 0);
    
    if (current - previous === 86400000) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Generate study recommendations based on performance
 */
export function generateStudyRecommendations(
  userPerformance: UserCategoryPerformance[]
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];
  
  userPerformance.forEach(perf => {
    let priority: 'high' | 'medium' | 'low' = 'low';
    let reason = '';
    let recommendedQuestions = 10;
    
    // High priority: Low accuracy or not started
    if (perf.accuracy_rate < 0.6 && perf.questions_attempted > 5) {
      priority = 'high';
      reason = `Low accuracy (${Math.round(perf.accuracy_rate * 100)}%) - needs review`;
      recommendedQuestions = 20;
    } else if (perf.completion_rate < 0.3) {
      priority = 'high';
      reason = 'Not started or barely studied';
      recommendedQuestions = 15;
    } else if (perf.accuracy_rate < 0.75) {
      priority = 'medium';
      reason = `Room for improvement (${Math.round(perf.accuracy_rate * 100)}% accuracy)`;
      recommendedQuestions = 15;
    } else if (perf.streak_days === 0 && perf.last_studied) {
      priority = 'medium';
      reason = 'Has not been studied recently';
      recommendedQuestions = 10;
    }
    
    if (priority !== 'low') {
      recommendations.push({
        category_id: perf.category_id,
        priority,
        reason,
        recommended_questions: Math.min(recommendedQuestions, perf.total_questions),
        focus_areas: perf.weak_question_ids.slice(0, 5),
      });
    }
  });
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Get overall user statistics
 */
export function getOverallStats(userProgress: UserQuestionProgress[]) {
  const categoryStats = calculateUserCategoryStats(userProgress);
  
  const totalQuestions = illinoisDMVQuestions.length;
  const totalAttempted = new Set(userProgress.map(p => p.question_id)).size;
  const totalCorrect = userProgress.reduce((sum, p) => sum + p.times_correct, 0);
  const totalAttempts = userProgress.reduce((sum, p) => sum + p.times_seen, 0);
  const totalMastered = userProgress.filter(p => p.mastered).length;
  
  // Find strongest and weakest categories
  const sortedByAccuracy = [...categoryStats].sort((a, b) => b.accuracy_rate - a.accuracy_rate);
  
  return {
    total_questions: totalQuestions,
    questions_attempted: totalAttempted,
    questions_mastered: totalMastered,
    completion_percentage: Math.round((totalAttempted / totalQuestions) * 100),
    overall_accuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
    strongest_category: sortedByAccuracy[0]?.category_id || null,
    weakest_category: sortedByAccuracy[sortedByAccuracy.length - 1]?.category_id || null,
    categories_studied: categoryStats.filter(c => c.questions_attempted > 0).length,
    total_categories: ILLINOIS_CATEGORIES.length,
    study_streak_days: Math.max(...categoryStats.map(c => c.streak_days)),
  };
}

/**
 * Get category comparison data
 */
export function getCategoryComparison(userProgress: UserQuestionProgress[]) {
  const stats = calculateUserCategoryStats(userProgress);
  
  return {
    labels: stats.map(s => s.category_name),
    accuracy: stats.map(s => Math.round(s.accuracy_rate * 100)),
    completion: stats.map(s => Math.round(s.completion_rate * 100)),
    mastered: stats.map(s => s.questions_mastered),
    colors: ILLINOIS_CATEGORIES.map(c => c.color),
  };
}

/**
 * Get progress over time (for charts)
 */
export function getProgressOverTime(
  userProgress: UserQuestionProgress[],
  days: number = 30
) {
  const today = new Date();
  const data: { date: string; questions_attempted: number; accuracy: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayProgress = userProgress.filter(p => 
      p.last_seen.startsWith(dateString)
    );
    
    const attempted = dayProgress.length;
    const correct = dayProgress.reduce((sum, p) => sum + p.times_correct, 0);
    const total = dayProgress.reduce((sum, p) => sum + p.times_seen, 0);
    
    data.push({
      date: dateString,
      questions_attempted: attempted,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    });
  }
  
  return data;
}

/**
 * Get difficulty breakdown for a category
 */
export function getCategoryDifficultyBreakdown(categoryId: string) {
  const questions = getQuestionsByCategory(categoryId as CategoryId);
  
  return {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };
}

/**
 * Calculate mastery level
 */
export function calculateMasteryLevel(
  userProgress: UserQuestionProgress[]
): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const totalQuestions = illinoisDMVQuestions.length;
  const attempted = new Set(userProgress.map(p => p.question_id)).size;
  const mastered = userProgress.filter(p => p.mastered).length;
  
  const completionRate = attempted / totalQuestions;
  const masteryRate = mastered / totalQuestions;
  
  if (masteryRate >= 0.8 && completionRate >= 0.9) return 'expert';
  if (masteryRate >= 0.6 && completionRate >= 0.75) return 'advanced';
  if (masteryRate >= 0.3 && completionRate >= 0.5) return 'intermediate';
  return 'beginner';
}

/**
 * Get next milestone
 */
export function getNextMilestone(userProgress: UserQuestionProgress[]) {
  const stats = getOverallStats(userProgress);
  const milestones = [
    { type: 'completion', target: 25, label: '25% Complete' },
    { type: 'completion', target: 50, label: 'Halfway There' },
    { type: 'completion', target: 75, label: '75% Complete' },
    { type: 'completion', target: 100, label: 'All Questions Seen' },
    { type: 'mastery', target: 50, label: '50 Questions Mastered' },
    { type: 'mastery', target: 100, label: '100 Questions Mastered' },
    { type: 'mastery', target: 150, label: '150 Questions Mastered' },
    { type: 'mastery', target: 200, label: '200 Questions Mastered' },
  ];
  
  for (const milestone of milestones) {
    const current = milestone.type === 'completion' 
      ? stats.completion_percentage 
      : stats.questions_mastered;
    
    if (current < milestone.target) {
      return {
        ...milestone,
        current,
        remaining: milestone.target - current,
      };
    }
  }
  
  return null; // All milestones achieved
}
