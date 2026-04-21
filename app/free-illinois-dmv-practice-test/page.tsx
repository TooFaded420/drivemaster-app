/**
 * SEO Landing Page: /free-illinois-dmv-practice-test
 *
 * Primary keyword:   "free illinois dmv practice test"
 * Secondary:         "illinois dmv practice test free", "free illinois permit test online",
 *                    "free illinois driving test", "free illinois practice test no signup"
 * Angle:             "This is free — here's proof, try 3 questions right now."
 *                    Anti-competitor: DriveMaster is free vs paid/ad-supported alternatives.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  CheckCircle2,
  ArrowRight,
  Star,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Free Illinois DMV Practice Test 2026 — No Signup, No Ads | DriveMaster",
  description:
    "Take a free Illinois DMV practice test online — no credit card, no trial, no ads on the quiz itself. 3,400+ questions based on the official IL Secretary of State handbook. Start in seconds.",
  keywords: [
    "free illinois dmv practice test",
    "illinois dmv practice test free",
    "free illinois permit test online",
    "free illinois driving test",
    "free illinois practice test no signup",
    "illinois secretary of state practice test",
    "illinois permit test 2026",
  ],
  alternates: {
    canonical: "https://getdrivemaster.com/free-illinois-dmv-practice-test",
  },
  openGraph: {
    title: "Free Illinois DMV Practice Test — No Signup Required",
    description:
      "3,400+ questions, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial period.",
    url: "https://getdrivemaster.com/free-illinois-dmv-practice-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Illinois DMV Practice Test — No Signup Required",
    description:
      "3,400+ questions, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial.",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Is DriveMaster really free?",
    answer:
      "Yes — completely free. All 3,400+ practice questions are available with no credit card, no free-trial countdown, and no paywalled content. We plan to add optional premium features in the future, but the full practice test library stays free.",
  },
  {
    question: "Why is it free?",
    answer:
      "We're building an audience first. Every teen who passes their permit test because of DriveMaster is our best marketing. We're not hiding the good stuff behind a paywall to squeeze revenue early.",
  },
  {
    question: "Do I need to sign up to practice?",
    answer:
      "You can browse and try sample questions without an account. To save your streak, track weak spots, and pick up where you left off, you'll need a free account — just an email address, no payment info.",
  },
  {
    question: "What's the difference between the DMV and the SOS in Illinois?",
    answer:
      "Illinois doesn't have a DMV. Driver's licenses and permit tests are handled by the Illinois Secretary of State (SOS). When people search 'Illinois DMV,' they almost always mean the SOS — we match that language so you can find us, but the official agency is the Secretary of State.",
  },
  {
    question: "Is DriveMaster better than the official IL SOS practice tests?",
    answer:
      "Different goals. The official SOS tests confirm you know the rules. DriveMaster teaches you the rules through gamification, streaks, and Dash's hype-beast explanations — so you actually remember them on test day and beyond.",
  },
  {
    question: "Do you have a mobile app?",
    answer:
      "DriveMaster is a Progressive Web App (PWA) — install it from your browser on iOS or Android and it works offline. A native App Store release is on the roadmap.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DriveMaster — Free Illinois DMV Practice Test",
  url: "https://getdrivemaster.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free Illinois permit test practice with 3,400+ questions, gamified streaks, and Dash AI explanations.",
};

// ─── Sample Questions (pulled from lib/data/questions/illinois-dmv-questions) ─

const sampleQuestions = [
  {
    id: "il-ts-006",
    question:
      "What is the maximum speed limit in urban areas in Illinois unless otherwise posted?",
    options: ["30 mph", "35 mph", "25 mph", "40 mph"],
    correctIndex: 0,
    explanation:
      "The maximum speed limit in urban areas in Illinois is 30 mph unless a different speed limit is posted.",
    source: "Illinois Rules of the Road 2024 — Chapter 11: Speed Limits",
  },
  {
    id: "il-ts-007",
    question:
      "What is the speed limit in school zones in Illinois when children are present?",
    options: ["20 mph", "15 mph", "25 mph", "30 mph"],
    correctIndex: 0,
    explanation:
      "The speed limit in school zones in Illinois is 20 mph when children are present. This applies during arrival and dismissal times.",
    source: "Illinois Rules of the Road 2024 — Chapter 11: Speed Limits",
  },
  {
    id: "il-tl-007",
    question:
      "On a multi-lane highway, which lane should you use for normal driving?",
    options: ["The right lane", "The left lane", "The middle lane", "Any lane"],
    correctIndex: 0,
    explanation:
      "On multi-lane highways, use the right lane for normal driving. Use left lanes for passing.",
    source: "Illinois Rules of the Road 2024 — Chapter 7: Lane Usage",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FreeIllinoisDMVPracticeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ── Navigation ── */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DriveMaster</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="h-11">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 h-11">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            No credit card &bull; No trial &bull; No ads on the quiz
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
            Free Illinois DMV<br />
            <span className="text-blue-600">Practice Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            3,400+ questions based on the official Illinois Rules of the Road.
            Gamified streaks, Dash explanations, zero paywalls.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto">
            <strong>Quick note:</strong> Illinois doesn&apos;t have a DMV — driving
            tests are run by the Secretary of State (SOS). We match the &ldquo;DMV&rdquo;
            search term because that&apos;s what most people call it, but everything
            here lines up with the official IL SOS test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 min-h-[44px]"
              >
                Start Free Practice Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 min-h-[44px]"
              >
                Try 3 Sample Questions First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Free Proof Bar ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            What &ldquo;free&rdquo; actually means here
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "3,400+ questions", sub: "all unlocked" },
              { label: "No credit card", sub: "ever required" },
              { label: "No trial timer", sub: "access doesn't expire" },
              { label: "No ads on quizzes", sub: "clean quiz experience" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" />
                <span className="font-bold text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-500">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Questions ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              Try 3 Real Questions Right Now
            </h2>
            <p className="text-gray-600">
              No account needed. Click the correct answer — Dash will explain it.
            </p>
          </div>

          <div className="space-y-8">
            {sampleQuestions.map((q, idx) => (
              <SampleQuestion key={q.id} index={idx + 1} question={q} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Want all 3,400+ questions with streaks, XP, and Dash coaching?
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 min-h-[44px]"
              >
                Start Free — No Card Required
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              How DriveMaster Compares
            </h2>
            <p className="text-gray-600">
              Neutral facts. Judge for yourself.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700 w-1/4">
                    Feature
                  </th>
                  <th className="py-3 px-4 font-semibold text-blue-600 bg-blue-50 rounded-t-lg">
                    DriveMaster
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-700">
                    Zutobi
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-700">
                    Official IL SOS Tests
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-3 pr-4 font-medium text-gray-700">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4 text-center bg-blue-50/50">
                      <ComparisonCell value={row.drivemaster} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ComparisonCell value={row.zutobi} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ComparisonCell value={row.officialSOS} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Information about third-party services is based on publicly available
            information and may change. Verify directly with those providers.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 font-display tracking-tight">
            What Makes DriveMaster Different
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${f.iconBg}`}
                  >
                    <f.Icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">Real answers, no fluff.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-gray-900 marker:content-none list-none min-h-[44px]">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-orange-500 text-xl font-bold leading-none transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
            Free Illinois DMV Practice Test — Start Now
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card. No trial. No ads on the quiz. Just practice questions
            that actually prepare you for the IL Secretary of State test.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 min-h-[44px]"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-600 text-lg px-8 min-h-[44px]"
              >
                Practice Without Signing Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">DriveMaster</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </div>
          <p className="text-center text-gray-500 text-sm">
            &copy; 2026 DriveMaster. All rights reserved. Not affiliated with the
            Illinois Secretary of State.
          </p>
        </div>
      </footer>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SampleQuestionProps {
  index: number;
  question: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    source: string;
  };
}

function SampleQuestion({ index, question }: SampleQuestionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
        Question {index} of 3
      </p>
      <p className="text-base font-semibold text-gray-900 mb-5">
        {question.question}
      </p>
      <div className="space-y-3 mb-5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          return (
            <div
              key={opt}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 min-h-[44px] ${
                isCorrect
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span
                className={`text-sm ${
                  isCorrect
                    ? "text-green-800 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {opt}
              </span>
              {isCorrect && (
                <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  Correct
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <p className="text-sm text-blue-900">
          <strong>Dash says:</strong> {question.explanation}
        </p>
        <p className="text-xs text-blue-500 mt-1">{question.source}</p>
      </div>
    </div>
  );
}

type CellValue =
  | { type: "check"; label: string }
  | { type: "cross"; label: string }
  | { type: "neutral"; label: string };

function ComparisonCell({ value }: { value: CellValue }) {
  if (value.type === "check") {
    return (
      <span className="inline-flex flex-col items-center gap-1">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <span className="text-xs text-gray-600">{value.label}</span>
      </span>
    );
  }
  if (value.type === "cross") {
    return (
      <span className="inline-flex flex-col items-center gap-1">
        <span className="text-red-400 font-bold text-lg leading-none">&times;</span>
        <span className="text-xs text-gray-600">{value.label}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <span className="text-gray-400 font-bold text-lg leading-none">&mdash;</span>
      <span className="text-xs text-gray-600">{value.label}</span>
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const comparisonRows: Array<{
  feature: string;
  drivemaster: CellValue;
  zutobi: CellValue;
  officialSOS: CellValue;
}> = [
  {
    feature: "Cost",
    drivemaster: { type: "check", label: "Free" },
    zutobi: { type: "cross", label: "Paid / subscription" },
    officialSOS: { type: "check", label: "Free" },
  },
  {
    feature: "No credit card needed",
    drivemaster: { type: "check", label: "Never required" },
    zutobi: { type: "cross", label: "Required to unlock" },
    officialSOS: { type: "check", label: "Government site" },
  },
  {
    feature: "Ad-free quiz experience",
    drivemaster: { type: "check", label: "No ads on quizzes" },
    zutobi: { type: "neutral", label: "Paid tier, no ads" },
    officialSOS: { type: "neutral", label: "No ads" },
  },
  {
    feature: "Question explanations",
    drivemaster: { type: "check", label: "Dash explains every answer" },
    zutobi: { type: "check", label: "Yes" },
    officialSOS: { type: "cross", label: "None" },
  },
  {
    feature: "Streaks & XP gamification",
    drivemaster: { type: "check", label: "Full system" },
    zutobi: { type: "neutral", label: "Basic progress" },
    officialSOS: { type: "cross", label: "None" },
  },
  {
    feature: "Mascot / hype-beast coach",
    drivemaster: { type: "check", label: "Dash (100% hype)" },
    zutobi: { type: "cross", label: "None" },
    officialSOS: { type: "cross", label: "None" },
  },
  {
    feature: "Illinois-specific content",
    drivemaster: { type: "check", label: "IL SOS 2024 handbook" },
    zutobi: { type: "check", label: "Multi-state" },
    officialSOS: { type: "check", label: "Official IL tests" },
  },
  {
    feature: "Works offline (PWA)",
    drivemaster: { type: "check", label: "Installable PWA" },
    zutobi: { type: "neutral", label: "App available" },
    officialSOS: { type: "cross", label: "Requires connection" },
  },
];

const features: Array<{
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}> = [
  {
    title: "Dash — Your Hype-Beast Coach",
    desc: "Dash breaks down every question with encouragement, never judgment. Wrong answer? Dash explains why without making you feel bad. Right answer? Pure hype.",
    Icon: Star,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Streaks & XP",
    desc: "Build daily streaks, earn XP, and level up — the same loop that makes games addictive, applied to actually learning road rules.",
    Icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "3,400+ IL-Specific Questions",
    desc: "Every question maps to the official Illinois Secretary of State Rules of the Road handbook — road signs, traffic laws, right-of-way, sharing the road.",
    Icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Installs Like an App",
    desc: "DriveMaster is a PWA. Add it to your home screen from any browser — iOS or Android — and practice offline in the car rider line.",
    Icon: Smartphone,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Zero Paywalls",
    desc: "No locked categories, no premium question packs, no countdown timer on a free trial. The full question bank is free — full stop.",
    Icon: ShieldCheck,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Timed Test Simulator",
    desc: "Simulate the real IL SOS test format: 35 questions, timed, pass/fail score. Practice the pressure before you feel it at the SOS office.",
    Icon: Car,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
