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
  title: "How to Get Your Illinois Permit at 15 | DriveMaster",
  description:
    "Can you get your learners permit at 15 in Illinois? Yes — if you're in driver's ed. Here's every requirement, document, and GDL rule explained for teens.",
  alternates: {
    canonical: "https://drivemaster.app/illinois-teen-permit-15-years-old",
  },
  openGraph: {
    title: "How to Get Your Illinois Permit at 15 | DriveMaster",
    description:
      "Step-by-step guide to Illinois teen permits. Minimum age, required docs, 50-hour log, curfew rules, and zero-tolerance BAC — all in one place.",
    url: "https://drivemaster.app/illinois-teen-permit-15-years-old",
    type: "article",
  },
};

// ---------------------------------------------------------------------------
// Sample questions pulled from lib/data/questions/illinois-dmv-questions.ts
// IDs: il-is-001, il-is-005, il-ad-002
// ---------------------------------------------------------------------------
const sampleQuestions = [
  {
    id: "il-is-001",
    question: "What is the minimum age to obtain an Illinois instruction permit?",
    options: ["15 years old", "16 years old", "14 years old", "15.5 years old"],
    correctIndex: 0,
    explanation:
      "In Illinois, you must be at least 15 years old to obtain an instruction permit — but only if you are enrolled in a state-approved driver's ed course.",
  },
  {
    id: "il-is-005",
    question: "What are the nighttime driving restrictions for drivers under 18 in Illinois?",
    options: [
      "No driving Sunday–Thursday 10 PM–6 AM, Friday–Saturday 11 PM–6 AM",
      "No restrictions",
      "No driving after 8 PM",
      "No driving midnight–5 AM",
    ],
    correctIndex: 0,
    explanation:
      "During the first 12 months of licensing (or until age 18), new drivers cannot drive Sunday–Thursday 10 PM–6 AM and Friday–Saturday 11 PM–6 AM.",
  },
  {
    id: "il-ad-002",
    question: "What is the legal BAC limit for drivers under 21 in Illinois?",
    options: ["0.00%", "0.02%", "0.05%", "0.08%"],
    correctIndex: 0,
    explanation:
      "Illinois has a zero-tolerance policy. If you are under 21, any detectable amount of alcohol in your system is illegal — the limit is 0.00%.",
  },
];

