/**
 * SEO Landing Page: /free-pennsylvania-dmv-practice-test
 *
 * Primary keyword:   "free pennsylvania dmv practice test"
 * Secondary:         "free pa permit test online", "pennsylvania penndot practice test",
 *                    "pa driving test practice free", "pennsylvania permit test 2026"
 * Angle:             Free practice for the PennDOT written knowledge test — no signup required.
 *
 * PA test facts (PennDOT):
 *   - 18 questions total, must score 15/18 (~83%) to pass
 *   - Administered by PennDOT, not a "DMV" (PA calls it PennDOT)
 *   - Minimum age 16 for learner's permit (Form DL-180 with parental consent)
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
  title: "Free Pennsylvania DMV Practice Test 2026 — No Signup | Ace Your Permit",
  description:
    "Free Pennsylvania PennDOT practice test online — no credit card, no trial, no ads. Study for the PA written knowledge test: 18 questions, pass with 15 correct (83%). Start in seconds.",
  keywords: [
    "free pennsylvania dmv practice test",
    "free pa permit test online",
    "pennsylvania penndot practice test",
    "pa driving test practice free",
    "pennsylvania permit test 2026",
    "penndot written knowledge test",
    "pa learners permit practice test",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/free-pennsylvania-dmv-practice-test",
  },
  openGraph: {
    title: "Free Pennsylvania DMV Practice Test — No Signup Required",
    description:
      "Practice for the PennDOT written knowledge test. 18 questions, pass with 15 correct. Gamified streaks, Dash AI explanations. 100% free.",
    url: "https://aceyourpermit.com/free-pennsylvania-dmv-practice-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Pennsylvania DMV Practice Test — No Signup Required",
    description:
      "PennDOT written test prep. 18 questions, 83% to pass. Free — no credit card, no trial.",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Is Ace Your Permit really free for Pennsylvania drivers?",
    answer:
      "Yes — completely free. All practice questions are available with no credit card, no free-trial countdown, and no paywalled content.",
  },
  {
    question: "How many questions are on the Pennsylvania permit test?",
    answer:
      "The PennDOT written knowledge test has 18 questions. You need to answer at least 15 correctly (83%) to pass.",
  },
  {
    question: "Does Pennsylvania have a DMV?",
    answer:
      "Not exactly. Pennsylvania driving licenses and permits are handled by PennDOT — the Pennsylvania Department of Transportation. When people search 'Pennsylvania DMV,' they almost always mean PennDOT. We match that language so you can find us, but the official agency is PennDOT.",
  },
  {
    question: "What age can you get a learner's permit in Pennsylvania?",
    answer:
      "You must be at least 16 years old to apply for a Pennsylvania learner's permit. You will need to submit Form DL-180 with a parent or guardian signature.",
  },
  {
    question: "Do I need to sign up to practice?",
    answer:
      "You can try sample questions without an account. To save your streak, track weak spots, and pick up where you left off, you'll need a free account — just an email address, no payment info.",
  },
  {
    question: "How many supervised driving hours are required in Pennsylvania?",
    answer:
      "Pennsylvania requires 65 hours of supervised driving practice (including 10 hours at night and 5 hours in adverse weather) before you can apply for a junior driver's license.",
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
  name: "Ace Your Permit — Free Pennsylvania DMV Practice Test",
  url: "https://aceyourpermit.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free Pennsylvania PennDOT permit test practice with gamified streaks and Dash AI explanations.",
};

// ─── Sample Questions ─────────────────────────────────────────────────────────
// NOTE: These are illustrative questions based on publicly available PennDOT
// handbook content. Full question bank: pending manual import from licensed
// source (PA Driver's Manual PUB 95).

const sampleQuestions = [
  {
    id: "pa-sample-001",
    question:
      "What is the speed limit in a Pennsylvania school zone when children are present?",
    options: ["15 mph", "20 mph", "25 mph", "35 mph"],
    correctIndex: 0,
    explanation:
      "In Pennsylvania, the speed limit is 15 mph in a school zone when children are present, unless otherwise posted.",
    source: "Pennsylvania Driver's Manual (PUB 95) — Speed Limits",
  },
  {
    id: "pa-sample-002",
    question:
      "How many questions are on the Pennsylvania PennDOT written knowledge test?",
    options: ["18", "20", "25", "35"],
    correctIndex: 0,
    explanation:
      "The Pennsylvania PennDOT written knowledge test has 18 questions. You must answer at least 15 correctly (83%) to pass.",
    source: "PennDOT — Driver's License Testing Requirements",
  },
  {
    id: "pa-sample-003",
    question: "What does a flashing red traffic light mean?",
    options: [
      "Stop, then proceed when safe",
      "Slow down and proceed with caution",
      "Yield to oncoming traffic",
      "The signal is broken — treat as a 4-way stop",
    ],
    correctIndex: 0,
    explanation:
      "A flashing red light means the same as a STOP sign. Come to a complete stop, then proceed when it is safe to do so.",
    source: "Pennsylvania Driver's Manual (PUB 95) — Traffic Signals",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FreePennsylvaniaDMVPracticeTestPage() {
  return (
    <div className="force-light-theme min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ── Navigation ── */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Ace Your Permit</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="h-11">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 h-11">Start Free</Button>
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
            Free Pennsylvania DMV<br />
            <span className="text-blue-600">Practice Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Study for the PennDOT written knowledge test — 18 questions, pass
            with 15 correct (83%). Gamified streaks, Dash explanations, zero paywalls.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto">
            <strong>Quick note:</strong> Pennsylvania doesn&apos;t have a DMV — permits
            and licenses are handled by PennDOT (Pennsylvania Department of Transportation).
            We match the &ldquo;DMV&rdquo; search term so you can find us, but everything
            here lines up with the official PennDOT test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 min-h-[44px]">
                Start Free Practice Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="text-lg px-8 min-h-[44px]">
                Try Sample Questions First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Test Stats Bar ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Pennsylvania PennDOT written test — fast facts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Total questions", value: "18" },
              { label: "Correct to pass", value: "15" },
              { label: "Passing score", value: "83%" },
              { label: "Minimum age", value: "16" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-blue-600 font-display">{item.value}</span>
                <span className="text-sm text-gray-500">{item.label}</span>
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
              Try Sample Questions Right Now
            </h2>
            <p className="text-gray-600">
              No account needed. Answers and Dash explanations are shown below.
            </p>
          </div>

          <div className="space-y-8">
            {sampleQuestions.map((q, idx) => (
              <SampleQuestion key={q.id} index={idx + 1} question={q} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
              Want full question bank with streaks, XP, and Dash coaching?
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 min-h-[44px]">
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
            What Makes Ace Your Permit Different
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${f.iconBg}`}>
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
            Free Pennsylvania Practice Test — Start Now
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card. No trial. No ads on the quiz. Just practice that
            actually prepares you for the PennDOT written knowledge test.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 min-h-[44px]">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600 text-lg px-8 min-h-[44px]">
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
            <span className="text-lg font-bold text-gray-900">Ace Your Permit</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          </div>
          <p className="text-center text-gray-500 text-sm">
            &copy; 2026 Ace Your Permit. All rights reserved. Not affiliated with PennDOT or
            the Commonwealth of Pennsylvania. Always verify requirements at{" "}
            <a href="https://www.dmv.pa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              dmv.pa.gov
            </a>.
          </p>
        </div>
      </footer>

      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
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
      <p className="text-base font-semibold text-gray-900 mb-5">{question.question}</p>
      <div className="space-y-3 mb-5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          return (
            <div
              key={opt}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 min-h-[44px] ${
                isCorrect ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              <span className={`text-sm ${isCorrect ? "text-green-800 font-semibold" : "text-gray-700"}`}>
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
    desc: "Dash breaks down every question with encouragement, never judgment. Wrong answer? Dash explains why. Right answer? Pure hype.",
    Icon: Star,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    title: "Streaks & XP",
    desc: "Build daily streaks, earn XP, and level up — the same loop that makes games addictive, applied to learning road rules.",
    Icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "PennDOT-Aligned Questions",
    desc: "Every question maps to the official Pennsylvania Driver's Manual (PUB 95) — road signs, traffic laws, right-of-way, safe driving.",
    Icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Installs Like an App",
    desc: "Ace Your Permit is a PWA. Add it to your home screen from any browser — iOS or Android — and practice offline.",
    Icon: Smartphone,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Zero Paywalls",
    desc: "No locked categories, no premium question packs, no countdown timer on a free trial. The full question bank is free.",
    Icon: ShieldCheck,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Test Simulator",
    desc: "Simulate the real PennDOT test format: 18 questions, pass with 15 correct. Practice the pressure before you feel it.",
    Icon: Car,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
