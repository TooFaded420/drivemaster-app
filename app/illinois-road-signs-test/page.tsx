import type { Metadata } from "next";
import Link from "next/link";
import { Car, ArrowRight, CheckCircle2, BookOpen, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Illinois Road Signs Test — Study Guide 2026 | DriveMaster",
  description:
    "Every road sign on the Illinois permit test — visual descriptions, meanings, and a free quiz. Study regulatory, warning, guide, and construction signs. Pass your IL SOS test in 2026.",
  keywords: [
    "illinois road signs test",
    "illinois road signs quiz",
    "illinois traffic signs",
    "what does this road sign mean illinois",
    "illinois permit test road signs",
    "il sos road signs 2026",
  ],
  alternates: {
    canonical: "https://drivemaster.app/illinois-road-signs-test",
  },
  openGraph: {
    title: "Illinois Road Signs Test — Study Guide 2026",
    description:
      "Every road sign on the Illinois permit test with meanings, shapes, colors, and a free quiz. Free for all Illinois teens.",
    url: "https://drivemaster.app/illinois-road-signs-test",
    siteName: "DriveMaster",
    locale: "en_US",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// JSON-LD data
// ---------------------------------------------------------------------------

const canonicalUrl = "https://drivemaster.app/illinois-road-signs-test";

const faqItems = [
  {
    question: "How many road sign questions are on the Illinois permit test?",
    answer:
      "The Illinois permit test has 35 total questions. Approximately 10–15 of them cover traffic signs and signals — making signs the single largest tested category.",
  },
  {
    question: "What are the 4 main categories of road signs?",
    answer:
      "The four main categories are: (1) Regulatory signs — tell you what you must do (STOP, YIELD, speed limits); (2) Warning signs — alert you to hazards ahead; (3) Guide signs — provide directions and distances; and (4) Construction/work-zone signs — mark temporary changes to road conditions.",
  },
  {
    question: "What color is a warning sign?",
    answer:
      "Warning signs are yellow with black symbols or text. They are diamond-shaped (except school zone signs, which are fluorescent yellow-green pentagons). Always slow down when you see yellow diamond signs.",
  },
  {
    question: "What does an orange diamond sign mean?",
    answer:
      "Orange diamond signs mark construction or work zones. They indicate temporary traffic changes such as lane shifts, reduced speed limits, or road work ahead. Fines are doubled in Illinois construction zones.",
  },
  {
    question: "Are there road signs unique to Illinois?",
    answer:
      "Most signs follow the federal MUTCD standard, so they're the same nationwide. However, Illinois uses specific supplemental signs for Chicago expressway systems, Illinois Tollway designations, and some rural county road markers that differ from other states.",
  },
  {
    question: "How do I memorize road signs fast?",
    answer:
      "Group signs by SHAPE first (octagon = STOP, triangle = YIELD, diamond = warning), then by COLOR (red = stop/prohibit, yellow = warning, orange = construction, green = guide, blue = services). Shape alone can often tell you what to do even if you can't read the text.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Illinois Road Signs Test — Study Guide 2026",
      description:
        "Complete visual study guide for every Illinois road sign category with free practice quiz. Covers regulatory, warning, guide, and construction signs.",
      inLanguage: "en-US",
      isPartOf: { "@id": "https://drivemaster.app/#website" },
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
    {
      "@type": "Course",
      "@id": `${canonicalUrl}#course`,
      name: "Illinois Road Signs — Complete Study Guide",
      description:
        "Self-paced road signs study course covering all sign categories tested on the Illinois DMV permit exam.",
      provider: {
        "@type": "Organization",
        name: "DriveMaster",
        url: "https://drivemaster.app",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        inLanguage: "en-US",
      },
    },
    // ImageObject nodes for each sign figure (using fragment anchors as IDs since no hosted image files exist yet)
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-stop`,
      contentUrl: `${canonicalUrl}#sign-stop`,
      name: "STOP Sign — Red Octagon",
      description:
        "Red octagonal STOP sign. Eight-sided, red background, white border, white text. Requires a complete stop at the stop line.",
      representativeOfPage: false,
    },
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-yield`,
      contentUrl: `${canonicalUrl}#sign-yield`,
      name: "YIELD Sign — Inverted Red Triangle",
      description:
        "Red and white inverted triangle YIELD sign. Requires slowing and stopping if necessary to give right-of-way.",
      representativeOfPage: false,
    },
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-dne`,
      contentUrl: `${canonicalUrl}#sign-do-not-enter`,
      name: "DO NOT ENTER Sign — Red Square with White Bar",
      description:
        "Red square DO NOT ENTER sign with white horizontal bar. Prohibits entry into a road or ramp.",
      representativeOfPage: false,
    },
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-warning`,
      contentUrl: `${canonicalUrl}#sign-warning-curve`,
      name: "Curve Warning Sign — Yellow Diamond",
      description:
        "Yellow diamond warning sign with black curved arrow. Warns of a curve ahead; reduce speed.",
      representativeOfPage: false,
    },
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-school`,
      contentUrl: `${canonicalUrl}#sign-school-zone`,
      name: "School Zone Sign — Fluorescent Yellow-Green Pentagon",
      description:
        "Fluorescent yellow-green pentagon school zone sign. Speed limit 20 mph when children are present.",
      representativeOfPage: false,
    },
    {
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#img-construction`,
      contentUrl: `${canonicalUrl}#sign-construction`,
      name: "Construction Zone Sign — Orange Diamond",
      description:
        "Orange diamond construction zone warning sign. Marks temporary road work; fines doubled in Illinois.",
      representativeOfPage: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// Sign data
// ---------------------------------------------------------------------------

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
    id: "sign-stop",
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
    id: "sign-yield",
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
    id: "sign-do-not-enter",
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
  {
    id: "sign-wrong-way",
    name: "WRONG WAY",
    shape: "rectangle",
    shapeDesc: "Red rectangle",
    color: "Red / White",
    colorHex: "#DC2626",
    borderColor: "#DC2626",
    textColor: "#ffffff",
    symbol: "↙",
    meaning: "You are traveling in the wrong direction on a divided highway or one-way road.",
    rule: "Pull over safely, stop, and reverse direction when it is safe to do so.",
  },
  {
    id: "sign-speed-limit",
    name: "SPEED LIMIT",
    shape: "rectangle",
    shapeDesc: "White vertical rectangle",
    color: "White / Black",
    colorHex: "#ffffff",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "55",
    meaning: "Maximum legal speed under ideal conditions. Illinois urban default: 30 mph.",
    rule: "You must not exceed the posted number. Drive slower when conditions are poor.",
  },
  {
    id: "sign-no-u-turn",
    name: "NO U-TURN",
    shape: "rectangle",
    shapeDesc: "White rectangle with red circle-slash",
    color: "White / Red / Black",
    colorHex: "#ffffff",
    borderColor: "#000000",
    textColor: "#DC2626",
    symbol: "⟳̸",
    meaning: "U-turns are prohibited at this location.",
    rule: "Illinois law prohibits U-turns where they cannot be made safely or where posted.",
  },
];

