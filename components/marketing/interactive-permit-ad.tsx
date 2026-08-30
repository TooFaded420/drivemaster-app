"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, MousePointerClick, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const answers = ["15 mph", "20 mph", "25 mph", "30 mph"];
const correctAnswer = "20 mph";

export function InteractivePermitAd() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const hasAnswered = selectedAnswer !== null;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/60 sm:p-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-700">
              <MousePointerClick className="h-4 w-4" aria-hidden="true" />
              30-second permit check
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Think you can pass this before the bell rings?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Tap one answer, get instant feedback, then run the free mini quiz before you forget the rule.
            </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-600" aria-hidden="true" />
              30-second hook
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" aria-hidden="true" />
              Instant payoff
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              No signup first
            </span>
          </div>
          <div className="mt-7">
            <Link href="#sample-practice">
              <Button className="min-h-[44px] bg-blue-600 hover:bg-blue-700">
                Try the Interactive Ad
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4 text-white shadow-lg">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                ACE YOUR PERMIT
              </span>
              <span className="font-mono text-xs text-blue-100">0:29</span>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight">
              Quick: school zone speed?
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {answers.map((answer) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === correctAnswer;
                const showCorrect = hasAnswered && isCorrect;
                const showMiss = hasAnswered && isSelected && !isCorrect;

                return (
                <button
                  key={answer}
                  type="button"
                  onClick={() => {
                    if (!hasAnswered) setSelectedAnswer(answer);
                  }}
                  disabled={hasAnswered}
                  className={`min-h-[44px] rounded-xl border px-3 py-3 text-center text-sm font-bold ${
                    showCorrect
                      ? "border-emerald-300 bg-emerald-400 text-slate-950"
                      : showMiss
                        ? "border-orange-200 bg-orange-400 text-slate-950"
                      : "border-white/20 bg-white/10 text-white"
                  }`}
                  aria-pressed={isSelected}
                >
                  {answer}
                </button>
                );
              })}
            </div>
            {hasAnswered ? (
              <div className="mt-4 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900">
                Dash says: {selectedAnswer === correctAnswer ? "Yep." : "Close. It is"} 20 mph when children are present.
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-semibold text-blue-50">
                Pick one to reveal the rule.
              </div>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-slate-300">
            One question now. Three more free ones below.
          </p>
        </div>
      </div>
    </section>
  );
}
