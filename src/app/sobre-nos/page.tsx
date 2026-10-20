import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Zap,
  Globe,
  Mic2,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Heart,
  Clock,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós | Peguei o Texto: Inteligência Artificial para Transcrição",
  description:
    "Conheça a história e o propósito do Peguei o Texto: a plataforma brasileira de transcrição de áudio e vídeo com IA que economiza horas de trabalho com alta precisão e privacidade total.",
  keywords: [
    "sobre o peguei o texto",
    "transcrição de audio em texto",
    "transcrever video em texto",
    "ia transcrição portugues",
    "transcrever youtube reels tiktok",
    "quem somos peguei o texto",
    "transcricao automatica com ia",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/sobre-nos",
  },
  openGraph: {
    title: "Sobre Nós | Peguei o Texto: Transcrição de Vídeos com IA",
    description:
      "Transformamos horas de áudio e vídeo em texto em poucos segundos. Saiba como o Peguei o Texto funciona e conheça nossos pilares de privacidade e precisão.",
    url: "https://pegueiotexto.com.br/sobre-nos",
  },
};

const stats = [
  { value: "+1.700", label: "Plataformas suportadas", sub: "YouTube, Reels, TikTok e mais" },
  { value: "98%", label: "Precisão em Português", sub: "Otimizado para o Brasil" },
  { value: "< 30s", label: "Tempo médio de entrega", sub: "Processamento ultra-rápido" },
  { value: "100%", label: "Privacidade e Sigilo", sub: "Zero armazenamento de mídia" },
];

const pillars = [
  {
    icon: <Mic2 size={24} />,
    color: "#7C3AED",
    title: "Português do Brasil Nativo",
    desc: "Ao contrário de ferramentas gringas que se perdem no nosso vocabulário, nossa IA compreende sotaques regionais, gírias brasileiras, termos técnicos e aplica pontuação gramatical precisa.",
  },
  {
    icon: <Lock size={24} />,
    color: "#10B981",
    title: "Privacidade e Sigilo Absoluto",
    desc: "Levamos a segurança do seu conteúdo a sério. Seus arquivos de áudio e vídeo não são salvos em bancos de dados públicos nem usados para treinar modelos terceiros: após a transcrição, a mídia é deletada.",
  },
  {
    icon: <Zap size={24} />,
    color: "#06B6D4",
    title: "Velocidade que Gera Produtividade",
    desc: "O que antes levava 2 a 3 horas de digitação manual agora é entregue em menos de 1 minuto. Você foca no aprendizado e na estratégia, nós cuidamos da transcrição mecânica.",
  },
  {
    icon: <Layers size={24} />,
    color: "#EC4899",
    title: "Formatos Prontos para Produção",
    desc: "Baixe seu conteúdo exatamente como precisa: em .TXT para leitura corrida, .SRT com marcações de tempo sincronizadas para legendas de vídeos, ou .DOCX formatado para edição no Word.",
  },
];

const audiences = [
  {
    icon: <Sparkles size={22} color="#7C3AED" />,
    title: "Criadores de Conteúdo & Videomakers",
    desc: "Gere legendas (.SRT) para Reels, TikToks e vídeos do YouTube. Transforme vídeos longos em newsletters, posts para blog e carrosséis com facilidade.",
  },
  {
    icon: <FileText size={22} color="#06B6D4" />,
    title: "Jornalistas & Pesquisadores",
    desc: "Elimine o sofrimento de desgravar entrevistas, coletivas de imprensa e depoimentos. Obtenha citações fiéis e com pontuação limpa.",
  },
  {
    icon: <Award size={22} color="#F59E0B" />,
    title: "Estudantes & Professores",
    desc: "Converta aulas gravadas, palestras, podcasts e webinars em material de apoio e resumos para estudo sem perder nenhum detalhe.",
  },
  {
    icon: <Users size={22} color="#10B981" />,
    title: "Advogados & Profissionais",
    desc: "Transcreva audiências, reuniões estratégicas, atas e áudios de clientes com a garantia de que os dados serão eliminados após a conclusão.",
  },
];

