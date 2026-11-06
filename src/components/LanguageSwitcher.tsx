"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BLOG_SLUG_MAP_PT_TO_EN, BLOG_SLUG_MAP_EN_TO_PT } from "@/lib/blog-slugs";

export const ROUTE_MAP_PT_TO_EN: Record<string, string> = {
  "/": "/en",
  "/precos": "/en/pricing",
  "/dashboard": "/en/dashboard",
  "/sugestoes": "/en/suggestions",
  "/blog": "/en/blog",
  "/baixar-video": "/en/download-video",
  "/transcrever-youtube": "/en/transcribe-youtube",
  "/transcrever-instagram": "/en/transcribe-instagram",
  "/transcrever-tiktok": "/en/transcribe-tiktok",
  "/transcrever-whatsapp": "/en/transcribe-whatsapp",
  "/gerar-legendas-srt": "/en/generate-srt-subtitles",
  "/converter-mp3-em-texto": "/en/convert-mp3-to-text",
  "/converter-mp4-em-texto": "/en/convert-mp4-to-text",
  "/converter-m4a-em-texto": "/en/convert-m4a-to-text",
  "/converter-wav-em-texto": "/en/convert-wav-to-text",
  "/transcricao-juridica": "/en/legal-transcription",
  "/transcricao-academica": "/en/academic-transcription",
  "/transcricao-de-reunioes": "/en/meeting-transcription",
  "/baixar-video-youtube": "/en/download-youtube-video",
  "/baixar-video-tiktok": "/en/download-tiktok-video",
  "/baixar-reels-instagram": "/en/download-instagram-reels",
  "/baixar-audio-youtube-mp3": "/en/youtube-to-mp3",
  "/sobre-nos": "/en/about-us",
  "/privacidade": "/en/privacy",
  "/termos-de-uso": "/en/terms",
};

// Build reverse dictionary dynamically
export const ROUTE_MAP_EN_TO_PT: Record<string, string> = Object.entries(
  ROUTE_MAP_PT_TO_EN
).reduce((acc, [pt, en]) => {
  acc[en] = pt;
  return acc;
}, {} as Record<string, string>);

// Support alternative English paths like /en/sugestoes
ROUTE_MAP_EN_TO_PT["/en/sugestoes"] = "/sugestoes";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isEnglish = pathname?.startsWith("/en");
  const currentLang = isEnglish ? "EN" : "PT";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: "PT" | "EN") => {
    setOpen(false);
    try {
      localStorage.setItem("pegueiotexto_lang", lang.toLowerCase());
    } catch {}

    const cleanPath = pathname ? pathname.replace(/\/$/, "") || "/" : "/";

    if (lang === "EN") {
      if (!isEnglish) {
        if (ROUTE_MAP_PT_TO_EN[cleanPath]) {
          router.push(ROUTE_MAP_PT_TO_EN[cleanPath]);
        } else if (cleanPath.startsWith("/blog/")) {
          const ptSlug = cleanPath.replace(/^\/blog\//, "").replace(/\/$/, "");
          const targetEnSlug = BLOG_SLUG_MAP_PT_TO_EN[ptSlug] || ptSlug;
          router.push(`/en/blog/${targetEnSlug}`);
        } else if (cleanPath === "/blog") {
          router.push("/en/blog");
        } else {
          router.push("/en");
        }
      }
    } else {
      if (isEnglish) {
        if (ROUTE_MAP_EN_TO_PT[cleanPath]) {
          router.push(ROUTE_MAP_EN_TO_PT[cleanPath]);
        } else if (cleanPath.startsWith("/en/blog/")) {
          const enSlug = cleanPath.replace(/^\/en\/blog\//, "").replace(/\/$/, "");
          const targetPtSlug = BLOG_SLUG_MAP_EN_TO_PT[enSlug] || enSlug;
          router.push(`/blog/${targetPtSlug}`);
        } else if (cleanPath === "/en/blog") {
          router.push("/blog");
        } else {
          router.push("/");
        }
      }
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Selecionar idioma / Select language"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
        }}
      >
        <span style={{ fontSize: "14px" }}>{isEnglish ? "🇺🇸" : "🇧🇷"}</span>
        <span>{currentLang}</span>
        <ChevronDown size={14} style={{ opacity: 0.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "rgba(15, 15, 35, 0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            padding: "6px",
            minWidth: "140px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => handleSelectLanguage("PT")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: !isEnglish ? "rgba(139, 92, 246, 0.18)" : "transparent",
              color: !isEnglish ? "#c084fc" : "rgba(255, 255, 255, 0.8)",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🇧🇷</span>
              <span>Português</span>
            </span>
            {!isEnglish && <Check size={14} color="#c084fc" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectLanguage("EN")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: isEnglish ? "rgba(139, 92, 246, 0.18)" : "transparent",
              color: isEnglish ? "#c084fc" : "rgba(255, 255, 255, 0.8)",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🇺🇸</span>
              <span>English</span>
            </span>
            {isEnglish && <Check size={14} color="#c084fc" />}
          </button>
        </div>
      )}
    </div>
  );
}
