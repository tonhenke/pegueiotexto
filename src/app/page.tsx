"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import {
  Shield, Zap, Globe, Lock, ChevronRight, Star,
  Play, Clock, FileText, Mic2, Sparkles, Check, ArrowRight
} from "lucide-react";

/* ── HOW IT WORKS ── */
const steps = [
  {
    number: "01",
    title: "Cole o link ou envie o arquivo",
    desc: "Suporte a YouTube, Instagram, TikTok, Vimeo, Twitter/X, Facebook e mais de 1.700 plataformas. Ou envie diretamente um arquivo de vídeo/áudio do seu computador.",
    icon: <Globe size={22} />,
    color: "#7C3AED",
  },
  {
    number: "02",
    title: "IA transcreve em segundos",
    desc: "Nosso motor de IA com Whisper Large v3 processa o áudio com altíssima precisão, mesmo com sotaque regional, múltiplos falantes e ruído de fundo.",
    icon: <Zap size={22} />,
    color: "#06B6D4",
  },
  {
    number: "03",
    title: "Baixe e pronto",
    desc: "Faça download em .TXT, .SRT (legendas) ou .DOCX. Após o download, sua mídia é automaticamente deletada dos nossos servidores.",
    icon: <Lock size={22} />,
    color: "#10B981",
  },
];

/* ── FEATURES ── */
const features = [
  {
    icon: <Globe size={20} />,
    title: "+1.700 Plataformas",
    desc: "YouTube, Instagram, TikTok, Vimeo, Twitch, Twitter/X, Facebook, LinkedIn e muito mais.",
    color: "#7C3AED",
  },
  {
    icon: <Zap size={20} />,
    title: "Transcrição em segundos",
    desc: "Processado com Whisper Large v3 via Groq LPU — muito mais rápido que GPU convencional.",
    color: "#06B6D4",
  },
  {
    icon: <Shield size={20} />,
    title: "Privacidade total",
    desc: "Sua mídia nunca fica armazenada. Deletada automaticamente logo após a transcrição.",
    color: "#10B981",
  },
  {
    icon: <FileText size={20} />,
    title: "Múltiplos formatos",
    desc: "Exporte em .TXT simples, .SRT para legendas ou .DOCX formatado para Word.",
    color: "#EC4899",
  },
  {
    icon: <Mic2 size={20} />,
    title: "PT-BR nativo",
    desc: "Otimizado para português brasileiro, com suporte a sotaques regionais e gírias.",
    color: "#F59E0B",
  },
  {
    icon: <Sparkles size={20} />,
    title: "5 min grátis",
    desc: "Teste sem cartão de crédito. 5 minutos gratuitos para novos cadastros.",
    color: "#8B5CF6",
  },
];

/* ── TESTIMONIALS ── */
const testimonials = [
  {
    name: "Juliana Ferreira",
    role: "Jornalista",
    avatar: "JF",
    text: "Uso todo dia para transcrever entrevistas. Economizo horas de trabalho. A qualidade em português é impressionante!",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Criador de Conteúdo",
    avatar: "RS",
    text: "Finalmente um serviço que funciona com Instagram Reels e TikTok. Minhas legendas ficaram incríveis.",
    stars: 5,
  },
  {
    name: "Ana Carolina",
    role: "Professora Universitária",
    avatar: "AC",
    text: "Transcrevo as minhas aulas e disponibilizo para os alunos. Rápido, preciso e o preço é justo.",
    stars: 5,
  },
];

