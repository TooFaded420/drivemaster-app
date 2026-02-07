"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dash } from "@/components/mascot";
import { Car, Trophy, Target, Zap } from "lucide-react";
import { OnboardingData } from "@/types/database";

interface StepWelcomeProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

const features = [
  {
    icon: Target,
    title: "Personalized Study",
    description: "Study plans tailored to your goals and schedule",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics",
  },
  {
    icon: Zap,
    title: "Quick Practice",
    description: "Bite-sized quizzes perfect for busy schedules",
  },
  {
    icon: Car,
    title: "Illinois Focused",
    description: "Questions based on Illinois DMV materials",
  },
];

export function StepWelcome({ onComplete }: StepWelcomeProps) {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <Dash
            emotion="excited"
            size="xl"
            animate={true}
            showSpeechBubble={true}
            speechTitle="Welcome to DriveMaster! 🎉"
            speechText="I'm Dash, your personal driving test coach! Together, we'll get you ready to ace your Illinois driving test. Ready to start?"
            speechPosition="bottom"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Let's Get You Road-Ready!
          </h1>
          <p className="text-lg text-gray-600 mt-2 max-w-md mx-auto">
            Join thousands of learners who've passed their driving test with DriveMaster
          </p>
        </motion.div>
      </div>

      {/* Features grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Button
          size="lg"
          onClick={() => onComplete()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Let's Get Started!
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Takes just 2 minutes to complete your setup
        </p>
      </motion.div>
    </div>
  );
}
