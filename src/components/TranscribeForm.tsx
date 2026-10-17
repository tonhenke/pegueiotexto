"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Link2, Upload, Loader2, CheckCircle2, Download,
  Copy, FileText, FileCode, FileType, Mic2, Trash2, RotateCcw, Zap, ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "url" | "upload";
type Status = "idle" | "loading" | "done" | "error" | "insufficient_credits";

const DEMO_TRANSCRIPT = `[00:00] Bem-vindos ao nosso canal! Hoje vamos falar sobre como a inteligência artificial está transformando a forma como trabalhamos com conteúdo audiovisual.

[00:12] Nos últimos anos, vimos uma explosão no volume de vídeos produzidos — de podcasts a webinars, de reuniões a aulas online. Mas todo esse conteúdo fica inacessível se não tiver texto associado.

[00:28] É aí que entra a transcrição automática. Com modelos modernos como o Whisper da OpenAI, conseguimos uma precisão impressionante mesmo em áudios com sotaque regional ou ruído de fundo.

[00:45] E o melhor: em português brasileiro, a qualidade é excelente. Conseguimos capturar expressões idiomáticas, gírias e variações regionais com alta fidelidade.

[01:02] Se você chegou até aqui, já entendeu o poder dessa tecnologia. Então deixa o like, se inscreve no canal e a gente se vê no próximo vídeo!`;

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
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState(defaultUrl);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [resultTitle, setResultTitle] = useState("");
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
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUrl = localStorage.getItem("pegueiotexto_pending_url");
      if (savedUrl) {
        setUrl(savedUrl);
        localStorage.removeItem("pegueiotexto_pending_url");

        // Verify if user is logged in
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            // User just arrived from login, auto-trigger transcription in dashboard!
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
          body: JSON.stringify({ url: targetUrl, language: "pt" }),
        });
      } else {
        if (!file) throw new Error("Selecione um arquivo de áudio ou vídeo.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", "pt");
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
        setTranscript(data.text || DEMO_TRANSCRIPT);
        setResultTitle(data.title || (mode === "url" ? url : file?.name || "Transcrição"));
        setResultSrt(data.srt || "");
        setResultVtt(data.vtt || "");
        setResultDuration(data.duration || null);
        setMinutesDeducted(data.minutes_deducted || 0);
        setMediaDeleted(data.media_deleted ?? true);
        setEngineUsed(data.engine || "Whisper IA");
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      console.error("Erro na transcrição:", err);
      setStatus("error");
      setErrorMsg(err.message || "Falha ao processar o áudio. Tente novamente.");
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

  const handleDownloadTxt = () => {
    const safeTitle = (resultTitle || "transcricao").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    downloadFile(transcript, `${safeTitle}.txt`, "text/plain;charset=utf-8");
  };

  const handleDownloadSrt = () => {
    const safeTitle = (resultTitle || "transcricao").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    downloadFile(resultSrt || transcript, `${safeTitle}.srt`, "text/plain;charset=utf-8");
  };

  const handleDownloadVtt = () => {
    const safeTitle = (resultTitle || "transcricao").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
    downloadFile(resultVtt || transcript, `${safeTitle}.vtt`, "text/vtt;charset=utf-8");
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

  const handleReset = () => {
    setStatus("idle");
    setTranscript("");
    setProgress(0);
    setUrl("");
    setFile(null);
    setErrorMsg("");
    setInsufficientMsg("");
  };

  const canSubmit = mode === "url" ? url.trim().length > 5 : !!file;

  const progressLabel =
    progress < 25 ? "Conectando ao servidor..." :
    progress < 50 ? (mode === "url" ? "Baixando stream do vídeo..." : "Enviando arquivo...") :
    progress < 75 ? "Processando áudio com Whisper..." :
    progress < 95 ? "Formatando legendas e texto..." : "Pronto!";

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
            <span>Link do seu vídeo recuperado! Seus <strong>5 minutos grátis</strong> já estão prontos para usar. Clique em &quot;Transcrever Vídeo Agora&quot; abaixo.</span>
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
            <Link2 size={15} /> Colar link do vídeo
          </span>
        </button>
        <button
          id="tab-upload"
          className={`tab-item ${mode === "upload" ? "active" : ""}`}
          onClick={() => { setMode("upload"); setStatus("idle"); }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Upload size={15} /> Enviar arquivo
          </span>
        </button>
      </div>

      {/* INPUT AREA */}
      {status === "idle" && (
        <div className="glass-card" style={{ padding: "32px" }}>
          {mode === "url" ? (
            <div>
              <label style={{ display: "block", marginBottom: "12px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500 }}>
                Cole o link do vídeo
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
                  <Mic2 size={16} /> Transcrever
                </button>
              </div>

              {/* Platforms Grid */}
              <div style={{ marginTop: "24px" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Plataformas suportadas
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
                    +1.700 mais ↗
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
                      Arraste o arquivo ou clique para selecionar
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      MP4, MP3, WAV, M4A, OGG, WEBM, MKV, AVI — até 2 GB
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
                  <Mic2 size={16} /> Transcrever arquivo
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
            Transcrevendo...
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
            Você precisa de mais minutos para este vídeo
          </h3>

          <p style={{ color: "#cbd5e1", fontSize: "15px", maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.6 }}>
            {insufficientMsg || "A duração deste vídeo excede o tempo disponível no seu saldo atual."}
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
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>60 minutos</div>
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
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>300 minutos</div>
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
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>1.000 minutos</div>
              <div style={{ fontSize: "15px", color: "#10B981", fontWeight: 700 }}>R$ 79,90</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/precos"
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
              <Zap size={16} /> Recarregar Mais Minutos Agora <ArrowRight size={16} />
            </Link>
            <button
              className="btn-secondary"
              onClick={handleReset}
              style={{ padding: "14px 22px", fontSize: "14px" }}
            >
              <RotateCcw size={15} /> Tentar outro vídeo
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
            Não foi possível transcrever
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 480, margin: "0 auto 24px" }}>
            {errorMsg || "Ocorreu um problema ao baixar ou processar a mídia. Verifique o link ou formato do arquivo."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", margin: "0 auto" }}>
            {(errorMsg.toLowerCase().includes("saldo") || errorMsg.toLowerCase().includes("minutos") || errorMsg.toLowerCase().includes("insuficiente")) && (
              <Link href="/precos" className="btn-primary" style={{ textDecoration: "none" }}>
                Recarregar minutos ↗
              </Link>
            )}
            <button className="btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Tentar novamente
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
                {resultTitle ? resultTitle.slice(0, 50) + (resultTitle.length > 50 ? "..." : "") : "Transcrição concluída!"}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                {resultDuration ? `${Math.floor(resultDuration / 60)}m ${Math.round(resultDuration % 60)}s • ` : ""}
                {transcript.split(/\s+/).filter(Boolean).length} palavras • {engineUsed || "Whisper IA"}
                {minutesDeducted > 0 && (
                  <span style={{ marginLeft: "8px", color: "#6EE7B7", fontWeight: 600 }}>
                    (-{minutesDeducted} min)
                  </span>
                )}
              </p>
            </div>
            <button className="btn-ghost" onClick={handleReset} style={{ flexShrink: 0 }}>
              <RotateCcw size={15} /> Nova transcrição
            </button>
          </div>

          {/* Transcript box */}
          <div className="glass-card" style={{ padding: "0" }}>
            {/* Toolbar */}
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
                  Texto Transcrito
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button id="btn-copy" className="btn-ghost" style={{ fontSize: "13px" }} onClick={handleCopy}>
                  <Copy size={13} />
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Text content */}
            <div className="result-box" style={{ borderRadius: "0 0 16px 16px", border: "none", margin: 0, maxHeight: 360, overflowY: "auto" }}>
              {transcript}
            </div>
          </div>

          {/* Download buttons */}
          <div className="glass-card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Baixar Transcrição
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button id="btn-download-txt" className="btn-primary" style={{ fontSize: "14px" }} onClick={handleDownloadTxt}>
                <FileText size={16} /> .TXT (Texto Completo)
              </button>
              <button id="btn-download-srt" className="btn-secondary" style={{ fontSize: "14px" }} onClick={handleDownloadSrt}>
                <FileCode size={16} /> .SRT (Legendas)
              </button>
              <button id="btn-download-vtt" className="btn-secondary" style={{ fontSize: "14px" }} onClick={handleDownloadVtt}>
                <FileType size={16} /> .VTT (Web)
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
                  <strong>Privacidade garantida:</strong> A mídia processada foi permanentemente excluída dos nossos servidores.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
