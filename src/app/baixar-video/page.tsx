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
  FileText,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Baixar Vídeos do YouTube, TikTok, Instagram e LinkedIn Grátis Online | Peguei o Texto",
  description:
    "Baixe vídeos e áudios em MP4 e MP3 de alta qualidade do YouTube, TikTok (sem marca d'água), Instagram Reels, Facebook e LinkedIn. Sem popups invasivos, 100% grátis e com opção de transcrever com IA em 1 clique.",
  keywords: [
    "baixar video youtube",
    "baixar video tiktok sem marca d'agua",
    "baixar reels instagram",
    "baixar video linkedin",
    "baixar video facebook",
    "baixar audio youtube mp3",
    "extrair mp3 tiktok",
    "baixar video online gratis",
    "transcrever video baixado",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/baixar-video",
  },
  openGraph: {
    title: "Baixar Vídeos e Áudios Online em MP4 / MP3 Grátis | Peguei o Texto",
    description:
      "Baixe vídeos do YouTube, TikTok sem marca d'água, Reels e LinkedIn. Rápido, seguro e sem anúncios intrusivos.",
    url: "https://pegueiotexto.com.br/baixar-video",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Peguei o Texto - Baixador de Vídeos da Web",
      "url": "https://pegueiotexto.com.br/baixar-video",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Ferramenta online gratuita para download de vídeos e áudios do YouTube, TikTok sem marca d'água, Instagram e LinkedIn.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1280",
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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "É gratuito baixar vídeos pelo Peguei o Texto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! O download de vídeos em MP4 e áudios em MP3 de plataformas públicas é 100% gratuito e não exige instalação de nenhum software ou aplicativo.",
          },
        },
        {
          "@type": "Question",
          "name": "Como baixar vídeos do TikTok sem marca d'água?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basta copiar o link do TikTok, colar na barra de busca do Peguei o Texto e clicar em 'Buscar Vídeo'. O sistema remove a marca d'água automaticamente e disponibiliza o arquivo em MP4 HD.",
          },
        },
        {
          "@type": "Question",
          "name": "Posso extrair apenas o áudio em MP3?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! Ao buscar qualquer vídeo do YouTube, TikTok ou Reels, você terá botões dedicados para baixar o vídeo completo (MP4) ou apenas o áudio original em MP3.",
          },
        },
        {
          "@type": "Question",
          "name": "Como transformar o vídeo baixado em texto e legendas (.SRT)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Com o Peguei o Texto, você pode clicar no botão 'Transcrever este Vídeo com IA Agora' logo abaixo do resultado. Nossa inteligência artificial transcreve o áudio com 99.2% de precisão e gera legendas sincronizadas para CapCut e Premiere.",
          },
        },
      ],
    },
  ],
};

export default function BaixarVideoPage() {
  return (
    <>
      {/* Script do Google AdSense carregado EXCLUSIVAMENTE nesta página */}
      <Script
        id="adsbygoogle-init"
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
        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 80%)",
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
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#a5b4fc",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Flame size={15} color="#ec4899" />
              <span>Baixador Rápido de Vídeos e Áudios Online</span>
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
              Baixe Vídeos em{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
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
              Baixe vídeos do <strong>YouTube, TikTok (sem marca d&apos;água), Instagram Reels, Facebook e LinkedIn</strong> sem instalar nada e sem popups irritantes.
            </p>
          </div>

          {/* Interactive Downloader & Trojan Horse Widget */}
          <VideoDownloader />

          {/* Feature Highlights Grid */}
          <section style={{ margin: "80px 0 60px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary, #6366f1)",
                }}
              >
                Diferenciais Exclusivos
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginTop: "8px",
                }}
              >
                Por que usar o baixador do Peguei o Texto?
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
                  Zero Popups & Malwares
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  A maioria dos sites de download empurra anúncios maliciosos e notificações invasivas. Aqui o link é direto, limpo e seguro.
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
                    background: "rgba(236, 72, 153, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Zap size={22} color="#ec4899" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  TikTok Sem Marca D&apos;água
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Baixe vídeos do TikTok em qualidade HD pura, sem o logo flutuante ou o encerramento com o nome do perfil.
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
                  <Sparkles size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Ponte com Inteligência Artificial
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Não guarde arquivos mortos no disco: converta qualquer vídeo em legendas .SRT, resumo em tópicos e posts para redes com 1 clique.
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
                Como baixar vídeos em 3 passos simples
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Processo instantâneo diretamente no seu navegador, sem programas adicionais.
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
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
                    Copie a URL do Vídeo
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Abra o YouTube, TikTok, Instagram ou LinkedIn e clique em &quot;Compartilhar&quot; para copiar o link.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
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
                    Insira o link na barra superior e clique em &quot;Buscar Vídeo&quot; para extrair as opções disponíveis.
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
                    Baixe ou Transcreva
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Baixe o MP4 HD / MP3 ou clique para extrair o texto completo e legendas com IA em 30 segundos.
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
                  color: "#a5b4fc",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <HelpCircle size={16} />
                <span>Dúvidas Frequentes</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
                Perguntas sobre o Download de Vídeos
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "É gratuito baixar vídeos pelo Peguei o Texto?",
                  a: "Sim, o download de vídeos e extração de áudio é 100% gratuito. Você não precisa cadastrar cartão de crédito ou pagar nada para salvar seus arquivos.",
                },
                {
                  q: "Como baixar vídeos do TikTok sem a marca d'água?",
                  a: "Basta colar o link do vídeo do TikTok na barra de busca. Nosso sistema localiza a versão de alta resolução original hospedada pela plataforma, permitindo baixar o arquivo MP4 limpo sem nenhum logotipo.",
                },
                {
                  q: "Posso baixar no celular (Android ou iPhone)?",
                  a: "Sim! A ferramenta é totalmente compatível com navegadores mobile como Safari e Google Chrome. No iPhone, basta tocar em baixar e confirmar no gerenciador de downloads do iOS.",
                },
                {
                  q: "Como funciona a transcrição e geração de legendas com IA?",
                  a: "Após buscar o vídeo, você verá o card de produtividade da nossa IA. Ao clicar em 'Transcrever Vídeo com IA Agora', você é direcionado com o link já preenchido para receber a transcrição completa com pontuação e o arquivo de legendas .SRT pronto para CapCut.",
                },
                {
                  q: "Quais plataformas são suportadas?",
                  a: "Suportamos YouTube (vídeos e Shorts), TikTok, Instagram Reels, Facebook e LinkedIn, além de podcasts e vídeos de diversas páginas abertas da internet.",
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
                    <span style={{ color: "#a5b4fc", fontSize: "16px" }}>+</span>
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
