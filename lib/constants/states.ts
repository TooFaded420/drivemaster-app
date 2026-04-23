/**
 * Multi-state registry for DriveMaster / aceyourpermit.com.
 *
 * When adding a new state:
 *  1. Add an entry to STATES_REGISTRY below.
 *  2. Create a Supabase migration that extends any state CHECK constraints.
 *  3. Add SEO landing pages under app/.
 */

export interface StateConfig {
  /** Two-letter USPS abbreviation */
  code: string;
  name: string;
  /** Minimum age (in years) to apply for a learner's permit */
  permitAge: number;
  /** Total questions on the official knowledge test */
  testQuestions: number;
  /** Minimum correct answers required to pass */
  passThreshold: number;
  /** Pass rate as a percentage (0-100) */
  passPercent: number;
}

export const STATES_REGISTRY: StateConfig[] = [
  {
    code: "IL",
    name: "Illinois",
    permitAge: 15,
    testQuestions: 35,
    passThreshold: 28, // 80%
    passPercent: 80,
  },
  {
    // TODO: California question bank: pending manual import from licensed source (CA DMV handbook 2024).
    code: "CA",
    name: "California",
    permitAge: 15.5,
    testQuestions: 46,
    passThreshold: 38, // ~83%
    passPercent: 83,
  },
] as const;

/** Lookup a state config by code (case-insensitive). Returns undefined if not found. */
export function getStateConfig(code: string): StateConfig | undefined {
  return STATES_REGISTRY.find(
    (s) => s.code.toUpperCase() === code.toUpperCase()
  );
}

export const SUPPORTED_STATE_CODES = STATES_REGISTRY.map((s) => s.code);
