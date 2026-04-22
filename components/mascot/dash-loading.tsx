"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashLoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
}

const sizeMap = {
  sm: { width: 60, height: 60 },
  md: { width: 100, height: 100 },
  lg: { width: 140, height: 140 },
  xl: { width: 180, height: 180 },
};

const loadingMessages = [
  "Fueling up...",
  "Checking the mirrors...",
  "Buckling up...",
  "Starting the engine...",
  "Adjusting the seat...",
  "Reading the map...",
];

export function DashLoading({ className, size = "md", text }: DashLoadingProps) {
  const { width, height } = sizeMap[size];
  const shouldReduceMotion = useReducedMotion();

  // Reduced-motion fallback: gentle pulse on whole body instead of wheel spin
  const bodyAnim = !shouldReduceMotion
    ? { y: [0, -5, 0] }
    : { opacity: [1, 0.7, 1] };
  const bodyTransition = !shouldReduceMotion
    ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const }
    : { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const };

  const wheelAnim = !shouldReduceMotion ? { rotate: 360 } : {};
  const wheelTransition = !shouldReduceMotion
    ? { duration: 0.7, repeat: Infinity, ease: "linear" as const }
    : {};

  const shadowAnim = !shouldReduceMotion
    ? { scaleX: [1, 0.88, 1], opacity: [0.18, 0.1, 0.18] }
    : {};

  const zzzAnim = !shouldReduceMotion
    ? { opacity: [0, 1, 0], y: [0, -8, -16], x: [0, 4, 8] }
    : {};

  const exhaustAnim = !shouldReduceMotion
    ? { opacity: [0, 0.5, 0], x: [-4, -14, -24], y: [0, -4, -8] }
    : {};

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Dash the mascot, loading"
        role="img"
      >
        {/* Ground shadow */}
        <motion.ellipse
          cx="100" cy="185" rx="52" ry="7"
          fill="#1E2D45" opacity="0.18"
          animate={shadowAnim}
          transition={bodyTransition}
        />

        {/* Exhaust fumes — only when not reduced motion */}
        {!shouldReduceMotion && (
          <motion.g
            animate={exhaustAnim}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          >
            <circle cx="42" cy="160" r="5" fill="#9CA3AF" opacity="0.7" />
            <circle cx="35" cy="153" r="4" fill="#9CA3AF" opacity="0.5" />
            <circle cx="28" cy="146" r="3" fill="#9CA3AF" opacity="0.3" />
          </motion.g>
        )}

        {/* Zzz floats — relaxed/idle feel */}
        <motion.g
          animate={zzzAnim}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
        >
          <text x="148" y="45" fill="#93C5FD" fontSize="11" fontWeight="700" fontFamily="sans-serif" opacity="0.85">z</text>
        </motion.g>
        <motion.g
          animate={zzzAnim}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
        >
          <text x="158" y="34" fill="#60A5FA" fontSize="14" fontWeight="700" fontFamily="sans-serif" opacity="0.7">z</text>
        </motion.g>
        <motion.g
          animate={zzzAnim}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
        >
          <text x="170" y="22" fill="#3B82F6" fontSize="17" fontWeight="700" fontFamily="sans-serif" opacity="0.55">z</text>
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

          {/* Headlights — dimmed (sleeping) */}
          <rect x="33" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" opacity="0.5" />
          <rect x="145" y="120" width="22" height="14" rx="6" fill="#FEF9C3" stroke="#F97316" strokeWidth="2" opacity="0.5" />

          {/* Grille */}
          <rect x="76" y="152" width="48" height="10" rx="4" fill="#1E2D45" />
          <line x1="84" y1="154" x2="84" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="92" y1="154" x2="92" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="100" y1="154" x2="100" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="108" y1="154" x2="108" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="116" y1="154" x2="116" y2="160" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />

          {/* Left wheel — spinning */}
          <motion.g
            animate={wheelAnim}
            transition={wheelTransition}
            style={{ transformOrigin: "56px 166px" }}
          >
            <circle cx="56" cy="166" r="18" fill="#1E2D45" stroke="#1E2D45" strokeWidth="2" />
            <circle cx="56" cy="166" r="11" fill="#374151" />
            <circle cx="56" cy="166" r="6" fill="#F97316" />
            <circle cx="56" cy="166" r="3" fill="#1E2D45" />
            <line x1="56" y1="155" x2="56" y2="177" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="45" y1="166" x2="67" y2="166" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="48" y1="158" x2="64" y2="174" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="64" y1="158" x2="48" y2="174" stroke="#6B7280" strokeWidth="1.5" />
          </motion.g>

          {/* Right wheel — spinning */}
          <motion.g
            animate={wheelAnim}
            transition={wheelTransition}
            style={{ transformOrigin: "144px 166px" }}
          >
            <circle cx="144" cy="166" r="18" fill="#1E2D45" stroke="#1E2D45" strokeWidth="2" />
            <circle cx="144" cy="166" r="11" fill="#374151" />
            <circle cx="144" cy="166" r="6" fill="#F97316" />
            <circle cx="144" cy="166" r="3" fill="#1E2D45" />
            <line x1="144" y1="155" x2="144" y2="177" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="133" y1="166" x2="155" y2="166" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="136" y1="158" x2="152" y2="174" stroke="#6B7280" strokeWidth="1.5" />
            <line x1="152" y1="158" x2="136" y2="174" stroke="#6B7280" strokeWidth="1.5" />
          </motion.g>

          {/* ── Face — closed/relaxed eyes, content idle smile ── */}
          {/* Closed eyes — arched lines */}
          <path
            d="M76 57 Q84 51 92 57"
            stroke="#1E2D45"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M108 57 Q116 51 124 57"
            stroke="#1E2D45"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Relaxed smile */}
          <path
            d="M88 70 Q100 79 112 70"
            stroke="#1E2D45"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Soft cheeks */}
          <circle cx="70" cy="64" r="7" fill="#FCA5A5" opacity="0.35" />
          <circle cx="130" cy="64" r="7" fill="#FCA5A5" opacity="0.35" />

        </motion.g>

        {/* Speed lines — only during active loading, not reduced motion */}
        {!shouldReduceMotion && (
          <motion.g
            animate={{ opacity: [0, 1, 0], x: [0, -18, -36] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut" }}
          >
            <line x1="178" y1="110" x2="194" y2="110" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="174" y1="122" x2="190" y2="122" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            <line x1="176" y1="134" x2="192" y2="134" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-gray-600 font-medium text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function DashLoadingScreen({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white", className)}>
      <DashLoading size="xl" text={text || "Loading..."} />
    </div>
  );
}

export default DashLoading;
