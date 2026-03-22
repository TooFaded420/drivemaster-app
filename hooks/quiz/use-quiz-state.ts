"use client";

import { useState, useCallback, useRef } from "react";
import { QuestionWithAnswers } from "@/types/database";
import { QuizAnswer } from "../use-quiz";

/**
 * useQuizState — Manages quiz question state, navigation, and answer tracking
 *
 * Data flow:
 *   loadQuestions() ──▶ questions[]
 *   selectAnswer() ──▶ currentAnswer
 *   markAnswered() ──▶ answers[], streak, navigation
 */

interface UseQuizStateOptions {
  quizType: "practice" | "category" | "timed" | "marathon" | "mistakes";
  categoryId?: number;
  timeLimit?: number;
}

export function useQuizState(options: UseQuizStateOptions) {
  const { quizType, categoryId, timeLimit } = options;

  const sessionIdRef = useRef(`quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const selectAnswer = useCallback((answerId: number) => {
    if (isAnswered) return;
    setCurrentAnswer(answerId);
  }, [isAnswered]);

  const markAnswered = useCallback((answer: QuizAnswer) => {
    setAnswers((prev) => [...prev, answer]);
    setIsAnswered(true);
    setIsCorrect(answer.isCorrect);
    setTotalTimeTaken((prev) => prev + answer.timeTaken);

    const newStreak = answer.isCorrect ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);
    setMaxStreak((prev) => Math.max(prev, newStreak));
  }, [currentStreak]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex >= questions.length - 1) return;
    setCurrentQuestionIndex((prev) => prev + 1);
    setCurrentAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex <= 0) return;
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
    setCurrentAnswer(answers[prevIndex]?.selectedAnswerId || null);
    setIsAnswered(true);
    setIsCorrect(answers[prevIndex]?.isCorrect || null);
  }, [currentQuestionIndex, answers]);

  const flagQuestion = useCallback((questionIndex: number) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionIndex)
        ? prev.filter((i) => i !== questionIndex)
        : [...prev, questionIndex]
    );
  }, []);

  const resetState = useCallback(() => {
    sessionIdRef.current = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setQuestionStartTime(Date.now());
    setTotalTimeTaken(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setFlaggedQuestions([]);
    setIsComplete(false);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0
    ? ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100
    : 0;

  return {
    // State
    questions,
    currentQuestionIndex,
    currentQuestion,
    answers,
    currentAnswer,
    isAnswered,
    isCorrect,
    questionStartTime,
    totalTimeTaken,
    currentStreak,
    maxStreak,
    flaggedQuestions,
    isComplete,
    sessionId: sessionIdRef.current,
    quizType,
    categoryId,
    timeLimit: timeLimit ? timeLimit * 60 : undefined,

    // Computed
    progress,
    canGoBack: currentQuestionIndex > 0,
    canGoForward: currentQuestionIndex < questions.length - 1 && isAnswered,

    // Actions
    setQuestions,
    selectAnswer,
    markAnswered,
    nextQuestion,
    previousQuestion,
    flagQuestion,
    setIsComplete,
    setQuestionStartTime,
    resetState,
  };
}
