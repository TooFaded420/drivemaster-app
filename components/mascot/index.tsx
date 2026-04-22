"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashHappy } from "./dash-happy";
import { DashExcited } from "./dash-excited";
import { DashThinking } from "./dash-thinking";
import { DashEncouraging } from "./dash-encouraging";
import { DashSad } from "./dash-sad";
import { DashLoading, DashLoadingScreen } from "./dash-loading";

export type MascotEmotion = "happy" | "excited" | "thinking" | "encouraging" | "sad";
export type MascotSize = "sm" | "md" | "lg" | "xl";

interface DashProps {
  emotion?: MascotEmotion;
  size?: MascotSize;
  className?: string;
  animate?: boolean;
  showSpeechBubble?: boolean;
  speechTitle?: string;
  speechText?: string;
  speechPosition?: "top" | "bottom" | "left" | "right";
  onSpeechBubbleClick?: () => void;
}

const emotionComponents = {
  happy: DashHappy,
  excited: DashExcited,
  thinking: DashThinking,
  encouraging: DashEncouraging,
  sad: DashSad,
};

function SpeechBubble({
  title,
  text,
  position,
  onClick,
}: {
  title?: string;
  text: string;
  position: "top" | "bottom" | "left" | "right";
  onClick?: () => void;
}) {
  // Position classes: bubble is placed relative to the Dash wrapper.
  // "top" → bubble appears above Dash (safe: doesn't overlap content below)
  // "left" → bubble extends leftward (safe for right-aligned Dash in header rows)
  // "bottom" → extends downward — only use when there's no content below Dash
  const positionClasses = {
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
  };

  // Arrow caret — points toward Dash from the bubble
  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white dark:border-t-[#1A2540]",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white dark:border-b-[#1A2540]",
    left: "left-full top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-white dark:border-l-[#1A2540]",
    right: "right-full top-1/2 -translate-y-1/2 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-white dark:border-r-[#1A2540]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        // w-56 (224px) instead of w-64 — slightly narrower to reduce collision risk
        "absolute z-50 w-56 p-3 rounded-2xl shadow-lg",
        // Light: white card. Dark: popover surface with visible border
        "bg-white border border-gray-200 dark:bg-[#1A2540] dark:border-[rgba(255,255,255,0.12)]",
        positionClasses[position]
      )}
    >
      {/* Header row: title + dismiss X */}
      <div className="flex items-start justify-between gap-2 mb-1">
        {title && (
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 text-xs leading-tight">
            {title}
          </h4>
        )}
        {/* Explicit dismiss button — always present so users can close Dash */}
        <button
          onClick={onClick}
          aria-label="Dismiss Dash message"
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
            "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            "dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/10",
            "transition-colors",
            !title && "ml-auto"
          )}
        >
          {/* Inline SVG — no extra import needed */}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed pr-1">
        {text}
      </p>
      <div
        className={cn(
          "absolute w-0 h-0",
          arrowClasses[position]
        )}
      />
    </motion.div>
  );
}

export function Dash({
  emotion = "happy",
  size = "md",
  className,
  animate = true,
  showSpeechBubble = false,
  speechTitle,
  speechText,
  speechPosition = "top",
  onSpeechBubbleClick,
}: DashProps) {
  const MascotComponent = emotionComponents[emotion];

  return (
    <div className={cn("relative inline-block", className)}>
      <AnimatePresence>
        {showSpeechBubble && speechText && (
          <SpeechBubble
            title={speechTitle}
            text={speechText}
            position={speechPosition}
            onClick={onSpeechBubbleClick}
          />
        )}
      </AnimatePresence>
      <MascotComponent size={size} animate={animate} />
    </div>
  );
}

export { DashHappy, DashExcited, DashThinking, DashEncouraging, DashSad, DashLoading, DashLoadingScreen };
export default Dash;