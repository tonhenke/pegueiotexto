import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { FileCode, Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Video, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Gerador de Legendas SRT e VTT Automático com IA para Vídeos",
  description:
    "Gere arquivos de legenda .SRT e .VTT sincronizados automaticamente para qualquer vídeo da internet ou arquivo. Compatível com CapCut, Premiere, DaVinci e YouTube.",
  keywords: [
    "gerador de legendas srt",
    "criar arquivo srt online",
    "legendar video automatico",
    "gerar legendas vtt",
    "como fazer legenda srt",
    "legenda automatica com ia",
    "arquivo srt para capcut",
    "baixar legenda youtube srt",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/gerar-legendas-srt",
  },
  openGraph: {
    title: "Gerador de Legendas .SRT Automático com IA | Peguei o Texto",
    description: "Crie arquivos .SRT perfeitamente sincronizados com timestamp em segundos. Teste grátis!",
    url: "https://pegueiotexto.com.br/gerar-legendas-srt",
  },
};

const srtFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "O que é um arquivo .SRT e para que serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O formato .SRT (SubRip Subtitle) é o padrão universal para legendas em vídeo. Ele contém o texto falado acompanhado das marcações exatas de tempo (horas, minutos, segundos e milissegundos) em que cada frase deve aparecer na tela."
      }
    },
    {
      "@type": "Question",
      "name": "O arquivo .SRT é compatível com quais editores?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "É compatível com praticamente 100% dos softwares de edição, incluindo CapCut, Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, Sony Vegas e YouTube Studio."
      }
    },
    {
      "@type": "Question",
      "name": "As legendas já vêm sincronizadas com o tempo do vídeo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O modelo Whisper IA detecta milissegundo a milissegundo as pausas e inícios de cada frase, gerando marcações temporais ultraprecisas."
      }
    }
  ]
};

export default function GerarLegendasSrtPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(srtFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.35)", color: "#67E8F9" }}>
                <FileCode size={14} color="#06B6D4" />
                Gerador Profissional de Legendas .SRT & .VTT
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Gerar legendas .SRT automáticas <br />
              <span style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                sincronizadas com IA Whisper
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Envie seu vídeo ou cole o link. Receba o arquivo .SRT com timestamps milissegundo a milissegundo pronto para importar no CapCut, Premiere ou YouTube.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Timestamps com precisão de milissegundos
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Compatível com CapCut e Premiere
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos de teste grátis
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Cole o link do vídeo para extrair legendas .SRT e .VTT" />
        </div>
      </section>

      {/* COMPATIBILITY SOFTWARE SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Compatibilidade Total</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Pronto para os principais softwares de edição</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Basta arrastar o arquivo .SRT baixado diretamente para a linha do tempo do seu editor favorito.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { name: "CapCut (PC & Mobile)", desc: "Importe o arquivo de legendas com 1 clique e aplique estilos visuais e animações prontas." },
              { name: "Adobe Premiere Pro", desc: "Suporte nativo para faixas de legendas fechadas (Captions) com edição completa de fontes." },
              { name: "DaVinci Resolve", desc: "Sincronização imediata na timeline de legendas profissionais do DaVinci." },
              { name: "YouTube Studio", desc: "Suba o .SRT diretamente no gerenciador de vídeos para ativar as legendas oficiais." }
            ].map((tool, i) => (
              <div key={i} className="glass-card" style={{ padding: "28px 20px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(6, 182, 212, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Scissors size={20} color="#06B6D4" />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>{tool.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Dúvidas sobre Legendas</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Perguntas Frequentes sobre .SRT</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Qual a diferença entre .SRT e .VTT?",
                a: "Ambos contêm legendas sincronizadas. O .SRT é o formato mais antigo e amplamente suportado por editores de vídeo e reprodutores locais (como VLC). O .VTT (WebVTT) é o formato moderno otimizado para navegadores da web e HTML5."
              },
              {
                q: "As legendas já vêm quebradas em frases curtas?",
                a: "Sim! O algoritmo agrupa as falas em blocos de leitura ideais para telas de celular e monitores, evitando parágrafos gigantes na tela."
              },
              {
                q: "Preciso pagar para gerar arquivos .SRT?",
                a: "Não! Ao criar sua conta você recebe 5 minutos gratuitos para gerar e baixar arquivos .SRT sem nenhum custo."
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
              Gerar Arquivo .SRT Agora <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
