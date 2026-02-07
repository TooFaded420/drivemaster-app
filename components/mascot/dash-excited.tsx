"use client";

import { motion } from "framer-motion";
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

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      initial={animate ? { scale: 0.5, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* Celebration Stars */}
      {animate && (
        <>
          <motion.path
            d="M10 30L12 35L17 37L12 39L10 44L8 39L3 37L8 35L10 30Z"
            fill="#FBBF24"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1, 0], rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.path
            d="M110 25L112 30L117 32L112 34L110 39L108 34L103 32L108 30L110 25Z"
            fill="#F59E0B"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1, 0], rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.path
            d="M15 80L17 85L22 87L17 89L15 94L13 89L8 87L13 85L15 80Z"
            fill="#FCD34D"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1, 0], rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <motion.path
            d="M105 75L107 80L112 82L107 84L105 89L103 84L98 82L103 80L105 75Z"
            fill="#FBBF24"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1, 0], rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
          />
        </>
      )}

      {/* Car Body */}
      <motion.g
        animate={animate ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        {/* Shadow */}
        <motion.ellipse
          cx="60"
          cy="108"
          rx="35"
          ry="6"
          fill="#1E40AF"
          opacity="0.2"
          animate={animate ? { scale: [1, 0.8, 1], opacity: [0.2, 0.1, 0.2] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
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

        {/* Headlights - Glowing */}
        <ellipse cx="22" cy="75" rx="5" ry="7" fill="#FEF3C7">
          {animate && (
            <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
          )}
        </ellipse>
        <ellipse cx="98" cy="75" rx="5" ry="7" fill="#FEF3C7">
          {animate && (
            <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
          )}
        </ellipse>

        {/* Grille */}
        <rect x="52" y="85" width="16" height="8" rx="2" fill="#1E40AF" />

        {/* Excited Eyes - Wide Open with Sparkle */}
        <circle cx="45" cy="55" r="7" fill="white" />
        <circle cx="45" cy="55" r="4" fill="#1F2937" />
        <circle cx="47" cy="53" r="2" fill="white" />
        
        <circle cx="75" cy="55" r="7" fill="white" />
        <circle cx="75" cy="55" r="4" fill="#1F2937" />
        <circle cx="77" cy="53" r="2" fill="white" />

        {/* Excited Open Mouth */}
        <ellipse cx="60" cy="72" rx="10" ry="8" fill="#1F2937" />
        <ellipse cx="60" cy="75" rx="6" ry="3" fill="#EF4444" />

        {/* Raised Eyebrows */}
        <path
          d="M38 45Q45 40 52 45"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 45Q75 40 82 45"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Excited Cheeks */}
        <circle cx="35" cy="62" r="5" fill="#FCA5A5" opacity="0.7" />
        <circle cx="85" cy="62" r="5" fill="#FCA5A5" opacity="0.7" />
      </motion.g>
    </motion.svg>
  );
}
