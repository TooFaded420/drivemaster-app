"use client";

// ============================================
// GoogleAnalytics
// Injects GA4 only when:
//   1. Consent is 'granted'
//   2. NEXT_PUBLIC_GA_MEASUREMENT_ID is set (format: G-XXXXXXXXXX)
//   3. Current route is not a sensitive/auth page
// Never receives PII. anonymize_ip is enabled.
// ============================================

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useAnalyticsConsent } from "@/lib/providers/analytics-consent";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set" | "consent",
      target: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

const BLOCKED_ROUTES = ["/login", "/signup", "/auth", "/privacy", "/settings"];

export function GoogleAnalytics() {
  const { consent } = useAnalyticsConsent();
  const pathname = usePathname();

  const isBlocked = BLOCKED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!GA_MEASUREMENT_ID || consent !== "granted" || isBlocked) return null;

  return (
    <>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {
  anonymize_ip: true,
  send_page_view: true
});
          `.trim(),
        }}
      />
    </>
  );
}