const faqItems = [
  {
    question: "Can I get my permit at 15 in Illinois?",
    answer:
      "Yes — if you are enrolled in a state-approved driver's education course. Without driver's ed, the minimum age jumps to 17 years and 3 months. Enroll in driver's ed first and you unlock the permit at 15.",
  },
  {
    question: "What do I need to bring to the DMV for my permit at 15?",
    answer:
      "You need: (1) proof of your age and identity (birth certificate or passport), (2) your Social Security card or number, (3) proof of Illinois residency (parent's utility bill works), (4) proof of school enrollment with satisfactory attendance, and (5) your driver's ed enrollment certificate. A parent or guardian must be present to sign.",
  },
  {
    question: "Do I have to take driver's ed to get a permit at 15?",
    answer:
      "Yes. If you want your permit before age 17 years and 3 months, driver's ed is required. The course must be state-approved. Your school may offer one, or you can find a private driving school.",
  },
  {
    question: "How many hours do I have to drive with my permit before I can take the driving test?",
    answer:
      "50 total hours of supervised driving — and at least 10 of those must be at night. Your parent, guardian, or other licensed adult (21+) must be in the front seat. Log every session because the SOS can ask for proof.",
  },
  {
    question: "What's the curfew for teen drivers in Illinois?",
    answer:
      "During your first 12 months of licensing (or until you turn 18), you cannot drive Sunday through Thursday between 10 PM and 6 AM, or Friday through Saturday between 11 PM and 6 AM. Exceptions exist for driving to/from work or school activities.",
  },
  {
    question: "Can my parent or a family friend supervise my driving?",
    answer:
      "Your parent or legal guardian can always supervise. A non-parent adult can supervise too — they just need to be at least 21 years old and hold a valid Illinois driver's license, with your parent's permission.",
  },
  {
    question: "What's the drinking-and-driving law for teens in Illinois?",
    answer:
      "Zero tolerance. If you are under 21, your legal BAC limit is 0.00% — not 0.02% or 0.05%, literally zero. Even one drink can get your license suspended and put a DUI on your record.",
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
  headline: "How to Get Your Illinois Permit at 15",
  description:
    "A complete guide to Illinois GDL requirements for teens: minimum age, permit documents, supervised driving hours, curfew rules, and zero-tolerance BAC.",
  author: {
    "@type": "Organization",
    name: "DriveMaster",
  },
  publisher: {
    "@type": "Organization",
    name: "DriveMaster",
    url: "https://drivemaster.app",
  },
  dateModified: "2026-04-21",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function IllinoisTeenPermit15Page() {
  return (
    <div className="force-light-theme min-h-screen bg-gradient-to-b from-blue-50 to-white">
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

      {/* Hero */}
      <header className="pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Illinois Graduated Driver Licensing (GDL) — 2026 Guide
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 font-display tracking-tight leading-tight">
            How to Get Your Illinois Permit at 15
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Short answer: yes, you can get your learners permit at 15 — but only if you are
            enrolled in a state-approved driver&apos;s ed course. Here&apos;s everything you
            need to know, from the docs you bring on day one to the 50-hour log you fill out
            before your road test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice IL Permit Questions Free
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

      {/* ------------------------------------------------------------------ */}
      {/* Quick-stat bar                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Minimum age", value: "15", sub: "with driver's ed" },
            { label: "Permit hold time", value: "9 mo", sub: "minimum before license" },
            { label: "Supervised hours", value: "50 hrs", sub: "10 must be at night" },
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

      {/* ------------------------------------------------------------------ */}
      {/* Age eligibility                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display tracking-tight">
            How old do you have to be to get a permit in Illinois?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-blue-200 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-700 font-display text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  With driver&apos;s ed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 font-display mb-2">15</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  As soon as you turn 15 and are enrolled in a state-approved driver&apos;s
                  education course, you can apply for your instruction permit at an Illinois
                  Secretary of State facility.
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
                <p className="text-4xl font-bold text-gray-500 font-display mb-2">17 + 3 mo</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  If you skip driver&apos;s ed, you have to wait until you are 17 years and
                  3 months old. That&apos;s almost a full year later. Driver&apos;s ed is worth it.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-orange-800 text-sm font-medium leading-relaxed">
              <strong>Illinois GDL (Graduated Driver Licensing)</strong> is designed so teens
              build skills in stages — permit first, then a limited license, then a full license.
              The earlier you start, the more time you have to log your 50 practice hours before
              your friends even think about scheduling their road test.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Checklist                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="checklist"
        className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight">
              Illinois Teen Permit Checklist
            </h2>
          </div>
          <p className="text-gray-600 mb-8">
            Everything you need to bring to the Secretary of State facility on permit day.
            Check each one off before you leave the house.
          </p>

          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Enroll in a state-approved driver's ed course",
                detail:
                  "You cannot apply at 15 without this. Your school's driver's ed counts, or find a licensed private driving school. You will receive an enrollment certificate — do not lose it.",
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
                  "Your Social Security card or a document showing your full SSN (tax record, W-2). The SOS will verify it electronically.",
              },
              {
                step: 4,
                title: "Proof of Illinois residency",
                detail:
                  "Two documents showing your Illinois address — a parent's utility bill, bank statement, or lease agreement works. Both must show the same address.",
              },
              {
                step: 5,
                title: "Proof of school enrollment + satisfactory attendance",
                detail:
                  "Illinois requires a certificate from your school confirming you are currently enrolled and have satisfactory attendance. Ask your school counselor — they know exactly what form to give you.",
              },
              {
                step: 6,
                title: "Driver's ed enrollment certificate",
                detail:
                  "The official document from your driving school or school district confirming you are enrolled in a state-approved course.",
              },
              {
                step: 7,
                title: "Parent or guardian — in person",
                detail:
                  "A parent or legal guardian must be physically present at the facility to sign your application. They will also need their own valid ID.",
              },
              {
                step: 8,
                title: "Pass the written knowledge test",
                detail:
                  "35 questions drawn from the Illinois Rules of the Road handbook. You need 28 correct (80%) to pass. Practice here on DriveMaster before you go.",
              },
              {
                step: 9,
                title: "Pay the permit fee",
                detail:
                  "The instruction permit fee is a small amount paid at the SOS facility. Check the current Illinois SOS fee schedule before your appointment.",
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

      {/* ------------------------------------------------------------------ */}
      {/* GDL rules after you get the permit                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Illinois teen driver rules — permit through license
          </h2>
          <p className="text-gray-600 mb-10">
            Getting the permit is step one. Here is the full GDL roadmap so you know exactly
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
                    <span>
                      A licensed driver aged 21+ must be in the front seat at all times
                    </span>
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
                    <span>Hold the permit for at least 9 months before your road test</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Complete the required classroom and behind-the-wheel driver&apos;s ed hours</span>
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
                      <strong>Curfew:</strong> No driving Sun–Thu 10 PM–6 AM or Fri–Sat 11 PM–6 AM
                      during your first 12 months
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Passengers:</strong> Max 1 passenger under 20 for first 12 months
                      (siblings excluded)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>No phone use</strong> of any kind while driving — hands-free included
                      — until age 19
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>BAC 0.00%</strong> — zero tolerance applies until you turn 21
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Sample practice questions                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Practice questions — GDL edition
          </h2>
          <p className="text-gray-600 mb-8">
            These are real questions from the Illinois permit test. Know them cold before you walk in. 🎯
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
              There are 3,400+ more where those came from.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8 h-12">
                Practice All GDL Questions Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FAQ                                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            Illinois teen permit — FAQs
          </h2>
          <p className="text-gray-600 mb-8">
            Straight answers. No extra fluff.
          </p>

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

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
            Ready to ace the written test?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            DriveMaster is built for Illinois teens — not adults cramming for a
            secondary license. Free to start, Illinois-specific, and way less boring than the handbook.
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
            © 2026 DriveMaster. All rights reserved. Not affiliated with the Illinois Secretary
            of State. Always verify requirements at{" "}
            <a
              href="https://www.ilsos.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ilsos.gov
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
