"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeagueStanding, TOP_THREE_REWARDS } from "@/lib/gamification/leagues";
import { Trophy, Crown, Medal } from "lucide-react";

interface TopThreePodiumProps {
  entries: LeagueStanding[];
  className?: string;
}

export function TopThreePodium({ entries, className }: TopThreePodiumProps) {
  // Get top 3 entries
  const topThree = entries.slice(0, 3);
  
  // Reorder for display: 2nd, 1st, 3rd
  const displayOrder = [
    topThree[1], // 2nd place
    topThree[0], // 1st place
    topThree[2], // 3rd place
  ].filter(Boolean);

  const getPodiumHeight = (index: number) => {
    switch (index) {
      case 1: // 1st place (center)
        return "h-48";
      case 0: // 2nd place (left)
      case 2: // 3rd place (right)
        return "h-36";
      default:
        return "h-24";
    }
  };

  const getPodiumColor = (index: number) => {
    switch (index) {
      case 1: // 1st place
        return "bg-gradient-to-b from-yellow-300 to-yellow-500";
      case 0: // 2nd place
        return "bg-gradient-to-b from-gray-300 to-gray-400";
      case 2: // 3rd place
        return "bg-gradient-to-b from-amber-400 to-amber-600";
      default:
        return "bg-muted";
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-600" />;
      case 0:
        return <Medal className="w-5 h-5 text-gray-600" />;
      case 2:
        return <Trophy className="w-5 h-5 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex items-end justify-center gap-4 py-8", className)}>
      {displayOrder.map((entry, index) => {
        if (!entry) return null;
        
        const actualRank = index === 1 ? 1 : index === 0 ? 2 : 3;
        const rewards = TOP_THREE_REWARDS[actualRank];
        
        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            {/* User Card */}
            <div
              className={cn(
                "relative flex flex-col items-center mb-4",
                index === 1 && "z-10"
              )}
            >
              {/* Rank Badge */}
              <div
                className={cn(
                  "absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                  actualRank === 1 && "bg-yellow-400",
                  actualRank === 2 && "bg-gray-300",
                  actualRank === 3 && "bg-amber-400"
                )}
              >
                {getRankIcon(index)}
              </div>

              {/* Avatar */}
              <motion.div
                animate={
                  actualRank === 1
                    ? {
                        y: [0, -5, 0],
                      }
                    : {}
                }
                transition={
                  actualRank === 1
                    ? {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }
                    : {}
                }
              >
                <Avatar
                  className={cn(
                    "border-4 shadow-xl",
                    actualRank === 1
                      ? "w-20 h-20 border-yellow-400"
                      : actualRank === 2
                      ? "w-16 h-16 border-gray-300"
                      : "w-16 h-16 border-amber-400"
                  )}
                >
                  <AvatarImage src={entry.avatarUrl || undefined} />
                  <AvatarFallback
                    className={cn(
                      "text-lg font-bold",
                      actualRank === 1 && "bg-yellow-100 text-yellow-700",
                      actualRank === 2 && "bg-gray-100 text-gray-700",
                      actualRank === 3 && "bg-amber-100 text-amber-700"
                    )}
                  >
                    {entry.displayName?.[0] || entry.username[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Name */}
              <p
                className={cn(
                  "mt-2 font-bold text-center max-w-[100px] truncate",
                  actualRank === 1 ? "text-lg" : "text-sm"
                )}
              >
                {entry.displayName || entry.username}
              </p>

              {/* XP */}
              <p className="text-sm text-muted-foreground">
                {entry.weeklyXP.toLocaleString()} XP
              </p>

              {/* Rewards */}
              <div className="flex flex-col items-center gap-1 mt-2">
                {rewards?.slice(0, 1).map((reward, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {reward.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Podium Base */}
            <div
              className={cn(
                "w-24 rounded-t-lg shadow-inner flex items-end justify-center pb-2",
                getPodiumHeight(index),
                getPodiumColor(index)
              )}
            >
              <span className="text-2xl font-bold text-white/80 drop-shadow-lg">
                {actualRank}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface CompactTopThreeProps {
  entries: LeagueStanding[];
  className?: string;
}

export function CompactTopThree({ entries, className }: CompactTopThreeProps) {
  const topThree = entries.slice(0, 3);

  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {topThree.map((entry, index) => {
        const rank = index + 1;
        
        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl border-2",
              rank === 1 && "bg-yellow-50 border-yellow-300",
              rank === 2 && "bg-gray-50 border-gray-300",
              rank === 3 && "bg-amber-50 border-amber-300"
            )}
          >
            {/* Rank */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                rank === 1 && "bg-yellow-400 text-yellow-900",
                rank === 2 && "bg-gray-300 text-gray-900",
                rank === 3 && "bg-amber-400 text-amber-900"
              )}
            >
              {rank === 1 ? (
                <Crown className="w-4 h-4" />
              ) : (
                <span className="font-bold">{rank}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar
              className={cn(
                "border-2 mb-2",
                rank === 1 && "w-14 h-14 border-yellow-400",
                rank === 2 && "w-12 h-12 border-gray-300",
                rank === 3 && "w-12 h-12 border-amber-400"
              )}
            >
              <AvatarImage src={entry.avatarUrl || undefined} />
              <AvatarFallback
                className={cn(
                  rank === 1 && "bg-yellow-100 text-yellow-700",
                  rank === 2 && "bg-gray-100 text-gray-700",
                  rank === 3 && "bg-amber-100 text-amber-700"
                )}
              >
                {entry.displayName?.[0] || entry.username[0]}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <p className="font-semibold text-sm text-center truncate w-full">
              {entry.displayName || entry.username}
            </p>

            {/* XP */}
            <p className="text-xs text-muted-foreground mt-1">
              {entry.weeklyXP.toLocaleString()} XP
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
