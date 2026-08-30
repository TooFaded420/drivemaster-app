"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SampleQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

interface SamplePracticeTestProps {
  questions: SampleQuestion[];
}

const dashCorrect = "Yep, that's the move. Keep that pace and test day gets way less scary.";
const dashMiss = "Close but nah. Peek at the rule, lock it in, then run it back.";

export function SamplePracticeTest({ questions }: SamplePracticeTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question) =>
          answers[question.id] === question.correctIndex ? total + 1 : total,
        0,
      ),
    [answers, questions],
  );
  const isComplete = answeredCount === questions.length;

  return (
    <div id="sample-practice" className="scroll-mt-24 space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Free mini test
            </p>
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Try 3 real Illinois questions
            </h3>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Zap className="h-4 w-4 text-orange-500" aria-hidden="true" />
            {score}/{questions.length} locked in
          </div>
        </div>
      </div>

      {questions.map((question, index) => (
        <SampleQuestionCard
          key={question.id}
          index={index + 1}
          question={question}
          selectedIndex={answers[question.id]}
          onSelect={(selectedIndex) =>
            setAnswers((current) => ({
              ...current,
              [question.id]: current[question.id] ?? selectedIndex,
            }))
          }
        />
      ))}

      {isComplete && (
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 text-center shadow-sm">
          <p className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {score === questions.length ? "Clean sweep." : `${score}/${questions.length} is a start.`}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            {score === questions.length
              ? "Dash says you're warmed up. Create an account to save streaks, XP, and weak spots."
              : "Dash says the real win is knowing what to review before test day."}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="min-h-[44px]"
              onClick={() => setAnswers({})}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
            <Link href="/signup">
              <Button className="min-h-[44px] bg-orange-500 hover:bg-orange-600">
                Save My Progress
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SampleQuestionCard({
  index,
  question,
  selectedIndex,
  onSelect,
}: {
  index: number;
  question: SampleQuestion;
  selectedIndex?: number;
  onSelect: (selectedIndex: number) => void;
}) {
  const hasAnswered = selectedIndex !== undefined;
  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
        Question {index} of 3
      </p>
      <p className="mt-3 text-base font-semibold leading-relaxed text-slate-900">
        {question.question}
      </p>

      <div className="mt-5 space-y-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isCorrectOption = question.correctIndex === optionIndex;
          const showCorrect = hasAnswered && isCorrectOption;
          const showMiss = hasAnswered && isSelected && !isCorrectOption;

          return (
            <button
              key={option}
              type="button"
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                showCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : showMiss
                    ? "border-red-300 bg-red-50 text-red-900"
                    : isSelected
                      ? "border-blue-400 bg-blue-50 text-blue-900"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => onSelect(optionIndex)}
              disabled={hasAnswered}
              aria-pressed={isSelected}
            >
              {showCorrect ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
              ) : showMiss ? (
                <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
              ) : (
                <span className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
              )}
              <span className="flex-1">{option}</span>
              {showCorrect && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  Answer
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`mt-5 rounded-xl border px-4 py-3 ${
            isCorrect ? "border-emerald-100 bg-emerald-50" : "border-blue-100 bg-blue-50"
          }`}
        >
          <p className="text-sm text-slate-900">
            <strong>Dash says:</strong> {isCorrect ? dashCorrect : dashMiss}{" "}
            {question.explanation}
          </p>
          <p className="mt-1 text-xs text-slate-500">{question.source}</p>
        </div>
      )}
    </section>
  );
}
