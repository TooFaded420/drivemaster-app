"use client";

import { useState } from "react";
import { Share2, Download, Check } from "lucide-react";
import { features } from "@/lib/feature-flags";
import { toast } from "sonner";

/**
 * ShareButton — Generates and shares achievement card
 *
 * Uses /api/og to generate the card image, then shares via
 * Web Share API (mobile) or downloads (desktop fallback).
 */

interface ShareButtonProps {
  score: number;
  username: string;
  streak: number;
}

export function ShareButton({ score, username, streak }: ShareButtonProps) {
  if (!features.sharing) return null;

  return <ShareButtonInner score={score} username={username} streak={streak} />;
}

function ShareButtonInner({ score, username, streak }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const cardUrl = `/api/og?score=${score}&user=${encodeURIComponent(username)}&streak=${streak}`;

  const handleShare = async () => {
    setIsGenerating(true);

    try {
      // Fetch the image
      const response = await fetch(cardUrl);
      const blob = await response.blob();
      const file = new File([blob], "aceyourpermit-score.png", { type: "image/png" });

      // Try Web Share API first (mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `I scored ${score}% on Ace Your Permit!`,
          text: `I scored ${score}% on my Illinois DMV practice test on Ace Your Permit! Can you beat me?`,
          files: [file],
        });
        setIsShared(true);
        toast.success("Shared!");
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "aceyourpermit-score.png";
        a.click();
        URL.revokeObjectURL(url);
        setIsShared(true);
        toast.success("Card downloaded! Share it on your socials.");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
        toast.error("Couldn't generate share card. Try again.");
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setIsShared(false), 3000);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : isShared ? (
        <>
          <Check className="h-4 w-4" />
          Shared!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share Score
        </>
      )}
    </button>
  );
}
