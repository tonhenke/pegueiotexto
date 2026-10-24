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
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Baixar Vídeo do TikTok Sem Marca d'Água Grátis em MP4 HD | Peguei o Texto",
  description:
    "Baixe vídeos do TikTok sem marca d'água (sem logo) em MP4 Full HD e extraia o áudio em MP3. Alternativa rápida e limpa ao SnapTik, 100% grátis, sem popups maliciosos.",
  keywords: [
    "baixar video tiktok sem marca d'agua",
    "baixar video tiktok sem marca dagua",
    "baixar video do tiktok sem logo",
    "snaptik alternativo",
    "baixar tiktok mp4",
    "salvar video tiktok sem marca",
    "baixar audio tiktok mp3",
    "baixar tiktok online gratis",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/baixar-video-tiktok",
  },
  openGraph: {
    title: "Baixar Vídeo do TikTok Sem Marca d'Água Grátis em MP4 HD | Peguei o Texto",
    description:
      "Remova a marca d'água do TikTok automaticamente. Baixe em MP4 HD limpo sem popups e transcreva com IA em 1 clique.",
    url: "https://pegueiotexto.com.br/baixar-video-tiktok",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Baixador do TikTok Sem Marca d'Água - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/baixar-video-tiktok",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Ferramenta gratuita para baixar vídeos do TikTok sem marca d'água em MP4 Full HD e extrair áudios em MP3 sem anúncios intrusivos.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
      },
    },
    {
      "@type": "HowTo",
      "name": "Como Baixar Vídeos do TikTok Sem Marca d'Água",
      "description": "Tutorial rápido para remover a marca d'água do TikTok e baixar em MP4 HD.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copie o link do TikTok",
          "text": "Abra o TikTok, clique no ícone de Compartilhar (seta ou WhatsApp) e toque em 'Copiar link'.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Cole na barra do Peguei o Texto",
          "text": "Cole a URL copiada no campo de busca e clique em 'Buscar Vídeo'.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Baixe o vídeo limpo",
          "text": "Clique no botão 'Baixar Vídeo (MP4 HD)' para salvar o arquivo sem o logotipo flutuante do TikTok.",
          "position": 3,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como o Peguei o Texto remove a marca d'água do TikTok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nosso sistema acessa o arquivo de vídeo original de alta qualidade hospedado pelo TikTok antes da aplicação dos carimbos visuais e do encerramento com o nome do perfil.",
          },
        },
        {
          "@type": "Question",
          "name": "Preciso pagar ou instalar algum aplicativo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não! O serviço é 100% gratuito e funciona diretamente no seu navegador (Chrome, Safari, Firefox), tanto no celular quanto no computador.",
          },
        },
        {
          "@type": "Question",
          "name": "Funciona no iPhone (iOS)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! Basta colar o link no Safari do seu iPhone e tocar em Baixar. O arquivo será salvo diretamente no aplicativo Arquivos ou na sua galeria de fotos.",
          },
        },
        {
          "@type": "Question",
          "name": "Consigo extrair apenas a música ou áudio em MP3?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! Ao buscar o vídeo, você terá um botão dedicado para baixar o áudio original em MP3 de alta fidelidade.",
          },
        },
      ],
    },
  ],
};

export default function BaixarVideoTiktokPage() {
  return (
    <>
      <Script
        id="adsbygoogle-init-tt"
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
        {/* Ambient cyan & pink glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)",
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
              <Zap size={14} color="#ec4899" />
              <span>Remoção Automática de Marca d&apos;Água do TikTok</span>
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
              Baixar Vídeos do TikTok{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Sem Marca d&apos;Água em HD
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
              Cole o link de qualquer vídeo do TikTok para salvar o arquivo original <strong>em MP4 HD limpo, sem o logotipo flutuante e sem popups maliciosos</strong>.
            </p>
          </div>

          {/* Video Downloader Widget */}
          <VideoDownloader placeholder="Cole o link do TikTok (ex: https://www.tiktok.com/@usuario/video/...)" />

          {/* Bridge CTA: Link to TikTok Transcription */}
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
                Quer extrair o <strong>roteiro ou legendas para CapCut</strong> deste TikTok?
              </span>
            </div>
            <Link
              href="/transcrever-tiktok"
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
              <span>Transcrever TikTok com IA</span>
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
                Melhor que SnapTik
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginTop: "8px",
                }}
              >
                A forma mais limpa e rápida de salvar do TikTok
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
                    background: "rgba(236, 72, 153, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Flame size={22} color="#ec4899" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Sem Marca d&apos;Água (No Watermark)
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  O arquivo é gerado completamente limpo, sem o logo do TikTok saltando na tela e sem a vinheta de encerramento.
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
                  Zero Anúncios Invasivos & Vírus
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Sem abas de cassino que abrem sozinhas ou redirecionamentos maliciosos. O download é 100% seguro.
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
                    background: "rgba(6, 182, 212, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Music size={22} color="#06b6d4" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Extração de Áudio MP3 Original
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Salve músicas virais e efeitos sonoros diretamente em MP3 para usar em seus próprios vídeos.
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
                Como salvar vídeos do TikTok sem marca d&apos;água
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Processo direto pelo navegador do celular ou computador em menos de 10 segundos.
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
                    background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
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
                    Copie o Link do TikTok
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    No aplicativo TikTok, clique no botão &quot;Compartilhar&quot; e escolha a opção &quot;Copiar link&quot;.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
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
                    Insira a URL copiada na caixa de texto acima e clique no botão &quot;Buscar Vídeo&quot;.
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
                    Baixe em MP4 HD
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Toque em &quot;Baixar Vídeo (MP4 HD)&quot; para salvar o arquivo totalmente limpo na sua galeria.
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
                Dúvidas sobre o Download do TikTok Sem Marca d&apos;Água
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "Como o Peguei o Texto consegue tirar a marca d'água?",
                  a: "Nossa tecnologia localiza a cópia de alta resolução original processada nos servidores de mídia do TikTok antes da inserção dos carimbos visuais animados, entregando a você o vídeo puramente limpo.",
                },
                {
                  q: "Onde o vídeo baixado fica salvo no celular?",
                  a: "No iPhone, o arquivo vai para a pasta 'Downloads' do aplicativo Arquivos (ou direto para o app Fotos se você tocar em 'Salvar Vídeo'). No Android, fica salvo diretamente na sua galeria e na pasta de Downloads do Chrome.",
                },
                {
                  q: "Posso baixar áudios e músicas do TikTok em MP3?",
                  a: "Sim! Ao buscar o vídeo, você terá o botão 'Baixar Áudio (MP3)' que extrai a trilha sonora com alta qualidade de som.",
                },
                {
                  q: "Posso transcrever as falas do vídeo em legendas automáticas?",
                  a: "Com certeza! Basta clicar no botão de IA 'Transcrever este Vídeo com IA Agora' para gerar legendas sincronizadas (.SRT) prontas para editar no CapCut ou Premiere.",
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
