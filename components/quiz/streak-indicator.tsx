"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakIndicatorProps {
  streak: number;
  maxStreak?: number;
}

export function StreakIndicator({ streak, maxStreak }: StreakIndicatorProps) {
  if (streak < 2) return null;

  const getStreakMessage = (count: number): string => {
    if (count >= 10) return "Unstoppable!";
    if (count >= 7) return "On Fire!";
    if (count >= 5) return "Amazing!";
    if (count >= 3) return "Great!";
    return "Good!";
  };

  const getStreakColor = (count: number): string => {
    if (count >= 10) return "bg-purple-100 text-purple-700 border-purple-200";
    if (count >= 7) return "bg-red-100 text-red-700 border-red-200";
    if (count >= 5) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex justify-center"
      >
        <motion.div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStreakColor(
            streak
          )}`}
          animate={
            streak >= 5
              ? {
                  scale: [1, 1.05, 1],
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <motion.div
            animate={
              streak >= 3
                ? {
                    rotate: [0, -10, 10, -10, 10, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <Flame className="w-5 h-5 fill-current" />
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm leading-none">
              {streak} Streak!
            </span>
            <span className="text-xs opacity-80">{getStreakMessage(streak)}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StreakIndicator;
