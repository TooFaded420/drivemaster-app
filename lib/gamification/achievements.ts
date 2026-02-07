import { ACHIEVEMENT_TYPES } from "@/lib/constants";
import { Tables } from "@/types/database";

export type Achievement = Tables<'achievements'>;
export type UserAchievement = Tables<'user_achievements'>;

export interface AchievementWithProgress extends Achievement {
  isEarned: boolean;
  earnedAt?: string;
  progress: number;
  progressPercentage: number;
}

// Achievement definitions with IDs matching the database
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Streak achievements
  {
    id: 1,
    name: "Getting Started",
    description: "Complete your first quiz",
    icon: "play",
    requirement_type: ACHIEVEMENT_TYPES.QUIZZES,
    requirement_value: 1,
    xp_reward: 50,
  },
  {
    id: 2,
    name: "Practice Makes Perfect",
    description: "Complete 10 quizzes",
    icon: "trophy",
    requirement_type: ACHIEVEMENT_TYPES.QUIZZES,
    requirement_value: 10,
    xp_reward: 100,
  },
  {
    id: 3,
    name: "Quiz Master",
    description: "Complete 50 quizzes",
    icon: "crown",
    requirement_type: ACHIEVEMENT_TYPES.QUIZZES,
    requirement_value: 50,
    xp_reward: 250,
  },
  {
    id: 4,
    name: "Dedicated Learner",
    description: "Complete 100 quizzes",
    icon: "award",
    requirement_type: ACHIEVEMENT_TYPES.QUIZZES,
    requirement_value: 100,
    xp_reward: 500,
  },

  // Question count achievements
  {
    id: 5,
    name: "First Steps",
    description: "Answer 50 questions correctly",
    icon: "check-circle",
    requirement_type: ACHIEVEMENT_TYPES.QUESTIONS,
    requirement_value: 50,
    xp_reward: 75,
  },
  {
    id: 6,
    name: "Knowledge Builder",
    description: "Answer 250 questions correctly",
    icon: "brain",
    requirement_type: ACHIEVEMENT_TYPES.QUESTIONS,
    requirement_value: 250,
    xp_reward: 200,
  },
  {
    id: 7,
    name: "Expert Answerer",
    description: "Answer 500 questions correctly",
    icon: "star",
    requirement_type: ACHIEVEMENT_TYPES.QUESTIONS,
    requirement_value: 500,
    xp_reward: 400,
  },
  {
    id: 8,
    name: "Question Master",
    description: "Answer 1000 questions correctly",
    icon: "zap",
    requirement_type: ACHIEVEMENT_TYPES.QUESTIONS,
    requirement_value: 1000,
    xp_reward: 800,
  },

  // Streak achievements
  {
    id: 9,
    name: "3-Day Streak",
    description: "Study 3 days in a row",
    icon: "flame",
    requirement_type: ACHIEVEMENT_TYPES.STREAK,
    requirement_value: 3,
    xp_reward: 100,
  },
  {
    id: 10,
    name: "Week Warrior",
    description: "Study 7 days in a row",
    icon: "fire",
    requirement_type: ACHIEVEMENT_TYPES.STREAK,
    requirement_value: 7,
    xp_reward: 200,
  },
  {
    id: 11,
    name: "Half-Month Hero",
    description: "Study 14 days in a row",
    icon: "sun",
    requirement_type: ACHIEVEMENT_TYPES.STREAK,
    requirement_value: 14,
    xp_reward: 350,
  },
  {
    id: 12,
    name: "Monthly Master",
    description: "Study 30 days in a row",
    icon: "calendar",
    requirement_type: ACHIEVEMENT_TYPES.STREAK,
    requirement_value: 30,
    xp_reward: 600,
  },

  // Accuracy achievements
  {
    id: 13,
    name: "Sharp Shooter",
    description: "Get 10 questions correct in a row",
    icon: "target",
    requirement_type: ACHIEVEMENT_TYPES.ACCURACY,
    requirement_value: 10,
    xp_reward: 150,
  },
  {
    id: 14,
    name: "Perfect Quiz",
    description: "Get 100% on a quiz with 20+ questions",
    icon: "shield-check",
    requirement_type: ACHIEVEMENT_TYPES.ACCURACY,
    requirement_value: 20,
    xp_reward: 300,
  },

  // XP achievements
  {
    id: 15,
    name: "Rising Star",
    description: "Earn 1000 XP",
    icon: "trending-up",
    requirement_type: ACHIEVEMENT_TYPES.XP,
    requirement_value: 1000,
    xp_reward: 150,
  },
  {
    id: 16,
    name: "XP Collector",
    description: "Earn 5000 XP",
    icon: "coins",
    requirement_type: ACHIEVEMENT_TYPES.XP,
    requirement_value: 5000,
    xp_reward: 300,
  },
  {
    id: 17,
    name: "XP Millionaire",
    description: "Earn 10000 XP",
    icon: "gem",
    requirement_type: ACHIEVEMENT_TYPES.XP,
    requirement_value: 10000,
    xp_reward: 500,
  },

  // Level achievements
  {
    id: 18,
    name: "Level 5",
    description: "Reach level 5",
    icon: "arrow-up-circle",
    requirement_type: ACHIEVEMENT_TYPES.LEVEL,
    requirement_value: 5,
    xp_reward: 200,
  },
  {
    id: 19,
    name: "Level 10",
    description: "Reach level 10",
    icon: "arrow-up-right",
    requirement_type: ACHIEVEMENT_TYPES.LEVEL,
    requirement_value: 10,
    xp_reward: 400,
  },
  {
    id: 20,
    name: "Level 20",
    description: "Reach level 20",
    icon: "crown",
    requirement_type: ACHIEVEMENT_TYPES.LEVEL,
    requirement_value: 20,
    xp_reward: 1000,
  },

  // Special achievements
  {
    id: 21,
    name: "Speed Demon",
    description: "Answer 5 questions correctly in under 10 seconds each",
    icon: "lightning",
    requirement_type: "speed",
    requirement_value: 5,
    xp_reward: 200,
  },
  {
    id: 22,
    name: "Marathon Runner",
    description: "Complete the marathon mode",
    icon: "flag",
    requirement_type: "marathon",
    requirement_value: 1,
    xp_reward: 300,
  },
  {
    id: 23,
    name: "Mistake Master",
    description: "Correct 10 previously wrong answers",
    icon: "refresh-cw",
    requirement_type: "mistake_review",
    requirement_value: 10,
    xp_reward: 250,
  },
  {
    id: 24,
    name: "Night Owl",
    description: "Study after 10 PM",
    icon: "moon",
    requirement_type: "time",
    requirement_value: 22,
    xp_reward: 100,
  },
  {
    id: 25,
    name: "Early Bird",
    description: "Study before 6 AM",
    icon: "sunrise",
    requirement_type: "time",
    requirement_value: 6,
    xp_reward: 100,
  },
];

