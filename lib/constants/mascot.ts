export const MASCOT_MESSAGES = {
  // Landing Page
  welcome: {
    title: "Welcome to Ace Your Permit",
    message: "Yo, I'm Dash. I'll get you ready to ace this test 🚗",
  },
  getStarted: {
    title: "Ready to start?",
    message: "Let's get you that permit. First quiz is on me.",
  },

  // Quiz / Learning
  correctAnswer: {
    title: "Let's go!",
    messages: [
      "Ayy, that's it. You're locked in.",
      "Clean. That's how it's done.",
      "Yup. Keep that same energy.",
      "Certified correct. Keep cooking.",
    ],
  },
  wrongAnswer: {
    title: "Close but nah",
    messages: [
      "Nah, not this one. But that's how you learn — run it back.",
      "Oof, close but nope. Check the explanation, you'll get the next one.",
      "That ain't it, but you're one rep away. Keep going.",
      "Close but nah. Read why, then go again.",
    ],
  },
  streak: {
    title: "On Fire 🔥",
    messages: [
      "You're on a heater. Don't touch the dial.",
      "This streak is actually insane. Keep it rolling.",
      "Locked in mode. Keep going.",
    ],
  },

  // Dashboard
  dailyGoalComplete: {
    title: "Goal crushed 🎉",
    message: "Daily goal done. That's how permits get earned.",
  },
  streakWarning: {
    title: "Streak on the line",
    message: "One quiz today keeps the streak alive. Don't let it die.",
  },
  levelUp: {
    title: "Level Up 🚀",
    message: "New level unlocked. You're moving different.",
  },

  // Empty States
  noQuizzes: {
    title: "Let's start",
    message: "Zero quizzes so far. Take your first one with me.",
  },
  noFavorites: {
    title: "Build your collection",
    message: "Star questions you want to run back later.",
  },

  // Loading
  loading: {
    title: "Loading...",
    messages: [
      "Fueling up...",
      "Checking the mirrors...",
      "Buckling up...",
      "Starting the engine...",
    ],
  },

  // Encouragement
  encouragement: {
    title: "You've got this 💪",
    messages: [
      "Every pro was a beginner once. Keep going.",
      "Reps build results. You're doing better than you think.",
      "Trust the process — you're closer than you feel.",
      "Small steps stack up. Keep moving.",
    ],
  },

  // Achievements
  achievementUnlocked: {
    title: "Achievement Unlocked 🏆",
    message: "New badge in the collection. Keep stacking.",
  },
} as const;

export type MascotEmotion = "happy" | "excited" | "thinking" | "encouraging";

export type MascotSize = "sm" | "md" | "lg" | "xl";

export interface MascotState {
  emotion: MascotEmotion;
  message: string;
  title?: string;
  isVisible: boolean;
  isAnimating: boolean;
}
