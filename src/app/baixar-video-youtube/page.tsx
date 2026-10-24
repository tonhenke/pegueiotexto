import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdsenseBanner from "@/components/AdsenseBanner";
import VideoDownloader from "@/components/VideoDownloader";
import Link from "next/link";
import Script from "next/script";
import {
  Download,
  Video,
  Music,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Flame,
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Baixar Vídeos do YouTube Grátis em MP4 HD e Shorts Online | Peguei o Texto",
  description:
    "Baixe vídeos e Shorts do YouTube em alta qualidade (MP4 HD / 1080p) e extraia áudios em MP3 sem instalar programas. 100% grátis, sem popups chatos e com opção de transcrever com IA em 1 clique.",
  keywords: [
    "baixar video youtube",
    "baixar video do youtube",
    "baixar shorts youtube",
    "baixar video youtube mp4",
    "baixar video youtube gratis",
    "baixar video do youtube no pc",
    "baixar video youtube pelo celular",
    "converter video youtube mp4",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/baixar-video-youtube",
  },
  openGraph: {
    title: "Baixar Vídeos do YouTube Grátis em MP4 HD e 1080p Online | Peguei o Texto",
    description:
      "Baixe qualquer vídeo ou Shorts do YouTube em MP4 HD limpo, sem anúncios invasivos e com opção de converter para texto com IA.",
    url: "https://pegueiotexto.com.br/baixar-video-youtube",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Baixador de Vídeos do YouTube - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/baixar-video-youtube",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Ferramenta online gratuita para baixar vídeos e Shorts do YouTube em MP4 de alta definição e extrair áudios em MP3 sem anúncios intrusivos.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1350",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
      },
    },
    {
      "@type": "HowTo",
      "name": "Como Baixar Vídeos do YouTube Online Gratuitamente",
      "description": "Passo a passo simples para salvar vídeos do YouTube em MP4 HD no seu computador ou celular.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copie o link do vídeo",
          "text": "Abra o YouTube (aplicativo ou site), clique no botão Compartilhar do vídeo ou Shorts e selecione Copiar Link.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Cole na barra de busca",
          "text": "Cole a URL copiada no campo do Peguei o Texto e clique no botão Buscar Vídeo.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Baixe o arquivo MP4 ou MP3",
          "text": "Escolha entre baixar o vídeo completo em MP4 HD ou apenas o áudio em MP3.",
          "position": 3,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "É gratuito baixar vídeos do YouTube pelo Peguei o Texto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! O download de vídeos e Shorts do YouTube em MP4 e MP3 é 100% gratuito e não exige cadastro ou instalação de softwares.",
          },
        },
        {
          "@type": "Question",
          "name": "Consigo baixar YouTube Shorts pelo celular?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! O Peguei o Texto funciona perfeitamente em celulares Android e iPhone (iOS). Basta colar o link do Shorts no navegador Safari ou Chrome.",
          },
        },
        {
          "@type": "Question",
          "name": "O site possui popups ou anúncios maliciosos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não. Diferente dos sites antigos de download que abrem abas indesejadas de apostas e vírus, nosso link é direto, limpo e seguro.",
          },
        },
        {
          "@type": "Question",
          "name": "Como transcrever o vídeo baixado em texto com IA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Após buscar o vídeo, clique no botão 'Transcrever este Vídeo com IA Agora'. Você receberá o texto completo, minutagem e legendas .SRT para CapCut em segundos.",
          },
        },
      ],
    },
  ],
};

