"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dash } from "@/components/mascot";
import { useMascot } from "@/hooks/use-mascot";
import { OnboardingChecklistCompact } from "@/components/onboarding/checklist";
import { useOnboarding } from "@/hooks/use-onboarding";
import {
  Flame,
  Target,
  Trophy,
  BookOpen,
  ArrowRight,
  Star,
  Zap,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface DashboardStats {
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  accuracy: number;
  hasStats: boolean;
}

export interface DashboardCategoryProgress {
  id: number;
  name: string;
  completed: number;
  total: number;
  progress: number;
}

export interface DashboardLeaderboardEntry {
  userId: string;
  rank: number;
  name: string;
  weeklyXp: number;
  isUser: boolean;
}

interface DashboardViewProps {
  stats: DashboardStats;
  categories: DashboardCategoryProgress[];
  leaderboard: DashboardLeaderboardEntry[];
}

// TODO: daily-quest backend schema not yet built — leaving hardcoded placeholder.
const placeholderDailyQuests = [
  { id: 1, title: "Answer 10 questions", current: 0, target: 10, xp: 20 },
  { id: 2, title: "Earn 50 XP", current: 0, target: 50, xp: 30 },
  { id: 3, title: "Maintain streak", current: 0, target: 1, xp: 50, completed: false },
];

function levelProgressPercent(totalXp: number, level: number): number {
  // Simple linear: 500 XP per level. Keeps the UI honest without fabricating.
  const xpPerLevel = 500;
  const xpIntoLevel = Math.max(0, totalXp - (level - 1) * xpPerLevel);
  return Math.min(100, Math.round((xpIntoLevel / xpPerLevel) * 100));
}

export function DashboardView({ stats, categories, leaderboard }: DashboardViewProps) {
  const mascot = useMascot({ autoHideDelay: 8000 });
  const onboarding = useOnboarding();
  const [showMascotWidget, setShowMascotWidget] = useState(true);
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      mascot.welcome();
    }, 1000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const levelProgress = levelProgressPercent(stats.totalXP, stats.currentLevel);

  return (
    <div className="space-y-6">
      {/* Welcome Header with Dash */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Ready to continue your driving journey?</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
          <Flame className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-orange-600">{stats.currentStreak}</span>
        </div>
      </div>

      {/* Onboarding Checklist */}
      {showOnboardingChecklist && (
        <div className="relative">
          <OnboardingChecklistCompact
            completedSteps={onboarding.completedSteps}
            currentStep={onboarding.currentStep}
          />
          <button
            onClick={() => setShowOnboardingChecklist(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss onboarding checklist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Zero-state for brand-new users with no stats row yet */}
      {!stats.hasStats ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Let&apos;s get started</h2>
              <p className="text-gray-600 mt-1">
                Take your first quiz to start tracking XP, streaks, and progress.
              </p>
            </div>
            <Link href="/quiz">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Take your first quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm text-blue-100">Total XP</span>
                </div>
                <div className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Level {stats.currentLevel}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm text-orange-100">Accuracy</span>
                </div>
                <div className="text-2xl font-bold">{stats.accuracy}%</div>
                <div className="text-sm text-orange-100">
                  {stats.questionsAnswered} questions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Level Progress</CardTitle>
                <span className="text-sm text-gray-500">
                  {levelProgress}% to Level {stats.currentLevel + 1}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={levelProgress} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Level {stats.currentLevel}</span>
                <span>Level {stats.currentLevel + 1}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/quiz">
          <Button className="w-full h-auto py-6 bg-blue-600 hover:bg-blue-700" size="lg">
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6" />
              <span>Quick Practice</span>
            </div>
          </Button>
        </Link>
        <Link href="/quiz/timed">
          <Button className="w-full h-auto py-6" variant="outline" size="lg">
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Timed Test</span>
            </div>
          </Button>
        </Link>
      </div>

      {/* Categories Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Category Progress</CardTitle>
            <Link href="/quiz">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">
              No category progress yet. Answer some questions to see your breakdown.
            </p>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">
                    {category.completed}/{category.total}
                  </span>
                </div>
                <Progress value={category.progress} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Daily Quests — placeholder until backend schema lands */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daily Quests</CardTitle>
              <CardDescription>Complete quests to earn bonus XP</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold">+100 XP</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {placeholderDailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                quest.completed ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    quest.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {quest.completed ? (
                    <Star className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{quest.id}</span>
                  )}
                </div>
                <span className={quest.completed ? "text-green-700" : "text-gray-700"}>
                  {quest.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!quest.completed && (
                  <span className="text-sm text-gray-500">
                    {quest.current}/{quest.target}
                  </span>
                )}
                <span className="text-sm font-medium text-yellow-600">+{quest.xp} XP</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-lg">Weekly Leaderboard</CardTitle>
            </div>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-500">
              No leaderboard entries yet this week.
            </p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isUser ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        entry.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : entry.rank === 2
                          ? "bg-gray-200 text-gray-700"
                          : entry.rank === 3
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <span
                      className={
                        entry.isUser ? "font-medium text-blue-700" : "text-gray-700"
                      }
                    >
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {entry.weeklyXp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Dash Study Buddy */}
      {showMascotWidget && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-xs">
            <div className="flex items-start gap-3">
              <Dash emotion="happy" size="sm" animate={true} className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  Need help? I&apos;m here to guide you through your practice!
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() =>
                      mascot.think("Pick a category and knock out a few questions.")
                    }
                  >
                    Get Tips
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs px-2"
                    onClick={() => setShowMascotWidget(false)}
                    aria-label="Dismiss study buddy"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
