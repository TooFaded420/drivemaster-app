/**
 * Multi-state registry for DriveMaster / aceyourpermit.com
 *
 * Each entry describes a US state's DMV permit test parameters.
 * Add new states here — do NOT fabricate question banks.
 * Questions must be imported from licensed / official sources.
 */

export interface StateConfig {
  /** Two-letter postal code */
  code: string;
  name: string;
  /** Minimum age (years) to obtain a learner's permit */
  permitAge: number;
  /** Number of questions on the official permit test */
  testQuestions: number;
  /** Minimum correct answers required to pass (absolute number) */
  passThreshold: number;
  /** Pass threshold expressed as a percentage */
  passPercent: number;
  /** Name of the official issuing agency */
  agency: string;
  /** Official agency website */
  agencyUrl: string;
  /** Whether the question bank has been imported */
  questionBankReady: boolean;
  /** Human-readable note for pending imports */
  questionBankNote?: string;
}

export const STATES_REGISTRY: Record<string, StateConfig> = {
  IL: {
    code: "IL",
    name: "Illinois",
    permitAge: 15,
    testQuestions: 35,
    passThreshold: 28,
    passPercent: 80,
    agency: "Illinois Secretary of State",
    agencyUrl: "https://www.ilsos.gov/",
    questionBankReady: true,
  },

  NY: {
    code: "NY",
    name: "New York",
    permitAge: 16,
    testQuestions: 20,
    passThreshold: 14,
    passPercent: 70,
    agency: "New York DMV",
    agencyUrl: "https://dmv.ny.gov/",
    questionBankReady: false,
    // TODO: New York question bank: pending manual import from licensed source
    // (NY MV-21 Driver's Manual 2024).
    questionBankNote:
      "New York question bank: pending manual import from licensed source (NY MV-21 Driver's Manual 2024).",
  },
} as const;

export type StateCode = keyof typeof STATES_REGISTRY;

/** Convenience getter — returns undefined for unknown codes. */
export function getStateConfig(code: string): StateConfig | undefined {
  return STATES_REGISTRY[code.toUpperCase()];
}
