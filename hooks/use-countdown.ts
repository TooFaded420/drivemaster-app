"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * useCountdown — Test day countdown + readiness score
 *
 * Reads profiles.test_date, calculates days remaining,
 * computes readiness from rolling category accuracy,
 * and generates Dash's urgency message.
 *
 * State machine:
 *   NO_DATE ──▶ COUNTING_DOWN ──▶ TEST_DAY ──▶ PAST_DUE
 */

export type CountdownState = "no_date" | "counting_down" | "test_day" | "past_due";

interface CategoryAccuracy {
  categoryId: number;
  categoryName: string;
  accuracy: number;
  isWeak: boolean;
}

interface CountdownData {
  state: CountdownState;
  testDate: Date | null;
  daysRemaining: number;
  readinessScore: number;
  categories: CategoryAccuracy[];
  weakCategories: CategoryAccuracy[];
  dashMessage: string;
  dashEmotion: "happy" | "excited" | "thinking" | "encouraging";
  isLoading: boolean;
}

// Dash messages — hype-beast tone from DESIGN.md
function getDashMessage(state: CountdownState, days: number, readiness: number): string {
  if (state === "no_date") return "When's the big day? Set your test date and let's get to work";
  if (state === "past_due") return "How'd it go? Update your test date if you need more practice";
  if (state === "test_day") return "TODAY IS THE DAY. You got this. Go get 'em";

  if (days <= 3 && readiness < 70) return "ayo we're cutting it close. Time to lock in and grind";
  if (days <= 3) return "almost there fam. You're looking solid. Just review your weak spots";
  if (readiness >= 90) return "you're ready fr fr. Go pass that test";
  if (readiness >= 70) return "you're almost ready. A few more sessions and you're golden";
  if (readiness >= 50) return "we're getting there fam. Keep pushing";
  return "lowkey we need to grind a bit more. Let's get those weak categories up";
}

function getDashEmotion(state: CountdownState, readiness: number): "happy" | "excited" | "thinking" | "encouraging" {
  if (state === "no_date") return "thinking";
  if (state === "past_due") return "thinking";
  if (state === "test_day") return "excited";
  if (readiness >= 90) return "excited";
  if (readiness >= 70) return "happy";
  if (readiness >= 50) return "encouraging";
  return "encouraging";
}

export function useCountdown(userId?: string): CountdownData {
  const supabase = createClient();
  const [testDateStr, setTestDateStr] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryAccuracy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch test date from profile
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);

      // Get test date
      const { data: profile } = await supabase
        .from("profiles")
        .select("test_date")
        .eq("id", userId)
        .maybeSingle();

      setTestDateStr(profile?.test_date || null);

      // Get category accuracy (rolling last 20 attempts per category)
      const { data: attempts } = await supabase
        .from("user_attempts")
        .select("is_correct, question:questions(category_id, category:categories(name))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(200); // Fetch enough to get 20 per category

      if (attempts && attempts.length > 0) {
        // Group by category, take last 20 per category
        const byCat: Record<number, { name: string; correct: number; total: number }> = {};

        for (const attempt of attempts) {
          const catId = (attempt.question as any)?.category_id;
          const catName = (attempt.question as any)?.category?.name || "Unknown";
          if (!catId) continue;

          if (!byCat[catId]) byCat[catId] = { name: catName, correct: 0, total: 0 };
          if (byCat[catId].total >= 20) continue; // Only last 20

          byCat[catId].total++;
          if (attempt.is_correct) byCat[catId].correct++;
        }

        const catAccuracies: CategoryAccuracy[] = Object.entries(byCat).map(([id, data]) => ({
          categoryId: parseInt(id),
          categoryName: data.name,
          accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
          isWeak: data.total > 0 ? (data.correct / data.total) < 0.7 : true,
        }));

        setCategories(catAccuracies);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [userId, supabase]);

  // Computed values
  const testDate = testDateStr ? new Date(testDateStr) : null;
  const now = new Date();
  const daysRemaining = testDate
    ? Math.ceil((testDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const state: CountdownState = !testDate
    ? "no_date"
    : daysRemaining < 0
      ? "past_due"
      : daysRemaining === 0
        ? "test_day"
        : "counting_down";

  const readinessScore = categories.length > 0
    ? Math.round(categories.reduce((sum, c) => sum + c.accuracy, 0) / categories.length)
    : 0;

  const weakCategories = categories.filter((c) => c.isWeak);

  return {
    state,
    testDate,
    daysRemaining,
    readinessScore,
    categories,
    weakCategories,
    dashMessage: getDashMessage(state, daysRemaining, readinessScore),
    dashEmotion: getDashEmotion(state, readinessScore),
    isLoading,
  };
}
