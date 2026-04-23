"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MobileLayout } from "@/components/mobile-layout";
import { Dash } from "@/components/mascot";
import { useMascot } from "@/hooks/use-mascot";
import {
  Play,
  Clock,
  Target,
  Zap,
  RotateCcw,
  ChevronRight,
  Trophy,
  Flame,
  Brain,
  Timer,
  Infinity,
  AlertCircle,
} from "lucide-react";
import { illinoisDMVQuestions } from "@/lib/data/questions/illinois-dmv-questions";

const quizModes = [
  {
    id: "practice",
    name: "Quick Practice",
    description: "10 random questions to sharpen your skills",
    icon: Play,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/quiz/practice",
    badge: "10 Questions",
    estimatedTime: "5 min",
  },
  {
    id: "timed",
    name: "Timed Test",
    description: "Simulate real test conditions with a timer",
    icon: Timer,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    href: "/quiz/timed",
    badge: "35 Questions",
    estimatedTime: "45 min",
  },
  {
    id: "marathon",
    name: "Marathon Mode",
    description: "Practice with all available questions",
    icon: Infinity,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/quiz/marathon",
    badge: "All Questions",
    estimatedTime: "Varies",
  },
  {
    id: "mistakes",
    name: "Review Mistakes",
    description: "Focus on questions you got wrong before",
    icon: RotateCcw,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/quiz/mistakes",
    badge: "Personalized",
    estimatedTime: "Varies",
  },
];

// H10 — category IDs are the string slugs used throughout lib/data/questions
// and the category/[id]/page.tsx route param. Numeric IDs would mismatch both.
const categoryMeta = [
  {
    id: "traffic-signs",
    name: "Traffic Signs",
    description: "Road signs, signals, and pavement markings",
    icon: Target,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "traffic-laws",
    name: "Rules of the Road",
    description: "Right-of-way, speed limits, and traffic laws",
    icon: Zap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "safe-driving",
    name: "Safe Driving",
    description: "Defensive driving and hazard awareness",
    icon: Brain,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "alcohol-drugs",
    name: "Alcohol & Drugs",
    description: "DUI laws and impaired driving",
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const categories = categoryMeta.map((cat) => ({
  ...cat,
  questionCount: illinoisDMVQuestions.filter((q) => q.category_id === cat.id).length,
}));

export default function QuizLobbyPage() {
  const mascot = useMascot({ autoHideDelay: 6000 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Show welcome message
    mascot.show(
      "happy",
      "Ready to practice? Choose a quiz mode or focus on a specific category!",
      "Let's Study!"
    );
  }, []);

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Practice Quiz</h1>
            <p className="text-muted-foreground">Choose how you want to practice</p>
          </div>
          {/* speechPosition="left" → bubble extends leftward into open header space,
              never downward over the stats cards below */}
          <Dash
            emotion={mascot.emotion}
            size="sm"
            animate={mascot.isAnimating}
            showSpeechBubble={mascot.isVisible}
            speechTitle={mascot.title}
            speechText={mascot.message}
            speechPosition="left"
            onSpeechBubbleClick={() => mascot.hide()}
          />
        </div>

        {/* Quick Stats — gradient cards with dark-mode safe text */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
            <CardContent className="p-3 text-center">
              <Trophy className="w-5 h-5 text-blue-100 mx-auto mb-1" />
              <p className="text-lg font-bold">12</p>
              <p className="text-xs text-blue-100">Quizzes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
            <CardContent className="p-3 text-center">
              <Flame className="w-5 h-5 text-orange-100 mx-auto mb-1" />
              <p className="text-lg font-bold">5</p>
              <p className="text-xs text-orange-100">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
            <CardContent className="p-3 text-center">
              <Target className="w-5 h-5 text-emerald-100 mx-auto mb-1" />
              <p className="text-lg font-bold">78%</p>
              <p className="text-xs text-emerald-100">Accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Modes */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quiz Modes</h2>
          <div className="grid gap-3">
            {quizModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.1 }}
              >
                <Link href={mode.href}>
                  {/* Card hover: translate-y-[-2px] for lift, ring on focus */}
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${mode.color} ${mode.hoverColor} flex items-center justify-center transition-colors flex-shrink-0`}
                        >
                          <mode.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {mode.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {mode.badge}
                            </Badge>
                          </div>
                          {/* Description: muted-foreground passes WCAG AA on card bg */}
                          <p className="text-sm text-muted-foreground mb-2">
                            {mode.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {mode.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Practice by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 + index * 0.1 }}
              >
                <Link href={`/quiz/category/${category.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full">
                    <CardContent className="p-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mb-3`}
                      >
                        <category.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-xs">
                        <span className="text-muted-foreground">
                          {category.questionCount} questions
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Goal Progress */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Daily Goal</h3>
                <p className="text-sm text-white/80">Answer 20 questions today</p>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                15/20
              </Badge>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-white/70 mt-2">
              5 more questions to reach your daily goal!
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}
