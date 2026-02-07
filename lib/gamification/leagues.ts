/**
 * League System for DriveMaster
 * Duolingo-style weekly competitions with promotion/demotion
 */

export type LeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface League {
  id: LeagueTier;
  name: string;
  color: string;
  icon: string;
  minXP: number;
  maxXP: number | null;
  promotionThreshold: number;
  demotionThreshold: number;
  rewards: LeagueReward[];
  multiplier: number;
}

export interface LeagueReward {
  type: "miles" | "badge" | "avatar" | "theme" | "title";
  name: string;
  description: string;
  value?: number;
  icon?: string;
}

export interface LeagueStanding {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  weeklyXP: number;
  totalXP: number;
  rank: number;
  previousRank: number | null;
  isCurrentUser: boolean;
}

export interface WeeklyCompetition {
  seasonId: string;
  weekStart: Date;
  weekEnd: Date;
  leagueTier: LeagueTier;
  standings: LeagueStanding[];
  userRank: number;
  promotionZone: number;
  demotionZone: number;
}

export interface LeagueProgress {
  currentLeague: LeagueTier;
  weeklyXP: number;
  xpToPromotion: number | null;
  xpToDemotion: number;
  promotionZone: boolean;
  demotionZone: boolean;
  safeZone: boolean;
  rank: number;
  totalParticipants: number;
}

// League colors
export const LEAGUE_COLORS: Record<LeagueTier, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
  diamond: "#B9F2FF",
};

// League gradients for visual effects
export const LEAGUE_GRADIENTS: Record<LeagueTier, string> = {
  bronze: "from-amber-700 to-amber-600",
  silver: "from-gray-400 to-gray-300",
  gold: "from-yellow-400 to-yellow-300",
  platinum: "from-slate-300 to-slate-200",
  diamond: "from-cyan-300 to-cyan-200",
};

// League configuration
export const LEAGUES: Record<LeagueTier, League> = {
  bronze: {
    id: "bronze",
    name: "Bronze League",
    color: LEAGUE_COLORS.bronze,
    icon: "🥉",
    minXP: 0,
    maxXP: 499,
    promotionThreshold: 300,
    demotionThreshold: 0,
    multiplier: 1,
    rewards: [
      { type: "miles", name: "Bronze Bonus", description: "Earn 1.0x Miles", value: 1 },
      { type: "badge", name: "Bronze Driver", description: "Bronze League participant" },
    ],
  },
  silver: {
    id: "silver",
    name: "Silver League",
    color: LEAGUE_COLORS.silver,
    icon: "🥈",
    minXP: 500,
    maxXP: 999,
    promotionThreshold: 700,
    demotionThreshold: 200,
    multiplier: 1.1,
    rewards: [
      { type: "miles", name: "Silver Bonus", description: "Earn 1.1x Miles", value: 1.1 },
      { type: "badge", name: "Silver Driver", description: "Silver League achiever" },
      { type: "avatar", name: "Silver Frame", description: "Exclusive avatar frame" },
    ],
  },
  gold: {
    id: "gold",
    name: "Gold League",
    color: LEAGUE_COLORS.gold,
    icon: "🥇",
    minXP: 1000,
    maxXP: 1999,
    promotionThreshold: 1500,
    demotionThreshold: 500,
    multiplier: 1.25,
    rewards: [
      { type: "miles", name: "Gold Bonus", description: "Earn 1.25x Miles", value: 1.25 },
      { type: "badge", name: "Gold Driver", description: "Gold League champion" },
      { type: "avatar", name: "Gold Frame", description: "Premium avatar frame" },
      { type: "theme", name: "Gold Theme", description: "Exclusive gold UI theme" },
    ],
  },
  platinum: {
    id: "platinum",
    name: "Platinum League",
    color: LEAGUE_COLORS.platinum,
    icon: "💎",
    minXP: 2000,
    maxXP: 3999,
    promotionThreshold: 3000,
    demotionThreshold: 1000,
    multiplier: 1.5,
    rewards: [
      { type: "miles", name: "Platinum Bonus", description: "Earn 1.5x Miles", value: 1.5 },
      { type: "badge", name: "Platinum Driver", description: "Platinum League elite" },
      { type: "avatar", name: "Platinum Frame", description: "Elite avatar frame" },
      { type: "theme", name: "Platinum Theme", description: "Exclusive platinum UI theme" },
      { type: "title", name: "Elite Driver", description: "Show off your elite status" },
    ],
  },
  diamond: {
    id: "diamond",
    name: "Diamond League",
    color: LEAGUE_COLORS.diamond,
    icon: "👑",
    minXP: 4000,
    maxXP: null,
    promotionThreshold: 0,
    demotionThreshold: 2500,
    multiplier: 2,
    rewards: [
      { type: "miles", name: "Diamond Bonus", description: "Earn 2x Miles", value: 2 },
      { type: "badge", name: "Diamond Driver", description: "Diamond League legend" },
      { type: "avatar", name: "Diamond Frame", description: "Legendary avatar frame" },
      { type: "theme", name: "Diamond Theme", description: "Exclusive diamond UI theme" },
      { type: "title", name: "Legendary Driver", description: "The ultimate achievement" },
    ],
  },
};

