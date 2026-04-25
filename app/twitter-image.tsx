import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ace Your Permit - Illinois driving test prep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 40%, #ea580c 80%, #F97316 100%)",
          fontFamily: '"Arial Black", Arial, sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* Main heading */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: "24px",
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            display: "flex",
          }}
        >
          Ace Your Permit
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.5px",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          Illinois permit test prep, built for teens
        </div>

        {/* Pill badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: "999px",
              padding: "10px 28px",
              fontSize: "22px",
              color: "#ffffff",
              fontWeight: 600,
              display: "flex",
            }}
          >
            3,400+ questions
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              borderRadius: "999px",
              padding: "10px 28px",
              fontSize: "22px",
              color: "#ffffff",
              fontWeight: 600,
              display: "flex",
            }}
          >
            100% free
          </div>
        </div>

        {/* Footer domain */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "1px",
            display: "flex",
          }}
        >
          aceyourpermit.com
        </div>
      </div>
    ),
    { ...size }
  );
}
