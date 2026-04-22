"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dash } from "@/components/mascot";
import { ASSESSMENT_QUESTIONS } from "@/lib/constants/onboarding";
import { OnboardingData } from "@/types/database";
import { Check, X, HelpCircle } from "lucide-react";

interface StepAssessmentProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

export function StepAssessment({ data, updateData, onComplete }: StepAssessmentProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = (answerId: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    
    setSelectedAnswer(answerId);
    const isCorrect = question.answers.find(a => a.id === answerId)?.isCorrect || false;
    
    setAnswers(prev => [...prev, { questionId: question.id, correct: isCorrect }]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    const correctCount = answers.filter(a => a.correct).length;
    const score = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);

    updateData({
      assessment: {
        score,
        answers,
      },
    });

    onComplete({
      assessment: {
        score,
        answers,
      },
    });
  };

  const correctCount = answers.filter(a => a.correct).length;
  const score = isFinished 
    ? Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100)
    : 0;

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <Dash
          emotion={score >= 60 ? "excited" : "encouraging"}
          size="lg"
          animate={true}
          showSpeechBubble={true}
          speechTitle={score >= 60 ? "Great Job! 🎉" : "Good Effort! 💪"}
          speechText={
            score >= 60
              ? `You scored ${score}%! You're off to a great start. Let's keep learning!`
              : `You scored ${score}%. Don't worry - that's why we're here to help you improve!`
          }
          speechPosition="bottom"
        />

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Assessment Complete!</h2>
          <p className="text-muted-foreground">You got {correctCount} out of {ASSESSMENT_QUESTIONS.length} correct</p>
        </div>

        {/* Score display */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <motion.path
              className={score >= 60 ? "text-green-500" : "text-orange-500"}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${score}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}%</span>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleFinish}
          className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
        >
          Continue
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Quick Assessment</h2>
          <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</p>
        </div>
        <Dash
          emotion="thinking"
          size="sm"
          animate={selectedAnswer === null}
        />
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          className="space-y-4"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">{question.question}</h3>
            
            <div className="space-y-2">
              {question.answers.map((answer) => {
                const isSelected = selectedAnswer === answer.id;
                const isCorrect = answer.isCorrect;
                const showResult = selectedAnswer !== null;

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    disabled={selectedAnswer !== null}
                    className={`
                      w-full p-4 rounded-lg border-2 text-left transition-all
                      ${showResult && isCorrect
                        ? "border-green-500 bg-green-50"
                        : showResult && isSelected && !isCorrect
                        ? "border-red-500 bg-red-50"
                        : isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                      }
                      ${showResult ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{answer.text}</span>
                      {showResult && isCorrect && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 rounded-xl border border-blue-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">Explanation</p>
                    <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                size="lg"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
              >
                {currentQuestion < ASSESSMENT_QUESTIONS.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
