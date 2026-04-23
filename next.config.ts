import type { NextConfig } from "next";

// Environment variable validation
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

if (process.env.NODE_ENV === "production") {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Required environment variable ${envVar} is not set`);
    }
  }
}

const nextConfig: NextConfig = {
  // Server-side rendering for API routes
  output: "standalone",
  distDir: ".next",
  
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "synwblfnankqbmdsinqt.supabase.co",
      },
    ],
  },
  
  // Build optimization flags
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-progress",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
      "recharts",
    ],
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  
  // Headers for security (will be overridden by vercel.json on Vercel)
  async headers() {
    // Baseline Content-Security-Policy. Permissive enough for our current
    // analytics/marketing stack (PostHog, Clarity, Meta Pixel, TikTok Pixel,
    // GA4) + Supabase. Needs tuning once pixels + fonts are verified in prod.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com https://*.clarity.ms https://connect.facebook.net https://analytics.tiktok.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://*.posthog.com https://*.clarity.ms wss://*.supabase.co",
      "frame-src 'self'",
      "font-src 'self' data: https://api.fontshare.com",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: "/old-dashboard",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },

  // Rewrites: proxy PostHog ingestion through /ingest to bypass ad-blockers
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
