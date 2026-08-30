"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#F8FAFC",
          color: "#0F172A",
          margin: 0,
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            Something went sideways
          </h1>
          <p style={{ color: "#475569", maxWidth: 400, margin: 0 }}>
            Not your fault. Hit retry and let&apos;s keep the streak alive.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              fontSize: 16,
              fontWeight: 600,
              minHeight: 44,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
