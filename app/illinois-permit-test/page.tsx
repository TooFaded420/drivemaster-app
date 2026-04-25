import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://aceyourpermit.com";

export const metadata: Metadata = {
  title: "Illinois Permit Test Practice 2026",
  description:
    "Ace the Illinois permit test with 3,400+ free questions. All official IL SOS topics, passing-score tracking, and Dash AI explanations. Start practicing now.",
  alternates: {
    canonical: `${siteUrl}/illinois-permit-test`,
  },
  openGraph: {
    title: "Illinois Permit Test Practice 2026",
    description:
      "Ace the Illinois permit test with 3,400+ free questions. All official IL SOS topics, passing-score tracking, and Dash AI explanations.",
    url: `${siteUrl}/illinois-permit-test`,
  },
};

// 3 sample questions pulled from lib/data/questions/illinois-dmv-questions.ts
// Q1: Traffic Signs (il-ts-001) — sign recognition
// Q2: Traffic Laws / Right-of-Way (il-tl-001) — right-of-way
// Q3: Safe Driving Practices (il-sd-001) — rules of the road
const sampleQuestions = [
  {
    id: "il-ts-001",
    category: "Traffic Signs",
    question: "What does a red octagonal sign mean?",
    options: ["Stop", "Yield", "Do Not Enter", "Wrong Way"],
    correctIndex: 0,
    explanation:
      "A red octagonal (8-sided) sign is the universal STOP sign. You must come to a complete stop at the stop line or before entering the crosswalk or intersection.",
    source: "Illinois Rules of the Road — Chapter 3: Traffic Signs",
  },
  {
    id: "il-tl-001",
    category: "Right-of-Way",
    question: "Who has the right-of-way at a four-way stop?",
    options: [
      "The first vehicle to arrive and stop",
      "The vehicle on the right",
      "The larger vehicle",
      "The vehicle going straight",
    ],
    correctIndex: 0,
    explanation:
      "At a four-way stop, the first vehicle to arrive and come to a complete stop has the right-of-way.",
    source: "Illinois Rules of the Road — Chapter 8: Right-of-Way",
  },
  {
    id: "il-sd-001",
    category: "Safe Driving Practices",
    question: "What is the minimum following distance under ideal conditions?",
    options: [
      "3 seconds behind the vehicle ahead",
      "1 second behind",
      "5 seconds behind",
      "10 seconds behind",
    ],
    correctIndex: 0,
    explanation:
      "Under ideal conditions, maintain at least a 3-second following distance. Increase this distance in adverse conditions.",
    source:
      "Illinois Rules of the Road — Chapter 10: Safe Following Distance",
  },
];

const faqItems = [
  {
    question: "How many questions are on the Illinois permit test?",
    answer:
      "The Illinois permit test has 35 questions. You need to answer at least 28 correctly (80%) to pass.",
  },
  {
    question: "What is the passing score for the Illinois permit test?",
    answer:
      "You need 28 out of 35 questions correct, which is an 80% passing threshold. The test covers road signs, traffic laws, safe driving, and Illinois-specific rules.",
  },
  {
    question:
      "How many times can I take the Illinois permit test if I fail?",
    answer:
      "There is no statewide limit on retakes, but you must pay the testing fee again each time. Some Secretary of State facilities may require a waiting period between attempts. Study with Ace Your Permit between attempts so you know exactly what to fix.",
  },
  {
    question: "What do I need to bring to the DMV for my permit test?",
    answer:
      "You need proof of identity (such as a birth certificate or passport), your Social Security number, proof of Illinois residency (two documents), and the applicable fee. If you are under 18, a parent or guardian must sign your application.",
  },
  {
    question: "Can I take the Illinois permit test at 15?",
    answer:
      "Yes — if you are 15 and enrolled in an approved driver education course through your school or a licensed provider, you can apply for an Illinois instruction permit. Without driver's ed enrollment, the minimum age is 17 years and 3 months.",
  },
  {
    question: "How long does the Illinois permit test take?",
    answer:
      "Most applicants finish in 20-30 minutes. The test is not timed, so you can work at your own pace. Taking timed practice tests on Ace Your Permit beforehand helps you get comfortable with the format.",
  },
  {
    question:
      "What is the difference between the permit test and the driving test?",
    answer:
      "The permit (written knowledge) test is a 35-question multiple-choice exam at a Secretary of State facility. The driving test is a behind-the-wheel road evaluation you take after holding your permit for the required period. You must pass the permit test before you can schedule the driving test.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/illinois-permit-test#faq`,
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
      "@id": `${siteUrl}/illinois-permit-test#course`,
      name: "Illinois Permit Test Practice 2026",
      description:
        "Free interactive practice for the Illinois Secretary of State written knowledge (permit) test. Covers all 9 official topic areas with 3,400+ questions, passing-score tracking, and AI-powered explanations.",
      provider: {
        "@type": "Organization",
        name: "Ace Your Permit",
        url: siteUrl,
      },
      educationalLevel: "High School",
      about: {
        "@type": "Thing",
        name: "Illinois Learner's Permit",
      },
      isAccessibleForFree: true,
      url: `${siteUrl}/illinois-permit-test`,
    },
  ],
};

