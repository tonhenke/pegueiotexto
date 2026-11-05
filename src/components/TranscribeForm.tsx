"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Link2, Upload, Loader2, CheckCircle2, Download,
  Copy, FileText, FileCode, FileType, Mic2, Trash2, RotateCcw, Zap, ArrowRight,
  Sparkles, Check, FileDown, Share2, ExternalLink, Languages, Crown, Lock, Globe,
  X, AlertCircle, Clock
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

const TRANSLATION_LANGUAGES = [
  { code: "en", name: "Inglês (English)", flag: "🇺🇸" },
  { code: "es", name: "Espanhol (Español)", flag: "🇪🇸" },
  { code: "pt", name: "Português (Português)", flag: "🇧🇷" },
  { code: "fr", name: "Francês (Français)", flag: "🇫🇷" },
  { code: "de", name: "Alemão (Deutsch)", flag: "🇩🇪" },
  { code: "it", name: "Italiano (Italiano)", flag: "🇮🇹" },
  { code: "zh", name: "Mandarim (中文)", flag: "🇨🇳" },
  { code: "ja", name: "Japonês (日本語)", flag: "🇯🇵" },
  { code: "ru", name: "Russo (Русский)", flag: "🇷🇺" },
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
  const [resultTab, setResultTab] = useState<"transcript" | "summary" | "srt" | "translate">("transcript");
  const [summaryData, setSummaryData] = useState<{
    executive_summary?: string;
    key_points?: string[];
    takeaway?: string;
  } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<string>("gratuito");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [translatedLangName, setTranslatedLangName] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translateCopied, setTranslateCopied] = useState<boolean>(false);
  const [isExportingTranslatedDocx, setIsExportingTranslatedDocx] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isDismissedWarning, setIsDismissedWarning] = useState<boolean>(false);
  const [showExceededModal, setShowExceededModal] = useState<boolean>(false);
  const [exceededData, setExceededData] = useState<{
    mediaMinutes?: number | null;
    currentCredits?: number | null;
    title?: string;
    message?: string;
  }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const getMediaDurationMinutes = (mediaFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
      try {
        const objectUrl = URL.createObjectURL(mediaFile);
        const isVideo = mediaFile.type.startsWith("video") || /\.(mp4|mov|webm|mkv|avi)$/i.test(mediaFile.name);
        const el = document.createElement(isVideo ? "video" : "audio");
        el.preload = "metadata";
        el.onloadedmetadata = () => {
          URL.revokeObjectURL(objectUrl);
          if (el.duration && !isNaN(el.duration) && el.duration > 0) {
            resolve(Math.max(1, Math.ceil(el.duration / 60)));
          } else {
            resolve(null);
          }
        };
        el.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
        el.src = objectUrl;
      } catch {
        resolve(null);
      }
    });
  };

  const checkUserPlan = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsPaidUser(false);
        setUserPlan("gratuito");
        setUserCredits(null);
        return;
      }
      const userEmail = session.user.email?.toLowerCase().trim() || "";
      const isTon = userEmail === "tonhenke@gmail.com";

      const token = session.access_token;
      const res = await fetch("/api/checkout/sync-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        const planStr = String(data.plan || "").toLowerCase();
        const paid = isTon || Boolean(data.is_paid) || ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual", "ilimitado", "unlimited"].includes(planStr);
        setIsPaidUser(paid);
        setUserPlan(data.plan || (isTon ? "ilimitado" : "gratuito"));
        if (typeof data.credits_minutes === "number") {
          setUserCredits(data.credits_minutes);
        }
      } else {
        const { data: profile } = await supabase.from("profiles").select("plan, email, credits_minutes").eq("id", session.user.id).single();
        const plan = String(profile?.plan || "").toLowerCase();
        const paid = isTon || ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual", "ilimitado", "unlimited"].includes(plan) || profile?.email === "tonhenke@gmail.com";
        setIsPaidUser(paid);
        setUserPlan(plan || (isTon ? "ilimitado" : "gratuito"));
        if (typeof profile?.credits_minutes === "number") {
          setUserCredits(profile.credits_minutes);
        }
      }
    } catch (e) {
      console.error("Erro ao verificar plano:", e);
    }
  };

  useEffect(() => {
    checkUserPlan();
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

  useEffect(() => {
    const handleCreditsUpdate = (e: any) => {
      if (typeof e.detail?.credits_remaining === "number") {
        setUserCredits(e.detail.credits_remaining);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("credits_updated", handleCreditsUpdate);
      return () => window.removeEventListener("credits_updated", handleCreditsUpdate);
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

    // Pre-check for uploads: if client metadata can detect duration that exceeds known balance
    if (mode === "upload" && file && typeof userCredits === "number" && !isPaidUser) {
      try {
        const detectedMin = await getMediaDurationMinutes(file);
        if (detectedMin && detectedMin > userCredits) {
          setExceededData({
            mediaMinutes: detectedMin,
            currentCredits: userCredits,
            title: file.name,
            message: `Este arquivo requer ${detectedMin} minutos, mas seu saldo atual possui ${userCredits} minutos.`
          });
          setShowExceededModal(true);
          return;
        }
      } catch (e) {}
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
        const detailObj = typeof errJson.detail === "object" && errJson.detail !== null ? errJson.detail : null;
        const detail = typeof errJson.detail === "string" ? errJson.detail : (detailObj?.message || "Erro no processamento.");

        // Handled: Insufficient Credits / Time Limit Exceeded -> Open Pop-up Modal
        if (res.status === 402 || detail.toLowerCase().includes("saldo") || detail.toLowerCase().includes("insuficiente") || detailObj?.minutes_needed) {
          const needed = detailObj?.minutes_needed || Number(detail.match(/requer\s+(\d+)/i)?.[1]) || null;
          const balance = detailObj?.current_balance !== undefined ? detailObj.current_balance : (Number(detail.match(/saldo\s+atual\s+é\s+de\s+(\d+)/i)?.[1]) || userCredits || 0);

          setExceededData({
            mediaMinutes: needed,
            currentCredits: balance,
            title: detailObj?.title || (mode === "url" ? targetUrl : file?.name),
            message: detail,
          });
          setShowExceededModal(true);
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

      checkUserPlan();

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

  const handleTranslate = async (overrideLang?: string) => {
    if (!transcript) return;
    const langToUse = overrideLang || targetLanguage;
    setIsTranslating(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch("/api/transcribe/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          text: transcript,
          target_language: langToUse,
          title: resultTitle || "Transcrição",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTranslatedText(data.translated_text);
        setTranslatedLangName(data.target_language_name || langToUse);
        setResultTab("translate");
      } else {
        if (res.status === 403) {
          setIsPaidUser(false);
        }
        const errMsg = typeof data?.detail === "string" && data.detail !== "Not Found"
          ? data.detail
          : "Não foi possível realizar a tradução neste momento.";
        alert(errMsg);
      }
    } catch (err) {
      console.error("Erro ao traduzir:", err);
      alert("Falha de conexão com o servidor ao traduzir.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyTranslated = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setTranslateCopied(true);
      setTimeout(() => setTranslateCopied(false), 2000);
    }
  };

  const handleDownloadTranslatedTxt = () => {
    if (translatedText) {
      exportToTxt(translatedText, `${resultTitle || "transcricao"}_${targetLanguage}`);
    }
  };

  const handleDownloadTranslatedDocx = async () => {
    if (!translatedText) return;
    setIsExportingTranslatedDocx(true);
    try {
      const docTitle = `${resultTitle || "Transcrição"} (${translatedLangName || targetLanguage.toUpperCase()})`;
      await exportToDocx(translatedText, docTitle, {
        duration: resultDuration ?? undefined,
        platform: mode === "url" ? "Web" : "Upload",
        engine: "Peguei o Texto IA - Tradução",
      });
    } catch (err) {
      console.error("Erro ao gerar Word traduzido:", err);
      alert("Erro ao gerar arquivo Word. Tente novamente.");
    } finally {
      setIsExportingTranslatedDocx(false);
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
    setTranslatedText("");
    setTranslatedLangName("");
    setIsTranslating(false);
    setTranslateCopied(false);
    setResultTab("transcript");
  };

  const canSubmit = mode === "url" ? url.trim().length > 5 : !!file;
  const showLowCreditsWarning = !isPaidUser && !isDismissedWarning && userCredits !== null && userCredits <= 1;

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

      {/* LOW CREDITS WARNING (Option 3 - Compact Inline Bar) */}
      {showLowCreditsWarning && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(234, 88, 12, 0.08) 100%)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "12px",
            padding: "10px 16px",
            marginBottom: "20px",
            fontSize: "13px",
            color: "#FDE68A",
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.08)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>⏳</span>
            <span>
              {isEnglish ? (
                <>
                  <strong>Notice:</strong> Less than 1 free minute remaining.{" "}
                  <span style={{ color: "#FBBF24", fontWeight: 600 }}>Refill from R$ 4,90</span> to transcribe longer media.
                </>
              ) : (
                <>
                  <strong>Atenção:</strong> Resta menos de 1 minuto no seu saldo gratuito.{" "}
                  <span style={{ color: "#FBBF24", fontWeight: 600 }}>Recarregue minutos a partir de R$ 4,90</span> para transcrever vídeos maiores.
                </>
              )}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <Link
              href={isEnglish ? "/en/pricing" : "/precos"}
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 10px rgba(245, 158, 11, 0.3)",
              }}
            >
              <Zap size={13} fill="currentColor" /> {isEnglish ? "View Plans ↗" : "Ver Planos ↗"}
            </Link>
            <button
              onClick={() => setIsDismissedWarning(true)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(253, 230, 138, 0.6)",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "2px 4px",
              }}
              title={isEnglish ? "Dismiss" : "Fechar aviso"}
            >
              ×
            </button>
          </div>
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
            {[
              { id: 1, height: 16, delay: "0s" },
              { id: 2, height: 24, delay: "0.15s" },
              { id: 3, height: 36, delay: "0.3s" },
              { id: 4, height: 44, delay: "0.45s" },
              { id: 5, height: 38, delay: "0.3s" },
              { id: 6, height: 26, delay: "0.15s" },
              { id: 7, height: 18, delay: "0.05s" },
            ].map((bar) => (
              <div
                key={bar.id}
                className="wave-bar"
                style={{
                  height: `${bar.height}px`,
                  width: "5px",
                  borderRadius: "3px",
                  background: "#A855F7",
                  transformOrigin: "bottom",
                  animation: "wave 1.2s ease-in-out infinite",
                  animationDelay: bar.delay,
                  flex: "none",
                }}
              />
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
      {status === "error" && (() => {
        const isAntibotOrCaptionError =
          errorMsg.toLowerCase().includes("antibot") ||
          errorMsg.toLowerCase().includes("bot") ||
          errorMsg.toLowerCase().includes("sign in to confirm") ||
          errorMsg.toLowerCase().includes("cookies") ||
          errorMsg.toLowerCase().includes("yt-dlp") ||
          errorMsg.toLowerCase().includes("legendas") ||
          errorMsg.toLowerCase().includes("bloqueou") ||
          errorMsg.toLowerCase().includes("protegido") ||
          errorMsg.toLowerCase().includes("proteção") ||
          errorMsg.toLowerCase().includes("informações do vídeo") ||
          errorMsg.toLowerCase().includes("áudio do youtube");

        return (
          <div className="glass-card" style={{ padding: "32px", textAlign: "center", borderColor: isAntibotOrCaptionError ? "rgba(245, 158, 11, 0.3)" : "rgba(239,68,68,0.3)" }}>
            <div style={{
              width: 48, height: 48,
              background: isAntibotOrCaptionError ? "rgba(245, 158, 11, 0.15)" : "rgba(239,68,68,0.15)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              {isAntibotOrCaptionError ? (
                <AlertCircle size={24} color="#F59E0B" />
              ) : (
                <RotateCcw size={22} color="#EF4444" />
              )}
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              {isAntibotOrCaptionError
                ? (isEnglish ? "Link protected by YouTube" : "Vídeo com proteção do YouTube")
                : (isEnglish ? "Unable to transcribe" : "Não foi possível transcrever")}
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 520, margin: "0 auto 16px", lineHeight: 1.6 }}>
              {isAntibotOrCaptionError
                ? (isEnglish
                    ? "This video has no native subtitles on YouTube and direct server extraction was challenged by Google's antibot shield."
                    : "Este vídeo não possui legendas ativas no YouTube e a extração direta do áudio foi restringida pela proteção antibot do Google.")
                : (errorMsg || (isEnglish ? "A problem occurred while downloading or processing media. Please check the link or file format." : "Ocorreu um problema ao baixar ou processar a mídia. Verifique o link ou formato do arquivo."))}
            </p>

            {isAntibotOrCaptionError && (
              <div style={{
                background: "rgba(147, 51, 234, 0.08)",
                border: "1px solid rgba(147, 51, 234, 0.25)",
                borderRadius: "12px",
                padding: "18px 22px",
                maxWidth: 540,
                margin: "0 auto 24px",
                textAlign: "left",
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.6
              }}>
                <p style={{ fontWeight: 600, color: "#C084FC", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14.5px" }}>
                  <span>💡</span> {isEnglish ? "Recommended 2-step solution:" : "Solução recomendada em 2 passos:"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "#A855F7", fontWeight: 700, minWidth: "18px" }}>1.</span>
                    <span>
                      {isEnglish ? (
                        <>Use our free <Link href={`/en/download-video${url ? `?url=${encodeURIComponent(url)}` : ""}`} target="_blank" style={{ color: "#C084FC", fontWeight: 600, textDecoration: "underline" }}>Download Tool ↗</Link> to save the video or audio file to your device.</>
                      ) : (
                        <>Use a ferramenta gratuita de <Link href={`/baixar-video${url ? `?url=${encodeURIComponent(url)}` : ""}`} target="_blank" style={{ color: "#C084FC", fontWeight: 600, textDecoration: "underline" }}>Baixar Vídeo do Peguei o Texto ↗</Link> para salvar o arquivo (MP4 ou MP3) no seu dispositivo.</>
                      )}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ color: "#A855F7", fontWeight: 700, minWidth: "18px" }}>2.</span>
                    <span>
                      {isEnglish
                        ? "Then upload the downloaded file in the 'Upload file' tab. Our neural Whisper AI will transcribe the audio with 100% accuracy and zero YouTube restrictions."
                        : "Depois, faça o upload do arquivo baixado pela aba 'Enviar arquivo'. O nosso motor de IA Whisper processará o áudio com 100% de precisão e sem nenhuma interferência do YouTube."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", margin: "0 auto" }}>
              {isAntibotOrCaptionError ? (
                <>
                  <Link
                    href={isEnglish ? `/en/download-video${url ? `?url=${encodeURIComponent(url)}` : ""}` : `/baixar-video${url ? `?url=${encodeURIComponent(url)}` : ""}`}
                    target="_blank"
                    className="btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", background: "linear-gradient(135deg, #9333EA 0%, #7928CA 100%)" }}
                  >
                    <Download size={16} />
                    {isEnglish ? "1. Download video on Peguei o Texto ↗" : "1. Baixar vídeo no Peguei o Texto ↗"}
                  </Link>
                  <button
                    className="btn-secondary"
                    onClick={() => { setMode("upload"); setStatus("idle"); }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <Upload size={16} />
                    {isEnglish ? "2. Go to 'Upload file' →" : "2. Ir para 'Enviar arquivo' →"}
                  </button>
                  <button className="btn-secondary" onClick={handleReset} style={{ color: "var(--text-muted)" }}>
                    <RotateCcw size={16} /> {isEnglish ? "Try another link" : "Testar outro link"}
                  </button>
                </>
              ) : (
                <>
                  {(errorMsg.toLowerCase().includes("saldo") || errorMsg.toLowerCase().includes("minutos") || errorMsg.toLowerCase().includes("insuficiente")) && (
                    <Link href={isEnglish ? "/en/pricing" : "/precos"} className="btn-primary" style={{ textDecoration: "none" }}>
                      {isEnglish ? "Refill minutes ↗" : "Recarregar minutos ↗"}
                    </Link>
                  )}
                  <button className="btn-secondary" onClick={handleReset}>
                    <RotateCcw size={16} /> {isEnglish ? "Try again" : "Tentar novamente"}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })()}

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

            <button
              onClick={() => setResultTab("translate")}
              style={{
                background: resultTab === "translate" ? "rgba(124, 58, 237, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: resultTab === "translate" ? "#C4B5FD" : "var(--text-secondary)",
                border: resultTab === "translate" ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid var(--border-subtle)",
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
              <Languages size={15} color="#A78BFA" />
              <span>{isEnglish ? "Translate" : "Traduzir"}</span>
              {!isPaidUser ? (
                <span style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#000",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px"
                }}>
                  <Crown size={10} /> PRO
                </span>
              ) : translatedText ? (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              ) : null}
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

          {/* TAB CONTENT: 4. TRANSLATION (PAID PLAN EXCLUSIVE) */}
          {resultTab === "translate" && (
            <div className="glass-card" style={{ padding: "24px" }}>
              {!isPaidUser ? (
                <div style={{ textAlign: "center", maxWidth: 540, margin: "0 auto", padding: "16px 8px" }}>
                  <div style={{
                    width: 58, height: 58,
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(124, 58, 237, 0.2))",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    borderRadius: "18px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 24px rgba(245, 158, 11, 0.15)"
                  }}>
                    <Crown size={28} color="#F59E0B" />
                  </div>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    background: "rgba(245, 158, 11, 0.12)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#FBBF24",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "12px"
                  }}>
                    <Lock size={12} /> {isEnglish ? "Exclusive Paid Plan Feature" : "Recurso Exclusivo dos Planos Pagos"}
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {isEnglish ? "AI Transcription Translation" : "Tradução de Transcrições com Inteligência Artificial"}
                  </h3>

                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                    {isEnglish
                      ? "Translate your entire transcription to English, Spanish, French, German, Mandarin, and more in seconds with contextual fluency and natural punctuation."
                      : "Traduza transcrições inteiras para inglês, espanhol, francês, alemão, mandarim e mais idiomas em segundos com altíssima precisão e fluência contextual."}
                  </p>

                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      <Globe size={16} color="#67E8F9" style={{ flexShrink: 0 }} />
                      <span>{isEnglish ? "Direct translation into +9 world languages" : "Tradução direta para mais de 9 idiomas mundiais"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      <Sparkles size={16} color="#A78BFA" style={{ flexShrink: 0 }} />
                      <span>{isEnglish ? "Ultra-fast Llama 3.3 70B AI engine" : "Processamento ultrarrápido com Llama 3.3 70B"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      <FileDown size={16} color="#10B981" style={{ flexShrink: 0 }} />
                      <span>{isEnglish ? "Export translated .TXT and formatted Word (.DOCX)" : "Exporte arquivos traduzidos em .TXT e Word (.DOCX)"}</span>
                    </div>
                  </div>

                  <Link
                    href={isEnglish ? "/en/pricing" : "/precos"}
                    className="btn-primary"
                    style={{
                      padding: "14px 28px",
                      fontSize: "15px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                      boxShadow: "0 8px 25px rgba(124, 58, 237, 0.35)"
                    }}
                  >
                    <Crown size={16} /> {isEnglish ? "Upgrade to Unlock Translation ↗" : "Fazer Upgrade e Liberar Tradução ↗"}
                  </Link>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "12px" }}>
                    {isEnglish ? "Plans from R$ 4,90. Instant access." : "Planos a partir de R$ 4,90. Acesso instantâneo."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Top Bar for Paid Users */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-subtle)",
                    paddingBottom: "14px",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Languages size={18} color="#A78BFA" />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>
                            {translatedText
                              ? (isEnglish ? `Translated to ${translatedLangName}` : `Traduzido para ${translatedLangName}`)
                              : (isEnglish ? "AI Translation" : "Tradução com Inteligência Artificial")}
                          </span>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#10B981",
                            background: "rgba(16, 185, 129, 0.12)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            padding: "2px 8px",
                            borderRadius: "100px"
                          }}>
                            ✓ {isEnglish ? "Paid Plan Active" : "Plano Pago Ativo"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Language Selector + Action Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid var(--border-subtle)",
                          color: "var(--text-primary)",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          outline: "none",
                          cursor: "pointer"
                        }}
                      >
                        {TRANSLATION_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code} style={{ background: "#1a1a24", color: "#fff" }}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn-primary"
                        onClick={() => handleTranslate()}
                        disabled={isTranslating}
                        style={{
                          fontSize: "13px",
                          padding: "8px 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {isTranslating ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> {isEnglish ? "Translating..." : "Traduzindo..."}
                          </>
                        ) : translatedText ? (
                          <>
                            <RotateCcw size={14} /> {isEnglish ? "Translate Again" : "Traduzir Novamente"}
                          </>
                        ) : (
                          <>
                            <Languages size={14} /> {isEnglish ? "Translate Now" : "Traduzir Agora"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  {!translatedText ? (
                    <div style={{ textAlign: "center", padding: "32px 16px" }}>
                      <div style={{
                        width: 52, height: 52,
                        background: "rgba(124, 58, 237, 0.15)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                        borderRadius: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 16px"
                      }}>
                        <Globe size={24} color="#A78BFA" />
                      </div>
                      <h4 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                        {isEnglish ? "Ready to translate your transcription" : "Pronto para traduzir sua transcrição"}
                      </h4>
                      <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 440, margin: "0 auto 20px" }}>
                        {isEnglish
                          ? "Select your preferred target language in the dropdown above and click 'Translate Now'."
                          : "Selecione o idioma desejado acima e clique em 'Traduzir Agora' para converter o texto em segundos."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Actions toolbar for translated text */}
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                        <button
                          className="btn-ghost"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                          onClick={handleCopyTranslated}
                        >
                          {translateCopied ? (
                            <>
                              <Check size={13} color="#10B981" /> {isEnglish ? "Copied!" : "Copiado!"}
                            </>
                          ) : (
                            <>
                              <Copy size={13} /> {isEnglish ? "Copy translation" : "Copiar tradução"}
                            </>
                          )}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                          onClick={handleDownloadTranslatedTxt}
                        >
                          <FileText size={13} /> {isEnglish ? "Download .TXT" : "Baixar .TXT"}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{
                            fontSize: "12px",
                            padding: "6px 12px",
                            borderColor: "rgba(59, 130, 246, 0.35)",
                            background: "rgba(59, 130, 246, 0.08)",
                            color: "#93C5FD"
                          }}
                          onClick={handleDownloadTranslatedDocx}
                          disabled={isExportingTranslatedDocx}
                        >
                          {isExportingTranslatedDocx ? (
                            <>
                              <Loader2 size={13} className="animate-spin" /> {isEnglish ? "Generating Word..." : "Gerando Word..."}
                            </>
                          ) : (
                            <>
                              <FileDown size={13} /> {isEnglish ? "Download Word (.DOCX)" : "Baixar Word (.DOCX)"}
                            </>
                          )}
                        </button>
                      </div>

                      {/* Translated text display */}
                      <div
                        className="result-box"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid var(--border-subtle)",
                          margin: 0,
                          maxHeight: 440,
                          overflowY: "auto",
                          padding: "20px",
                          lineHeight: 1.7,
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {translatedText}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

      {/* POP-UP MODAL: MEDIA EXCEEDS AVAILABLE CREDITS / PLAN UPSELL */}
      {showExceededModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 3, 9, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExceededModal(false);
          }}
        >
          <div
            className="clint-card"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "36px 30px",
              textAlign: "center",
              position: "relative",
              border: "1px solid rgba(167, 139, 250, 0.45)",
              background: "linear-gradient(145deg, rgba(22, 14, 38, 0.98), rgba(10, 6, 18, 0.98))",
              boxShadow: "0 30px 90px -10px rgba(0, 0, 0, 0.95), 0 0 50px rgba(124, 58, 237, 0.35)",
              animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setShowExceededModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
              title={isEnglish ? "Close" : "Fechar aviso"}
            >
              <X size={18} />
            </button>

            {/* Glowing Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(124, 58, 237, 0.35))",
                border: "1px solid rgba(236, 72, 153, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: "0 0 35px rgba(236, 72, 153, 0.4)",
              }}
            >
              <Zap size={30} color="#F472B6" />
            </div>

            {/* Badge Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "100px",
                background: "rgba(236, 72, 153, 0.12)",
                border: "1px solid rgba(236, 72, 153, 0.35)",
                color: "#F472B6",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              <span>⚠️ Limite de Minutos Excedido</span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {isEnglish ? "You need more minutes for this media" : "Mídia maior que o seu saldo disponível"}
            </h3>

            {/* Subtitle / explanation */}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                lineHeight: 1.6,
                maxWidth: "460px",
                margin: "0 auto 20px",
              }}
            >
              {isEnglish
                ? "This media exceeds the number of minutes available in your current balance. To transcribe it, you need to acquire a plan or refill package."
                : "A duração deste vídeo ou áudio ultrapassa os minutos disponíveis no seu saldo atual. Para conseguir transcrever todo o conteúdo, você precisa contratar um plano ou pacote de recarga."}
            </p>

            {/* Comparison Box */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <div style={{ borderRight: "1px solid rgba(255, 255, 255, 0.08)", paddingRight: "12px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
                  {isEnglish ? "Media Duration" : "Duração da Mídia"}
                </p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#F472B6", marginTop: "4px", marginBottom: "2px" }}>
                  {exceededData.mediaMinutes ? `${exceededData.mediaMinutes} min` : "Excede limite"}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {exceededData.title || (mode === "url" ? url : file?.name || "Mídia selecionada")}
                </p>
              </div>

              <div style={{ paddingLeft: "8px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>
                  {isEnglish ? "Your Available Balance" : "Seu Saldo Atual"}
                </p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#67E8F9", marginTop: "4px", marginBottom: "2px" }}>
                  {typeof exceededData.currentCredits === "number" ? `${exceededData.currentCredits} min` : `${userCredits ?? 0} min`}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: 0 }}>
                  {exceededData.mediaMinutes && typeof exceededData.currentCredits === "number" && exceededData.mediaMinutes > exceededData.currentCredits
                    ? `Faltam ${exceededData.mediaMinutes - exceededData.currentCredits} min`
                    : "Saldo insuficiente"}
                </p>
              </div>
            </div>

            {/* Quick Pricing Packages Showcase */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "22px",
              }}
            >
              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Starter</p>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>60 min</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>R$ 4,90</p>
              </div>

              <div style={{ background: "rgba(124, 58, 237, 0.16)", border: "1px solid rgba(167, 139, 250, 0.4)", borderRadius: "12px", padding: "12px 8px", textAlign: "center", position: "relative" }}>
                <span style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", background: "#7C3AED", color: "#fff", fontSize: "9px", fontWeight: 800, padding: "1px 6px", borderRadius: "100px" }}>POPULAR</span>
                <p style={{ fontSize: "11px", color: "#C4A4FF", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Pro</p>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>300 min</p>
                <p style={{ fontSize: "12px", color: "#67E8F9", fontWeight: 700, margin: 0 }}>R$ 17,90</p>
              </div>

              <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "12px 8px", textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: "#EC4899", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Business</p>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: "4px 0" }}>1.000 min</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>R$ 79,90</p>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href={isEnglish ? "/en/pricing" : "/precos"}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  fontSize: "15px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(124, 58, 237, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Zap size={16} />
                <span>{isEnglish ? "Choose a Plan to Transcribe" : "Contratar um Plano para Transcrever"}</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowExceededModal(false);
                  handleReset();
                }}
                style={{
                  width: "100%",
                  padding: "11px 20px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={13} style={{ marginRight: 6 }} />
                <span>{isEnglish ? "Cancel and choose another media" : "Cancelar e escolher outro vídeo"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
