"use client";

import { useEffect } from "react";

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl font-bold text-destructive">500</div>
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Don&apos;t worry, your progress is saved. Try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
