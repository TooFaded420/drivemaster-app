"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ArrowLeft, Trophy, Infinity, Pause } from "lucide-react";

export default function MarathonQuizPage() {
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
    quizType: "marathon",
    questionCount: 100, // Will load all available questions
    userId,
    enabled: authChecked,
  });

  // Handle mascot reactions
  useEffect(() => {
    if (quiz.isAnswered) {
      if (quiz.isCorrect) {
        // Milestone celebrations
        const milestones = [10, 25, 50, 75, 100];
        if (milestones.includes(quiz.currentQuestionIndex + 1)) {
          mascot.show(
            "excited",
            `Amazing! You've answered ${quiz.currentQuestionIndex + 1} questions! Keep going! 🎉`,
            "Milestone!"
          );
        } else if (quiz.currentStreak >= 5) {
          mascot.show(
            "excited",
            `Incredible streak! ${quiz.currentStreak} in a row! 🔥`,
            "On Fire!"
          );
        } else {
          mascot.celebrate();
        }
      } else {
        mascot.encourage();
      }
    }
  }, [quiz.isAnswered, quiz.isCorrect, quiz.currentStreak, quiz.currentQuestionIndex]);

  // Handle quiz completion
  useEffect(() => {
    if (quiz.isComplete && quiz.results) {
      mascot.show(
        "excited",
        `Marathon complete! You answered ${quiz.results.totalQuestions} questions! You're a true champion! 🏆`,
        "Marathon Complete!"
      );

      // Store results in sessionStorage for the results page
      try {
        sessionStorage.setItem("quizResults", JSON.stringify(quiz.results));
      } catch {}

      // Redirect to results after a delay
      const timeout = setTimeout(() => {
        router.push("/quiz/results");
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [quiz.isComplete, quiz.results]);

  if (quiz.isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading marathon questions..." />
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
  const progressPercentage = (quiz.currentQuestionIndex / quiz.questions.length) * 100;

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
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              <Infinity className="w-3 h-3 mr-1" />
              Marathon
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Question <span className="font-semibold">{quiz.currentQuestionIndex + 1}</span> of{" "}
              <span className="font-semibold">{quiz.questions.length}</span>
            </span>
            <span className="text-orange-600 font-medium">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Marathon Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-700">
            <Infinity className="w-5 h-5" />
            <span className="text-sm font-medium">
              Marathon Mode: Answer all {quiz.questions.length} questions
            </span>
          </div>
        </div>

        {/* Mascot */}
        {/* speechPosition="top" — bubble rises up, never overlaps QuestionCard */}
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

        {/* Take a Break Reminder */}
        {quiz.currentQuestionIndex > 0 && quiz.currentQuestionIndex % 25 === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Pause className="w-4 h-4" />
              <span className="text-sm">
                You've answered {quiz.currentQuestionIndex} questions! Consider taking a short break.
              </span>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
