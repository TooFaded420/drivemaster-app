export const MASCOT_MESSAGES = {
  // Landing Page
  welcome: {
    title: "Welcome to Ace Your Permit!",
    message: "Hi, I'm Dash! I'll help you ace your driving test! 🚗",
  },
  getStarted: {
    title: "Ready to start?",
    message: "Let's begin your journey to becoming a safe driver!",
  },

  // Quiz / Learning
  correctAnswer: {
    title: "Great job!",
    messages: [
      "That's right! You're on the road to success!",
      "Excellent! You're driving your way to mastery!",
      "Perfect! Keep up the fantastic work!",
      "Awesome job! You're really getting the hang of this!",
    ],
  },
  wrongAnswer: {
    title: "Keep trying!",
    messages: [
      "Not quite, but don't give up! Every mistake is a learning opportunity!",
      "Close! Let's review this one together.",
      "That's okay! Learning takes practice. You've got this!",
      "Stay positive! You'll get it next time!",
    ],
  },
  streak: {
    title: "On Fire! 🔥",
    messages: [
      "What a streak! You're unstoppable!",
      "Keep it going! You're in the zone!",
      "Amazing! You're on a roll!",
    ],
  },

  // Dashboard
  dailyGoalComplete: {
    title: "Daily Goal Crushed! 🎉",
    message: "You completed your daily goal! You're one step closer to your license!",
  },
  streakWarning: {
    title: "Don't break the chain!",
    message: "Complete a quiz today to keep your streak alive!",
  },
  levelUp: {
    title: "Level Up! 🚀",
    message: "Congratulations! You've reached a new level!",
  },

  // Empty States
  noQuizzes: {
    title: "Time to start!",
    message: "No quizzes completed yet. Let's take your first one together!",
  },
  noFavorites: {
    title: "Build your collection!",
    message: "Star questions you want to review later!",
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
    title: "You've got this! 💪",
    messages: [
      "Every expert was once a beginner. Keep going!",
      "Practice makes perfect. You're doing great!",
      "Believe in yourself! You're closer than you think!",
      "Small steps lead to big achievements!",
    ],
  },

  // Achievements
  achievementUnlocked: {
    title: "Achievement Unlocked! 🏆",
    message: "You earned a new badge! Keep up the amazing work!",
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
