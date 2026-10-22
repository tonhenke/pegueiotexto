import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Share2, Layers, Video, TrendingUp } from "lucide-react";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcrever Vídeo do TikTok em Texto Online Grátis com IA",
  description:
    "Cole o link de qualquer vídeo do TikTok e receba a transcrição completa e roteiro em segundos. Transforme vídeos virais em carrosséis, posts e legendas .SRT. 5 minutos grátis!",
  keywords: [
    "transcrever video do tiktok",
    "pegar texto do tiktok",
    "converter tiktok em texto",
    "tirar texto de video do tiktok",
    "pegar roteiro do tiktok",
    "gerar legendas tiktok srt",
    "reaproveitar conteudo tiktok",
    "transcricao tiktok online gratis",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcrever-tiktok",
  },
  openGraph: {
    title: "Transcrever Vídeo do TikTok em Texto com IA | Peguei o Texto",
    description: "Extraia o roteiro e o texto completo de qualquer vídeo do TikTok em segundos com IA. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcrever-tiktok",
  },
};

const tiktokFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever um vídeo do TikTok em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Abra o vídeo no TikTok, clique no ícone de compartilhar e selecione 'Copiar link'. Em seguida, cole a URL no campo do Peguei o Texto e clique em 'Transcrever'. A inteligência artificial baixa o áudio e gera a transcrição com pontuação em segundos."
      }
    },
    {
      "@type": "Question",
      "name": "Posso baixar o arquivo de legenda .SRT do TikTok?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Você pode exportar o arquivo pronto em formato .SRT com timestamps para sincronizar perfeitamente no CapCut ou Premiere, além de formatos em .TXT e .DOCX (Word)."
      }
    },
    {
      "@type": "Question",
      "name": "Funciona com links encurtados vm.tiktok.com?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Nosso sistema reconhece tanto links completos quanto links rápidos gerados pelo aplicativo do celular (como vm.tiktok.com/xxxxxx)."
      }
    },
    {
      "@type": "Question",
      "name": "O serviço é gratuito para testar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Ao criar uma conta você ganha 5 minutos gratuitos imediatos para testar a velocidade e a precisão do serviço, sem precisar cadastrar cartão."
      }
    }
  ]
};

export default function TranscreverTikTokPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(254, 9, 121, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(0, 242, 254, 0.12)", border: "1px solid rgba(0, 242, 254, 0.35)", color: "#67E8F9" }}>
                <TikTokIcon size={14} />
                Transcritor de Vídeos e Áudios do TikTok
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrever vídeo do TikTok <br />
              <span style={{ background: "linear-gradient(135deg, #00F2FE 0%, #FE0979 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                em texto e roteiros com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Cole o link de qualquer vídeo do TikTok e receba a fala completa com pontuação e separação de parágrafos. Perfeito para <strong>reaproveitar conteúdo</strong> em posts, roteiros e legendas.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Suporta links vm.tiktok.com
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Exportação em .SRT para CapCut
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis para começar
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.tiktok.com/@usuario/video/... ou vm.tiktok.com/..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#00F2FE", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Fluxo Super Rápido
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como tirar o texto de um vídeo do TikTok
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(0, 242, 254, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#00F2FE" }}>
                <Share2 size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Copie o Link</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                No TikTok, toque no botão de compartilhar do vídeo e selecione a opção <strong>Copiar Link</strong>.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(254, 9, 121, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#FE0979" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. Cole no Peguei o Texto</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Cole o link no campo acima e clique em <strong>Transcrever</strong>. Nossa IA extrai o áudio e processa a fala em poucos segundos.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Baixe ou Copie</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Copie o texto com 1 clique para transformar em post, carrossel ou baixe em <strong>.SRT</strong> para colocar legendas no seu próprio vídeo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREATOR ADVANTAGES */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Feito para Criadores de Conteúdo e Social Media</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Multiplique sua produção de conteúdo sem precisar digitar nada à mão.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(0, 242, 254, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F2FE" }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Do Vídeo para Carrosséis e Threads</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Pegue as melhores ideias e ensinamentos de vídeos virais e transforme instantaneamente em roteiros para seus próprios vídeos ou carrosséis para o Instagram e LinkedIn.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(254, 9, 121, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FE0979" }}>
                  <Video size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Legendas Sincronizadas (.SRT)</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Gere arquivos .SRT para adicionar legendas dinâmicas aos seus vídeos no CapCut, aumentando a retenção e o alcance dos seus conteúdos.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <TrendingUp size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Resumo dos Pontos Principais</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Use o gerador de resumos com IA para extrair apenas a essência e os insights principais do vídeo em formato de tópicos rápidos de ler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              FAQ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição de TikTok
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tiktokFaqSchema.mainEntity.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "90px 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: "16px" }}>
            Pronto para transformar vídeos em texto?
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Ganhe 5 minutos grátis ao se cadastrar. Sem downloads complicados, tudo direto pelo navegador.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Testar Gratuitamente <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
