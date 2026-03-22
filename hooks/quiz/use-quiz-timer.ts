"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useQuizTimer — Manages countdown timer for timed quiz mode
 *
 * Timer state machine:
 *   IDLE ──▶ RUNNING ──▶ EXPIRED
 *     │         │
 *     └─────────┴──▶ STOPPED (quiz complete)
 */

interface UseQuizTimerOptions {
  /** Time limit in minutes. If undefined, no timer. */
  timeLimit?: number;
  /** Called when timer reaches 0 */
  onTimeUp: () => void;
  /** If true, timer is paused (quiz already complete) */
  isComplete: boolean;
}

interface QuizTimerState {
  timeRemaining: number | null;
  isTimedMode: boolean;
}

export function useQuizTimer({ timeLimit, onTimeUp, isComplete }: UseQuizTimerOptions) {
  const timeLimitSeconds = timeLimit ? timeLimit * 60 : null;

  const [timeRemaining, setTimeRemaining] = useState<number | null>(timeLimitSeconds);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref fresh without re-registering interval
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!timeLimitSeconds || isComplete) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        if (next <= 0) {
          onTimeUpRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLimitSeconds, isComplete]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeRemaining(timeLimitSeconds);
  }, [timeLimitSeconds]);

  return {
    timeRemaining,
    isTimedMode: timeLimitSeconds !== null,
    resetTimer,
  };
}
