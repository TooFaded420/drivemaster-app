"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LeagueTier,
  LEAGUES,
  LEAGUE_COLORS,
  getNextLeague,
  getPreviousLeague,
  TOP_THREE_REWARDS,
} from "@/lib/gamification/leagues";
import { LeagueBadge } from "./league-badge";
import { Trophy, ArrowUp, ArrowDown, Sparkles, X, Share2 } from "lucide-react";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousLeague: LeagueTier;
  currentLeague: LeagueTier;
  finalRank: number;
  weeklyXP: number;
}

export function PromotionModal({
  isOpen,
  onClose,
  previousLeague,
  currentLeague,
  finalRank,
  weeklyXP,
}: PromotionModalProps) {
  const isPromotion =
    currentLeague !== previousLeague &&
    currentLeague > previousLeague;

  useEffect(() => {
    if (isOpen && isPromotion) {
      // Simple celebration animation without confetti library
      const timer = setTimeout(() => {
        // Animation handled by framer-motion
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isPromotion]);

  const currentLeagueData = LEAGUES[currentLeague];
  const previousLeagueData = LEAGUES[previousLeague];
  const rewards = TOP_THREE_REWARDS[finalRank] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header with gradient */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-32 -mx-6 -mt-6",
                  isPromotion
                    ? "bg-gradient-to-b from-green-500/20 to-transparent"
                    : "bg-gradient-to-b from-red-500/20 to-transparent"
                )}
              />

              <DialogHeader className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <DialogTitle
                  className={cn(
                    "text-center text-2xl",
                    isPromotion ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPromotion ? "🎉 Promotion!" : "League Update"}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {isPromotion
                    ? "Amazing work! You've advanced to a higher league!"
                    : "The weekly competition has ended. Here's your result:"}
                </DialogDescription>
              </DialogHeader>

              {/* League Transition */}
              <div className="flex items-center justify-center gap-4 my-6">
                {/* Previous League */}
                <div className="flex flex-col items-center opacity-50">
                  <LeagueBadge tier={previousLeague} size="md" />
                  <span className="text-sm text-muted-foreground mt-2">
                    {previousLeagueData.name}
                  </span>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={
                    isPromotion
                      ? { x: [0, 5, 0], y: [0, -5, 0] }
                      : { x: [0, -5, 0], y: [0, 5, 0] }
                  }
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {isPromotion ? (
                    <ArrowUp className="w-8 h-8 text-green-500" />
                  ) : (
                    <ArrowDown className="w-8 h-8 text-red-500" />
                  )}
                </motion.div>

                {/* Current League */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <LeagueBadge
                      tier={currentLeague}
                      size="lg"
                      animated={isPromotion}
                    />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-bold mt-2"
                    style={{ color: LEAGUE_COLORS[currentLeague] }}
                  >
                    {currentLeagueData.name}
                  </motion.span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">#{finalRank}</div>
                  <div className="text-xs text-muted-foreground">Final Rank</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {weeklyXP.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Weekly XP</div>
                </div>
              </div>

              {/* Rewards */}
              {rewards.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Rewards Earned
                  </h4>
                  <div className="space-y-2">
                    {rewards.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-3 p-2 bg-primary/5 rounded-lg"
                      >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{reward.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {reward.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* New League Benefits */}
              {isPromotion && (
                <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    {currentLeagueData.name} Benefits
                  </h4>
                  <ul className="space-y-1">
                    {currentLeagueData.rewards.map((reward, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span>•</span>
                        {reward.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <Button className="flex-1" onClick={onClose}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

interface DemotionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLeague: LeagueTier;
  currentRank: number;
  totalParticipants: number;
  xpNeeded: number;
}

export function DemotionWarningModal({
  isOpen,
  onClose,
  currentLeague,
  currentRank,
  totalParticipants,
  xpNeeded,
}: DemotionWarningModalProps) {
  const league = LEAGUES[currentLeague];
  const previousLeague = getPreviousLeague(currentLeague);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDown className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl text-red-600">
            ⚠️ At Risk of Demotion
          </DialogTitle>
          <DialogDescription className="text-center">
            You're in the demotion zone! Study more to stay in {league.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <LeagueBadge tier={currentLeague} size="sm" />
              <div>
                <p className="font-semibold">{league.name}</p>
                <p className="text-sm text-muted-foreground">
                  Rank #{currentRank} of {totalParticipants}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">XP needed to be safe:</span>
              <span className="font-semibold text-red-600">
                {xpNeeded.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/5 bg-red-500 rounded-full" />
            </div>
          </div>

          {/* What happens if demoted */}
          {previousLeague && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                If demoted, you'll return to{" "}
                <span className="font-medium" style={{ color: LEAGUE_COLORS[previousLeague] }}>
                  {LEAGUES[previousLeague].name}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Dismiss
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Start Studying
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
