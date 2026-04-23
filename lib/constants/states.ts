/**
 * Supported states registry for DriveMaster / aceyourpermit.com.
 *
 * When adding a new state:
 *  1. Add an entry to SUPPORTED_STATES below.
 *  2. Add a DB migration to add its questions (see supabase/migrations/009_multi_state_support.sql).
 *  3. Create SEO landing pages under app/<slug>-dmv-practice-test/ etc.
 *
 * DO NOT fabricate question data — import only from licensed/official sources.
 */

export interface StateConfig {
  /** ISO 3166-2 two-letter code */
  code: string;
  name: string;
  /** URL-safe slug used in route paths, e.g. "illinois" → /free-illinois-dmv-practice-test */
  slug: string;
  /** Minimum age (years) for a learner permit with standard enrollment */
  permitAge: number;
  /** Number of questions on the official written knowledge test */
  testQuestions: number;
  /** Minimum percentage correct to pass (0–100) */
  passThreshold: number;
}

export const SUPPORTED_STATES: StateConfig[] = [
  {
    code: "IL",
    name: "Illinois",
    slug: "illinois",
    permitAge: 15,
    testQuestions: 35,
    passThreshold: 80,
  },
  {
    code: "TX",
    name: "Texas",
    slug: "texas",
    permitAge: 15,
    // TX DPS: 30-question knowledge test; 70% (21/30) to pass.
    testQuestions: 30,
    passThreshold: 70,
    // TODO: Texas question bank: pending manual import from licensed source (TX DPS handbook 2024).
  },
];

/** Convenience map: state code → config */
export const STATE_BY_CODE: Record<string, StateConfig> = Object.fromEntries(
  SUPPORTED_STATES.map((s) => [s.code, s])
);

/** Ordered list of supported state codes for UI pickers */
export const SUPPORTED_STATE_CODES = SUPPORTED_STATES.map((s) => s.code);
