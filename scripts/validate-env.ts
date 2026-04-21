// ============================================
// Environment Validation Script
// Run before build to ensure all required env vars are set
// ============================================

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

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
    name: "NEXT_PUBLIC_SENTRY_DSN",
    required: false,
    description: "Sentry error tracking DSN",
  },
];

function validateEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log("🔍 Validating environment variables...\n");

  for (const envVar of envVars) {
    const value = process.env[envVar.name];

    if (!value || value === "your-anon-key" || value === "https://your-project.supabase.co") {
      if (envVar.required) {
        errors.push(`❌ Required variable ${envVar.name} is not set (${envVar.description})`);
      } else {
        warnings.push(`⚠️  Optional variable ${envVar.name} is not set (${envVar.description})`);
      }
    } else {
      // Check for placeholder values
      if (value.includes("your-") || value.includes("xxx") || value.includes("XXXXXXXXXX")) {
        if (envVar.required) {
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
