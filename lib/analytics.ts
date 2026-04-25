// ============================================
// Analytics — typed track/identify/reset wrappers
//
// PII guidance for engineers:
//   • Add data-private to any input that contains personal information
//     (e.g. <input data-private … />) — PostHog session recording will mask it.
//   • Add data-clarity-mask to elements containing PII for Microsoft Clarity
//     (e.g. <p data-clarity-mask="true">…</p>).
//   • NEVER pass raw email addresses or Supabase auth IDs to track() or identify().
//     Use posthog.identify(user.id) only — no email, no phone.
//   • COPPA: consent defaults to denied; see lib/providers/analytics-consent.tsx.
// ============================================

// Union of all analytics event names covering the driving-test funnel.
export type AnalyticsEvent =
  | "signup_started"
  | "signup_completed"
  | "onboarding_step_viewed"
  | "onboarding_completed"
  | "first_quiz_started"
  | "first_quiz_completed"
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "quiz_abandoned"
  | "explanation_viewed"
  | "streak_incremented"
  | "streak_broken"
  | "push_opt_in"
  | "paywall_viewed"
  | "upgrade_clicked";

function isConsentGranted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("aceyourpermit:analytics-consent") === "granted";
  } catch {
    return false;
  }
}

function getPosthog(): { capture: (event: string, props?: Record<string, unknown>) => void; identify: (id: string, traits?: Record<string, unknown>) => void; reset: () => void } | null {
  if (typeof window === "undefined") return null;
  if (!("posthog" in window)) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as unknown as { posthog: any }).posthog;
}

/**
 * Track a named funnel event.
 * No-op when consent is not granted or when called server-side.
 */
export function track(
  event: AnalyticsEvent,
  props?: Record<string, unknown>
): void {
  if (!isConsentGranted()) return;
  const ph = getPosthog();
  ph?.capture(event, props);
}

/**
 * Identify a user by their Supabase user ID only.
 * Do NOT pass email or other PII as the id or in traits.
 * Only call after consent is granted.
 */
export function identify(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (!isConsentGranted()) return;
  const ph = getPosthog();
  ph?.identify(userId, traits);
}

/**
 * Reset the PostHog identity (call on sign-out).
 */
export function reset(): void {
  if (typeof window === "undefined") return;
  const ph = getPosthog();
  ph?.reset();
}

// ============================================
// Conversion helper
// Fires a named conversion to all active pixels.
// Safe to call even when pixels are not loaded — all calls are guarded
// with window checks and try/catch so a missing pixel never crashes the caller.
// ============================================

export type ConversionName =
  | "signup_completed"
  | "first_quiz_completed"
  | "upgrade_clicked";

/**
 * Fire a conversion event to Meta Pixel, TikTok Pixel, GA4, and PostHog.
 * Only fires when consent is granted. Pass Supabase user.id only, never email.
 * @param name - the conversion event name
 * @param value - optional monetary value (e.g. for upgrade_clicked)
 */
export function fireConversion(name: ConversionName, value?: number): void {
  if (!isConsentGranted()) return;
  if (typeof window === "undefined") return;

  // --- Meta Pixel ---
  try {
    if ("fbq" in window && typeof window.fbq === "function") {
      if (name === "signup_completed") {
        window.fbq("track", "Lead");
      } else if (name === "first_quiz_completed") {
        window.fbq("track", "StartTrial");
      } else if (name === "upgrade_clicked") {
        window.fbq("track", "Purchase", value !== undefined ? { value, currency: "USD" } : {});
      }
    }
  } catch {
    // pixel not loaded or blocked — ignore
  }

  // --- TikTok Pixel ---
  try {
    if ("ttq" in window && window.ttq && typeof window.ttq.track === "function") {
      if (name === "signup_completed") {
        window.ttq.track("CompleteRegistration");
      } else if (name === "first_quiz_completed") {
        window.ttq.track("ViewContent");
      } else if (name === "upgrade_clicked") {
        window.ttq.track("PlaceAnOrder", value !== undefined ? { value, currency: "USD" } : {});
      }
    }
  } catch {
    // pixel not loaded or blocked — ignore
  }

  // --- Google Analytics 4 ---
  try {
    if ("gtag" in window && typeof window.gtag === "function") {
      window.gtag("event", name, value !== undefined ? { value } : {});
    }
  } catch {
    // gtag not loaded or blocked — ignore
  }

  // --- PostHog (keep existing pipeline receiving the event) ---
  try {
    const ph = getPosthog();
    ph?.capture(name, value !== undefined ? { value } : undefined);
  } catch {
    // posthog not loaded — ignore
  }
}