const warningSigns: SignCard[] = [
  {
    id: "sign-warning-curve",
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
    id: "sign-merge",
    name: "MERGE",
    shape: "diamond",
    shapeDesc: "Yellow diamond",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "⇒",
    meaning: "Traffic from another lane or road will merge into your lane.",
    rule: "Adjust speed to allow merging traffic to safely enter. Check mirrors and blind spots.",
  },
  {
    id: "sign-school-zone",
    name: "SCHOOL ZONE",
    shape: "pentagon",
    shapeDesc: "Fluorescent yellow-green pentagon",
    color: "Fluorescent Yellow-Green / Black",
    colorHex: "#84cc16",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚸",
    meaning: "You are entering a school zone. Children may be crossing.",
    rule: "Illinois speed limit is 20 mph in school zones when children are present.",
  },
  {
    id: "sign-railroad",
    name: "RAILROAD CROSSING",
    shape: "circle",
    shapeDesc: "Yellow circle with X",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "✕",
    meaning: "A railroad crossing is ahead. Be prepared to stop for a train.",
    rule: "Stop at least 15 feet from nearest rail when a train is coming or gates are down.",
  },
  {
    id: "sign-slippery",
    name: "SLIPPERY WHEN WET",
    shape: "diamond",
    shapeDesc: "Yellow diamond",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "〰",
    meaning: "Road becomes slippery when wet. Reduce speed and increase following distance.",
    rule: "Allow at least 3× the normal following distance on slippery roads.",
  },
  {
    id: "sign-pedestrian",
    name: "PEDESTRIAN CROSSING",
    shape: "diamond",
    shapeDesc: "Yellow diamond",
    color: "Yellow / Black",
    colorHex: "#EAB308",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚶",
    meaning: "Pedestrians may be crossing the road ahead.",
    rule: "Illinois law requires drivers to stop for pedestrians in crosswalks.",
  },
];

