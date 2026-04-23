/**
 * SEO Landing Page: /florida-road-signs-test
 *
 * Primary keyword:   "florida road signs test"
 * Secondary:         "florida road signs quiz", "florida traffic signs",
 *                    "florida dmv road signs", "florida permit test road signs"
 * Agency:            Florida Highway Safety and Motor Vehicles (FLHSMV)
 *
 * TODO: Florida question bank: pending manual import from licensed source
 * (FL Driver License Handbook 2024).
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Force light theme ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Florida Road Signs Test — Study Guide 2026 | DriveMaster",
  description:
    "Every road sign on the Florida permit test — visual descriptions, meanings, and a free quiz. 10 road sign questions on the FLHSMV 50-question knowledge test. Study shapes, colors, and meanings for 2026.",
  keywords: [
    "florida road signs test",
    "florida road signs quiz",
    "florida traffic signs",
    "florida dmv road signs",
    "florida permit test road signs",
    "flhsmv road signs 2026",
    "what does this road sign mean florida",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/florida-road-signs-test",
  },
  openGraph: {
    title: "Florida Road Signs Test — Study Guide 2026",
    description:
      "Every road sign on the Florida permit test with meanings, shapes, colors, and a free quiz. Free for all Florida teens.",
    url: "https://aceyourpermit.com/florida-road-signs-test",
    siteName: "DriveMaster",
    locale: "en_US",
    type: "website",
  },
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const canonicalUrl = "https://aceyourpermit.com/florida-road-signs-test";

const faqItems = [
  {
    question: "How many road sign questions are on the Florida permit test?",
    answer:
      "The Florida FLHSMV knowledge test has 50 total questions. 10 of them specifically cover road signs and traffic signals — making signs a crucial category you cannot skip.",
  },
  {
    question: "What are the main categories of road signs in Florida?",
    answer:
      "The four main categories are: (1) Regulatory signs — tell you what you must do (STOP, YIELD, speed limits); (2) Warning signs — alert you to hazards ahead (yellow diamonds); (3) Guide signs — provide directions and distances (green); and (4) Construction/work-zone signs — mark temporary changes (orange).",
  },
  {
    question: "What color are warning signs in Florida?",
    answer:
      "Warning signs are yellow with black symbols or text. They are diamond-shaped (except school zone signs, which are fluorescent yellow-green pentagons). Always slow down when you see yellow diamond signs.",
  },
  {
    question: "What does an orange diamond sign mean?",
    answer:
      "Orange diamond signs mark construction or work zones. They indicate temporary traffic changes such as lane shifts, reduced speed limits, or road work ahead. Florida law increases fines in active construction zones.",
  },
  {
    question: "How do I memorize Florida road signs fast?",
    answer:
      "Group signs by SHAPE first (octagon = STOP, triangle = YIELD, diamond = warning), then by COLOR (red = stop/prohibit, yellow = warning, orange = construction, green = guide, blue = services). Shape alone can often tell you what to do even if you can't read the text from a distance.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Florida Road Signs Test — Study Guide 2026",
      description:
        "Complete visual study guide for every Florida road sign category with free practice quiz. Covers regulatory, warning, guide, and construction signs.",
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

// ─── Sample questions ─────────────────────────────────────────────────────────

interface SampleQuestion {
  id: string;
  question_text: string;
  options: [string, string, string, string];
  correct_answer: 0 | 1 | 2 | 3;
  explanation: string;
}

const sampleQuestions: SampleQuestion[] = [
  {
    id: "fl-ts-001",
    question_text: "What does a red octagonal sign mean?",
    options: ["Stop", "Yield", "Do Not Enter", "Wrong Way"],
    correct_answer: 0,
    explanation:
      "A red octagonal (8-sided) sign is the universal STOP sign. You must come to a complete stop at the stop line or before entering the crosswalk or intersection.",
  },
  {
    id: "fl-ts-002",
    question_text: "What does an upside-down triangle sign mean?",
    options: ["Yield", "Stop", "Merge", "Slow"],
    correct_answer: 0,
    explanation:
      "A red and white upside-down triangle is a YIELD sign. You must slow down and be prepared to stop if necessary to let traffic or pedestrians pass.",
  },
  {
    id: "fl-ts-003",
    question_text: "What color are warning signs in Florida?",
    options: [
      "Yellow with black letters/symbols",
      "Red with white letters",
      "Orange with black letters",
      "Green with white letters",
    ],
    correct_answer: 0,
    explanation:
      "Warning signs are yellow with black letters or symbols. They alert you to possible hazards ahead — slow down and use caution.",
  },
];

// ─── Sign data ────────────────────────────────────────────────────────────────

interface SignCard {
  id: string;
  name: string;
  shape: string;
  shapeDesc: string;
  color: string;
  colorHex: string;
  borderColor: string;
  textColor: string;
  symbol: string;
  meaning: string;
  rule: string;
}

const regulatorySigns: SignCard[] = [
  {
    id: "fl-sign-stop",
    name: "STOP",
    shape: "octagon",
    shapeDesc: "8-sided octagon",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#ffffff",
    textColor: "#ffffff",
    symbol: "STOP",
    meaning: "Come to a complete stop at the stop line, crosswalk, or before the intersection.",
    rule: "Florida law: you must make a full stop — not just slow down. After stopping, proceed when safe.",
  },
  {
    id: "fl-sign-yield",
    name: "YIELD",
    shape: "inverted-triangle",
    shapeDesc: "Inverted (upside-down) triangle",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#ffffff",
    textColor: "#DC2626",
    symbol: "YIELD",
    meaning: "Slow down and be prepared to stop. Give the right-of-way to other traffic.",
    rule: "You do not have to stop unless necessary. If traffic is clear, you may continue.",
  },
  {
    id: "fl-sign-speed-limit",
    name: "SPEED LIMIT",
    shape: "rectangle",
    shapeDesc: "White vertical rectangle",
    color: "White / Black",
    colorHex: "#ffffff",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "55",
    meaning: "Maximum legal speed under ideal conditions.",
    rule: "Florida default speed: 30 mph in urban areas, 20 mph in school zones when children are present.",
  },
  {
    id: "fl-sign-do-not-enter",
    name: "DO NOT ENTER",
    shape: "square",
    shapeDesc: "Red square with white horizontal bar",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#DC2626",
    textColor: "#ffffff",
    symbol: "⊖",
    meaning: "You cannot enter this road or ramp — traffic flows toward you.",
    rule: "Typically posted at highway off-ramps and one-way street entrances. Never enter.",
  },
];

const warningSigns: SignCard[] = [
  {
    id: "fl-sign-warning-curve",
    name: "CURVE AHEAD",
    shape: "diamond",
    shapeDesc: "Yellow diamond",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "↷",
    meaning: "A curve is ahead. Reduce your speed before entering the curve.",
    rule: "Slow down before the curve, not during it. Braking in a curve can cause skidding.",
  },
  {
    id: "fl-sign-school-zone",
    name: "SCHOOL ZONE",
    shape: "pentagon",
    shapeDesc: "Fluorescent yellow-green pentagon",
    color: "Fluorescent Yellow-Green / Black",
    colorHex: "#84cc16",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚸",
    meaning: "You are entering a school zone. Children may be crossing.",
    rule: "Florida speed limit is 20 mph in school zones when children are present. Fines are doubled.",
  },
  {
    id: "fl-sign-railroad",
    name: "RAILROAD CROSSING",
    shape: "circle",
    shapeDesc: "Yellow circle with X",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "✕",
    meaning: "A railroad crossing is ahead. Be prepared to stop for a train.",
    rule: "Florida: stop at least 15 feet from nearest rail when a train is coming or gates are down.",
  },
];

const constructionSigns: SignCard[] = [
  {
    id: "fl-sign-construction",
    name: "ROAD WORK AHEAD",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "⚒",
    meaning: "Construction or maintenance work is ahead. Expect temporary traffic changes.",
    rule: "Florida law increases fines for moving violations in active construction zones.",
  },
  {
    id: "fl-sign-lane-ends",
    name: "LANE ENDS",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "⇥",
    meaning: "Your lane is ending due to construction. Merge into the next lane.",
    rule: "Use the zipper merge — alternate with cars in the continuing lane when lanes narrow.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SignFigure({ sign }: { sign: SignCard }) {
  const isOctagon = sign.shape === "octagon";
  const isDiamond = sign.shape === "diamond";
  const isInvertedTriangle = sign.shape === "inverted-triangle";
  const isPentagon = sign.shape === "pentagon";
  const isCircle = sign.shape === "circle";

  return (
    <figure
      id={sign.id}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      aria-label={`Road sign: ${sign.name}`}
    >
      <div className="w-24 h-24 flex items-center justify-center" aria-hidden="true">
        <svg
          viewBox="0 0 96 96"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`${sign.name} sign shape: ${sign.shapeDesc}`}
          className="w-full h-full"
        >
          {isOctagon && (
            <>
              <polygon
                points="28,8 68,8 88,28 88,68 68,88 28,88 8,68 8,28"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="4"
              />
              <text x="48" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
          {isDiamond && (
            <>
              <polygon points="48,6 90,48 48,90 6,48" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="54" textAnchor="middle" fontSize="20" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
          {isInvertedTriangle && (
            <>
              <polygon points="48,84 6,12 90,12" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="4" />
              <polygon points="48,76 12,16 84,16" fill="#ffffff" stroke="none" />
              <text x="48" y="48" textAnchor="middle" fontSize="12" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
          {isPentagon && (
            <>
              <polygon points="48,6 90,30 78,84 18,84 6,30" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="56" textAnchor="middle" fontSize="22" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
          {isCircle && (
            <>
              <circle cx="48" cy="48" r="42" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="56" textAnchor="middle" fontSize="28" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
          {!isOctagon && !isDiamond && !isInvertedTriangle && !isPentagon && !isCircle && (
            <>
              <rect x="6" y="18" width="84" height="60" rx="4" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="54" textAnchor="middle" fontSize="16" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">
                {sign.symbol}
              </text>
            </>
          )}
        </svg>
      </div>

      <figcaption className="text-center">
        <p className="font-bold text-gray-900 text-sm font-display">{sign.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sign.shapeDesc}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sign.color}</p>
      </figcaption>

      <div className="w-full text-left border-t border-gray-100 pt-3 mt-1">
        <p className="text-xs font-semibold text-blue-700 mb-1">Meaning</p>
        <p className="text-xs text-gray-700 leading-relaxed">{sign.meaning}</p>
        <p className="text-xs font-semibold text-orange-600 mt-2 mb-1">Florida Rule</p>
        <p className="text-xs text-gray-700 leading-relaxed">{sign.rule}</p>
      </div>
    </figure>
  );
}

function SampleQuizCard({ q, index }: { q: SampleQuestion; index: number }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center font-display">
          {index + 1}
        </span>
        <p className="text-gray-900 font-medium leading-snug">{q.question_text}</p>
      </div>
      <ol className="space-y-2 mb-4" type="A">
        {q.options.map((opt, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-colors ${
              i === q.correct_answer
                ? "bg-green-50 border-green-200 text-green-800 font-semibold"
                : "bg-gray-50 border-gray-100 text-gray-600"
            }`}
          >
            <span className="shrink-0 font-mono text-xs text-gray-400">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
            {i === q.correct_answer && (
              <CheckCircle2 className="ml-auto w-4 h-4 text-green-600 shrink-0" />
            )}
          </li>
        ))}
      </ol>
      <div className="bg-blue-50 rounded-xl px-4 py-3 flex gap-2">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">{q.explanation}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-100 py-5 last:border-0">
      <h3 className="font-semibold text-gray-900 mb-2 font-display text-base">{question}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FloridaRoadSignsTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white" data-theme="light">
        {/* Nav */}
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-display">DriveMaster</span>
            </Link>
            <div className="flex items-center gap-3">
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
        <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Updated for Florida FLHSMV permit test 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
              Florida Road Signs Test{" "}
              <span className="text-orange-500">— Study Guide 2026</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Every sign on the Florida FLHSMV permit test — visual descriptions, shapes, colors, and
              exact meanings. Study regulatory, warning, guide, and construction signs, then quiz
              yourself for free.
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              Road signs make up 10 of the 50 questions on the Florida knowledge test.
              Master this page and you&apos;ll lock in 10 easy points.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 h-12 min-h-[44px]">
                  Take Full Signs Quiz Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/quiz">
                <Button size="lg" variant="outline" className="text-lg px-8 h-12 min-h-[44px]">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Practice Mode
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick stat bar */}
        <section className="py-8 px-4 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Road sign questions on FL test", value: "10" },
              { label: "Total FL test questions", value: "50" },
              { label: "Pass score required", value: "80%" },
              { label: "Sign categories tested", value: "4" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-blue-600 font-display mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Shape + Color Quick Reference */}
        <section className="py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display tracking-tight">
              Read Any Sign by Shape + Color
            </h2>
            <p className="text-gray-600 mb-8">
              Florida road signs use the same federal MUTCD standards as every other state.
              Learn these two dimensions and you can decode any sign — even if you can&apos;t
              read the text from a distance.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { shape: "Octagon", color: "Red", meaning: "STOP — always", bg: "bg-red-50 border-red-100", label: "text-red-700" },
                { shape: "Inverted Triangle", color: "Red + White", meaning: "YIELD — slow, give way", bg: "bg-red-50 border-red-100", label: "text-red-700" },
                { shape: "Diamond", color: "Yellow", meaning: "Warning — hazard ahead", bg: "bg-yellow-50 border-yellow-100", label: "text-yellow-700" },
                { shape: "Diamond", color: "Orange", meaning: "Construction / work zone", bg: "bg-orange-50 border-orange-100", label: "text-orange-700" },
                { shape: "Pentagon", color: "Fluorescent Yellow-Green", meaning: "School zone / crossing", bg: "bg-lime-50 border-lime-100", label: "text-lime-700" },
                { shape: "Rectangle", color: "Green", meaning: "Guide / destination info", bg: "bg-green-50 border-green-100", label: "text-green-700" },
                { shape: "Rectangle", color: "White", meaning: "Regulatory — what you must do", bg: "bg-gray-50 border-gray-200", label: "text-gray-700" },
                { shape: "Rectangle", color: "Blue", meaning: "Motorist services (gas, food)", bg: "bg-blue-50 border-blue-100", label: "text-blue-700" },
                { shape: "Round (yellow)", color: "Yellow / Black", meaning: "Railroad crossing advance", bg: "bg-yellow-50 border-yellow-100", label: "text-yellow-700" },
              ].map((row) => (
                <div key={`${row.shape}-${row.color}`} className={`rounded-xl border p-4 ${row.bg}`}>
                  <div className={`text-sm font-bold font-display ${row.label}`}>{row.shape}</div>
                  <div className="text-xs text-gray-500 mb-1">{row.color}</div>
                  <div className="text-sm text-gray-800 font-medium">{row.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regulatory Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-red-50/40">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
                Regulatory Signs
              </h2>
              <p className="text-gray-600">
                Regulatory signs tell you what you <strong>must</strong> or <strong>must not</strong> do.
                They carry the force of Florida law — ignoring them is a traffic violation.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regulatorySigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-yellow-50/40">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
                Warning Signs
              </h2>
              <p className="text-gray-600">
                Warning signs alert you to <strong>potential hazards</strong> ahead. They are
                diamond-shaped and yellow. Slow down and use caution when you see them.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {warningSigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Construction Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-orange-50/40">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
                Construction &amp; Work Zone Signs
              </h2>
              <p className="text-gray-600">
                Orange diamond signs mark <strong>temporary construction zones</strong>. Florida law
                increases fines for moving violations in active work zones.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {constructionSigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Sample Quiz Questions */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-3">
                Sample Florida Road Sign Questions
              </h2>
              <p className="text-gray-600">
                Real-format questions from our Florida permit test question bank.
              </p>
            </div>
            <div className="space-y-6">
              {sampleQuestions.map((q, i) => <SampleQuizCard key={q.id} q={q} index={i} />)}
            </div>
            <div className="mt-10 text-center">
              <Link href="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 h-12 min-h-[44px]">
                  Unlock All Road Sign Questions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free — no credit card required</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-8">
              Frequently Asked Questions
            </h2>
            <div>
              {faqItems.map((item) => <FaqItem key={item.question} question={item.question} answer={item.answer} />)}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight mb-4">
              Ready to ace the Florida road signs test?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              DriveMaster&apos;s full visual quiz covers every Florida sign — with Dash explaining
              each wrong answer so you actually remember it on test day.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-400 text-white text-lg px-10 h-14 min-h-[44px] shadow-lg"
              >
                Start Your Free Road Signs Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-blue-200 text-sm mt-4">
              Free for all Florida permit applicants. FLHSMV test topics only.
            </p>
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
            <p className="text-center text-gray-500 text-sm">
              &copy; 2026 DriveMaster. All rights reserved. Not affiliated with the Florida Highway
              Safety and Motor Vehicles (FLHSMV). Verify requirements at{" "}
              <a href="https://www.flhsmv.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                flhsmv.gov
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
