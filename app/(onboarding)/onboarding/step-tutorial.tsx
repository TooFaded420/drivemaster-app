"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dash } from "@/components/mascot";
import { OnboardingData } from "@/types/database";
import { 
  LayoutDashboard, 
  Play, 
  BookOpen, 
  Target, 
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Check
} from "lucide-react";

interface StepTutorialProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

const tutorialSlides = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Your Dashboard",
    description: "Track your progress, view your streak, and see your daily goals at a glance. The dashboard is your home base for everything.",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "quizzes",
    icon: Play,
    title: "Take Quizzes",
    description: "Practice with quick quizzes, full tests, or focus on specific categories. Each quiz helps you earn XP and improve your score.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "categories",
    icon: BookOpen,
    title: "Study by Category",
    description: "Focus on specific topics like Traffic Signs, Rules of the Road, or Safe Driving. Master each area one at a time.",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "goals",
    icon: Target,
    title: "Daily Goals",
    description: "Complete daily quests to earn bonus XP and keep your streak alive. Consistent practice is the key to success.",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "dash",
    icon: MessageCircle,
    title: "Meet Dash",
    description: "I'm here to help with tips, win celebrations, and quick encouragement when a question gets spicy.",
    color: "from-blue-500 to-orange-500",
  },
];

export function StepTutorial({ updateData, onComplete }: StepTutorialProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<number[]>([]);

  const slide = tutorialSlides[currentSlide];
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === tutorialSlides.length - 1;

  const handleNext = () => {
    if (!completedSlides.includes(currentSlide)) {
      setCompletedSlides([...completedSlides, currentSlide]);
    }
    
    if (isLastSlide) {
      updateData({ tutorialCompleted: true });
      onComplete({ tutorialCompleted: true });
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const Icon = slide.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
        <Dash emotion="happy" size="md" animate={!shouldReduceMotion} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-600">App tour</p>
          <h2 className="text-xl font-bold text-slate-950">Know where to tap</h2>
          <p className="text-sm text-slate-600">
            A quick sweep of the main tools before you start practicing.
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2">
        {tutorialSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show tour slide ${index + 1}: ${tutorialSlides[index].title}`}
            onClick={() => setCurrentSlide(index)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full"
          >
            <span
              className={`
                h-2.5 rounded-full transition-all
                ${index === currentSlide
                  ? "w-6 bg-blue-500"
                  : completedSlides.includes(index)
                  ? "w-2.5 bg-blue-300"
                  : "w-2.5 bg-slate-200"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Slide content */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${slide.color} p-6 text-white`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{slide.title}</h2>
          </div>

          <CardContent className="p-6">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {slide.description}
            </p>

            {/* Feature highlight */}
            <div className="mt-6 p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${slide.color} flex items-center justify-center`}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    {currentSlide === 0 && "Check your dashboard daily to track progress"}
                    {currentSlide === 1 && "Start with quick quizzes to build confidence"}
                    {currentSlide === 2 && "Focus on your weakest categories first"}
                    {currentSlide === 3 && "Complete daily goals to maximize XP"}
                    {currentSlide === 4 && "Dash has different messages based on your progress"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstSlide}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentSlide + 1} / {tutorialSlides.length}
        </span>

        <Button
          onClick={handleNext}
          className={`gap-2 bg-gradient-to-r ${slide.color} hover:opacity-90`}
        >
          {isLastSlide ? "Finish" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
