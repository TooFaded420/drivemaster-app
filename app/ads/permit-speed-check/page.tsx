import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractivePermitAd } from "@/components/marketing/interactive-permit-ad";
import { SamplePracticeTest } from "@/components/marketing/sample-practice-test";

export const metadata: Metadata = {
  title: "30-Second Permit Speed Check | Ace Your Permit",
  description:
    "Try a fast interactive permit-test question before you study. No signup, no credit card, just instant feedback from Dash.",
  alternates: {
    canonical: "https://aceyourpermit.com/ads/permit-speed-check",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const adQuestions = [
  {
    id: "ad-speed-001",
    question:
      "In Illinois, what is the speed limit in a school zone when children are present?",
    options: ["20 mph", "15 mph", "25 mph", "30 mph"],
    correctIndex: 0,
    explanation:
      "Illinois school zones are 20 mph when children are present. Slow down early and watch for crossing guards.",
    source: "Illinois Rules of the Road 2024 — Speed Limits",
  },
  {
    id: "ad-signal-001",
    question:
      "What does a flashing red traffic light mean?",
    options: [
      "Stop completely, then go when it is safe",
      "Slow down and keep moving",
      "Yield only if traffic is close",
      "The signal means the same as green",
    ],
    correctIndex: 0,
    explanation:
      "A flashing red light works like a stop sign. Stop fully, check traffic, then proceed when it is safe.",
    source: "Illinois Rules of the Road 2024 — Traffic Signals",
  },
  {
    id: "ad-lane-001",
    question:
      "On a multi-lane highway, which lane should you usually use for normal driving?",
    options: ["The right lane", "The left lane", "Any lane", "The shoulder"],
    correctIndex: 0,
    explanation:
      "Use the right lane for normal driving. Left lanes are usually for passing or preparing for a left turn.",
    source: "Illinois Rules of the Road 2024 — Lane Usage",
  },
];

export default function PermitSpeedCheckAdPage() {
  return (
    <div className="force-light-theme min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="border-b bg-white/85 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Car className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Ace Your Permit
            </span>
          </Link>
          <Link href="/signup">
            <Button className="min-h-[44px] bg-blue-600 hover:bg-blue-700">
              Start Free
            </Button>
          </Link>
        </div>
      </nav>

      <header className="px-4 pb-6 pt-12 text-center sm:px-6 sm:pt-16">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          No signup before the question
        </div>
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Answer one permit question before your next scroll.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          A fast interactive ad experience for students who keep saying they will study later.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="#sample-practice">
            <Button className="min-h-[44px] bg-orange-500 hover:bg-orange-600">
              Take the Speed Check
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/free-illinois-dmv-practice-test">
            <Button variant="outline" className="min-h-[44px]">
              Full Practice Page
            </Button>
          </Link>
        </div>
      </header>

      <InteractivePermitAd />

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <CheckCircle2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Run the real mini test
            </h2>
            <p className="mt-3 text-slate-600">
              Three taps, instant feedback, then save your progress when you are ready.
            </p>
          </div>

          <SamplePracticeTest questions={adQuestions} />
        </div>
      </section>
    </div>
  );
}
