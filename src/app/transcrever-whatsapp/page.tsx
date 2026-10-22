import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Clock, MessageSquare, Smartphone, Lock, Share2 } from "lucide-react";

const WhatsAppIcon = ({ size = 20, color = "#25D366" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcrever Áudio do WhatsApp em Texto Online Grátis com IA",
  description:
    "Converta áudios longos do WhatsApp (.opus, .ogg, .m4a) em texto legível e pontuado em segundos. Gere resumos automáticos com IA, poupe tempo e mantenha total sigilo. 5 minutos grátis!",
  keywords: [
    "transcrever audio do whatsapp",
    "como transcrever audio do whatsapp",
    "converter audio do whatsapp em texto",
    "transcrever audio whatsapp online gratis",
    "ouvir audio whatsapp em texto",
    "ler audio do whatsapp",
    "transcrever gravacao whatsapp",
    "transcrever opus em texto",
    "resumir audio whatsapp com ia",
    "transcricao de audio whatsapp pc",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcrever-whatsapp",
  },
  openGraph: {
    title: "Transcrever Áudio do WhatsApp em Texto Online com IA | Peguei o Texto",
    description: "Sem tempo para ouvir áudios longos? Converta áudios do WhatsApp em texto e resumos em segundos com Inteligência Artificial. Teste grátis!",
    url: "https://pegueiotexto.com.br/transcrever-whatsapp",
  },
};

const whatsappFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como transcrever um áudio do WhatsApp em texto?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Basta salvar o áudio do WhatsApp no seu celular ou computador (ou arrastar a mensagem de voz) e enviar no campo de upload do Peguei o Texto. Nossa Inteligência Artificial reconhece formatos nativos como .opus e .ogg e transcreve com pontuação em poucos segundos."
      }
    },
    {
      "@type": "Question",
      "name": "O Peguei o Texto suporta áudios longos de 10 ou 20 minutos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Diferente de extensões que travam em áudios longos, nossa infraestrutura processa áudios e reuniões de qualquer duração sem limite prático."
      }
    },
    {
      "@type": "Question",
      "name": "Meus áudios e conversas ficam salvos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não. Por compromisso ético e rigorosa política de privacidade, seu arquivo de áudio é processado e deletado imediatamente dos servidores após a conclusão da transcrição. Somente você tem acesso ao texto gerado."
      }
    },
    {
      "@type": "Question",
      "name": "Posso gerar um resumo automático do áudio com IA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Além da transcrição palavra por palavra, você pode clicar em 'Resumo com IA' para gerar tópicos executivos e um Plano de Ação das tarefas mencionadas no áudio."
      }
    }
  ]
};

export default function TranscreverWhatsAppPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(whatsappFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(37, 211, 102, 0.22) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(37, 211, 102, 0.15)", border: "1px solid rgba(37, 211, 102, 0.35)", color: "#86EFAC" }}>
                <WhatsAppIcon size={15} color="#25D366" />
                Transcritor de Mensagens de Voz & WhatsApp
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcrever áudio do WhatsApp <br />
              <span style={{ background: "linear-gradient(135deg, #25D366, #10B981, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                em texto em segundos com IA
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Recebeu aquele áudio de 5 ou 10 minutos e não pode ouvir agora? Faça upload do arquivo ou arraste a gravação e leia tudo com <strong>pontuação completa</strong> e <strong>resumo executivo</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Suporte nativo a .OPUS, .OGG e .M4A
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis sem cartão
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Áudio excluído imediatamente (100% sigiloso)
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Faça upload do arquivo de áudio do WhatsApp (.opus, .ogg, .m4a) ou cole um link..." />
        </div>
      </section>

      {/* HOW TO EXPORT FROM WHATSAPP SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#25D366", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Passo a Passo Simples
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Como exportar o áudio do WhatsApp em 3 passos
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Rápido e direto pelo celular ou pelo WhatsApp Web no computador.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px", border: "1px solid rgba(37, 211, 102, 0.2)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(37, 211, 102, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#25D366" }}>
                <Smartphone size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Compartilhe o Áudio</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                No WhatsApp, pressione e segure o áudio, clique em <strong>Compartilhar</strong> e escolha <em>Salvar em Arquivos</em> (iPhone) ou salve nos seus downloads (Android/WhatsApp Web).
              </p>
            </div>

            <div className="card" style={{ padding: "28px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. Envie no Peguei o Texto</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Abra o Peguei o Texto no navegador do celular ou computador, selecione o arquivo ou arraste para a área de upload e clique em <strong>Transcrever</strong>.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Leia o Texto & Resumo</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Receba a transcrição instantânea com pontuação, ouça trechos clicando nas palavras com o player sincronizado ou gere um resumo das ações em 1 clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES FOR WHATSAPP */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Por que usar o Peguei o Texto para WhatsApp?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Feito para resolver a rotina de quem lida com dezenas de mensagens de áudio diariamente.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(37, 211, 102, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#25D366" }}>
                  <Clock size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Economia Gigante de Tempo</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Lemos 3x mais rápido do que ouvimos. Um áudio de 8 minutos com pausas e repetições é lido em menos de 2 minutos, economizando horas preciosas da sua semana.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                  <Lock size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Privacidade e Sigilo Absoluto</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Diferente de bots desconhecidos de WhatsApp que leem e armazenam suas conversas para treinar modelos, nosso sistema exclui sua mídia imediatamente após a transcrição.
              </p>
            </div>

            <div className="card" style={{ padding: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Resumo & Plano de Ação</h3>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Seu cliente passou uma lista de instruções ou tarefas no áudio? Gere um Plano de Ação em tópicos automáticos para não deixar passar nenhum detalhe importante.
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
              Tire suas dúvidas
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Perguntas Frequentes sobre Transcrição de WhatsApp
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {whatsappFaqSchema.mainEntity.map((item, idx) => (
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
            Pare de perder tempo ouvindo áudios longos
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Experimente agora gratuitamente. Você ganha 5 minutos imediatamente ao se cadastrar, sem precisar cadastrar cartão de crédito.
          </p>
          <Link href="/login?signup=true" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            Começar a Transcrever Grátis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
