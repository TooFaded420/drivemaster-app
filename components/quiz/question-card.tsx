"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionWithAnswers } from "@/types/database";
import { ImageIcon } from "lucide-react";

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
                    ? "border-yellow-200 text-yellow-600"
                    : "border-green-200 text-green-600"
                }`}
              >
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </Badge>
            )}
          </div>
          <button
            onClick={onToggleFlag}
            className={`p-2 rounded-full transition-colors ${
              isFlagged
                ? "text-orange-500 bg-orange-100"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            aria-label={isFlagged ? "Unflag question" : "Flag question"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFlagged ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CardTitle className="text-lg leading-relaxed">
              {question.question_text}
            </CardTitle>
          </motion.div>
        </AnimatePresence>

        {question.image_url && (
          <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <div className="aspect-video flex items-center justify-center">
              {imgError ? (
                <ImageIcon className="w-12 h-12 text-gray-400" />
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
