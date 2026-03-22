"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Mascot } from "@/components/mascot";
import { features } from "@/lib/feature-flags";
import Link from "next/link";
import { Trophy, Clock, ArrowRight, Copy, Check } from "lucide-react";

/**
 * /challenge/[id] — Challenge quiz page
 *
 * Flow:
 *   1. Load challenge + questions
 *   2. User takes quiz (same questions as creator)
 *   3. Submit result → show comparison
 *
 * States:
 *   loading    → skeleton
 *   expired    → friendly message + practice CTA
 *   not_found  → 404 message
 *   quiz       → take the quiz
 *   completed  → score comparison
 */

interface ChallengeData {
  challenge: {
    id: string;
    creatorId: string;
    creatorName: string;
    status: string;
    expiresAt: string;
    questionCount: number;
  };
  questions: any[];
  results: any[];
}

export default function ChallengePage() {
  if (!features.challenges) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">Challenges Coming Soon</h1>
          <p className="mt-2 text-muted-foreground">This feature is on its way!</p>
          <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <ChallengePageInner />;
}

function ChallengePageInner() {
  const params = useParams();
  const challengeId = params.id as string;
  const [data, setData] = useState<ChallengeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChallenge() {
      try {
        const res = await fetch(`/api/challenges/${challengeId}`);
        if (res.status === 410) {
          setExpired(true);
          return;
        }
        if (res.status === 404) {
          setError("Challenge not found");
          return;
        }
        if (!res.ok) {
          setError("Failed to load challenge");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Network error");
      } finally {
        setIsLoading(false);
      }
    }
    loadChallenge();
  }, [challengeId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <Mascot emotion="thinking" size="lg" />
          <p className="mt-4 text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Mascot emotion="encouraging" size="lg" />
        <h1 className="mt-4 text-2xl font-bold">Challenge Expired</h1>
        <p className="mt-2 text-muted-foreground">
          This challenge has ended. But you can still practice!
        </p>
        <Link
          href="/quiz/practice"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Start Practice <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold">Oops</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Link href="/dashboard" className="mt-4 text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!data) return null;

  // Show comparison if results exist
  const hasResults = data.results.length > 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Challenge header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-accent to-orange-400 p-6 text-white text-center">
        <div className="text-sm font-medium opacity-80">Challenge from</div>
        <div className="text-2xl font-bold font-display">{data.challenge.creatorName}</div>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm opacity-75">
          <Clock className="h-4 w-4" />
          {data.challenge.questionCount} questions
        </div>
      </div>

      {/* Show existing results or start prompt */}
      {hasResults ? (
        <div className="space-y-4">
          <h2 className="text-center text-xl font-bold font-display">Results</h2>
          {data.results.map((result: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-xl border p-4">
              <div className="font-semibold">Player {i + 1}</div>
              <div className="text-2xl font-bold text-primary">{result.score}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <Mascot emotion="excited" size="md" />
          <p className="mt-4 text-muted-foreground">
            Can you beat {data.challenge.creatorName}&apos;s score?
          </p>
          <Link
            href={`/quiz/practice?challenge=${challengeId}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground"
          >
            <Trophy className="h-5 w-5" /> Accept Challenge
          </Link>
        </div>
      )}
    </div>
  );
}
