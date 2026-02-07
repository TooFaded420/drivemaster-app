"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  /**
   * Whether the app is running in standalone mode (installed)
   */
  isStandalone: boolean;
  /**
   * Whether the app can be installed
   */
  canInstall: boolean;
  /**
   * Whether the install prompt is showing
   */
  isInstalling: boolean;
  /**
   * Function to trigger install prompt
   */
  install: () => Promise<void>;
  /**
   * Whether service worker is registered
   */
  isServiceWorkerRegistered: boolean;
  /**
   * Whether app is offline
   */
  isOffline: boolean;
  /**
   * Whether periodic background sync is supported
   */
  isPeriodicSyncSupported: boolean;
  /**
   * Whether push notifications are supported
   */
  isPushSupported: boolean;
  /**
   * Whether push notifications are subscribed
   */
  isPushSubscribed: boolean;
  /**
   * Subscribe to push notifications
   */
  subscribePush: () => Promise<void>;
  /**
   * Unsubscribe from push notifications
   */
  unsubscribePush: () => Promise<void>;
}

/**
 * usePWA - Hook for PWA functionality
 * 
 * Features:
 * - Detect standalone mode
 * - Handle install prompt
 * - Monitor online/offline status
 * - Push notification management
 * - Service worker registration
 * 
 * @example
 * const { isStandalone, canInstall, install } = usePWA();
 * 
 * if (canInstall && !isStandalone) {
 *   return <button onClick={install}>Install App</button>;
 * }
 */
export function usePWA(): PWAState {
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isPeriodicSyncSupported, setIsPeriodicSyncSupported] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isPushSubscribed, setIsPushSubscribed] = useState(false);

  // Check standalone mode
  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-ignore - iOS Safari
        window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    return () => mediaQuery.removeEventListener("change", checkStandalone);
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Check service worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerRegistered(true);
      });

      // Check periodic background sync support
      // @ts-ignore - Periodic background sync is not in all TypeScript definitions
      if ("periodicSync" in navigator.serviceWorker) {
        setIsPeriodicSyncSupported(true);
      }
    }

    // Check push notification support
    if ("PushManager" in window) {
      setIsPushSupported(true);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Install function
  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setCanInstall(false);
    }

    setDeferredPrompt(null);
    setIsInstalling(false);
  }, [deferredPrompt]);

  // Subscribe to push notifications
  const subscribePush = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ) as BufferSource,
      });

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setIsPushSubscribed(true);
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribePush = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      setIsPushSubscribed(false);
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
    }
  }, []);

  return {
    isStandalone,
    canInstall,
    isInstalling,
    install,
    isServiceWorkerRegistered,
    isOffline,
    isPeriodicSyncSupported,
    isPushSupported,
    isPushSubscribed,
    subscribePush,
    unsubscribePush,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * useServiceWorker - Hook for service worker communication
 */
export function useServiceWorker() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsReady(true);
      });
    }
  }, []);

  const sendMessage = useCallback(async (message: any) => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage(message);
  }, []);

  const sync = useCallback(async (tag: string) => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    // @ts-ignore - Background sync might not be in all TypeScript definitions
    if ("sync" in registration) {
      // @ts-ignore
      await registration.sync.register(tag);
    }
  }, []);

  return { isReady, sendMessage, sync };
}

/**
 * useNetworkStatus - Hook for monitoring network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>("unknown");
  const [effectiveType, setEffectiveType] = useState<string>("4g");
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsOnline(navigator.onLine);

      // @ts-ignore - Network Information API
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        setConnectionType(connection.type || "unknown");
        setEffectiveType(connection.effectiveType || "4g");
        setSaveData(connection.saveData || false);
      }
    };

    updateConnectionStatus();

    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener("change", updateConnectionStatus);
    }

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
      if (connection) {
        connection.removeEventListener("change", updateConnectionStatus);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
    effectiveType,
    saveData,
    isSlowConnection: effectiveType === "2g" || effectiveType === "slow-2g",
  };
}
