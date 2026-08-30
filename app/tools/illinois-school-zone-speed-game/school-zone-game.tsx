"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const scenarios = [
  {
    prompt: "School day. Children are walking near the school-zone sign.",
    answer: "20 mph",
    explanation: "School speed zones limit vehicle speed to 20 mph during school days when children are physically present.",
  },
  {
    prompt: "Saturday afternoon. No school activity and no children nearby.",
    answer: "Posted limit",
    explanation: "The school-zone reduction depends on the school-day/children-present conditions. Follow posted signs and normal conditions.",
  },
  {
    prompt: "School day. Children are outside the building near traffic.",
    answer: "20 mph",
    explanation: "Children physically present outside or on the street triggers the reduced school-zone rule.",
  },
];

const options = ["20 mph", "Posted limit"];

export function SchoolZoneSpeedGame() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const scenario = scenarios[index];
  const selected = answers[index];
  const score = useMemo(
    () => scenarios.reduce((total, item, itemIndex) => total + (answers[itemIndex] === item.answer ? 1 : 0), 0),
    [answers],
  );

  const choose = (option: string) => {
    setAnswers((current) => ({ ...current, [index]: current[index] ?? option }));
  };

  const next = () => setIndex((current) => (current + 1) % scenarios.length);
  const reset = () => {
    setAnswers({});
    setIndex(0);
  };

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/60 sm:p-8">
      <div className="rounded-3xl bg-slate-950 p-5 text-white">
        <p className="font-mono text-sm text-blue-200">
          Scenario {index + 1} of {scenarios.length} | Score {score}/{scenarios.length}
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold">{scenario.prompt}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selected === option;
            const isCorrect = scenario.answer === option;
            const showCorrect = selected && isCorrect;
            const showMiss = selected && isSelected && !isCorrect;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                disabled={selected !== undefined}
                className={`min-h-[56px] rounded-2xl border px-4 py-3 text-lg font-bold transition-colors ${
                  showCorrect
                    ? "border-emerald-300 bg-emerald-400 text-slate-950"
                    : showMiss
                      ? "border-orange-300 bg-orange-400 text-slate-950"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {selected && (
          <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900">
            <p className="font-semibold">{selected === scenario.answer ? "Nice. That is the move." : "Close. Watch the trigger words."}</p>
            <p className="mt-1 text-sm text-slate-700">{scenario.explanation}</p>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={next}>
          Next Scenario
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </Button>
        <Link href="/blog/illinois-school-zone-speed-limit">
          <Button variant="outline">
            Read the Rule
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
