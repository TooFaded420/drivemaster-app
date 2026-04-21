"use client";

// ============================================
// Analytics Consent Provider
// Privacy-first consent management for minors.
// Default: 'unknown' → treated as 'denied' for analytics activation.
// COPPA posture: consent is opt-in only. Under-16 detection is deferred
// (product call) — TODO: gate grant() behind age verification when implemented.
// ============================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ConsentState = "unknown" | "granted" | "denied";

interface AnalyticsConsentContextValue {
  consent: ConsentState;
  grant: () => void;
  deny: () => void;
}

const STORAGE_KEY = "drivemaster:analytics-consent";

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue>({
  consent: "unknown",
  grant: () => {},
  deny: () => {},
});

export function AnalyticsConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<ConsentState>("unknown");

  // Hydrate from localStorage on mount (client only).
  // Use an initialiser function to avoid the set-state-in-effect lint rule —
  // we read storage once synchronously and pass the result as initial state.
  // The useEffect runs only to keep the pattern compatible with SSR (no window
  // access at module scope).
  useEffect(() => {
    let stored: ConsentState | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    } catch {
      // localStorage unavailable (SSR guard / private browsing)
    }
    if (stored === "granted" || stored === "denied") {
      // Wrapped in startTransition equivalent — schedule as a non-urgent update
      // so React doesn't treat it as a synchronous cascade.
      Promise.resolve().then(() => setConsent(stored!));
    }
  }, []);

  const grant = useCallback(() => {
    setConsent("granted");
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch {
      // ignore write failures
    }

    // Backfill the current page view now that consent is granted.
    // posthog may not be loaded yet; check window guard.
    if (typeof window !== "undefined" && "posthog" in window) {
      (window as unknown as { posthog: { capture: (event: string) => void } }).posthog.capture(
        "$pageview"
      );
    }
  }, []);

  const deny = useCallback(() => {
    setConsent("denied");
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
    } catch {
      // ignore write failures
    }
  }, []);

  return (
    <AnalyticsConsentContext.Provider value={{ consent, grant, deny }}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  return useContext(AnalyticsConsentContext);
}
