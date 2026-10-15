"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, Star, Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 4,90",
    minutes: "60",
    desc: "Perfeito para uso esporádico",
    color: "#06B6D4",
    features: [
      "60 minutos de transcrição",
      "Download em .TXT",
      "Suporte a +1.700 plataformas",
      "Deleção automática de mídia",
      "Validade de 6 meses",
    ],
    cta: "Comprar Starter",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 17,90",
    minutes: "300",
    desc: "Para criadores e profissionais",
    color: "#7C3AED",
    features: [
      "300 minutos de transcrição",
      "Download em .TXT, .SRT e .DOCX",
      "Suporte a +1.700 plataformas",
      "Deleção automática de mídia",
      "Histórico de 30 dias",
      "Compartilhamento de transcrições",
      "Validade de 12 meses",
    ],
    cta: "Comprar Pro",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 79,90",
    minutes: "1.000",
    desc: "Para equipes e agências",
    color: "#EC4899",
    features: [
      "1.000 minutos de transcrição",
      "Download em .TXT, .SRT e .DOCX",
      "Suporte a +1.700 plataformas",
      "Deleção automática de mídia",
      "Histórico ilimitado",
      "Compartilhamento de transcrições",
      "API de acesso (em breve)",
      "Suporte prioritário",
      "Validade de 24 meses",
    ],
    cta: "Comprar Business",
    popular: false,
  },
];

const faqs = [
  {
    q: "Como funciona a cobrança por minutos?",
    a: "Você compra um pacote de créditos (minutos). Cada transcrição deduz do seu saldo a duração do áudio, arredondando para cima. Por exemplo, um vídeo de 1min 10seg deduz 2 minutos.",
  },
  {
    q: "Os minutos expiram?",
    a: "Sim, cada pacote tem uma validade (6 a 24 meses). Créditos não utilizados dentro da validade são perdidos.",
  },
  {
    q: "Posso usar para vídeos em outros idiomas?",
    a: "Sim! O Whisper Large v3 suporta mais de 90 idiomas. O PT-BR é apenas o padrão, mas você pode transcrever em inglês, espanhol, francês e muito mais.",
  },
  {
    q: "O que acontece com meu vídeo após a transcrição?",
    a: "A mídia é deletada automaticamente dos nossos servidores assim que você faz o download da transcrição. Armazenamos apenas o texto da transcrição no seu histórico.",
  },
  {
    q: "Há algum limite de tamanho de arquivo?",
    a: "Sim. Para upload direto, o limite é 2 GB. Para links de URL, não há limite de tamanho — apenas de duração do seu saldo de créditos.",
  },
  {
    q: "Como funciona o Stripe? É seguro?",
    a: "Sim. O pagamento é processado 100% pelo Stripe, líder mundial em pagamentos online. Não armazenamos dados do seu cartão em nenhum momento.",
  },
];

export default function PrecosPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"creditos" | "payg">("creditos");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleBuyPlan = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/login?redirect=/precos&plan=${planId}`;
        return;
      }

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          email: user.email,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Falha de conexão com o servidor de pagamento.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ paddingTop: "100px" }}>

        {/* ── HERO ── */}
        <section style={{ padding: "60px 0", textAlign: "center" }}>
          <div className="container">
            <span className="badge badge-purple" style={{ marginBottom: "20px" }}>
              <Sparkles size={10} /> Preços transparentes
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px", lineHeight: 1.1 }}>
              Pague apenas pelo que usar
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: 500, margin: "0 auto 32px" }}>
              Sem assinatura mensal, sem surpresas. Compre créditos e use no seu ritmo.
            </p>

            {/* Toggle */}
            <div className="tab-list" style={{ maxWidth: 320, margin: "0 auto" }}>
              <button
                id="tab-creditos"
                className={`tab-item ${billing === "creditos" ? "active" : ""}`}
                onClick={() => setBilling("creditos")}
              >
                Pacotes
              </button>
              <button
                id="tab-payg"
                className={`tab-item ${billing === "payg" ? "active" : ""}`}
                onClick={() => setBilling("payg")}
              >
                Pay-as-you-go
              </button>
            </div>
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        {billing === "creditos" ? (
          <section style={{ padding: "0 0 80px" }}>
            <div className="container">
              {/* Free trial notice */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", marginBottom: "40px",
                padding: "12px 24px",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "100px",
                maxWidth: 480, margin: "0 auto 40px",
              }}>
                <Star size={14} color="#10B981" fill="#10B981" />
                <span style={{ fontSize: "14px", color: "#6EE7B7" }}>
                  <strong>5 minutos grátis</strong> para novos cadastros — sem cartão de crédito
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`pricing-card ${plan.popular ? "featured" : ""}`}
                    style={{ position: "relative" }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--gradient-brand)",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "4px 16px",
                        borderRadius: "100px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>
                        ✦ Mais popular
                      </div>
                    )}

                    {/* Plan header */}
                    <div style={{ marginBottom: "28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ width: 32, height: 32, background: `${plan.color}18`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Zap size={16} color={plan.color} />
                        </div>
                        <h2 style={{ fontSize: "20px", fontWeight: 800 }}>{plan.name}</h2>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{plan.desc}</p>
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: "28px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <span className="price-amount" style={{ color: plan.color }}>{plan.price}</span>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
                        Pacote com {plan.minutes} minutos
                      </p>
                    </div>

                    {/* CTA */}
                    <button
                      id={`btn-buy-${plan.id}`}
                      className={plan.popular ? "btn-primary" : "btn-secondary"}
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        marginBottom: "28px",
                        fontSize: "15px",
                        opacity: loadingPlan === plan.id ? 0.7 : 1,
                        cursor: loadingPlan ? "not-allowed" : "pointer"
                      }}
                      onClick={() => handleBuyPlan(plan.id)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === plan.id ? (
                        "Conectando ao Stripe..."
                      ) : (
                        <>{plan.cta} <ArrowRight size={15} /></>
                      )}
                    </button>

                    {/* Features */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {plan.features.map((f) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Check size={15} color={plan.color} />
                          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section style={{ padding: "0 0 80px" }}>
            <div className="container">
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div className="pricing-card" style={{ textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, background: "rgba(124,58,237,0.12)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Zap size={28} color="#A78BFA" />
                  </div>
                  <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Pay-as-you-go</h2>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Pague apenas pelo que usar, sem comprar pacote</p>
                  <div style={{ marginBottom: "32px" }}>
                    <span className="price-amount" style={{ color: "#A78BFA" }}>R$ 0,20</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "16px" }}> / minuto</span>
                  </div>
                  <button id="btn-buy-payg" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: "28px", fontSize: "15px" }}>
                    Começar sem pacote <ArrowRight size={15} />
                  </button>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                    {[
                      "Sem compra mínima",
                      "Download em .TXT, .SRT e .DOCX",
                      "Suporte a +1.700 plataformas",
                      "Pagamento via Stripe (cartão ou Pix)",
                      "Faturamento ao final de cada sessão",
                    ].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Check size={15} color="#A78BFA" />
                        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ── */}
        <section style={{ padding: "0 0 100px" }}>
          <div className="container">
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "48px", textAlign: "center" }}>
                Perguntas frequentes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    id={`faq-${i}`}
                    className="glass-card"
                    style={{ padding: "0", cursor: "pointer", overflow: "hidden" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <p style={{ fontWeight: 600, fontSize: "15px" }}>{faq.q}</p>
                      <span style={{ color: "var(--brand-primary)", fontSize: "20px", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </div>
                    {openFaq === i && (
                      <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginTop: "16px" }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
