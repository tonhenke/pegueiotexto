import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Clock, Star } from "lucide-react";

const YoutubeIcon = ({ size = 20, color = "#EF4444" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcrever Vídeo do YouTube em Texto Online Grátis com IA",
  description:
    "Cole o link de qualquer vídeo ou Shorts do YouTube e converta em texto em segundos com Inteligência Artificial avançada. 98% de precisão em português, pontuação perfeita e exportação em .TXT, .DOCX, .PDF e .SRT. Teste grátis!",
  keywords: [
    "transcrever video do youtube",
    "transcrever youtube em texto",
    "converter video do youtube em texto",
    "tirar texto de video do youtube",
    "baixar transcricao do youtube",
    "transcrever shorts do youtube",
    "transcricao podcast youtube",
    "gerar legendas youtube srt",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcrever-youtube",
  },
  openGraph: {
    title: "Transcrever Vídeo do YouTube em Texto com IA | Peguei o Texto",
    description: "Converta qualquer vídeo do YouTube em texto e legendas .SRT em segundos. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcrever-youtube",
  },
};

const youtubeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever um vídeo do YouTube em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta copiar o link do vídeo ou Shorts no YouTube, colar no campo do Peguei o Texto e clicar em 'Transcrever'. A inteligência artificial avançada processa o áudio e entrega o texto completo com pontuação em poucos segundos."
      }
    },
    {
      "@type": "Question",
      "name": "Funciona com YouTube Shorts e Podcasts longos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O Peguei o Texto suporta tanto vídeos rápidos de Shorts quanto vídeos e podcasts de 1 a 3 horas de duração."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a diferença entre o Peguei o Texto e as legendas automáticas do YouTube?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "As legendas nativas do YouTube não possuem pontuação, erram sotaques e não separam parágrafos. O Peguei o Texto usa inteligência artificial avançada, que inclui pontuação completa, letras maiúsculas e alta fidelidade em português brasileiro."
      }
    }
  ]
};

export default function TranscreverYoutubePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#FCA5A5" }}>
                <YoutubeIcon size={14} color="#EF4444" />
                Transcritor Oficial para YouTube & Shorts
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrever vídeo do YouTube <br />
              <span style={{ background: "linear-gradient(135deg, #EF4444, #F43F5E, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                em texto em segundos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Cole o link de podcasts, videoaulas, entrevistas ou Shorts. Receba o texto com pontuação perfeita e baixe em <strong>.TXT</strong> ou <strong>.SRT</strong> para legendas.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 98% de precisão em PT-BR
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis para testar
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Sem precisar instalar nada
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.youtube.com/watch?v=... ou link do Shorts" />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Passo a Passo</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Como transcrever um vídeo do YouTube</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Em menos de 30 segundos você transforma horas de vídeo em texto editável.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "Copie o link do vídeo",
                desc: "No YouTube ou no aplicativo do celular, clique em 'Compartilhar' e copie o link do vídeo ou Shorts.",
                icon: <YoutubeIcon size={24} color="#EF4444" />
              },
              {
                step: "02",
                title: "Cole no Peguei o Texto",
                desc: "Cole a URL no campo acima. Nossa inteligência artificial avançada analisa o áudio e remove ruídos de fundo.",
                icon: <Zap size={24} color="#A78BFA" />
              },
              {
                step: "03",
                title: "Baixe o texto ou legenda",
                desc: "Copie o texto com um clique ou baixe o arquivo em .TXT formatado ou .SRT para usar em editores de vídeo.",
                icon: <FileText size={24} color="#06B6D4" />
              }
            ].map((card) => (
              <div key={card.step} className="glass-card" style={{ padding: "32px 24px", position: "relative" }}>
                <div style={{ fontSize: "3rem", fontWeight: 900, color: "rgba(255,255,255,0.04)", position: "absolute", top: "16px", right: "20px" }}>
                  {card.step}
                </div>
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

      {/* COMPARISON TABLE */}
      <section style={{ padding: "80px 0", background: "rgba(0,0,0,0.2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Comparativo</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Por que nossa IA é superior à legenda padrão do YouTube?</h2>
          </div>

          <div className="glass-card" style={{ padding: "0", overflow: "hidden", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border-subtle)", fontWeight: 700, fontSize: "14px" }}>
              <span>Recurso</span>
              <span style={{ color: "#A78BFA" }}>Peguei o Texto (IA)</span>
              <span style={{ color: "var(--text-muted)" }}>Legenda Padrão YouTube</span>
            </div>
            {[
              { feat: "Pontuação (vírgulas, pontos)", peguei: "Sim, perfeita", yt: "Não tem pontuação" },
              { feat: "Parágrafos organizados", peguei: "Sim, legível", yt: "Bloco contínuo confuso" },
              { feat: "Sotaques e gírias do Brasil", peguei: "98% de precisão", yt: "Muitos erros e palavras trocadas" },
              { feat: "Download em .SRT para editores", peguei: "Com 1 clique", yt: "Exige ferramentas externas complexas" },
              { feat: "Privacidade dos dados", peguei: "Mídia deletada após transcrição", yt: "Vídeo mantido no ecossistema" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "16px 24px", borderBottom: i < 4 ? "1px solid var(--border-subtle)" : "none", fontSize: "14px", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{row.feat}</span>
                <span style={{ color: "#6EE7B7", fontWeight: 600 }}>✓ {row.peguei}</span>
                <span style={{ color: "var(--text-muted)" }}>✕ {row.yt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Dúvidas Comuns</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Perguntas Frequentes sobre YouTube</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Consigo transcrever podcasts inteiros de 2 ou 3 horas?",
                a: "Sim! Nossa infraestrutura de Inteligência Artificial na nuvem aguenta vídeos longos e transcreve podcasts inteiros em poucos minutos."
              },
              {
                q: "Funciona com vídeos privados ou não listados?",
                a: "Vídeos 'Não Listados' (Unlisted) com link direto funcionam perfeitamente. Vídeos 'Privados' que exigem login na conta pessoal do criador não são acessíveis por questões de segurança da plataforma."
              },
              {
                q: "Posso exportar a legenda para o CapCut ou Premiere?",
                a: "Com certeza! Basta clicar no botão 'Baixar .SRT' que o arquivo já vem sincronizado no formato padrão aceito por CapCut, Premiere Pro, DaVinci Resolve e Final Cut."
              },
              {
                q: "O serviço é gratuito?",
                a: "Você ganha 5 minutos grátis automaticamente ao se cadastrar, sem precisar de cartão. Se precisar de mais tempo, oferecemos pacotes a partir de R$ 4,90 por 60 minutos."
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
              Experimentar Transcrição do YouTube Agora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