/**
 * Check if an achievement is unlocked based on stats
 */
export function checkAchievementUnlock(
  achievement: Achievement,
  stats: {
    quizzesCompleted: number;
    questionsAnswered: number;
    currentStreak: number;
    longestStreak: number;
    totalXP: number;
    currentLevel: number;
    maxStreakInQuiz: number;
    marathonCompleted: boolean;
    mistakesCorrected: number;
    speedAnswersCount: number;
  }
): boolean {
  if (!achievement.requirement_type || !achievement.requirement_value) return false;

  switch (achievement.requirement_type) {
    case ACHIEVEMENT_TYPES.QUIZZES:
      return stats.quizzesCompleted >= achievement.requirement_value;

    case ACHIEVEMENT_TYPES.QUESTIONS:
      return stats.questionsAnswered >= achievement.requirement_value;

    case ACHIEVEMENT_TYPES.STREAK:
      return stats.longestStreak >= achievement.requirement_value;

    case ACHIEVEMENT_TYPES.ACCURACY:
      return stats.maxStreakInQuiz >= achievement.requirement_value;

    case ACHIEVEMENT_TYPES.XP:
      return stats.totalXP >= achievement.requirement_value;

    case ACHIEVEMENT_TYPES.LEVEL:
      return stats.currentLevel >= achievement.requirement_value;

    case "speed":
      return stats.speedAnswersCount >= achievement.requirement_value;

    case "marathon":
      return stats.marathonCompleted;

    case "mistake_review":
      return stats.mistakesCorrected >= achievement.requirement_value;

    default:
      return false;
  }
}

