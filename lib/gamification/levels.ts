import { LEVEL_THRESHOLDS } from "@/lib/constants";
import { getLevelFromXP, getXPForNextLevel, getXPProgress, getLevelTitle } from "./xp-calculator";

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercentage: number;
  rewards: LevelReward[];
}

export interface LevelReward {
  type: "avatar" | "theme" | "badge" | "feature" | "title";
  name: string;
  description: string;
  icon?: string;
}

// Level rewards configuration
const LEVEL_REWARDS: Record<number, LevelReward[]> = {
  1: [
    { type: "feature", name: "Basic Quizzes", description: "Access to practice quizzes" },
  ],
  2: [
    { type: "feature", name: "Progress Tracking", description: "Track your learning progress" },
    { type: "theme", name: "Classic Theme", description: "Default blue theme" },
  ],
  3: [
    { type: "feature", name: "Category Practice", description: "Practice specific categories" },
    { type: "badge", name: "Rising Star", description: "Reached level 3" },
  ],
  5: [
    { type: "feature", name: "Timed Tests", description: "Take timed practice tests" },
    { type: "theme", name: "Dark Mode", description: "Easier on the eyes" },
  ],
  7: [
    { type: "feature", name: "Marathon Mode", description: "Practice with all questions" },
    { type: "badge", name: "Dedicated Learner", description: "Reached level 7" },
  ],
  10: [
    { type: "feature", name: "Leaderboards", description: "Compete with other learners" },
    { type: "theme", name: "Gold Theme", description: "Premium gold appearance" },
    { type: "title", name: "Expert Driver", description: "Show off your expertise" },
  ],
  15: [
    { type: "feature", name: "Advanced Analytics", description: "Detailed performance insights" },
    { type: "badge", name: "Master Driver", description: "Reached level 15" },
  ],
  20: [
    { type: "feature", name: "All Features", description: "Unlock everything" },
    { type: "theme", name: "Legendary Theme", description: "Exclusive legendary appearance" },
    { type: "title", name: "Driving Legend", description: "Ultimate achievement" },
  ],
};

/**
 * Get level information for a user
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  const progress = getXPProgress(totalXP);
  const level = progress.currentLevel;

  return {
    level,
    title: getLevelTitle(level),
    xpRequired: progress.currentLevelXP,
    xpForNextLevel: progress.nextLevelXP,
    xpInCurrentLevel: progress.xpInCurrentLevel,
    xpNeededForNextLevel: progress.xpNeededForNextLevel,
    progressPercentage: progress.progressPercentage,
    rewards: getRewardsForLevel(level),
  };
}

/**
 * Get rewards for a specific level
 */
export function getRewardsForLevel(level: number): LevelReward[] {
  const rewards: LevelReward[] = [];

  // Collect all rewards up to and including this level
  for (let i = 1; i <= level; i++) {
    if (LEVEL_REWARDS[i]) {
      rewards.push(...LEVEL_REWARDS[i]);
    }
  }

  return rewards;
}

/**
 * Get rewards for reaching a new level
 */
export function getNewLevelRewards(level: number): LevelReward[] {
  return LEVEL_REWARDS[level] || [];
}

/**
 * Check if user leveled up after earning XP
 */
export function checkLevelUp(
  previousXP: number,
  newXP: number
): { didLevelUp: boolean; newLevel?: number; rewards?: LevelReward[] } {
  const previousLevel = getLevelFromXP(previousXP);
  const newLevel = getLevelFromXP(newXP);

  if (newLevel > previousLevel) {
    return {
      didLevelUp: true,
      newLevel,
      rewards: getNewLevelRewards(newLevel),
    };
  }

  return { didLevelUp: false };
}

/**
 * Get all levels info for display
 */
export function getAllLevels(): {
  level: number;
  xpRequired: number;
  title: string;
  hasRewards: boolean;
}[] {
  return LEVEL_THRESHOLDS.map((xp, index) => ({
    level: index + 1,
    xpRequired: xp,
    title: getLevelTitle(index + 1),
    hasRewards: !!LEVEL_REWARDS[index + 1],
  }));
}

/**
 * Get next milestone level
 */
export function getNextMilestoneLevel(currentLevel: number): number | null {
  const milestoneLevels = Object.keys(LEVEL_REWARDS)
    .map(Number)
    .sort((a, b) => a - b);

  for (const level of milestoneLevels) {
    if (level > currentLevel) {
      return level;
    }
  }

  return null;
}

/**
 * Get XP needed for a specific level
 */
export function getXPForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0;
  if (targetLevel > LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[targetLevel - 1];
}

/**
 * Calculate XP multiplier based on level
 * Higher levels get slightly more XP to reward dedication
 */
export function getLevelXPMultiplier(level: number): number {
  // Base multiplier is 1.0
  // Every 5 levels adds 0.05 to the multiplier
  return 1.0 + Math.floor((level - 1) / 5) * 0.05;
}
