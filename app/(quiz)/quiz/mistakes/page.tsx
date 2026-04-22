"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { ArrowLeft, Trophy, RotateCcw, CheckCircle2, Brain } from "lucide-react";

export default function MistakesQuizPage() {
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
    quizType: "mistakes",
    questionCount: 20,
    userId,
    enabled: authChecked,
  });

  // Handle mascot reactions
  useEffect(() => {
    if (quiz.isAnswered) {
      if (quiz.isCorrect) {
        mascot.show(
          "excited",
          "Great job! You got it right this time! Keep it up! 🎉",
          "Mastered!"
        );
      } else {
        mascot.show(
          "encouraging",
          "Don't worry! Review the explanation and try again next time! 💪",
          "Keep Learning!"
        );
      }
    }
  }, [quiz.isAnswered, quiz.isCorrect]);

  // Handle quiz completion
  useEffect(() => {
    if (quiz.isComplete && quiz.results) {
      const masteredCount = quiz.results.correctAnswers;
      const totalReviewed = quiz.results.totalQuestions;
      
      if (masteredCount === totalReviewed) {
        mascot.show(
          "excited",
          `Amazing! You mastered all ${totalReviewed} questions! You're crushing it! 🏆`,
          "All Mastered!"
        );
      } else {
        mascot.show(
          "happy",
          `You mastered ${masteredCount} out of ${totalReviewed} questions. Keep practicing!`,
          "Good Progress!"
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

  // Welcome message
  useEffect(() => {
    if (!quiz.isLoading && quiz.questions.length > 0) {
      mascot.show(
        "thinking",
        "Let's review the questions you got wrong before. Learning from mistakes is the best way to improve!",
        "Review Time!"
      );
    }
  }, [quiz.isLoading, quiz.questions.length]);

  if (quiz.isLoading) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner text="Loading your mistakes..." />
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

  // Empty state - no mistakes to review
  if (!quiz.isLoading && quiz.questions.length === 0) {
    return (
      <MobileLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Mistakes to Review!
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm">
            Great job! You haven't made any mistakes yet, or you've already mastered all the questions you got wrong.
          </p>
          <div className="space-y-3 w-full max-w-xs">
            <Link href="/quiz/practice">
              <Button className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Take a Practice Quiz
              </Button>
            </Link>
            <Link href="/quiz">
              <Button variant="outline" className="w-full">
                Back to Quiz Lobby
              </Button>
            </Link>
          </div>
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
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              <RotateCcw className="w-3 h-3 mr-1" />
              Review
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

        {/* Review Info */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-orange-700">
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm">
                <strong>Review Mode:</strong> These are questions you got wrong before. 
                Get them right to master them!
              </span>
            </div>
          </CardContent>
        </Card>

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

        {/* Mastered Count */}
        {quiz.answers.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">
                {quiz.answers.filter((a) => a.isCorrect).length}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{quiz.answers.length}</span>{" "}
              questions mastered in this session
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
