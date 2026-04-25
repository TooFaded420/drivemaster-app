// App Configuration
export const APP_NAME = "Ace Your Permit";
export const APP_TAGLINE = "Ace Your Illinois Driving Test";

// Test Types
export const TEST_TYPES = {
  PERMIT: "permit",
  LICENSE: "license",
  RENEWAL: "renewal",
} as const;

export type TestType = typeof TEST_TYPES[keyof typeof TEST_TYPES];

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

// Quiz Types
export const QUIZ_TYPES = {
  QUICK_PRACTICE: "quick_practice",
  CATEGORY_PRACTICE: "category_practice",
  TIMED_TEST: "timed_test",
  MARATHON: "marathon",
  MISTAKE_REVIEW: "mistake_review",
} as const;

export type QuizType = typeof QUIZ_TYPES[keyof typeof QUIZ_TYPES];

// XP Configuration
export const XP_CONFIG = {
  CORRECT_ANSWER: 10,
  CORRECT_ANSWER_HARD: 15,
  QUIZ_COMPLETION: 50,
  PERFECT_QUIZ: 100,
  STREAK_BONUS: 5,
  DAILY_GOAL: 50,
} as const;

// Level Thresholds (XP required)
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  10000,  // Level 11
  13000,  // Level 12
  16500,  // Level 13
  20500,  // Level 14
  25000,  // Level 15
  30000,  // Level 16
  35500,  // Level 17
  41500,  // Level 18
  48000,  // Level 19
  55000,  // Level 20
];

// Leaderboard Tiers
export const LEADERBOARD_TIERS = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold",
  DIAMOND: "diamond",
} as const;

export type LeaderboardTier = typeof LEADERBOARD_TIERS[keyof typeof LEADERBOARD_TIERS];

// Achievement Requirement Types
export const ACHIEVEMENT_TYPES = {
  STREAK: "streak",
  XP: "xp",
  QUESTIONS: "questions",
  ACCURACY: "accuracy",
  QUIZZES: "quizzes",
  LEVEL: "level",
} as const;

// Daily Quest Types
export const QUEST_TYPES = {
  ANSWER_QUESTIONS: "answer_questions",
  EARN_XP: "earn_xp",
  MAINTAIN_STREAK: "maintain_streak",
  COMPLETE_QUIZ: "complete_quiz",
  PERFECT_ANSWERS: "perfect_answers",
} as const;

// Illinois DMV Test Configuration
export const ILLINOIS_TEST_CONFIG = {
  TOTAL_QUESTIONS: 35,
  PASSING_SCORE: 28, // 80%
  TIME_LIMIT_MINUTES: 45,
  MINIMUM_AGE_PERMIT: 15,
  MINIMUM_AGE_LICENSE: 16,
} as const;

// Categories (Illinois DMV)
export const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: "Traffic Signs",
    description: "Road signs, signals, and pavement markings",
    icon: "sign",
    color: "#EF4444",
  },
  {
    id: 2,
    name: "Rules of the Road",
    description: "Right-of-way, speed limits, and traffic laws",
    icon: "road",
    color: "#3B82F6",
  },
  {
    id: 3,
    name: "Safe Driving",
    description: "Defensive driving and hazard awareness",
    icon: "shield",
    color: "#22C55E",
  },
  {
    id: 4,
    name: "Alcohol & Drugs",
    description: "DUI laws and impaired driving",
    icon: "alert",
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "Vehicle Operation",
    description: "Vehicle controls and basic operation",
    icon: "car",
    color: "#06B6D4",
  },
  {
    id: 6,
    name: "Sharing the Road",
    description: "Pedestrians, cyclists, and other vehicles",
    icon: "users",
    color: "#F59E0B",
  },
] as const;

// Re-export onboarding constants
export * from "./onboarding";
