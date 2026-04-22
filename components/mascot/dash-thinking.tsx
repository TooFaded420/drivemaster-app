"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashThinkingProps {
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

export function DashThinking({ className, size = "md", animate = true }: DashThinkingProps) {
  const { width, height } = sizeMap[size];
  const shouldReduceMotion = useReducedMotion();

  const bodyAnim = animate && !shouldReduceMotion
    ? { rotate: [-1, 1, -1] }
    : {};
  const bodyTransition = animate && !shouldReduceMotion
    ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  const bubbleAnim = animate && !shouldReduceMotion
    ? { opacity: [0.6, 1, 0.6], scale: [0.96, 1, 0.96] }
    : {};
  const bubbleTransition = animate && !shouldReduceMotion
    ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  const pupilAnim = animate && !shouldReduceMotion
    ? { x: [0, 3, 1, 3, 0], y: [0, -2, 0, -2, 0] }
    : {};
  const pupilTransition = animate && !shouldReduceMotion
    ? { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { opacity: 0 } : false}
      animate={animate ? { opacity: 1 } : false}
      transition={{ duration: 0.3 }}
      aria-label="Dash the mascot, thinking"
      role="img"
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="185" rx="52" ry="7" fill="#1E2D45" opacity="0.18" />

      {/* Thought bubble — independent fade in/out */}
      <motion.g
        initial={animate ? { opacity: 0, scale: 0.7, x: 8, y: -6 } : {}}
        animate={animate ? { opacity: 1, scale: 1, x: 0, y: 0 } : {}}
        transition={animate ? { delay: 0.4, type: "spring", stiffness: 180, damping: 16 } : {}}
      >
        <motion.g animate={bubbleAnim} transition={bubbleTransition}>
          {/* Bubble trail dots */}
          <circle cx="130" cy="50" r="3.5" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          <circle cx="140" cy="39" r="5" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Main bubble */}
          <rect x="148" y="8" width="44" height="28" rx="12"
            fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Question mark */}
          <text
            x="170" y="28"
            textAnchor="middle"
            fill="#2563EB"
            fontSize="16"
            fontWeight="800"
            fontFamily="sans-serif"
          >?</text>
        </motion.g>
      </motion.g>

      <motion.g
        animate={bodyAnim}
        transition={bodyTransition}
        style={{ transformOrigin: "100px 130px" }}
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

        {/* Windshield */}
        <path
          d="M75 70 C75 70 78 50 84 41 C88 34 93 30 100 30 C107 30 112 34 116 41 C122 50 125 70 125 70 Z"
          fill="#DBEAFE"
          stroke="#93C5FD"
          strokeWidth="1.5"
          opacity="0.92"
        />
        <path d="M83 44 C85 38 88 33 91 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

        {/* Orange racing stripe */}
        <path d="M38 130 L162 130" stroke="#F97316" strokeWidth="5" strokeLinecap="round" opacity="0.9" />

        {/* Side windows */}
        <path d="M40 90 L52 70 L68 70 L62 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.8" />
        <path d="M160 90 L148 70 L132 70 L138 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.8" />

        {/* Front bumper */}
        <rect x="30" y="148" width="140" height="18" rx="9" fill="#1D4ED8" stroke="#1E2D45" strokeWidth="2" />

        {/* Headlights */}
        <rect x="33" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" />
        <rect x="145" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" />
        <rect x="37" y="123" width="14" height="8" rx="3" fill="white" opacity="0.7" />
        <rect x="149" y="123" width="14" height="8" rx="3" fill="white" opacity="0.7" />

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

        {/* ── Face — one squinted eye, pupils up-right ── */}
        {/* Left brow — raised/arched */}
        <path d="M76 46 Q84 40 92 45" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Right brow — lower/furrowed (squint side) */}
        <path d="M108 48 Q116 45 124 50" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Left eye — normal, looking up-right */}
        <circle cx="84" cy="57" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
        <motion.circle cx="84" cy="57" r="6" fill="#1E2D45" animate={pupilAnim} transition={pupilTransition} />
        <motion.circle cx="86" cy="55" r="2" fill="white" animate={pupilAnim} transition={pupilTransition} />

        {/* Right eye — squinted (narrowed via clipPath with rect) */}
        <clipPath id="squint-clip">
          <rect x="106" y="51" width="20" height="12" rx="3" />
        </clipPath>
        <circle cx="116" cy="57" r="10" fill="white" stroke="#1E2D45" strokeWidth="1.5" clipPath="url(#squint-clip)" />
        <motion.circle cx="116" cy="57" r="6" fill="#1E2D45" clipPath="url(#squint-clip)" animate={pupilAnim} transition={pupilTransition} />
        <motion.circle cx="118" cy="55" r="2" fill="white" clipPath="url(#squint-clip)" animate={pupilAnim} transition={pupilTransition} />
        {/* Squint lid line */}
        <path d="M106 56 Q116 51 126 56" stroke="#1E2D45" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Wavy thinking mouth */}
        <path
          d="M88 73 Q94 70 100 73 Q106 76 112 73"
          stroke="#1E2D45"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

      </motion.g>
    </motion.svg>
  );
}
