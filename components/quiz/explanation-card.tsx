"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

interface ExplanationCardProps {
  isCorrect: boolean;
  explanation: string | null;
  correctAnswer: string;
}

export function ExplanationCard({
  isCorrect,
  explanation,
  correctAnswer,
}: ExplanationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`border-0 shadow-md ${
          isCorrect ? "bg-green-50" : "bg-orange-50"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  isCorrect ? "text-green-700" : "text-orange-700"
                }`}
              >
                {isCorrect ? "Correct!" : "Not quite"}
              </p>
              
              {!isCorrect && (
                <p className="text-sm text-gray-700 mt-1">
                  The correct answer was: <span className="font-medium">{correctAnswer}</span>
                </p>
              )}
              
              {explanation && (
                <div className="mt-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ExplanationCard;
