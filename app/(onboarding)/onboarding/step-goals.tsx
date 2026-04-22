"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dash } from "@/components/mascot";
import { 
  STUDY_TIME_OPTIONS, 
  TARGET_SCORE_OPTIONS 
} from "@/lib/constants/onboarding";
import { OnboardingData } from "@/types/database";
import { Clock, Target, Calendar } from "lucide-react";

interface StepGoalsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

export function StepGoals({ data, updateData, onComplete }: StepGoalsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    testDate: data.testDate || "",
    dailyStudyTime: data.dailyGoal || 20,
    targetScore: 85,
  });

  const handleSubmit = () => {
    updateData({
      testDate: formData.testDate || undefined,
      dailyGoal: formData.dailyStudyTime,
    });

    onComplete({
      testDate: formData.testDate || undefined,
      dailyGoal: formData.dailyStudyTime,
    });
  };

  // Calculate recommended study plan
  const getStudyPlan = () => {
    const weeksUntilTest = formData.testDate 
      ? Math.ceil((new Date(formData.testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7))
      : null;
    
    if (weeksUntilTest && weeksUntilTest > 0) {
      const totalMinutes = weeksUntilTest * 7 * formData.dailyStudyTime;
      const totalHours = Math.round(totalMinutes / 60);
      return `With ${formData.dailyStudyTime} min/day, you'll study ${totalHours} hours before your test!`;
    }
    return `Studying ${formData.dailyStudyTime} minutes daily will help you reach your goal!`;
  };

  return (
    <div className="space-y-6">
      {/* Header with mascot */}
      <div className="flex items-center gap-4 mb-6">
        <Dash
          emotion="thinking"
          size="md"
          animate={true}
          showSpeechBubble={true}
          speechTitle="Set Your Goals!"
          speechText="Setting clear goals helps you stay motivated and track your progress. Let's plan your study schedule!"
          speechPosition="right"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : undefined}
        className="space-y-6"
      >
        {/* Test date */}
        <div className="space-y-2">
          <Label htmlFor="testDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            When is your test? (Optional)
          </Label>
          <input
            id="testDate"
            type="date"
            value={formData.testDate}
            onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-muted-foreground">
            Don't have a date yet? No problem! You can set one later.
          </p>
        </div>

        {/* Daily study time */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            How much time can you study daily?
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {STUDY_TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, dailyStudyTime: option.value })}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all
                  ${formData.dailyStudyTime === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-medium text-foreground">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Target score */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            What's your target score?
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TARGET_SCORE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, targetScore: option.value })}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all
                  ${formData.targetScore === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-medium text-foreground">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Study plan summary */}
        <motion.div
          key={`${formData.testDate}-${formData.dailyStudyTime}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-blue-100"
        >
          <p className="text-sm text-blue-800 font-medium">📚 Your Study Plan</p>
          <p className="text-sm text-blue-600 mt-1">{getStudyPlan()}</p>
        </motion.div>

        {/* Submit button */}
        <Button
          size="lg"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
