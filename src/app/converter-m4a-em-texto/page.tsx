import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Mic, Smartphone, FileCheck, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Converter M4A em Texto Online Grátis com IA | Peguei o Texto",
  description:
    "Converta áudios M4A e gravações do iPhone em texto em segundos com Inteligência Artificial. Transcrição com 98% de precisão em português, pontuação perfeita e exportação para Word (.DOCX), PDF e TXT. 5 minutos grátis!",
  keywords: [
    "converter m4a em texto",
    "transcrever gravador do iphone",
    "transcrever audio m4a online gratis",
    "converter audio m4a para word",
    "transformar gravacao m4a em texto",
    "transcritor de m4a gratis",
    "como passar audio do gravador do iphone para texto",
    "converter gravacao de voz m4a",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/converter-m4a-em-texto",
  },
  openGraph: {
    title: "Converter Áudio M4A do iPhone em Texto com IA | Peguei o Texto",
    description: "Converta gravações de voz M4A do iPhone e Mac em texto com pontuação completa em segundos. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/converter-m4a-em-texto",
  },
};

const m4aFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como converter um áudio M4A do gravador do iPhone em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No aplicativo 'Gravador' do seu iPhone ou Mac, toque no botão de compartilhar (três pontinhos) e salve o arquivo ou envie diretamente para o navegador no Peguei o Texto. Nossa IA transcreve a gravação com pontuação completa em poucos segundos."
      }
    },
    {
      "@type": "Question",
      "name": "O M4A precisa ser convertido para MP3 antes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! O Peguei o Texto suporta arquivos .M4A nativamente, sem necessidade de conversores externos ou perda de qualidade."
      }
    },
    {
      "@type": "Question",
      "name": "Posso baixar o texto no formato Word (.DOCX) ou PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Você pode exportar o arquivo pronto em Word (.DOCX), PDF formatado ou copiar o texto em um clique."
      }
    },
    {
      "@type": "Question",
      "name": "Funciona para aulas, palestras e entrevistas longas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O sistema suporta gravações de voz de 10 minutos a várias horas de duração com alta fidelidade e pontuação inteligente."
      }
    }
  ]
};

export default function ConverterM4aEmTextoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(m4aFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.35)", color: "#D8B4FE" }}>
                <Smartphone size={14} color="#C084FC" />
                Conversor Especializado para Gravações do iPhone & M4A
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Converter áudio M4A em texto <br />
              <span style={{ background: "linear-gradient(135deg, #C084FC, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online e em segundos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 650, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Gravou notas de voz, entrevistas ou aulas no <strong>iPhone, iPad ou Mac</strong>? Envie seu arquivo .M4A e receba o texto formatado com pontuação perfeita pronto para <strong>Word</strong> e <strong>PDF</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Compatibilidade nativa com iOS e macOS
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
          <TranscribeForm initialPlaceholder="Arraste seu arquivo .M4A aqui ou selecione do iPhone/computador..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#C084FC", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Passo a Passo Rápido
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como transcrever gravações M4A do iPhone
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(168, 85, 247, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#C084FC" }}>
                <Mic size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Exporte a Gravação</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                No aplicativo <strong>Gravador</strong> do iPhone, toque nos três pontinhos da gravação e selecione <em>Compartilhar &gt; Salvar em Arquivos</em>.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. Envie no Peguei o Texto</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Abra o Peguei o Texto no Safari ou Chrome e selecione o arquivo .M4A salvo. O processamento começa imediatamente.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Baixe em Word ou PDF</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Receba o texto pronto com pontuação gramatical, parágrafos e baixe em <strong>.DOCX</strong>, <strong>PDF</strong> ou copie com 1 clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Por que usar o Peguei o Texto para arquivos M4A?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Projetado para economizar tempo de profissionais e acadêmicos.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(168, 85, 247, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C084FC" }}>
                  <FileCheck size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Sem Fazer Conversões Chatas</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Muitos sites exigem que você converta o M4A para MP3 primeiro. Aqui você sobe o arquivo original do gravador sem passos extras.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Resumo Executivo com IA</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Gravou uma entrevista de 40 minutos? Gere um resumo estruturado com os tópicos centrais e perguntas-chave sem precisar ler tudo.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Sigilo e Exclusão Segura</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Ideal para depoimentos, consultas médicas e informações sensíveis. Sua gravação é deletada imediatamente após o término do processamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#C084FC", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              FAQ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição de M4A
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {m4aFaqSchema.mainEntity.map((item, idx) => (
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
            Converta suas gravações M4A em texto agora
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente e receba 5 minutos grátis para testar o serviço.
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
