import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Video, FileCheck, Layers, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Converter MP4 em Texto Online Grátis com IA | Peguei o Texto",
  description:
    "Converta qualquer vídeo MP4 em texto em segundos com Inteligência Artificial. Transcrição com 98% de precisão em português, pontuação perfeita e exportação para Word (.DOCX), PDF e Legendas (.SRT). 5 minutos grátis!",
  keywords: [
    "converter mp4 em texto",
    "transcrever video mp4",
    "tirar texto de video mp4",
    "converter mp4 para word",
    "transcrever gravacao mp4",
    "extrair texto de mp4 online",
    "transcrever reuniao gravada mp4",
    "converter video mp4 em pdf",
    "gerar legendas de mp4 srt",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/converter-mp4-em-texto",
  },
  openGraph: {
    title: "Converter Vídeo MP4 em Texto Online com IA | Peguei o Texto",
    description: "Converta gravações de reuniões, videoaulas e vídeos MP4 em texto formatado em segundos com IA. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/converter-mp4-em-texto",
  },
};

const mp4FaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como converter um vídeo MP4 em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta arrastar o arquivo de vídeo MP4 do seu computador ou celular para a área de upload do Peguei o Texto. Nossa Inteligência Artificial extrai o áudio automaticamente e entrega a transcrição com pontuação completa em menos de 1 minuto."
      }
    },
    {
      "@type": "Question",
      "name": "Preciso converter o MP4 para MP3 antes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! Você pode enviar o arquivo .MP4 diretamente. O sistema processa o canal de áudio do vídeo sem que você precise perder tempo convertendo em outros programas."
      }
    },
    {
      "@type": "Question",
      "name": "Funciona com gravações de reuniões do Zoom e Google Meet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O Peguei o Texto é ideal para reuniões, webinars, aulas gravadas e videochamadas em MP4 de até várias horas de duração."
      }
    },
    {
      "@type": "Question",
      "name": "Posso gerar legendas .SRT a partir do MP4?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Além do texto em Word e PDF, você pode exportar o arquivo pronto em formato de legenda .SRT sincronizado com timestamps para aplicar no CapCut, Premiere ou YouTube."
      }
    }
  ]
};

export default function ConverterMp4EmTextoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mp4FaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.35)", color: "#67E8F9" }}>
                <Video size={14} color="#06B6D4" />
                Conversor Profissional de Vídeo MP4 para Texto
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Converter vídeo MP4 em texto <br />
              <span style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online e em segundos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Envie reuniões gravadas, videoaulas, entrevistas ou lives em MP4. Receba o texto com <strong>pontuação perfeita</strong> e exporte para <strong>Word (.DOCX)</strong>, <strong>PDF</strong> ou <strong>Legendas (.SRT)</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Não precisa converter para MP3 antes
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Exportação para Word, PDF e Legendas SRT
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Arraste seu arquivo de vídeo MP4 aqui ou selecione do computador..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#06B6D4", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Sem Instalar Programas
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como transformar seu vídeo MP4 em texto
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Video size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Envie o Vídeo MP4</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Arraste o arquivo do seu computador ou celular. Suportamos arquivos gravados por câmeras, Zoom, Meet, OBS ou celulares.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#3B82F6" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. IA Extrai e Transcreve</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Nossa IA separa a trilha de voz automaticamente e gera a transcrição com gramática, acentuação e quebras de parágrafos.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Baixe em Word ou Legendas</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Exporte seu documento formatado para <strong>Word (.DOCX)</strong>, <strong>PDF</strong>, <strong>.TXT</strong> ou arquivo <strong>.SRT</strong> para sincronizar legendas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Ideal para Reuniões, Cursos e Produção de Conteúdo</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Poupe horas de digitação manual assistindo vídeos pausando a cada frase.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <FileCheck size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Atas e Resumos de Reuniões</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Transforme gravações longas de alinhamento em atas executivas e listas de tarefas organizadas para compartilhar com o time em segundos.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <Layers size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Apostilas a partir de Videoaulas</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Professores e produtores de cursos podem transformar aulas gravadas em apostilas em PDF e e-books estruturados sem retrabalho.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Deleção Automática do Arquivo</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Seus vídeos não ficam armazenados. O arquivo é excluído dos servidores permanentemente assim que a transcrição é concluída.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#06B6D4", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              FAQ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição de MP4
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {mp4FaqSchema.mainEntity.map((item, idx) => (
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
            Transcreva seu primeiro vídeo MP4 agora
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente e receba 5 minutos grátis para testar a transcrição sem compromisso.
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