export default function SobreNosPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ paddingTop: "140px", paddingBottom: "70px", position: "relative", overflow: "hidden" }}>
        {/* Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            className="badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              marginBottom: "24px",
              borderRadius: "9999px",
              background: "rgba(124, 58, 237, 0.12)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#A78BFA",
            }}
          >
            <Sparkles size={14} /> Conheça o Peguei o Texto
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "920px",
              margin: "0 auto 24px",
            }}
          >
            Transformando áudio e vídeo em texto com{" "}
            <span className="text-gradient">precisão e inteligência</span>.
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: "760px",
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            Nascemos para acabar com o tempo perdido transcrevendo áudios e vídeos manualmente. 
            Criamos uma tecnologia brasileira, simples e acessível para você colar um link e ter o texto em mãos em segundos.
          </p>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "18px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "24px 18px",
                  borderRadius: "16px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(19, 18, 45, 0.6)",
                  backdropFilter: "blur(12px)",
                  textAlign: "center",
                }}
              >
                <div
                  className="text-gradient"
                  style={{ fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, marginBottom: "8px" }}
                >
                  {item.value}
                </div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTÓRIA E MISSÃO */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#06B6D4",
                }}
              >
                Nossa História
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginTop: "10px",
                  marginBottom: "20px",
                  lineHeight: 1.25,
                }}
              >
                Por que criamos o <span className="text-gradient">Peguei o Texto</span>?
              </h2>
              <div style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "16px" }}>
                <p>
                  Quantas vezes você já pausou um vídeo do YouTube de 1 hora dezenas de vezes para anotar o que foi dito? Ou recebeu um áudio de reunião de 40 minutos e precisou redigir uma ata às pressas?
                </p>
                <p>
                  As soluções disponíveis no mercado eram frustrantes: ou eram caras ferramentas em inglês que não entendiam gírias nem a pontuação do português brasileiro, ou exigiam a instalação de softwares complexos de linha de comando.
                </p>
                <p>
                  O <strong>Peguei o Texto</strong> foi desenvolvido para solucionar isso de forma definitiva: uma interface direta, bonita e eficiente. Você cola o link de qualquer vídeo ou envia um arquivo de áudio, clica em um botão e recebe seu texto pronto, estruturado e com opção de legendas (.SRT).
                </p>
              </div>
            </div>

            {/* Mission Box */}
            <div
              className="glass-card"
              style={{
                padding: "36px",
                borderRadius: "24px",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                background: "linear-gradient(145deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))",
                boxShadow: "0 12px 40px rgba(124, 58, 237, 0.15)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginBottom: "20px",
                }}
              >
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
                Nossa Missão
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
                Democratizar o acesso a ferramentas avançadas de inteligência artificial de fala para texto (Speech-to-Text), devolvendo tempo valioso para quem produz conhecimento, conteúdo e negócios no Brasil.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Foco absoluto na língua portuguesa (PT-BR)",
                  "Zero atrito: sem instalação, direto no navegador",
                  "Privacidade transparente e sem pegadinhas",
                  "Preço justo e minutos grátis para começar",
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-primary)" }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSOS PILARES */}
      <section style={{ padding: "80px 0", background: "rgba(14, 13, 36, 0.5)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 56px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#7C3AED",
              }}
            >
              Nossos Compromissos
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: "10px",
                marginBottom: "16px",
              }}
            >
              Os 4 pilares do <span className="text-gradient">Peguei o Texto</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              Cada detalhe da nossa plataforma foi desenhado com base em princípios claros de qualidade e respeito ao usuário.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "32px",
                  borderRadius: "20px",
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: `${pillar.color}22`,
                    border: `1px solid ${pillar.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: pillar.color,
                  }}
                >
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {pillar.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 56px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#10B981",
              }}
            >
              Casos de Uso
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginTop: "10px",
                marginBottom: "16px",
              }}
            >
              Criado para quem valoriza seu <span className="text-gradient">tempo</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              Veja como o Peguei o Texto acelera a rotina de diferentes perfis profissionais em todo o país.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {audiences.map((aud, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "28px",
                  borderRadius: "18px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(19, 18, 45, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ marginBottom: "6px" }}>{aud.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {aud.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  {aud.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.18))",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              borderRadius: "28px",
              padding: "clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              Comece a economizar horas de trabalho hoje
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto 32px",
                lineHeight: "1.7",
              }}
            >
              Crie sua conta agora e ganhe <strong>5 minutos grátis</strong> para testar a precisão e velocidade do Peguei o Texto. Sem cartão de crédito.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="/login?signup=true"
                className="btn-primary"
                style={{
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 700,
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <Sparkles size={18} /> Começar grátis agora
              </Link>
              <Link
                href="/precos"
                className="btn-secondary"
                style={{
                  padding: "14px 28px",
                  fontSize: "15px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                Ver planos e créditos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
