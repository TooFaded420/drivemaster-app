"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ONBOARDING_CHECKLIST, OnboardingStepId } from "@/lib/constants/onboarding";
import { 
  User, 
  IdCard, 
  Target, 
  ClipboardCheck, 
  BookOpen, 
  Play,
  Check,
  Clock
} from "lucide-react";

interface OnboardingChecklistProps {
  completedSteps: number[];
  currentStep: number;
  firstQuizCompleted?: boolean;
  className?: string;
}

const iconMap = {
  user: User,
  "id-card": IdCard,
  target: Target,
  "clipboard-check": ClipboardCheck,
  "book-open": BookOpen,
  play: Play,
};

export function OnboardingChecklist({
  completedSteps,
  currentStep,
  firstQuizCompleted = false,
  className,
}: OnboardingChecklistProps) {
  // Map step indices to step IDs
  const stepIdToIndex: Record<OnboardingStepId, number> = {
    welcome: 0,
    profile: 1,
    goals: 2,
    assessment: 3,
    tutorial: 4,
    complete: 5,
  };

  const getItemStatus = (item: typeof ONBOARDING_CHECKLIST[number]) => {
    if (item.isPostOnboarding) {
      return firstQuizCompleted ? "completed" : "pending";
    }
    
    if (!item.step) return "pending";
    
    const stepIndex = stepIdToIndex[item.step];
    
    if (completedSteps.includes(stepIndex)) {
      return "completed";
    }
    
    if (stepIndex === currentStep) {
      return "current";
    }
    
    return "pending";
  };

  const completedCount = ONBOARDING_CHECKLIST.filter(item => {
    if (item.isPostOnboarding) return firstQuizCompleted;
    if (!item.step) return false;
    return completedSteps.includes(stepIdToIndex[item.step]);
  }).length;

  const progress = Math.round((completedCount / ONBOARDING_CHECKLIST.length) * 100);

  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Getting Started</h3>
        <span className="text-sm text-gray-500">{completedCount}/{ONBOARDING_CHECKLIST.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {ONBOARDING_CHECKLIST.map((item, index) => {
          const status = getItemStatus(item);
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                status === "completed" && "bg-green-50",
                status === "current" && "bg-blue-50",
                status === "pending" && "bg-gray-50"
              )}
            >
              {/* Status icon */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  status === "completed" && "bg-green-500 text-white",
                  status === "current" && "bg-blue-500 text-white",
                  status === "pending" && "bg-gray-200 text-gray-400"
                )}
              >
                {status === "completed" ? (
                  <Check className="w-4 h-4" />
                ) : status === "current" ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-sm font-medium",
                  status === "completed" && "text-green-700 line-through",
                  status === "current" && "text-blue-700",
                  status === "pending" && "text-gray-500"
                )}
              >
                {item.label}
              </span>

              {/* Post-onboarding indicator */}
              {item.isPostOnboarding && status === "pending" && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  Next
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion message */}
      {completedCount === ONBOARDING_CHECKLIST.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center"
        >
          <p className="text-sm font-medium">🎉 All set! You\'re ready to ace your test!</p>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for dashboard
export function OnboardingChecklistCompact({
  completedSteps,
  currentStep,
  firstQuizCompleted = false,
  className,
}: OnboardingChecklistProps) {
  const stepIdToIndex: Record<OnboardingStepId, number> = {
    welcome: 0,
    profile: 1,
    goals: 2,
    assessment: 3,
    tutorial: 4,
    complete: 5,
  };

  const completedCount = ONBOARDING_CHECKLIST.filter(item => {
    if (item.isPostOnboarding) return firstQuizCompleted;
    if (!item.step) return false;
    return completedSteps.includes(stepIdToIndex[item.step]);
  }).length;

  const progress = Math.round((completedCount / ONBOARDING_CHECKLIST.length) * 100);

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 p-4", className)}>
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <motion.path
              className="text-blue-500"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${progress}, 100` }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">{progress}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {completedCount === ONBOARDING_CHECKLIST.length 
              ? "All tasks completed!" 
              : `${completedCount} of ${ONBOARDING_CHECKLIST.length} tasks done`}
          </p>
          <p className="text-xs text-gray-500">
            {completedCount === ONBOARDING_CHECKLIST.length 
              ? "You\'re ready to start practicing" 
              : "Complete your setup to get started"}
          </p>
        </div>
      </div>
    </div>
  );
}
