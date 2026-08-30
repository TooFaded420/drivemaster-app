"use client";

import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Download, Smartphone, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

type Platform = "ios" | "android" | "desktop" | "other";

interface PWAInstallPromptProps {
  className?: string;
  /**
   * Delay before showing the prompt (in milliseconds)
   * @default 3000
   */
  delay?: number;
  /**
   * Whether to show on desktop
   * @default false
   */
  showOnDesktop?: boolean;
}

/**
 * PWAInstallPrompt - A prompt to encourage users to install the PWA
 * 
 * Features:
 * - Only shows when app can be installed
 * - Respects user dismissal
 * - Platform-specific messaging
 * - Animated entrance
 */
export function PWAInstallPrompt({
  className,
  delay = 3000,
  showOnDesktop = false,
}: PWAInstallPromptProps) {
  const { canInstall, isStandalone, install, isInstalling } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (!dismissed) return false;
    const dismissedDate = new Date(dismissed);
    const daysSinceDismissed =
      (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceDismissed < 7;
  });

  const platform: Platform = getPlatform();

  // Show prompt after delay
  useEffect(() => {
    const canShowInstallCue = canInstall || platform === "ios";
    if (!canShowInstallCue || isStandalone || isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [canInstall, isStandalone, isDismissed, delay, platform]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  const handleInstall = async () => {
    await install();
    setIsVisible(false);
  };

  // Don't render if not applicable
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isDesktop = platform === "desktop";
  const isMobile = isIOS || isAndroid;
  const canShowInstallCue = canInstall || isIOS;

  if (!canShowInstallCue || isStandalone || isDismissed || !isVisible) {
    return null;
  }

  if (isDesktop && !showOnDesktop) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-50 md:left-auto md:right-6 md:w-96",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
        className
      )}
    >
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                {isMobile ? (
                  <Smartphone className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Laptop className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-base">Install Ace Your Permit</CardTitle>
                <CardDescription className="text-xs">
                  Get the best experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11 -mr-2 -mt-2"
              onClick={handleDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">
            {isIOS ? (
              <>
                Tap the share button{" "}
                <span className="inline-block align-middle">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>{" "}
                and select &quot;Add to Home Screen&quot;
              </>
            ) : isAndroid ? (
              <>Install Ace Your Permit for faster loading, offline fallback, and a full-screen study flow.</>
            ) : (
              <>Install Ace Your Permit on your computer for quick access and offline fallback.</>
            )}
          </p>
        </CardContent>
        {!isIOS && (
          <CardFooter>
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isInstalling ? "Installing..." : "Install App"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/**
 * MinimalInstallButton - A simple button for PWA installation
 */
export function MinimalInstallButton({
  className,
}: {
  className?: string;
}) {
  const { canInstall, isStandalone, install, isInstalling } = usePWA();

  if (!canInstall || isStandalone) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={install}
      disabled={isInstalling}
      className={cn("gap-2", className)}
    >
      <Download className="w-4 h-4" />
      {isInstalling ? "Installing..." : "Install"}
    </Button>
  );
}
