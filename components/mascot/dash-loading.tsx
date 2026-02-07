"use client";

import { motion } from "framer-motion";
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

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Exhaust Fumes */}
        <motion.g
          initial={{ opacity: 0, x: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            x: [-5, -15, -25],
            y: [0, -5, -10]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <circle cx="25" cy="95" r="4" fill="#9CA3AF" />
          <circle cx="20" cy="90" r="3" fill="#9CA3AF" />
          <circle cx="15" cy="85" r="2" fill="#9CA3AF" />
        </motion.g>

        {/* Car Body with Bounce */}
        <motion.g
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
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
            animate={{
              scale: [1, 0.9, 1],
              opacity: [0.2, 0.15, 0.2],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
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

          {/* Spinning Wheels */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "30px 95px" }}
          >
            <circle cx="30" cy="95" r="10" fill="#1F2937" />
            <circle cx="30" cy="95" r="5" fill="#6B7280" />
            <line x1="30" y1="85" x2="30" y2="105" stroke="#4B5563" strokeWidth="2" />
            <line x1="20" y1="95" x2="40" y2="95" stroke="#4B5563" strokeWidth="2" />
          </motion.g>

          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "90px 95px" }}
          >
            <circle cx="90" cy="95" r="10" fill="#1F2937" />
            <circle cx="90" cy="95" r="5" fill="#6B7280" />
            <line x1="90" y1="85" x2="90" y2="105" stroke="#4B5563" strokeWidth="2" />
            <line x1="80" y1="95" x2="100" y2="95" stroke="#4B5563" strokeWidth="2" />
          </motion.g>

          {/* Headlights */}
          <ellipse cx="22" cy="75" rx="4" ry="6" fill="#FEF3C7" />
          <ellipse cx="98" cy="75" rx="4" ry="6" fill="#FEF3C7" />

          {/* Grille */}
          <rect x="52" y="85" width="16" height="8" rx="2" fill="#1E40AF" />

          {/* Happy Eyes */}
          <circle cx="45" cy="58" r="5" fill="white" />
          <circle cx="45" cy="58" r="3" fill="#1F2937" />
          <circle cx="46" cy="57" r="1" fill="white" />
          
          <circle cx="75" cy="58" r="5" fill="white" />
          <circle cx="75" cy="58" r="3" fill="#1F2937" />
          <circle cx="76" cy="57" r="1" fill="white" />

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

        {/* Speed Lines */}
        <motion.g
          initial={{ opacity: 0, x: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [0, -20, -40],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <line x1="110" y1="70" x2="120" y2="70" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="105" y1="80" x2="115" y2="80" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="108" y1="90" x2="118" y2="90" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </motion.svg>

      {/* Loading Text */}
      {text && (
        <motion.p 
          className="text-gray-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function DashLoadingScreen({ 
  className,
  text 
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