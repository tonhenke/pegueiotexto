import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, GraduationCap, BookOpen, Clock, FileCheck, Layers, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Transcrição de Entrevistas para TCC e Pesquisa Acadêmica com IA | Peguei o Texto",
  description:
    "Transcreva entrevistas de pesquisa qualitativa, TCC, dissertações e aulas gravadas em segundos com Inteligência Artificial. Transcrição literal palavra por palavra, pontuação rigorosa e exportação para Word (.DOCX) e PDF. 5 minutos grátis!",
  keywords: [
    "transcricao de entrevistas tcc",
    "transcricao academica com ia",
    "transcrever entrevistas de pesquisa",
    "transcricao de aulas gravadas",
    "degravacao de entrevistas pesquisa qualitativa",
    "transcrever audio para tcc",
    "transcricao de mestrado doutorado",
    "transcritor academico gratis",
    "converter entrevista em texto word",
    "degravar audio de pesquisa cientifica",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcricao-academica",
  },
  openGraph: {
    title: "Transcrição de Entrevistas para TCC e Pesquisa com IA | Peguei o Texto",
    description: "Economize dezenas de horas degravando entrevistas para TCC, mestrado e doutorado em minutos com IA. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcricao-academica",
  },
};

const academicoFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever entrevistas para TCC ou pesquisa acadêmica?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta fazer upload das gravações das suas entrevistas em qualquer formato (MP3, M4A do gravador do celular, WAV ou MP4). Nossa Inteligência Artificial transcreve as falas na íntegra com pontuação perfeita e entrega o documento pronto para Word (.DOCX) e PDF."
      }
    },
    {
      "@type": "Question",
      "name": "A transcrição é fiel à metodologia científica e pesquisa qualitativa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O modelo de IA capta as falas com alta fidelidade sem resumir ou censurar termos técnicos, preservando o vocabulário e a expressão dos participantes da pesquisa exatamente como foi falado."
      }
    },
    {
      "@type": "Question",
      "name": "Posso gerar um resumo temático das respostas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Além do texto completo na íntegra, você pode utilizar o recurso de 'Resumo com IA' para identificar os principais eixos temáticos e respostas-chave dos entrevistados em tópicos."
      }
    },
    {
      "@type": "Question",
      "name": "Como é garantido o sigilo comitê de ética (CEP)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Todos os áudios e vídeos enviados são processados sob rigoroso protocolo de sigilo e excluídos de forma permanente dos nossos servidores imediatamente após o término da transcrição, garantindo a proteção da identidade dos participantes e conformidade com as diretrizes éticas de pesquisa."
      }
    }
  ]
};

export default function TranscricaoAcademicaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(academicoFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#6EE7B7" }}>
                <GraduationCap size={15} color="#10B981" />
                Solução para Estudantes, Pesquisadores & Pós-Graduação
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrição de entrevistas para <br />
              <span style={{ background: "linear-gradient(135deg, #10B981, #06B6D4, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                TCC, Mestrado e Pesquisa em minutos
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Não perca semanas digitando entrevistas semiestruturadas e aulas gravadas. Receba o texto com <strong>pontuação completa</strong>, <strong>fidelidade às falas</strong> e exporte direto para <strong>Word (.DOCX)</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Economia média de 60h a 100h no TCC
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Exportação formatada para Word (.DOCX) e PDF
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Envie a gravação da entrevista (gravador do celular, MP3, M4A, WAV, Meet)..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Praticidade Científica
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como degravar entrevistas de pesquisa
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Envie a Gravação</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Envie o áudio gravado no gravador do celular, Google Meet, Zoom ou gravador portátil em qualquer formato.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. IA Transcreve com Rigor</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Nossa IA processa as falas com 98% de fidelidade ao vocabulário falado, aplicando pontuação gramatical e parágrafos.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Baixe em Word para Análise</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Exporte o texto pronto em <strong>.DOCX (Word)</strong> para fazer análise de conteúdo (Bardin), categorização de dados ou juntar aos anexos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ACADEMIC CHOOSES US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Feito para Aliviar o Peso da sua Pesquisa</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Foque na análise teórica e nos resultados, deixe a digitação mecânica para a IA.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <Clock size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Entregue seus Prazos com Folga</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Degravar 10 horas de entrevistas manualmente leva entre 40 a 60 horas. Com o Peguei o Texto, todo o material é transcrito no mesmo dia.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Ideal para Análise Qualitativa</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Exporte o texto limpo para softwares de análise qualitativa (como NVivo, Atlas.ti ou Word) e inicie a codificação dos dados imediatamente.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Conformidade com Comitês de Ética</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Garantia de que os dados e a voz dos sujeitos de pesquisa não são armazenados após a transcrição, respeitando o termo de consentimento (TCLE).
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
              Tire suas dúvidas
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição Acadêmica
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {academicoFaqSchema.mainEntity.map((item, idx) => (
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
            Avance seu TCC ou pesquisa hoje mesmo
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Crie sua conta gratuitamente e ganhe 5 minutos para testar a transcrição da sua primeira entrevista.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Transcrever Entrevista Grátis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
