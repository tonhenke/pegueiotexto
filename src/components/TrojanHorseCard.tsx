"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface TrojanHorseCardProps {
  videoUrl?: string;
  videoTitle?: string;
  platform?: string;
}

export default function TrojanHorseCard({
  videoUrl = "",
  videoTitle = "",
  platform = "vídeo",
}: TrojanHorseCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const isEnglish = pathname?.startsWith("/en");

  const handleTranscribeWithAI = () => {
    setLoading(true);
    if (videoUrl) {
      try {
        localStorage.setItem("pegueiotexto_pending_url", videoUrl);
        localStorage.setItem("pending_transcribe_url", videoUrl);
      } catch (e) {
        console.warn(e);
      }
      const encoded = encodeURIComponent(videoUrl);
      router.push(`/dashboard?url=${encoded}&auto_transcribe=true`);
    } else {
      router.push("/dashboard");
    }
  };

  const platformLabel = isEnglish
    ? platform && platform.toLowerCase() !== "vídeo" && platform.toLowerCase() !== "video"
      ? `${platform} video`
      : "video"
    : platform && platform.toLowerCase() !== "vídeo" && platform.toLowerCase() !== "video"
      ? `vídeo do ${platform}`
      : "vídeo";

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.14) 50%, rgba(236, 72, 153, 0.08) 100%)",
        border: "1px solid rgba(168, 85, 247, 0.35)",
        boxShadow: "0 12px 36px -10px rgba(168, 85, 247, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        padding: "28px 24px",
        margin: "24px 0",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient flare */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(236, 72, 153, 0.3)",
            }}
          >
            <span>🚀</span> {isEnglish ? "Go Beyond the Download" : "Vá Além do Download"}
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.75)" }}>
            {isEnglish
              ? "Don't just keep the file saved: unlock the full power of this content"
              : "Não fique apenas com o arquivo guardado: extraia o máximo deste conteúdo"}
          </span>
        </div>

        {/* Headline */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 800,
            lineHeight: "1.3",
            color: "#ffffff",
            marginBottom: "8px",
          }}
        >
          {isEnglish
            ? `Want the full transcript, CapCut subtitles & AI summary of this ${platformLabel}?`
            : `Quer o texto completo, legendas para CapCut e um resumo com IA deste ${platformLabel}?`}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          {isEnglish ? (
            <>
              Instead of wasting hours watching or manually typing, <strong>Peguei o Texto</strong> processes this content
              in seconds using state-of-the-art Artificial Intelligence.
            </>
          ) : (
            <>
              Em vez de perder horas assistindo ou transcrevendo manualmente, o <strong>Peguei o Texto</strong> processa
              este conteúdo em segundos usando Inteligência Artificial de última geração.
            </>
          )}
        </p>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {isEnglish ? "📝 99.2% Accurate Transcript" : "📝 Transcrição 99.2% Precisa"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", lineHeight: "1.4" }}>
              {isEnglish
                ? "Automatic punctuation, multi-speaker separation & precise timestamps."
                : "Pontuação nativa em português e minutagem automática."}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {isEnglish ? "🎬 .SRT & .VTT Subtitles" : "🎬 Legendas .SRT & .VTT"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", lineHeight: "1.4" }}>
              {isEnglish
                ? "Ready to drag and drop straight into CapCut, Premiere, or DaVinci."
                : "Pronto para importar direto no CapCut, Premiere ou DaVinci."}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {isEnglish ? "💡 AI Executive Summary" : "💡 Resumo Executivo IA"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", lineHeight: "1.4" }}>
              {isEnglish
                ? "Core takeaways, lessons, and topics structured in clean bullet points."
                : "Principais insights, lições e tópicos em tópicos claros."}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {isEnglish ? "📱 Viral Social Drafts" : "📱 Posts Prontos p/ Redes"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.65)", lineHeight: "1.4" }}>
              {isEnglish
                ? "Repurpose into Instagram carousel slides and LinkedIn articles."
                : "Converta em carrossel de Instagram e artigos de LinkedIn."}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <button
            id="btn-trojan-transcribe"
            type="button"
            onClick={handleTranscribeWithAI}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 8px 24px -4px rgba(168, 85, 247, 0.5)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 28px -4px rgba(168, 85, 247, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(168, 85, 247, 0.5)";
            }}
          >
            {loading ? (
              <span>{isEnglish ? "Loading platform..." : "Carregando plataforma..."}</span>
            ) : (
              <>
                <span>{isEnglish ? "Transcribe this Video with AI Now" : "Transcrever este Vídeo com IA Agora"}</span>
                <span style={{ fontSize: "18px" }}>→</span>
              </>
            )}
          </button>

          <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)" }}>
            {isEnglish
              ? "✨ Instant free trial • No credit card required"
              : "✨ Teste gratuito imediato • Sem necessidade de cartão"}
          </span>
        </div>
      </div>
    </div>
  );
}
