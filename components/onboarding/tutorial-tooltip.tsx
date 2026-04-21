"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TUTORIAL_STEPS } from "@/lib/constants/onboarding";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TutorialTooltipProps {
  isActive: boolean;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  targetSelector?: string;
}

interface TooltipPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export function TutorialTooltip({
  isActive,
  currentStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  targetSelector,
}: TutorialTooltipProps) {
  const [position, setPosition] = useState<TooltipPosition>({});
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = TUTORIAL_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  // Calculate tooltip position based on target element
  useEffect(() => {
    if (!isActive || !step) return;

    const calculatePosition = () => {
      let target: Element | null = null;

      if (targetSelector) {
        target = document.querySelector(targetSelector);
      } else if (step.target) {
        target = document.querySelector(`[data-tutorial="${step.target}"]`);
      }

      if (!target) {
        // Center on screen if no target
        setPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 150,
        });
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetRect(rect);

      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const offset = 16;

      let newPosition: TooltipPosition = {};

      switch (step.position) {
        case "top":
          newPosition = {
            bottom: window.innerHeight - rect.top + offset,
            left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
          };
          break;
        case "bottom":
          newPosition = {
            top: rect.bottom + offset,
            left: Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16)),
          };
          break;
        case "left":
          newPosition = {
            top: Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - 16)),
            right: window.innerWidth - rect.left + offset,
          };
          break;
        case "right":
          newPosition = {
            top: Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipHeight / 2, window.innerHeight - tooltipHeight - 16)),
            left: rect.right + offset,
          };
          break;
        default:
          newPosition = {
            top: rect.bottom + offset,
            left: Math.max(16, Math.min(rect.left, window.innerWidth - tooltipWidth - 16)),
          };
      }

      setPosition(newPosition);
    };

    calculatePosition();

    // Recalculate on resize
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition, true);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [isActive, step, targetSelector]);

  // Scroll target into view
  useEffect(() => {
    if (!isActive || !step) return;

    let target: Element | null = null;
    if (targetSelector) {
      target = document.querySelector(targetSelector);
    } else if (step.target) {
      target = document.querySelector(`[data-tutorial="${step.target}"]`);
    }

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, step, targetSelector, currentStep]);

  if (!isActive || !step) return null;

  return (
    <AnimatePresence>
      {/* Backdrop with spotlight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{
          background: targetRect
            ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 1.5}px, rgba(0, 0, 0, 0.7) ${Math.max(targetRect.width, targetRect.height) / 1.5 + 50}px)`
            : "rgba(0, 0, 0, 0.7)",
        }}
        onClick={onSkip}
      />

      {/* Tooltip */}
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "fixed z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        )}
        style={position}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-orange-500 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/80">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
            <button
              onClick={onSkip}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-white mt-1">{step.title}</h3>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
        </div>

        {/* Footer with navigation */}
        <div className="p-4 pt-0 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index < currentStep) {
                    // Allow going back
                    for (let i = currentStep; i > index; i--) {
                      onPrevious();
                    }
                  }
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentStep
                    ? "bg-blue-500"
                    : index < currentStep
                    ? "bg-blue-300"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="h-8 px-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            
            {isLastStep ? (
              <Button
                size="sm"
                onClick={onComplete}
                className="h-8 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
              >
                Finish
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onNext}
                className="h-8 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage tutorial state
export function useTutorial() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const start = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const next = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      stop();
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < TUTORIAL_STEPS.length) {
      setCurrentStep(step);
    }
  };

  return {
    isActive,
    currentStep,
    start,
    stop,
    next,
    previous,
    goToStep,
    totalSteps: TUTORIAL_STEPS.length,
    currentStepData: TUTORIAL_STEPS[currentStep],
  };
}

// Component to mark elements for tutorial
export function TutorialTarget({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <div data-tutorial={id} className={className}>
      {children}
    </div>
  );
}
