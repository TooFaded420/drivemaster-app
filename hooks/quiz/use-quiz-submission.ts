"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuestionWithAnswers } from "@/types/database";
import { calculateXP, XPCalculationResult } from "@/lib/gamification/xp-calculator";
import { QuizAnswer, QuizResults } from "../use-quiz";
import { toast } from "sonner";

/**
 * useQuizSubmission — Handles answer submission, DB persistence, and XP calculation
 *
 * Error handling:
 *   DB write fails → toast notification, quiz continues locally
 *   XP calc fails  → defaults to 0, logs error
 */

interface UseQuizSubmissionOptions {
  userId?: string;
}

export function useQuizSubmission({ userId }: UseQuizSubmissionOptions) {
  const supabase = createClient();

  /**
   * Submit an answer to the database and track wrong answers
   */
  const persistAnswer = useCallback(async (
    question: QuestionWithAnswers,
    selectedAnswerId: number,
    isCorrect: boolean,
    timeTaken: number,
    sessionId: string
  ) => {
    if (!userId) return;

    try {
      // Save the attempt
      await supabase.from("user_attempts").insert({
        user_id: userId,
        question_id: question.id,
        selected_answer_id: selectedAnswerId,
        is_correct: isCorrect,
        time_taken: timeTaken,
        session_id: sessionId,
      });

      // Update wrong answers tracking
      if (!isCorrect) {
        const { data: existing } = await supabase
          .from("user_wrong_answers")
          .select("wrong_count")
          .eq("user_id", userId)
          .eq("question_id", question.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_wrong_answers")
            .update({
              wrong_count: existing.wrong_count + 1,
              last_attempted: new Date().toISOString(),
              is_mastered: false,
            })
            .eq("user_id", userId)
            .eq("question_id", question.id);
        } else {
          await supabase.from("user_wrong_answers").insert({
            user_id: userId,
            question_id: question.id,
            wrong_count: 1,
            last_attempted: new Date().toISOString(),
            is_mastered: false,
          });
        }
      } else {
        // Mark as mastered if previously wrong
        const { data: existing } = await supabase
          .from("user_wrong_answers")
          .select("wrong_count")
          .eq("user_id", userId)
          .eq("question_id", question.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_wrong_answers")
            .update({
              is_mastered: true,
              last_attempted: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("question_id", question.id);
        }
      }
    } catch (err) {
      console.error("Failed to save attempt:", err);
      toast.error("Your answer was recorded but progress sync failed. It will retry automatically.");
    }
  }, [userId, supabase]);

  /**
   * Complete the quiz: calculate XP, save session, update stats
   */
  const completeAndPersist = useCallback(async (
    answers: QuizAnswer[],
    questions: QuestionWithAnswers[],
    maxStreak: number,
    totalTimeTaken: number,
    sessionId: string,
    quizType: string,
    categoryId?: string
  ): Promise<QuizResults> => {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = answers.length - correctAnswers;
    const accuracy = answers.length > 0
      ? Math.round((correctAnswers / answers.length) * 100)
      : 0;
    const averageTimePerQuestion = answers.length > 0
      ? Math.round(totalTimeTaken / answers.length)
      : 0;

    // Check if first attempt
    let isFirstAttempt = true;
    if (userId) {
      const { count } = await supabase
        .from("quiz_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_completed", true);
      isFirstAttempt = (count ?? 0) === 0;
    }

    const xpResult = calculateXP({
      correctAnswers,
      totalQuestions: questions.length,
      averageTimePerQuestion,
      streakCount: maxStreak,
      isFirstAttempt,
      difficulty: "medium",
    });

    // Calculate weak categories (category_id is a string slug after H10)
    const categoryStats: Record<string, { name: string; wrongCount: number }> = {};
    answers.forEach((answer, index) => {
      if (!answer.isCorrect && questions[index]) {
        const catId = String(questions[index].category_id ?? "unknown");
        if (!categoryStats[catId]) {
          categoryStats[catId] = { name: "Unknown", wrongCount: 0 };
        }
        categoryStats[catId].wrongCount++;
      }
    });

    const weakCategories = Object.entries(categoryStats)
      .map(([catId, stats]) => ({
        categoryId: catId,
        categoryName: stats.name,
        wrongCount: stats.wrongCount,
      }))
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 3);

    const results: QuizResults = {
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers,
      accuracy,
      totalTimeTaken,
      averageTimePerQuestion,
      maxStreak,
      xpEarned: xpResult,
      weakCategories,
    };

    // Save to database
    if (userId) {
      try {
        await supabase.from("quiz_sessions").insert({
          id: sessionId,
          user_id: userId,
          quiz_type: quizType,
          category_id: categoryId || null,
          question_count: questions.length,
          correct_count: correctAnswers,
          xp_earned: xpResult.totalXP,
          started_at: new Date(Date.now() - totalTimeTaken * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          is_completed: true,
          time_taken_seconds: totalTimeTaken,
          mistake_count: wrongAnswers,
          streak_count: maxStreak,
        });

        const { data: userStats } = await supabase
          .from("user_stats")
          .select("total_xp")
          .eq("user_id", userId)
          .single();

        if (userStats) {
          await supabase
            .from("user_stats")
            .update({ total_xp: userStats.total_xp + xpResult.totalXP })
            .eq("user_id", userId);
        }
      } catch (err) {
        console.error("Failed to save quiz session:", err);
        toast.error("Quiz results saved locally but failed to sync. They'll sync when you're back online.");
      }
    }

    return results;
  }, [userId, supabase]);

  return {
    persistAnswer,
    completeAndPersist,
  };
}
