"use client";

import { motion } from "framer-motion";
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

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { opacity: 0 } : false}
      animate={animate ? { opacity: 1 } : false}
    >
      {/* Thought Bubble */}
      {animate && (
        <motion.g
          initial={{ opacity: 0, scale: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <ellipse cx="95" cy="25" rx="18" ry="12" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <circle cx="82" cy="42" r="4" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          <circle cx="75" cy="50" r="2.5" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
          
          {/* Question Mark */}
          <text x="95" y="30" textAnchor="middle" fill="#2563EB" fontSize="14" fontWeight="bold" fontFamily="sans-serif">?</text>
        </motion.g>
      )}

      {/* Car Body */}
      <motion.g
        animate={animate ? {
          rotate: [-1, 1, -1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "60px 80px" }}
      >
        {/* Shadow */}
        <ellipse
          cx="60"
          cy="108"
          rx="35"
          ry="6"
          fill="#1E40AF"
          opacity="0.2"
        />

        {/* Car Body Shape */}
        <path
          d="M20 70C20 70 15 85 20 95C25 105 35 105 40 105H80C85 105 95 105 100 95C105 85 100 70 100 70L95 55C95 55 90 45 80 42H40C30 45 25 55 25 55L20 70Z"
          fill="#2563EB"
        />

        {/* Car Top/Roof */}
        <path
          d="M35 42L40 30C40 30 45 22 60 22C75 22 80 30 80 30L85 42H35Z"
          fill="#1D4ED8"
        />

        {/* Windshield */}
        <path
          d="M42 40L45 32C45 32 50 28 60 28C70 28 75 32 75 32L78 40H42Z"
          fill="#93C5FD"
          opacity="0.8"
        />

        {/* Windows */}
        <path
          d="M38 42H42V55H36C36 55 37 45 38 42Z"
          fill="#60A5FA"
        />
        <path
          d="M82 42H78V55H84C84 55 83 45 82 42Z"
          fill="#60A5FA"
        />

        {/* Wheels */}
        <circle cx="30" cy="95" r="10" fill="#1F2937" />
        <circle cx="30" cy="95" r="5" fill="#6B7280" />
        <circle cx="90" cy="95" r="10" fill="#1F2937" />
        <circle cx="90" cy="95" r="5" fill="#6B7280" />

        {/* Headlights */}
        <ellipse cx="22" cy="75" rx="4" ry="6" fill="#FEF3C7" />
        <ellipse cx="98" cy="75" rx="4" ry="6" fill="#FEF3C7" />

        {/* Grille */}
        <rect x="52" y="85" width="16" height="8" rx="2" fill="#1E40AF" />

        {/* Thinking Eyes - Looking Up/Right */}
        <motion.g
          animate={animate ? {
            x: [0, 2, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Left Eye */}
          <circle cx="45" cy="58" r="5" fill="white" />
          <circle cx="47" cy="56" r="3" fill="#1F2937" />
          
          {/* Right Eye */}
          <circle cx="75" cy="58" r="5" fill="white" />
          <circle cx="77" cy="56" r="3" fill="#1F2937" />
        </motion.g>

        {/* Thinking Expression - Small Neutral Mouth */}
        <line
          x1="55"
          y1="72"
          x2="65"
          y2="72"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Thinking Eyebrows - Raised and Curved */}
        <path
          d="M38 48Q45 44 52 48"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 50Q75 46 82 50"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  );
}
