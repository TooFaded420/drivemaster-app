"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionWithAnswers } from "@/types/database";
import { Flag, ImageIcon } from "lucide-react";

interface QuestionCardProps {
  question: QuestionWithAnswers;
  questionNumber: number;
  totalQuestions: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  isFlagged,
  onToggleFlag,
}: QuestionCardProps) {
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            {question.difficulty && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  question.difficulty === "hard" 
                    ? "border-red-200 text-red-600" 
                    : question.difficulty === "medium"
                    ? "border-amber-200 text-amber-600"
                    : "border-emerald-200 text-emerald-600"
                }`}
              >
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </Badge>
            )}
          </div>
          <button
            onClick={onToggleFlag}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors ${
              isFlagged
                ? "text-orange-500 bg-orange-100"
                : "text-muted-foreground hover:text-muted-foreground hover:bg-muted"
            }`}
            aria-label={isFlagged ? "Unflag this question" : "Flag this question"}
          >
            <Flag className={`h-5 w-5 ${isFlagged ? "fill-current" : ""}`} aria-hidden="true" />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            <CardTitle className="text-xl leading-relaxed">
              {question.question_text}
            </CardTitle>
          </motion.div>
        </AnimatePresence>

        {question.image_url && (
          <div className="mt-4 rounded-lg overflow-hidden bg-muted border border-border">
            <div className="aspect-video flex items-center justify-center">
              {imgError ? (
                <ImageIcon className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={question.image_url}
                  alt={`Question image: ${question.question_text.slice(0, 60)}...`}
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}

export default QuestionCard;
