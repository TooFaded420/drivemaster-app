/**
 * SEO Landing Page: /new-york-road-signs-test
 *
 * Primary keyword:   "new york road signs test"
 * Secondary:         "ny road signs quiz", "new york traffic signs", "ny dmv road signs 2026"
 */

// force-light-theme — data-theme="light" on root div

import type { Metadata } from "next";
import Link from "next/link";
import { Car, ArrowRight, CheckCircle2, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "New York Road Signs Test — Study Guide 2026 | DriveMaster",
  description:
    "Every road sign on the New York DMV permit test — meanings, shapes, colors, and a free quiz. Study regulatory, warning, guide, and construction signs for your NY permit. Based on NY MV-21 2024.",
  keywords: [
    "new york road signs test",
    "ny road signs quiz",
    "new york traffic signs",
    "what does this road sign mean new york",
    "ny permit test road signs",
    "new york dmv road signs 2026",
    "ny road signs study guide",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/new-york-road-signs-test",
  },
  openGraph: {
    title: "New York Road Signs Test — Study Guide 2026",
    description:
      "Every road sign on the NY DMV permit test with meanings, shapes, colors, and a free quiz.",
    url: "https://aceyourpermit.com/new-york-road-signs-test",
    siteName: "DriveMaster",
    locale: "en_US",
    type: "website",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const canonicalUrl = "https://aceyourpermit.com/new-york-road-signs-test";

const faqItems = [
  {
    question: "How many road sign questions are on the New York permit test?",
    answer:
      "The NY DMV written test has 20 total questions. Approximately 4–6 of them cover traffic signs and signals. Signs are a heavily weighted category — don't skip them.",
  },
  {
    question: "What are the 4 main categories of road signs in New York?",
    answer:
      "The four main categories are: (1) Regulatory signs — tell you what you must do (STOP, YIELD, speed limits); (2) Warning signs — alert you to hazards ahead; (3) Guide signs — provide directions and distances; and (4) Construction/work-zone signs — mark temporary changes to road conditions.",
  },
  {
    question: "What color is a warning sign?",
    answer:
      "Warning signs are yellow with black symbols or text. They are diamond-shaped (except school zone signs, which are fluorescent yellow-green pentagons). Always slow down when you see yellow diamond signs.",
  },
  {
    question: "Are there road signs unique to New York?",
    answer:
      "Most signs follow the federal MUTCD standard, so they're the same nationwide. However, New York uses specific supplemental signs for NYC bus lanes, HOV lane markings on expressways, and Thruway designations. These are not typically tested on the permit exam but are good to know.",
  },
  {
    question: "How do I memorize road signs fast?",
    answer:
      "Group signs by SHAPE first (octagon = STOP, triangle = YIELD, diamond = warning), then by COLOR (red = stop/prohibit, yellow = warning, orange = construction, green = guide, blue = services). Shape alone can often tell you what to do even if you can't read the text.",
  },
  {
    question: "Do I need to know NYC-specific signs for the permit test?",
    answer:
      "No. The NY DMV written permit test is standardized statewide and covers federal MUTCD signs from the NY MV-21 Driver's Manual. NYC-specific street signs (like parking restriction signs or bus lane signs) are not on the permit exam.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "New York Road Signs Test — Study Guide 2026",
      description:
        "Every road sign on the NY DMV permit test — shapes, colors, meanings, and a free quiz.",
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

// ─── Sign categories data ─────────────────────────────────────────────────────

const signCategories = [
  {
    name: "Regulatory Signs",
    color: "red",
    bgClass: "bg-red-50 border-red-200",
    iconClass: "text-red-600",
    Icon: AlertTriangle,
    description:
      "Red and white. Tell you what you MUST do or MUST NOT do. Violating them is a traffic infraction.",
    examples: ["STOP (octagon, red)", "YIELD (triangle, red/white)", "Speed Limit (white rectangle)", "Do Not Enter (red circle)", "No Left Turn (red circle/slash)"],
  },
  {
    name: "Warning Signs",
    color: "yellow",
    bgClass: "bg-yellow-50 border-yellow-200",
    iconClass: "text-yellow-600",
    Icon: AlertTriangle,
    description:
      "Yellow diamond. Alert you to hazards or changing road conditions ahead. Slow down and be prepared.",
    examples: ["Curve Ahead", "Slippery When Wet", "Deer Crossing", "School Zone (pentagon, fluorescent yellow-green)", "Railroad Crossing (round, yellow)"],
  },
  {
    name: "Guide Signs",
    color: "green",
    bgClass: "bg-green-50 border-green-200",
    iconClass: "text-green-600",
    Icon: Info,
    description:
      "Green with white text. Provide directions, distances, and route information.",
    examples: ["Highway route markers", "Exit signs", "Mile markers", "City/destination signs", "Milepost signs"],
  },
  {
    name: "Construction Signs",
    color: "orange",
    bgClass: "bg-orange-50 border-orange-200",
    iconClass: "text-orange-500",
    Icon: BookOpen,
    description:
      "Orange with black text. Mark work zones and temporary road changes. Fines are doubled in NY work zones.",
    examples: ["Road Work Ahead", "Flagger Ahead", "Lane Ends", "Reduced Speed Ahead", "Construction Zone Speed Limit"],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewYorkRoadSignsTestPage() {
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
            <BookOpen className="w-4 h-4" />
            Based on NY MV-21 Driver&apos;s Manual 2024
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
            New York Road Signs<br />
            <span className="text-blue-600">Study Guide & Test</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Master every sign shape, color, and meaning for the NY DMV permit test.
            Free quiz — no signup required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 min-h-[44px]">
                Practice Road Signs Free
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

      {/* ── Quick Reference ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-display tracking-tight">
              The 4 Sign Categories You Must Know
            </h2>
            <p className="text-gray-600">
              Learn the pattern: shape + color = meaning. You can identify most signs before you read the text.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {signCategories.map((cat) => (
              <div
                key={cat.name}
                className={`rounded-2xl border p-6 ${cat.bgClass}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <cat.Icon className={`w-6 h-6 ${cat.iconClass}`} />
                  <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">{cat.description}</p>
                <ul className="space-y-1">
                  {cat.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Memorization Tips ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 font-display tracking-tight">
            Memorize Signs in 10 Minutes
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Learn shapes first",
                body: "Octagon = STOP always. Inverted triangle = YIELD always. Diamond = Warning. Pentagon = School zone. You don't need to read to know these.",
              },
              {
                step: "2",
                title: "Learn the color code",
                body: "Red = stop or prohibition. Yellow = warning. Orange = construction. Green = guide. Blue = services (hospital, rest area). Brown = recreation.",
              },
              {
                step: "3",
                title: "Flashcard the regulatory signs",
                body: "Speed limits, No U-Turn, No Left Turn, One Way, Do Not Enter — these are most likely to appear on your NY permit test. Spend 80% of your sign study time here.",
              },
              {
                step: "4",
                title: "Practice with DriveMaster",
                body: "Our spaced-repetition quiz surfaces the signs you miss most. Three sessions usually moves most people from 60% to 90%+ on signs.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
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
            Ready to Ace NY Road Signs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Free practice quiz. No credit card. No ads during the quiz.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 min-h-[44px]"
            >
              Start Free Road Signs Quiz
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