export default function IllinoisPermitTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-display">
                Ace Your Permit
              </span>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#2563EB] hover:bg-blue-700 h-11 min-w-[44px]">
                Start Free
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Free for Illinois teens — no credit card needed
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
              Illinois Permit Test{" "}
              <span className="text-[#2563EB]">Practice 2026</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              3,400+ free questions covering every official Illinois SOS topic.
              Passing-score tracking and Dash AI explanations included — no
              signup wall for practice.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#2563EB] hover:bg-blue-700 text-lg px-8 h-12 min-w-[44px]"
                >
                  Start Free Practice
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/quiz/practice">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-12 border-[#2563EB] text-[#2563EB] min-w-[44px]"
                >
                  Try Practice Questions
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2563EB] font-display">
                  35
                </div>
                <div className="text-sm text-gray-500">Questions on test</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F97316] font-display">
                  80%
                </div>
                <div className="text-sm text-gray-500">Passing score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10B981] font-display">
                  3,400+
                </div>
                <div className="text-sm text-gray-500">Practice Qs</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
          {/* Sample Questions */}
          <section aria-labelledby="sample-questions-heading">
            <h2
              id="sample-questions-heading"
              className="text-2xl font-bold text-gray-900 mb-2 font-display"
            >
              Try 3 Real Illinois Permit Test Questions
            </h2>
            <p className="text-gray-600 mb-6">
              These come straight from our question bank, built from the
              official Illinois Rules of the Road handbook. Click{" "}
              <strong>Reveal Answer</strong> to check yourself.
            </p>

            <div className="space-y-6">
              {sampleQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-sm font-bold font-display">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <span className="inline-block text-xs font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                        {q.category}
                      </span>
                      <p className="text-gray-900 font-semibold text-lg leading-snug">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <ol className="space-y-2 mb-4 pl-11" type="A">
                    {q.options.map((opt, oIdx) => (
                      <li key={oIdx} className="flex items-center gap-2 text-gray-700">
                        <span className="w-6 h-6 flex-shrink-0 rounded border border-gray-300 flex items-center justify-center text-xs font-mono text-gray-500">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </li>
                    ))}
                  </ol>

                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-[#F97316] hover:text-orange-600 list-none flex items-center gap-1 min-h-[44px]">
                      <span className="group-open:hidden">Reveal Answer</span>
                      <span className="hidden group-open:inline">
                        Hide Answer
                      </span>
                    </summary>
                    <div className="mt-3 pl-0 border-l-4 border-[#10B981] pl-4 bg-green-50 rounded-r-lg py-3 pr-3">
                      <p className="text-sm font-semibold text-green-800 mb-1">
                        Correct:{" "}
                        <span className="font-bold">
                          {String.fromCharCode(65 + q.correctIndex)}.{" "}
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                      <p className="text-sm text-green-900">{q.explanation}</p>
                      <p className="text-xs text-green-700 mt-2 italic">
                        Source: {q.source}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/quiz/practice">
                <Button
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] h-11 min-w-[44px]"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Try 500+ More Questions Free
                </Button>
              </Link>
            </div>
          </section>

          {/* Educational Content */}
          <section
            aria-labelledby="about-heading"
            className="prose prose-gray max-w-none prose-headings:font-display prose-headings:tracking-tight"
          >
            <h2
              id="about-heading"
              className="text-2xl font-bold text-gray-900 font-display"
            >
              What Is the Illinois Permit Test?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Illinois permit test — formally called the written knowledge
              exam — is a 35-question multiple-choice test administered by the
              Illinois Secretary of State (SOS). You must pass it before you
              can get an instruction permit and start learning to drive with a
              licensed adult. The questions are drawn directly from the{" "}
              <em>Illinois Rules of the Road</em> handbook, which the SOS
              publishes and updates annually.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You need at least 28 correct answers out of 35 — an 80% passing
              score. Questions cover road signs, traffic signals, right-of-way
              rules, speed limits, safe driving practices, alcohol and drug
              laws, and Illinois-specific regulations like Scott&apos;s Law and the
              Graduated Driver Licensing (GDL) program.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Most first-time test takers who study with quality practice
              questions pass on their first attempt. Ace Your Permit exists to
              make that outcome the norm, not the exception.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              What Topics Are Covered on the Illinois Permit Test?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Illinois SOS does not publish an exact topic breakdown, but
              based on the official handbook the test draws from nine core
              subject areas:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Traffic Signs &amp; Signals</strong> — regulatory
                signs, warning signs, guide signs, traffic lights, flashing
                signals, and pavement markings
              </li>
              <li>
                <strong>Traffic Laws &amp; Rules of the Road</strong> —
                right-of-way, turns, lane changes, merging, and general
                traffic law
              </li>
              <li>
                <strong>Speed Limits</strong> — default urban, school zone,
                construction zone, and highway limits
              </li>
              <li>
                <strong>Safe Driving Practices</strong> — following distance,
                blind spots, defensive driving, and hazard awareness
              </li>
              <li>
                <strong>Sharing the Road</strong> — pedestrians, cyclists,
                motorcycles, large trucks, and emergency vehicles
              </li>
              <li>
                <strong>Alcohol &amp; Drug Laws</strong> — DUI, implied
                consent, BAC limits, and zero-tolerance for drivers under 21
              </li>
              <li>
                <strong>Parking &amp; Emergency Situations</strong> —
                parallel parking, no-parking zones, breakdowns, and crashes
              </li>
              <li>
                <strong>Illinois-Specific Laws</strong> — Scott&apos;s Law (Move
                Over), GDL restrictions, cell phone bans, and insurance
                requirements
              </li>
              <li>
                <strong>Vehicle Equipment</strong> — required safety features,
                headlight use, and seat belt laws
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Ace Your Permit covers all nine areas with questions written to
              match the difficulty and phrasing of the real test.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              How Many Questions Are on the Illinois Permit Test?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The test has exactly <strong>35 questions</strong>. You need to
              answer at least <strong>28 correctly (80%)</strong> to pass.
              That means you can miss up to 7 questions and still get your
              permit.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The test is not timed — most people finish in 20 to 30 minutes.
              The format is multiple choice with four answer options per
              question. There is no partial credit; each question is worth one
              point.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you fail, you can retake the test (typically after paying the
              fee again). The SOS does not cap the number of retakes, but
              studying smarter between attempts is the real strategy. That is
              what Ace Your Permit&apos;s adaptive practice mode is designed for —
              it spots your weak spots and drills them until they stick.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              How to Pass the Illinois Permit Test: A Study Plan That Works
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Most teens who fail the permit test do so because they tried to
              memorize the entire handbook in one sitting. That does not work.
              What does work is spaced, active practice — answering real
              questions, reviewing explanations for every wrong answer, and
              repeating the topics where you keep slipping.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Here is a practical two-week plan:
            </p>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>
                <strong>Days 1-3:</strong> Read the Illinois Rules of the Road
                handbook once, cover to cover. Do not memorize — just get
                familiar. Download it free from the Illinois SOS website.
              </li>
              <li>
                <strong>Days 4-10:</strong> Do 50+ practice questions per day
                on Ace Your Permit, category by category. Start with Traffic Signs
                (the easiest to learn visually), then Traffic Laws, then the
                rest.
              </li>
              <li>
                <strong>Days 11-13:</strong> Focus on your weak areas. Use
                Ace Your Permit&apos;s category stats to see where your accuracy is
                below 80% and drill those specifically.
              </li>
              <li>
                <strong>Day 14:</strong> Take two or three full timed practice
                tests (35 questions, 30 minutes) to simulate the real experience.
                If you score 80%+ consistently, you are ready.
              </li>
            </ol>
            <p className="text-gray-700 leading-relaxed">
              Even 15 minutes of practice per day beats one long cram session.
              Consistency is the variable that separates first-time passers from
              repeat test takers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              What to Expect at the Illinois Secretary of State Office
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Walk-ins are accepted at most Illinois SOS facilities, but
              appointments are faster. You can schedule online at the
              Illinois Secretary of State website. Bring the following:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Proof of identity</strong> — birth certificate,
                passport, or other acceptable document
              </li>
              <li>
                <strong>Social Security number</strong> — card or a document
                showing your full SSN
              </li>
              <li>
                <strong>Two proofs of Illinois residency</strong> — utility
                bill, bank statement, or school records work
              </li>
              <li>
                <strong>Parent or guardian signature</strong> — required if
                you are under 18
              </li>
              <li>
                <strong>Application fee</strong> — current fee listed on the
                SOS website; pay by cash, check, or card
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The written test is taken on a computer at the SOS office. You
              will get your result immediately. If you pass, you receive a
              temporary paper permit the same day; the official card arrives
              by mail.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              Illinois Graduated Driver Licensing (GDL): What Permit Holders
              Need to Know
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Illinois uses a Graduated Driver Licensing system that limits
              what new drivers can do until they gain more experience. As an
              instruction permit holder under 18:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                You must always drive with a licensed driver aged 21 or older
                in the front seat
              </li>
              <li>
                Night driving is restricted — no driving between 10 PM and 6 AM
              </li>
              <li>
                You must complete a minimum number of supervised driving hours
                (50 total, 10 at night) before you can apply for a license
              </li>
              <li>
                You cannot use a cell phone — not even hands-free — while
                driving
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              These GDL rules are tested on the permit exam, so understanding
              them matters twice: once to pass the test, and again to stay legal
              while you practice driving. Ace Your Permit includes a dedicated
              Illinois-Specific Laws category that covers GDL in detail.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 font-display mt-10">
              Why Ace Your Permit vs. Other Illinois Permit Test Prep Options
            </h2>
            <p className="text-gray-700 leading-relaxed">
              There are several permit test prep products on the market —
              Zutobi, Aceable, and the SOS&apos;s own practice questions among them.
              Here is how Ace Your Permit is different:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Built for Illinois teens, not generic users</strong> —
                every question and explanation is written for the IL SOS test
                specifically
              </li>
              <li>
                <strong>Completely free to start</strong> — all 3,400+
                questions, no credit card, no 7-day trial that auto-renews
              </li>
              <li>
                <strong>Dash AI explanations</strong> — wrong answer? Dash
                (our AI coach) explains exactly why in plain English, not
                textbook jargon
              </li>
              <li>
                <strong>Adaptive difficulty</strong> — the app surfaces the
                questions you keep missing, so study time goes where it
                matters most
              </li>
              <li>
                <strong>Gamified streaks and progress</strong> — daily streaks
                and category mastery badges keep practice from feeling like
                homework
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              If you are a teen in Illinois who wants to pass the permit test
              without paying $30+ for a prep course, Ace Your Permit is the
              free alternative that actually works.
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="text-2xl font-bold text-gray-900 mb-6 font-display"
            >
              Illinois Permit Test — Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary className="cursor-pointer flex items-center justify-between px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none min-h-[44px]">
                    <span>{item.question}</span>
                    <span className="ml-4 flex-shrink-0 text-[#2563EB] group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-1 text-gray-700 leading-relaxed border-t border-gray-100">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Dash block */}
          <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex-shrink-0 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xl">
                🚗
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Dash says:
                </p>
                <p className="text-gray-700">
                  The permit test is 35 questions — you only need to nail 28 of
                  them. That is totally doable with a week of smart practice. Start now and Dash will flag every weak spot before you even walk into the SOS office.
                </p>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="text-center py-12 border-t border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">
              Ready to pass? Start free practice.
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Join thousands of Illinois teens who used Ace Your Permit to pass
              their permit test on the first try. Free, no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#2563EB] hover:bg-blue-700 text-lg px-10 h-12 min-w-[44px]"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/quiz/practice">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 h-12 border-[#F97316] text-[#F97316] hover:bg-orange-50 min-w-[44px]"
                >
                  <Clock className="mr-2 w-5 h-5" />
                  Take a Timed Practice Test
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
