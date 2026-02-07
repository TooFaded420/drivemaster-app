import { XP_CONFIG, LEVEL_THRESHOLDS } from "@/lib/constants";

export interface XPCalculationInput {
  correctAnswers: number;
  totalQuestions: number;
  averageTimePerQuestion: number; // in seconds
  streakCount: number;
  isFirstAttempt: boolean;
  difficulty: "easy" | "medium" | "hard";
}

export interface XPCalculationResult {
  baseXP: number;
  speedBonus: number;
  streakBonus: number;
  perfectBonus: number;
  firstAttemptBonus: number;
  difficultyBonus: number;
  totalXP: number;
  breakdown: {
    label: string;
    value: number;
    description: string;
  }[];
}

// Speed thresholds (in seconds)
const SPEED_THRESHOLDS = {
  FAST: 10,    // Answered in < 10 seconds
  MEDIUM: 20,  // Answered in < 20 seconds
  SLOW: 30,    // Answered in < 30 seconds
};

// Speed bonus multipliers
const SPEED_MULTIPLIERS = {
  FAST: 0.5,    // 50% bonus for fast answers
  MEDIUM: 0.25, // 25% bonus for medium speed
  SLOW: 0.1,    // 10% bonus for slower answers
  NONE: 0,      // No bonus
};

// Streak bonus per correct answer in a row
const STREAK_BONUS_PER_ANSWER = 1;
const MAX_STREAK_BONUS = 10;

/**
 * Calculate XP earned from a quiz session
 */
export function calculateXP(input: XPCalculationInput): XPCalculationResult {
  const {
    correctAnswers,
    totalQuestions,
    averageTimePerQuestion,
    streakCount,
    isFirstAttempt,
    difficulty,
  } = input;

  const breakdown: { label: string; value: number; description: string }[] = [];

  // Base XP for correct answers
  const baseXPPerQuestion =
    difficulty === "hard"
      ? XP_CONFIG.CORRECT_ANSWER_HARD
      : XP_CONFIG.CORRECT_ANSWER;
  const baseXP = correctAnswers * baseXPPerQuestion;
  breakdown.push({
    label: "Correct Answers",
    value: baseXP,
    description: `${correctAnswers} × ${baseXPPerQuestion} XP`,
  });

  // Speed bonus based on average time per question
  let speedMultiplier = SPEED_MULTIPLIERS.NONE;
  if (averageTimePerQuestion < SPEED_THRESHOLDS.FAST) {
    speedMultiplier = SPEED_MULTIPLIERS.FAST;
  } else if (averageTimePerQuestion < SPEED_THRESHOLDS.MEDIUM) {
    speedMultiplier = SPEED_MULTIPLIERS.MEDIUM;
  } else if (averageTimePerQuestion < SPEED_THRESHOLDS.SLOW) {
    speedMultiplier = SPEED_MULTIPLIERS.SLOW;
  }

  const speedBonus = Math.round(baseXP * speedMultiplier);
  if (speedBonus > 0) {
    breakdown.push({
      label: "Speed Bonus",
      value: speedBonus,
      description: `Avg ${Math.round(averageTimePerQuestion)}s per question`,
    });
  }

  // Streak bonus (capped at max)
  const streakBonus = Math.min(streakCount * STREAK_BONUS_PER_ANSWER, MAX_STREAK_BONUS);
  if (streakBonus > 0) {
    breakdown.push({
      label: "Streak Bonus",
      value: streakBonus,
      description: `${streakCount} in a row`,
    });
  }

  // Perfect quiz bonus (100% correct)
  let perfectBonus = 0;
  if (correctAnswers === totalQuestions && totalQuestions >= 5) {
    perfectBonus = XP_CONFIG.PERFECT_QUIZ;
    breakdown.push({
      label: "Perfect Quiz!",
      value: perfectBonus,
      description: "100% correct answers",
    });
  }

  // First attempt bonus
  let firstAttemptBonus = 0;
  if (isFirstAttempt) {
    firstAttemptBonus = 20;
    breakdown.push({
      label: "First Attempt",
      value: firstAttemptBonus,
      description: "First time taking this quiz",
    });
  }

  // Difficulty bonus for hard questions
  let difficultyBonus = 0;
  if (difficulty === "hard") {
    difficultyBonus = Math.round(baseXP * 0.2); // 20% bonus for hard
    breakdown.push({
      label: "Hard Mode",
      value: difficultyBonus,
      description: "Extra challenge rewarded",
    });
  }

  const totalXP =
    baseXP + speedBonus + streakBonus + perfectBonus + firstAttemptBonus + difficultyBonus;

  return {
    baseXP,
    speedBonus,
    streakBonus,
    perfectBonus,
    firstAttemptBonus,
    difficultyBonus,
    totalXP,
    breakdown,
  };
}

/**
 * Calculate XP for a single correct answer
 */
export function calculateAnswerXP(
  isCorrect: boolean,
  timeTaken: number,
  currentStreak: number,
  difficulty: "easy" | "medium" | "hard" = "medium"
): number {
  if (!isCorrect) return 0;

  const baseXP =
    difficulty === "hard" ? XP_CONFIG.CORRECT_ANSWER_HARD : XP_CONFIG.CORRECT_ANSWER;

  // Speed bonus
  let speedBonus = 0;
  if (timeTaken < SPEED_THRESHOLDS.FAST) {
    speedBonus = 5; // Max 5 XP for fast answers
  } else if (timeTaken < SPEED_THRESHOLDS.MEDIUM) {
    speedBonus = 3;
  } else if (timeTaken < SPEED_THRESHOLDS.SLOW) {
    speedBonus = 1;
  }

  // Streak bonus (capped)
  const streakBonus = Math.min(currentStreak, MAX_STREAK_BONUS);

  return baseXP + speedBonus + streakBonus;
}

/**
 * Get current level from total XP
 */
export function getLevelFromXP(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Get XP progress towards next level
 */
export function getXPProgress(totalXP: number): {
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercentage: number;
} {
  const currentLevel = getLevelFromXP(totalXP);
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100)
  );

  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
}

/**
 * Calculate combo multiplier based on streak
 */
export function getComboMultiplier(streak: number): number {
  if (streak >= 10) return 2.0;
  if (streak >= 7) return 1.75;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

/**
 * Format XP number with commas
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Get level title based on level number
 */
export function getLevelTitle(level: number): string {
  const titles = [
    "New Driver",
    "Learner's Permit",
    "Student Driver",
    "Novice Driver",
    "Confident Driver",
    "Skilled Driver",
    "Expert Driver",
    "Master Driver",
    "Road Warrior",
    "Highway Hero",
    "Traffic Tamer",
    "Street Smart",
    "Driving Pro",
    "Road Master",
    "Legendary Driver",
    "Driving Champion",
    "Ultimate Driver",
    "Driving Legend",
    "Road King",
    "Driving God",
  ];

  return titles[Math.min(level - 1, titles.length - 1)] || "Driving Master";
}
