import { ImageResponse } from "next/og";

const size = {
  width: 1200,
  height: 630
};

type SocialImageProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
};

export function createSocialImage({ eyebrow = "FTTH / OSP OPERATIONS", title, subtitle }: SocialImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#F6F4EE",
          color: "#0B1B2B",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(216,212,198,0.62) 1px, transparent 1px), linear-gradient(180deg, rgba(216,212,198,0.52) 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 76,
            bottom: 76,
            width: 4,
            background: "#1D9E75"
          }}
        />
        {[116, 315, 514].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 62,
              top,
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "5px solid #1D9E75",
              background: "#F6F4EE"
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 76,
            top: 74,
            width: 280,
            height: 190,
            border: "2px solid #D8D4C6",
            borderRadius: 14,
            background: "rgba(237,234,224,0.7)"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 116,
            top: 126,
            width: 200,
            height: 4,
            background: "#1D9E75"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 192,
            top: 126,
            width: 4,
            height: 88,
            background: "#1D9E75"
          }}
        />
        <main
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "88px 108px 88px 136px"
          }}
        >
          <div
          style={{
            display: "flex",
              width: "auto",
              marginBottom: 28,
              padding: "10px 14px",
              border: "1px solid rgba(29,158,117,0.35)",
              borderRadius: 999,
              background: "rgba(29,158,117,0.08)",
              color: "#0F6E56",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 1.6
            }}
          >
            {eyebrow}
          </div>
          <h1
            style={{
              maxWidth: 860,
              margin: 0,
              fontSize: title.length > 34 ? 70 : 82,
              lineHeight: 0.98,
              fontWeight: 800,
              letterSpacing: -1
            }}
          >
            {title}
          </h1>
          <p
            style={{
              maxWidth: 860,
              margin: "28px 0 0",
              color: "#5A6472",
              fontSize: 36,
              lineHeight: 1.22,
              fontWeight: 700
            }}
          >
            {subtitle}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 44,
              color: "#0F6E56",
              fontSize: 24,
              fontWeight: 700
            }}
          >
            <span
              style={{
                display: "flex",
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#1D9E75"
              }}
            />
            aysarobeidat.site
          </div>
        </main>
      </div>
    ),
    size
  );
}

export { size };
