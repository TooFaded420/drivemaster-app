"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRef, KeyboardEvent } from "react";
import { Tables } from "@/types/database";

interface AnswerOptionsProps {
  answers: Tables<'answers'>[];
  selectedAnswerId: number | null;
  correctAnswerId: number | null;
  isAnswered: boolean;
  onSelectAnswer: (answerId: number) => void;
}

export function AnswerOptions({
  answers,
  selectedAnswerId,
  correctAnswerId,
  isAnswered,
  onSelectAnswer,
}: AnswerOptionsProps) {
  // Sort answers by sort_order if available
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.sort_order !== null && b.sort_order !== null) {
      return a.sort_order - b.sort_order;
    }
    return a.id - b.id;
  });

  const getOptionLetter = (index: number) => String.fromCharCode(65 + index);

  // Refs for each option button so arrow-key focus works
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (isAnswered) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % sortedAnswers.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + sortedAnswers.length) % sortedAnswers.length;
      buttonRefs.current[prev]?.focus();
    }
  };

  return (
    <div role="radiogroup" aria-label="Answer options" className="space-y-3">
      {sortedAnswers.map((answer, index) => {
        const isSelected = selectedAnswerId === answer.id;
        const isCorrect = answer.is_correct;
        const showCorrectness = isAnswered;

        let buttonClass = "w-full p-4 rounded-xl text-left transition-all border-2 ";
        let letterClass = "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ";

        if (showCorrectness) {
          if (isCorrect) {
            // Correct answer
            buttonClass += "border-green-500 bg-green-50";
            letterClass += "bg-green-500 text-white";
          } else if (isSelected) {
            // Wrong selected answer
            buttonClass += "border-red-500 bg-red-50";
            letterClass += "bg-red-500 text-white";
          } else {
            // Unselected wrong answer
            buttonClass += "border-gray-200 bg-white opacity-60";
            letterClass += "bg-gray-200 text-gray-600";
          }
        } else {
          // Not answered yet
          if (isSelected) {
            buttonClass += "border-blue-500 bg-blue-50";
            letterClass += "bg-blue-500 text-white";
          } else {
            buttonClass += "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50";
            letterClass += "bg-gray-200 text-gray-600";
          }
        }

        return (
          <motion.button
            key={answer.id}
            ref={(el) => { buttonRefs.current[index] = el; }}
            role="radio"
            aria-checked={isSelected}
            onClick={() => !isAnswered && onSelectAnswer(answer.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={isAnswered}
            className={buttonClass}
            whileHover={!isAnswered ? { scale: 1.01 } : {}}
            whileTap={!isAnswered ? { scale: 0.99 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-4">
              <div className={letterClass} aria-hidden="true">
                {showCorrectness ? (
                  isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    getOptionLetter(index)
                  )
                ) : (
                  getOptionLetter(index)
                )}
              </div>
              <span
                className={`flex-1 text-base ${
                  showCorrectness
                    ? isCorrect
                      ? "text-green-700 font-medium"
                      : isSelected
                      ? "text-red-700"
                      : "text-gray-600"
                    : "text-gray-700"
                }`}
              >
                {answer.answer_text}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default AnswerOptions;
