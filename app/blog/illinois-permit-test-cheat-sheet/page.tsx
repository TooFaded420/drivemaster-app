import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://aceyourpermit.com";

export const metadata: Metadata = {
  title: "Illinois Permit Test Cheat Sheet | Ace Your Permit",
  description:
    "A fast Illinois permit test cheat sheet covering signs, right-of-way, school zones, following distance, and test-day study priorities.",
  alternates: { canonical: `${siteUrl}/blog/illinois-permit-test-cheat-sheet` },
  openGraph: {
    title: "Illinois Permit Test Cheat Sheet",
    description:
      "A fast Illinois permit test cheat sheet covering signs, right-of-way, school zones, following distance, and test-day study priorities.",
    url: `${siteUrl}/blog/illinois-permit-test-cheat-sheet`,
  },
};

const sections = [
  {
    title: "Signs first",
    items: [
      "Red octagon means stop. Fully stop before the crosswalk or stop line.",
      "Triangle means yield. Slow down and let traffic or pedestrians go first.",
      "Diamond signs warn you about hazards ahead, like curves, merging traffic, or slippery pavement.",
    ],
  },
  {
    title: "Right-of-way rules",
    items: [
      "At a four-way stop, the first vehicle that stopped goes first.",
      "If two vehicles stop at the same time, the vehicle on the right goes first.",
      "Pedestrians in marked or unmarked crosswalks get priority.",
    ],
  },
  {
    title: "Numbers worth memorizing",
    items: [
      "Illinois school zones commonly test the 20 mph rule when children are present.",
      "Use at least a 3-second following distance in ideal conditions.",
      "The Illinois written test has 35 questions, and 28 correct answers is the passing target.",
    ],
  },
];

export default function IllinoisPermitCheatSheetPage() {
  return (
    <main className="force-light-theme min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Back to blog
        </Link>
        <header className="mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Study guide</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Illinois Permit Test Cheat Sheet
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            If your test is coming up fast, do not try to memorize everything at once. Start with the rules that appear again and again: signs, right-of-way, speed, following distance, and safe-driving judgment.
          </p>
        </header>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-slate-950">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl bg-blue-600 p-6 text-white">
          <h2 className="font-display text-2xl font-bold">Turn this cheat sheet into practice.</h2>
          <p className="mt-2 max-w-2xl text-blue-50">
            Reading helps. Answering questions is what locks it in. Run a short practice test and see what you already know.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/free-illinois-dmv-practice-test">
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                Start Free Practice
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/tools/illinois-permit-readiness-checker">
              <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
                Check Readiness
              </Button>
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
