"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashHappyProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const sizeMap = {
  sm: { width: 80, height: 80 },
  md: { width: 120, height: 120 },
  lg: { width: 160, height: 160 },
  xl: { width: 200, height: 200 },
};

export function DashHappy({ className, size = "md", animate = true }: DashHappyProps) {
  const { width, height } = sizeMap[size];
  const shouldReduceMotion = useReducedMotion();

  const bodyAnim = animate && !shouldReduceMotion
    ? { y: [0, -4, 0] }
    : {};
  const bodyTransition = animate && !shouldReduceMotion
    ? { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  const blinkAnim = animate && !shouldReduceMotion
    ? { scaleY: [1, 0.08, 1] }
    : {};
  const blinkTransition = animate && !shouldReduceMotion
    ? { duration: 0.18, repeat: Infinity, repeatDelay: 3.5, times: [0, 0.5, 1] }
    : {};

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.85, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      aria-label="Dash the mascot, happy"
      role="img"
    >
      {/* Ground shadow */}
      <motion.ellipse
        cx="100" cy="185" rx="52" ry="7"
        fill="#1E2D45" opacity="0.18"
        animate={animate && !shouldReduceMotion ? { scaleX: [1, 0.94, 1], opacity: [0.18, 0.12, 0.18] } : {}}
        transition={bodyTransition}
      />

      <motion.g animate={bodyAnim} transition={bodyTransition}>

        {/* ── Car body (vintage sports silhouette) ── */}
        {/* Main lower hull */}
        <path
          d="M28 118 C28 118 20 130 22 148 C24 162 36 166 48 166 L152 166 C164 166 176 162 178 148 C180 130 172 118 172 118 L160 90 C156 78 144 72 132 70 L68 70 C56 72 44 78 40 90 Z"
          fill="#2563EB"
          stroke="#1E2D45"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Roof cabin */}
        <path
          d="M68 70 C68 70 72 48 80 38 C86 30 92 26 100 26 C108 26 114 30 120 38 C128 48 132 70 132 70 Z"
          fill="#1D4ED8"
          stroke="#1E2D45"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Windshield glass — face area */}
        <path
          d="M75 70 C75 70 78 50 84 41 C88 34 93 30 100 30 C107 30 112 34 116 41 C122 50 125 70 125 70 Z"
          fill="#DBEAFE"
          stroke="#93C5FD"
          strokeWidth="1.5"
          opacity="0.92"
        />

        {/* Windshield glare streak */}
        <path
          d="M83 44 C85 38 88 33 91 30"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Orange racing stripe — the brand accent */}
        <path
          d="M48 166 L28 118 L40 90 L40 110 L160 110 L160 90 L172 118 L152 166 Z"
          fill="none"
        />
        <path
          d="M38 130 L162 130"
          stroke="#F97316"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Left side window vent */}
        <path
          d="M40 90 L52 70 L68 70 L62 90 Z"
          fill="#60A5FA"
          stroke="#1E2D45"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Right side window vent */}
        <path
          d="M160 90 L148 70 L132 70 L138 90 Z"
          fill="#60A5FA"
          stroke="#1E2D45"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* Front bumper / nose */}
        <rect x="30" y="148" width="140" height="18" rx="9"
          fill="#1D4ED8"
          stroke="#1E2D45"
          strokeWidth="2"
        />

        {/* Headlights */}
        <rect x="33" y="120" width="22" height="14" rx="6"
          fill="#FEF9C3"
          stroke="#F97316"
          strokeWidth="2"
        />
        <rect x="145" y="120" width="22" height="14" rx="6"
          fill="#FEF9C3"
          stroke="#F97316"
          strokeWidth="2"
        />
        {/* Headlight inner glow */}
        <rect x="37" y="123" width="14" height="8" rx="3" fill="white" opacity="0.7" />
        <rect x="149" y="123" width="14" height="8" rx="3" fill="white" opacity="0.7" />

        {/* Front grille */}
        <rect x="76" y="152" width="48" height="10" rx="4"
          fill="#1E2D45"
          stroke="#1E2D45"
          strokeWidth="1"
        />
        <line x1="84" y1="154" x2="84" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="92" y1="154" x2="92" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="100" y1="154" x2="100" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="108" y1="154" x2="108" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="116" y1="154" x2="116" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />

        {/* Left wheel */}
        <circle cx="56" cy="166" r="18" fill="#1E2D45" stroke="#1E2D45" strokeWidth="2" />
        <circle cx="56" cy="166" r="11" fill="#374151" />
        <circle cx="56" cy="166" r="6" fill="#F97316" />
        <circle cx="56" cy="166" r="3" fill="#1E2D45" />
        {/* wheel spokes */}
        <line x1="56" y1="155" x2="56" y2="177" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="45" y1="166" x2="67" y2="166" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="48" y1="158" x2="64" y2="174" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="64" y1="158" x2="48" y2="174" stroke="#6B7280" strokeWidth="1.5" />

        {/* Right wheel */}
        <circle cx="144" cy="166" r="18" fill="#1E2D45" stroke="#1E2D45" strokeWidth="2" />
        <circle cx="144" cy="166" r="11" fill="#374151" />
        <circle cx="144" cy="166" r="6" fill="#F97316" />
        <circle cx="144" cy="166" r="3" fill="#1E2D45" />
        <line x1="144" y1="155" x2="144" y2="177" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="133" y1="166" x2="155" y2="166" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="136" y1="158" x2="152" y2="174" stroke="#6B7280" strokeWidth="1.5" />
        <line x1="152" y1="158" x2="136" y2="174" stroke="#6B7280" strokeWidth="1.5" />

        {/* ── Face on windshield ── */}
        {/* Eyes — large cartoon rounds */}
        <motion.g animate={blinkAnim} transition={blinkTransition} style={{ transformOrigin: "100px 57px" }}>
          {/* Left eye */}
          <circle cx="84" cy="57" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
          <circle cx="85" cy="57" r="6" fill="#1E2D45" />
          <circle cx="87" cy="54" r="2.5" fill="white" />
          {/* Right eye */}
          <circle cx="116" cy="57" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
          <circle cx="117" cy="57" r="6" fill="#1E2D45" />
          <circle cx="119" cy="54" r="2.5" fill="white" />
        </motion.g>

        {/* Happy smile — big upward curve */}
        <path
          d="M86 72 Q100 84 114 72"
          stroke="#1E2D45"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Smile fill */}
        <path
          d="M86 72 Q100 84 114 72 Q100 77 86 72 Z"
          fill="#FCA5A5"
          opacity="0.4"
        />

        {/* Rosy cheeks */}
        <circle cx="70" cy="66" r="7" fill="#FCA5A5" opacity="0.45" />
        <circle cx="130" cy="66" r="7" fill="#FCA5A5" opacity="0.45" />

      </motion.g>
    </motion.svg>
  );
}
