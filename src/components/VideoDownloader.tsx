"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdsenseBanner from "./AdsenseBanner";
import TrojanHorseCard from "./TrojanHorseCard";

interface DownloadFormat {
  id?: string;
  format_id?: string;
  label: string;
  quality?: string;
  ext: string;
  url: string;
}

interface VideoInfo {
  title: string;
  duration?: number;
  thumbnail?: string;
  uploader?: string;
  platform?: string;
  video_url?: string;
  video_hd_url?: string;
  audio_url?: string;
  formats?: DownloadFormat[];
}

interface VideoDownloaderProps {
  placeholder?: string;
}

export default function VideoDownloader({
  placeholder = "https://www.youtube.com/watch?v=..., https://www.tiktok.com/@..., reels, etc.",
}: VideoDownloaderProps = {}) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) setUrl(text.trim());
      }
    } catch {
      // Permission denied or not supported
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setError(
        isEnglish
          ? "Please paste a video link to continue."
          : "Por favor, cole o link de um vídeo para continuar."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(
          json.error ||
            (isEnglish
              ? "Could not process this video. Please verify that the link is public and try again."
              : "Não foi possível processar este vídeo. Verifique se o link está público e tente novamente.")
        );
      }

      setVideoInfo(json.data || json);
    } catch (err: any) {
      setError(
        err.message ||
          (isEnglish
            ? "An error occurred while fetching the video. Please check the URL and your connection."
            : "Ocorreu um erro ao buscar o vídeo. Verifique a URL e sua conexão.")
      );
    } finally {
      setLoading(false);
    }
  };

  const copyDirectLink = (targetUrl?: string) => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ width: "100%", maxWidth: "840px", margin: "0 auto" }}>
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label
            htmlFor="video-url-input"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{isEnglish ? "Paste video link" : "Cole o link do vídeo"}</span>
            <button
              type="button"
              onClick={handlePaste}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-primary, #6366f1)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>📋</span> {isEnglish ? "Paste from clipboard" : "Colar da área de transferência"}
            </button>
          </label>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <input
              id="video-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              required
              style={{
                width: "100%",
                padding: "16px 110px 16px 18px",
                borderRadius: "14px",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#8b5cf6";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.25)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setVideoInfo(null);
                  setError(null);
                }}
                title={isEnglish ? "Clear" : "Limpar"}
                style={{
                  position: "absolute",
                  right: "14px",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            {/* Platform pills */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.45)" }}>
                {isEnglish ? "Supported:" : "Compatível com:"}
              </span>
              {["YouTube", "TikTok", "Instagram Reels", "Facebook", "LinkedIn"].map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "rgba(255, 255, 255, 0.75)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Action button */}
            <button
              id="btn-fetch-video"
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                background: loading
                  ? "rgba(255, 255, 255, 0.1)"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                border: "none",
                cursor: loading || !url.trim() ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 18px rgba(99, 102, 241, 0.4)",
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  <span>{isEnglish ? "Processing link..." : "Processando link..."}</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>{isEnglish ? "Search Video" : "Buscar Vídeo"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error notification */}
      {error && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "14px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Video result card */}
      {videoInfo && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {/* Thumbnail or Media Card */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "240px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                aspectRatio: "16/9",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {videoInfo.thumbnail ? (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <span style={{ fontSize: "36px" }}>
                    {videoInfo.platform?.toLowerCase().includes("instagram")
                      ? "📸"
                      : videoInfo.platform?.toLowerCase().includes("tiktok")
                      ? "🎵"
                      : "🎬"}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255, 255, 255, 0.4)" }}>
                    {videoInfo.platform || "Vídeo"}
                  </span>
                </div>
              )}
              {videoInfo.duration ? (
                <span
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {formatDuration(videoInfo.duration)}
                </span>
              ) : null}
            </div>

            {/* Video details & download options */}
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  marginBottom: "8px",
                }}
              >
                {videoInfo.platform || "Vídeo"}
              </div>

              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: "1.4",
                  marginBottom: "6px",
                  wordBreak: "break-word",
                }}
              >
                {videoInfo.title}
              </h4>

              {videoInfo.uploader && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255, 255, 255, 0.5)",
                    marginBottom: "18px",
                  }}
                >
                  {isEnglish ? "Channel / Creator:" : "Canal / Autor:"} <strong>{videoInfo.uploader}</strong>
                </p>
              )}

              {/* Download buttons grid */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* Primary MP4 Download */}
                {(videoInfo.video_hd_url || videoInfo.video_url) && (
                  <a
                    id="btn-download-mp4"
                    href={videoInfo.video_hd_url || videoInfo.video_url}
                    target="_blank"
                    rel="noreferrer"
                    download={`${videoInfo.title.slice(0, 30)}.mp4`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 20px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    <span>🎬</span>
                    <span>{isEnglish ? "Download Video (MP4 HD)" : "Baixar Vídeo (MP4 HD)"}</span>
                  </a>
                )}

                {/* Audio MP3 Download */}
                {videoInfo.audio_url && (
                  <a
                    id="btn-download-mp3"
                    href={videoInfo.audio_url}
                    target="_blank"
                    rel="noreferrer"
                    download={`${videoInfo.title.slice(0, 30)}.mp3`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span>🎵</span>
                    <span>{isEnglish ? "Download Audio (MP3)" : "Baixar Áudio (MP3)"}</span>
                  </a>
                )}

                {/* Copy direct CDN Link */}
                <button
                  type="button"
                  onClick={() =>
                    copyDirectLink(
                      videoInfo.video_hd_url || videoInfo.video_url || videoInfo.audio_url
                    )
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <span>{copied ? "✓" : "🔗"}</span>
                  <span>{copied ? (isEnglish ? "Link Copied!" : "Link Copiado!") : (isEnglish ? "Copy Link" : "Copiar Link")}</span>
                </button>
              </div>

              {/* Extra format options if available */}
              {videoInfo.formats && videoInfo.formats.length > 1 && (
                <div style={{ marginTop: "16px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginRight: "8px" }}>
                    {isEnglish ? "Other resolutions:" : "Outras resoluções:"}
                  </span>
                  <div style={{ display: "inline-flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                    {videoInfo.formats.map((fmt, idx) => (
                      <a
                        key={idx}
                        href={fmt.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#cbd5e1",
                          textDecoration: "none",
                        }}
                      >
                        {fmt.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AdSense In-Feed / Mid-Content Placement (High CTR zone) */}
      <AdsenseBanner format="rectangle" slot="1000000002" />

      {/* Trojan Horse Conversion Card: Convert Downloader into AI Transcription User */}
      <TrojanHorseCard
        videoUrl={url}
        videoTitle={videoInfo?.title}
        platform={videoInfo?.platform || "vídeo"}
      />
    </div>
  );
}
