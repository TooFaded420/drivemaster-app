/**
 * SEO Landing Page: /new-york-teen-permit-16-years-old
 *
 * Primary keyword:   "new york teen permit 16 years old"
 * Secondary:         "ny learners permit at 16", "how to get ny permit at 16",
 *                    "new york class dj license", "ny junior license restrictions"
 * Note: NY minimum permit age is 16 (statewide). NYC has additional restrictions.
 */

// force-light-theme — data-theme="light" on root div

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
  title: "How to Get Your NY Permit at 16 | Class DJ Junior License | DriveMaster",
  description:
    "Can you get your learner's permit at 16 in New York? Yes — here's every requirement, document, GDL restriction, and the 5-hour pre-licensing course explained for NY teens.",
  alternates: {
    canonical: "https://aceyourpermit.com/new-york-teen-permit-16-years-old",
  },
  openGraph: {
    title: "How to Get Your NY Permit at 16 | DriveMaster",
    description:
      "Step-by-step guide to New York teen permits at 16. Class DJ junior license, 5-hour course, passenger restrictions, curfew rules — all in one place.",
    url: "https://aceyourpermit.com/new-york-teen-permit-16-years-old",
    type: "article",
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Can I get my permit at 16 in New York?",
    answer:
      "Yes — 16 is the minimum age for a NY learner's permit (Class DJ junior driver's permit). You must pass a 20-question written knowledge test at a DMV office. Unlike some states, NY does not require driver's ed enrollment to get a permit at 16, but you must complete a 5-hour pre-licensing course before your road test.",
  },
  {
    question: "What is the NY Class DJ junior license?",
    answer:
      "After holding your permit for at least 6 months and passing the road test, drivers aged 16–17 receive a Class DJ junior driver's license (or Class MJ for motorcycles). The DJ license has restrictions on passengers and nighttime driving until you turn 18.",
  },
  {
    question: "What are the Class DJ nighttime driving restrictions?",
    answer:
      "With a Class DJ junior license, you cannot drive between 9:00 PM and 5:00 AM (Sun–Thu) and between 11:00 PM and 5:00 AM (Fri–Sat) unless a supervising parent or guardian is in the vehicle. In NYC, the curfew is 9:00 PM–5:00 AM every night.",
  },
  {
    question: "What are the passenger restrictions for the Class DJ license?",
    answer:
      "In the first 6 months after receiving a Class DJ license, you may only carry one passenger under age 21 (unless supervised by a licensed adult). After 6 months, you may carry up to 2 passengers under 21 without supervision.",
  },
  {
    question: "What is the 5-hour pre-licensing course?",
    answer:
      "New York requires all first-time license applicants to complete a NY DMV-approved 5-hour pre-licensing course before scheduling a road test. The course covers defensive driving, distracted driving, alcohol and drug effects, and aggressive driving. It can be taken online or in person and costs roughly $30–$50.",
  },
  {
    question: "What do I need to bring to the NY DMV for my permit at 16?",
    answer:
      "You need to bring documents that verify your identity, date of birth, Social Security number, and New York State residency. NY uses a 6-point ID verification system. Common documents: birth certificate (4 pts) + Social Security card (3 pts) + utility bill or bank statement for residency. A parent or guardian must sign your application if you are under 18.",
  },
  {
    question: "What is the NY written permit test like?",
    answer:
      "The NY DMV written test has 20 multiple-choice questions drawn from the NY MV-21 Driver's Manual. You need 14 correct (70%) to pass. Topics include traffic signs, right-of-way, speed limits, and safe driving. If you fail, you can retake it the same day (fees apply).",
  },
  {
    question: "Do I need to pass a vision test?",
    answer:
      "Yes. NY DMV requires a vision screening at the time of your permit application. You must have at least 20/40 vision in one or both eyes (with or without corrective lenses). If you wear glasses or contacts, bring them.",
  },
];

// ─── Steps data ──────────────────────────────────────────────────────────────

