"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dash } from "@/components/mascot";
import { 
  US_STATES, 
  DEFAULT_STATE, 
  LICENSE_TYPES 
} from "@/lib/constants/onboarding";
import { OnboardingData } from "@/types/database";
import { MapPin, User, Car, Calendar } from "lucide-react";

interface StepProfileProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onComplete: (data?: Partial<OnboardingData>) => void;
}

export function StepProfile({ data, updateData, onComplete }: StepProfileProps) {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    state: DEFAULT_STATE,
    licenseType: "permit",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Please enter your name";
    }
    
    if (!formData.age) {
      newErrors.age = "Please enter your age";
    } else {
      const ageNum = parseInt(formData.age as string);
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 100) {
        newErrors.age = "Age must be between 15 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const ageNum = parseInt(formData.age);

    onComplete({
      displayName: formData.displayName,
      age: ageNum,
      state: formData.state,
      licenseType: formData.licenseType,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with mascot */}
      <div className="flex items-center gap-4 mb-6">
        <Dash
          emotion="happy"
          size="md"
          animate={true}
          showSpeechBubble={true}
          speechTitle="Tell Me About You!"
          speechText="I'd love to know more about you so I can create the perfect study plan!"
          speechPosition="right"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : undefined}
        className="space-y-6"
      >
        {/* Name input */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            What should we call you?
          </Label>
          <Input
            id="displayName"
            placeholder="Enter your name"
            value={formData.displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, displayName: e.target.value })}
            className={errors.displayName ? "border-red-500" : ""}
          />
          {errors.displayName && (
            <p className="text-sm text-red-500">{errors.displayName}</p>
          )}
        </div>

        {/* Age input */}
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            How old are you?
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, age: e.target.value })}
            className={errors.age ? "border-red-500" : ""}
            min={15}
            max={100}
          />
          {errors.age && (
            <p className="text-sm text-red-500">{errors.age}</p>
          )}
          <p className="text-xs text-muted-foreground">
            You must be at least 15 years old to apply for a learner's permit in Illinois
          </p>
        </div>

        {/* State selection */}
        <div className="space-y-2">
          <Label htmlFor="state" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Which state are you in?
          </Label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {US_STATES.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Currently optimized for Illinois DMV tests. More states coming soon!
          </p>
        </div>

        {/* License type selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            What are you studying for?
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LICENSE_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setFormData({ ...formData, licenseType: type.value })}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all
                  ${formData.licenseType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-medium text-foreground">{type.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

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
