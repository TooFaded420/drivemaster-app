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

        {/* Logo row: inline SVG mark + wordmark text */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "28px",
            marginBottom: "28px",
          }}
        >
          {/* Inline speedometer logomark */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "flex", flexShrink: 0 }}
          >
            <defs>
              <linearGradient id="bgM" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
            <rect width="120" height="120" rx="24" fill="url(#bgM)" />
            {/* Bold checkmark — matches icon.svg, scaled to this 120x120 mark */}
            <path d="M 33 65.5 L 53.5 86 L 90 55.3" fill="none" stroke="#FFFFFF" strokeWidth="13.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="90" cy="55.3" r="7.5" fill="#F97316" />
          </svg>

          {/* Wordmark */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1,
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
              display: "flex",
            }}
          >
            Ace Your Permit
          </div>
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
          Illinois permit test prep — free, fast, actually fun
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
