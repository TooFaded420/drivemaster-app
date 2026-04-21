// ============================================
// Environment Validation Script
// Run before build to ensure all required env vars are set
// ============================================

interface EnvVar {
  name: string;
  required: boolean | "production";
  description: string;
}

// When running on Vercel, NODE_ENV=production for BOTH preview and production
// builds, so trust VERCEL_ENV when it's set. Fall back to NODE_ENV only when
// building outside Vercel (local `npm run build`, CI). This keeps preview
// builds from failing on production-only keys like SYNTHETIC_API_KEY.
const isProd = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

const envVars: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    description: "Supabase project URL",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    description: "Supabase anonymous/public API key",
  },
  {
    name: "NEXT_PUBLIC_APP_NAME",
    required: false,
    description: "Application name",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    required: false,
    description: "Application URL",
  },
  {
    name: "NEXT_PUBLIC_POSTHOG_KEY",
    required: false,
    description: "PostHog analytics project API key",
  },
  {
    name: "NEXT_PUBLIC_POSTHOG_HOST",
    required: false,
    description: "PostHog UI host (defaults to https://us.posthog.com)",
  },
  {
    name: "NEXT_PUBLIC_CLARITY_ID",
    required: false,
    description: "Microsoft Clarity project ID",
  },
  {
    name: "NEXT_PUBLIC_META_PIXEL_ID",
    required: false,
    description: "Meta Pixel ID for paid-traffic conversion tracking (optional)",
  },
  {
    name: "NEXT_PUBLIC_TIKTOK_PIXEL_ID",
    required: false,
    description: "TikTok Pixel ID for Spark Ads attribution (optional)",
  },
  {
    name: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    required: false,
    description: "Google Analytics 4 Measurement ID (format G-XXXXXXXXXX, optional)",
  },
  {
    name: "NEXT_PUBLIC_SENTRY_DSN",
    required: false,
    description: "Sentry error tracking DSN",
  },
  // Server-side secrets. Empty string must fail — prevents the
  // `Bearer undefined` hole in the cron digest endpoint and the
  // open-admin hole in /api/questions/seed.
  {
    name: "ADMIN_API_KEY",
    required: true,
    description: "Admin API key for protected admin endpoints (questions/seed, etc.)",
  },
  {
    name: "CRON_SECRET",
    required: true,
    description: "Shared secret for Vercel Cron → /api/cron/* Authorization header",
  },
  {
    name: "SYNTHETIC_API_KEY",
    required: "production",
    description: "synthetic.new API key used by /api/explain (required in production)",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    required: "production",
    description: "Supabase service-role key used by /api/explain to write the ai_explanations cache (required in production; ai_explanations writes are blocked for authenticated role since migration 006)",
  },
  {
    name: "RESEND_API_KEY",
    required: "production",
    description: "Resend API key used by the weekly parent digest (required in production)",
  },
  {
    name: "UPSTASH_REDIS_REST_URL",
    required: false,
    description:
      "Upstash Redis REST URL for rate limiting. Optional; missing = rate limit is a no-op.",
  },
  {
    name: "UPSTASH_REDIS_REST_TOKEN",
    required: false,
    description:
      "Upstash Redis REST token for rate limiting. Optional; missing = rate limit is a no-op.",
  },
];

function validateEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log("🔍 Validating environment variables...\n");

  for (const envVar of envVars) {
    const value = process.env[envVar.name];

    const isRequired = envVar.required === true || (envVar.required === "production" && isProd);

    if (!value || value === "your-anon-key" || value === "https://your-project.supabase.co") {
      if (isRequired) {
        errors.push(`❌ Required variable ${envVar.name} is not set (${envVar.description})`);
      } else {
        warnings.push(`⚠️  Optional variable ${envVar.name} is not set (${envVar.description})`);
      }
    } else {
      // Check for placeholder values
      if (value.includes("your-") || value.includes("xxx") || value.includes("XXXXXXXXXX")) {
        if (isRequired) {
          errors.push(`❌ ${envVar.name} contains placeholder value: ${value}`);
        } else {
          warnings.push(`⚠️  ${envVar.name} contains placeholder value: ${value}`);
        }
      } else {
        console.log(`✅ ${envVar.name} is set`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function main(): void {
  const { errors, warnings } = validateEnv();

  if (warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    warnings.forEach((w) => console.log(`  ${w}`));
  }

  if (errors.length > 0) {
    console.log("\n❌ Errors:");
    errors.forEach((e) => console.log(`  ${e}`));
    console.log("\n💡 Make sure to:");
    console.log("  1. Copy .env.local.example to .env.local");
    console.log("  2. Fill in your Supabase credentials");
    console.log("  3. Get credentials from: https://supabase.com/dashboard/project/_/settings/api");
    process.exit(1);
  }

  console.log("\n✅ All required environment variables are set!");
  process.exit(0);
}

main();
