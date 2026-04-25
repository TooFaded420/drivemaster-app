/**
 * SEO Landing Page: /texas-teen-permit-15-years-old
 *
 * Primary keyword:   "texas permit at 15"
 * Secondary:         "texas learners permit 15 year old", "how to get texas permit under 16",
 *                    "texas graduated driver license teen", "texas parent taught driver ed"
 * Angle:             Authoritative GDL guide for Texas teens + parent-taught option.
 *
 * TX facts:
 *  - Agency: Texas DPS (not DMV)
 *  - Learner permit (Instruction Permit) available at 15 with approved driver's ed
 *  - Texas allows parent-taught driver education (PTDE) — unique vs most states
 *  - 6-hour ITTD (Impact Texas Teen Drivers) course required before license issuance
 *  - Must hold permit 6 months (180 days) before road test
 *  - 30 questions, 70% to pass
 *  - Zero tolerance BAC for under 21
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

export const metadata: Metadata = {
  title: "How to Get Your Texas Permit at 15 | Ace Your Permit",
  description:
    "Can you get your learner's permit at 15 in Texas? Yes — with approved driver's ed or parent-taught PTDE. Here's every requirement, document, and GDL rule explained for Texas teens.",
  alternates: {
    canonical: "https://aceyourpermit.com/texas-teen-permit-15-years-old",
  },
  openGraph: {
    title: "How to Get Your Texas Permit at 15 | Ace Your Permit",
    description:
      "Step-by-step guide to Texas teen permits. Minimum age, required docs, parent-taught option, ITTD course, curfew rules, and zero-tolerance BAC — all in one place.",
    url: "https://aceyourpermit.com/texas-teen-permit-15-years-old",
    type: "article",
  },
};

// ---------------------------------------------------------------------------
// Sample questions (illustrative — based on publicly available TX Driver Handbook)
// ---------------------------------------------------------------------------
const sampleQuestions = [
  {
    id: "tx-is-001",
    question: "What is the minimum age to obtain a Texas Instruction Permit?",
    options: ["15 years old", "16 years old", "14 years old", "15.5 years old"],
    correctIndex: 0,
    explanation:
      "In Texas, you must be at least 15 years old to obtain an Instruction Permit — and you must be enrolled in an approved driver education course (in-school, private, or parent-taught PTDE).",
  },
  {
    id: "tx-is-005",
    question: "How long must a Texas teen hold an Instruction Permit before taking the road test?",
    options: [
      "At least 6 months (180 days)",
      "At least 3 months",
      "At least 9 months",
      "No minimum — test any time",
    ],
    correctIndex: 0,
    explanation:
      "Texas requires teens under 18 to hold an Instruction Permit for at least 6 months (180 days) and complete all required supervised driving hours before taking the road skills test.",
  },
  {
    id: "tx-ad-002",
    question: "What is the legal BAC limit for drivers under 21 in Texas?",
    options: ["0.00% — any detectable amount", "0.02%", "0.05%", "0.08%"],
    correctIndex: 0,
    explanation:
      "Texas has a zero-tolerance policy for drivers under 21. Any detectable amount of alcohol is illegal — the Minor Alcohol Statute (MAS) means even one drink can result in a DUI charge.",
  },
];

const faqItems = [
  {
    question: "Can I get my permit at 15 in Texas?",
    answer:
      "Yes — if you are enrolled in an approved driver education course. Texas accepts in-school driver's ed, private driving schools, and parent-taught driver education (PTDE). Without any driver's ed, the minimum age for a regular license is 18.",
  },
  {
    question: "What is the parent-taught driver education (PTDE) option in Texas?",
    answer:
      "Texas is one of the few states that allows a parent or step-parent to teach their teen to drive through the state's PTDE program. The parent must purchase an approved PTDE course, complete a 6-hour parent orientation, and teach the full behind-the-wheel curriculum. The teen still takes the same DPS knowledge test and road skills test.",
  },
  {
    question: "What do I need to bring to the DPS office for my permit at 15?",
    answer:
      "You need: (1) proof of age and identity (birth certificate or passport), (2) your Social Security number, (3) proof of Texas residency (two documents — a parent's utility bill works), (4) proof of school enrollment and satisfactory attendance, (5) your driver's ed enrollment certificate or PTDE completion certificate. A parent or guardian must be present to sign.",
  },
  {
    question: "How many hours do I have to drive with my permit in Texas?",
    answer:
      "At least 30 total hours of driving with a licensed adult aged 21+ in the front seat — and at least 10 of those hours must be at night. Your driving school or PTDE course logs these hours. Keep records because DPS can ask for proof.",
  },
  {
    question: "What is the ITTD course and is it required?",
    answer:
      "The Impact Texas Teen Drivers (ITTD) course is a mandatory 6-hour online course that every Texas teen must complete before they can receive their driver's license. It covers the dangers of distracted driving, impaired driving, and high-risk behaviors. It is free and available online at the Texas DPS website.",
  },
  {
    question: "What are the curfew rules for teen drivers in Texas?",
    answer:
      "During the first year of licensing (or until age 18), teen drivers may not drive after midnight and before 5 AM — with limited exceptions for driving to/from work, school activities, or emergencies. A licensed adult 21+ must accompany them during those hours.",
  },
  {
    question: "What's the drinking-and-driving law for Texas teens?",
    answer:
      "Zero tolerance. If you are under 21 in Texas, any detectable amount of alcohol in your system is illegal under the Minor Alcohol Statute. Your license will be suspended on the first offense — no exceptions.",
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
  headline: "How to Get Your Texas Permit at 15",
  description:
    "A complete guide to Texas GDL requirements for teens: minimum age, permit documents, parent-taught option, ITTD course, supervised driving hours, curfew rules, and zero-tolerance BAC.",
  author: {
    "@type": "Organization",
    name: "Ace Your Permit",
  },
  publisher: {
    "@type": "Organization",
    name: "Ace Your Permit",
    url: "https://aceyourpermit.com",
  },
  dateModified: "2026-04-22",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function TexasTeenPermit15Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
            Texas Graduated Driver Licensing (GDL) — 2026 Guide
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight leading-tight">
            How to Get Your Texas Permit at 15
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Short answer: yes, you can get your learner&apos;s permit at 15 in Texas — with approved
            driver&apos;s education or through the parent-taught (PTDE) program. Here&apos;s
            everything you need to know, from the docs you bring on day one to the 6-hour ITTD
            course you must finish before getting your license.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice TX Permit Questions Free
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
            { label: "Minimum age", value: "15", sub: "with driver's ed or PTDE" },
            { label: "Permit hold time", value: "6 mo", sub: "before road test" },
            { label: "Supervised hours", value: "30 hrs", sub: "10 must be at night" },
            { label: "BAC limit under 21", value: "0.00%", sub: "zero tolerance" },
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
            How old do you have to be to get a permit in Texas?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 font-display text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  With driver&apos;s ed or PTDE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 font-display mb-2">15</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As soon as you turn 15 and are enrolled in an approved driver&apos;s ed course
                  — or have begun the parent-taught (PTDE) program — you can apply for your
                  Texas Instruction Permit at a DPS Driver License office.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 font-display text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Without driver&apos;s ed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-500 font-display mb-2">18</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Without any driver&apos;s education, you must wait until age 18 to get a Texas
                  driver&apos;s license directly. Driver&apos;s ed or the PTDE program unlocks
                  the process 3 years earlier.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-800 text-sm font-medium leading-relaxed">
              <strong>Texas Parent-Taught Option:</strong> Texas is one of a handful of states
              that allows a parent or step-parent to teach their teen to drive at home. The PTDE
              program uses state-approved course materials. The teen still takes the official DPS
              knowledge test and road skills test — just with a parent as the instructor.
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
              Texas Teen Permit Checklist
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Everything you need to bring to the Texas DPS Driver License office on permit day.
            Check each one off before you leave the house.
          </p>

          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Enroll in a state-approved driver's ed course — or start PTDE",
                detail:
                  "Texas accepts in-school driver's ed, licensed private driving schools, and the parent-taught PTDE program. You will receive an enrollment or completion certificate — do not lose it.",
              },
              {
                step: 2,
                title: "Proof of age and identity",
                detail:
                  "Original or certified birth certificate, U.S. passport, or other government-issued ID showing your full legal name and date of birth.",
              },
              {
                step: 3,
                title: "Social Security number",
                detail:
                  "Your Social Security card or a document showing your full SSN. Texas DPS verifies it electronically.",
              },
              {
                step: 4,
                title: "Proof of Texas residency",
                detail:
                  "Two documents showing your Texas address — a parent's utility bill, bank statement, or lease agreement works. Both must show the same address.",
              },
              {
                step: 5,
                title: "Proof of school enrollment and satisfactory attendance",
                detail:
                  "Texas requires a certificate from your school confirming you are currently enrolled with satisfactory attendance. Ask your school counselor — they know exactly what form to provide.",
              },
              {
                step: 6,
                title: "Driver's ed enrollment certificate or PTDE certificate",
                detail:
                  "The official document from your driving school, school district, or PTDE provider confirming enrollment in a state-approved course.",
              },
              {
                step: 7,
                title: "Parent or guardian — in person",
                detail:
                  "A parent or legal guardian must be physically present at the DPS office to sign your application. They will also need their own valid ID.",
              },
              {
                step: 8,
                title: "Pass the written knowledge test",
                detail:
                  "30 questions drawn from the Texas Driver Handbook. You need 21 correct (70%) to pass. Practice here on Ace Your Permit before you go.",
              },
              {
                step: 9,
                title: "Pay the permit fee",
                detail:
                  "The Instruction Permit fee is paid at the DPS office. Check the current Texas DPS fee schedule before your appointment.",
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
            Texas teen driver rules — permit through license
          </h2>
          <p className="text-gray-600 mb-10">
            Getting the permit is step one. Here is the full Texas GDL roadmap so you know exactly
            what comes next.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-blue-600" />
                  While you have your permit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>A licensed driver aged 21+ must be in the front seat at all times</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Log all 30 supervised hours — keep a written or app-based log</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>10 of those 30 hours must be at night</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Hold the permit for at least 6 months (180 days) before your road test</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Complete the 6-hour ITTD (Impact Texas Teen Drivers) course — free online</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-orange-500" />
                  After you get your license (16-17)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Curfew:</strong> No driving between midnight and 5 AM during first year
                      (exceptions for work, school, emergencies)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passengers:</strong> No more than 1 passenger under 21 (not a family member)
                      during the first 12 months
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>No phone use</strong> of any kind while driving — Texas bans all handheld
                      device use for all drivers
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>BAC 0.00%</strong> — zero tolerance until you turn 21
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
            Practice questions — Texas GDL edition
          </h2>
          <p className="text-gray-600 mb-8">
            These are representative questions covering Texas GDL rules. Know them cold before you walk in.
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
              Ready to practice all the Texas permit test topics?
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice All TX GDL Questions Free
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
            Texas teen permit — FAQs
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
            Ready to ace the Texas written test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ace Your Permit is built for Texas teens — gamified streaks, Dash explanations, and
            questions aligned with the Texas Driver Handbook. Free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-12"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-600 text-lg px-8 h-12"
              >
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
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </div>
          <p className="text-center text-gray-600 text-sm">
            &copy; 2026 Ace Your Permit. All rights reserved. Not affiliated with the Texas Department
            of Public Safety. Always verify requirements at{" "}
            <a
              href="https://www.dps.texas.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              dps.texas.gov
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
