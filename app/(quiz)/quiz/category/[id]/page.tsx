"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dash } from "@/components/mascot";
import { useMascot } from "@/hooks/use-mascot";
import { useQuiz } from "@/hooks/use-quiz";
import {
  QuestionCard,
  AnswerOptions,
  QuizProgress,
  ExplanationCard,
  QuizControls,
  StreakIndicator,
} from "@/components/quiz";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowLeft, Trophy, Target, BookOpen } from "lucide-react";

// Category info mapping
const CATEGORY_INFO: Record<number, { name: string; icon: typeof Target; color: string }> = {
  1: { name: "Traffic Signs", icon: Target, color: "text-red-600" },
  2: { name: "Rules of the Road", icon: BookOpen, color: "text-blue-600" },
  3: { name: "Safe Driving", icon: Target, color: "text-green-600" },
  4: { name: "Alcohol & Drugs", icon: Target, color: "text-yellow-600" },
  5: { name: "Vehicle Operation", icon: Target, color: "text-purple-600" },
  6: { name: "Sharing the Road", icon: Target, color: "text-pink-600" },
};

export default function CategoryQuizPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  const mascot = useMascot({ autoHideDelay: 4000 });
  
  const categoryInfo = CATEGORY_INFO[categoryId] || { 
    name: "Category Practice", 
    icon: Target, 
    color: "text-blue-600" 
  };
  const CategoryIcon = categoryInfo.icon;
  
  const quiz = useQuiz({
    quizType: "category",
    categoryId,
    questionCount: 15,
  });

  // Handle mascot reactions
  useEffect(() => {
    if (quiz.isAnswered) {
      if (quiz.isCorrect) {
        if (quiz.currentStreak >= 3) {
          mascot.show(
            "excited",
            `Amazing! That's ${quiz.currentStreak} correct in a row! 🔥`,
            "Streak!"
          );
        } else {
          mascot.celebrate();
        }
      } else {
        mascot.encourage();
      }
    }
  }, [quiz.isAnswered, quiz.isCorrect, quiz.currentStreak]);

  // Handle quiz completion
  useEffect(() => {
    if (quiz.isComplete && quiz.results) {
      const percentage = quiz.results.accuracy;
      
      if (percentage >= 80) {
        mascot.show(
          "excited",
          `Excellent! You mastered ${categoryInfo.name} with ${percentage}%! 🎉`,
          "Category Mastered!"
        );
      } else if (percentage >= 60) {
        mascot.show(
          "happy",
          `Good progress on ${categoryInfo.name}! You scored ${percentage}%.`,
          "Keep Learning!"
        );
      } else {
        mascot.show(
          "encouraging",
          `Keep practicing ${categoryInfo.name}! You'll get better with time! 💪`,
          "Don't Give Up!"
        );
      }

      // Redirect to results after a delay
      const timeout = setTimeout(() => {
        router.push("/quiz/results");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [quiz.isComplete, quiz.results, categoryInfo.name]);

  // Welcome message
  useEffect(() => {
    if (!quiz.isLoading && quiz.questions.length > 0) {
      mascot.show(
        "happy",
        `Let's practice ${categoryInfo.name}! Focus on this category to improve your skills.`,
        categoryInfo.name
      );
    }
  }, [quiz.isLoading, quiz.questions.length, categoryInfo.name]);

  if (quiz.isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text={`Loading ${categoryInfo.name} questions...`} />
        </div>
      </MobileLayout>
    );
  }

  if (quiz.error) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load questions
          </h2>
          <p className="text-gray-600 mb-4">{quiz.error}</p>
          <Button onClick={() => quiz.restartQuiz()}>Try Again</Button>
        </div>
      </MobileLayout>
    );
  }

  // Empty state
  if (!quiz.isLoading && quiz.questions.length === 0) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CategoryIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            There are no questions available for this category yet. Check back later!
          </p>
          <Link href="/quiz">
            <Button>Back to Quiz Lobby</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  if (!quiz.currentQuestion) {
    return null;
  }

  const correctAnswer = quiz.currentQuestion.answers.find((a) => a.is_correct);
  const correctCount = quiz.answers.filter((a) => a.isCorrect).length;

  return (
    <MobileLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/quiz">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Exit
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`border-current ${categoryInfo.color}`}>
              <CategoryIcon className="w-3 h-3 mr-1" />
              {categoryInfo.name}
            </Badge>
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {correctCount}/{quiz.questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <QuizProgress
          currentQuestion={quiz.currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          correctCount={correctCount}
          progressPercentage={quiz.progress}
        />

        {/* Category Info */}
        <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3`}>
          <div className={`flex items-center gap-2 ${categoryInfo.color}`}>
            <CategoryIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              Practicing: {categoryInfo.name}
            </span>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex justify-center py-2">
          <Dash
            emotion={mascot.emotion}
            size="md"
            animate={mascot.isAnimating}
            showSpeechBubble={mascot.isVisible}
            speechTitle={mascot.title}
            speechText={mascot.message}
            speechPosition="bottom"
            onSpeechBubbleClick={() => mascot.hide()}
          />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={quiz.currentQuestion}
          questionNumber={quiz.currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          isFlagged={quiz.flaggedQuestions.includes(quiz.currentQuestionIndex)}
          onToggleFlag={() => quiz.flagQuestion(quiz.currentQuestionIndex)}
        />

        {/* Answer Options */}
        <AnswerOptions
          answers={quiz.currentQuestion.answers}
          selectedAnswerId={quiz.currentAnswer}
          correctAnswerId={quiz.isAnswered ? correctAnswer?.id || null : null}
          isAnswered={quiz.isAnswered}
          onSelectAnswer={quiz.selectAnswer}
        />

        {/* Explanation */}
        <AnimatePresence>
          {quiz.isAnswered && (
            <ExplanationCard
              isCorrect={quiz.isCorrect || false}
              explanation={quiz.currentQuestion.explanation}
              correctAnswer={correctAnswer?.answer_text || ""}
            />
          )}
        </AnimatePresence>

        {/* Controls */}
        <QuizControls
          onPrevious={quiz.canGoBack ? quiz.previousQuestion : undefined}
          onNext={quiz.nextQuestion}
          onSubmit={quiz.submitAnswer}
          onExit={() => router.push("/quiz")}
          onFlag={() => quiz.flagQuestion(quiz.currentQuestionIndex)}
          isFlagged={quiz.flaggedQuestions.includes(quiz.currentQuestionIndex)}
          canGoBack={quiz.canGoBack}
          canGoForward={quiz.canGoForward}
          isAnswered={quiz.isAnswered}
          hasSelectedAnswer={quiz.currentAnswer !== null}
          isLastQuestion={quiz.currentQuestionIndex === quiz.questions.length - 1}
          isComplete={quiz.isComplete}
        />

        {/* Streak Indicator */}
        <StreakIndicator streak={quiz.currentStreak} />
      </div>
    </MobileLayout>
  );
}
