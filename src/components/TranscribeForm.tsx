"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Link2, Upload, Loader2, CheckCircle2, Download,
  Copy, FileText, FileCode, FileType, Mic2, Trash2, RotateCcw, Zap, ArrowRight,
  Sparkles, Check, FileDown, Share2, ExternalLink
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exportToTxt, exportToSrt, exportToVtt, exportToDocx, exportToPdf } from "@/lib/exportUtils";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";

type Mode = "url" | "upload";
type Status = "idle" | "loading" | "done" | "error" | "insufficient_credits";

const DEMO_TRANSCRIPT = `[00:00] Bem-vindos ao nosso canal! Hoje vamos falar sobre como a inteligência artificial está transformando a forma como trabalhamos com conteúdo audiovisual.

[00:12] Nos últimos anos, vimos uma explosão no volume de vídeos produzidos, de podcasts a webinars, de reuniões a aulas online. Mas todo esse conteúdo fica inacessível se não tiver texto associado.

[00:28] É aí que entra a transcrição automática. Com modelos modernos de Inteligência Artificial, conseguimos uma precisão impressionante mesmo em áudios com sotaque regional ou ruído de fundo.

[00:45] E o melhor: em português brasileiro, a qualidade é excelente. Conseguimos capturar expressões idiomáticas, gírias e variações regionais com alta fidelidade.

[01:02] Se você chegou até aqui, já entendeu o poder dessa tecnologia. Então deixa o like, se inscreve no canal e a gente se vê no próximo vídeo!`;

const DEMO_TRANSCRIPT_EN = `[00:00] Welcome to our channel! Today we're exploring how artificial intelligence is transforming the way we produce and distribute audio and video content.

[00:12] In recent years, we've seen an exponential explosion in video creation, from podcasts and webinars to meetings and masterclasses. But without indexed text, that content is easily lost.

[00:28] That's where automated transcription comes in. Using cutting-edge AI speech engines, we achieve 99.2% accuracy even with fast dialogue or background noise.

[00:45] You get clean punctuation, precise speaker timestamps, and instant export to CapCut subtitles (.SRT) or formatted documents.

[01:02] If you found this helpful, subscribe to our channel and see you in the next video!`;

const platforms = [
  { name: "YouTube", color: "#FF0000", emoji: "▶" },
  { name: "Instagram", color: "#E1306C", emoji: "📷" },
  { name: "TikTok", color: "#00F2EA", emoji: "♪" },
  { name: "Vimeo", color: "#1AB7EA", emoji: "🎬" },
  { name: "Twitter/X", color: "#1DA1F2", emoji: "𝕏" },
  { name: "Facebook", color: "#4267B2", emoji: "f" },
  { name: "LinkedIn", color: "#0077B5", emoji: "in" },
  { name: "Twitch", color: "#9146FF", emoji: "🎮" },
];

interface TranscribeFormProps {
  initialPlaceholder?: string;
  defaultUrl?: string;
}

