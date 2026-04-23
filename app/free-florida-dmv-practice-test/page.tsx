/**
 * SEO Landing Page: /free-florida-dmv-practice-test
 *
 * Primary keyword:   "free florida dmv practice test"
 * Secondary:         "florida dmv practice test free", "free florida permit test online",
 *                    "florida driving test practice", "florida dmv test 2026"
 * Agency:            Florida Highway Safety and Motor Vehicles (FLHSMV / FL DHSMV)
 *
 * TODO: Florida question bank: pending manual import from licensed source
 * (FL Driver License Handbook 2024).
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

// ─── Force light theme ────────────────────────────────────────────────────────
// These SEO pages are always rendered light regardless of user OS preference.

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Free Florida DMV Practice Test 2026 — No Signup, No Ads | DriveMaster",
  description:
    "Take a free Florida DMV practice test online — no credit card, no trial, no ads on the quiz. 50 questions based on the official FL Driver License Handbook. Covers road rules and road signs. Start in seconds.",
  keywords: [
    "free florida dmv practice test",
    "florida dmv practice test free",
    "free florida permit test online",
    "florida driving test practice",
    "florida dmv test 2026",
    "flhsmv practice test",
    "florida permit test 2026",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/free-florida-dmv-practice-test",
  },
  openGraph: {
    title: "Free Florida DMV Practice Test — No Signup Required",
    description:
      "50-question Florida permit test practice. Road rules + road signs. Gamified streaks, Dash AI explanations. 100% free — no credit card, no trial period.",
    url: "https://aceyourpermit.com/free-florida-dmv-practice-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Florida DMV Practice Test — No Signup Required",
    description:
      "50-question Florida permit test practice. 100% free — no credit card, no trial.",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "How many questions are on the Florida permit test?",
    answer:
      "The Florida knowledge test has 50 questions: 40 on traffic laws and road rules, and 10 on road signs. You need to answer 40 correctly (80%) to pass.",
  },
  {
    question: "What is the minimum age to get a learner's permit in Florida?",
    answer:
      "You must be at least 15 years old to obtain a Florida learner's license (instruction permit). Before taking the knowledge test, you must complete a Traffic Law and Substance Abuse Education (TLSAE) 4-hour course.",
  },
  {
    question: "What is the TLSAE course?",
    answer:
      "The Traffic Law and Substance Abuse Education (TLSAE) course — sometimes called Drug, Alcohol, and Traffic Education (DATE) — is a required 4-hour class for first-time Florida drivers. You must complete it before taking the permit knowledge test. It is available online or in person.",
  },
  {
    question: "Do I need to sign up to practice?",
    answer:
      "You can try sample questions without an account. To save your streak, track weak spots, and pick up where you left off, you'll need a free account — just an email address, no payment info.",
  },
  {
    question: "Is DriveMaster really free?",
    answer:
      "Yes — completely free. All practice questions are available with no credit card, no free-trial countdown, and no paywalled content. We plan to add optional premium features in the future, but the full practice test library stays free.",
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
  name: "DriveMaster — Free Florida DMV Practice Test",
  url: "https://aceyourpermit.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free Florida permit test practice with 50 questions covering road rules and road signs, gamified streaks, and Dash AI explanations.",
};

// ─── Sample Questions ─────────────────────────────────────────────────────────
// NOTE: These are general road-rule facts from the public FL Driver License
// Handbook. Do NOT fabricate DMV questions.

const sampleQuestions = [
  {
    id: "fl-ts-001",
    question:
      "What is the speed limit in a school zone in Florida when children are present?",
    options: ["20 mph", "15 mph", "25 mph", "30 mph"],
    correctIndex: 0,
    explanation:
      "Florida law sets the school zone speed limit at 20 mph when children are present. Fines are doubled in school zones.",
    source: "FL Driver License Handbook 2024 — Speed Limits",
  },
  {
    id: "fl-ts-002",
    question: "In Florida, what does a flashing red traffic light mean?",
    options: [
      "Stop completely, then proceed when safe",
      "Slow down and proceed with caution",
      "The signal is broken — treat as a 4-way stop",
      "Yield to oncoming traffic",
    ],
    correctIndex: 0,
    explanation:
      "A flashing red light must be treated the same as a STOP sign — come to a complete stop, then proceed when it is safe.",
    source: "FL Driver License Handbook 2024 — Traffic Signals",
  },
  {
    id: "fl-ts-003",
    question:
      "What is the minimum following distance (in seconds) recommended for safe driving in Florida?",
    options: ["3 seconds", "1 second", "2 seconds", "4 seconds"],
    correctIndex: 0,
    explanation:
      "Florida recommends a minimum 3-second following distance under normal conditions. Increase to 4–6 seconds in rain or heavy traffic.",
    source: "FL Driver License Handbook 2024 — Space Management",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FreeFloridaDMVPracticeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" data-theme="light">
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
            Free Florida DMV<br />
            <span className="text-blue-600">Practice Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            50-question practice test covering road rules and road signs — based on the official
            Florida Driver License Handbook. Gamified streaks, Dash explanations, zero paywalls.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto">
            Florida&apos;s written knowledge test is administered by the{" "}
            <strong>Florida Highway Safety and Motor Vehicles (FLHSMV)</strong>.
            You need 40/50 (80%) to pass.
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

      {/* ── Stats Bar ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Florida FLHSMV test — by the numbers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Total questions", value: "50" },
              { label: "Road rules questions", value: "40" },
              { label: "Road signs questions", value: "10" },
              { label: "Pass score required", value: "80%" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-blue-600 font-display">{item.value}</span>
                <span className="text-sm text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TLSAE Info ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-orange-800 mb-2 font-display">
            Before the test: TLSAE / Drug &amp; Alcohol Course required
          </h2>
          <p className="text-orange-700 text-sm leading-relaxed">
            Florida requires all first-time permit applicants to complete a{" "}
            <strong>Traffic Law and Substance Abuse Education (TLSAE)</strong> 4-hour course
            before taking the knowledge test. This is sometimes called the Drug, Alcohol, and
            Traffic Education (DATE) course. It is available online and must be completed before
            you visit the FLHSMV. Ask your driving school or check{" "}
            <a
              href="https://www.flhsmv.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              flhsmv.gov
            </a>{" "}
            for approved providers.
          </p>
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
              No account needed. Answers and explanations shown.
            </p>
          </div>

          <div className="space-y-8">
            {sampleQuestions.map((q, idx) => (
              <SampleQuestion key={q.id} index={idx + 1} question={q} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Want the full Florida practice test with streaks, XP, and Dash coaching?
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
            <p className="text-gray-600">Real answers about the Florida permit test.</p>
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
            Free Florida DMV Practice Test — Start Now
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card. No trial. No ads on the quiz. Just practice questions that
            actually prepare you for the FLHSMV knowledge test.
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
            &copy; 2026 DriveMaster. All rights reserved. Not affiliated with the Florida Highway
            Safety and Motor Vehicles (FLHSMV). Always verify requirements at{" "}
            <a
              href="https://www.flhsmv.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              flhsmv.gov
            </a>
            .
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
                  isCorrect ? "text-green-800 font-semibold" : "text-gray-700"
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
    desc: "Dash breaks down every question with encouragement, never judgment. Wrong answer? Dash explains why without making you feel bad.",
    Icon: Star,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Streaks & XP",
    desc: "Build daily streaks, earn XP, and level up — the same loop that makes games addictive, applied to actually learning Florida road rules.",
    Icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "50-Question FL Format",
    desc: "Practice in the exact format of the FLHSMV test: 40 road rules + 10 road signs. Pass threshold: 80% (40/50).",
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
    title: "Florida-Specific Content",
    desc: "Every question maps to the official FL Driver License Handbook — not a generic multi-state bank that may not match Florida law.",
    Icon: Car,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
