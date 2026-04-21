"use client";

// Mount this in app/layout.tsx inside the body via the SEO lane.

import { useEffect } from "react";

export function PWAInit() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((e) => console.warn("SW registration failed:", e));
      });
    }
  }, []);
  return null;
}
