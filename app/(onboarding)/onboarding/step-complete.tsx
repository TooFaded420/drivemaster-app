"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dash } from "@/components/mascot";
import { OnboardingData } from "@/types/database";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface StepCompleteProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

export function StepComplete({ data, onComplete }: StepCompleteProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    
    // Complete the step automatically
    const timer = setTimeout(() => {
      onComplete();
    }, 500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const xpEarned = 150; // Total onboarding XP
  const assessmentScore = data.assessmentScore || 0;

  return (
    <div className="space-y-8 text-center">
      {/* Confetti effect placeholder */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#3B82F6', '#F97316', '#10B981', '#F59E0B', '#EF4444'][i % 5],
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{
                y: window.innerHeight + 40,
                x: (Math.random() - 0.5) * 200,
                rotate: Math.random() * 360,
              }}
              transition={shouldReduceMotion ? { duration: 0 } : {
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Mascot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 200 }}
        className="flex justify-center"
      >
        <Dash
          emotion="excited"
          size="xl"
          animate={true}
          showSpeechBubble={true}
          speechTitle="You Did It! 🎊"
          speechText="Congratulations! You've completed onboarding and earned your first achievement. Let's start your driving journey!"
          speechPosition="bottom"
        />
      </motion.div>

      {/* Achievement unlocked */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-white font-medium">
          <Trophy className="w-5 h-5" />
          Achievement Unlocked: Getting Started
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
          You're All Set!
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome to DriveMaster, Driver!
        </p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">+{xpEarned}</p>
            <p className="text-xs text-gray-500">XP Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500">Achievement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{assessmentScore}%</p>
            <p className="text-xs text-gray-500">Assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Day 1</p>
            <p className="text-xs text-gray-500">Streak Started</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* What's next */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 max-w-lg mx-auto"
      >
        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-left">
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs">1</span>
            </div>
            Take your first practice quiz to unlock more features
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs">2</span>
            </div>
            Complete daily quests to earn XP and maintain your streak
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs">3</span>
            </div>
            Study by category to master each topic area
          </li>
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.6 }}
      >
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <p className="text-sm text-gray-500 mt-3">
          You'll be redirected automatically in a few seconds...
        </p>
      </motion.div>
    </div>
  );
}