// League order for progression
export const LEAGUE_ORDER: LeagueTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

// Top 3 rewards
export const TOP_THREE_REWARDS: Record<number, LeagueReward[]> = {
  1: [
    { type: "miles", name: "1st Place", description: "500 bonus Miles", value: 500 },
    { type: "badge", name: "Weekly Champion", description: "Ranked #1 this week" },
    { type: "title", name: "Champion", description: "Weekly competition winner" },
  ],
  2: [
    { type: "miles", name: "2nd Place", description: "300 bonus Miles", value: 300 },
    { type: "badge", name: "Weekly Runner-up", description: "Ranked #2 this week" },
  ],
  3: [
    { type: "miles", name: "3rd Place", description: "150 bonus Miles", value: 150 },
    { type: "badge", name: "Weekly Bronze", description: "Ranked #3 this week" },
  ],
};

/**
 * Get league by tier
 */
export function getLeague(tier: LeagueTier): League {
  return LEAGUES[tier];
}

/**
 * Get league by weekly XP
 */
export function getLeagueByXP(weeklyXP: number): League {
  if (weeklyXP >= LEAGUES.diamond.minXP) return LEAGUES.diamond;
  if (weeklyXP >= LEAGUES.platinum.minXP) return LEAGUES.platinum;
  if (weeklyXP >= LEAGUES.gold.minXP) return LEAGUES.gold;
  if (weeklyXP >= LEAGUES.silver.minXP) return LEAGUES.silver;
  return LEAGUES.bronze;
}

/**
 * Get next league tier
 */
export function getNextLeague(currentTier: LeagueTier): LeagueTier | null {
  const currentIndex = LEAGUE_ORDER.indexOf(currentTier);
  if (currentIndex >= LEAGUE_ORDER.length - 1) return null;
  return LEAGUE_ORDER[currentIndex + 1];
}

/**
 * Get previous league tier
 */
export function getPreviousLeague(currentTier: LeagueTier): LeagueTier | null {
  const currentIndex = LEAGUE_ORDER.indexOf(currentTier);
  if (currentIndex <= 0) return null;
  return LEAGUE_ORDER[currentIndex - 1];
}

/**
 * Check if user qualifies for promotion
 */
export function qualifiesForPromotion(
  currentTier: LeagueTier,
  weeklyXP: number,
  rank: number,
  totalParticipants: number
): boolean {
  const league = LEAGUES[currentTier];
  const nextLeague = getNextLeague(currentTier);
  
  if (!nextLeague) return false; // Already at highest league
  
  // Must meet XP threshold AND be in top 30%
  const promotionZone = Math.ceil(totalParticipants * 0.3);
  return weeklyXP >= league.promotionThreshold && rank <= promotionZone;
}

/**
 * Check if user is at risk of demotion
 */
