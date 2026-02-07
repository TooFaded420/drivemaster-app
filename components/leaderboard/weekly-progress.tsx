"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LeagueTier,
  LEAGUES,
  LEAGUE_COLORS,
  LEAGUE_ORDER,
  LeagueProgress,
} from "@/lib/gamification/leagues";
import { Trophy, AlertTriangle, Shield, ChevronRight } from "lucide-react";

interface WeeklyProgressProps {
  progress: LeagueProgress;
  timeUntilReset: string;
  className?: string;
}

export function WeeklyProgress({
  progress,
  timeUntilReset,
  className,
}: WeeklyProgressProps) {
  const currentLeague = LEAGUES[progress.currentLeague];
  const nextLeague = LEAGUE_ORDER.indexOf(progress.currentLeague) < LEAGUE_ORDER.length - 1
    ? LEAGUES[LEAGUE_ORDER[LEAGUE_ORDER.indexOf(progress.currentLeague) + 1]]
    : null;

  const getStatusIcon = () => {
    if (progress.promotionZone) {
      return <Trophy className="w-5 h-5 text-green-500" />;
    }
    if (progress.demotionZone) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    return <Shield className="w-5 h-5 text-blue-500" />;
  };

  const getStatusText = () => {
    if (progress.promotionZone) {
      return {
        title: "Promotion Zone!",
        description: "Keep it up to advance to the next league!",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    }
    if (progress.demotionZone) {
      return {
        title: "At Risk of Demotion",
        description: "Study more to stay in your league!",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    }
    return {
      title: "Safe Zone",
      description: "You're secure in your current league.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    };
  };

  const status = getStatusText();

  // Calculate progress to next league
  const progressToNext = nextLeague
    ? Math.min(
        100,
        ((progress.weeklyXP - currentLeague.minXP) /
          (nextLeague.minXP - currentLeague.minXP)) *
          100
      )
    : 100;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Resets in:</span>
            <span className="font-mono font-medium">{timeUntilReset}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current League Display */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{
              backgroundColor: `${LEAGUE_COLORS[progress.currentLeague]}20`,
            }}
          >
            {currentLeague.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{currentLeague.name}</h3>
            <p className="text-sm text-muted-foreground">
              {progress.weeklyXP.toLocaleString()} XP earned this week
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: LEAGUE_COLORS[progress.currentLeague] }}>
              #{progress.rank}
            </div>
            <p className="text-xs text-muted-foreground">
              of {progress.totalParticipants}
            </p>
          </div>
        </div>

        {/* Progress to Next League */}
        {nextLeague && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextLeague.name}</span>
              <span className="font-medium">
                {progress.xpToPromotion?.toLocaleString()} XP needed
              </span>
            </div>
            <div className="relative">
              <Progress value={progressToNext} className="h-3" />
              <motion.div
                className="absolute top-0 left-0 h-3 rounded-full"
                style={{
                  backgroundColor: LEAGUE_COLORS[progress.currentLeague],
                  width: `${progressToNext}%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentLeague.minXP.toLocaleString()} XP</span>
              <ChevronRight className="w-3 h-3" />
              <span>{nextLeague.minXP.toLocaleString()} XP</span>
            </div>
          </div>
        )}

        {/* Status Alert */}
        <div
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg",
            status.bgColor
          )}
        >
          {getStatusIcon()}
          <div>
            <p className={cn("font-semibold", status.color)}>{status.title}</p>
            <p className="text-sm text-muted-foreground">{status.description}</p>
          </div>
        </div>

        {/* Zone Indicators */}
        <div className="flex gap-2 text-xs">
          <div
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-center transition-colors",
              progress.promotionZone
                ? "bg-green-100 text-green-700 font-medium"
                : "bg-muted text-muted-foreground"
            )}
          >
            <div className="font-semibold">Top 30%</div>
            <div>Promotion</div>
          </div>
          <div
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-center transition-colors",
              progress.safeZone
                ? "bg-blue-100 text-blue-700 font-medium"
                : "bg-muted text-muted-foreground"
            )}
          >
            <div className="font-semibold">Middle</div>
            <div>Safe</div>
          </div>
          <div
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-center transition-colors",
              progress.demotionZone
                ? "bg-red-100 text-red-700 font-medium"
                : "bg-muted text-muted-foreground"
            )}
          >
            <div className="font-semibold">Bottom 20%</div>
            <div>Demotion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MiniWeeklyProgressProps {
  weeklyXP: number;
  currentLeague: LeagueTier;
  className?: string;
}

export function MiniWeeklyProgress({
  weeklyXP,
  currentLeague,
  className,
}: MiniWeeklyProgressProps) {
  const league = LEAGUES[currentLeague];
  const nextLeague = LEAGUE_ORDER.indexOf(currentLeague) < LEAGUE_ORDER.length - 1
    ? LEAGUES[LEAGUE_ORDER[LEAGUE_ORDER.indexOf(currentLeague) + 1]]
    : null;

  const progress = nextLeague
    ? Math.min(
        100,
        ((weeklyXP - league.minXP) / (nextLeague.minXP - league.minXP)) * 100
      )
    : 100;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{weeklyXP.toLocaleString()} XP</span>
        {nextLeague && (
          <span className="text-muted-foreground">
            {nextLeague.minXP - weeklyXP} to {nextLeague.name}
          </span>
        )}
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: LEAGUE_COLORS[currentLeague] }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
