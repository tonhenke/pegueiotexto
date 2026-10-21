"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";
import { 
  FileText, Copy, Check, Share2, Sparkles, Download, 
  FileDown, ArrowLeft, Clock, Calendar, Search, Loader2, 
  ExternalLink, MessageCircle, RefreshCw 
} from "lucide-react";
import { exportToTxt, exportToDocx, exportToPdf } from "@/lib/exportUtils";

interface SharedTranscription {
  id: string;
  title: string;
  platform: string;
  duration_seconds: number;
  text_content: string;
  srt_content?: string;
  vtt_content?: string;
  created_at: string;
}

export default function PublicTranscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const transcriptionId = resolvedParams.id;

  const [item, setItem] = useState<SharedTranscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [exportingDocx, setExportingDocx] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    async function loadPublicData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/transcribe/public/${transcriptionId}`);
        if (!res.ok) {
          setError("Esta transcrição não foi encontrada ou não está disponível publicamente.");
          return;
        }
        const data = await res.json();
        setItem(data);
      } catch (err: any) {
        console.error("Erro ao carregar transcrição:", err);
        setError("Não foi possível carregar a transcrição. Verifique sua conexão e tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    if (transcriptionId) {
      loadPublicData();
    }
  }, [transcriptionId]);

  const handleCopyText = () => {
    if (!item) return;
    navigator.clipboard.writeText(item.text_content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://pegueiotexto.com.br/t/${transcriptionId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
    if (navigator.share) {
      navigator.share({
        title: item?.title || "Transcrição no Peguei o Texto",
        url: url,
      }).catch(() => {});
    }
  };

  const handleWhatsAppShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://pegueiotexto.com.br/t/${transcriptionId}`;
    const text = encodeURIComponent(`Confira a transcrição de "${item?.title || "este vídeo"}" no Peguei o Texto:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleGenerateSummary = async () => {
    if (!item) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/transcribe/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: item.text_content,
          title: item.title,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSummaryData(data);
      } else {
        alert(data.detail || "Não foi possível gerar a síntese com IA.");
      }
    } catch (err) {
      console.error("Erro ao gerar resumo:", err);
      alert("Falha de conexão com o servidor ao gerar resumo.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const getSummaryFullText = () => {
    if (!summaryData) return "";
    let str = "";
    if (summaryData.executive_summary) str += `RESUMO EXECUTIVO:\n${summaryData.executive_summary}\n\n`;
    if (summaryData.key_points && summaryData.key_points.length > 0) {
      str += `PONTOS PRINCIPAIS:\n${summaryData.key_points.map((p: string) => `• ${p}`).join("\n")}\n\n`;
    }
    if (summaryData.takeaway) str += `PRINCIPAL CONCLUSÃO:\n${summaryData.takeaway}\n`;
    return str.trim();
  };

  const handleCopySummary = () => {
    const text = getSummaryFullText();
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handleExportDocx = async () => {
    if (!item) return;
    setExportingDocx(true);
    try {
      await exportToDocx(item.text_content, item.title, {
        duration: item.duration_seconds,
        platform: item.platform,
        summary: getSummaryFullText(),
      });
    } catch (err) {
      console.error("Erro ao exportar Word:", err);
      alert("Erro ao exportar arquivo Word (.docx).");
    } finally {
      setExportingDocx(false);
    }
  };

  const handleExportPdf = async () => {
    if (!item) return;
    setExportingPdf(true);
    try {
      await exportToPdf(item.text_content, item.title, {
        duration: item.duration_seconds,
        platform: item.platform,
        summary: getSummaryFullText(),
      });
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
      alert("Erro ao exportar arquivo PDF.");
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportTxt = () => {
    if (!item) return;
    const summary = getSummaryFullText();
    const content = summary
      ? `${summary}\n\n====================\nTRANSCRIÇÃO COMPLETA:\n====================\n\n${item.text_content}`
      : item.text_content;
    exportToTxt(content, item.title);
  };

  const wordCount = item?.text_content ? item.text_content.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: 840 }}>
          {/* Back link */}
          <div style={{ marginBottom: "24px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} /> Voltar para a página inicial
            </Link>
          </div>

          {loading ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <Loader2 size={32} className="spin" color="#A78BFA" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Carregando transcrição...</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Preparando o texto para leitura rápida.</p>
            </div>
          ) : error || !item ? (
            <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#EF4444",
                }}
              >
                <FileText size={24} />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Transcrição não encontrada</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 440, margin: "0 auto 24px" }}>
                {error || "O link fornecido pode estar incorreto ou a transcrição não está mais disponível."}
              </p>
              <Link href="/" className="btn-primary" style={{ padding: "10px 24px", textDecoration: "none" }}>
                Transcrever novo vídeo agora
              </Link>
            </div>
          ) : (
            <div>
              {/* Header card */}
              <div className="glass-card" style={{ padding: "28px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span className="badge badge-purple" style={{ fontSize: "12px" }}>
                    {item.platform || "Web"}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Clock size={12} /> {Math.floor((item.duration_seconds || 0) / 60)}m{" "}
                    {Math.round((item.duration_seconds || 0) % 60)}s de áudio
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: "#6EE7B7",
                      fontWeight: 600,
                    }}
                  >
                    ~{readTimeMinutes} min de leitura
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.25,
                    marginBottom: "20px",
                  }}
                >
                  {item.title}
                </h1>

                {/* Action Buttons Toolbar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <button
                    onClick={handleCopyText}
                    className="btn-ghost"
                    style={{
                      fontSize: "13px",
                      padding: "8px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: copiedText ? "#6EE7B7" : undefined,
                      borderColor: copiedText ? "rgba(16, 185, 129, 0.4)" : undefined,
                      background: copiedText ? "rgba(16, 185, 129, 0.12)" : undefined,
                    }}
                  >
                    {copiedText ? <Check size={14} color="#6EE7B7" /> : <Copy size={14} />}
                    {copiedText ? "Texto copiado!" : "Copiar texto"}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="btn-ghost"
                    style={{
                      fontSize: "13px",
                      padding: "8px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: copiedLink ? "#67E8F9" : undefined,
                      borderColor: copiedLink ? "rgba(6, 182, 212, 0.4)" : undefined,
                      background: copiedLink ? "rgba(6, 182, 212, 0.12)" : undefined,
                    }}
                    title="Copiar link desta página de leitura para enviar no WhatsApp ou Notion"
                  >
                    {copiedLink ? <Check size={14} color="#67E8F9" /> : <Share2 size={14} />}
                    {copiedLink ? "Link copiado!" : "Compartilhar"}
                  </button>

                  <button
                    onClick={handleWhatsAppShare}
                    className="btn-ghost"
                    style={{
                      fontSize: "13px",
                      padding: "8px 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#6EE7B7",
                      borderColor: "rgba(16, 185, 129, 0.3)",
                      background: "rgba(16, 185, 129, 0.08)",
                    }}
                    title="Enviar transcrição no WhatsApp"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>

                  <button
                    onClick={handleExportDocx}
                    disabled={exportingDocx}
                    className="btn-ghost"
                    style={{
                      fontSize: "12px",
                      padding: "8px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      borderColor: "rgba(59, 130, 246, 0.35)",
                      background: "rgba(59, 130, 246, 0.08)",
                      color: "#93C5FD",
                    }}
                    title="Baixar em formato Microsoft Word (.docx)"
                  >
                    {exportingDocx ? <Loader2 size={13} className="spin" /> : <FileDown size={13} />}
                    .DOCX (Word)
                  </button>

                  <button
                    onClick={handleExportPdf}
                    disabled={exportingPdf}
                    className="btn-ghost"
                    style={{
                      fontSize: "12px",
                      padding: "8px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      borderColor: "rgba(239, 68, 68, 0.35)",
                      background: "rgba(239, 68, 68, 0.08)",
                      color: "#FCA5A5",
                    }}
                    title="Baixar documento PDF formatado"
                  >
                    {exportingPdf ? <Loader2 size={13} className="spin" /> : <FileDown size={13} />}
                    .PDF
                  </button>

                  <button
                    onClick={handleExportTxt}
                    className="btn-ghost"
                    style={{ fontSize: "12px", padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                    title="Baixar arquivo de texto puro (.txt)"
                  >
                    <Download size={13} /> .TXT
                  </button>
                </div>
              </div>

              {/* Synchronized Audio Player Component */}
              <AudioSyncPlayer title={item.title} />

              {/* AI Summary Section Card */}
              <div
                className="glass-card"
                style={{
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  background: "linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, rgba(10, 10, 20, 0.4) 100%)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: summaryData ? "16px" : 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={18} color="#A78BFA" />
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#E0E7FF" }}>
                        Síntese Inteligente com IA
                      </h3>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                        Resumo executivo, pontos essenciais e conclusão prática
                      </p>
                    </div>
                  </div>

                  {!summaryData ? (
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isSummarizing}
                      className="btn-primary"
                      style={{
                        fontSize: "13px",
                        padding: "8px 16px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {isSummarizing ? (
                        <>
                          <Loader2 size={14} className="spin" /> Gerando síntese...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> ✨ Gerar Síntese com IA
                        </>
                      )}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleCopySummary}
                        className="btn-ghost"
                        style={{
                          fontSize: "12px",
                          padding: "5px 12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          color: copiedSummary ? "#6EE7B7" : "#A78BFA",
                        }}
                      >
                        {copiedSummary ? <Check size={13} color="#6EE7B7" /> : <Copy size={13} />}
                        {copiedSummary ? "Resumo copiado!" : "Copiar resumo"}
                      </button>

                      <button
                        onClick={handleGenerateSummary}
                        disabled={isSummarizing}
                        className="btn-ghost"
                        style={{ fontSize: "12px", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                        title="Atualizar síntese"
                      >
                        <RefreshCw size={13} className={isSummarizing ? "spin" : ""} /> Atualizar
                      </button>
                    </div>
                  )}
                </div>

                {/* Rendered Summary */}
                {summaryData && (
                  <div style={{ paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    {/* Executive Summary */}
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#A78BFA", fontWeight: 700, marginBottom: "4px" }}>
                        Resumo Executivo
                      </p>
                      <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
                        {summaryData.executive_summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    {summaryData.key_points && summaryData.key_points.length > 0 && (
                      <div style={{ marginBottom: "16px" }}>
                        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#67E8F9", fontWeight: 700, marginBottom: "6px" }}>
                          Pontos Principais
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                          {summaryData.key_points.map((pt: string, idx: number) => (
                            <li key={idx} style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <span style={{ color: "#67E8F9", fontSize: "14px", lineHeight: 1 }}>•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Takeaway */}
                    {summaryData.takeaway && (
                      <div
                        style={{
                          padding: "12px 14px",
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          borderRadius: "8px",
                        }}
                      >
                        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6EE7B7", fontWeight: 700, marginBottom: "3px" }}>
                          Principal Conclusão
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0 }}>
                          {summaryData.takeaway}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Main Reading Canvas */}
              <div className="glass-card" style={{ padding: "32px", fontSize: "15px", lineHeight: 1.8 }}>
                {/* Search bar inside transcript */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "16px",
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--border-subtle)",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700 }}>
                      Transcrição Completa
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      • {wordCount} palavras
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      minWidth: 200,
                    }}
                  >
                    <Search size={14} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Buscar palavra no texto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "var(--text-primary)",
                        fontSize: "12px",
                        width: "100%",
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "12px" }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Transcript Body with clickable timestamps */}
                <InteractiveTranscript text={item.text_content} searchQuery={searchQuery} />
              </div>

              {/* Bottom promotional banner */}
              <div
                style={{
                  marginTop: "32px",
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                    Gostou dessa transcrição?
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                    Transcreva seus próprios vídeos do YouTube, Instagram ou arquivos de áudio em segundos no Peguei o Texto.
                  </p>
                </div>
                <Link
                  href="/"
                  className="btn-primary"
                  style={{ textDecoration: "none", fontSize: "13px", padding: "10px 20px" }}
                >
                  Transcrever meu vídeo grátis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