export default function BaixarVideoYoutubePage() {
  return (
    <>
      <Script
        id="adsbygoogle-init-yt"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1974829355929040"
        crossOrigin="anonymous"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main style={{ minHeight: "100vh", padding: "120px 0 80px", position: "relative" }}>
        {/* Ambient red & violet glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 80%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Top Leaderboard AdSense Slot */}
          <AdsenseBanner format="leaderboard" slot="1000000001" />

          {/* Hero Header */}
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 36px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#fca5a5",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Play size={14} color="#ef4444" fill="#ef4444" />
              <span>Baixador Oficial de Vídeos e Shorts do YouTube</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(28px, 4.5vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: "1.15",
                marginBottom: "16px",
                color: "#ffffff",
              }}
            >
              Baixar Vídeos do YouTube em{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f87171 0%, #c084fc 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MP4 HD e Áudios em MP3
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                color: "var(--text-muted, #94a3b8)",
                lineHeight: "1.6",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Cole o link de qualquer <strong>vídeo ou Shorts do YouTube</strong> para salvar no seu computador ou celular. Sem popups invasivos, 100% grátis e rápido.
            </p>
          </div>

          {/* Video Downloader Widget */}
          <VideoDownloader placeholder="Cole o link do YouTube (ex: https://www.youtube.com/watch?v=... ou Shorts)" />

          {/* Bridge CTA: Link to YouTube Transcription */}
          <div
            style={{
              maxWidth: "850px",
              margin: "36px auto 0",
              padding: "16px 22px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles size={20} color="#818cf8" />
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                Precisa do <strong>texto e legendas</strong> deste vídeo do YouTube?
              </span>
            </div>
            <Link
              href="/transcrever-youtube"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#a5b4fc",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <span>Usar Transcrição com IA</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Features Grid */}
          <section style={{ margin: "80px 0 60px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#f87171",
                }}
              >
                Vantagens Exclusivas
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginTop: "8px",
                }}
              >
                Por que usar o baixador de YouTube do Peguei o Texto?
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
                maxWidth: "1000px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Video size={22} color="#f87171" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Suporte Total a Shorts & Vídeos Longos
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Baixe aulas completas, podcasts, videoclipes ou os vídeos curtos do YouTube Shorts em poucos segundos.
                </p>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <ShieldCheck size={22} color="#10b981" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Sem Anúncios Abusivos
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Não suporta mais sites que abrem 5 popups a cada clique? Aqui seu download é limpo, seguro e direto.
                </p>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(99, 102, 241, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Music size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Extração de MP3 e Transcrição IA
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Extraia apenas o áudio para ouvir offline ou gere o texto completo com legendas .SRT para CapCut e Premiere.
                </p>
              </div>
            </div>
          </section>

          {/* 3 Steps Guide */}
          <section
            style={{
              padding: "48px 32px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              maxWidth: "1000px",
              margin: "0 auto 60px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
                Como baixar vídeo do YouTube em 3 passos
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Funciona em qualquer navegador, seja no celular (Android/iPhone) ou computador.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  1
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    Copie a URL do YouTube
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    No aplicativo ou site do YouTube, clique em &quot;Compartilhar&quot; e copie o link do vídeo ou Shorts.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #dc2626 0%, #ec4899 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  2
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    Cole e Busque
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Cole o link no campo superior desta página e clique em &quot;Buscar Vídeo&quot;.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ec4899 0%, #10b981 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  3
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    Baixe em MP4 ou MP3
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Clique no botão verde para baixar o MP4 HD ou no botão de áudio para salvar o MP3.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom AdSense Banner */}
          <AdsenseBanner format="leaderboard" slot="1000000003" />

          {/* FAQ Section */}
          <section style={{ maxWidth: "800px", margin: "40px auto 0" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#fca5a5",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <HelpCircle size={16} />
                <span>Perguntas Frequentes</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
                Dúvidas sobre o Download de Vídeos do YouTube
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "É gratuito baixar vídeos do YouTube pelo Peguei o Texto?",
                  a: "Sim, é 100% gratuito. Você não precisa cadastrar cartão de crédito nem criar conta para salvar os vídeos.",
                },
                {
                  q: "Posso baixar vídeos em 1080p Full HD?",
                  a: "Sim! Disponibilizamos a melhor resolução entregue pelo YouTube para o vídeo pesquisado, incluindo versões em alta definição MP4.",
                },
                {
                  q: "Como baixar YouTube Shorts no iPhone ou Android?",
                  a: "No app do YouTube, toque em Compartilhar no Shorts, copie o link, abra o Peguei o Texto no Safari ou Chrome e cole. O download iniciará direto no seu gerenciador de arquivos do smartphone.",
                },
                {
                  q: "Como converter o vídeo do YouTube em texto e legendas?",
                  a: "Basta clicar no botão 'Transcrever este Vídeo com IA Agora' abaixo do resultado de busca. Em segundos, nossa IA processa o áudio e gera o texto formatado e arquivos .SRT.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    cursor: "pointer",
                  }}
                >
                  <summary
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      listStyle: "none",
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ color: "#fca5a5", fontSize: "16px" }}>+</span>
                  </summary>
                  <p
                    style={{
                      marginTop: "12px",
                      fontSize: "14px",
                      color: "var(--text-muted, #94a3b8)",
                      lineHeight: "1.6",
                    }}
                  >
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