export default function TranscribeForm({ initialPlaceholder, defaultUrl = "" }: TranscribeFormProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState(defaultUrl);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [resultTitle, setResultTitle] = useState("");
  const [resultId, setResultId] = useState<string | null>(null);
  const [sharedToast, setSharedToast] = useState(false);
  const [resultSrt, setResultSrt] = useState("");
  const [resultVtt, setResultVtt] = useState("");
  const [resultDuration, setResultDuration] = useState<number | null>(null);
  const [minutesDeducted, setMinutesDeducted] = useState<number>(0);
  const [mediaDeleted, setMediaDeleted] = useState(false);
  const [engineUsed, setEngineUsed] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [insufficientMsg, setInsufficientMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [resultTab, setResultTab] = useState<"transcript" | "summary" | "srt">("transcript");
  const [summaryData, setSummaryData] = useState<{
    executive_summary?: string;
    key_points?: string[];
    takeaway?: string;
  } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const queryUrl = searchParams.get("url");
      const savedUrl = queryUrl || localStorage.getItem("pegueiotexto_pending_url");

      if (savedUrl) {
        setUrl(savedUrl);
        localStorage.removeItem("pegueiotexto_pending_url");

        // Verify if user is logged in
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            // User just arrived from login or Trojan Horse link, auto-trigger transcription in dashboard!
            handleTranscribe(savedUrl);
          } else {
            setIsRestored(true);
          }
        });
      }
    }
  }, []);

  const handleTranscribe = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // If user is not authenticated, redirect to login/signup to earn 5 free minutes!
    if (!session) {
      if (mode === "url" && targetUrl) {
        localStorage.setItem("pegueiotexto_pending_url", targetUrl);
      }
      router.push("/login?signup=true&reason=transcribe&redirect=/dashboard?auto_transcribe=true");
      return;
    }

    setStatus("loading");
    setProgress(15);
    setTranscript("");
    setErrorMsg("");
    setInsufficientMsg("");
    setMediaDeleted(false);
    setMinutesDeducted(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 88 ? prev + 6 : prev));
    }, 900);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      let res;
      if (mode === "url") {
        res = await fetch("/api/transcribe/url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ url: targetUrl, language: "auto" }),
        });
      } else {
        if (!file) throw new Error("Selecione um arquivo de áudio ou vídeo.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", "auto");
        res = await fetch("/api/transcribe/upload", {
          method: "POST",
          headers: {
            ...authHeaders,
          },
          body: formData,
        });
      }

      clearInterval(interval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const detail = typeof errJson.detail === "string" ? errJson.detail : (errJson.detail?.message || "Erro no processamento.");

        // Handled: Insufficient Credits / Time Limit Exceeded
        if (res.status === 402 || detail.toLowerCase().includes("saldo") || detail.toLowerCase().includes("insuficiente")) {
          setStatus("insufficient_credits");
          setInsufficientMsg(detail);
          return;
        }

        throw new Error(detail || `Erro no servidor (${res.status})`);
      }

      const data = await res.json();
      setProgress(100);

      // Notify dashboard to update credits balance immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("credits_updated", { detail: data }));
      }

      setTimeout(() => {
        setStatus("done");
        setTranscript(data.text || (isEnglish ? DEMO_TRANSCRIPT_EN : DEMO_TRANSCRIPT));
        setResultTitle(data.title || (mode === "url" ? url : file?.name || (isEnglish ? "Transcription" : "Transcrição")));
        setResultId(data.id || null);
        setResultSrt(data.srt || "");
        setResultVtt(data.vtt || "");
        setResultDuration(data.duration || null);
        setMinutesDeducted(data.minutes_deducted || 0);
        setMediaDeleted(data.media_deleted ?? true);
        setEngineUsed(isEnglish ? "Artificial Intelligence" : "Inteligência Artificial");
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      console.error("Erro na transcrição:", err);
      setStatus("error");
      setErrorMsg(
        err.message ||
          (isEnglish
            ? "Failed to process audio. Please try again."
            : "Falha ao processar o áudio. Tente novamente.")
      );
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const getFullSummaryText = () => {
    if (!summaryData) return undefined;
    return `RESUMO EXECUTIVO:\n${summaryData.executive_summary || ""}\n\nPRINCIPAIS PONTOS:\n${(summaryData.key_points || []).map((p) => `• ${p}`).join("\n")}\n\nCONCLUSÃO:\n${summaryData.takeaway || ""}`;
  };

  const handleDownloadTxt = () => {
    exportToTxt(transcript, resultTitle || "transcricao");
  };

  const handleDownloadSrt = () => {
    exportToSrt(resultSrt || transcript, resultTitle || "legendas");
  };

  const handleDownloadVtt = () => {
    exportToVtt(resultVtt || transcript, resultTitle || "legendas");
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportToDocx(transcript, resultTitle || "Transcrição", {
        duration: resultDuration ?? undefined,
        summary: getFullSummaryText(),
      });
    } catch (err) {
      console.error("Erro ao gerar DOCX:", err);
      alert("Erro ao gerar arquivo Word. Tente novamente.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      exportToPdf(transcript, resultTitle || "Transcrição", {
        duration: resultDuration ?? undefined,
        summary: getFullSummaryText(),
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao gerar arquivo PDF. Tente novamente.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcript) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/transcribe/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: transcript,
          title: resultTitle || "Transcrição",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSummaryData(data);
        setResultTab("summary");
      } else {
        const errMsg = typeof data?.detail === "string" && data.detail !== "Not Found"
          ? data.detail
          : "Não foi possível gerar o resumo neste momento. Tente novamente em instantes.";
        alert(errMsg);
      }
    } catch (err) {
      console.error("Erro ao gerar resumo:", err);
      alert("Falha de conexão com o servidor ao gerar resumo.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopySummary = () => {
    const text = getFullSummaryText();
    if (text) {
      navigator.clipboard.writeText(text);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (resultId) {
      const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/t/${resultId}`
        : `https://pegueiotexto.com.br/t/${resultId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        setSharedToast(true);
        setTimeout(() => setSharedToast(false), 2500);
      }
      if (navigator.share) {
        navigator.share({
          title: resultTitle || "Transcrição no Peguei o Texto",
          url: shareUrl,
        }).catch(() => {});
      }
    } else {
      handleCopy();
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setTranscript("");
    setProgress(0);
    setUrl("");
    setFile(null);
    setResultId(null);
    setSharedToast(false);
    setErrorMsg("");
    setInsufficientMsg("");
    setSummaryData(null);
    setResultTab("transcript");
  };

  const canSubmit = mode === "url" ? url.trim().length > 5 : !!file;

  const progressLabel = isEnglish
    ? progress < 25
      ? "Connecting to server..."
      : progress < 50
      ? (mode === "url" ? "Downloading video stream..." : "Uploading file...")
      : progress < 75
      ? "Processing audio with Artificial Intelligence..."
      : progress < 95
      ? "Formatting subtitles and text..."
      : "Ready!"
    : progress < 25
    ? "Conectando ao servidor..."
    : progress < 50
    ? (mode === "url" ? "Baixando stream do vídeo..." : "Enviando arquivo...")
    : progress < 75
    ? "Processando áudio com Inteligência Artificial..."
    : progress < 95
    ? "Formatando legendas e texto..."
    : "Pronto!";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Restored notice banner */}
      {isRestored && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "20px",
          color: "#6ee7b7",
          fontSize: "13px",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>
              {isEnglish ? (
                <>
                  Video link restored! Your <strong>5 free minutes</strong> are ready to use. Click &quot;Transcribe Video Now&quot; below.
                </>
              ) : (
                <>
                  Link do seu vídeo recuperado! Seus <strong>5 minutos grátis</strong> já estão prontos para usar. Clique em &quot;Transcrever Vídeo Agora&quot; abaixo.
                </>
              )}
            </span>
          </span>
          <button
            onClick={() => setIsRestored(false)}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "16px" }}
          >
            ×
          </button>
        </div>
      )}

      {/* MODE TABS */}
      <div className="tab-list" style={{ marginBottom: "24px" }}>
        <button
          id="tab-url"
          className={`tab-item ${mode === "url" ? "active" : ""}`}
          onClick={() => { setMode("url"); setStatus("idle"); }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Link2 size={15} /> {isEnglish ? "Paste video link" : "Colar link do vídeo"}
          </span>
        </button>
        <button
          id="tab-upload"
          className={`tab-item ${mode === "upload" ? "active" : ""}`}
          onClick={() => { setMode("upload"); setStatus("idle"); }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Upload size={15} /> {isEnglish ? "Upload file" : "Enviar arquivo"}
          </span>
        </button>
      </div>

      {/* INPUT AREA */}
      {status === "idle" && (
        <div className="glass-card" style={{ padding: "32px" }}>
          {mode === "url" ? (
            <div>
              <label style={{ display: "block", marginBottom: "12px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>
                {isEnglish ? "Paste video link" : "Cole o link do vídeo"}
              </label>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <input
                  id="video-url-input"
                  type="url"
                  className="input-base"
                  placeholder={initialPlaceholder || "https://youtube.com/watch?v=..."}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canSubmit && handleTranscribe()}
                  style={{ flex: 1, minWidth: 200 }}
                />
                <button
                  id="btn-transcribe-url"
                  className="btn-primary"
                  onClick={() => handleTranscribe()}
                  disabled={!canSubmit}
                  style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}
                >
                  <Mic2 size={16} /> {isEnglish ? "Transcribe" : "Transcrever"}
                </button>
              </div>

              {/* Platforms Grid */}
              <div style={{ marginTop: "24px" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {isEnglish ? "Supported platforms" : "Plataformas suportadas"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {platforms.map((p) => (
                    <span key={p.name} style={{
                      padding: "4px 12px",
                      borderRadius: "100px",
                      fontSize: "12px",
                      fontWeight: 500,
                      background: `${p.color}18`,
                      color: p.color,
                      border: `1px solid ${p.color}30`,
                    }}>
                      {p.name}
                    </span>
                  ))}
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: "rgba(124,58,237,0.1)",
                    color: "#A78BFA",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}>
                    {isEnglish ? "+1,700 more ↗" : "+1.700 mais ↗"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div
                id="dropzone"
                className={`drop-zone ${dragOver ? "dragging" : ""}`}
                style={{ padding: "48px 32px", textAlign: "center" }}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/*,audio/*,.mp3,.mp4,.wav,.m4a,.ogg,.webm,.mkv,.avi"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                {file ? (
                  <div>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎬</div>
                    <p style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "4px" }}>{file.name}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: 60, height: 60,
                      background: "rgba(124,58,237,0.12)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px",
                    }}>
                      <Upload size={24} color="#A78BFA" />
                    </div>
                    <p style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "6px" }}>
                      {isEnglish ? "Drag & drop file or click to select" : "Arraste o arquivo ou clique para selecionar"}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {isEnglish ? "MP4, MP3, WAV, M4A, OGG, WEBM, MKV, AVI (up to 2 GB)" : "MP4, MP3, WAV, M4A, OGG, WEBM, MKV, AVI (até 2 GB)"}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  id="btn-transcribe-upload"
                  className="btn-primary"
                  onClick={() => handleTranscribe()}
                  disabled={!canSubmit}
                  style={{ opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }}
                >
                  <Mic2 size={16} /> {isEnglish ? "Transcribe file" : "Transcrever arquivo"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOADING STATE */}
      {status === "loading" && (
        <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
          {/* Animated sound bars */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "6px", height: "48px", marginBottom: "24px" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="wave-bar" style={{ height: `${Math.random() * 32 + 16}px` }} />
            ))}
          </div>

          <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "18px", marginBottom: "8px" }}>
            {isEnglish ? "Transcribing..." : "Transcrevendo..."}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            {progressLabel}
          </p>

          <div className="progress-bar" style={{ maxWidth: 320, margin: "0 auto" }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>{progress}%</p>
        </div>
      )}

      {/* INSUFFICIENT CREDITS / EXCEEDED TIME UPSELL STATE */}
      {status === "insufficient_credits" && (
        <div className="glass-card" style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1))",
          border: "1px solid rgba(124, 58, 237, 0.4)",
          borderRadius: "16px",
          padding: "36px 24px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(124, 58, 237, 0.2)",
          marginTop: "16px"
        }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)"
          }}>
            <Zap size={28} color="white" />
          </div>

          <h3 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "8px", color: "var(--text-primary)" }}>
            {isEnglish ? "You need more minutes for this video" : "Você precisa de mais minutos para este vídeo"}
          </h3>

          <p style={{ color: "#cbd5e1", fontSize: "15px", maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.6 }}>
            {insufficientMsg || (isEnglish ? "The duration of this video exceeds your available balance." : "A duração deste vídeo excede o tempo disponível no seu saldo atual.")}
          </p>

          {/* Packages Showcase (NO per-minute pricing) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            maxWidth: 580,
            margin: "0 auto 28px"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "16px 12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Starter</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>{isEnglish ? "60 minutes" : "60 minutos"}</div>
              <div style={{ fontSize: "15px", color: "#A78BFA", fontWeight: 700 }}>R$ 4,90</div>
            </div>

            <div style={{
              background: "rgba(124, 58, 237, 0.16)",
              border: "1px solid rgba(124, 58, 237, 0.45)",
              borderRadius: "12px",
              padding: "16px 12px",
              textAlign: "center",
              position: "relative"
            }}>
              <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#7C3AED", color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px" }}>POPULAR</div>
              <div style={{ fontSize: "11px", color: "#C4B5FD", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Pro</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>{isEnglish ? "300 minutes" : "300 minutos"}</div>
              <div style={{ fontSize: "15px", color: "#67E8F9", fontWeight: 700 }}>R$ 17,90</div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "16px 12px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Business</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>{isEnglish ? "1,000 minutes" : "1.000 minutos"}</div>
              <div style={{ fontSize: "15px", color: "#10B981", fontWeight: 700 }}>R$ 79,90</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={isEnglish ? "/en/pricing" : "/precos"}
              className="btn-primary"
              style={{
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 25px rgba(124, 58, 237, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Zap size={16} /> {isEnglish ? "Refill More Minutes Now" : "Recarregar Mais Minutos Agora"} <ArrowRight size={16} />
            </Link>
            <button
              className="btn-secondary"
              onClick={handleReset}
              style={{ padding: "14px 22px", fontSize: "14px" }}
            >
              <RotateCcw size={15} /> {isEnglish ? "Try another video" : "Tentar outro vídeo"}
            </button>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {status === "error" && (
        <div className="glass-card" style={{ padding: "32px", textAlign: "center", borderColor: "rgba(239,68,68,0.3)" }}>
          <div style={{
            width: 48, height: 48,
            background: "rgba(239,68,68,0.15)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <RotateCcw size={22} color="#EF4444" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
            {isEnglish ? "Unable to transcribe" : "Não foi possível transcrever"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 480, margin: "0 auto 24px" }}>
            {errorMsg || (isEnglish ? "A problem occurred while downloading or processing media. Please check the link or file format." : "Ocorreu um problema ao baixar ou processar a mídia. Verifique o link ou formato do arquivo.")}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", margin: "0 auto" }}>
            {(errorMsg.toLowerCase().includes("saldo") || errorMsg.toLowerCase().includes("minutos") || errorMsg.toLowerCase().includes("insuficiente")) && (
              <Link href={isEnglish ? "/en/pricing" : "/precos"} className="btn-primary" style={{ textDecoration: "none" }}>
                {isEnglish ? "Refill minutes ↗" : "Recarregar minutos ↗"}
              </Link>
            )}
            <button className="btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> {isEnglish ? "Try again" : "Tentar novamente"}
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {status === "done" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Success header */}
          <div className="glass-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{
              width: 40, height: 40,
              background: "rgba(16,185,129,0.15)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <CheckCircle2 size={20} color="#10B981" />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                {resultTitle ? resultTitle.slice(0, 50) + (resultTitle.length > 50 ? "..." : "") : (isEnglish ? "Transcription complete!" : "Transcrição concluída!")}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                {resultDuration ? `${Math.floor(resultDuration / 60)}m ${Math.round(resultDuration % 60)}s • ` : ""}
                {transcript.split(/\s+/).filter(Boolean).length} {isEnglish ? "words" : "palavras"} • {engineUsed || (isEnglish ? "Artificial Intelligence" : "Inteligência Artificial")}
                {minutesDeducted > 0 && (
                  <span style={{ marginLeft: "8px", color: "#6EE7B7", fontWeight: 600 }}>
                    (-{minutesDeducted} min)
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {resultId && (
                <button
                  className="btn-ghost"
                  onClick={handleShare}
                  style={{
                    fontSize: "13px",
                    padding: "6px 14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: sharedToast ? "#67E8F9" : undefined,
                    borderColor: sharedToast ? "rgba(6, 182, 212, 0.4)" : undefined,
                    background: sharedToast ? "rgba(6, 182, 212, 0.12)" : undefined,
                  }}
                  title={isEnglish ? "Copy public link for this transcription" : "Copiar link público desta transcrição para WhatsApp ou Notion"}
                >
                  {sharedToast ? (
                    <>
                      <Check size={14} color="#67E8F9" /> {isEnglish ? "Link copied!" : "Link copiado!"}
                    </>
                  ) : (
                    <>
                      <Share2 size={14} /> {isEnglish ? "Share" : "Compartilhar"}
                    </>
                  )}
                </button>
              )}
              <button className="btn-ghost" onClick={handleReset} style={{ flexShrink: 0 }}>
                <RotateCcw size={15} /> {isEnglish ? "New transcription" : "Nova transcrição"}
              </button>
            </div>
          </div>

          {/* Synchronized Audio Player Component */}
          <AudioSyncPlayer title={resultTitle} initialAudioFile={file} />

          {/* RESULT TABS NAVIGATION */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
            <button
              onClick={() => setResultTab("transcript")}
              style={{
                background: resultTab === "transcript" ? "rgba(124, 58, 237, 0.15)" : "transparent",
                color: resultTab === "transcript" ? "#A78BFA" : "var(--text-muted)",
                border: resultTab === "transcript" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
            >
              <FileText size={15} /> {isEnglish ? "Full Transcript" : "Texto Completo"}
            </button>

            <button
              onClick={() => setResultTab("summary")}
              style={{
                background: resultTab === "summary" ? "rgba(124, 58, 237, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: resultTab === "summary" ? "#C4B5FD" : "var(--text-secondary)",
                border: resultTab === "summary" ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid var(--border-subtle)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                position: "relative"
              }}
            >
              <Sparkles size={15} color="#A78BFA" />
              <span>{isEnglish ? "AI Summary" : "Resumo com IA"}</span>
              {summaryData && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              )}
            </button>

            <button
              onClick={() => setResultTab("srt")}
              style={{
                background: resultTab === "srt" ? "rgba(124, 58, 237, 0.15)" : "transparent",
                color: resultTab === "srt" ? "#A78BFA" : "var(--text-muted)",
                border: resultTab === "srt" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
            >
              <FileCode size={15} /> {isEnglish ? "Subtitles (.SRT)" : "Legendas (.SRT)"}
            </button>
          </div>

          {/* TAB CONTENT: 1. FULL TRANSCRIPT */}
          {resultTab === "transcript" && (
            <div className="glass-card" style={{ padding: "0" }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={15} color="#A78BFA" />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
                    {isEnglish ? "Transcribed Text" : "Texto Transcrito"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {!summaryData && (
                    <button
                      className="btn-ghost"
                      style={{ fontSize: "13px", color: "#A78BFA", borderColor: "rgba(124, 58, 237, 0.35)", background: "rgba(124, 58, 237, 0.08)" }}
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                    >
                      {isSummarizing ? (
                        <>
                          <Loader2 size={13} className="animate-spin" /> {isEnglish ? "Generating summary..." : "Gerando resumo..."}
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} /> {isEnglish ? "Generate AI summary" : "Gerar resumo com IA"}
                        </>
                      )}
                    </button>
                  )}
                  <button id="btn-copy" className="btn-ghost" style={{ fontSize: "13px" }} onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check size={13} color="#10B981" /> {isEnglish ? "Copied!" : "Copiado!"}
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> {isEnglish ? "Copy text" : "Copiar texto"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="result-box" style={{ borderRadius: "0 0 16px 16px", border: "none", margin: 0, maxHeight: 420, overflowY: "auto", padding: "20px" }}>
                <InteractiveTranscript text={transcript} />
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. AI SUMMARY */}
          {resultTab === "summary" && (
            <div className="glass-card" style={{ padding: "24px" }}>
              {!summaryData ? (
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{
                    width: 52, height: 52,
                    background: "rgba(124, 58, 237, 0.15)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "16px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <Sparkles size={24} color="#A78BFA" />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {isEnglish ? "Smart AI Summary & Highlights" : "Resumo Inteligente e Tópicos com IA"}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.6 }}>
                    {isEnglish
                      ? "Our AI synthesizes this transcription in seconds with an executive summary, key takeaways, and actionable takeaways."
                      : "Nossa IA sintetiza esta transcrição em segundos com um resumo executivo, principais aprendizados e conclusões práticas."}
                  </p>
                  <button
                    className="btn-primary"
                    onClick={handleGenerateSummary}
                    disabled={isSummarizing}
                    style={{ padding: "12px 28px", fontSize: "15px" }}
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> {isEnglish ? "Synthesizing with AI..." : "Sintetizando com IA..."}
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> {isEnglish ? "Generate Summary Now" : "Gerar Resumo Agora"}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Sparkles size={16} color="#A78BFA" />
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>
                        {isEnglish ? "Smart Content Synthesis" : "Síntese Inteligente do Conteúdo"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: "13px", color: summaryCopied ? "#10B981" : undefined }}
                        onClick={handleCopySummary}
                      >
                        {summaryCopied ? (
                          <>
                            <Check size={13} color="#10B981" /> {isEnglish ? "Summary Copied!" : "Resumo Copiado!"}
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> {isEnglish ? "Copy Summary" : "Copiar Resumo"}
                          </>
                        )}
                      </button>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: "13px" }}
                        onClick={handleGenerateSummary}
                        disabled={isSummarizing}
                        title={isEnglish ? "Regenerate AI summary" : "Regenerar resumo com IA"}
                      >
                        <RotateCcw size={13} /> {isSummarizing ? (isEnglish ? "Regenerating..." : "Regenerando...") : (isEnglish ? "Regenerate" : "Regenerar")}
                      </button>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                      📌 {isEnglish ? "Executive Summary" : "Resumo Executivo"}
                    </h4>
                    <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)", background: "rgba(255, 255, 255, 0.03)", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                      {summaryData.executive_summary}
                    </p>
                  </div>

                  {/* Key Points */}
                  {summaryData.key_points && summaryData.key_points.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#67E8F9", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                        💡 {isEnglish ? "Key Highlights & Takeaways" : "Principais Pontos e Aprendizados"}
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {summaryData.key_points.map((point, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "rgba(255, 255, 255, 0.02)", padding: "10px 14px", borderRadius: "8px" }}>
                            <Check size={15} color="#A78BFA" style={{ flexShrink: 0, marginTop: "3px" }} />
                            <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Takeaway */}
                  {summaryData.takeaway && (
                    <div>
                      <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        🎯 {isEnglish ? "Conclusion & Next Steps" : "Conclusão e Próximos Passos"}
                      </h4>
                      <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", fontStyle: "italic", borderLeft: "3px solid #10B981", paddingLeft: "14px" }}>
                        &quot;{summaryData.takeaway}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 3. SRT SUBTITLES */}
          {resultTab === "srt" && (
            <div className="glass-card" style={{ padding: "0" }}>
              <div style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileCode size={15} color="#A78BFA" />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
                    {isEnglish ? "Timestamped Subtitles (.SRT)" : "Legendas com Marcas de Tempo (.SRT)"}
                  </span>
                </div>
                <button
                  className="btn-ghost"
                  style={{ fontSize: "13px" }}
                  onClick={() => {
                    navigator.clipboard.writeText(resultSrt || transcript);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={13} color="#10B981" /> {isEnglish ? "Copied!" : "Copiado!"}
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> {isEnglish ? "Copy SRT" : "Copiar SRT"}
                    </>
                  )}
                </button>
              </div>

              <div className="result-box" style={{ borderRadius: "0 0 16px 16px", border: "none", margin: 0, maxHeight: 380, overflowY: "auto", fontFamily: "monospace", fontSize: "13px", lineHeight: 1.6 }}>
                {resultSrt || transcript}
              </div>
            </div>
          )}

          {/* Download buttons: TXT, DOCX, PDF, SRT, VTT */}
          <div className="glass-card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {isEnglish ? "Download Transcription" : "Baixar Transcrição"}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button id="btn-download-txt" className="btn-secondary" style={{ fontSize: "14px" }} onClick={handleDownloadTxt}>
                <FileText size={16} /> {isEnglish ? ".TXT (Text)" : ".TXT (Texto)"}
              </button>
              <button
                id="btn-download-docx"
                className="btn-primary"
                style={{ fontSize: "14px", background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", borderColor: "#3B82F6" }}
                onClick={handleDownloadDocx}
                disabled={isExportingDocx}
              >
                {isExportingDocx ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> {isEnglish ? "Generating Word..." : "Gerando Word..."}
                  </>
                ) : (
                  <>
                    <FileDown size={16} /> {isEnglish ? ".DOCX (Formatted Word)" : ".DOCX (Word Formatado)"}
                  </>
                )}
              </button>
              <button
                id="btn-download-pdf"
                className="btn-secondary"
                style={{ fontSize: "14px", borderColor: "rgba(239, 68, 68, 0.4)", color: "#FCA5A5" }}
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> {isEnglish ? "Generating PDF..." : "Gerando PDF..."}
                  </>
                ) : (
                  <>
                    <FileDown size={16} color="#EF4444" /> {isEnglish ? ".PDF (Document)" : ".PDF (Documento)"}
                  </>
                )}
              </button>
              <button id="btn-download-srt" className="btn-secondary" style={{ fontSize: "14px" }} onClick={handleDownloadSrt}>
                <FileCode size={16} /> {isEnglish ? ".SRT (Subtitles)" : ".SRT (Legendas)"}
              </button>
              <button id="btn-download-vtt" className="btn-secondary" style={{ fontSize: "14px" }} onClick={handleDownloadVtt}>
                <FileType size={16} /> {isEnglish ? ".VTT (Web)" : ".VTT (Web)"}
              </button>
            </div>

            {/* Privacy notice */}
            {mediaDeleted && (
              <div style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.15)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <Trash2 size={16} color="#10B981" />
                <p style={{ fontSize: "13px", color: "#6EE7B7" }}>
                  <strong>{isEnglish ? "Privacy guaranteed:" : "Privacidade garantida:"}</strong> {isEnglish ? "Processed media was permanently deleted from our servers." : "A mídia processada foi permanentemente excluída dos nossos servidores."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
