"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { QuestionWithAnswers, QuizSession } from "@/types/database";
import { calculateAnswerXP, calculateXP, XPCalculationResult } from "@/lib/gamification/xp-calculator";
import { toast } from "sonner";

export interface QuizAnswer {
  questionId: number;
  selectedAnswerId: number;
  isCorrect: boolean;
  timeTaken: number; // in seconds
}

export interface QuizState {
  // Quiz configuration
  quizType: "practice" | "category" | "timed" | "marathon" | "mistakes";
  categoryId?: number;
  timeLimit?: number; // in seconds, for timed mode
  
  // Questions
  questions: QuestionWithAnswers[];
  currentQuestionIndex: number;
  
  // Answers
  answers: QuizAnswer[];
  currentAnswer: number | null; // selected answer ID
  
  // Progress
  isAnswered: boolean;
  isCorrect: boolean | null;
  
  // Timer
  questionStartTime: number;
  totalTimeTaken: number;
  timeRemaining: number | null; // for timed mode
  
  // Streaks
  currentStreak: number;
  maxStreak: number;
  
  // Flags
  flaggedQuestions: number[];
  
  // Session
  sessionId: string | null;
  isComplete: boolean;
  
  // Results
  results: QuizResults | null;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalTimeTaken: number;
  averageTimePerQuestion: number;
  maxStreak: number;
  xpEarned: XPCalculationResult;
  weakCategories: { categoryId: number; categoryName: string; wrongCount: number }[];
}

interface UseQuizOptions {
  quizType: "practice" | "category" | "timed" | "marathon" | "mistakes";
  categoryId?: number;
  questionCount?: number;
  timeLimit?: number; // in minutes
  userId?: string;
}

