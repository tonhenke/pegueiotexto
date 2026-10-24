import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdsenseBanner from "@/components/AdsenseBanner";
import VideoDownloader from "@/components/VideoDownloader";
import Link from "next/link";
import Script from "next/script";
import {
  Download,
  Music,
  Headphones,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Baixar Áudio do YouTube em MP3 Grátis de Alta Qualidade | Peguei o Texto",
  description:
    "Converta vídeos e músicas do YouTube em MP3 de alta qualidade rapidamente. 100% grátis, sem instalar nada, sem popups chatos e com opção de transcrever o áudio em texto com IA.",
  keywords: [
    "baixar audio youtube mp3",
    "converter video do youtube em mp3",
    "converter youtube para mp3",
    "baixar musica youtube mp3",
    "extrair audio youtube",
    "youtube to mp3 gratis",
    "baixar audio youtube celular",
    "baixar podcast youtube mp3",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/baixar-audio-youtube-mp3",
  },
  openGraph: {
    title: "Baixar Áudio do YouTube em MP3 Grátis de Alta Qualidade | Peguei o Texto",
    description:
      "Extraia áudios de vídeos do YouTube em MP3 de alta definição. Rápido, seguro e sem anúncios intrusivos.",
    url: "https://pegueiotexto.com.br/baixar-audio-youtube-mp3",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Conversor de YouTube para MP3 - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/baixar-audio-youtube-mp3",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Ferramenta gratuita para converter vídeos do YouTube em áudios MP3 de alta fidelidade sem instalar programas.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1080",
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
      "name": "Como Baixar Áudios do YouTube em MP3",
      "description": "Tutorial rápido para extrair o áudio de vídeos do YouTube em formato MP3.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copie o link do vídeo",
          "text": "Abra o YouTube e copie a URL do vídeo, música ou podcast que você deseja converter.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Cole na barra de busca",
          "text": "Cole a URL copiada no campo do Peguei o Texto e clique no botão 'Buscar Vídeo'.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Baixe o MP3",
          "text": "Clique no botão 'Baixar Áudio (MP3)' para salvar o arquivo de áudio imediatamente no seu dispositivo.",
          "position": 3,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Qual é a qualidade do áudio MP3 baixado?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Extraímos o fluxo de áudio com a máxima taxa de bits disponibilizada no YouTube, garantindo som cristalino para músicas, aulas e podcasts.",
          },
        },
        {
          "@type": "Question",
          "name": "Posso baixar áudios de vídeos longos ou podcasts inteiros?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! Nosso conversor processa áudios de palestras, entrevistas e podcasts de longa duração sem limitações artificiais.",
          },
        },
        {
          "@type": "Question",
          "name": "Preciso instalar programas ou extensões?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não. Toda a conversão acontece nos nossos servidores de alta velocidade e o arquivo MP3 é entregue diretamente no seu navegador.",
          },
        },
        {
          "@type": "Question",
          "name": "Como transcrever o áudio MP3 baixado em texto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Você pode clicar diretamente em 'Transcrever este Vídeo com IA Agora' na tela de resultado ou enviar o MP3 na página de transcrição de áudios.",
          },
        },
      ],
    },
  ],
};

export default function BaixarAudioYoutubeMp3Page() {
  return (
    <>
      <Script
        id="adsbygoogle-init-mp3"
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
        {/* Ambient emerald & violet glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)",
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
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                color: "#6ee7b7",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Headphones size={14} color="#10b981" />
              <span>Conversor Rápido de YouTube para MP3</span>
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
              Baixar Áudio do YouTube em{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #38bdf8 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MP3 de Alta Fidelidade
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
              Converta qualquer <strong>vídeo, música ou podcast do YouTube em MP3</strong> para ouvir offline no seu celular ou computador. 100% grátis, limpo e sem vírus.
            </p>
          </div>

          {/* Video Downloader Widget */}
          <VideoDownloader placeholder="Cole o link do YouTube para extrair o áudio MP3 (ex: https://www.youtube.com/watch?v=...)" />

          {/* Bridge CTA: Link to MP3 Transcription */}
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
              <Sparkles size={20} color="#10b981" />
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
                Deseja converter arquivos de áudio já salvos em <strong>texto com 99.2% de precisão</strong>?
              </span>
            </div>
            <Link
              href="/converter-mp3-em-texto"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#6ee7b7",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              }}
            >
              <span>Converter MP3 em Texto</span>
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
                  color: "#10b981",
                }}
              >
                Qualidade de Som Pura
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginTop: "8px",
                }}
              >
                Por que usar o conversor de YouTube para MP3?
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
                  <Music size={22} color="#10b981" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Áudio Cristalino Sem Perdas
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Extração pura da faixa de áudio em alta fidelidade, ideal para amantes de música, podcasts e audiolivros.
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
                    background: "rgba(56, 189, 248, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Zap size={22} color="#38bdf8" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Conversão Ultrarrápida
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Processamento instantâneo em nuvem. Não consome a bateria nem a memória do seu smartphone ou notebook.
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
                  <ShieldCheck size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  100% Grátis & Sem Vírus
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Esqueça aqueles sites perigosos que baixam programas executáveis (.exe). Aqui o download é exclusivamente o arquivo de áudio .mp3.
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
                Como converter YouTube para MP3 em 3 passos
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Sem programas pesados. Funciona diretamente no seu navegador.
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
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                    Copie o endereço da música, vídeo ou podcast que deseja extrair o áudio.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #059669 0%, #38bdf8 100%)",
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
                    Insira o link na caixa acima e toque em &quot;Buscar Vídeo&quot;.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
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
                    Baixe o MP3
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Clique no botão &quot;Baixar Áudio (MP3)&quot; para salvar a faixa direto no seu aparelho.
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
                  color: "#6ee7b7",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <HelpCircle size={16} />
                <span>Perguntas Frequentes</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
                Dúvidas sobre o Download de MP3 do YouTube
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "O arquivo baixado toca em qualquer reprodutor de música?",
                  a: "Sim! O formato MP3 é o padrão universal compatível com todos os smartphones, tocadores de carro, TVs e computadores.",
                },
                {
                  q: "Posso baixar no iPhone e ouvir offline?",
                  a: "Sim. O arquivo fica salvo no aplicativo Arquivos do iOS e pode ser reproduzido a qualquer momento, mesmo sem conexão à internet.",
                },
                {
                  q: "Existe limite de tempo para os vídeos convertidos?",
                  a: "Você pode converter vídeos longos de mais de 1 ou 2 horas (como podcasts e aulas) sem cobrança de taxas.",
                },
                {
                  q: "Como transformar esse áudio em texto?",
                  a: "Você pode clicar no card de IA 'Transcrever este Vídeo com IA Agora' para receber a transcrição instantânea com minutagem e resumo em tópicos.",
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
                    <span style={{ color: "#6ee7b7", fontSize: "16px" }}>+</span>
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
