"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeagueStanding, LeagueTier } from "@/lib/gamification/leagues";
import { MiniLeagueBadge } from "./league-badge";
import { TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from "lucide-react";

interface LeaderboardRowProps {
  entry: LeagueStanding;
  isCurrentUser?: boolean;
  showLeagueBadge?: boolean;
  className?: string;
}

export function LeaderboardRow({
  entry,
  isCurrentUser = false,
  showLeagueBadge = false,
  className,
}: LeaderboardRowProps) {
  const rankChange = entry.previousRank
    ? entry.previousRank - entry.rank
    : 0;

  const getRankIcon = () => {
    switch (entry.rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankStyle = () => {
    switch (entry.rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/10 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/20 dark:to-gray-700/10 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-300";
      default:
        return isCurrentUser
          ? "bg-primary/5 border-primary/20"
          : "hover:bg-muted/50";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all",
        getRankStyle(),
        isCurrentUser && "ring-2 ring-primary/20",
        className
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-10">
        {getRankIcon() || (
          <span
            className={cn(
              "text-sm font-bold",
              entry.rank <= 10 ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Rank Change */}
      <div className="flex items-center justify-center w-8">
        {rankChange > 0 ? (
          <div className="flex items-center gap-0.5 text-green-500">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">{rankChange}</span>
          </div>
        ) : rankChange < 0 ? (
          <div className="flex items-center gap-0.5 text-red-500">
            <TrendingDown className="w-3 h-3" />
            <span className="text-xs font-medium">{Math.abs(rankChange)}</span>
          </div>
        ) : (
          <Minus className="w-3 h-3 text-muted-foreground" />
        )}
      </div>

      {/* Avatar */}
      <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
        <AvatarImage src={entry.avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {entry.displayName?.[0] || entry.username[0]}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium truncate",
              isCurrentUser && "text-primary"
            )}
          >
            {entry.displayName || entry.username}
          </span>
          {isCurrentUser && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{entry.totalXP.toLocaleString()} total XP</span>
          {showLeagueBadge && (entry as LeagueStanding & { leagueTier?: string }).leagueTier && (
            <>
              <span>•</span>
              <MiniLeagueBadge tier={((entry as LeagueStanding & { leagueTier?: string }).leagueTier || "bronze") as LeagueTier} />
            </>
          )}
        </div>
      </div>

      {/* Weekly XP */}
      <div className="text-right">
        <div className="font-bold text-foreground">
          {entry.weeklyXP.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">XP this week</div>
      </div>
    </div>
  );
}

interface CompactLeaderboardRowProps {
  entry: LeagueStanding;
  isCurrentUser?: boolean;
  className?: string;
}

export function CompactLeaderboardRow({
  entry,
  isCurrentUser = false,
  className,
}: CompactLeaderboardRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
        isCurrentUser
          ? "bg-primary/5 border border-primary/20"
          : "hover:bg-muted/50",
        className
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "text-sm font-bold w-6 text-center",
          entry.rank <= 3 ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {entry.rank}
      </span>

      {/* Avatar */}
      <Avatar className="w-8 h-8">
        <AvatarImage src={entry.avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {entry.displayName?.[0] || entry.username[0]}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <span
        className={cn(
          "flex-1 text-sm font-medium truncate",
          isCurrentUser && "text-primary"
        )}
      >
        {entry.displayName || entry.username}
      </span>

      {/* XP */}
      <span className="text-sm font-semibold">
        {entry.weeklyXP.toLocaleString()}
      </span>
    </div>
  );
}
