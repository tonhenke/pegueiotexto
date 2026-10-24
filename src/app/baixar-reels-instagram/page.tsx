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
  HelpCircle,
  ArrowRight,
  Camera,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Baixar Reels do Instagram Grátis em MP4 Online | Peguei o Texto",
  description:
    "Baixe Reels, vídeos do feed e Stories do Instagram em MP4 Full HD. Sem popups irritantes, 100% grátis, sem pedir senha e com opção de transcrever ou gerar legendas com IA.",
  keywords: [
    "baixar reels instagram",
    "baixar video do instagram",
    "salvar reels instagram",
    "baixar reels online gratis",
    "baixar video instagram mp4",
    "baixar reels com audio",
    "baixar video do instagram no celular",
    "salvar video instagram galeria",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/baixar-reels-instagram",
  },
  openGraph: {
    title: "Baixar Reels do Instagram Grátis em MP4 Online | Peguei o Texto",
    description:
      "Salve Reels do Instagram direto na sua galeria em MP4 HD. Seguro, rápido e sem popups maliciosos.",
    url: "https://pegueiotexto.com.br/baixar-reels-instagram",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Baixador de Reels do Instagram - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/baixar-reels-instagram",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Ferramenta online gratuita para download de Reels e vídeos do Instagram em MP4 de alta qualidade sem anúncios invasivos.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1190",
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
      "name": "Como Baixar Reels do Instagram no Celular ou PC",
      "description": "Passo a passo rápido para salvar qualquer Reels do Instagram na sua galeria.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copie o link do Reels",
          "text": "No aplicativo do Instagram, abra o Reels, toque no botão de compartilhar (aviãozinho ou 3 pontinhos) e selecione 'Copiar link'.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Cole na barra de busca",
          "text": "Cole o link copiado no campo de busca do Peguei o Texto e toque em 'Buscar Vídeo'.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Salve o arquivo",
          "text": "Clique no botão 'Baixar Vídeo (MP4 HD)' para salvar o arquivo de vídeo completo com áudio.",
          "position": 3,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Preciso fazer login ou fornecer a senha do Instagram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nunca! O Peguei o Texto nunca solicita login, senha ou qualquer dado pessoal. O download funciona diretamente a partir do link público do Reels.",
          },
        },
        {
          "@type": "Question",
          "name": "O Reels é baixado com áudio sincronizado?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! O arquivo MP4 baixado vem com a trilha de áudio original e o som perfeitamente sincronizado com as imagens.",
          },
        },
        {
          "@type": "Question",
          "name": "Consigo salvar direto na galeria do iPhone (iOS)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. No Safari do iOS, após clicar em baixar, toque no ícone de downloads e selecione 'Compartilhar' > 'Salvar Vídeo' para enviar direto ao rolo da câmera.",
          },
        },
        {
          "@type": "Question",
          "name": "Como converter o Reels em legendas ou texto com IA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basta clicar em 'Transcrever este Vídeo com IA Agora' logo após a busca para obter a transcrição completa e o arquivo de legendas .SRT pronto para CapCut.",
          },
        },
      ],
    },
  ],
};

export default function BaixarReelsInstagramPage() {
  return (
    <>
      <Script
        id="adsbygoogle-init-ig"
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
        {/* Ambient Instagram gradient glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 80%)",
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
                background: "rgba(236, 72, 153, 0.1)",
                border: "1px solid rgba(236, 72, 153, 0.25)",
                color: "#f472b6",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Camera size={14} color="#ec4899" />
              <span>Baixador Rápido de Reels e Vídeos do Instagram</span>
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
              Baixar Reels do Instagram{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                em MP4 HD Grátis
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
              Cole o link de qualquer <strong>Reels ou vídeo do Instagram</strong> para salvar direto na galeria em alta definição. Sem senha, sem popups chatos e 100% online.
            </p>
          </div>

          {/* Video Downloader Widget */}
          <VideoDownloader placeholder="Cole o link do Reels do Instagram (ex: https://www.instagram.com/reel/...)" />

          {/* Bridge CTA: Link to Instagram Transcription */}
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
              <Sparkles size={20} color="#ec4899" />
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                Deseja transcrever as falas ou criar <strong>legendas sincronizadas</strong> deste Reels?
              </span>
            </div>
            <Link
              href="/transcrever-instagram"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#f472b6",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <span>Transcrever Reels com IA</span>
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
                  color: "#ec4899",
                }}
              >
                Vantagens Peguei o Texto
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginTop: "8px",
                }}
              >
                A melhor experiência para baixar do Instagram
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
                    background: "rgba(245, 158, 11, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Video size={22} color="#f59e0b" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Qualidade MP4 Original em HD
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Baixe o vídeo na máxima resolução que o autor postou no Instagram, com áudio nítido e sem perda de compressão.
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
                  Zero Senhas ou Login
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Nunca pedimos dados de conta ou permissões do seu Instagram. Sua privacidade é respeitada em 100%.
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
                    background: "rgba(139, 92, 246, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Sparkles size={22} color="#a855f7" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Legendas para CapCut com IA
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Gere o arquivo `.SRT` das falas do Reels em segundos para editar facilmente no CapCut ou Premiere.
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
                Como baixar Reels do Instagram em 3 passos
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Compatível com iPhone, Android, Mac e computadores Windows.
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
                    background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
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
                    Copie a URL do Reels
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    No app do Instagram, toque no ícone de compartilhar do Reels e selecione &quot;Copiar link&quot;.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
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
                    Cole no Peguei o Texto
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Cole o link no campo superior desta página e clique no botão &quot;Buscar Vídeo&quot;.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #10b981 100%)",
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
                    Baixe em MP4
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Clique no botão verde para salvar o arquivo de vídeo completo com som direto no seu aparelho.
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
                  color: "#f472b6",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <HelpCircle size={16} />
                <span>Perguntas Frequentes</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
                Dúvidas sobre o Download de Reels do Instagram
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "Posso baixar Reels de perfis privados?",
                  a: "Por motivos de privacidade e conformidade com a API do Instagram, apenas Reels de contas públicas podem ser baixados diretamente.",
                },
                {
                  q: "O criador do Reels fica sabendo que eu baixei o vídeo?",
                  a: "Não! O download é 100% anônimo e o Instagram não notifica o autor nem exibe seu perfil em nenhuma lista de salvamento.",
                },
                {
                  q: "Consigo salvar o Reels com a música de fundo?",
                  a: "Sim! O arquivo MP4 baixado é preservado com o áudio completo e a música original utilizada no Reels.",
                },
                {
                  q: "Como salvar no rolo da câmera do iPhone?",
                  a: "Abra no navegador Safari, toque em Baixar, acesse o menu de downloads do Safari, toque no vídeo e selecione 'Salvar Vídeo'. Ele aparecerá no seu aplicativo Fotos instantaneamente.",
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
                    <span style={{ color: "#f472b6", fontSize: "16px" }}>+</span>
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
