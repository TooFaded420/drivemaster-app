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

type IOSNavigator = Navigator & { standalone?: boolean };
type ServiceWorkerContainerWithPeriodicSync = ServiceWorkerContainer & {
  periodicSync?: unknown;
};
type ServiceWorkerRegistrationWithSync = ServiceWorkerRegistration & {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
};
type NetworkInformation = EventTarget & {
  type?: string;
  effectiveType?: string;
  saveData?: boolean;
};
type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
};

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
}

/**
 * usePWA - Hook for PWA functionality
 * 
 * Features:
 * - Detect standalone mode
 * - Handle install prompt
 * - Monitor online/offline status
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

  // Check standalone mode
  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as IOSNavigator).standalone === true;
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

    const handleAppInstalled = () => {
      setCanInstall(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Check service worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerRegistered(true);
      });

      const serviceWorker = navigator.serviceWorker as ServiceWorkerContainerWithPeriodicSync;
      if ("periodicSync" in serviceWorker) {
        queueMicrotask(() => setIsPeriodicSyncSupported(true));
      }
    }

  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    queueMicrotask(() => setIsOffline(!navigator.onLine));

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

  return {
    isStandalone,
    canInstall,
    isInstalling,
    install,
    isServiceWorkerRegistered,
    isOffline,
    isPeriodicSyncSupported,
};
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

  const sendMessage = useCallback(async (message: unknown) => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage(message);
  }, []);

  const sync = useCallback(async (tag: string) => {
    if (!("serviceWorker" in navigator)) return;

    const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithSync;
    if (registration.sync) {
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

      const nav = navigator as NavigatorWithConnection;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (connection) {
        setConnectionType(connection.type || "unknown");
        setEffectiveType(connection.effectiveType || "4g");
        setSaveData(connection.saveData || false);
      }
    };

    queueMicrotask(updateConnectionStatus);

    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
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
