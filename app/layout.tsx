import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsConsentProvider } from "@/lib/providers/analytics-consent";
import { PHProvider } from "@/lib/providers/posthog-provider";
import { ClarityScript } from "@/lib/providers/clarity-script";
import { MetaPixel } from "@/lib/providers/meta-pixel";
import { TikTokPixel } from "@/lib/providers/tiktok-pixel";
import { GoogleAnalytics } from "@/lib/providers/google-analytics";
import { PWAInit } from "@/components/pwa-init";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Cabinet Grotesk loaded via CSS @import from Fontshare CDN (see globals.css)
const inter = { variable: `${dmSans.variable} ${jetbrainsMono.variable}` };

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://drivemaster-app.vercel.app";
const title = "DriveMaster - Illinois Driving Test Prep";
const description =
  "Free Illinois permit practice tests. 3,400+ questions across all official SOS topics. Gamified for teens.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "illinois permit test",
    "illinois drivers license",
    "dmv practice test",
    "il sos",
    "drivers ed illinois",
    "permit test 2026",
  ],
  authors: [{ name: "DriveMaster" }],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "DriveMaster",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DriveMaster - Illinois driving test prep",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DriveMaster",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="DriveMaster" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DriveMaster" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <PWAInit />
        {/* a11y: skip navigation link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <AnalyticsConsentProvider>
          <PHProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main id="main">
                {children}
              </main>

              {/* PWA Install Prompt */}
              <PWAInstallPrompt delay={5000} />

              {/* Toast notifications */}
              <Toaster position="bottom-center" className="md:bottom-4" />
            </ThemeProvider>
            {/* Microsoft Clarity — consent-gated, client component */}
            <ClarityScript />
            {/* Paid-traffic pixels — consent-gated, client components */}
            <MetaPixel />
            <TikTokPixel />
            <GoogleAnalytics />
          </PHProvider>
        </AnalyticsConsentProvider>
      </body>
    </html>
  );
}
