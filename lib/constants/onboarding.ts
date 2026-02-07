// Onboarding Configuration
export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Meet Dash and learn about DriveMaster',
    xpReward: 10,
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Tell us about yourself',
    xpReward: 20,
  },
  {
    id: 'goals',
    title: 'Study Goals',
    description: 'Set your targets',
    xpReward: 20,
  },
  {
    id: 'assessment',
    title: 'Quick Assessment',
    description: 'Test your knowledge',
    xpReward: 30,
  },
  {
    id: 'tutorial',
    title: 'App Tutorial',
    description: 'Learn the basics',
    xpReward: 20,
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Start your journey',
    xpReward: 50,
  },
] as const;

export type OnboardingStepId = typeof ONBOARDING_STEPS[number]['id'];

// Step indices for navigation
export const STEP_INDICES: Record<OnboardingStepId, number> = {
  welcome: 0,
  profile: 1,
  goals: 2,
  assessment: 3,
  tutorial: 4,
  complete: 5,
};

// Total XP for completing all onboarding
export const TOTAL_ONBOARDING_XP = ONBOARDING_STEPS.reduce(
  (sum, step) => sum + step.xpReward,
  0
);

// Onboarding achievement
export const ONBOARDING_ACHIEVEMENT = {
  id: 'getting_started',
  name: 'Getting Started',
  description: 'Complete the onboarding process',
  icon: 'star',
  xpReward: 100,
} as const;

// Checklist items
export const ONBOARDING_CHECKLIST = [
  {
    id: 'account',
    label: 'Create account',
    step: 'welcome',
    icon: 'user',
    isPostOnboarding: false,
  },
  {
    id: 'profile',
    label: 'Complete profile',
    step: 'profile',
    icon: 'id-card',
    isPostOnboarding: false,
  },
  {
    id: 'goals',
    label: 'Set goals',
    step: 'goals',
    icon: 'target',
    isPostOnboarding: false,
  },
  {
    id: 'assessment',
    label: 'Take diagnostic',
    step: 'assessment',
    icon: 'clipboard-check',
    isPostOnboarding: false,
  },
  {
    id: 'tutorial',
    label: 'Learn the basics',
    step: 'tutorial',
    icon: 'book-open',
    isPostOnboarding: false,
  },
  {
    id: 'first-quiz',
    label: 'First practice quiz',
    step: null,
    icon: 'play',
    isPostOnboarding: true,
  },
] as const;

// US States for dropdown
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
] as const;

// Default state
export const DEFAULT_STATE = 'IL';

// License types
export const LICENSE_TYPES = [
  { value: 'permit', label: 'Learner\'s Permit', description: 'First-time driver' },
  { value: 'license', label: 'Driver\'s License', description: 'New or transferring' },
  { value: 'renewal', label: 'License Renewal', description: 'Renewing existing license' },
] as const;

// Study time options
export const STUDY_TIME_OPTIONS = [
  { value: 10, label: '10 minutes', description: 'Quick sessions' },
  { value: 20, label: '20 minutes', description: 'Standard session' },
  { value: 30, label: '30 minutes', description: 'Focused study' },
  { value: 45, label: '45 minutes', description: 'Deep dive' },
  { value: 60, label: '1 hour', description: 'Intensive study' },
] as const;

// Target score options
export const TARGET_SCORE_OPTIONS = [
  { value: 80, label: '80%', description: 'Passing grade' },
  { value: 85, label: '85%', description: 'Good score' },
  { value: 90, label: '90%', description: 'Great score' },
  { value: 95, label: '95%', description: 'Excellent score' },
  { value: 100, label: '100%', description: 'Perfect score' },
] as const;

