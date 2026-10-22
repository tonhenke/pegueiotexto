import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Music, FileCheck, Headphones, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Converter MP3 em Texto Online Grátis com IA | Peguei o Texto",
  description:
    "Converta arquivos de áudio MP3 em texto em segundos com Inteligência Artificial. Transcrição com 98% de precisão em português, pontuação perfeita e exportação para Word (.DOCX), PDF e TXT. 5 minutos grátis!",
  keywords: [
    "converter mp3 em texto",
    "transcrever mp3 online gratis",
    "converter audio mp3 para word",
    "transformar mp3 em texto",
    "transcrever gravacao mp3",
    "transcritor de mp3 gratis",
    "converter mp3 em texto online",
    "passar mp3 para texto",
    "converter audio em docx",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/converter-mp3-em-texto",
  },
  openGraph: {
    title: "Converter Áudio MP3 em Texto Online com IA | Peguei o Texto",
    description: "Converta gravações de voz, aulas e entrevistas em MP3 para texto com pontuação perfeita em segundos. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/converter-mp3-em-texto",
  },
};

const mp3FaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como converter um arquivo MP3 em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta selecionar o seu arquivo MP3 do computador ou celular e arrastar para o Peguei o Texto. Nossa Inteligência Artificial transcreve a fala com pontuação completa e entrega o texto pronto em segundos para copiar ou baixar em Word (.DOCX), PDF e TXT."
      }
    },
    {
      "@type": "Question",
      "name": "Posso transcrever arquivos MP3 longos de mais de 1 hora?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O sistema suporta gravações de reuniões, palestras, aulas universitárias e entrevistas de qualquer duração, mantendo alta precisão e separação de parágrafos."
      }
    },
    {
      "@type": "Question",
      "name": "Quais outros formatos de áudio são suportados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Além de MP3, você pode transcrever arquivos nos formatos WAV, M4A, AAC, OGG, OPUS, WMA, FLAC e vídeos em MP4, MOV e WebM."
      }
    },
    {
      "@type": "Question",
      "name": "O serviço é seguro e mantém sigilo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim. Seu arquivo de áudio é excluído automaticamente dos nossos servidores logo após o término do processamento. Ninguém tem acesso aos seus áudios."
      }
    }
  ]
};

export default function ConverterMp3EmTextoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mp3FaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.35)", color: "#C4B5FD" }}>
                <Music size={14} color="#A78BFA" />
                Conversor Profissional de MP3 para Texto
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Converter MP3 em texto <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online e em segundos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Envie gravações de reuniões, entrevistas, aulas ou notas de voz. Receba o texto com <strong>pontuação perfeita</strong> e exporte para <strong>Word (.DOCX)</strong>, <strong>PDF</strong> ou <strong>TXT</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 98% de fidelidade em português
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Exportação direta para Word e PDF
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Arraste o arquivo MP3 aqui ou selecione do computador/celular..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simples e Sem Complicação
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como transformar seu MP3 em texto
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Headphones size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Selecione o MP3</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Escolha o áudio gravado no seu celular, gravador de voz ou computador e envie na área de upload.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. A IA Transcreve</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Em menos de 1 minuto, nosso modelo de IA converte a fala em texto, corrigindo pontuação, acentuação e parágrafos.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Exporte para Word ou PDF</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Baixe o documento formatado em <strong>.DOCX (Word)</strong>, <strong>PDF</strong> ou copie o texto puro instantaneamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Vantagens do Conversor de MP3 do Peguei o Texto</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Criado para atender demandas profissionais, acadêmicas e corporativas.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <FileCheck size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Pontuação Gramatical Perfeita</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Nada de blocos gigantes de palavras desorganizadas. O texto é gerado com pontos, vírgulas, interrogações e parágrafos lógicos prontos para leitura.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Headphones size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Player Sincronizado ao Texto</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Precisa tirar uma dúvida de uma palavra específica? Basta clicar sobre a frase no texto que o áudio pula automaticamente para aquele segundo exato.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Segurança e Sigilo de Dados</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Ideal para entrevistas de pesquisa, reuniões estratégicas e depoimentos. Seus arquivos de áudio não são armazenados após a transcrição.
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
              Dúvidas Frequentes sobre Conversão de MP3
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {mp3FaqSchema.mainEntity.map((item, idx) => (
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
            Converta seu primeiro MP3 em minutos
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente agora e receba 5 minutos para testar a ferramenta sem compromisso.
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
