"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const checks = [
  "I know what documents I need to bring.",
  "I can score at least 80% on a practice test.",
  "I know the common road signs.",
  "I understand right-of-way at stop signs and intersections.",
  "I know school-zone and following-distance rules.",
  "I have a plan for test day and transportation.",
];

export function ReadinessChecker() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const count = Object.values(selected).filter(Boolean).length;
  const result = useMemo(() => {
    if (count >= 5) {
      return {
        title: "You look close to ready.",
        body: "Run one timed practice test and review anything you missed before you go.",
        tone: "green",
      };
    }
    if (count >= 3) {
      return {
        title: "You are halfway there.",
        body: "Tighten up signs, right-of-way, and the paperwork checklist before test day.",
        tone: "orange",
      };
    }
    return {
      title: "Start with the basics.",
      body: "Do a short practice test first, then come back and check your readiness again.",
      tone: "blue",
    };
  }, [count]);

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/60 sm:p-8">
      <div className="grid gap-3">
        {checks.map((check) => {
          const active = selected[check] === true;
          return (
            <button
              key={check}
              type="button"
              onClick={() => setSelected((current) => ({ ...current, [check]: !current[check] }))}
              className={`flex min-h-[56px] items-center gap-3 rounded-2xl border px-4 py-3 text-left font-medium transition-colors ${
                active
                  ? "border-blue-500 bg-blue-50 text-blue-950"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
              }`}
              aria-pressed={active}
            >
              {active ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
              )}
              {check}
            </button>
          );
        })}
      </div>

      <div
        className={`mt-6 rounded-2xl border p-5 ${
          result.tone === "green"
            ? "border-emerald-100 bg-emerald-50"
            : result.tone === "orange"
              ? "border-orange-100 bg-orange-50"
              : "border-blue-100 bg-blue-50"
        }`}
      >
        <p className="font-display text-2xl font-bold text-slate-950">{result.title}</p>
        <p className="mt-2 text-slate-700">{result.body}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/free-illinois-dmv-practice-test">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Take Practice Test
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/blog/what-to-bring-illinois-permit-test">
            <Button variant="outline">Check Documents</Button>
          </Link>
          <Link href="/tools/illinois-road-sign-flashcards">
            <Button variant="outline">Study Signs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
