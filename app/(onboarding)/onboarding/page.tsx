"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fireConversion } from "@/lib/analytics";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { ONBOARDING_STEPS } from "@/lib/constants/onboarding";
import { ChevronLeft, SkipForward, Sparkles } from "lucide-react";

// Step components
import { StepWelcome } from "./step-welcome";
import { StepProfile } from "./step-profile";
import { StepGoals } from "./step-goals";
import { StepAssessment } from "./step-assessment";
import { StepTutorial } from "./step-tutorial";
import { StepComplete } from "./step-complete";

const stepComponents = [
  StepWelcome,
  StepProfile,
  StepGoals,
  StepAssessment,
  StepTutorial,
  StepComplete,
];

function OnboardingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboarding = useOnboarding();
  const shouldReduceMotion = useReducedMotion();

  // Fire the signup conversion once when arriving from auth/callback with
  // ?new_signup=true (OAuth + email signup both redirect here). Strip the
  // param via router.replace so a refresh doesn't double-fire.
  const conversionFiredRef = useRef(false);
  useEffect(() => {
    if (conversionFiredRef.current) return;
    if (searchParams.get("new_signup") === "true") {
      conversionFiredRef.current = true;
      fireConversion("signup_completed");
      router.replace("/onboarding");
    }
  }, [searchParams, router]);

  // Redirect to dashboard when complete
  useEffect(() => {
    if (onboarding.isCompleted) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onboarding.isCompleted, router]);

  if (onboarding.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const CurrentStepComponent = stepComponents[onboarding.currentStep];
  const isLastStep = onboarding.currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = onboarding.currentStep === 0;
  const currentStepId = ONBOARDING_STEPS[onboarding.currentStep]?.id;
  const canSkipStep = currentStepId === "assessment" || currentStepId === "tutorial";

  return (
    <div className="force-light-theme min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900">
      {/* Mobile: Top progress bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {onboarding.currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-slate-500">{onboarding.progressPercentage}%</span>
          </div>
          <Progress value={onboarding.progressPercentage} className="h-1.5" />
        </div>
      </div>

      {/* Left side - Progress & Checklist (Desktop) */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 bg-white border-r border-slate-100 flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">Getting Started</h1>
              <p className="text-sm text-slate-500">Complete your setup</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Overall Progress</span>
              <span className="font-medium text-slate-900">{onboarding.progressPercentage}%</span>
            </div>
            <Progress value={onboarding.progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-auto p-6">
          <OnboardingChecklist
            completedSteps={onboarding.completedSteps}
            currentStep={onboarding.currentStep}
          />
        </div>

        {/* XP Counter */}
        <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-blue-50 to-orange-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">XP Earned</span>
            <span className="font-bold text-blue-600">+{onboarding.xpEarned} XP</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete steps to earn more XP!
          </p>
        </div>
      </div>

      {/* Right side - Step content */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0">
        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Step {onboarding.currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <h2 className="font-semibold text-slate-900">
              {ONBOARDING_STEPS[onboarding.currentStep]?.title}
            </h2>
          </div>
          
          {canSkipStep && !isLastStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onboarding.skipStep}
              className="text-slate-500 hover:text-slate-700"
            >
              Skip for now
              <SkipForward className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          {/* Step content */}
          <div className="flex-1 overflow-auto p-4 pb-28 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={onboarding.currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                >
                  {CurrentStepComponent && (
                    <CurrentStepComponent
                      data={onboarding.data}
                      updateData={onboarding.updateOnboardingData}
                      onComplete={onboarding.completeStep}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile: Back/skip controls. Each step owns its Continue action. */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 safe-area-inset-bottom">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onboarding.goToPreviousStep}
              disabled={isFirstStep}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {canSkipStep && !isLastStep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onboarding.skipStep}
                className="text-slate-500"
              >
                Skip for now
              </Button>
            ) : null}

            <div className="flex-1" />
          </div>
        </div>

        {/* Desktop: Bottom navigation */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
          <Button
            variant="outline"
            onClick={onboarding.goToPreviousStep}
            disabled={isFirstStep}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to onboarding step ${index + 1}: ${ONBOARDING_STEPS[index].title}`}
                onClick={() => {
                  if (index <= Math.max(...onboarding.completedSteps, onboarding.currentStep)) {
                    onboarding.goToStep(index);
                  }
                }}
                disabled={index > Math.max(...onboarding.completedSteps, onboarding.currentStep)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full"
              >
                <span
                  className={`
                    h-2.5 rounded-full transition-all duration-300
                    ${index === onboarding.currentStep
                      ? "w-6 bg-blue-500"
                      : onboarding.completedSteps.includes(index)
                      ? "w-2.5 bg-blue-300"
                      : "w-2.5 bg-slate-200"
                    }
                  `}
                />
              </button>
            ))}
          </div>

          <div className="w-[98px]" />
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingPageInner />
    </Suspense>
  );
}
