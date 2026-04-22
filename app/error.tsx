"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dash } from "@/components/mascot";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center gap-6">
      <Dash
        emotion="encouraging"
        size="lg"
        animate={true}
        showSpeechBubble={true}
        speechTitle="Oof, hit a bump 😬"
        speechText="Your progress is safe — just hit retry and we're back in it."
        speechPosition="bottom"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Something went sideways</h1>
        <p className="max-w-md text-muted-foreground">
          Not your fault. Hit retry and let&apos;s keep the streak alive.
        </p>
      </div>
      <Button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 px-8"
        size="lg"
      >
        Retry
      </Button>
    </div>
  );
}
