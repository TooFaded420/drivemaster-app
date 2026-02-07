"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashHappy } from "./dash-happy";
import { DashExcited } from "./dash-excited";
import { DashThinking } from "./dash-thinking";
import { DashEncouraging } from "./dash-encouraging";
import { DashLoading, DashLoadingScreen } from "./dash-loading";

export type MascotEmotion = "happy" | "excited" | "thinking" | "encouraging";
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
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    left: "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white",
    right: "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "absolute z-50 w-64 p-4 bg-white rounded-2xl shadow-lg border border-gray-100",
        positionClasses[position]
      )}
      onClick={onClick}
    >
      {title && (
        <h4 className="font-semibold text-blue-600 mb-1 text-sm">{title}</h4>
      )}
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
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

export { DashHappy, DashExcited, DashThinking, DashEncouraging, DashLoading, DashLoadingScreen };
export default Dash;