"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashSadProps {
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

export function DashSad({ className, size = "md", animate = true }: DashSadProps) {
  const { width, height } = sizeMap[size];
  const shouldReduceMotion = useReducedMotion();

  const bodyAnim = animate && !shouldReduceMotion
    ? { rotate: [0, -1.5, 0, -1, 0] }
    : {};
  const bodyTransition = animate && !shouldReduceMotion
    ? { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  const tearAnim = animate && !shouldReduceMotion
    ? { y: [0, 18, 18], opacity: [0, 1, 0], scaleY: [0.5, 1.4, 0.8] }
    : {};
  const tearTransition = animate && !shouldReduceMotion
    ? { duration: 2, repeat: Infinity, repeatDelay: 1.2, ease: "easeIn" as const }
    : {};

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.9, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      aria-label="Dash the mascot, sad"
      role="img"
    >
      {/* Ground shadow — slightly larger forward tilt shadow */}
      <ellipse cx="98" cy="185" rx="50" ry="7" fill="#1E2D45" opacity="0.15" />

      <motion.g
        animate={bodyAnim}
        transition={bodyTransition}
        style={{ transformOrigin: "100px 140px" }}
      >

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

        {/* Windshield — slightly darker tint for sad mood */}
        <path
          d="M75 70 C75 70 78 50 84 41 C88 34 93 30 100 30 C107 30 112 34 116 41 C122 50 125 70 125 70 Z"
          fill="#BFDBFE"
          stroke="#93C5FD"
          strokeWidth="1.5"
          opacity="0.88"
        />
        <path d="M83 44 C85 38 88 33 91 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

        {/* Orange racing stripe — slightly muted */}
        <path d="M38 130 L162 130" stroke="#F97316" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

        {/* Side windows */}
        <path d="M40 90 L52 70 L68 70 L62 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.7" />
        <path d="M160 90 L148 70 L132 70 L138 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.7" />

        {/* Front bumper */}
        <rect x="30" y="148" width="140" height="18" rx="9" fill="#1D4ED8" stroke="#1E2D45" strokeWidth="2" />

        {/* Headlights — dimmed */}
        <rect x="33" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" opacity="0.45" />
        <rect x="145" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" opacity="0.45" />

        {/* Grille */}
        <rect x="76" y="152" width="48" height="10" rx="4" fill="#1E2D45" />
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

        {/* ── Face — downcast eyes, frown, single tear ── */}
        {/* Sad brows — angled down toward center */}
        <path d="M76 46 Q84 50 92 48" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M108 48 Q116 50 124 46" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Eyes — looking downward, pupils low */}
        <circle cx="84" cy="58" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
        <circle cx="84" cy="61" r="6" fill="#1E2D45" />
        <circle cx="86" cy="59" r="2" fill="white" />

        <circle cx="116" cy="58" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
        <circle cx="116" cy="61" r="6" fill="#1E2D45" />
        <circle cx="118" cy="59" r="2" fill="white" />

        {/* Tear — left eye, animated drop */}
        <motion.ellipse
          cx="80" cy="68"
          rx="2.5" ry="4"
          fill="#93C5FD"
          opacity="0.85"
          animate={tearAnim}
          transition={tearTransition}
        />

        {/* Frown — downward curve */}
        <path
          d="M86 76 Q100 67 114 76"
          stroke="#1E2D45"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Muted cheeks */}
        <circle cx="70" cy="66" r="6" fill="#93C5FD" opacity="0.3" />
        <circle cx="130" cy="66" r="6" fill="#93C5FD" opacity="0.3" />

      </motion.g>
    </motion.svg>
  );
}
