"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashExcitedProps {
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

export function DashExcited({ className, size = "md", animate = true }: DashExcitedProps) {
  const { width, height } = sizeMap[size];
  const shouldReduceMotion = useReducedMotion();

  const bodyAnim = animate && !shouldReduceMotion
    ? { y: [0, -8, 0] }
    : {};
  const bodyTransition = animate && !shouldReduceMotion
    ? { duration: 0.55, repeat: Infinity, ease: "easeOut" as const }
    : {};

  const shadowAnim = animate && !shouldReduceMotion
    ? { scaleX: [1, 0.82, 1], opacity: [0.18, 0.09, 0.18] }
    : {};

  const sparkleProps = (delay: number, cx: number, cy: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: animate && !shouldReduceMotion
      ? { scale: [0, 1.2, 0], opacity: [0, 1, 0] }
      : { scale: 1, opacity: 0.6 },
    transition: { duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" as const },
  });

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.5, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 420, damping: 14 }}
      aria-label="Dash the mascot, excited"
      role="img"
    >
      {/* Ground shadow */}
      <motion.ellipse
        cx="100" cy="185" rx="52" ry="7"
        fill="#1E2D45" opacity="0.18"
        animate={animate && !shouldReduceMotion ? shadowAnim : {}}
        transition={bodyTransition}
      />

      {/* Sparkles — only sparkle elements animate, not full body */}
      {/* Star 1 — top left */}
      <motion.g {...sparkleProps(0, 22, 30)}>
        <path d="M22 22 L24 28 L30 30 L24 32 L22 38 L20 32 L14 30 L20 28 Z" fill="#FBBF24" />
      </motion.g>
      {/* Star 2 — top right */}
      <motion.g {...sparkleProps(0.35, 178, 28)}>
        <path d="M178 20 L180 26 L186 28 L180 30 L178 36 L176 30 L170 28 L176 26 Z" fill="#F97316" />
      </motion.g>
      {/* Star 3 — mid left */}
      <motion.g {...sparkleProps(0.7, 14, 88)}>
        <path d="M14 82 L16 87 L21 89 L16 91 L14 96 L12 91 L7 89 L12 87 Z" fill="#FCD34D" />
      </motion.g>
      {/* Star 4 — mid right */}
      <motion.g {...sparkleProps(0.95, 186, 85)}>
        <path d="M186 79 L188 84 L193 86 L188 88 L186 93 L184 88 L179 86 L184 84 Z" fill="#FBBF24" />
      </motion.g>
      {/* Star 5 — top center */}
      <motion.g {...sparkleProps(0.5, 100, 12)}>
        <path d="M100 8 L102 13 L107 15 L102 17 L100 22 L98 17 L93 15 L98 13 Z" fill="#F97316" />
      </motion.g>

      <motion.g animate={bodyAnim} transition={bodyTransition}>

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

        {/* Windshield glass */}
        <path
          d="M75 70 C75 70 78 50 84 41 C88 34 93 30 100 30 C107 30 112 34 116 41 C122 50 125 70 125 70 Z"
          fill="#DBEAFE"
          stroke="#93C5FD"
          strokeWidth="1.5"
          opacity="0.92"
        />

        {/* Windshield glare */}
        <path d="M83 44 C85 38 88 33 91 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

        {/* Orange racing stripe */}
        <path d="M38 130 L162 130" stroke="#F97316" strokeWidth="5" strokeLinecap="round" opacity="0.9" />

        {/* Side windows */}
        <path d="M40 90 L52 70 L68 70 L62 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.8" />
        <path d="M160 90 L148 70 L132 70 L138 90 Z" fill="#60A5FA" stroke="#1E2D45" strokeWidth="1.5" opacity="0.8" />

        {/* Front bumper */}
        <rect x="30" y="148" width="140" height="18" rx="9" fill="#1D4ED8" stroke="#1E2D45" strokeWidth="2" />

        {/* Headlights — glowing */}
        <rect x="33" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" />
        <rect x="145" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" />
        <rect x="37" y="123" width="14" height="8" rx="3" fill="white" opacity="0.9" />
        <rect x="149" y="123" width="14" height="8" rx="3" fill="white" opacity="0.9" />

        {/* Grille */}
        <rect x="76" y="152" width="48" height="10" rx="4" fill="#1E2D45" stroke="#1E2D45" strokeWidth="1" />
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

        {/* ── Face ── */}
        {/* Raised eyebrows — excited */}
        <path d="M76 46 Q84 40 92 46" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M108 46 Q116 40 124 46" stroke="#1E2D45" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Eyes — extra wide with starry highlight */}
        <circle cx="84" cy="57" r="11" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
        <circle cx="85" cy="57" r="7" fill="#1E2D45" />
        <circle cx="88" cy="53" r="3" fill="white" />
        <circle cx="83" cy="60" r="1.5" fill="white" />

        <circle cx="116" cy="57" r="11" fill="white" stroke="#1E2D45" strokeWidth="1.5" />
        <circle cx="117" cy="57" r="7" fill="#1E2D45" />
        <circle cx="120" cy="53" r="3" fill="white" />
        <circle cx="115" cy="60" r="1.5" fill="white" />

        {/* Open mouth with tongue — excited */}
        <ellipse cx="100" cy="73" rx="12" ry="9" fill="#1E2D45" stroke="#1E2D45" strokeWidth="1" />
        <path d="M88 73 Q94 80 100 80 Q106 80 112 73" fill="#EF4444" />
        <ellipse cx="100" cy="77" rx="6" ry="3.5" fill="#F87171" />

        {/* Excited cheeks */}
        <circle cx="68" cy="64" r="8" fill="#FCA5A5" opacity="0.5" />
        <circle cx="132" cy="64" r="8" fill="#FCA5A5" opacity="0.5" />

      </motion.g>
    </motion.svg>
  );
}
