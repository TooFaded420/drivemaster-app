"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Flag, X, Check } from "lucide-react";

interface QuizControlsProps {
  onPrevious?: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onExit: () => void;
  onFlag: () => void;
  onComplete?: () => void;
  isFlagged: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isAnswered: boolean;
  hasSelectedAnswer: boolean;
  isLastQuestion: boolean;
  isComplete: boolean;
}

export function QuizControls({
  onPrevious,
  onNext,
  onSubmit,
  onExit,
  onFlag,
  onComplete,
  isFlagged,
  canGoBack,
  canGoForward,
  isAnswered,
  hasSelectedAnswer,
  isLastQuestion,
  isComplete,
}: QuizControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Main action button */}
      {!isAnswered ? (
        <Button
          className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
          disabled={!hasSelectedAnswer}
          onClick={onSubmit}
        >
          <Check className="w-5 h-5 mr-2" />
          Check Answer
        </Button>
      ) : (
        <Button
          className="w-full h-14 text-lg"
          onClick={isLastQuestion ? (onComplete || onExit) : onNext}
        >
          {isLastQuestion ? (
            <>
              View Results <Check className="ml-2 w-5 h-5" />
            </>
          ) : (
            <>
              Next Question <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      )}

      {/* Secondary controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onFlag}
            className={`flex items-center gap-1 ${
              isFlagged
                ? "bg-orange-100 text-orange-600 border-orange-200"
                : ""
            }`}
          >
            <Flag className={`w-4 h-4 ${isFlagged ? "fill-current" : ""}`} />
            {isFlagged ? "Flagged" : "Flag"}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-1" />
          Exit
        </Button>
      </div>
    </div>
  );
}

export default QuizControls;
