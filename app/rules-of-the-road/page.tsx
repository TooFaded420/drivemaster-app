import type { Metadata } from "next";
import Link from "next/link";
import { Car, BookOpen, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://drivemaster-app.vercel.app";

const title = "Illinois Rules of the Road — 2026 Handbook Summary";
const description =
  "Free summary of every chapter in the Illinois Rules of the Road handbook. Plus 3,400+ practice questions tied to each section — pass the permit test 3x faster than reading the PDF.";
const canonical = `${siteUrl}/rules-of-the-road`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "illinois rules of the road",
    "rules of the road illinois handbook",
    "illinois rules of the road summary",
    "illinois sos rules of the road",
    "illinois permit test 2026",
    "illinois driver handbook",
  ],
  alternates: { canonical: "/rules-of-the-road" },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "DriveMaster",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// ─── Sample questions ───────────────────────────────────────────────────────

const sampleQuestions = [
  {
    id: "il-tl-002",
    category: "Traffic Laws & Rules of the Road",
    question:
      "If two vehicles arrive at a four-way stop at the same time, who has the right-of-way?",
    options: [
      "The vehicle on the right",
      "The vehicle on the left",
      "The larger vehicle",
      "The vehicle going faster",
    ],
    correct: 0,
    explanation:
      "When two vehicles arrive at a four-way stop at the same time, the vehicle on the right has the right-of-way. This rule prevents gridlock and keeps traffic flowing safely.",
  },
  {
    id: "il-sr-003",
    category: "Sharing the Road",
    question: "How much space must you give when passing a bicycle?",
    options: [
      "At least 3 feet",
      "1 foot",
      "6 inches",
      "No specific distance required",
    ],
    correct: 0,
    explanation:
      "Illinois law requires motorists to give at least 3 feet of clearance when passing a bicycle. Giving extra space keeps cyclists safe and is required by state law.",
  },
  {
    id: "il-ve-001",
    category: "Vehicle Equipment & Maintenance",
    question: "When must you use your headlights?",
    options: [
      "From sunset to sunrise and when visibility is less than 1,000 feet",
      "Only at night",
      "Only in the rain",
      "Only on highways",
    ],
    correct: 0,
    explanation:
      "You must use headlights from sunset to sunrise, and whenever weather conditions reduce visibility to less than 1,000 feet — including fog, rain, and snow.",
  },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────

const faqItems = [
  {
    question: "Do I have to read the whole Rules of the Road handbook?",
    answer:
      "Not word for word. The handbook is the official source, but you need to absorb the concepts — not memorize every page. This summary hits every chapter's highest-value points, and DriveMaster's 3,400+ practice questions reinforce the material interactively.",
  },
  {
    question: "How long is the Illinois Rules of the Road book?",
    answer:
      "The official Illinois Secretary of State handbook is roughly 100 pages across multiple chapters covering licensing, traffic laws, road sharing, vehicle operation, and more. Most teens take 3–6 hours to read it cover to cover.",
  },
  {
    question: "Where can I download the handbook for free?",
    answer:
      "The Illinois Secretary of State publishes the Rules of the Road handbook as a free PDF at ilsos.gov. You can also pick up a printed copy at any SOS facility. This page summarizes the key content so you can study more efficiently.",
  },
  {
    question: "Does DriveMaster cover everything in the handbook?",
    answer:
      "Yes — every chapter of the handbook maps to a question category in DriveMaster. Traffic Laws, Road Signs, Safe Driving, Alcohol & Drug Laws, Sharing the Road, Parking & Emergencies, Vehicle Equipment, Road Conditions, and Illinois-Specific Laws are all covered.",
  },
  {
    question:
      "What's the difference between the handbook and online practice tests?",
    answer:
      "The handbook explains the rules; practice tests check whether you retained them. The real permit test pulls from the same topics as the handbook, so reading + practicing together is the fastest path to passing.",
  },
  {
    question: "Are the Rules of the Road the same for every state?",
    answer:
      "No. Traffic laws share a lot of overlap nationally but differ by state on specifics like speed limits, GDL rules, move-over laws, and cell phone regulations. This page and DriveMaster cover Illinois rules only — the exact content on the IL SOS permit test.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

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

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Illinois Rules of the Road — Permit Test Prep",
  description:
    "A gamified course covering every chapter of the Illinois Rules of the Road handbook with 3,400+ practice questions.",
  provider: {
    "@type": "Organization",
    name: "DriveMaster",
    sameAs: siteUrl,
  },
  url: canonical,
  educationalLevel: "BeginnerLevel",
  teaches: "Illinois driving laws, traffic signs, safe driving, and vehicle operation",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT3H",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function RulesOfTheRoadPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Nav */}
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-display">DriveMaster</span>
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
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Illinois SOS Handbook — 2026 Edition
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
              Illinois Rules of the Road —{" "}
              <span className="text-blue-600">2026 Handbook Summary</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Free chapter-by-chapter summary of the official Illinois Secretary of State handbook.
              3,400+ practice questions tied to each section. Pass the permit test 3x faster
              than reading the PDF. 📘
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 h-12 min-h-[44px]"
                >
                  Practice Free — No Account Needed
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-12 min-h-[44px]"
                >
                  Try a Practice Question
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="py-8 px-4 bg-white border-y">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 font-display tracking-tight">7 Chapters</div>
              <div className="text-gray-600 text-sm mt-1">Every section of the official handbook</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 font-display tracking-tight">3,400+ Questions</div>
              <div className="text-gray-600 text-sm mt-1">Mapped to each handbook topic</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 font-display tracking-tight">100% Free</div>
              <div className="text-gray-600 text-sm mt-1">No credit card, no paywall</div>
            </div>
          </div>
        </section>

        {/* Body — Handbook Chapters */}
        <article className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-gray prose-lg">

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-0">
              Chapter 1: Driver Licensing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Before you ever start an engine, Illinois requires you to hold the right credential
              for your age. Teens aged 15 with an approved driver's education enrollment can apply
              for an Instruction Permit. Without driver's ed, the minimum age rises to 17 years and
              3 months. The permit lets you practice with a licensed driver (age 21+) in the front
              seat at all times.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Illinois runs a Graduated Driver Licensing (GDL) program with three stages: Instruction
              Permit, Graduated License (Probationary), and a full Graduated License. Each stage has
              passenger restrictions and nighttime driving limits designed to build experience before
              solo driving. Violating GDL restrictions can delay your full license or result in suspension.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The written knowledge test — the one DriveMaster preps you for — covers road signs,
              traffic laws, and safe driving practices. You must answer at least 28 of 35 questions
              correctly (80%) to pass. You can retake the test, but a fresh study session before each
              attempt is your fastest route to a passing score.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 2: Traffic Laws
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Traffic laws form the backbone of the permit test. Right-of-way rules are the most
              heavily tested topic: at a four-way stop, the first vehicle to arrive goes first; if two
              arrive simultaneously, yield to the vehicle on the right. At T-intersections, drivers on
              the terminating road yield to through traffic. When turning left, you always yield to
              oncoming traffic and pedestrians in the crosswalk.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Speed limits in Illinois default to 30 mph in urban areas and 65 mph on most rural
              interstates — but posted limits always override. School zones drop to 20 mph when children
              are present. The "Basic Speed Rule" means you can be cited for driving too fast for
              conditions even if you're under the posted limit during rain, fog, or construction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cell phone laws are strict for new drivers: teens under 19 may not use a handheld device
              at all while driving — not even at a red light. Any use is a moving violation. Hands-free
              is required, and even that is discouraged under Illinois GDL rules.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 3: Traffic Signs & Signals
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Illinois recognizes three main sign families: regulatory (red/white, must obey), warning
              (yellow/diamond, slow down and be alert), and guide/informational (green/blue, direction
              and services). The permit test includes photo-based sign identification — you need to
              recognize shapes and colors even without reading the text.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Traffic signal rules catch a lot of new drivers: a yellow light means prepare to stop, not
              speed up. A flashing red is treated as a stop sign; a flashing yellow means proceed with
              caution. A green arrow means you have a protected turn — oncoming traffic is stopped.
              Always check for pedestrians before completing any turn.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pavement markings matter just as much as signs. A solid yellow center line means no
              passing. A broken yellow line means passing is allowed when safe. White lines separate
              traffic moving in the same direction. Crosswalk lines and stop bars tell you exactly where
              to stop at intersections.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 4: Sharing the Road
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Sharing the road is one of the most tested chapters because modern roads involve far more
              than just cars. Illinois requires at least 3 feet of clearance when passing a bicyclist.
              Cyclists can legally take the full lane when the lane is too narrow to share. At crosswalks,
              you must yield to pedestrians in your half of the road — or approaching closely enough to
              be at risk.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Emergency vehicles (lights/sirens active) require you to pull to the right and stop until
              they pass. Scott's Law — Illinois's "Move Over" law — additionally requires drivers to
              slow down and change lanes away from emergency and maintenance vehicles stopped on the
              roadside. Violating Scott's Law carries heavy fines and potential license suspension.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Large trucks have massive blind spots: front 20 feet, rear 30 feet, and both sides. If you
              can't see the truck's mirrors, the driver can't see you. Never cut in front of a truck
              suddenly, and give extra following distance — a fully loaded semi needs nearly twice the
              stopping distance of a passenger car.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 5: Vehicle Operation & Safe Driving Tips
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Defensive driving is the core concept Illinois tests in this chapter. The 3-second following
              distance rule (2–4 seconds in good conditions, double in rain or bad weather) gives you
              space to react before a crash. Always scan ahead at least 12 seconds and check mirrors
              every 5–8 seconds to maintain situational awareness.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Blind-spot checks — physically turning your head before lane changes — are required
              technique, not optional. Mirrors alone miss a zone beside and slightly behind your vehicle.
              When merging onto a highway from an entrance ramp, yield to traffic already on the
              highway and match highway speeds before merging.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Adverse weather demands adjusted technique. In rain or snow, reduce speed, increase
              following distance, and avoid hard braking. If you hydroplane, ease off the gas and
              steer straight until traction returns — do not brake sharply. In fog, use low-beam
              headlights: high beams reflect off fog and reduce your visibility further.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 6: Crashes, DUI & Implied Consent
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Illinois's DUI laws are among the toughest in the nation for new drivers. The standard
              Blood Alcohol Concentration (BAC) limit is 0.08% for drivers 21+. For drivers under 21,
              Illinois enforces a Zero Tolerance law: any measurable BAC (0.00%) results in an automatic
              license suspension. A first DUI conviction brings a minimum one-year license revocation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Implied Consent means that by driving on Illinois roads, you automatically agree to
              chemical testing (breath, blood, or urine) if law enforcement suspects impairment. Refusing
              the test triggers an automatic Statutory Summary Suspension — longer than if you had taken
              and failed the test. There is no winning by refusing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              After a crash, Illinois law requires you to stop immediately, render reasonable aid, and
              exchange information (name, address, license plate, insurance) with all involved parties.
              Crashes involving injury, death, or property damage over $1,500 must be reported to law
              enforcement. Leaving the scene is a felony.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mt-10">
              Chapter 7: Vehicle Equipment Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Illinois mandates specific equipment on every vehicle operated on public roads. Headlights
              must be on from sunset to sunrise and any time visibility drops below 1,000 feet — fog,
              rain, and snow all qualify. High beams must be dimmed within 500 feet of an oncoming
              vehicle or 300 feet when following another car.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Seat belts are required for all occupants. Children under age 8 must be in an approved
              child safety seat or booster seat. Teen drivers are personally responsible for ensuring all
              passengers under 19 are buckled — a violation is a separate citation from the driver
              responsibility law.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Tire tread must be at least 2/32 of an inch deep. Worn tires dramatically reduce
              stopping distances on wet roads. Turn signals are required when turning, changing lanes,
              or pulling away from the curb — even when no other traffic appears to be present. Brake
              lights, horns, and windshield wipers must all be in working order.
            </p>

          </div>
        </article>

        {/* Sample Questions */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mb-2 text-center">
              Sample Practice Questions
            </h2>
            <p className="text-gray-600 text-center mb-10">
              These are real questions from DriveMaster's bank — drawn directly from the Illinois
              handbook chapters above. Click "Show Answer" to check yourself.
            </p>
            <div className="space-y-6">
              {sampleQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {q.category}
                    </span>
                    <span className="text-xs text-gray-400">Q{idx + 1}</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-4">{q.question}</p>
                  <ol className="space-y-2 mb-4">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-gray-700 text-sm"
                      >
                        <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-mono shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </li>
                    ))}
                  </ol>
                  <details className="group">
                    <summary className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 list-none select-none">
                      <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                      Show Answer
                    </summary>
                    <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="font-semibold text-green-800">
                          Answer: {q.options[q.correct]}
                        </span>
                      </div>
                      <p className="text-green-700 text-sm">{q.explanation}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 h-12 min-h-[44px]"
                >
                  Get All 3,400+ Questions Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight mb-2 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-center mb-10">
              Everything you wanted to know about the Illinois Rules of the Road handbook.
            </p>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group bg-white border border-gray-200 rounded-2xl"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none">
                    <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white font-display tracking-tight mb-4">
              Handbook covered. Time to practice.
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              DriveMaster turns every chapter of the Illinois Rules of the Road into interactive
              practice questions. Gamified, free, and built for teens. Start now — the permit test
              is closer than you think.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 h-12 min-h-[44px] font-semibold"
                >
                  Start Practicing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-blue-700 text-lg px-8 h-12 min-h-[44px]"
                >
                  Try Practice Mode
                </Button>
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              No account required to start. No credit card. Ever.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-white border-t">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 font-display">DriveMaster</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/quiz" className="hover:text-gray-900 transition-colors">Practice</Link>
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/signup" className="hover:text-gray-900 transition-colors">Sign Up</Link>
            </nav>
            <p>&copy; {new Date().getFullYear()} DriveMaster. Not affiliated with Illinois SOS.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
