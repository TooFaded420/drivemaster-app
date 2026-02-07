"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashEncouragingProps {
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

export function DashEncouraging({ className, size = "md", animate = true }: DashEncouragingProps) {
  const { width, height } = sizeMap[size];

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { x: -10, opacity: 0 } : false}
      animate={animate ? { x: 0, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Car Body */}
      <motion.g
        animate={animate ? {
          x: [0, 3, -3, 2, -2, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
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

        {/* Headlights - Dimmed */}
        <ellipse cx="22" cy="75" rx="4" ry="6" fill="#FEF3C7" opacity="0.7" />
        <ellipse cx="98" cy="75" rx="4" ry="6" fill="#FEF3C7" opacity="0.7" />

        {/* Grille */}
        <rect x="52" y="85" width="16" height="8" rx="2" fill="#1E40AF" />

        {/* Encouraging Eyes - Warm and Supportive */}
        <motion.g
          animate={animate ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 4,
            times: [0, 0.5, 1],
          }}
        >
          {/* Left Eye - Gentle Curve */}
          <path
            d="M40 58Q45 55 50 58"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Right Eye - Gentle Curve */}
          <path
            d="M70 58Q75 55 80 58"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Supportive Smile */}
        <path
          d="M50 72Q60 78 70 72"
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gentle Eyebrows - Sympathetic */}
        <path
          d="M38 50Q45 48 52 50"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 50Q75 48 82 50"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Supportive Cheeks */}
        <circle cx="38" cy="65" r="4" fill="#FCA5A5" opacity="0.5" />
        <circle cx="82" cy="65" r="4" fill="#FCA5A5" opacity="0.5" />

        {/* Thumbs Up Icon */}
        <motion.g
          initial={animate ? { scale: 0 } : { scale: 1 }}
          animate={animate ? { scale: 1 } : { scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <circle cx="100" cy="35" r="12" fill="#22C55E" />
          <path
            d="M96 38V32C96 31 97 30 98 30H99C100 30 101 31 101 32V38"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M101 38V34C101 33 102 32 103 32H104C105 32 106 33 106 34V38"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M95 38H107C108 38 109 39 109 40V41C109 42 108 43 107 43H95C94 43 93 42 93 41V40C93 39 94 38 95 38Z"
            fill="white"
          />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