export function useQuiz(options: UseQuizOptions) {
  const { quizType, categoryId, questionCount = 10, timeLimit, userId } = options;
  const supabase = createClient();
  
  // Generate session ID
  const sessionIdRef = useRef(`quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const [state, setState] = useState<QuizState>({
    quizType,
    categoryId,
    timeLimit: timeLimit ? timeLimit * 60 : undefined,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    currentAnswer: null,
    isAnswered: false,
    isCorrect: null,
    questionStartTime: Date.now(),
    totalTimeTaken: 0,
    timeRemaining: timeLimit ? timeLimit * 60 : null,
    currentStreak: 0,
    maxStreak: 0,
    flaggedQuestions: [],
    sessionId: sessionIdRef.current,
    isComplete: false,
    results: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);

  // Timer for timed mode
  useEffect(() => {
    if (state.timeLimit && state.timeRemaining !== null && !state.isComplete) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const newTimeRemaining = (prev.timeRemaining || 0) - 1;
          
          if (newTimeRemaining <= 0) {
            // Time's up - complete the quiz
            completeQuiz();
            return { ...prev, timeRemaining: 0 };
          }
          
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state.timeLimit, state.timeRemaining, state.isComplete]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build API URL with query params
      const params = new URLSearchParams();
      params.set("count", String(quizType === "marathon" ? 1000 : questionCount));

      if (quizType === "category" && categoryId) {
        params.set("category", String(categoryId));
      }

      const res = await fetch(`/api/questions/random?${params}`);
      if (!res.ok) throw new Error("Failed to fetch questions");

      const json = await res.json();
      if (!json.success || !json.data?.length) {
        throw new Error("No questions available");
      }

      // Transform local data format (options[] + correct_answer index)
      // into the answers[] format the UI expects
      const transformed: QuestionWithAnswers[] = json.data.map(
        (q: { id: string; question_text: string; options: string[]; correct_answer: number; explanation: string | null; category_id: string | null; difficulty: string; image_url: string | null; has_image: boolean; source: string | null; times_asked: number; correct_count: number; created_at?: string }) => ({
          ...q,
          id: typeof q.id === "string" ? parseInt(q.id.replace(/\D/g, "").slice(0, 8)) || Math.random() * 100000 | 0 : q.id,
          category_id: q.category_id ? parseInt(q.category_id.replace(/\D/g, "").slice(0, 8)) || null : null,
          question_type: "multiple_choice",
          is_active: true,
          answers: q.options.map((text: string, idx: number) => ({
            id: (typeof q.id === "string" ? parseInt(q.id.replace(/\D/g, "").slice(0, 8)) || 0 : q.id) * 10 + idx,
            question_id: typeof q.id === "string" ? parseInt(q.id.replace(/\D/g, "").slice(0, 8)) || 0 : q.id,
            answer_text: text,
            is_correct: idx === q.correct_answer,
            sort_order: idx,
          })),
        })
      );

      setState((prev) => ({
        ...prev,
        questions: transformed,
        questionStartTime: Date.now(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  };

  const selectAnswer = useCallback((answerId: number) => {
    setState((prev) => {
      if (prev.isAnswered) return prev;
      return { ...prev, currentAnswer: answerId };
    });
  }, []);

  const submitAnswer = useCallback(async () => {
    if (state.currentAnswer === null || state.isAnswered) return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const correctAnswer = currentQuestion.answers.find((a) => a.is_correct);
    const isCorrect = state.currentAnswer === correctAnswer?.id;
    const timeTaken = Math.round((Date.now() - state.questionStartTime) / 1000);

    const newStreak = isCorrect ? state.currentStreak + 1 : 0;
    const newMaxStreak = Math.max(state.maxStreak, newStreak);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswerId: state.currentAnswer,
      isCorrect,
      timeTaken,
    };

    setState((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
      isAnswered: true,
      isCorrect,
      currentStreak: newStreak,
      maxStreak: newMaxStreak,
      totalTimeTaken: prev.totalTimeTaken + timeTaken,
    }));

    // Save attempt to database
    if (userId) {
      try {
        await supabase.from("user_attempts").insert({
          user_id: userId,
          question_id: currentQuestion.id,
          selected_answer_id: state.currentAnswer,
          is_correct: isCorrect,
          time_taken: timeTaken,
          session_id: state.sessionId,
        });

        // Update wrong answers tracking
        if (!isCorrect) {
          const { data: existing } = await supabase
            .from("user_wrong_answers")
            .select("wrong_count")
            .eq("user_id", userId)
            .eq("question_id", currentQuestion.id)
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
              .eq("question_id", currentQuestion.id);
          } else {
            await supabase.from("user_wrong_answers").insert({
              user_id: userId,
              question_id: currentQuestion.id,
              wrong_count: 1,
              last_attempted: new Date().toISOString(),
              is_mastered: false,
            });
          }
        } else {
          // Check if this was previously a wrong answer (mastered it)
          const { data: existing } = await supabase
            .from("user_wrong_answers")
            .select("wrong_count")
            .eq("user_id", userId)
            .eq("question_id", currentQuestion.id)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("user_wrong_answers")
              .update({
                is_mastered: true,
                last_attempted: new Date().toISOString(),
              })
              .eq("user_id", userId)
              .eq("question_id", currentQuestion.id);
          }
        }
      } catch (err) {
        console.error("Failed to save attempt:", err);
        toast.error("Your answer was recorded but progress sync failed. It will retry automatically.");
      }
    }
  }, [state, userId, supabase]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex >= prev.questions.length - 1) {
        return prev;
      }

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        currentAnswer: null,
        isAnswered: false,
        isCorrect: null,
        questionStartTime: Date.now(),
      };
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex <= 0) return prev;

      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        currentAnswer: prev.answers[prev.currentQuestionIndex - 1]?.selectedAnswerId || null,
        isAnswered: true,
        isCorrect: prev.answers[prev.currentQuestionIndex - 1]?.isCorrect || null,
      };
    });
  }, []);

  const flagQuestion = useCallback((questionIndex: number) => {
    setState((prev) => {
      const isFlagged = prev.flaggedQuestions.includes(questionIndex);
      return {
        ...prev,
        flaggedQuestions: isFlagged
          ? prev.flaggedQuestions.filter((i) => i !== questionIndex)
          : [...prev.flaggedQuestions, questionIndex],
      };
    });
  }, []);

  const completeQuiz = useCallback(async () => {
    if (state.isComplete) return;

    const correctAnswers = state.answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = state.answers.length - correctAnswers;
    const accuracy = state.answers.length > 0 
      ? Math.round((correctAnswers / state.answers.length) * 100) 
      : 0;
    const averageTimePerQuestion = state.answers.length > 0
      ? Math.round(state.totalTimeTaken / state.answers.length)
      : 0;

    // Check if this is user's first quiz attempt
    let isFirstAttempt = true;
    if (userId) {
      const { count } = await supabase
        .from("quiz_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_completed", true);
      isFirstAttempt = (count ?? 0) === 0;
    }

    // Calculate XP
    const xpResult = calculateXP({
      correctAnswers,
      totalQuestions: state.questions.length,
      averageTimePerQuestion,
      streakCount: state.maxStreak,
      isFirstAttempt,
      difficulty: "medium",
    });

    // Calculate weak categories
    const categoryStats: Record<number, { name: string; wrongCount: number }> = {};
    state.answers.forEach((answer, index) => {
      if (!answer.isCorrect) {
        const question = state.questions[index];
        const categoryId = question.category_id || 0;
        if (!categoryStats[categoryId]) {
          categoryStats[categoryId] = { name: "Unknown", wrongCount: 0 };
        }
        categoryStats[categoryId].wrongCount++;
      }
    });

    const weakCategories = Object.entries(categoryStats)
      .map(([catId, stats]) => ({
        categoryId: parseInt(catId),
        categoryName: stats.name,
        wrongCount: stats.wrongCount,
      }))
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 3);

    const results: QuizResults = {
      totalQuestions: state.questions.length,
      correctAnswers,
      wrongAnswers,
      accuracy,
      totalTimeTaken: state.totalTimeTaken,
      averageTimePerQuestion,
      maxStreak: state.maxStreak,
      xpEarned: xpResult,
      weakCategories,
    };

    setState((prev) => ({
      ...prev,
      isComplete: true,
      results,
    }));

    // Save quiz session
    if (userId) {
      try {
        await supabase.from("quiz_sessions").insert({
          id: state.sessionId!,
          user_id: userId,
          quiz_type: quizType,
          category_id: categoryId || null,
          question_count: state.questions.length,
          correct_count: correctAnswers,
          xp_earned: xpResult.totalXP,
          started_at: new Date(Date.now() - state.totalTimeTaken * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          is_completed: true,
          time_taken_seconds: state.totalTimeTaken,
          mistake_count: wrongAnswers,
          streak_count: state.maxStreak,
        });

        // Update user stats
        const { data: userStats } = await supabase
          .from("user_stats")
          .select("total_xp")
          .eq("user_id", userId)
          .single();

        if (userStats) {
          await supabase
            .from("user_stats")
            .update({
              total_xp: userStats.total_xp + xpResult.totalXP,
            })
            .eq("user_id", userId);
        }
      } catch (err) {
        console.error("Failed to save quiz session:", err);
        toast.error("Quiz results saved locally but failed to sync. They'll sync when you're back online.");
      }
    }
  }, [state, userId, supabase, quizType, categoryId]);

  const restartQuiz = useCallback(() => {
    sessionIdRef.current = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setState({
      quizType,
      categoryId,
      timeLimit: timeLimit ? timeLimit * 60 : undefined,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      currentAnswer: null,
      isAnswered: false,
      isCorrect: null,
      questionStartTime: Date.now(),
      totalTimeTaken: 0,
      timeRemaining: timeLimit ? timeLimit * 60 : null,
      currentStreak: 0,
      maxStreak: 0,
      flaggedQuestions: [],
      sessionId: sessionIdRef.current,
      isComplete: false,
      results: null,
    });
    loadQuestions();
  }, [quizType, categoryId, timeLimit]);

  const currentQuestion = state.questions[state.currentQuestionIndex];

  return {
    // State
    ...state,
    currentQuestion,
    isLoading,
    error,
    
    // Computed
    progress: state.questions.length > 0
      ? ((state.currentQuestionIndex + (state.isAnswered ? 1 : 0)) / state.questions.length) * 100
      : 0,
    canGoBack: state.currentQuestionIndex > 0,
    canGoForward: state.currentQuestionIndex < state.questions.length - 1 && state.isAnswered,
    
    // Actions
    selectAnswer,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    flagQuestion,
    completeQuiz,
    restartQuiz,
  };
}

export default useQuiz;