/* ── STATS ── */
const stats = [
  { number: "98%", label: "Precisão em PT-BR" },
  { number: "< 30s", label: "Tempo médio de transcrição" },
  { number: "1.700+", label: "Plataformas suportadas" },
  { number: "100%", label: "Privacidade garantida" },
];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="hero bg-grid" style={{ paddingTop: "80px" }}>
        {/* Glow orbs */}
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <span className="badge badge-purple">
                <Sparkles size={10} />
                Whisper Large v3 · Groq LPU · 98% de precisão
              </span>
            </div>

            {/* Heading */}
            <h1 className="hero-title" style={{ marginBottom: "24px", color: "var(--text-primary)" }}>
              Cole o link.
              <br />
              <span className="text-gradient">Pegue o texto.</span>
            </h1>

            <p className="hero-subtitle" style={{ margin: "0 auto 40px" }}>
              Transcreva qualquer vídeo da internet em segundos — YouTube, Instagram, TikTok, Vimeo e mais.
              Ou faça upload do seu arquivo. Privacidade garantida: sua mídia é deletada após o download.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                <Mic2 size={18} /> Transcrever agora
              </Link>
              <Link href="/precos" className="btn-secondary" style={{ fontSize: "16px", padding: "14px 32px" }}>
                Ver planos
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
              {stats.map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p className="text-gradient" style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1, marginBottom: "4px" }}>
                    {stat.number}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Box */}
          <div style={{ maxWidth: 800, margin: "64px auto 0", position: "relative" }}>
            {/* Glow behind the demo box */}
            <div style={{
              position: "absolute",
              inset: "-30px",
              background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)",
              filter: "blur(40px)",
              zIndex: 0,
            }} />
            <div className="glass-card animate-float" style={{ position: "relative", zIndex: 1, padding: "8px" }}>
              <div style={{ background: "var(--bg-card)", borderRadius: "12px", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "0" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["#FF5F57", "#FFBD2E", "#28CA41"].map((c) => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div style={{ flex: 1, background: "var(--bg-elevated)", borderRadius: "6px", padding: "4px 12px", fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  pegueiotes.to/dashboard
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                <TranscribeForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="como-funciona" className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span className="badge badge-cyan" style={{ marginBottom: "16px" }}>
              <Play size={10} /> Como funciona
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              3 passos. É simples assim.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: 480, margin: "0 auto" }}>
              Sem instalação, sem configuração, sem complicação.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="glass-card"
                style={{
                  padding: "36px",
                  cursor: "pointer",
                  border: activeStep === i ? `1px solid ${step.color}60` : undefined,
                  boxShadow: activeStep === i ? `0 0 40px ${step.color}20` : undefined,
                }}
                onClick={() => setActiveStep(i)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div style={{
                    width: 48, height: 48,
                    background: `${step.color}18`,
                    border: `1px solid ${step.color}30`,
                    borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: step.color,
                  }}>
                    {step.icon}
                  </div>
                  <span style={{ fontSize: "3rem", fontWeight: 900, color: `${step.color}20`, letterSpacing: "-0.05em", lineHeight: 1 }}>
                    {step.number}
                  </span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.02em" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURES ═══════════════════════════ */}
      <section id="plataformas" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "16px" }}>
              <Sparkles size={10} /> Funcionalidades
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Tudo que você precisa
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: 480, margin: "0 auto" }}>
              Pensado para jornalistas, criadores de conteúdo, pesquisadores e profissionais de comunicação.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {features.map((f) => (
              <div key={f.title} className="glass-card" style={{ padding: "28px" }}>
                <div style={{
                  width: 44, height: 44,
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}25`,
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color, marginBottom: "16px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ PRIVACY BANNER ═══════════════════════════ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.06))",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "24px",
            padding: "48px",
            display: "flex",
            gap: "48px",
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: 44, height: 44, background: "rgba(16,185,129,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield size={22} color="#10B981" />
                </div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Sua privacidade em primeiro lugar
                </h2>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
                Levamos a privacidade a sério. Sua mídia nunca fica armazenada permanentemente nos nossos servidores.
                Após o download da transcrição, o arquivo é deletado automaticamente e de forma irreversível.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Conformidade com a LGPD (Lei Geral de Proteção de Dados)",
                  "Armazenamento temporário com TTL de 24h máximo",
                  "Deleção imediata após o download",
                  "Nome do arquivo criptografado com UUID aleatório",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <Check size={16} color="#10B981" style={{ marginTop: "3px", flexShrink: 0 }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 220 }}>
              {[
                { label: "Upload", value: "Criptografado", icon: "🔐" },
                { label: "Processamento", value: "Isolado", icon: "⚙️" },
                { label: "Após download", value: "Deletado", icon: "🗑️" },
                { label: "Histórico", value: "Somente texto", icon: "📄" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px",
                  background: "rgba(16,185,129,0.06)",
                  borderRadius: "10px",
                  border: "1px solid rgba(16,185,129,0.1)",
                }}>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                    <p style={{ fontSize: "14px", color: "#6EE7B7", fontWeight: 600 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-pink" style={{ marginBottom: "16px" }}>
              <Star size={10} /> Depoimentos
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Quem usa, não para
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                {/* Stars */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "20px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: 40, height: 40,
                    background: "var(--gradient-brand)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: "white",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px" }}>{t.name}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA FINAL ═══════════════════════════ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{
            background: "var(--gradient-cta)",
            borderRadius: "32px",
            padding: "80px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "white", marginBottom: "16px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                Pronto para parar de<br />perder tempo?
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "18px", marginBottom: "40px", maxWidth: 400, margin: "0 auto 40px" }}>
                Comece com 5 minutos grátis. Sem cartão de crédito.
              </p>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/dashboard" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "white", color: "#7C3AED",
                  fontWeight: 700, fontSize: "16px",
                  padding: "14px 32px", borderRadius: "100px",
                  textDecoration: "none", transition: "all 0.3s",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}>
                  <Mic2 size={18} /> Começar grátis
                </Link>
                <Link href="/precos" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.15)", color: "white",
                  fontWeight: 600, fontSize: "16px",
                  padding: "14px 32px", borderRadius: "100px",
                  textDecoration: "none", transition: "all 0.3s",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}>
                  Ver preços <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
