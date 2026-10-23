"use client";

import { useEffect, useRef } from "react";

interface AdsenseBannerProps {
  slot?: string;
  format?: "leaderboard" | "rectangle" | "responsive";
  className?: string;
}

export default function AdsenseBanner({
  slot = "0000000000",
  format = "responsive",
  className = "",
}: AdsenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1974829355929040";

  useEffect(() => {
    if (adsenseClientId && typeof window !== "undefined") {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (err) {
        console.warn("[AdSense] Push error:", err);
      }
    }
  }, [adsenseClientId]);

  // Size styling presets
  const sizeStyles: Record<string, { minHeight: string; maxWidth: string }> = {
    leaderboard: { minHeight: "90px", maxWidth: "728px" },
    rectangle: { minHeight: "250px", maxWidth: "336px" },
    responsive: { minHeight: "100px", maxWidth: "100%" },
  };

  const currentSize = sizeStyles[format] || sizeStyles.responsive;

  return (
    <div
      className={`adsense-wrapper ${className}`}
      style={{
        width: "100%",
        maxWidth: currentSize.maxWidth,
        margin: "24px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Policy-compliant subtle label */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(255, 255, 255, 0.35)",
          textTransform: "uppercase",
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        Publicidade
      </div>

      {adsenseClientId ? (
        <div
          ref={adRef}
          style={{
            width: "100%",
            minHeight: currentSize.minHeight,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slot}
            data-ad-format={format === "responsive" ? "auto" : undefined}
            data-full-width-responsive={format === "responsive" ? "true" : undefined}
          />
        </div>
      ) : (
        /* Dark glassmorphic AdSense placeholder */
        <div
          style={{
            width: "100%",
            minHeight: currentSize.minHeight,
            borderRadius: "14px",
            border: "1px dashed rgba(255, 255, 255, 0.15)",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.04) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.4)",
            gap: "6px",
            userSelect: "none",
            transition: "border-color 0.2s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Espaço Google AdSense
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.3)" }}>
            {format === "leaderboard" && "Formato 728x90 Leaderboard (Desktop / Mobile Adaptativo)"}
            {format === "rectangle" && "Formato 300x250 / 336x280 Retângulo Médio (In-feed)"}
            {format === "responsive" && "Banner Responsivo Automático"}
          </span>
        </div>
      )}
    </div>
  );
}
