/**
 * SEO Landing Page: /california-teen-permit-15-years-old
 *
 * Primary keyword:   "california teen permit 15 years old"
 * Secondary:         "california learners permit at 15", "california permit age",
 *                    "california provisional permit 15.5", "ca dmv teen permit requirements"
 *
 * NOTE: force-light-theme applied via wrapper class.
 *
 * TODO: California question bank: pending manual import from licensed source (CA DMV handbook 2024).
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
  title: "How to Get Your California Permit at 15.5 | DriveMaster",
  description:
    "Can you get your learners permit at 15 in California? Yes — at 15 and a half. Here's every requirement, document, driver ed rule, and GDL restriction explained for CA teens.",
  alternates: {
    canonical: "https://aceyourpermit.com/california-teen-permit-15-years-old",
  },
  openGraph: {
    title: "How to Get Your California Permit at 15.5 | DriveMaster",
    description:
      "Step-by-step guide to California teen permits. Minimum age 15.5, 30hr driver ed, 6hr behind-the-wheel, provisional license rules — all in one place.",
    url: "https://aceyourpermit.com/california-teen-permit-15-years-old",
    type: "article",
  },
};

// ---------------------------------------------------------------------------
// Sample questions — general GDL knowledge consistent with CA DMV handbook.
// ---------------------------------------------------------------------------
const sampleQuestions = [
  {
    id: "ca-is-001",
    question: "What is the minimum age to obtain a California provisional instruction permit?",
    options: ["15 years and 6 months", "15 years old", "16 years old", "14 years old"],
    correctIndex: 0,
    explanation:
      "In California, you must be at least 15 years and 6 months old (15.5) to apply for a provisional instruction permit.",
  },
  {
    id: "ca-is-005",
    question: "How many hours of professional behind-the-wheel training must a California teen complete before getting a provisional license?",
    options: ["6 hours", "10 hours", "3 hours", "15 hours"],
    correctIndex: 0,
    explanation:
      "California requires 6 hours of behind-the-wheel training with a licensed driving instructor, in addition to 30 hours of driver education.",
  },
  {
    id: "ca-ad-002",
    question: "What is the legal BAC limit for drivers under 21 in California?",
    options: ["0.01%", "0.02%", "0.05%", "0.08%"],
    correctIndex: 0,
    explanation:
      "California's zero-tolerance law sets the legal BAC limit at 0.01% for drivers under 21 — effectively zero. Any detectable alcohol can result in a suspended license.",
  },
];

const faqItems = [
  {
    question: "Can I get my permit at 15 in California?",
    answer:
      "Not quite at 15 — you must be at least 15 years and 6 months old (15.5) to apply for a California provisional instruction permit. You also need to complete 30 hours of driver education before applying.",
  },
  {
    question: "What do I need to bring to the CA DMV for my permit at 15.5?",
    answer:
      "You need: (1) proof of your age and identity (birth certificate or passport), (2) your Social Security number, (3) proof of California residency (parent's utility bill or bank statement works), (4) proof of completed 30-hour driver education course, and (5) a parent or guardian's signature on the application. A $33 fee (verify at dmv.ca.gov) is required.",
  },
  {
    question: "What driver education is required before getting a California permit?",
    answer:
      "You must complete 30 hours of driver education — either in-class at a licensed driving school or an approved online course. After getting your permit, you then need 6 hours of professional behind-the-wheel training with a licensed instructor.",
  },
  {
    question: "How many hours must I practice with my permit before the driving test?",
    answer:
      "50 total hours of supervised practice driving — and at least 10 of those hours must be at night. A parent, guardian, or licensed driver aged 25 or older must be in the front passenger seat.",
  },
  {
    question: "What are the restrictions for California teen drivers?",
    answer:
      "For the first 12 months after getting your provisional license (or until you turn 18): no driving between 11 PM and 5 AM; no passengers under 20 unless a licensed driver 25+ is in the vehicle. Exceptions apply for work, school, and medical necessity.",
  },
  {
    question: "Can a parent supervise my driving practice in California?",
    answer:
      "Yes. A parent or guardian can supervise. A non-parent can also supervise as long as they are at least 25 years old and hold a valid California driver's license, with your parent's permission.",
  },
  {
    question: "What's the drinking-and-driving law for teens in California?",
    answer:
      "California's zero-tolerance law sets the BAC limit at 0.01% for drivers under 21. Even a trace amount of alcohol can result in a suspended license, a fine, and a mandatory education program.",
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
  headline: "How to Get Your California Permit at 15.5",
  description:
    "A complete guide to California GDL requirements for teens: minimum age 15.5, driver education hours, behind-the-wheel training, provisional license restrictions, and BAC limits.",
  author: {
    "@type": "Organization",
    name: "DriveMaster",
  },
  publisher: {
    "@type": "Organization",
    name: "DriveMaster",
    url: "https://aceyourpermit.com",
  },
  dateModified: "2026-04-22",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CaliforniaTeenPermit15Page() {
  return (
    <div className="force-light min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
            <span className="text-xl font-bold text-gray-900">DriveMaster</span>
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
            California Graduated Driver Licensing (GDL) — 2026 Guide
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight leading-tight">
            How to Get Your California Permit at 15
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Short answer: you can get your provisional instruction permit at 15 and a half (15.5) in California —
            but you need to complete 30 hours of driver education first. Here&apos;s everything you
            need to know, from the docs you bring to the DMV to the 50-hour practice log you fill out
            before your behind-the-wheel test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice CA Permit Questions Free
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
            { label: "Minimum permit age", value: "15.5", sub: "15 yrs + 6 months" },
            { label: "Driver ed required", value: "30 hrs", sub: "before permit" },
            { label: "Behind-the-wheel", value: "6 hrs", sub: "with licensed instructor" },
            { label: "Supervised practice", value: "50 hrs", sub: "10 must be at night" },
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
            How old do you have to be to get a permit in California?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 font-display text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  With driver&apos;s ed (30 hours)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 font-display mb-2">15.5</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As soon as you turn 15 years and 6 months old and complete 30 hours of driver
                  education, you can apply for your provisional instruction permit at a California DMV office.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 font-display text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Without completing driver&apos;s ed first
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-500 font-display mb-2">17.5</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  If you skip driver&apos;s ed, you must wait until you are 17 years and 6 months.
                  That&apos;s two extra years of waiting. Driver&apos;s ed is worth it.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-800 text-sm font-medium leading-relaxed">
              <strong>California GDL (Graduated Driver Licensing)</strong> is designed so teens
              build skills in stages — driver ed first, then a permit, then 50 hours of supervised practice,
              then a behind-the-wheel test, then a provisional license. The earlier you start driver ed,
              the sooner you can get your permit at 15.5.
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
              California Teen Permit Checklist
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Everything you need before and on the day of your CA DMV permit visit.
          </p>

          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Complete 30 hours of driver education",
                detail:
                  "You must finish a state-approved 30-hour driver education course before you can apply for your permit. Your high school may offer one, or you can complete an approved online course. You will receive a certificate of completion — keep it.",
              },
              {
                step: 2,
                title: "Turn 15 years and 6 months old",
                detail:
                  "California's minimum permit age is exactly 15 years + 6 months. The DMV will verify your birthdate — there is no exception for being 'almost 15.5'.",
              },
              {
                step: 3,
                title: "Proof of age and identity",
                detail:
                  "Original birth certificate, U.S. passport, or other acceptable government-issued document showing your full legal name and date of birth.",
              },
              {
                step: 4,
                title: "Social Security number",
                detail:
                  "Your Social Security card or a document showing your full SSN. The DMV verifies it electronically.",
              },
              {
                step: 5,
                title: "Proof of California residency",
                detail:
                  "A document showing your California address — a parent's utility bill, bank statement, or school document works. It must show your name or your parent/guardian's name and your current address.",
              },
              {
                step: 6,
                title: "Driver education completion certificate",
                detail:
                  "The official certificate from your driving school or approved online program confirming you completed the required 30 hours.",
              },
              {
                step: 7,
                title: "Parent or guardian — in person or on form",
                detail:
                  "A parent or legal guardian must sign the application form (DL 44). They can sign in person at the DMV or pre-sign a notarized form. Their valid ID is required.",
              },
              {
                step: 8,
                title: "Pass the CA DMV knowledge test",
                detail:
                  "46 questions from the California Driver Handbook. You need at least 38 correct (about 83%) to pass. Practice here on DriveMaster before you go.",
              },
              {
                step: 9,
                title: "Pass the vision exam",
                detail:
                  "The DMV will test your vision at the office. If you wear glasses or contacts, bring them.",
              },
              {
                step: 10,
                title: "Pay the permit fee",
                detail:
                  "Approximately $33 (verify the current amount at dmv.ca.gov before your appointment). This covers the knowledge test and permit issuance.",
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
            California teen driver rules — permit through license
          </h2>
          <p className="text-gray-600 mb-10">
            Getting the permit is step one. Here is the full California GDL roadmap.
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
                    <span>A licensed driver aged 25+ must be in the front passenger seat at all times</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Log all 50 supervised hours — 10 must be at night</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Complete 6 hours of behind-the-wheel training with a licensed instructor</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Hold the permit for at least 6 months before your behind-the-wheel test</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-orange-500" />
                  After you get your provisional license (under 18)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Curfew:</strong> No driving between 11 PM and 5 AM during the first 12 months
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passengers:</strong> No passengers under 20 for first 12 months unless a licensed driver 25+ is present
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>No phone use</strong> of any kind — hands-free included — until age 18
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>BAC 0.01%</strong> — effectively zero tolerance applies until you turn 21
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
            Practice questions — California GDL edition
          </h2>
          <p className="text-gray-600 mb-8">
            These are real-format questions from the California DMV knowledge test. Know them cold before you walk in.
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
              Want more California permit practice questions?
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice All CA GDL Questions Free
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
            California teen permit — FAQs
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
            Ready to ace the California written test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            DriveMaster is built for teens getting their first permit — free to start,
            California-specific, and way less boring than reading the DMV handbook.
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
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </div>
          <p className="text-center text-gray-600 text-sm">
            &copy; 2026 DriveMaster. All rights reserved. Not affiliated with the California
            Department of Motor Vehicles. Always verify requirements at{" "}
            <a
              href="https://www.dmv.ca.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              dmv.ca.gov
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
