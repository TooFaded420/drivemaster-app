"use client";

import { useCountdown, CountdownState } from "@/hooks/use-countdown";
import { Mascot } from "@/components/mascot";
import { Calendar, Target, AlertTriangle } from "lucide-react";
import { features } from "@/lib/feature-flags";
import Link from "next/link";

/**
 * TestCountdown — Dashboard widget showing days until test + readiness
 *
 * Position: #1 on dashboard (above quick actions)
 * States: no_date | counting_down | test_day | past_due
 *
 * ┌──────────────────────────────────────────┐
 * │  [Ring]  12 days until your test         │
 * │  71%     Readiness: ████████░░ 71%       │
 * │          Dash: "we're getting there fam" │
 * └──────────────────────────────────────────┘
 */

interface TestCountdownProps {
  userId?: string;
}

export function TestCountdown({ userId }: TestCountdownProps) {
  // Feature flag gate
  if (!features.countdown) return null;

  return <TestCountdownInner userId={userId} />;
}

function TestCountdownInner({ userId }: TestCountdownProps) {
  const {
    state,
    daysRemaining,
    readinessScore,
    weakCategories,
    dashMessage,
    dashEmotion,
    isLoading,
  } = useCountdown(userId);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-white/20" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded bg-white/20" />
            <div className="h-4 w-32 rounded bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  // No date set — show CTA
  if (state === "no_date") {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold">When&apos;s the big day?</h3>
            <p className="text-sm text-muted-foreground">Set your test date so Dash can help you prepare</p>
          </div>
          <Link
            href="/profile"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Set Date
          </Link>
        </div>
      </div>
    );
  }

  // Past due
  if (state === "past_due") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold">How&apos;d it go?</h3>
            <p className="text-sm text-muted-foreground">{dashMessage}</p>
          </div>
          <Link
            href="/profile"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Update Date
          </Link>
        </div>
      </div>
    );
  }

  // Active countdown (counting_down or test_day)
  const isTestDay = state === "test_day";
  const ringColor = isTestDay ? "border-orange-400" : readinessScore >= 90 ? "border-emerald-400" : readinessScore >= 70 ? "border-blue-400" : "border-orange-400";
  const bgGradient = isTestDay
    ? "from-orange-600 to-red-500"
    : "from-blue-700 to-blue-500";

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${bgGradient} p-6 text-white shadow-lg`}>
      <div className="flex items-center gap-5">
        {/* Readiness Ring */}
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(readinessScore / 100) * 220} 220`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-center">
            <div className="text-xl font-bold leading-none">{isTestDay ? "!" : daysRemaining}</div>
            <div className="text-[10px] uppercase opacity-80">{isTestDay ? "today" : "days"}</div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold leading-tight">
            {isTestDay ? "Test day is here!" : `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} until your test`}
          </h3>

          {/* Readiness bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="text-sm font-mono font-medium">{readinessScore}%</span>
          </div>

          {/* Dash message */}
          <p className="mt-1.5 text-sm opacity-85 leading-snug">{dashMessage}</p>

          {/* Weak categories */}
          {weakCategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {weakCategories.slice(0, 3).map((cat) => (
                <span key={cat.categoryId} className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {cat.categoryName}: {cat.accuracy}%
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mini Dash */}
        <div className="hidden sm:block flex-shrink-0">
          <Mascot emotion={dashEmotion} size="sm" />
        </div>
      </div>
    </div>
  );
}
