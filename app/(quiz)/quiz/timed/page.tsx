"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Dash } from "@/components/mascot";
import { useMascot } from "@/hooks/use-mascot";
import { useQuiz } from "@/hooks/use-quiz";
import { createClient } from "@/lib/supabase/client";
import {
  QuestionCard,
  AnswerOptions,
  QuizProgress,
  ExplanationCard,
  QuizControls,
  StreakIndicator,
} from "@/components/quiz";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ArrowLeft, Trophy, AlertTriangle } from "lucide-react";

// Illinois DMV test configuration
const ILLINOIS_TEST_CONFIG = {
  questionCount: 35,
  timeLimit: 45, // minutes
  passingScore: 28, // 80%
};

export default function TimedQuizPage() {
  const router = useRouter();
  const mascot = useMascot({ autoHideDelay: 4000 });
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUserId(data.user.id);
      setAuthChecked(true);
    });
  }, [router]);

  const quiz = useQuiz({
    quizType: "timed",
    questionCount: ILLINOIS_TEST_CONFIG.questionCount,
    timeLimit: ILLINOIS_TEST_CONFIG.timeLimit,
    userId,
    enabled: authChecked,
  });

  // Handle mascot reactions
  useEffect(() => {
    if (quiz.isAnswered) {
      if (quiz.isCorrect) {
        if (quiz.currentStreak >= 3) {
          mascot.show(
            "excited",
            `That's ${quiz.currentStreak} in a row! Keep it up! 🔥`,
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
      const correctCount = quiz.results.correctAnswers;
      const passed = correctCount >= ILLINOIS_TEST_CONFIG.passingScore;
      
      if (passed) {
        mascot.show(
          "excited",
          `Congratulations! You passed with ${correctCount}/${ILLINOIS_TEST_CONFIG.questionCount}! 🎉`,
          "Test Passed!"
        );
      } else {
        mascot.show(
          "encouraging",
          `You got ${correctCount}/${ILLINOIS_TEST_CONFIG.questionCount}. Keep practicing for the real test! 💪`,
          "Keep Trying!"
        );
      }

      // Store results in sessionStorage for the results page
      try {
        sessionStorage.setItem("quizResults", JSON.stringify(quiz.results));
      } catch {}

      // Redirect to results after a delay
      const timeout = setTimeout(() => {
        router.push("/quiz/results");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [quiz.isComplete, quiz.results]);

  // Time warning
  useEffect(() => {
    if (quiz.timeRemaining && quiz.timeRemaining < 300 && quiz.timeRemaining > 290) {
      // Show warning when 5 minutes remaining
      mascot.show(
        "thinking",
        "Only 5 minutes left! Make sure to answer all questions!",
        "Time Warning"
      );
    }
  }, [quiz.timeRemaining]);

  if (quiz.isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading test questions..." />
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

  if (!quiz.currentQuestion) {
    return null;
  }

  const correctAnswer = quiz.currentQuestion.answers.find((a) => a.is_correct);
  const correctCount = quiz.answers.filter((a) => a.isCorrect).length;
  const isTimeLow = quiz.timeRemaining !== null && quiz.timeRemaining < 300;

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
            {isTimeLow && (
              <div className="flex items-center gap-1 text-red-600 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Time Running Out!</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {correctCount}/{quiz.questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Progress with Timer */}
        <QuizProgress
          currentQuestion={quiz.currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          correctCount={correctCount}
          progressPercentage={quiz.progress}
          timeRemaining={quiz.timeRemaining}
        />

        {/* Test Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">
            <strong>Illinois DMV Practice Test</strong> • 
            Need {ILLINOIS_TEST_CONFIG.passingScore} correct to pass
          </p>
        </div>

        {/* Mascot — speechPosition="top": bubble rises upward, never
            overlaps the QuestionCard below */}
        <div className="flex justify-center py-2">
          <Dash
            emotion={mascot.emotion}
            size="md"
            animate={mascot.isAnimating}
            showSpeechBubble={mascot.isVisible}
            speechTitle={mascot.title}
            speechText={mascot.message}
            speechPosition="top"
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
