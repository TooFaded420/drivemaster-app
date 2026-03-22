"use client";

import { useState } from "react";
import { Swords, Copy, Check, Share2 } from "lucide-react";
import { features } from "@/lib/feature-flags";
import { toast } from "sonner";

/**
 * ChallengeCreate — "Challenge a Friend" button + share link
 *
 * Shown on quiz results page. Creates a challenge via API,
 * then shows the share link for copying/sharing.
 */

export function ChallengeCreate() {
  if (!features.challenges) return null;

  return <ChallengeCreateInner />;
}

function ChallengeCreateInner() {
  const [challengeUrl, setChallengeUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/challenges", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create challenge");
      const data = await res.json();
      setChallengeUrl(data.shareUrl);
      toast.success("Challenge created!");
    } catch {
      toast.error("Couldn't create challenge. Try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!challengeUrl) return;
    await navigator.clipboard.writeText(challengeUrl);
    setIsCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleShare = async () => {
    if (!challengeUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: "Can you beat my score?",
        text: "I challenge you to beat my DriveMaster score!",
        url: challengeUrl,
      });
    } else {
      handleCopy();
    }
  };

  if (!challengeUrl) {
    return (
      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-accent bg-accent/10 px-5 py-3 font-semibold text-accent transition-all hover:bg-accent hover:text-white disabled:opacity-50"
      >
        {isCreating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Creating...
          </>
        ) : (
          <>
            <Swords className="h-4 w-4" />
            Challenge a Friend
          </>
        )}
      </button>
    );
  }

  return (
    <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4">
      <div className="mb-2 text-sm font-semibold text-accent">Challenge Link</div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={challengeUrl}
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm font-mono"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className="rounded-lg bg-accent/10 p-2 text-accent hover:bg-accent/20"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <button
          onClick={handleShare}
          className="rounded-lg bg-accent p-2 text-white hover:brightness-110"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
