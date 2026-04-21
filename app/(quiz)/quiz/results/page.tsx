"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { Dash } from "@/components/mascot";
import { useMascot } from "@/hooks/use-mascot";
import {
  Trophy,
  Target,
  Clock,
  Zap,
  RotateCcw,
  Share2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Flame,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type QuizResults = {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalTimeTaken: number;
  averageTimePerQuestion: number;
  maxStreak: number;
  xpEarned: {
    baseXP: number;
    speedBonus: number;
    streakBonus: number;
    perfectBonus: number;
    firstAttemptBonus: number;
    difficultyBonus: number;
    totalXP: number;
    breakdown: { label: string; description: string; value: number }[];
  };
  weakCategories: { categoryId: string; categoryName: string; wrongCount: number }[];
};

function loadResults(): QuizResults | null {
  try {
    const stored = sessionStorage.getItem("quizResults");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as QuizResults;
    sessionStorage.removeItem("quizResults");
    return parsed;
  } catch {
    return null;
  }
}

export default function QuizResultsPage() {
  const router = useRouter();
  const mascot = useMascot({ autoHideDelay: 5000 });
  const [showXPBreakdown, setShowXPBreakdown] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);

  // Lazy initializer reads sessionStorage once at mount — no setState-in-effect needed.
  const [results] = useState<QuizResults | null>(loadResults);

  const isPassing = (results?.accuracy ?? 0) >= 80;

  // Redirect when no results found (runs after render so router is stable).
  useEffect(() => {
    if (!results) {
      toast("Your results expired — let's run it back. 🔁");
      router.push("/quiz");
    }
  }, [results, router]);

  useEffect(() => {
    if (!results) return;

    // Animate XP counter
    const duration = 2000;
    const steps = 60;
    const increment = results.xpEarned.totalXP / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= results.xpEarned.totalXP) {
        setAnimatedXP(results.xpEarned.totalXP);
        clearInterval(timer);
      } else {
        setAnimatedXP(Math.floor(current));
      }
    }, duration / steps);

    // Show mascot message
    if (isPassing) {
      mascot.show(
        "excited",
        `Congratulations! You passed with ${results.accuracy}%! 🎉`,
        "Great Job!"
      );
    } else {
      mascot.show(
        "encouraging",
        `You scored ${results.accuracy}% — keep grinding and you'll nail it! 💪`,
        "So Close!"
      );
    }

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (!results) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
          <Dash
            emotion={mascot.emotion}
            size="sm"
            animate={mascot.isAnimating}
            showSpeechBubble={mascot.isVisible}
            speechTitle={mascot.title}
            speechText={mascot.message}
            speechPosition="bottom"
            onSpeechBubbleClick={() => mascot.hide()}
          />
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className={`border-0 shadow-lg ${
              isPassing
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                : "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
            }`}
          >
            <CardContent className="p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center"
              >
                {isPassing ? (
                  <Trophy className="w-10 h-10" />
                ) : (
                  <Target className="w-10 h-10" />
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-1">
                {isPassing ? "Great Job!" : "Keep Practicing!"}
              </h2>
              <p className="text-white/80 mb-4">
                {isPassing
                  ? "You passed the quiz!"
                  : "You're getting closer to passing!"}
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-5xl font-bold">{results.accuracy}</span>
                <span className="text-2xl">%</span>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  {results.correctAnswers} correct
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <XCircle className="w-4 h-4" />
                  {results.wrongAnswers} wrong
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Earned */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                XP Earned
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    +{animatedXP}
                  </p>
                  <p className="text-sm text-gray-500">Total XP earned</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowXPBreakdown(!showXPBreakdown)}
                >
                  {showXPBreakdown ? "Hide" : "Show"} Breakdown
                </Button>
              </div>

              {showXPBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 border-t pt-4"
                >
                  {results.xpEarned.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <span className="font-medium text-gray-700">
                          {item.label}
                        </span>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <span className="font-semibold text-blue-600">
                        +{item.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">
                {formatTime(results.totalTimeTaken)}
              </p>
              <p className="text-xs text-gray-500">Total Time</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Zap className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">
                {Math.round(results.averageTimePerQuestion)}s
              </p>
              <p className="text-xs text-gray-500">Avg Time</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 text-center">
              <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">
                {results.maxStreak}
              </p>
              <p className="text-xs text-gray-500">Best Streak</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weak Areas */}
        {results.weakCategories.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Areas to Improve</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {results.weakCategories.map((category) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {category.categoryName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {category.wrongCount} questions missed
                      </p>
                    </div>
                    <Link href={`/quiz/category/${category.categoryId}`}>
                      <Button size="sm" variant="outline">
                        Practice
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            className="w-full h-14 text-lg"
            onClick={() => router.push("/quiz/practice")}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: "My Quiz Results",
                    text: `I scored ${results.accuracy}% on my driving test practice quiz!`,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Link href="/quiz" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                More Quizzes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
