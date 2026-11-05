"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
  const [downloadingAudio, setDownloadingAudio] = useState(false);

  // Lead capture modal states
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadError, setLeadError] = useState("");
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState("");
  const [pendingDownloadType, setPendingDownloadType] = useState<"mp4" | "mp3">("mp4");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUser(data.user);
    }).catch(() => {});

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("url");
      if (urlParam) {
        setUrl(urlParam);
      }
    }
  }, []);

  const handleDownloadClick = (e: React.MouseEvent, targetUrl: string, type: "mp4" | "mp3" = "mp4") => {
    const savedEmail = typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_lead_email") : null;
    if (savedEmail || currentUser) {
      trackDownload(type);
      return; // Permite abrir diretamente na nova aba target="_blank"
    }

    // Intercepta e abre o modal de 15 minutos
    e.preventDefault();
    setPendingDownloadUrl(targetUrl);
    setPendingDownloadType(type);
    setShowLeadModal(true);
    setLeadError("");
  };

  const handleConfirmLeadDownload = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = leadEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clean || !emailRegex.test(clean)) {
      setLeadError(isEnglish ? "Please enter a valid email address." : "Por favor, digite um e-mail válido.");
      return;
    }

    // 1. Abre imediatamente a nova aba com o vídeo pronto (sem ser bloqueado por popup blocker)
    if (pendingDownloadUrl) {
      window.open(pendingDownloadUrl, "_blank", "noopener,noreferrer");
    }

    // 2. Salva localmente para não pedir de novo
    if (typeof window !== "undefined") {
      localStorage.setItem("pegueiotexto_lead_email", clean);
    }

    // 3. Fecha modal e mostra notificação toast
    setShowLeadModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 8000);

    // 4. Dispara captura de lead e envio do e-mail de 15 min em background
    fetch("/api/download/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: clean,
        video_url: url,
        video_title: videoInfo?.title,
      }),
    }).catch(() => {});

    trackDownload(pendingDownloadType);
  };

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

  const trackDownload = (format: "mp4" | "mp3") => {
    try {
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "video_download",
          download_format: format,
          video_platform: videoInfo?.platform || "web",
          video_title: videoInfo?.title || "",
          video_duration: videoInfo?.duration || 0,
        });
      }
    } catch (e) {
      console.error("GTM track error:", e);
    }
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
                    onClick={(e) => handleDownloadClick(e, videoInfo.video_hd_url || videoInfo.video_url || "", "mp4")}
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
                    download={`${videoInfo.title.slice(0, 40)}.mp3`}
                    onClick={(e) => {
                      handleDownloadClick(e, videoInfo.audio_url || "", "mp3");
                      if (typeof window !== "undefined" && (localStorage.getItem("pegueiotexto_lead_email") || currentUser)) {
                        setDownloadingAudio(true);
                        setTimeout(() => setDownloadingAudio(false), 12000);
                      }
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      background: downloadingAudio
                        ? "rgba(139, 92, 246, 0.25)"
                        : "rgba(255, 255, 255, 0.08)",
                      border: downloadingAudio
                        ? "1px solid rgba(139, 92, 246, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    {downloadingAudio ? (
                      <>
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            border: "2px solid #a78bfa",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            display: "inline-block",
                          }}
                        />
                        <span>{isEnglish ? "Preparing MP3..." : "Gerando MP3..."}</span>
                      </>
                    ) : (
                      <>
                        <span>🎵</span>
                        <span>{isEnglish ? "Download Audio (MP3)" : "Baixar Áudio (MP3)"}</span>
                      </>
                    )}
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
                        onClick={(e) =>
                          handleDownloadClick(
                            e,
                            fmt.url,
                            fmt.ext === "mp3" || fmt.id?.includes("mp3")
                              ? "mp3"
                              : "mp4"
                          )
                        }
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

      {/* Toast Notification after unlocking download */}
      {showSuccessToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 10000,
            background: "linear-gradient(135deg, rgba(20, 18, 42, 0.96) 0%, rgba(30, 20, 50, 0.96) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.45)",
            borderRadius: "14px",
            padding: "16px 20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(16, 185, 129, 0.2)",
            maxWidth: "380px",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🎉</span>
          <div>
            <p style={{ margin: 0, color: "#6EE7B7", fontWeight: 700, fontSize: "14px" }}>
              {isEnglish ? "Download Unlocked!" : "Download Liberado com Sucesso!"}
            </p>
            <p style={{ margin: "4px 0 0", color: "#cbd5e1", fontSize: "12px", lineHeight: 1.4 }}>
              {isEnglish
                ? "Your 15 free transcription minutes were sent to your email. Check your inbox!"
                : "Seus 15 minutos grátis de transcrição foram enviados para o seu e-mail. Confira sua caixa de entrada!"}
            </p>
          </div>
        </div>
      )}

      {/* Modal de Captura de Lead com Bônus de 15 Minutos */}
      {showLeadModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 4, 15, 0.82)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLeadModal(false);
          }}
        >
          <div
            style={{
              background: "#14122a",
              border: "1px solid rgba(124, 58, 237, 0.45)",
              borderRadius: "20px",
              padding: "32px 28px",
              maxWidth: "460px",
              width: "100%",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(124, 58, 237, 0.2)",
              textAlign: "left",
            }}
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={() => setShowLeadModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={18} />
            </button>

            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(124, 58, 237, 0.18)",
                border: "1px solid rgba(124, 58, 237, 0.45)",
                color: "#C4B5FD",
                padding: "5px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "16px",
              }}
            >
              <span>🎁</span>
              <span>15 Minutos de Transcrição Grátis</span>
            </div>

            {/* Título exato pedido pelo usuário */}
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 10px",
                lineHeight: 1.3,
              }}
            >
              🎬 Seu vídeo está pronto para download!
            </h3>

            {/* Subtítulo exato pedido pelo usuário */}
            <p
              style={{
                fontSize: "14px",
                color: "#cbd5e1",
                lineHeight: 1.5,
                margin: "0 0 20px",
              }}
            >
              Digite seu melhor e-mail para liberar o download em alta velocidade e receber 15 minutos grátis de transcrição com IA para testar quando quiser.
            </p>

            {/* Erro se houver */}
            {leadError && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#FCA5A5",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {leadError}
              </div>
            )}

            {/* Formulário com input e botão */}
            <form onSubmit={handleConfirmLeadDownload} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                type="email"
                required
                autoFocus
                placeholder="seu@email.com"
                value={leadEmail}
                onChange={(e) => {
                  setLeadEmail(e.target.value);
                  setLeadError("");
                }}
                className="input-base"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  fontSize: "14px",
                  borderRadius: "12px",
                  background: "rgba(10, 8, 24, 0.7)",
                  border: "1px solid rgba(124, 58, 237, 0.4)",
                  color: "#ffffff",
                }}
              />

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  justifyContent: "center",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(124, 58, 237, 0.45)",
                }}
              >
                Liberar Download Imediato →
              </button>

              {/* ps pedido pelo usuário */}
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  margin: "4px 0 0",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                ps: o crédito de 15 min de transcrição é enviado para o seu e-mail.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
