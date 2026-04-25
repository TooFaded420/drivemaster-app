/**
 * SEO Landing Page: /free-new-york-dmv-practice-test
 *
 * Primary keyword:   "free new york dmv practice test"
 * Secondary:         "ny dmv practice test free", "free new york permit test online",
 *                    "free ny driving test", "free ny practice test no signup"
 * Angle:             "This is free — here's proof, try 3 questions right now."
 */

// force-light-theme — NY landing pages always render in light mode
// (data-theme="light" on root div; no dark-mode class inheritance from layout)

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
  title: "Free New York DMV Practice Test 2026 — No Signup, No Ads | Ace Your Permit",
  description:
    "Take a free New York DMV practice test online — no credit card, no trial, no ads on the quiz itself. Based on the official NY MV-21 Driver's Manual 2024. 20 questions, 70% to pass. Start in seconds.",
  keywords: [
    "free new york dmv practice test",
    "ny dmv practice test free",
    "free new york permit test online",
    "free ny driving test",
    "free ny practice test no signup",
    "new york dmv practice test 2026",
    "ny permit test 2026",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/free-new-york-dmv-practice-test",
  },
  openGraph: {
    title: "Free New York DMV Practice Test — No Signup Required",
    description:
      "20-question NY DMV permit test format, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial period.",
    url: "https://aceyourpermit.com/free-new-york-dmv-practice-test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free New York DMV Practice Test — No Signup Required",
    description:
      "20-question NY DMV format, gamified streaks, Dash AI explanations. 100% free — no credit card, no trial.",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Is Ace Your Permit really free for the NY DMV practice test?",
    answer:
      "Yes — completely free. All practice questions are available with no credit card, no free-trial countdown, and no paywalled content.",
  },
  {
    question: "How many questions are on the New York DMV permit test?",
    answer:
      "The New York DMV written knowledge test has 20 questions. You need to answer at least 14 correctly (70%) to pass.",
  },
  {
    question: "What is the minimum age for a NY learner's permit?",
    answer:
      "You must be at least 16 years old to apply for a NY learner's permit (Class DJ junior or Class MJ motorcycle junior). You must hold the permit for at least 6 months before taking the road test.",
  },
  {
    question: "What is the 5-hour pre-licensing course in New York?",
    answer:
      "New York requires all first-time license applicants to complete a NY DMV-approved 5-hour pre-licensing course before taking the road test. The course covers defensive driving, distracted driving, and state traffic laws. It can be taken online or in-person.",
  },
  {
    question: "Do I need to sign up to practice?",
    answer:
      "You can browse and try sample questions without an account. To save your streak, track weak spots, and pick up where you left off, you'll need a free account — just an email address, no payment info.",
  },
  {
    question: "Does Ace Your Permit cover NYC-specific driving rules?",
    answer:
      "The NY DMV written test is the same statewide — NYC driving restrictions (honking, bus lanes, alternate-side parking) are NOT tested on the permit exam. We focus on the 20 tested knowledge areas from the NY MV-21 manual.",
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
  name: "Ace Your Permit — Free New York DMV Practice Test",
  url: "https://aceyourpermit.com",
  applicationCategory: "EducationApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free New York DMV permit test practice with gamified streaks and Dash AI explanations. 20-question format, 70% to pass.",
};

// ─── NY Test Facts ─────────────────────────────────────────────────────────

const nyFacts = [
  { label: "20 questions", sub: "on the real NY test" },
  { label: "70% to pass", sub: "14 of 20 correct" },
  { label: "Age 16+", sub: "minimum permit age" },
  { label: "No credit card", sub: "ever required" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function FreeNewYorkDMVPracticeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" data-theme="light">
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
            Free New York DMV<br />
            <span className="text-blue-600">Practice Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            NY DMV format: 20 questions, 70% to pass (14/20). Gamified streaks,
            Dash explanations, zero paywalls. Based on the NY MV-21 Driver&apos;s Manual 2024.
          </p>
          <p className="text-sm text-gray-500 mb-10 max-w-xl mx-auto">
            <strong>NY test facts:</strong> The permit test is 20 questions statewide.
            You need 14 correct to pass. Minimum age is 16.
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
                Try Sample Questions First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NY Facts Bar ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            NY DMV Permit Test at a Glance
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {nyFacts.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" />
                <span className="font-bold text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-500">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NY-Specific Info ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              What&apos;s on the NY DMV Permit Test?
            </h2>
            <p className="text-gray-600">
              20 questions from the NY MV-21 Driver&apos;s Manual. Here&apos;s what&apos;s tested.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { topic: "Traffic Signs & Signals", detail: "Regulatory, warning, guide, and pavement markings" },
              { topic: "Right-of-Way Rules", detail: "Intersections, merging, pedestrians, school buses" },
              { topic: "Speed Limits & Following Distance", detail: "Posted limits, work zones, residential areas" },
              { topic: "Safe Driving Techniques", detail: "Defensive driving, scanning, space management" },
              { topic: "Alcohol & Drug Laws", detail: "BAC limits, zero tolerance under 21, implied consent" },
              { topic: "Vehicle Safety Equipment", detail: "Seatbelts, child restraints, lights, mirrors" },
              { topic: "Sharing the Road", detail: "Cyclists, pedestrians, motorcycles, large trucks" },
              { topic: "NY GDL Restrictions", detail: "Class DJ junior license, passenger and curfew rules" },
            ].map((item) => (
              <div
                key={item.topic}
                className="rounded-xl border border-gray-200 bg-white p-4 flex gap-3 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.topic}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 font-display tracking-tight">
            What Makes Ace Your Permit Different
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
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
            Free New York DMV Practice Test — Start Now
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card. No trial. No ads on the quiz. Just 20 questions that
            prepare you for the real NY DMV permit test.
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
            <span className="text-lg font-bold text-gray-900">Ace Your Permit</span>
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
            &copy; 2026 Ace Your Permit. All rights reserved. Not affiliated with the
            New York Department of Motor Vehicles.
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
    desc: "Build daily streaks, earn XP, and level up — the same loop that makes games addictive, applied to actually learning road rules.",
    Icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "NY-Specific Questions",
    desc: "Every question targets the NY MV-21 Driver's Manual — the exact source for the 20-question DMV permit test.",
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
    desc: "No locked categories, no premium question packs, no countdown timer on a free trial. The full question bank is free — full stop.",
    Icon: ShieldCheck,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "20-Question Test Simulator",
    desc: "Simulate the real NY DMV format: 20 questions, pass at 14 correct. Practice the pressure before you feel it at the DMV office.",
    Icon: Car,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