/**
 * Calculate achievement progress
 */
export function calculateAchievementProgress(
  achievement: Achievement,
  stats: {
    quizzesCompleted: number;
    questionsAnswered: number;
    currentStreak: number;
    longestStreak: number;
    totalXP: number;
    currentLevel: number;
    maxStreakInQuiz: number;
    marathonCompleted: boolean;
    mistakesCorrected: number;
    speedAnswersCount: number;
  }
): { progress: number; progressPercentage: number } {
  if (!achievement.requirement_type || !achievement.requirement_value) {
    return { progress: 0, progressPercentage: 0 };
  }

  let current = 0;
  const required = achievement.requirement_value;

  switch (achievement.requirement_type) {
    case ACHIEVEMENT_TYPES.QUIZZES:
      current = stats.quizzesCompleted;
      break;
    case ACHIEVEMENT_TYPES.QUESTIONS:
      current = stats.questionsAnswered;
      break;
    case ACHIEVEMENT_TYPES.STREAK:
      current = stats.longestStreak;
      break;
    case ACHIEVEMENT_TYPES.ACCURACY:
      current = stats.maxStreakInQuiz;
      break;
    case ACHIEVEMENT_TYPES.XP:
      current = stats.totalXP;
      break;
    case ACHIEVEMENT_TYPES.LEVEL:
      current = stats.currentLevel;
      break;
    case "speed":
      current = stats.speedAnswersCount;
      break;
    case "marathon":
      current = stats.marathonCompleted ? 1 : 0;
      break;
    case "mistake_review":
      current = stats.mistakesCorrected;
      break;
    default:
      current = 0;
  }

  return {
    progress: Math.min(current, required),
    progressPercentage: Math.min(100, Math.round((current / required) * 100)),
  };
}

/**
 * Get achievement icon component name
 */
export function getAchievementIcon(iconName: string | null): string {
  const iconMap: Record<string, string> = {
    play: "Play",
    trophy: "Trophy",
    crown: "Crown",
    award: "Award",
    "check-circle": "CheckCircle2",
    brain: "Brain",
    star: "Star",
    zap: "Zap",
    flame: "Flame",
    fire: "Fire",
    sun: "Sun",
    calendar: "Calendar",
    target: "Target",
    "shield-check": "ShieldCheck",
    "trending-up": "TrendingUp",
    coins: "Coins",
    gem: "Gem",
    "arrow-up-circle": "ArrowUpCircle",
    "arrow-up-right": "ArrowUpRight",
    lightning: "Lightning",
    flag: "Flag",
    "refresh-cw": "RefreshCw",
    moon: "Moon",
    sunrise: "Sunrise",
  };

  return iconName ? iconMap[iconName] || "Star" : "Star";
}

/**
 * Get achievement rarity/color
 */
export function getAchievementRarity(xpReward: number): {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
} {
  if (xpReward >= 500) {
    return {
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
      label: "Legendary",
    };
  }
  if (xpReward >= 300) {
    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
      label: "Epic",
    };
  }
  if (xpReward >= 150) {
    return {
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      label: "Rare",
    };
  }
  return {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    label: "Common",
  };
}

/**
 * Get recently unlocked achievements
 */
export function getRecentAchievements(
  userAchievements: UserAchievement[],
  count: number = 3
): UserAchievement[] {
  return userAchievements
    .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
    .slice(0, count);
}

/**
 * Check for newly unlocked achievements
 */
export function checkNewAchievements(
  allAchievements: Achievement[],
  userAchievements: UserAchievement[],
  stats: {
    quizzesCompleted: number;
    questionsAnswered: number;
    currentStreak: number;
    longestStreak: number;
    totalXP: number;
    currentLevel: number;
    maxStreakInQuiz: number;
    marathonCompleted: boolean;
    mistakesCorrected: number;
    speedAnswersCount: number;
  }
): Achievement[] {
  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  return allAchievements.filter((achievement) => {
    if (earnedIds.has(achievement.id)) return false;
    return checkAchievementUnlock(achievement, stats);
  });
}
