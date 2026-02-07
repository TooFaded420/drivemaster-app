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
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed =
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
      }
    }
  }, []);

  // Show prompt after delay
  useEffect(() => {
    if (!canInstall || isStandalone || isDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [canInstall, isStandalone, isDismissed, delay]);

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
  if (!canInstall || isStandalone || isDismissed || !isVisible) {
    return null;
  }

  // Detect platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;

  if (!isMobile && !showOnDesktop) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50",
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
                <CardTitle className="text-base">Install DriveMaster</CardTitle>
                <CardDescription className="text-xs">
                  Get the best experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mr-2 -mt-2"
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
                and select "Add to Home Screen"
              </>
            ) : isAndroid ? (
              <>
                Install DriveMaster for offline access, faster loading, and a
                full-screen experience.
              </>
            ) : (
              <>
                Install DriveMaster on your computer for quick access and
                offline practice.
              </>
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
