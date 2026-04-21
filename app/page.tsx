import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dash } from "@/components/mascot";
import { MASCOT_MESSAGES } from "@/lib/constants/mascot";
import {
  Car,
  Trophy,
  Target,
  Flame,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const faqItems = [
  {
    question: "How many questions are on the Illinois permit test?",
    answer: "35 questions. You need 28 correct (80%) to pass.",
  },
  {
    question: "What's the minimum age to get an Illinois permit?",
    answer: "15 if you're enrolled in an approved driver's ed course, 17 years and 3 months otherwise.",
  },
  {
    question: "Is DriveMaster free?",
    answer: "Yes. All 3,400+ practice questions, zero credit card required.",
  },
  {
    question: "Does this cover the real IL SOS test topics?",
    answer: "Yes — road signs, rules of the road, traffic laws, sharing the road, and vehicle operation. Everything on the official test.",
  },
  {
    question: "How should I use DriveMaster to study?",
    answer: "Mix Practice Mode (build skills) with Timed Mode (simulate the real test). Even 15 min/day makes a huge difference.",
  },
  {
    question: "What happens if I fail the practice tests?",
    answer: "Dash breaks down every wrong answer so you actually learn it. Retry as many times as you want — no judgment.",
  },
  {
    question: "Do I need an account?",
    answer: "Yes — so we can save your streak and track which questions you've already mastered.",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DriveMaster</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="h-11">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 h-11">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dash */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Built specifically for Illinois teens
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight font-display tracking-tight">
                Master Your Illinois<br />
                <span className="text-blue-600">Driving Test</span> with Confidence
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Interactive practice questions, gamified learning, and personalized study plans
                to help you pass your permit or license test on the first try.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Try Practice Question
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Dash Mascot */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-orange-100 rounded-full opacity-30 blur-3xl scale-150" />

                {/* Dash with welcome message */}
                <div className="relative">
                  <Dash
                    emotion="happy"
                    size="xl"
                    animate={true}
                    showSpeechBubble={true}
                    speechTitle={MASCOT_MESSAGES.welcome.title}
                    speechText={MASCOT_MESSAGES.welcome.message}
                    speechPosition="left"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Value Props Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-display tracking-tight mb-1">Free to Start</div>
              <div className="text-gray-600">No credit card, no trial. All 3,400+ questions unlocked.</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 font-display tracking-tight mb-1">IL-Official Topics</div>
              <div className="text-gray-600">Road signs, rules, traffic laws — everything on the real SOS test.</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 font-display tracking-tight mb-1">Teen-First Design</div>
              <div className="text-gray-600">Built for Illinois teens aged 15-17, not generic test-takers.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Dash Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Meet Your Study Buddy
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dash will guide you through your learning journey, celebrate your wins,
              and keep you motivated every step of the way!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Dash emotion="happy" size="lg" animate={true} />
                </div>
                <CardTitle>Always Encouraging</CardTitle>
                <CardDescription>
                  Dash celebrates your progress and keeps you motivated
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Dash emotion="thinking" size="lg" animate={true} />
                </div>
                <CardTitle>Helpful Hints</CardTitle>
                <CardDescription>
                  Get helpful tips and explanations when you need them most
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Dash emotion="excited" size="lg" animate={true} />
                </div>
                <CardTitle>Celebrates Success</CardTitle>
                <CardDescription>
                  Every achievement is celebrated with enthusiasm and joy
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Everything You Need to Pass
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to make studying engaging and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Illinois-Specific Content</CardTitle>
                <CardDescription>
                  Questions based on the official Illinois Rules of the Road handbook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Updated for 2026
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Covers all test categories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Detailed explanations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Earn XP, maintain streaks, and unlock achievements as you study
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Daily streaks
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    XP and leveling system
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Achievement badges
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Personalized Practice</CardTitle>
                <CardDescription>
                  Adaptive learning that focuses on your weak areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Smart question selection
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Mistake review mode
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Progress tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Compete & Win</CardTitle>
                <CardDescription>
                  Join leaderboards and compete with other learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Weekly competitions
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Tiered leagues
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Special challenges
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Test Simulators</CardTitle>
                <CardDescription>
                  Practice with timed tests that mirror the real DMV exam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Timed practice tests
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Same format as DMV
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Pass/fail prediction
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Study Together</CardTitle>
                <CardDescription>
                  Learn with friends and family through shared experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Share progress
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Challenge friends
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Family accounts
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display tracking-tight">
              Illinois Permit Test — FAQs
            </h2>
            <p className="text-gray-600">
              Real answers, no fluff. Everything you need to know before test day. 🎯
            </p>
          </div>

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

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* CTA Section with Dash */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Dash emotion="excited" size="xl" animate={true} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Free to start, Illinois-specific, and designed to actually make studying not boring. Let&apos;s go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-600 text-lg px-8">
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">DriveMaster</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-center text-gray-600 text-sm">
            © 2026 DriveMaster. All rights reserved. Not affiliated with the Illinois Secretary of State.
          </p>
        </div>
      </footer>
    </div>
  );
}
