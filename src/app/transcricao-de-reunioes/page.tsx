import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Briefcase, Users, ListChecks, Clock, Check, Download, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Transcrição de Reuniões e Ata Automática com IA | Peguei o Texto",
  description:
    "Transcreva reuniões do Google Meet, Zoom e Microsoft Teams em segundos. Gere atas executivas automáticas com IA, resumo dos pontos centrais e plano de ação com tarefas e prazos. 5 minutos grátis!",
  keywords: [
    "transcricao de reunioes online",
    "gerar ata de reuniao automatica com ia",
    "transcrever reuniao do google meet",
    "transcrever gravacao do zoom em texto",
    "resumo de reunioes com ia",
    "ata de reuniao com inteligencia artificial",
    "transcricao teams ata de reuniao",
    "gerador de atas de reuniao",
    "transcrever chamada de video em texto",
    "plano de acao reuniao com ia",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcricao-de-reunioes",
  },
  openGraph: {
    title: "Transcrição de Reuniões e Ata com IA | Peguei o Texto",
    description: "Nunca mais perca tempo redigindo atas manuais. Transcreva reuniões e gere planos de ação em segundos com IA. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcricao-de-reunioes",
  },
};

const reunioesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever uma gravação de reunião do Google Meet ou Zoom?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta fazer upload do arquivo de vídeo ou áudio gravado (MP4, M4A, etc.) ou colar o link compartilhado. A nossa Inteligência Artificial transcreve toda a discussão em poucos segundos com pontuação e separação lógica."
      }
    },
    {
      "@type": "Question",
      "name": "Como a IA gera a Ata de Reunião e o Plano de Ação?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Após a transcrição completa, basta clicar no botão 'Resumo com IA'. O modelo sintetiza os principais temas debatidos, as decisões acordadas e estrutura um 'Plano de Ação' com as tarefas delegadas e responsáveis citados na reunião."
      }
    },
    {
      "@type": "Question",
      "name": "Posso compartilhar a ata e o texto com a equipe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Você pode exportar para Word (.DOCX), PDF formatado, copiar com 1 clique ou gerar um link público seguro para compartilhar instantaneamente no WhatsApp, Slack ou Notion da sua equipe."
      }
    },
    {
      "@type": "Question",
      "name": "Os dados e discussões da empresa ficam protegidos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, com rigor corporativo. A gravação original de áudio/vídeo é excluída imediatamente dos nossos servidores após o processamento, mantendo o total sigilo estratégico das reuniões da sua organização."
      }
    }
  ]
};

export default function TranscricaoDeReunioesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reunioesFaqSchema) }}
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
                <Briefcase size={14} color="#A78BFA" />
                Produtividade Corporativa para Equipes & Gestores
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrição de reuniões e <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                atas executivas automáticas com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Chega de passar horas redigindo atas manuais. Envie a gravação do <strong>Meet, Zoom ou Teams</strong> e receba a fala completa, um <strong>resumo executivo</strong> e um <strong>plano de ação estruturado</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Compatível com gravações do Zoom, Meet e Teams
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Ata em tópicos e Plano de Ação automático
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis imediatos
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Envie a gravação da reunião (MP4 do Zoom, áudio do Meet, MP3, link)..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Agilidade no Dia a Dia
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Da chamada de vídeo à ata pronta em 3 etapas
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Envie a Gravação</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Suba o arquivo gravado da chamada de vídeo no formato MP4, áudio ou cole o link compartilhado.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. IA Gera a Transcrição</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                A Inteligência Artificial transcreve a conversa completa palavra por palavra, com pontuação exata e parágrafos estruturados.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <ListChecks size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Gere a Ata e Compartilhe</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Clique em <strong>Resumo com IA</strong> para extrair as decisões e o plano de ação. Exporte para Word (.DOCX) ou envie o link para o time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TEAMS CHOOSE US */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Alinhamento e Execução em Alto Nível</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Garanta que nenhuma decisão ou tarefa acordada em reunião caia no esquecimento.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <ListChecks size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Plano de Ação Inteligente</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Nossa IA extrai os compromissos assumidos por cada pessoa durante a reunião e cria uma lista de afazeres clara e acionável.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Share2 size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Compartilhamento Instantâneo</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Envie o resumo executivo para o grupo do WhatsApp, canal do Slack ou cole direto no Notion sem precisar formatar nada.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                  <Shield size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Segurança e Sigilo Estratégico</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Reuniões de diretoria e alinhamentos confidenciais protegidos. Seus arquivos não ficam salvos nos servidores após o término do processamento.
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
              Perguntas Frequentes
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Dúvidas sobre Transcrição e Atas de Reunião
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reunioesFaqSchema.mainEntity.map((item, idx) => (
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
            Crie sua próxima ata de reunião em segundos
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Cadastre-se gratuitamente e receba 5 minutos para testar a transcrição da sua equipe agora mesmo.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Gerar Ata Grátis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
