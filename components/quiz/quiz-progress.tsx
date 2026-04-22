"use client";

import { Progress } from "@/components/ui/progress";
import { Trophy, Clock } from "lucide-react";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
  progressPercentage: number;
  timeRemaining?: number | null; // in seconds
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  correctCount,
  progressPercentage,
  timeRemaining,
}: QuizProgressProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeLow = timeRemaining !== undefined && timeRemaining !== null && timeRemaining < 60;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-2" />
      
      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Question <span className="font-semibold text-foreground">{currentQuestion}</span> of{" "}
            <span className="font-semibold text-foreground">{totalQuestions}</span>
          </span>
          
          {timeRemaining !== undefined && timeRemaining !== null && (
            <div className={`flex items-center gap-1.5 ${isTimeLow ? "text-red-600" : "text-muted-foreground"}`}>
              <Clock className="w-4 h-4" />
              <span className={`font-mono font-medium ${isTimeLow ? "animate-pulse" : ""}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
          <Trophy className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-600">
            {correctCount}/{totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuizProgress;
