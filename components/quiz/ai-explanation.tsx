"use client";

import { useState, useEffect } from "react";
import { Mascot } from "@/components/mascot";
import { features } from "@/lib/feature-flags";

/**
 * AiExplanation — Dash speech bubble with AI-generated explanation
 *
 * States:
 *   idle     → nothing shown (correct answer or not triggered)
 *   loading  → Dash "thinking" + animated dots
 *   ready    → Dash speech bubble with AI explanation
 *   error    → falls back to static explanation (transparent to user)
 */

interface AiExplanationProps {
  questionId: number;
  selectedAnswerIndex: number;
  questionText: string;
  selectedAnswerText: string;
  correctAnswerText: string;
  staticExplanation: string;
  isWrongAnswer: boolean;
}

export function AiExplanation({
  questionId,
  selectedAnswerIndex,
  questionText,
  selectedAnswerText,
  correctAnswerText,
  staticExplanation,
  isWrongAnswer,
}: AiExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Only show for wrong answers when feature is enabled
  const shouldShow = features.aiExplanations && isWrongAnswer;

  useEffect(() => {
    if (!shouldShow) return;

    let cancelled = false;
    setIsLoading(true);
    setExplanation(null);

    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        selectedAnswerIndex,
        questionText,
        selectedAnswerText,
        correctAnswerText,
        staticExplanation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setExplanation(data.explanation || staticExplanation);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExplanation(staticExplanation);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [shouldShow, questionId, selectedAnswerIndex]);

  if (!shouldShow) return null;

  return (
    <div className="mt-4 flex items-start gap-3">
      <Mascot emotion={isLoading ? "thinking" : "encouraging"} size="sm" />
      <div className="flex-1 rounded-2xl border-2 border-border bg-card p-4 shadow-sm">
        <div className="mb-1 font-display text-sm font-bold text-primary">Dash</div>
        {isLoading ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>thinking</span>
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
        )}
      </div>
    </div>
  );
}
