"use client";

import { cn } from "@/lib/utils";
import {
  LeagueTier,
  LEAGUES,
  LEAGUE_COLORS,
  LEAGUE_GRADIENTS,
} from "@/lib/gamification/leagues";

interface LeagueBadgeProps {
  tier: LeagueTier;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-8 h-8",
    icon: "text-sm",
    name: "text-xs",
  },
  md: {
    container: "w-12 h-12",
    icon: "text-xl",
    name: "text-sm",
  },
  lg: {
    container: "w-16 h-16",
    icon: "text-3xl",
    name: "text-base",
  },
  xl: {
    container: "w-24 h-24",
    icon: "text-5xl",
    name: "text-lg",
  },
};

export function LeagueBadge({
  tier,
  size = "md",
  showName = false,
  showIcon = true,
  animated = false,
  className,
}: LeagueBadgeProps) {
  const league = LEAGUES[tier];
  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
          LEAGUE_GRADIENTS[tier],
          sizes.container,
          animated && "animate-pulse",
          tier === "diamond" && "shadow-cyan-500/50",
          tier === "platinum" && "shadow-slate-400/50",
          tier === "gold" && "shadow-yellow-500/50",
          tier === "silver" && "shadow-gray-400/50",
          tier === "bronze" && "shadow-amber-700/50"
        )}
        style={{
          boxShadow: `0 4px 20px ${LEAGUE_COLORS[tier]}40`,
        }}
      >
        {/* Inner glow effect */}
        <div
          className={cn(
            "absolute inset-1 rounded-full bg-gradient-to-br opacity-50",
            tier === "diamond" && "from-white to-cyan-200",
            tier === "platinum" && "from-white to-slate-200",
            tier === "gold" && "from-yellow-200 to-yellow-400",
            tier === "silver" && "from-gray-200 to-gray-300",
            tier === "bronze" && "from-amber-200 to-amber-400"
          )}
        />
        
        {/* Icon */}
        {showIcon && (
          <span className={cn("relative z-10", sizes.icon)}>
            {league.icon}
          </span>
        )}
      </div>
      
      {/* League name */}
      {showName && (
        <span
          className={cn(
            "font-semibold text-center",
            sizes.name
          )}
          style={{ color: LEAGUE_COLORS[tier] }}
        >
          {league.name}
        </span>
      )}
    </div>
  );
}

interface LeagueIndicatorProps {
  tier: LeagueTier;
  className?: string;
}

export function LeagueIndicator({ tier, className }: LeagueIndicatorProps) {
  const league = LEAGUES[tier];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: `${LEAGUE_COLORS[tier]}20`,
        color: LEAGUE_COLORS[tier],
        border: `1px solid ${LEAGUE_COLORS[tier]}40`,
      }}
    >
      <span>{league.icon}</span>
      <span>{league.name}</span>
    </div>
  );
}

interface LeagueProgressBarProps {
  currentTier: LeagueTier;
  weeklyXP: number;
  className?: string;
}

export function LeagueProgressBar({
  currentTier,
  weeklyXP,
  className,
}: LeagueProgressBarProps) {
  const league = LEAGUES[currentTier];
  const nextLeague = currentTier === "diamond" ? null : LEAGUES[
    currentTier === "bronze"
      ? "silver"
      : currentTier === "silver"
      ? "gold"
      : currentTier === "gold"
      ? "platinum"
      : "diamond"
  ];

  const progress = nextLeague
    ? Math.min(
        100,
        ((weeklyXP - league.minXP) / (nextLeague.minXP - league.minXP)) * 100
      )
    : 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{weeklyXP} XP</span>
        {nextLeague && (
          <span className="text-muted-foreground">
            {nextLeague.minXP - weeklyXP} XP to {nextLeague.name}
          </span>
        )}
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            LEAGUE_GRADIENTS[currentTier]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface MiniLeagueBadgeProps {
  tier: LeagueTier;
  className?: string;
}

export function MiniLeagueBadge({ tier, className }: MiniLeagueBadgeProps) {
  const league = LEAGUES[tier];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs",
        className
      )}
      style={{
        backgroundColor: `${LEAGUE_COLORS[tier]}20`,
      }}
      title={league.name}
    >
      {league.icon}
    </div>
  );
}