// Assessment questions (5 diagnostic questions)
export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'What should you do when approaching a yellow traffic light?',
    answers: [
      { id: 1, text: 'Speed up to get through', isCorrect: false },
      { id: 2, text: 'Stop if safe to do so', isCorrect: true },
      { id: 3, text: 'Honk your horn', isCorrect: false },
      { id: 4, text: 'Change lanes quickly', isCorrect: false },
    ],
    explanation: 'A yellow light means the signal is about to turn red. You should stop if you can do so safely.',
  },
  {
    id: 2,
    question: 'What is the legal blood alcohol concentration (BAC) limit for drivers over 21?',
    answers: [
      { id: 5, text: '0.05%', isCorrect: false },
      { id: 6, text: '0.08%', isCorrect: true },
      { id: 7, text: '0.10%', isCorrect: false },
      { id: 8, text: '0.15%', isCorrect: false },
    ],
    explanation: 'In most states, including Illinois, the legal BAC limit for drivers over 21 is 0.08%.',
  },
  {
    id: 3,
    question: 'When should you use your high beam headlights?',
    answers: [
      { id: 9, text: 'In foggy conditions', isCorrect: false },
      { id: 10, text: 'When following another vehicle closely', isCorrect: false },
      { id: 11, text: 'On dark roads with no oncoming traffic', isCorrect: true },
      { id: 12, text: 'In heavy rain', isCorrect: false },
    ],
    explanation: 'Use high beams on dark roads when there is no oncoming traffic. Dim them when within 500 feet of an oncoming vehicle.',
  },
  {
    id: 4,
    question: 'What does a solid white line between lanes mean?',
    answers: [
      { id: 13, text: 'You may cross freely', isCorrect: false },
      { id: 14, text: 'Lane changes are discouraged', isCorrect: true },
      { id: 15, text: 'Passing is allowed', isCorrect: false },
      { id: 16, text: 'The lane is ending', isCorrect: false },
    ],
    explanation: 'Solid white lines indicate that lane changes are discouraged but not necessarily illegal.',
  },
  {
    id: 5,
    question: 'How far should you stop from a railroad crossing when lights are flashing?',
    answers: [
      { id: 17, text: '5-10 feet', isCorrect: false },
      { id: 18, text: '15-50 feet', isCorrect: true },
      { id: 19, text: '100-200 feet', isCorrect: false },
      { id: 20, text: 'As close as possible', isCorrect: false },
    ],
    explanation: 'Stop between 15 and 50 feet from railroad tracks when warning lights are flashing or gates are down.',
  },
] as const;

// Tutorial steps for the interactive tutorial
export const TUTORIAL_STEPS = [
  {
    id: 'dashboard-overview',
    title: 'Your Dashboard',
    description: 'This is your home base. Track your progress, streaks, and daily goals here.',
    target: 'dashboard-header',
    position: 'bottom',
  },
  {
    id: 'quiz-start',
    title: 'Start a Quiz',
    description: 'Click here to begin practicing. You can choose from different quiz types.',
    target: 'start-quiz-button',
    position: 'left',
  },
  {
    id: 'categories',
    title: 'Study Categories',
    description: 'Focus on specific topics like Traffic Signs or Rules of the Road.',
    target: 'categories-section',
    position: 'top',
  },
  {
    id: 'daily-quests',
    title: 'Daily Quests',
    description: 'Complete these each day to earn bonus XP and keep your streak alive!',
    target: 'daily-quests',
    position: 'left',
  },
  {
    id: 'mascot-help',
    title: 'Meet Dash',
    description: 'I\'m here to help! Click on me anytime for tips and encouragement.',
    target: 'dash-mascot',
    position: 'right',
  },
] as const;

// Mascot messages for each onboarding step
export const ONBOARDING_MASCOT_MESSAGES = {
  welcome: {
    title: 'Welcome! 🎉',
    message: 'Hi, I\'m Dash! I\'ll be your guide to mastering your driving test. Let\'s get started!',
    emotion: 'excited' as const,
  },
  profile: {
    title: 'Tell Us About You',
    message: 'Help me personalize your study plan by sharing a bit about yourself.',
    emotion: 'happy' as const,
  },
  goals: {
    title: 'Set Your Goals',
    message: 'Setting clear goals helps you stay motivated and track your progress!',
    emotion: 'thinking' as const,
  },
  assessment: {
    title: 'Quick Check',
    message: 'Let\'s see what you already know. Don\'t worry - this is just to help me understand where to focus!',
    emotion: 'encouraging' as const,
  },
  tutorial: {
    title: 'Learn the Ropes',
    message: 'Let me show you around the app so you can make the most of your study time.',
    emotion: 'happy' as const,
  },
  complete: {
    title: 'You\'re All Set! 🎊',
    message: 'Congratulations! You\'ve earned your first achievement. Let\'s start your driving journey!',
    emotion: 'excited' as const,
  },
} as const;
