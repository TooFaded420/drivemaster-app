"use client";

// ============================================
// PostHog Provider
// Initialises PostHog only when:
//   1. Consent is 'granted'
//   2. NEXT_PUBLIC_POSTHOG_KEY is set
// Session recording is fully disabled on auth routes (/login, /signup, /auth).
// ============================================

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnalyticsConsent } from "@/lib/providers/analytics-consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com";

/** Routes on which session recording must be fully disabled. */
const AUTH_ROUTES = ["/login", "/signup", "/auth"];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function PostHogInit({ children }: { children: React.ReactNode }) {
  const { consent } = useAnalyticsConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (!POSTHOG_KEY || consent !== "granted") return;

    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: "history_change",
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "[data-private]",
        },
        // Start with recording off; enable below only on non-auth routes
        disable_session_recording: isAuthRoute(pathname),
      });
    }
  }, [consent, pathname]);

  // Toggle recording on/off as the user navigates
  useEffect(() => {
    if (!posthog.__loaded) return;

    if (isAuthRoute(pathname)) {
      posthog.stopSessionRecording();
    } else if (consent === "granted") {
      posthog.startSessionRecording();
    }
  }, [pathname, consent]);

  // Opt out entirely when consent is revoked
  useEffect(() => {
    if (!posthog.__loaded) return;

    if (consent !== "granted") {
      posthog.opt_out_capturing();
    } else {
      posthog.opt_in_capturing();
    }
  }, [consent]);

  return <>{children}</>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_KEY) {
    // Key not configured — render children without analytics wrapper
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogInit>{children}</PostHogInit>
    </PostHogProvider>
  );
}
