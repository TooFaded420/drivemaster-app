"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const checks = [
  "I am at least 15 years old.",
  "I am enrolled in, or within 30 days of active participation in, an approved driver education course.",
  "A parent or legal guardian can give consent.",
  "I am ready to pass the vision screening.",
  "I am ready for the written knowledge exam.",
];

export function PermitAt15EligibilityQuiz() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const checked = Object.values(selected).filter(Boolean).length;
  const result = useMemo(() => {
    if (checked === checks.length) {
      return {
        title: "You match the main age-15 permit requirements.",
        body: "Next step: confirm documents and test at an Illinois Secretary of State facility.",
        tone: "green",
      };
    }
    if (selected[checks[0]] && !selected[checks[1]]) {
      return {
        title: "Driver ed is the key missing piece.",
        body: "Illinois says ages 15 to 17 must be enrolled in, or 30 days before active participation in, an approved driver education course.",
        tone: "orange",
      };
    }
    return {
      title: "You still have a few boxes to check.",
      body: "Tap every requirement that is already true. Anything unchecked is your next task.",
      tone: "blue",
    };
  }, [checked, selected]);

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
                  ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
              }`}
              aria-pressed={active}
            >
              {active ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
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
          <Link href="/tools/illinois-dmv-document-checklist">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Build Document Checklist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/free-illinois-dmv-practice-test">
            <Button variant="outline">Try Practice Test</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
