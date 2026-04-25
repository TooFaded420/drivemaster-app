/**
 * SEO Landing Page: /pennsylvania-road-signs-test
 *
 * Primary keyword:   "pennsylvania road signs test"
 * Secondary:         "pa road signs quiz", "pennsylvania traffic signs",
 *                    "penndot road signs 2026", "pa permit test road signs"
 * Angle:             Every road sign on the PA PennDOT written test — study guide + free quiz.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Car, ArrowRight, CheckCircle2, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Pennsylvania Road Signs Test — PennDOT Study Guide 2026 | Ace Your Permit",
  description:
    "Every road sign on the Pennsylvania PennDOT written test — shapes, colors, meanings, and a free quiz. Study regulatory, warning, guide, and construction signs. Pass your PA permit test in 2026.",
  keywords: [
    "pennsylvania road signs test",
    "pa road signs quiz",
    "pennsylvania traffic signs",
    "penndot road signs 2026",
    "pa permit test road signs",
    "pennsylvania road signs meanings",
  ],
  alternates: {
    canonical: "https://aceyourpermit.com/pennsylvania-road-signs-test",
  },
  openGraph: {
    title: "Pennsylvania Road Signs Test — PennDOT Study Guide 2026",
    description:
      "Every road sign on the PA PennDOT permit test with meanings, shapes, colors, and a free quiz. Free for all Pennsylvania teens.",
    url: "https://aceyourpermit.com/pennsylvania-road-signs-test",
    siteName: "Ace Your Permit",
    locale: "en_US",
    type: "website",
  },
};

// ─── Structured Data ─────────────────────────────────────────────────────────

const canonicalUrl = "https://aceyourpermit.com/pennsylvania-road-signs-test";

const faqItems = [
  {
    question: "How many road sign questions are on the Pennsylvania permit test?",
    answer:
      "The PennDOT written knowledge test has 18 total questions. A significant portion cover traffic signs and signals — mastering signs is one of the best ways to boost your score.",
  },
  {
    question: "What are the 4 main categories of road signs?",
    answer:
      "The four main categories are: (1) Regulatory signs — tell you what you must do (STOP, YIELD, speed limits); (2) Warning signs — alert you to hazards ahead; (3) Guide signs — provide directions and distances; and (4) Construction/work-zone signs — mark temporary changes to road conditions.",
  },
  {
    question: "What color are warning signs in Pennsylvania?",
    answer:
      "Warning signs are yellow with black symbols or text. They are diamond-shaped (except school zone signs, which are fluorescent yellow-green pentagons). Slow down when you see yellow diamond signs.",
  },
  {
    question: "Does Pennsylvania follow federal road sign standards?",
    answer:
      "Yes. Pennsylvania signs follow the federal Manual on Uniform Traffic Control Devices (MUTCD), so shapes and colors are standardized nationwide. Pennsylvania-specific signs include Route 30 and turnpike markers.",
  },
  {
    question: "How do I memorize road signs fast?",
    answer:
      "Group signs by SHAPE first (octagon = STOP, triangle = YIELD, diamond = warning), then by COLOR (red = stop/prohibit, yellow = warning, orange = construction, green = guide, blue = services). Shape alone often tells you what to do even if you can't read the text.",
  },
  {
    question: "What does an orange diamond sign mean in Pennsylvania?",
    answer:
      "Orange diamond signs mark construction or work zones. They indicate temporary traffic changes such as lane shifts or reduced speed limits. Pennsylvania law increases penalties for violations in active work zones.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Pennsylvania Road Signs Test — PennDOT Study Guide 2026",
      description:
        "Complete visual study guide for every Pennsylvania road sign category with free practice quiz.",
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

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
    id: "pa-sign-stop",
    name: "STOP",
    shape: "octagon",
    shapeDesc: "8-sided octagon",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#ffffff",
    textColor: "#ffffff",
    symbol: "STOP",
    meaning: "Come to a complete stop at the stop line, crosswalk, or before the intersection.",
    rule: "You must make a full stop — not just slow down. After stopping, proceed when safe.",
  },
  {
    id: "pa-sign-yield",
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
    id: "pa-sign-speed-limit",
    name: "SPEED LIMIT",
    shape: "rectangle",
    shapeDesc: "White vertical rectangle",
    color: "White / Black",
    colorHex: "#ffffff",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "55",
    meaning: "Maximum legal speed under ideal conditions. PA urban default: 35 mph.",
    rule: "You must not exceed the posted number. Drive slower when conditions are poor.",
  },
  {
    id: "pa-sign-do-not-enter",
    name: "DO NOT ENTER",
    shape: "square",
    shapeDesc: "Red square with white horizontal bar",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#DC2626",
    textColor: "#ffffff",
    symbol: "⊖",
    meaning: "You cannot enter this road or ramp — traffic flows toward you.",
    rule: "Typically posted at expressway off-ramps and one-way street entrances. Never enter.",
  },
];

const warningSigns: SignCard[] = [
  {
    id: "pa-sign-warning-curve",
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
    id: "pa-sign-school-zone",
    name: "SCHOOL ZONE",
    shape: "pentagon",
    shapeDesc: "Fluorescent yellow-green pentagon",
    color: "Fluorescent Yellow-Green / Black",
    colorHex: "#84cc16",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚸",
    meaning: "You are entering a school zone. Children may be crossing.",
    rule: "Pennsylvania speed limit is 15 mph in school zones when children are present.",
  },
  {
    id: "pa-sign-railroad",
    name: "RAILROAD CROSSING",
    shape: "circle",
    shapeDesc: "Yellow circle with X",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "✕",
    meaning: "A railroad crossing is ahead. Be prepared to stop for a train.",
    rule: "Stop at least 15 feet from the nearest rail when a train is approaching.",
  },
];

const constructionSigns: SignCard[] = [
  {
    id: "pa-sign-construction",
    name: "ROAD WORK AHEAD",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "⚒",
    meaning: "Construction or maintenance work is ahead. Expect temporary traffic changes.",
    rule: "Pennsylvania increases penalties for moving violations in active work zones.",
  },
  {
    id: "pa-sign-flagger",
    name: "FLAGGER AHEAD",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚩",
    meaning: "A flagger is directing traffic ahead.",
    rule: "Obey flagger instructions the same as you would a traffic signal — they are legally binding.",
  },
];

const guideSigns: SignCard[] = [
  {
    id: "pa-sign-interstate",
    name: "INTERSTATE MARKER",
    shape: "shield",
    shapeDesc: "Red, white & blue shield",
    color: "Red / White / Blue",
    colorHex: "#1D4ED8",
    borderColor: "#DC2626",
    textColor: "#ffffff",
    symbol: "⬡",
    meaning: "Identifies an Interstate highway. Even numbers = east-west; odd = north-south.",
    rule: "Pennsylvania Interstates include I-76 (Turnpike), I-78, I-80, I-81, and I-95.",
  },
  {
    id: "pa-sign-destination",
    name: "DESTINATION / DISTANCE",
    shape: "rectangle",
    shapeDesc: "Green rectangle with white text",
    color: "Green / White",
    colorHex: "#16A34A",
    borderColor: "#16A34A",
    textColor: "#ffffff",
    symbol: "→",
    meaning: "Shows direction and distance to destinations (cities, exits, interchanges).",
    rule: "Overhead green signs on expressways indicate lane assignments — get in the correct lane early.",
  },
];

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
    id: "pa-ts-001",
    question_text: "What does a red octagonal sign mean?",
    options: ["Stop", "Yield", "Do Not Enter", "Wrong Way"],
    correct_answer: 0,
    explanation:
      "A red octagonal (8-sided) sign is the universal STOP sign. You must come to a complete stop at the stop line or before entering the crosswalk or intersection.",
  },
  {
    id: "pa-ts-002",
    question_text: "What does an upside-down triangular sign mean?",
    options: ["Yield", "Stop", "Merge", "Slow"],
    correct_answer: 0,
    explanation:
      "A red and white upside-down triangle is a YIELD sign. You must slow down and be prepared to stop if necessary to let traffic or pedestrians pass.",
  },
  {
    id: "pa-ts-003",
    question_text: "What color are warning signs in Pennsylvania?",
    options: [
      "Yellow with black letters/symbols",
      "Red with white letters",
      "Orange with black letters",
      "Green with white letters",
    ],
    correct_answer: 0,
    explanation:
      "Warning signs are yellow with black letters or symbols. They alert you to possible hazards ahead.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SignFigure({ sign }: { sign: SignCard }) {
  const isOctagon = sign.shape === "octagon";
  const isDiamond = sign.shape === "diamond";
  const isInvertedTriangle = sign.shape === "inverted-triangle";
  const isPentagon = sign.shape === "pentagon";
  const isCircle = sign.shape === "circle";
  const isShield = sign.shape === "shield";

  return (
    <figure
      id={sign.id}
      className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      aria-label={`Road sign: ${sign.name}`}
    >
      <div className="w-24 h-24 flex items-center justify-center" aria-hidden="true">
        <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${sign.name} sign shape: ${sign.shapeDesc}`} className="w-full h-full">
          {isOctagon && (
            <>
              <polygon points="28,8 68,8 88,28 88,68 68,88 28,88 8,68 8,28" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="4" />
              <text x="48" y="55" textAnchor="middle" fontSize="16" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {isDiamond && (
            <>
              <polygon points="48,6 90,48 48,90 6,48" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="54" textAnchor="middle" fontSize="20" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {isInvertedTriangle && (
            <>
              <polygon points="48,84 6,12 90,12" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="4" />
              <polygon points="48,76 12,16 84,16" fill="#ffffff" stroke="none" />
              <text x="48" y="48" textAnchor="middle" fontSize="14" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {isPentagon && (
            <>
              <polygon points="48,6 90,30 78,84 18,84 6,30" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="56" textAnchor="middle" fontSize="22" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {isCircle && (
            <>
              <circle cx="48" cy="48" r="42" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="56" textAnchor="middle" fontSize="28" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {isShield && (
            <>
              <path d="M48,4 L88,16 L88,56 Q88,80 48,92 Q8,80 8,56 L8,16 Z" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="56" textAnchor="middle" fontSize="22" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
            </>
          )}
          {!isOctagon && !isDiamond && !isInvertedTriangle && !isPentagon && !isCircle && !isShield && (
            <>
              <rect x="6" y="18" width="84" height="60" rx="4" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text x="48" y="54" textAnchor="middle" fontSize="16" fontWeight="bold" fill={sign.textColor} fontFamily="sans-serif">{sign.symbol}</text>
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
        <p className="text-xs font-semibold text-orange-600 mt-2 mb-1">Pennsylvania Rule</p>
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
            <span className="shrink-0 font-mono text-xs text-gray-400">{String.fromCharCode(65 + i)}</span>
            {opt}
            {i === q.correct_answer && <CheckCircle2 className="ml-auto w-4 h-4 text-green-600 shrink-0" />}
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

export default function PennsylvaniaRoadSignsTestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="force-light-theme min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Nav */}
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-display">Ace Your Permit</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" className="h-11">Sign In</Button></Link>
              <Link href="/signup"><Button className="bg-blue-600 hover:bg-blue-700 h-11">Start Free</Button></Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-14 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Updated for Pennsylvania PennDOT test 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
              Pennsylvania Road Signs Test{" "}
              <span className="text-orange-500">— Study Guide 2026</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Every sign on the Pennsylvania PennDOT permit test — shapes, colors, and exact
              meanings. Study regulatory, warning, guide, and construction signs, then quiz
              yourself for free.
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              Signs make up a significant portion of the 18 questions on the PA PennDOT written
              test. Master this page and you&apos;ll have a major edge on exam day.
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
              { label: "Total questions on PA test", value: "18" },
              { label: "Correct answers needed to pass", value: "15" },
              { label: "Sign categories tested", value: "4" },
              { label: "Passing score", value: "83%" },
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
              Pennsylvania road signs use standardized shapes and colors. Learn these two dimensions
              and you can decode any sign — even if you can&apos;t read the text.
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
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">Regulatory Signs</h2>
            <p className="text-gray-600 mb-8">Regulatory signs tell you what you <strong>must</strong> or <strong>must not</strong> do. They carry the force of law.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regulatorySigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-yellow-50/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">Warning Signs</h2>
            <p className="text-gray-600 mb-8">Warning signs alert you to <strong>potential hazards</strong> ahead. They are diamond-shaped and yellow.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {warningSigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Construction Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-orange-50/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">Construction &amp; Work Zone Signs</h2>
            <p className="text-gray-600 mb-8">Orange diamond signs mark <strong>temporary construction zones</strong>. Pennsylvania increases penalties for violations in active work zones.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {constructionSigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Guide Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-green-50/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">Guide Signs</h2>
            <p className="text-gray-600 mb-8">Guide signs provide <strong>direction, distance, and services</strong>. Green signs give route and destination info; blue signs point to motorist services.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guideSigns.map((sign) => <SignFigure key={sign.id} sign={sign} />)}
            </div>
          </div>
        </section>

        {/* Sample Quiz Questions */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-3">Sample Pennsylvania Road Sign Questions</h2>
              <p className="text-gray-600">Real-format questions. Answers and explanations shown — take the full quiz inside Ace Your Permit.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-8">Frequently Asked Questions</h2>
            <div>{faqItems.map((item) => <FaqItem key={item.question} question={item.question} answer={item.answer} />)}</div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight mb-4">
              Ready to ace the Pennsylvania road signs test?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Ace Your Permit&apos;s full visual quiz covers every sign — with Dash explaining each wrong
              answer so you actually remember it on test day.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white text-lg px-10 h-14 min-h-[44px] shadow-lg">
                Start Your Free Road Signs Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-blue-200 text-sm mt-4">PA PennDOT test topics. Free — no card required.</p>
          </div>
        </section>
      </div>
    </>
  );
}
