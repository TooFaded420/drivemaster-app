/**
 * Multi-state registry for DriveMaster / aceyourpermit.com.
 *
 * v1 launched with Illinois only. This registry adds CA, FL, NY, PA, TX
 * metadata and SEO landing-page routing. Question banks for non-IL states
 * are NOT included here — they must be sourced from licensed DMV handbooks
 * before a state can flip to `active: true`.
 */

export interface StateConfig {
  code: "IL" | "CA" | "FL" | "NY" | "PA" | "TX";
  name: string;
  slug: string;
  agency: string;
  permitAge: number;
  testQuestions: number;
  passThreshold: number;
  passPercent: number;
  active: boolean;
  questionBankReady: boolean;
  routes: {
    practice: string;
    signs: string;
    teen: string;
  };
}

export const SUPPORTED_STATES: StateConfig[] = [
  {
    code: "IL",
    name: "Illinois",
    slug: "illinois",
    agency: "Illinois Secretary of State",
    permitAge: 15,
    testQuestions: 35,
    passThreshold: 28,
    passPercent: 80,
    active: true,
    questionBankReady: true,
    routes: {
      practice: "/free-illinois-dmv-practice-test",
      signs: "/illinois-road-signs-test",
      teen: "/illinois-teen-permit-15-years-old",
    },
  },
  {
    code: "CA",
    name: "California",
    slug: "california",
    agency: "California DMV",
    permitAge: 15.5,
    testQuestions: 46,
    passThreshold: 38,
    passPercent: 83,
    active: false,
    // TODO: California question bank pending manual import from CA DMV handbook 2024
    questionBankReady: false,
    routes: {
      practice: "/free-california-dmv-practice-test",
      signs: "/california-road-signs-test",
      teen: "/california-teen-permit-15-years-old",
    },
  },
  {
    code: "FL",
    name: "Florida",
    slug: "florida",
    agency: "Florida DHSMV",
    permitAge: 15,
    testQuestions: 50,
    passThreshold: 40,
    passPercent: 80,
    active: false,
    // TODO: Florida question bank pending manual import from FL Driver License Handbook 2024
    questionBankReady: false,
    routes: {
      practice: "/free-florida-dmv-practice-test",
      signs: "/florida-road-signs-test",
      teen: "/florida-teen-permit-15-years-old",
    },
  },
  {
    code: "NY",
    name: "New York",
    slug: "new-york",
    agency: "New York DMV",
    permitAge: 16,
    testQuestions: 20,
    passThreshold: 14,
    passPercent: 70,
    active: false,
    // TODO: New York question bank pending manual import from NY MV-21 Driver's Manual 2024
    questionBankReady: false,
    routes: {
      practice: "/free-new-york-dmv-practice-test",
      signs: "/new-york-road-signs-test",
      teen: "/new-york-teen-permit-16-years-old",
    },
  },
  {
    code: "PA",
    name: "Pennsylvania",
    slug: "pennsylvania",
    agency: "PennDOT",
    permitAge: 16,
    testQuestions: 18,
    passThreshold: 15,
    passPercent: 83,
    active: false,
    // TODO: Pennsylvania question bank pending manual import from PA Driver's Manual PUB 95
    questionBankReady: false,
    routes: {
      practice: "/free-pennsylvania-dmv-practice-test",
      signs: "/pennsylvania-road-signs-test",
      teen: "/pennsylvania-teen-permit-16-years-old",
    },
  },
  {
    code: "TX",
    name: "Texas",
    slug: "texas",
    agency: "Texas DPS",
    permitAge: 15,
    testQuestions: 30,
    passThreshold: 21,
    passPercent: 70,
    active: false,
    // TODO: Texas question bank pending manual import from TX DPS handbook 2024
    questionBankReady: false,
    routes: {
      practice: "/free-texas-dmv-practice-test",
      signs: "/texas-road-signs-test",
      teen: "/texas-teen-permit-15-years-old",
    },
  },
];

export const STATE_BY_CODE = Object.fromEntries(
  SUPPORTED_STATES.map((s) => [s.code, s] as const),
) as Record<StateConfig["code"], StateConfig>;

export const SUPPORTED_STATE_CODES = SUPPORTED_STATES.map((s) => s.code);

export function getStateConfig(code: string): StateConfig | undefined {
  return STATE_BY_CODE[code as StateConfig["code"]];
}

export function getActiveStates(): StateConfig[] {
  return SUPPORTED_STATES.filter((s) => s.active);
}
