"use client";

import { useState } from "react";
import { features } from "@/lib/feature-flags";
import { Mascot } from "@/components/mascot";
import { Check, Copy, KeyRound, Link2 } from "lucide-react";
import { toast } from "sonner";
import NextLink from "next/link";

/**
 * /parent/link — Parent linking page
 *
 * Two modes:
 *   1. Teen view: generate invite code, share with parent
 *   2. Parent view: enter invite code to link
 *
 * For v1, we show both options and let the user pick.
 * Future: detect role from profile.
 */

export default function ParentLinkPage() {
  if (!features.parentNotifications) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold">Parent Linking Coming Soon</h1>
          <p className="mt-2 text-muted-foreground">This feature is on its way!</p>
          <NextLink href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
            Back to Dashboard
          </NextLink>
        </div>
      </div>
    );
  }

  return <ParentLinkInner />;
}

function ParentLinkInner() {
  const [mode, setMode] = useState<"choose" | "teen" | "parent">("choose");

  if (mode === "choose") {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="text-center">
          <Mascot emotion="happy" size="md" />
          <h1 className="mt-4 font-display text-2xl font-bold">Parent Progress Updates</h1>
          <p className="mt-2 text-muted-foreground">
            Link a parent account so they can see your weekly study progress
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => setMode("teen")}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 text-left transition-all hover:border-primary/40 hover:bg-primary/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold">I&apos;m a student</div>
              <div className="text-sm text-muted-foreground">Generate a code to share with your parent</div>
            </div>
          </button>

          <button
            onClick={() => setMode("parent")}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-accent/20 bg-accent/5 p-5 text-left transition-all hover:border-accent/40 hover:bg-accent/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Link2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="font-semibold">I&apos;m a parent</div>
              <div className="text-sm text-muted-foreground">Enter the code your teen shared with you</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "teen") return <TeenGenerateCode onBack={() => setMode("choose")} />;
  return <ParentEnterCode onBack={() => setMode("choose")} />;
}

function TeenGenerateCode({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCode(data.code);
    } catch {
      toast.error("Couldn't generate code. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <button onClick={onBack} className="mb-6 text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </button>

      <h1 className="font-display text-2xl font-bold">Generate Invite Code</h1>
      <p className="mt-2 text-muted-foreground">
        Share this code with your parent so they can track your progress
      </p>

      {!code ? (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-6 w-full rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate Code"}
        </button>
      ) : (
        <div className="mt-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
          <div className="text-sm text-muted-foreground">Your invite code</div>
          <div className="mt-2 font-mono text-4xl font-bold tracking-[0.3em] text-primary">
            {code}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Expires in 24 hours</div>
          <button
            onClick={handleCopy}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      )}
    </div>
  );
}

function ParentEnterCode({ onBack }: { onBack: () => void }) {
  const [code, setCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLink = async () => {
    if (code.length !== 6) {
      setError("Code must be 6 characters");
      return;
    }

    setIsLinking(true);
    setError(null);

    try {
      const res = await fetch("/api/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link", inviteCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to link");
        return;
      }

      setIsLinked(true);
      toast.success("Linked! You'll get weekly progress updates.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setIsLinking(false);
    }
  };

  if (isLinked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <Mascot emotion="excited" size="lg" />
        <h1 className="mt-4 font-display text-2xl font-bold text-success">Linked!</h1>
        <p className="mt-2 text-muted-foreground">
          You&apos;ll receive weekly email updates about your teen&apos;s study progress.
        </p>
        <NextLink
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Go to Dashboard
        </NextLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <button onClick={onBack} className="mb-6 text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </button>

      <h1 className="font-display text-2xl font-bold">Enter Invite Code</h1>
      <p className="mt-2 text-muted-foreground">
        Enter the 6-character code your teen shared with you
      </p>

      <div className="mt-6">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          maxLength={6}
          className="w-full rounded-lg border-2 border-border bg-background px-4 py-4 text-center font-mono text-3xl font-bold tracking-[0.3em] uppercase focus:border-primary focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      <button
        onClick={handleLink}
        disabled={isLinking || code.length !== 6}
        className="mt-4 w-full rounded-lg bg-accent px-6 py-4 text-lg font-bold text-accent-foreground disabled:opacity-50"
      >
        {isLinking ? "Linking..." : "Link Account"}
      </button>
    </div>
  );
}