export function atRiskOfDemotion(
  currentTier: LeagueTier,
  weeklyXP: number,
  rank: number,
  totalParticipants: number
): boolean {
  const league = LEAGUES[currentTier];
  
  // Bronze league has no demotion
  if (currentTier === "bronze") return false;
  
  // Bottom 20% or below demotion threshold
  const demotionZone = Math.ceil(totalParticipants * 0.2);
  return weeklyXP < league.demotionThreshold || rank > totalParticipants - demotionZone;
}

/**
 * Calculate league progress
 */
export function calculateLeagueProgress(
  currentTier: LeagueTier,
  weeklyXP: number,
  rank: number,
  totalParticipants: number
): LeagueProgress {
  const league = LEAGUES[currentTier];
  const nextLeagueTier = getNextLeague(currentTier);
  const nextLeague = nextLeagueTier ? LEAGUES[nextLeagueTier] : null;
  
  const promotionZone = Math.ceil(totalParticipants * 0.3);
  const demotionZone = Math.ceil(totalParticipants * 0.2);
  
  return {
    currentLeague: currentTier,
    weeklyXP,
    xpToPromotion: nextLeague ? nextLeague.minXP - weeklyXP : null,
    xpToDemotion: Math.max(0, league.demotionThreshold - weeklyXP),
    promotionZone: rank <= promotionZone,
    demotionZone: rank > totalParticipants - demotionZone,
    safeZone: rank > promotionZone && rank <= totalParticipants - demotionZone,
    rank,
    totalParticipants,
  };
}

/**
 * Get league position status
 */
export function getLeaguePositionStatus(
  rank: number,
  totalParticipants: number
): "promotion" | "safe" | "demotion" {
  const promotionZone = Math.ceil(totalParticipants * 0.3);
  const demotionZone = Math.ceil(totalParticipants * 0.2);
  
  if (rank <= promotionZone) return "promotion";
  if (rank > totalParticipants - demotionZone) return "demotion";
  return "safe";
}

/**
 * Format league name for display
 */
export function formatLeagueName(tier: LeagueTier): string {
  return LEAGUES[tier].name;
}

/**
 * Get league icon
 */
export function getLeagueIcon(tier: LeagueTier): string {
  return LEAGUES[tier].icon;
}

/**
 * Get league multiplier for Miles
 */
export function getLeagueMultiplier(tier: LeagueTier): number {
  return LEAGUES[tier].multiplier;
}

/**
 * Calculate weekly reset time (Sunday at midnight)
 */
export function getNextWeeklyReset(): Date {
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(0, 0, 0, 0);
  return nextSunday;
}

/**
 * Get current week start (Monday)
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Get current week end (Sunday)
 */
export function getCurrentWeekEnd(): Date {
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Format time until weekly reset
 */
export function formatTimeUntilReset(): string {
  const now = new Date();
  const reset = getNextWeeklyReset();
  const diff = reset.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

/**
 * Generate mock leaderboard data for testing
 */
export function generateMockLeaderboard(
  leagueTier: LeagueTier,
  currentUserId: string,
  count: number = 50
): LeagueStanding[] {
  const standings: LeagueStanding[] = [];
  const league = LEAGUES[leagueTier];
  
  for (let i = 0; i < count; i++) {
    const isCurrentUser = i === 14; // Position current user at rank 15
    const baseXP = league.minXP + Math.random() * (league.maxXP ? league.maxXP - league.minXP : 2000);
    
    standings.push({
      userId: isCurrentUser ? currentUserId : `user_${i}`,
      username: isCurrentUser ? "You" : `driver_${i + 1}`,
      displayName: isCurrentUser ? "You" : `Driver ${i + 1}`,
      avatarUrl: null,
      weeklyXP: Math.floor(baseXP + (count - i) * 50 + Math.random() * 100),
      totalXP: Math.floor(baseXP * 10 + Math.random() * 5000),
      rank: i + 1,
      previousRank: i < 5 ? i + 2 : i > count - 5 ? i - 1 : i + 1,
      isCurrentUser,
    });
  }
  
  // Sort by weekly XP descending
  standings.sort((a, b) => b.weeklyXP - a.weeklyXP);
  
  // Update ranks after sorting
  standings.forEach((standing, index) => {
    standing.rank = index + 1;
  });
  
  return standings;
}
