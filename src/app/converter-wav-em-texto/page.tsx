import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Sliders, AudioLines, FileCheck, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Converter WAV em Texto Online Grátis com IA | Peguei o Texto",
  description:
    "Converta áudios WAV de alta qualidade em texto em segundos com Inteligência Artificial. Transcrição com 98% de precisão em português, pontuação perfeita e exportação para Word (.DOCX), PDF e TXT. 5 minutos grátis!",
  keywords: [
    "converter wav em texto",
    "transcrever audio wav",
    "converter gravacao wav para texto",
    "transcrever arquivo wav online gratis",
    "passar audio wav para word",
    "transcritor wav gratis",
    "converter wav para docx",
    "transcricao de audio profissional wav",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/converter-wav-em-texto",
  },
  openGraph: {
    title: "Converter Áudio WAV em Texto Online com IA | Peguei o Texto",
    description: "Converta gravações de voz e estúdio em formato WAV para texto com pontuação perfeita em segundos. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/converter-wav-em-texto",
  },
};

const wavFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como converter um arquivo WAV em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta arrastar o seu arquivo de áudio WAV para a área de upload do Peguei o Texto. Nossa Inteligência Artificial analisa o áudio sem perdas e gera o texto com pontuação gramatical completa em segundos."
      }
    },
    {
      "@type": "Question",
      "name": "Por que arquivos WAV têm maior precisão de transcrição?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O formato WAV é um áudio sem compressão (lossless), preservando todas as nuances da voz humana. Isso permite que nosso modelo de IA atinja índices de fidelidade próximos a 99%."
      }
    },
    {
      "@type": "Question",
      "name": "Suporta arquivos WAV grandes de gravadores de estúdio e audiências?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Suportamos gravações feitas em gravadores profissionais como Zoom, Tascam e microfones de lapela, incluindo sessões e audiências de várias horas de duração."
      }
    },
    {
      "@type": "Question",
      "name": "Quais formatos de exportação estão disponíveis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Você pode baixar o texto pronto em Word (.DOCX), documento PDF formatado, arquivo de texto puro (.TXT) ou legenda (.SRT)."
      }
    }
  ]
};

export default function ConverterWavEmTextoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wavFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#6EE7B7" }}>
                <AudioLines size={14} color="#10B981" />
                Conversor de Áudio WAV Sem Compressão (Lossless)
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Converter áudio WAV em texto <br />
              <span style={{ background: "linear-gradient(135deg, #10B981, #06B6D4, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                com máxima fidelidade e IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Transcreva áudios profissionais de estúdio, audiências judiciais, perícias e podcasts em WAV. Receba o texto com <strong>pontuação completa</strong> e exporte para <strong>Word</strong> e <strong>PDF</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Precisão máxima com áudio sem perdas
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Exportação para Word (.DOCX) e PDF
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Arraste seu arquivo WAV de alta fidelidade aqui..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Fluxo Sem Complicações
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como converter seu áudio WAV em texto
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Sliders size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Envie o Áudio WAV</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Faça upload do arquivo gravado no seu microfone, gravador portátil ou mesa de som diretamente pelo navegador.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. A IA Processa em Segundos</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Nossa IA analisa a fidelidade do áudio sem perdas, aplicando pontuação gramatical e parágrafos precisos.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Baixe em Word ou PDF</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Baixe seu documento final em <strong>.DOCX</strong>, <strong>PDF</strong>, copie o texto puro ou gere resumos executivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Por que escolher o Peguei o Texto para arquivos WAV?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              A ferramenta de escolha para profissionais que prezam por precisão extrema.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <FileCheck size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Audiências e Depoimentos</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Ideal para advogados, peritos e tribunais que precisam transcrever depoimentos em WAV com fidelidade jurídica às falas.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Sliders size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Player Sincronizado Interativo</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Clique em qualquer palavra da transcrição para ouvir o trecho exato no áudio WAV, facilitando a revisão e conferência.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Privacidade Garantida</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Não retemos seus áudios. A mídia é excluída imediatamente após o processamento, mantendo o sigilo profissional dos seus projetos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              FAQ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição de WAV
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {wavFaqSchema.mainEntity.map((item, idx) => (
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
            Converta seu arquivo WAV agora mesmo
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente e receba 5 minutos grátis para testar.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Começar Gratuitamente <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
