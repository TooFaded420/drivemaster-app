"use client";

// ============================================
// MetaPixel
// Injects Meta (Facebook) Pixel only when:
//   1. Consent is 'granted'
//   2. NEXT_PUBLIC_META_PIXEL_ID is set
//   3. Current route is not a sensitive/auth page
// Never receives PII. Only passes anonymous events.
// ============================================

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useAnalyticsConsent } from "@/lib/providers/analytics-consent";

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[][];
      push: (...args: unknown[]) => void;
      loaded: boolean;
      version: string;
    };
    _fbq?: Window["fbq"];
  }
}

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

const BLOCKED_ROUTES = ["/login", "/signup", "/auth", "/privacy", "/settings"];

export function MetaPixel() {
  const { consent } = useAnalyticsConsent();
  const pathname = usePathname();

  const isBlocked = BLOCKED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!META_PIXEL_ID || consent !== "granted" || isBlocked) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
        `.trim(),
      }}
    />
  );
}
