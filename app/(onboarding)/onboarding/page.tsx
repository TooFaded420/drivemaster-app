"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/hooks/use-onboarding";
import { Dash } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingChecklist } from "@/components/onboarding/checklist";
import { ONBOARDING_STEPS, ONBOARDING_MASCOT_MESSAGES } from "@/lib/constants/onboarding";
import { ChevronRight, ChevronLeft, SkipForward, Sparkles } from "lucide-react";

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

interface MascotMessage {
  title: string;
  message: string;
  emotion: "happy" | "excited" | "thinking" | "encouraging";
}

export default function OnboardingPage() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const [showChecklist, setShowChecklist] = useState(false);
  const [mascotMessage, setMascotMessage] = useState<MascotMessage>({
    title: "Welcome! 🎉",
    message: "Hi, I'm Dash! I'll be your guide to mastering your driving test. Let's get started!",
    emotion: "excited",
  });

  // Update mascot message when step changes
  useEffect(() => {
    const stepId = ONBOARDING_STEPS[onboarding.currentStep]?.id;
    if (stepId && ONBOARDING_MASCOT_MESSAGES[stepId as keyof typeof ONBOARDING_MASCOT_MESSAGES]) {
      const msg = ONBOARDING_MASCOT_MESSAGES[stepId as keyof typeof ONBOARDING_MASCOT_MESSAGES];
      setMascotMessage({
        title: msg.title,
        message: msg.message,
        emotion: msg.emotion,
      });
    }
  }, [onboarding.currentStep]);

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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile: Top progress bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {onboarding.currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-sm text-gray-500">{onboarding.progressPercentage}%</span>
          </div>
          <Progress value={onboarding.progressPercentage} className="h-1.5" />
        </div>
      </div>

      {/* Left side - Progress & Checklist (Desktop) */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 bg-white border-r border-gray-100 flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Getting Started</h1>
              <p className="text-sm text-gray-500">Complete your setup</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-gray-900">{onboarding.progressPercentage}%</span>
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
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">XP Earned</span>
            <span className="font-bold text-blue-600">+{onboarding.xpEarned} XP</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete steps to earn more XP!
          </p>
        </div>
      </div>

      {/* Right side - Step content */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0">
        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Step {onboarding.currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
            <h2 className="font-semibold text-gray-900">
              {ONBOARDING_STEPS[onboarding.currentStep]?.title}
            </h2>
          </div>
          
          {!isLastStep && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onboarding.skipStep}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
              <SkipForward className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Step content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={onboarding.currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
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

          {/* Mascot sidebar (Desktop) */}
          <div className="hidden xl:flex w-80 flex-col items-center justify-center p-8 border-l border-gray-100 bg-gradient-to-b from-white to-blue-50/30">
            <motion.div
              key={mascotMessage.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Dash
                emotion={mascotMessage.emotion}
                size="lg"
                animate={true}
                showSpeechBubble={true}
                speechTitle={mascotMessage.title}
                speechText={mascotMessage.message}
                speechPosition="left"
                className="mb-4"
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile: Bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-inset-bottom">
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

            {!isLastStep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onboarding.skipStep}
                className="text-gray-500"
              >
                Skip
              </Button>
            ) : null}

            <Button
              size="sm"
              onClick={() => {
                if (isLastStep) {
                  onboarding.completeStep();
                } else {
                  onboarding.goToNextStep();
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Desktop: Bottom navigation */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
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
                onClick={() => {
                  if (index <= Math.max(...onboarding.completedSteps, onboarding.currentStep)) {
                    onboarding.goToStep(index);
                  }
                }}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all duration-300
                  ${index === onboarding.currentStep
                    ? "bg-blue-500 w-6"
                    : onboarding.completedSteps.includes(index)
                    ? "bg-blue-300"
                    : "bg-gray-200"
                  }
                `}
              />
            ))}
          </div>

          <Button
            onClick={() => {
              if (isLastStep) {
                onboarding.completeStep();
              } else {
                onboarding.goToNextStep();
              }
            }}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
