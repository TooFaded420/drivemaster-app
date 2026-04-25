/**
 * SEO Landing Page: /florida-teen-permit-15-years-old
 *
 * Primary keyword:   "florida learners permit at 15"
 * Secondary:         "how to get florida permit at 15", "florida teen permit requirements",
 *                    "florida gdl 2026", "florida learner's license 15 year old"
 * Agency:            Florida Highway Safety and Motor Vehicles (FLHSMV)
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
  ClipboardList,
  Clock,
  ShieldCheck,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Force light theme ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "How to Get Your Florida Learner's Permit at 15 | Ace Your Permit",
  description:
    "Can you get your learner's permit at 15 in Florida? Yes — here's every requirement: TLSAE course, required documents, 50-hour log, curfew rules, and GDL restrictions explained for Florida teens.",
  keywords: [
    "florida learners permit at 15",
    "how to get florida permit at 15",
    "florida teen permit requirements",
    "florida gdl 2026",
    "florida learner license 15 year old",
    "flhsmv learner permit",
    "florida instruction permit",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/florida-teen-permit-15-years-old",
  },
  openGraph: {
    title: "How to Get Your Florida Learner's Permit at 15 | Ace Your Permit",
    description:
      "Step-by-step guide to Florida teen permits. Minimum age 15, TLSAE course, required docs, 50-hour log, curfew rules — all in one place.",
    url: "https://aceyourpermit.com/florida-teen-permit-15-years-old",
    type: "article",
  },
};

// ─── Sample questions ─────────────────────────────────────────────────────────

const sampleQuestions = [
  {
    id: "fl-is-001",
    question: "What is the minimum age to obtain a Florida learner's license?",
    options: ["15 years old", "16 years old", "14 years old", "15.5 years old"],
    correctIndex: 0,
    explanation:
      "In Florida, you must be at least 15 years old to obtain a learner's license (instruction permit). You must also complete the required TLSAE 4-hour course before taking the knowledge test.",
  },
  {
    id: "fl-is-002",
    question: "What course must Florida teens complete before taking the knowledge test?",
    options: [
      "Traffic Law and Substance Abuse Education (TLSAE) 4-hour course",
      "A defensive driving course",
      "Driver's ed classroom session only",
      "No course is required",
    ],
    correctIndex: 0,
    explanation:
      "The TLSAE (Traffic Law and Substance Abuse Education) 4-hour course is required for all first-time Florida driver's license applicants before taking the knowledge test.",
  },
  {
    id: "fl-is-003",
    question: "What is the legal BAC limit for Florida drivers under 21?",
    options: ["0.02%", "0.00%", "0.05%", "0.08%"],
    correctIndex: 0,
    explanation:
      "Florida's zero-tolerance law means drivers under 21 with a BAC of 0.02% or higher face license suspension. This is effectively zero — even one drink can trigger the law.",
  },
];

const faqItems = [
  {
    question: "Can I get my learner's permit at 15 in Florida?",
    answer:
      "Yes — you can get a Florida learner's license at age 15. Unlike Illinois, Florida does not require enrollment in driver's ed to obtain a permit at 15. However, you must complete the TLSAE 4-hour course before taking the knowledge test.",
  },
  {
    question: "What is the TLSAE course and where do I take it?",
    answer:
      "The Traffic Law and Substance Abuse Education (TLSAE) course — also called the Drug, Alcohol, and Traffic Education (DATE) course — is a required 4-hour class. It is available online and in person through Florida-approved providers. Complete it before visiting the FLHSMV. Check flhsmv.gov for the approved provider list.",
  },
  {
    question: "What documents do I need for a Florida learner's permit at 15?",
    answer:
      "You need: (1) proof of identity — birth certificate or passport; (2) proof of Social Security number; (3) proof of Florida residential address (two documents — a parent's utility bill works); (4) your TLSAE course completion certificate; and (5) a parent or guardian must be present to sign. If you are under 18, a parent or guardian signature is required.",
  },
  {
    question: "How many hours do I need to drive before getting my full license?",
    answer:
      "Florida requires 50 hours of supervised driving practice — with at least 10 of those hours completed at night. Your parent or guardian must certify these hours. The learner's license must be held for at least 12 months before applying for a full license if you are under 18.",
  },
  {
    question: "What is the curfew for teen drivers in Florida?",
    answer:
      "During your first year of licensing (ages 16–17), Florida GDL restricts driving between 11 PM and 6 AM. Exceptions apply for driving to or from work, or for emergencies. Always carry proof of the exception.",
  },
  {
    question: "How many passengers can a teen driver carry in Florida?",
    answer:
      "During the first 12 months after getting a full license (or until age 18), Florida limits teen drivers to no more than one passenger under 18 (other than household members). After 12 months, no more than three passengers under 18.",
  },
  {
    question: "What is Florida's zero-tolerance law for teen drivers?",
    answer:
      "Florida's zero-tolerance law means drivers under 21 with a blood alcohol level of 0.02% or higher face automatic license suspension. This is effectively zero — not the 0.08% standard adult limit. One drink is enough to trigger it.",
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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Get Your Florida Learner's Permit at 15",
  description:
    "A complete guide to Florida GDL requirements for teens: minimum age, TLSAE course, permit documents, supervised driving hours, curfew rules, and zero-tolerance BAC.",
  author: { "@type": "Organization", name: "Ace Your Permit" },
  publisher: { "@type": "Organization", name: "Ace Your Permit", url: "https://aceyourpermit.com" },
  dateModified: "2026-04-22",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FloridaTeenPermit15Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" data-theme="light">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Nav */}
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

      {/* Hero */}
      <header className="pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Florida Graduated Driver Licensing (GDL) — 2026 Guide
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight leading-tight">
            How to Get Your Florida Learner&apos;s Permit at 15
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Yes, you can get your Florida learner&apos;s license at 15 — no driver&apos;s ed
            enrollment required. But you <strong>must</strong> complete the TLSAE 4-hour course
            before you take the knowledge test. Here&apos;s everything you need to know, from the
            docs you bring on day one to the 50-hour supervised driving log.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice FL Permit Questions Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#checklist">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Jump to Checklist
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Quick-stat bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Minimum age", value: "15", sub: "no driver's ed required" },
            { label: "Permit hold time", value: "12 mo", sub: "before full license (under 18)" },
            { label: "Supervised hours", value: "50 hrs", sub: "10 must be at night" },
            { label: "BAC limit under 21", value: "0.02%", sub: "zero-tolerance law" },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-blue-600 font-display tracking-tight mb-0.5">
                {value}
              </div>
              <div className="text-sm font-semibold text-gray-800">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Age eligibility */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display tracking-tight">
            How old do you have to be to get a permit in Florida?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 font-display text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Learner&apos;s license at 15
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 font-display mb-2">15</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As soon as you turn 15, you can apply for a Florida learner&apos;s license
                  (instruction permit) at any FLHSMV service center — no driver&apos;s ed
                  enrollment required. You must first complete the TLSAE 4-hour course.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-orange-200 shadow-sm bg-orange-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-700 font-display text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  TLSAE course — required first
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Before visiting the FLHSMV, you must complete the{" "}
                  <strong>Traffic Law and Substance Abuse Education (TLSAE)</strong> 4-hour course.
                  Available online. Bring your completion certificate on permit day.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
              <strong>Florida vs. Illinois:</strong> Unlike Illinois, Florida does not require
              enrollment in a formal driver&apos;s ed course to get a permit at 15. The TLSAE
              course is the only pre-permit requirement. Driver&apos;s ed is still strongly
              recommended — it helps you log your 50 practice hours.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section
        id="checklist"
        className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
              Florida Teen Permit Checklist
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Everything you need to bring to the FLHSMV service center on permit day. Check each one off before you leave the house.
          </p>

          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Complete the TLSAE 4-hour course",
                detail:
                  "Register with a Florida-approved TLSAE provider (available online). Complete all 4 hours and save your completion certificate. You cannot take the knowledge test without it.",
              },
              {
                step: 2,
                title: "Proof of age and identity",
                detail:
                  "Original or certified birth certificate, U.S. passport, or other government-issued photo ID showing your full legal name and date of birth.",
              },
              {
                step: 3,
                title: "Social Security number",
                detail:
                  "Your Social Security card or a document showing your full SSN. The FLHSMV will verify it electronically.",
              },
              {
                step: 4,
                title: "Proof of Florida residential address",
                detail:
                  "Two documents showing your Florida address — a parent's utility bill, bank statement, or lease agreement. Both must show the same address.",
              },
              {
                step: 5,
                title: "TLSAE completion certificate",
                detail:
                  "Your official completion certificate from the approved TLSAE provider. Keep the original — do not just screenshot it on your phone.",
              },
              {
                step: 6,
                title: "Parent or guardian — in person",
                detail:
                  "If you are under 18, a parent or legal guardian must be physically present to sign your application. They need their own valid ID.",
              },
              {
                step: 7,
                title: "Pass the knowledge test",
                detail:
                  "50 questions: 40 road rules + 10 road signs. You need 40 correct (80%) to pass. Practice on Ace Your Permit before you go — it covers the exact FLHSMV test format.",
              },
              {
                step: 8,
                title: "Pay the permit fee",
                detail:
                  "Pay the learner's license fee at the FLHSMV service center. Check flhsmv.gov for the current fee schedule before your appointment.",
              },
            ].map(({ step, title, detail }) => (
              <li
                key={step}
                className="flex gap-4 bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4"
              >
                <label className="flex items-start gap-4 w-full cursor-default">
                  <span className="mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      disabled
                      aria-label={`Step ${step}: ${title}`}
                      className="w-5 h-5 mt-0.5 accent-blue-600"
                    />
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold text-gray-900 text-base block mb-1">
                      {step}. {title}
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{detail}</span>
                  </span>
                </label>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* GDL rules */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Florida teen driver rules — permit through full license
          </h2>
          <p className="text-gray-600 mb-10">
            Getting the learner&apos;s license is step one. Here is the full Florida GDL roadmap.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-blue-600" />
                  While you have your learner&apos;s license
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>A licensed driver aged 21+ must be in the front passenger seat at all times</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Log all 50 supervised hours — keep a written or app-based log</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>10 of those 50 hours must be at night</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Hold the learner&apos;s license for at least 12 months (if under 18) before the driving test</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-orange-500" />
                  After you get your restricted license (16–17)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Curfew:</strong> No driving 11 PM–6 AM during first 12 months of licensure
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passengers (first 12 mo):</strong> Max 1 non-household passenger under 18
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passengers (12–24 mo):</strong> Max 3 non-household passengers under 18
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero tolerance:</strong> BAC of 0.02% or higher = license suspension (under 21)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>No texting</strong> while driving — applies to all Florida drivers
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample practice questions */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Practice questions — Florida GDL edition
          </h2>
          <p className="text-gray-600 mb-8">
            These are real questions from the Florida permit test. Know them cold before you walk in.
          </p>

          <div className="space-y-6">
            {sampleQuestions.map((q, qi) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-900 text-base">
                    Q{qi + 1}. {q.question}
                  </p>
                </div>
                <div className="px-6 py-4 grid sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm border ${
                        oi === q.correctIndex
                          ? "bg-green-50 border-green-300 text-green-800 font-semibold"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          oi === q.correctIndex
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                    <strong className="text-blue-700">Explanation:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Practice the full 50-question Florida format on Ace Your Permit — free.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice All FL GDL Questions Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Florida teen permit — FAQs
          </h2>
          <p className="text-gray-600 mb-8">Straight answers. No extra fluff.</p>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-gray-900 marker:content-none list-none">
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

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
            Ready to ace the Florida written test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ace Your Permit has the full 50-question Florida format — road rules and road signs —
            free to practice, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-12">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600 text-lg px-8 h-12">
                Learn More About Ace Your Permit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
          <p className="text-center text-gray-600 text-sm">
            &copy; 2026 Ace Your Permit. All rights reserved. Not affiliated with the Florida Highway
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
    </div>
  );
}
