import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/og — Generate achievement share card
 *
 * Query params: score, user, streak
 * Returns: 1200x630 PNG image (Open Graph standard)
 *
 * Used by share button on quiz results page.
 * Rate limited to prevent abuse (checked client-side).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "0";
  const user = searchParams.get("user") || "Driver";
  const streak = searchParams.get("streak") || "0";

  // Sanitize inputs (prevent XSS in SVG)
  const safeScore = Math.min(100, Math.max(0, parseInt(score) || 0));
  const safeUser = user.slice(0, 20).replace(/[<>"&]/g, "");
  const safeStreak = Math.max(0, parseInt(streak) || 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            fontWeight: 800,
            textTransform: "uppercase" as const,
            letterSpacing: "0.15em",
            opacity: 0.7,
            marginBottom: 8,
          }}
        >
          Ace Your Permit Certified
        </div>

        {/* Trophy */}
        <div style={{ display: "flex", fontSize: 48, marginBottom: 16 }}>🏆</div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {safeScore}
          <span style={{ fontSize: 60, opacity: 0.7, marginTop: 20 }}>%</span>
        </div>

        {/* Username */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            opacity: 0.85,
            marginTop: 12,
          }}
        >
          @{safeUser}
        </div>

        {/* Streak */}
        {safeStreak > 0 && (
          <div
            style={{
              display: "flex",
              fontSize: 20,
              opacity: 0.65,
              marginTop: 6,
            }}
          >
            {safeStreak}-day streak 🔥
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            opacity: 0.5,
          }}
        >
          aceyourpermit.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
