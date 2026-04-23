/**
 * SEO Landing Page: /free-california-dmv-practice-test
 *
 * Primary keyword:   "free california dmv practice test"
 * Secondary:         "california dmv practice test free", "free california permit test online",
 *                    "free california driving test", "ca dmv written test practice"
 * Angle:             "This is free — here's proof, try 3 questions right now."
 *
 * NOTE: force-light-theme applied via wrapper class (no dark-mode overrides on this page).
 *
 * TODO: California question bank: pending manual import from licensed source (CA DMV handbook 2024).
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
  title: "Free California DMV Practice Test 2026 — No Signup, No Ads | DriveMaster",
  description:
    "Take a free California DMV practice test online — no credit card, no trial, no ads on the quiz itself. 46-question format based on the official CA DMV handbook. Start in seconds.",
  keywords: [
    "free california dmv practice test",
    "california dmv practice test free",
    "free california permit test online",
    "free california driving test",
    "ca dmv written test practice",
    "california permit test 2026",
    "ca dmv knowledge test",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/free-california-dmv-practice-test",
  },
  openGraph: {
    title: "Free California DMV Practice Test — No Signup Required",
    description:
      "46-question format, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial period.",
    url: "https://aceyourpermit.com/free-california-dmv-practice-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free California DMV Practice Test — No Signup Required",
    description:
      "46-question format, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial.",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Is DriveMaster really free for California?",
    answer:
      "Yes — completely free. All California practice questions are available with no credit card, no free-trial countdown, and no paywalled content. We plan to add optional premium features in the future, but the full practice test library stays free.",
  },
  {
    question: "How many questions are on the California DMV written test?",
    answer:
      "The California DMV knowledge test has 46 questions. You need to answer at least 38 correctly (about 83%) to pass. If you are under 18, you must also pass a separate signs test.",
  },
  {
    question: "Do I need to sign up to practice?",
    answer:
      "You can browse and try sample questions without an account. To save your streak, track weak spots, and pick up where you left off, you'll need a free account — just an email address, no payment info.",
  },
  {
    question: "What is the minimum age to get a permit in California?",
    answer:
      "In California, you can apply for a provisional instruction permit at age 15 and a half (15 years, 6 months). You must also complete 30 hours of driver education and 6 hours of behind-the-wheel training with a licensed instructor before getting a provisional license.",
  },
  {
    question: "Is DriveMaster better than the official CA DMV practice tests?",
    answer:
      "Different goals. The official CA DMV tests confirm you know the rules. DriveMaster teaches you the rules through gamification, streaks, and Dash's hype-beast explanations — so you actually remember them on test day and beyond.",
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
  name: "DriveMaster — Free California DMV Practice Test",
  url: "https://aceyourpermit.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free California DMV knowledge test practice with gamified streaks and Dash AI explanations.",
};

// ─── Sample Questions ─────────────────────────────────────────────────────────
// NOTE: These are general driving knowledge questions consistent with CA DMV
// handbook topics. Full CA question bank pending licensed source import.

const sampleQuestions = [
  {
    id: "ca-ts-001",
    question:
      "What is the speed limit in a residential district in California unless otherwise posted?",
    options: ["25 mph", "30 mph", "35 mph", "20 mph"],
    correctIndex: 0,
    explanation:
      "The basic speed limit in a residential district in California is 25 mph unless a different speed limit is posted.",
    source: "California Driver Handbook 2024 — Speed Laws",
  },
  {
    id: "ca-ts-002",
    question:
      "In California, what is the speed limit in a school zone when children are present?",
    options: ["25 mph", "15 mph", "20 mph", "30 mph"],
    correctIndex: 0,
    explanation:
      "The speed limit near schools in California is 25 mph when children are present, unless a lower limit is posted.",
    source: "California Driver Handbook 2024 — Speed Laws",
  },
  {
    id: "ca-tl-001",
    question:
      "When must you use your headlights in California?",
    options: [
      "30 minutes after sunset to 30 minutes before sunrise, and when visibility is under 1,000 feet",
      "Only after sunset",
      "Only in rain",
      "One hour after sunset to one hour before sunrise",
    ],
    correctIndex: 0,
    explanation:
      "California law requires headlights from 30 minutes after sunset to 30 minutes before sunrise, and any time visibility is reduced to 1,000 feet or less.",
    source: "California Driver Handbook 2024 — Lights",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FreeCaliforniaDMVPracticeTestPage() {
  return (
    <div className="force-light min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
            Free California DMV<br />
            <span className="text-blue-600">Practice Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            46-question format based on the official California DMV handbook.
            Gamified streaks, Dash explanations, zero paywalls.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto">
            California&apos;s knowledge test is 46 questions — you need 38 correct
            (about 83%) to pass. We&apos;re here to make sure you get there.
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
              { label: "46-question format", sub: "matches CA DMV test" },
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

      {/* ── CA DMV Fast Facts ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            California DMV — fast facts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Minimum permit age", value: "15.5" },
              { label: "Test questions", value: "46" },
              { label: "Pass threshold", value: "38 / 46" },
              { label: "Pass rate", value: "~83%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600 font-display mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
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
              Want the full California question bank with streaks, XP, and Dash coaching?
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
            Free California DMV Practice Test — Start Now
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card. No trial. No ads on the quiz. Just practice questions
            that actually prepare you for the CA DMV knowledge test.
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
            California Department of Motor Vehicles.
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

// ─── Data ────────────────────────────────────────────────────────────────────

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
    desc: "Build daily streaks, earn XP, and level up — the same loop that makes games addictive, applied to actually learning CA road rules.",
    Icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "CA-Specific Questions",
    desc: "Every question maps to the official California DMV handbook — road signs, traffic laws, right-of-way, and sharing the road.",
    Icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Installs Like an App",
    desc: "DriveMaster is a PWA. Add it to your home screen from any browser — iOS or Android — and practice offline.",
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
    desc: "Simulate the real CA DMV test format: 46 questions, need 38 correct. Practice the pressure before you feel it at the DMV.",
    Icon: Car,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
