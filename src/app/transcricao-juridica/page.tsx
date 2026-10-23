import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Scale, ShieldCheck, Clock, FileCheck, Headphones, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Transcrição de Audiências e Degravação Jurídica com IA | Peguei o Texto",
  description:
    "Transcreva audiências judiciais, perícias e depoimentos com Inteligência Artificial em segundos. Fidelidade jurídica às falas, timestamps precisos para juntada aos autos e sigilo profissional absoluto. 5 minutos grátis!",
  keywords: [
    "transcricao de audiencias judiciais",
    "degravacao de audiencia",
    "transcrever depoimento judicial",
    "degravacao juridica com ia",
    "transcricao de audiencia trabalhista",
    "transcrever pericia judicial",
    "degravacao de audio pje midias",
    "transcricao juridica online gratis",
    "converter gravacao de audiencia em texto",
    "transcrever oitiva de testemunhas",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcricao-juridica",
  },
  openGraph: {
    title: "Transcrição de Audiências e Degravação Jurídica com IA | Peguei o Texto",
    description: "Degravação de audiências, oitivas e depoimentos em minutos para advogados e escritórios. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcricao-juridica",
  },
};

const juridicoFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como funciona a degravação de audiências judiciais com IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta fazer upload do arquivo de áudio ou vídeo da audiência (baixado do PJe Mídias, Zoom, Teams ou gravadores). A nossa Inteligência Artificial processa o conteúdo, transcreve com pontuação gramatical e gera um documento pronto para Word (.DOCX) ou PDF, permitindo copiar trechos literais para petições."
      }
    },
    {
      "@type": "Question",
      "name": "Como é garantido o sigilo profissional e a LGPD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Levamos a segurança e o sigilo profissional da advocacia com máxima seriedade. Os arquivos de áudio e vídeo são processados em servidores criptografados e automaticamente deletados de forma permanente após a transcrição. Seus arquivos não são usados para treinar modelos de terceiros."
      }
    },
    {
      "@type": "Question",
      "name": "O sistema inclui marcação de tempo (timestamps) para juntada aos autos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! A transcrição conta com player sincronizado e marcação temporal, permitindo apontar exatamente o minuto e segundo em que a testemunha ou o juiz proferiu determinada fala nos autos do processo."
      }
    },
    {
      "@type": "Question",
      "name": "Suporta audiências longas de 1 a 3 horas de duração?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O Peguei o Texto foi desenhado para lidar com arquivos pesados de audiências instrutórias e plenários de júri de longa duração sem travamentos."
      }
    }
  ]
};

export default function TranscricaoJuridicaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(juridicoFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.35)", color: "#93C5FD" }}>
                <Scale size={14} color="#60A5FA" />
                Solução Especializada para Advogados & Escritórios Jurídicos
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Degravação de audiências e <br />
              <span style={{ background: "linear-gradient(135deg, #60A5FA, #7C3AED, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                transcrição jurídica em minutos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Elimine o trabalho braçal de transcrever depoimentos e oitivas de testemunhas. Receba o texto com <strong>pontuação precisa</strong>, <strong>timestamps</strong> e exportação direta para <strong>Word (.DOCX)</strong> para colar nas suas peças.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="#10B981" /> Sigilo profissional e conformidade LGPD
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Player sincronizado para conferência rápida
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Envie a gravação da audiência (PJe Mídias, MP4, MP3, WAV, M4A)..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#60A5FA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Eficiência no Escritório
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como degravar audiências em 3 passos
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#60A5FA" }}>
                <Scale size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Envie a Gravação</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Faça upload do arquivo da audiência baixado do PJe Mídias, gravação do Zoom, Teams ou arquivo de gravador portátil.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. IA Degrava em Minutos</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Nossa IA processa o diálogo aplicando gramática jurídica, separando falas e gerando pontuação precisa automaticamente.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Junte Direto na Peça</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Exporte o texto formatado para <strong>Word (.DOCX)</strong> ou <strong>PDF</strong> com timestamps prontos para fundamentar suas petições iniciais, recursos e alegações finais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ADVOCACIA CHOOSES US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Vantagens Essenciais para a Prática Jurídica</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Desenvolvido com foco no rigor, segurança e celeridade que os prazos processuais exigem.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}>
                  <Clock size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Economia de 5x a 10x no Prazo</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Uma audiência de 1 hora que consumia quase um dia inteiro de um estagiário ou associado é degravada em menos de 3 minutos, liberando tempo nobre para tese e estratégia.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <ShieldCheck size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Privacidade e Deleção Imediata</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Respeitamos o dever de sigilo do Estatuto da Advocacia. Suas gravações de audiência são deletadas permanentemente dos servidores logo após o processamento.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <Headphones size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Conferência Rápida com Áudio Sincronizado</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Precisa verificar uma palavra controvertida no depoimento? Clique sobre o trecho na tela e o player salta imediatamente para o segundo exato da audiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#60A5FA", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Dúvidas Frequentes
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Degravação Jurídica
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {juridicoFaqSchema.mainEntity.map((item, idx) => (
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
            Modernize a degravação do seu escritório
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Experimente gratuitamente. Você ganha 5 minutos ao criar sua conta para testar em uma audiência real sem compromisso.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Degravar Primeira Audiência Grátis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
