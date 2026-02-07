"use client";

import { motion } from "framer-motion";
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

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Car Body - Main Blue */}
      <motion.g
        animate={animate ? {
          y: [0, -3, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
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

        {/* Headlights */}
        <ellipse cx="22" cy="75" rx="4" ry="6" fill="#FEF3C7" />
        <ellipse cx="98" cy="75" rx="4" ry="6" fill="#FEF3C7" />

        {/* Grille */}
        <rect x="52" y="85" width="16" height="8" rx="2" fill="#1E40AF" />
        <line x1="56" y1="87" x2="56" y2="91" stroke="#3B82F6" strokeWidth="1" />
        <line x1="60" y1="87" x2="60" y2="91" stroke="#3B82F6" strokeWidth="1" />
        <line x1="64" y1="87" x2="64" y2="91" stroke="#3B82F6" strokeWidth="1" />

        {/* Happy Eyes */}
        <motion.g
          animate={animate ? {
            scaleY: [1, 0.1, 1],
          } : {}}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.5, 1],
          }}
        >
          {/* Left Eye */}
          <circle cx="45" cy="58" r="5" fill="white" />
          <circle cx="45" cy="58" r="3" fill="#1F2937" />
          <circle cx="46" cy="57" r="1" fill="white" />

          {/* Right Eye */}
          <circle cx="75" cy="58" r="5" fill="white" />
          <circle cx="75" cy="58" r="3" fill="#1F2937" />
          <circle cx="76" cy="57" r="1" fill="white" />
        </motion.g>

        {/* Happy Smile */}
        <path
          d="M50 68Q60 75 70 68"
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheeks */}
        <circle cx="38" cy="65" r="4" fill="#FCA5A5" opacity="0.6" />
        <circle cx="82" cy="65" r="4" fill="#FCA5A5" opacity="0.6" />
      </motion.g>
    </motion.svg>
  );
}