const constructionSigns: SignCard[] = [
  {
    id: "sign-construction",
    name: "ROAD WORK AHEAD",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "⚒",
    meaning: "Construction or maintenance work is ahead. Expect temporary traffic changes.",
    rule: "Illinois doubles fines for moving violations in active construction zones.",
  },
  {
    id: "sign-flagger",
    name: "FLAGGER AHEAD",
    shape: "diamond",
    shapeDesc: "Orange diamond",
    color: "Orange / Black",
    colorHex: "#F97316",
    borderColor: "#000000",
    textColor: "#000000",
    symbol: "🚩",
    meaning: "A flagger (person with flag or sign) is directing traffic ahead.",
    rule: "Obey flagger instructions the same way you obey traffic signals — they are legally binding.",
  },
  {
    id: "sign-lane-ends",
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

const guideSigns: SignCard[] = [
  {
    id: "sign-interstate",
    name: "INTERSTATE MARKER",
    shape: "shield",
    shapeDesc: "Red, white & blue shield",
    color: "Red / White / Blue",
    colorHex: "#1D4ED8",
    borderColor: "#DC2626",
    textColor: "#ffffff",
    symbol: "⬡",
    meaning: "Identifies an Interstate highway. Even numbers = east-west; odd = north-south.",
    rule: "Illinois Interstates follow federal numbering: I-80 runs east-west; I-55 north-south.",
  },
  {
    id: "sign-us-route",
    name: "US ROUTE MARKER",
    shape: "shield",
    shapeDesc: "Black and white shield",
    color: "Black / White",
    colorHex: "#000000",
    borderColor: "#ffffff",
    textColor: "#ffffff",
    symbol: "◇",
    meaning: "Identifies a US numbered highway.",
    rule: "US routes cross state lines; IL Route markers (black on white) are state-only roads.",
  },
  {
    id: "sign-destination",
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
  {
    id: "sign-services",
    name: "SERVICES (GAS / FOOD / LODGING)",
    shape: "rectangle",
    shapeDesc: "Blue rectangle with white symbols",
    color: "Blue / White",
    colorHex: "#2563EB",
    borderColor: "#2563EB",
    textColor: "#ffffff",
    symbol: "⛽",
    meaning: "Motorist services (gas, food, lodging, hospital) are available at this exit.",
    rule: "Blue service signs list specific brand names at the next exit for easy identification.",
  },
];

// ---------------------------------------------------------------------------
// Sample questions pulled from lib/data/questions/illinois-dmv-questions.ts
// (ids: il-ts-001, il-ts-004, il-ts-010)
// ---------------------------------------------------------------------------

interface SampleQuestion {
  id: string;
  question_text: string;
  options: [string, string, string, string];
  correct_answer: 0 | 1 | 2 | 3;
  explanation: string;
}

const sampleQuestions: SampleQuestion[] = [
  {
    id: "il-ts-001",
    question_text: "What does a red octagonal sign mean?",
    options: ["Stop", "Yield", "Do Not Enter", "Wrong Way"],
    correct_answer: 0,
    explanation:
      "A red octagonal (8-sided) sign is the universal STOP sign. You must come to a complete stop at the stop line or before entering the crosswalk or intersection.",
  },
  {
    id: "il-ts-004",
    question_text: "What does an upside-down triangle sign mean?",
    options: ["Yield", "Stop", "Merge", "Slow"],
    correct_answer: 0,
    explanation:
      "A red and white upside-down triangle is a YIELD sign. You must slow down and be prepared to stop if necessary to let traffic or pedestrians pass.",
  },
  {
    id: "il-ts-010",
    question_text: "What color are warning signs?",
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

// ---------------------------------------------------------------------------
// Sub-components (server-component safe — no hooks/state)
// ---------------------------------------------------------------------------

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
      {/* SVG sign representation */}
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
              <text
                x="48"
                y="55"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {isDiamond && (
            <>
              <polygon
                points="48,6 90,48 48,90 6,48"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="3"
              />
              <text
                x="48"
                y="54"
                textAnchor="middle"
                fontSize="20"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {isInvertedTriangle && (
            <>
              <polygon
                points="48,84 6,12 90,12"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="4"
              />
              <polygon
                points="48,76 12,16 84,16"
                fill="#ffffff"
                stroke="none"
              />
              <text
                x="48"
                y="48"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {isPentagon && (
            <>
              <polygon
                points="48,6 90,30 78,84 18,84 6,30"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="3"
              />
              <text
                x="48"
                y="56"
                textAnchor="middle"
                fontSize="22"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {isCircle && (
            <>
              <circle cx="48" cy="48" r="42" fill={sign.colorHex} stroke={sign.borderColor} strokeWidth="3" />
              <text
                x="48"
                y="56"
                textAnchor="middle"
                fontSize="28"
                fontWeight="bold"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {isShield && (
            <>
              <path
                d="M48,4 L88,16 L88,56 Q88,80 48,92 Q8,80 8,56 L8,16 Z"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="3"
              />
              <text
                x="48"
                y="56"
                textAnchor="middle"
                fontSize="22"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
                {sign.symbol}
              </text>
            </>
          )}
          {!isOctagon && !isDiamond && !isInvertedTriangle && !isPentagon && !isCircle && !isShield && (
            <>
              <rect
                x="6"
                y="18"
                width="84"
                height="60"
                rx="4"
                fill={sign.colorHex}
                stroke={sign.borderColor}
                strokeWidth="3"
              />
              <text
                x="48"
                y="54"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill={sign.textColor}
                fontFamily="sans-serif"
              >
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

      {/* Semantic meaning */}
      <div className="w-full text-left border-t border-gray-100 pt-3 mt-1">
        <p className="text-xs font-semibold text-blue-700 mb-1">Meaning</p>
        <p className="text-xs text-gray-700 leading-relaxed">{sign.meaning}</p>
        <p className="text-xs font-semibold text-orange-600 mt-2 mb-1">Illinois Rule</p>
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function IllinoisRoadSignsTestPage() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
              Updated for Illinois permit test 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
              Illinois Road Signs Test{" "}
              <span className="text-orange-500">— Study Guide 2026</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Every sign on the Illinois permit test — visual descriptions, shapes, colors, and
              exact meanings. Study regulatory, warning, guide, and construction signs in visual
              format, then quiz yourself for free.
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              Signs make up approximately 10–15 of the 35 questions on the IL SOS written test.
              Master this page and you&apos;ll ace the biggest chunk of the exam.
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
              { label: "Sign questions on the IL test", value: "~12" },
              { label: "Sign categories tested", value: "4" },
              { label: "Practice questions in DriveMaster", value: "3,400+" },
              { label: "Passing score needed", value: "80%" },
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
              Illinois road signs use standardized shapes and colors. Learn these two dimensions and
              you can decode any sign — even if you can&apos;t read the text from a distance.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  shape: "Octagon",
                  color: "Red",
                  meaning: "STOP — always",
                  bg: "bg-red-50 border-red-100",
                  label: "text-red-700",
                },
                {
                  shape: "Inverted Triangle",
                  color: "Red + White",
                  meaning: "YIELD — slow, give way",
                  bg: "bg-red-50 border-red-100",
                  label: "text-red-700",
                },
                {
                  shape: "Diamond",
                  color: "Yellow",
                  meaning: "Warning — hazard ahead",
                  bg: "bg-yellow-50 border-yellow-100",
                  label: "text-yellow-700",
                },
                {
                  shape: "Diamond",
                  color: "Orange",
                  meaning: "Construction / work zone",
                  bg: "bg-orange-50 border-orange-100",
                  label: "text-orange-700",
                },
                {
                  shape: "Pentagon",
                  color: "Fluorescent Yellow-Green",
                  meaning: "School zone / crossing",
                  bg: "bg-lime-50 border-lime-100",
                  label: "text-lime-700",
                },
                {
                  shape: "Rectangle",
                  color: "Green",
                  meaning: "Guide / destination info",
                  bg: "bg-green-50 border-green-100",
                  label: "text-green-700",
                },
                {
                  shape: "Rectangle",
                  color: "White",
                  meaning: "Regulatory — what you must do",
                  bg: "bg-gray-50 border-gray-200",
                  label: "text-gray-700",
                },
                {
                  shape: "Rectangle",
                  color: "Blue",
                  meaning: "Motorist services (gas, food)",
                  bg: "bg-blue-50 border-blue-100",
                  label: "text-blue-700",
                },
                {
                  shape: "Round (yellow)",
                  color: "Yellow / Black",
                  meaning: "Railroad crossing advance",
                  bg: "bg-yellow-50 border-yellow-100",
                  label: "text-yellow-700",
                },
              ].map((row) => (
                <div
                  key={`${row.shape}-${row.color}`}
                  className={`rounded-xl border p-4 ${row.bg}`}
                >
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
                They carry the force of law — ignoring them is a traffic violation. Most are white,
                red, or black.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {regulatorySigns.map((sign) => (
                <SignFigure key={sign.id} sign={sign} />
              ))}
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
                Warning signs alert you to <strong>potential hazards</strong> ahead. They are diamond-shaped
                and yellow (or fluorescent yellow-green for school zones). No legal requirement to stop —
                but you must slow down and use caution.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {warningSigns.map((sign) => (
                <SignFigure key={sign.id} sign={sign} />
              ))}
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
                Orange diamond signs mark <strong>temporary construction zones</strong>. Illinois law doubles
                fines for moving violations committed in active work zones. Treat them with the same
                respect as regulatory signs.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {constructionSigns.map((sign) => (
                <SignFigure key={sign.id} sign={sign} />
              ))}
            </div>
          </div>
        </section>

        {/* Guide Signs */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-green-50/40">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
                Guide Signs
              </h2>
              <p className="text-gray-600">
                Guide signs provide <strong>direction, distance, and services</strong>. Green signs give
                route and destination information; blue signs point to motorist services; brown signs
                mark recreational areas and cultural sites.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guideSigns.map((sign) => (
                <SignFigure key={sign.id} sign={sign} />
              ))}
            </div>
          </div>
        </section>

        {/* Pavement Markings */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-2">
              Pavement Markings
            </h2>
            <p className="text-gray-600 mb-8">
              Pavement markings work alongside signs to guide traffic. The Illinois permit test
              frequently asks about lane colors and what they mean.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  mark: "Solid Yellow Center Line",
                  meaning: "Divides traffic moving in opposite directions.",
                  rule: "Do not cross a solid yellow line to pass.",
                  color: "bg-yellow-400",
                },
                {
                  mark: "Broken Yellow Center Line",
                  meaning: "You may pass when the way is clear.",
                  rule: "Only cross when it is safe to return before oncoming traffic.",
                  color: "bg-yellow-400",
                },
                {
                  mark: "Double Solid Yellow Lines",
                  meaning: "No passing zone in either direction.",
                  rule: "Treat as a median — never cross.",
                  color: "bg-yellow-400",
                },
                {
                  mark: "Solid White Edge Line",
                  meaning: "Marks the right edge of the roadway.",
                  rule: "Do not drive to the right of this line except to park.",
                  color: "bg-gray-100 border border-gray-300",
                },
                {
                  mark: "Broken White Lane Lines",
                  meaning: "Separate lanes of traffic moving in the same direction.",
                  rule: "You may change lanes when it is safe.",
                  color: "bg-gray-100 border border-gray-300",
                },
                {
                  mark: "White Stop Line",
                  meaning: "Marks where you must stop at a sign or signal.",
                  rule: "Stop before — not on — the line.",
                  color: "bg-gray-100 border border-gray-300",
                },
              ].map((item) => (
                <div key={item.mark} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className={`h-2 w-full rounded-full mb-3 ${item.color}`} />
                  <p className="font-bold text-sm text-gray-900 font-display mb-1">{item.mark}</p>
                  <p className="text-xs text-gray-600 mb-2">{item.meaning}</p>
                  <p className="text-xs text-orange-600 font-medium">{item.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Quiz Questions */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 font-display tracking-tight mb-3">
                Sample Illinois Road Sign Questions
              </h2>
              <p className="text-gray-600">
                Real-format questions from our Illinois permit test question bank. Answers and
                explanations are shown — take the full quiz inside DriveMaster.
              </p>
            </div>
            <div className="space-y-6">
              {sampleQuestions.map((q, i) => (
                <SampleQuizCard key={q.id} q={q} index={i} />
              ))}
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
              {faqItems.map((item) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight mb-4">
              Ready to ace the Illinois road signs test?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              DriveMaster&apos;s full visual quiz covers every sign — with Dash explaining each wrong
              answer so you actually remember it.
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
              All 3,400+ questions free. Illinois SOS test topics only.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
