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
            {/* Arc: centre 60,76  radius 38, 195°→345° */}
            <path
              d="M 23 66 A 38 38 0 1 1 97 66"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Top tick */}
            <line x1="60" y1="44" x2="60" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* Orange needle at 330° */}
            <line x1="50" y1="82" x2="92" y2="58" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
            <circle cx="60" cy="76" r="8" fill="#F97316" />
            <circle cx="60" cy="76" r="4" fill="#EA580C" />
            {/* D letterform */}
            <rect x="42" y="88" width="7" height="18" rx="2.5" fill="white" />
            <path d="M 47 88 h7 a 9 9 0 0 1 0 18 h-7 Z" fill="white" />
            <path d="M 47.5 91 h4.5 a 6 6 0 0 1 0 12 h-4.5 Z" fill="#1D4ED8" />
            {/* Orange bar */}
            <rect x="42" y="110" width="32" height="4" rx="2" fill="#F97316" />
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
