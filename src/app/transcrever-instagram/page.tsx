import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Share2, Layers } from "lucide-react";

const InstagramIcon = ({ size = 20, color = "#E1306C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcrever Reels e Vídeos do Instagram em Texto com IA",
  description:
    "Cole o link de qualquer Reel ou vídeo do Instagram e receba a transcrição completa em segundos. Transforme vídeos em roteiros, carrosséis e posts. 5 minutos grátis!",
  keywords: [
    "transcrever reels instagram",
    "transcrever video do instagram",
    "pegar texto de reels",
    "converter reels em texto",
    "extrair audio instagram",
    "gerar legendas reels",
    "transcricao instagram online",
    "reaproveitar conteudo instagram",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcrever-instagram",
  },
  openGraph: {
    title: "Transcrever Reels do Instagram em Texto com IA | Peguei o Texto",
    description: "Extraia o texto de qualquer vídeo do Instagram Reels em segundos com Whisper IA. Teste grátis!",
    url: "https://pegueiotexto.com.br/transcrever-instagram",
  },
};

const instagramFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever um Reels do Instagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Abra o Instagram, clique no botão de compartilhar do Reels e selecione 'Copiar link'. Depois cole a URL no Peguei o Texto e clique em 'Transcrever'. O texto completo é gerado em poucos segundos."
      }
    },
    {
      "@type": "Question",
      "name": "Funciona com perfis abertos e fechados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Funciona com qualquer vídeo ou Reel de contas públicas do Instagram. Vídeos de contas privadas não podem ser acessados por questões de privacidade da Meta."
      }
    },
    {
      "@type": "Question",
      "name": "Como posso usar a transcrição de um Reels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Criadores de conteúdo e agências usam o texto transcrito para criar carrosséis, posts no LinkedIn, roteiros de novos vídeos, legendas acessíveis e newsletters."
      }
    }
  ]
};

export default function TranscreverInstagramPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(instagramFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(225, 48, 108, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(225, 48, 108, 0.15)", border: "1px solid rgba(225, 48, 108, 0.35)", color: "#F472B6" }}>
                <InstagramIcon size={14} color="#E1306C" />
                Transcritor de Reels & Vídeos do Instagram
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrever Reels do Instagram <br />
              <span style={{ background: "linear-gradient(135deg, #F59E0B, #E1306C, #833AB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                em texto puro em segundos
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Pegue o roteiro de qualquer Reel viral do Instagram. Transforme vídeos em carrosséis, threads, posts do LinkedIn ou salve as melhores ideias.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Funciona com qualquer Reel público
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis para começar
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Formatos .TXT e .SRT prontos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.instagram.com/reel/... ou link do vídeo" />
        </div>
      </section>

      {/* USE CASES FOR CREATORS */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Produtividade</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>O que você pode fazer com o texto de um Reels?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Reaproveite o conteúdo das redes sociais e multiplique sua produção em 10x.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                title: "Criar Carrosséis e Posts",
                desc: "Copie a fala do vídeo e transforme os tópicos em um carrossel educativo para o Instagram ou LinkedIn em minutos.",
                icon: <Layers size={24} color="#E1306C" />
              },
              {
                title: "Estudar Roteiros Virais",
                desc: "Analise a estrutura de ganchos (hooks), introduções e chamadas para ação dos vídeos mais virais do seu nicho.",
                icon: <Sparkles size={24} color="#F59E0B" />
              },
              {
                title: "Gerar Legendas com .SRT",
                desc: "Baixe a legenda com marcação de tempo (.SRT) para importar no CapCut e legendar seus próprios Reels.",
                icon: <FileText size={24} color="#06B6D4" />
              }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ padding: "32px 24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>{card.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Tire suas Dúvidas</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Perguntas Frequentes sobre Instagram</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Como copiar o link do Reels no Instagram?",
                a: "No aplicativo do Instagram no celular ou no computador, clique no ícone de avião de papel ou nos 3 pontinhos do Reels e escolha 'Copiar link'."
              },
              {
                q: "A IA entende músicas com fala por cima?",
                a: "Sim! O modelo Whisper Large v3 possui filtros avançados que conseguem separar a voz humana das trilhas sonoras de fundo comuns no Instagram."
              },
              {
                q: "Minhas informações do Instagram ficam salvas?",
                a: "Não. O Peguei o Texto não armazena nenhuma mídia. Assim que o áudio é processado, ele é sumariamente apagado para sua total privacidade."
              }
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>{item.q}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Bottom */}
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Link href="#video-url-input" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none" }}>
              Transcrever Reels do Instagram Agora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
