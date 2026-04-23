/**
 * SEO Landing Page: /pennsylvania-teen-permit-16-years-old
 *
 * Primary keyword:   "pennsylvania teen permit 16 years old"
 * Secondary:         "pa learners permit at 16", "pennsylvania permit requirements",
 *                    "penndot junior license requirements", "pa permit test age 16"
 * Angle:             Step-by-step guide for 16-year-olds getting a PA junior license permit.
 *
 * PA-specific facts:
 *   - Minimum age 16 for learner's permit
 *   - Form DL-180 required with parental consent
 *   - 65 hours supervised practice (10 at night, 5 adverse weather) for junior license
 *   - PennDOT administers (not a DMV)
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

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "How to Get Your Pennsylvania Permit at 16 | DriveMaster",
  description:
    "Can you get your learner's permit at 16 in Pennsylvania? Yes — here's every PennDOT requirement, document (including Form DL-180), and GDL rule for teens. Updated 2026.",
  alternates: {
    canonical: "https://getdrivemaster.com/pennsylvania-teen-permit-16-years-old",
  },
  openGraph: {
    title: "How to Get Your Pennsylvania Permit at 16 | DriveMaster",
    description:
      "Step-by-step guide to Pennsylvania teen permits. Minimum age 16, Form DL-180 parental consent, 65-hour driving log, curfew rules — all in one place.",
    url: "https://getdrivemaster.com/pennsylvania-teen-permit-16-years-old",
    type: "article",
  },
};

// ─── Sample questions ─────────────────────────────────────────────────────────

const sampleQuestions = [
  {
    id: "pa-gdl-001",
    question: "What is the minimum age to obtain a Pennsylvania learner's permit?",
    options: ["16 years old", "15 years old", "17 years old", "15.5 years old"],
    correctIndex: 0,
    explanation:
      "In Pennsylvania, you must be at least 16 years old to obtain a learner's permit. You will need to pass the PennDOT written knowledge test (18 questions, 83% to pass) and submit Form DL-180 with parental consent.",
  },
  {
    id: "pa-gdl-002",
    question: "How many total hours of supervised driving practice are required in Pennsylvania before getting a junior license?",
    options: ["65 hours", "50 hours", "40 hours", "30 hours"],
    correctIndex: 0,
    explanation:
      "Pennsylvania requires 65 hours of supervised driving — including at least 10 hours at night and 5 hours in adverse weather conditions — before you can apply for a junior driver's license.",
  },
  {
    id: "pa-gdl-003",
    question: "What form is required for a Pennsylvania teen permit with parental consent?",
    options: ["Form DL-180", "Form DL-80", "Form SR-22", "Form DL-123"],
    correctIndex: 0,
    explanation:
      "Form DL-180 is the Pennsylvania Parental Consent / Learner's Permit application form. A parent or legal guardian must sign it for applicants under 18.",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Can I get my permit at 16 in Pennsylvania?",
    answer:
      "Yes — 16 is the minimum age for a Pennsylvania learner's permit. You must pass the PennDOT written knowledge test (18 questions, 83% to pass) and submit Form DL-180 signed by a parent or guardian.",
  },
  {
    question: "What do I need to bring to PennDOT for my permit at 16?",
    answer:
      "You need: (1) proof of age and identity (birth certificate or passport), (2) your Social Security card or number, (3) proof of Pennsylvania residency (parent's utility bill or lease agreement), and (4) Form DL-180 signed by a parent or guardian. A parent must be present.",
  },
  {
    question: "What is Form DL-180?",
    answer:
      "Form DL-180 is the PennDOT Learner's Permit application. For applicants under 18, it includes a parental consent section that a parent or legal guardian must sign. You can download it from dmv.pa.gov or pick it up at a PennDOT Driver License Center.",
  },
  {
    question: "How many hours do I have to drive before I can get my junior license?",
    answer:
      "65 total hours of supervised driving — at least 10 of those must be at night and at least 5 must be in adverse weather conditions. You must also hold your permit for at least 6 months before applying for the junior license.",
  },
  {
    question: "What are the curfew rules for Pennsylvania teen drivers?",
    answer:
      "Junior license holders (under 18) cannot drive between 11 PM and 5 AM unless accompanied by a licensed driver 21 or older, driving to or from work, or in case of an emergency.",
  },
  {
    question: "What is the passenger restriction for Pennsylvania junior license holders?",
    answer:
      "During the first 6 months of your junior license, you may not carry more than one passenger under 18 unless they are a family member. After 6 months, you may carry up to three passengers under 18.",
  },
  {
    question: "What is the zero-tolerance alcohol policy for Pennsylvania teens?",
    answer:
      "Pennsylvania has a zero-tolerance policy. If you are under 21, any detectable alcohol in your system (BAC above 0.00%) while driving is illegal and results in an automatic license suspension.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Get Your Pennsylvania Permit at 16",
  description:
    "A complete guide to Pennsylvania GDL requirements for teens: minimum age 16, Form DL-180 parental consent, 65-hour supervised driving log, curfew rules, and zero-tolerance BAC.",
  author: { "@type": "Organization", name: "DriveMaster" },
  publisher: { "@type": "Organization", name: "DriveMaster", url: "https://getdrivemaster.com" },
  dateModified: "2026-04-22",
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PennsylvaniaTeenPermit16Page() {
  return (
    <div className="force-light-theme min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DriveMaster</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="ghost" className="h-11">Sign In</Button></Link>
            <Link href="/signup"><Button className="bg-blue-600 hover:bg-blue-700 h-11">Start Free</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Pennsylvania Graduated Driver Licensing (GDL) — 2026 Guide
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight leading-tight">
            How to Get Your Pennsylvania Permit at 16
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Short answer: yes, you can get your learner&apos;s permit at 16 — you&apos;ll
            need to pass the PennDOT written knowledge test and submit Form DL-180 with
            parental consent. Here&apos;s everything, from the docs you bring on day one
            to the 65-hour log you fill before your road test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice PA Permit Questions Free
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
            { label: "Minimum age", value: "16", sub: "no driver's ed required" },
            { label: "Permit hold time", value: "6 mo", sub: "minimum before junior license" },
            { label: "Supervised hours", value: "65 hrs", sub: "10 night, 5 adverse weather" },
            { label: "BAC limit under 21", value: "0.00%", sub: "zero tolerance" },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-blue-600 font-display tracking-tight mb-0.5">{value}</div>
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
            How old do you have to be to get a permit in Pennsylvania?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 font-display text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Standard minimum age
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 font-display mb-2">16</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As soon as you turn 16 you can apply for your Pennsylvania learner&apos;s
                  permit at a PennDOT Driver License Center — no driver&apos;s ed enrollment
                  required, just the written knowledge test and Form DL-180.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 font-display text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Junior license (next step)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-500 font-display mb-2">16 + 6 mo</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  After holding your permit for 6 months and completing 65 hours of supervised
                  driving, you can apply for a Pennsylvania junior driver&apos;s license.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-800 text-sm font-medium leading-relaxed">
              <strong>Pennsylvania GDL (Graduated Driver Licensing)</strong> is a three-stage
              system: learner&apos;s permit → junior license → full license. The earlier you
              start your 65 practice hours, the sooner you can drive solo.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
              Pennsylvania Teen Permit Checklist
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Everything you need to bring to a PennDOT Driver License Center on permit day.
          </p>

          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Complete Form DL-180 with parental signature",
                detail:
                  "Download Form DL-180 from dmv.pa.gov or pick it up at a PennDOT Driver License Center. A parent or legal guardian must sign the parental consent section. Do not fill in the signature fields before you arrive — some locations require the parent to sign in front of a PennDOT employee.",
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
                  "Your Social Security card or a document showing your full SSN (tax record, W-2). PennDOT verifies it electronically.",
              },
              {
                step: 4,
                title: "Two proofs of Pennsylvania residency",
                detail:
                  "Two documents showing your Pennsylvania address — a parent's utility bill, bank statement, or lease agreement work. Both must show the same address.",
              },
              {
                step: 5,
                title: "Parent or guardian — in person",
                detail:
                  "A parent or legal guardian must be physically present at the Driver License Center to sign Form DL-180. They will also need their own valid ID.",
              },
              {
                step: 6,
                title: "Pass the PennDOT written knowledge test",
                detail:
                  "18 questions drawn from the Pennsylvania Driver's Manual (PUB 95). You need 15 correct (83%) to pass. Practice here on DriveMaster before you go.",
              },
              {
                step: 7,
                title: "Pass the vision screening",
                detail:
                  "PennDOT conducts a basic vision screening at the Driver License Center. If you wear glasses or contacts, bring them.",
              },
              {
                step: 8,
                title: "Pay the permit fee",
                detail:
                  "PennDOT charges a fee for the learner's permit. Check the current fee schedule at dmv.pa.gov before your appointment.",
              },
            ].map(({ step, title, detail }) => (
              <li key={step} className="flex gap-4 bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
                <label className="flex items-start gap-4 w-full cursor-default">
                  <span className="mt-0.5 flex-shrink-0">
                    <input type="checkbox" disabled aria-label={`Step ${step}: ${title}`} className="w-5 h-5 mt-0.5 accent-blue-600" />
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold text-gray-900 text-base block mb-1">{step}. {title}</span>
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
            Pennsylvania teen driver rules — permit through junior license
          </h2>
          <p className="text-gray-600 mb-10">Getting the permit is step one. Here is the full GDL roadmap.</p>

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
                    <span>A licensed driver aged 21+ must be in the front passenger seat at all times</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Log all 65 supervised hours — keep a written or app-based log</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>10 of those hours must be at night; 5 must be in adverse weather</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Hold the permit for at least 6 months before applying for a junior license</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-orange-500" />
                  After you get your junior license
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Curfew:</strong> No driving 11 PM–5 AM unless accompanied by a 21+ licensed driver, driving to/from work, or an emergency</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Passengers:</strong> Max 1 passenger under 18 for first 6 months (immediate family excluded)</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>No phone use</strong> of any kind while driving — hands-free included — for all junior license holders</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span><strong>BAC 0.00%</strong> — zero tolerance applies until you turn 21</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">Practice questions — GDL edition</h2>
          <p className="text-gray-600 mb-8">Real-format questions from the Pennsylvania permit test. Know them cold before you walk in.</p>

          <div className="space-y-6">
            {sampleQuestions.map((q, qi) => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <p className="font-semibold text-gray-900 text-base">Q{qi + 1}. {q.question}</p>
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
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${oi === q.correctIndex ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
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
            <p className="text-gray-600 mb-4">Ready for the full PennDOT practice bank?</p>
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice All GDL Questions Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">Pennsylvania teen permit — FAQs</h2>
          <p className="text-gray-600 mb-8">Straight answers. No extra fluff.</p>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-xl border border-gray-200 bg-white shadow-sm open:shadow-md transition-shadow">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-gray-900 marker:content-none list-none">
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="ml-auto shrink-0 text-orange-500 text-xl font-bold leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
            Ready to ace the PennDOT written test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            DriveMaster is built for Pennsylvania teens — gamified streaks, Dash coaching, and
            practice questions based on the PA Driver&apos;s Manual (PUB 95). Free to start.
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
                Learn More About DriveMaster
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
            <span className="text-lg font-bold text-gray-900">DriveMaster</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          </div>
          <p className="text-center text-gray-600 text-sm">
            &copy; 2026 DriveMaster. All rights reserved. Not affiliated with PennDOT or
            the Commonwealth of Pennsylvania. Always verify requirements at{" "}
            <a href="https://www.dmv.pa.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              dmv.pa.gov
            </a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