const steps = [
  {
    number: "1",
    title: "Study the NY MV-21 Driver's Manual",
    body: "Download the free NY MV-21 Driver's Manual from dmv.ny.gov. Focus on traffic signs (shapes and colors), right-of-way rules, speed limits, and GDL restrictions. Use DriveMaster to practice the 20-question format.",
    Icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    number: "2",
    title: "Gather your documents (6-point ID)",
    body: "NY uses a 6-point system. Your birth certificate is worth 4 points. A Social Security card or W-2 adds 3 points. A utility bill or bank statement proves residency. Total must reach 6 points. Check dmv.ny.gov for the full list.",
    Icon: ShieldCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    number: "3",
    title: "Visit a DMV office with a parent or guardian",
    body: "You must visit in person (no online permit test in NY for first-time applicants under 18). A parent or guardian must be present to sign the application. You'll take the written test and vision screening on the same visit.",
    Icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    number: "4",
    title: "Pass the 20-question written test",
    body: "14 out of 20 correct (70%) to pass. If you fail, you can retake the same day for an additional fee. Use DriveMaster's test simulator to practice before you go — most users who score 85%+ on practice pass on the first try.",
    Icon: ClipboardList,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
  {
    number: "5",
    title: "Hold your permit for 6+ months",
    body: "You must hold the learner's permit for at least 6 months before scheduling a road test. During this time, you must always be supervised by a licensed driver 21+ in the front seat.",
    Icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    number: "6",
    title: "Complete the 5-hour pre-licensing course",
    body: "Before scheduling your road test, complete a NY DMV-approved 5-hour pre-licensing course. Available online or in-person. Costs ~$30–$50. You'll receive a certificate to bring to your road test appointment.",
    Icon: ShieldCheck,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewYorkTeenPermit16Page() {
  return (
    <div className="min-h-screen bg-white" data-theme="light">
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
              <Button variant="ghost" className="h-11">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 h-11">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Car className="w-4 h-4" />
            NY Class DJ Junior License — Age 16
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
            How to Get Your<br />
            <span className="text-blue-600">NY Permit at 16</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Step-by-step guide: 6-point ID, 20-question written test, 5-hour pre-licensing
            course, and Class DJ junior license restrictions — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 min-h-[44px]">
                Practice the NY Permit Test Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="text-lg px-8 min-h-[44px]">
                Try Without Signing Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Stats ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Age 16", sub: "minimum permit age in NY" },
              { label: "20 questions", sub: "on the written test" },
              { label: "70% to pass", sub: "14 of 20 correct" },
              { label: "6-month hold", sub: "before road test" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-6 h-6 text-blue-500 mb-1" />
                <span className="font-bold text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-500">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Step-by-Step Guide ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              Getting Your NY Permit at 16 — Step by Step
            </h2>
            <p className="text-gray-600">
              Follow these steps in order. Most teens complete steps 1–4 in a single DMV visit.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <Card key={step.number} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.iconBg} shrink-0`}>
                      <step.Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    <CardTitle className="text-base">
                      Step {step.number}: {step.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{step.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Class DJ Restrictions ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              Class DJ Junior License Restrictions
            </h2>
            <p className="text-gray-600">
              These apply until you turn 18 or upgrade your license.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                Icon: Clock,
                label: "Nighttime curfew (upstate NY)",
                body: "No unsupervised driving Sun–Thu 9:00 PM–5:00 AM; Fri–Sat 11:00 PM–5:00 AM.",
                warn: false,
              },
              {
                Icon: Clock,
                label: "Nighttime curfew (NYC)",
                body: "No unsupervised driving 9:00 PM–5:00 AM every night. NYC has the strictest curfew in the state.",
                warn: true,
              },
              {
                Icon: Users,
                label: "Passenger restriction (first 6 months)",
                body: "Only 1 passenger under 21 allowed without a supervising licensed adult in the front seat.",
                warn: false,
              },
              {
                Icon: Users,
                label: "Passenger restriction (after 6 months)",
                body: "Up to 2 passengers under 21 without supervision. Immediate family members are exempt.",
                warn: false,
              },
              {
                Icon: AlertTriangle,
                label: "Electronic device ban",
                body: "Using any portable electronic device while driving is prohibited for all NY drivers — Class DJ included. Penalty includes a 120-day suspension.",
                warn: true,
              },
              {
                Icon: ShieldCheck,
                label: "Zero-tolerance BAC",
                body: "Any detectable BAC (0.02% or higher) results in an immediate license suspension for drivers under 21.",
                warn: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex gap-4 rounded-xl border p-5 ${
                  item.warn
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200"
                } shadow-sm`}
              >
                <item.Icon
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    item.warn ? "text-red-500" : "text-blue-500"
                  }`}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.body}</p>
                </div>
              </div>
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
            Ready to Pass the NY Permit Test at 16?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Free practice. No credit card. 20-question NY format with Dash explanations.
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
            New York Department of Motor Vehicles.
          </p>
        </div>
      </footer>
    </div>
  );
}
