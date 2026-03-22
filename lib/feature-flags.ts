/**
 * Feature Flags
 *
 * Each flag corresponds to a Phase 2-3 feature that ships behind an env var toggle.
 * All default OFF until the feature is built and tested.
 *
 * Usage:
 *   import { features } from "@/lib/feature-flags";
 *   if (features.sharing) { ... }
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_FEATURE_SHARING=true
 */

export const features = {
  sharing: process.env.NEXT_PUBLIC_FEATURE_SHARING === "true",
  challenges: process.env.NEXT_PUBLIC_FEATURE_CHALLENGES === "true",
  countdown: process.env.NEXT_PUBLIC_FEATURE_COUNTDOWN === "true",
  aiExplanations: process.env.NEXT_PUBLIC_FEATURE_AI_EXPLANATIONS === "true",
  parentNotifications: process.env.NEXT_PUBLIC_FEATURE_PARENT_NOTIFICATIONS === "true",
  i18n: process.env.NEXT_PUBLIC_FEATURE_I18N === "true",
} as const;

export type FeatureFlag = keyof typeof features;
