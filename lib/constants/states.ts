/**
 * Multi-state registry for DriveMaster / aceyourpermit.com.
 *
 * Each entry describes the official permit/license test parameters for a state.
 * Do NOT fabricate question counts — verify against each state's DMV/SOS handbook.
 *
 * Extending: when adding a new state, append to the `STATES` map and export a
 * typed entry. Other agents (TX, CA) should extend this file rather than
 * creating a duplicate.
 */

export interface StateConfig {
  /** Two-letter USPS abbreviation */
  code: string;
  name: string;
  /** Official agency name (e.g. "Secretary of State" for IL) */
  agency: string;
  /** Official agency website */
  agencyUrl: string;
  /** Minimum age to obtain an instruction permit (with driver's ed if applicable) */
  permitAge: number;
  /** Total questions on the written knowledge test */
  testQuestions: number;
  /** Minimum correct answers required to pass (absolute count) */
  passCount: number;
  /** Pass threshold as a percentage (0–100) */
  passThreshold: number;
  /** Any state-specific notes about the test format */
  notes?: string;
}

// ---------------------------------------------------------------------------
// Illinois
// ---------------------------------------------------------------------------
export const IL: StateConfig = {
  code: "IL",
  name: "Illinois",
  agency: "Illinois Secretary of State",
  agencyUrl: "https://www.ilsos.gov",
  permitAge: 15,
  testQuestions: 35,
  passCount: 28,
  passThreshold: 80,
  notes:
    "Permit at 15 requires enrollment in a state-approved driver's ed course. Without driver's ed, minimum age is 17 years 3 months.",
};

// ---------------------------------------------------------------------------
// Florida
// ---------------------------------------------------------------------------
export const FL: StateConfig = {
  code: "FL",
  name: "Florida",
  agency: "Florida Highway Safety and Motor Vehicles (FLHSMV)",
  agencyUrl: "https://www.flhsmv.gov",
  permitAge: 15,
  testQuestions: 50,
  passCount: 40,
  passThreshold: 80,
  notes:
    // TODO: Florida question bank: pending manual import from licensed source (FL Driver License Handbook 2024).
    "50-question test: 40 road rules + 10 road signs. Pass = 40/50 (80%). " +
    "Before taking the test, teen applicants must complete a Traffic Law and Substance Abuse Education (TLSAE) " +
    "4-hour course. Learner's permit available at age 15.",
};

// ---------------------------------------------------------------------------
// Registry map — import this for dynamic state lookups
// ---------------------------------------------------------------------------
export const STATES: Record<string, StateConfig> = {
  IL,
  FL,
};

export type StateCode = keyof typeof STATES;
