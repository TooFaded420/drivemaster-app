import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Star,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

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
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
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
                <Star className="w-4 h-4 fill-current" />
                Trusted by 10,000+ Illinois drivers
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 blur-3xl scale-150" />
                
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

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-gray-600">Pass Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9</div>
              <div className="text-gray-600">App Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Dash Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
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

      {/* CTA Section with Dash */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Dash emotion="excited" size="xl" animate={true} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful drivers who passed their test with DriveMaster. 
            It's free to get started!
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
          <p className="text-center text-gray-600 text-sm">
            © 2026 DriveMaster. All rights reserved. Not affiliated with the Illinois Secretary of State.
          </p>
        </div>
      </footer>
    </div>
  );
}
