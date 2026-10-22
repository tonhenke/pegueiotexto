"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, Star, Sparkles, ArrowRight, ShieldCheck, Clock, Crown, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const freePlan = {
  id: "free",
  name: "Gratuito",
  displayPrice: "R$ 0",
  displayPeriod: "/ grátis",
  billingDetail: "Gratuito para sempre",
  installment: "Sem necessidade de cartão",
  savings: "Sem cartão",
  minutes: "5 min para começar",
  desc: "Ideal para testar a qualidade e transcrever seus primeiros vídeos",
  color: "#10B981",
  features: [
    "5 minutos grátis imediatos no cadastro",
    "Suporte a YouTube, Instagram, TikTok e +1.700 sites",
    "Transcrição de alta precisão com Inteligência Artificial",
    "Download do texto em arquivo .TXT",
    "Player de áudio sincronizado com timestamps",
    "Ganhe +10 min para cada amigo convidado",
    "Sem necessidade de cartão de crédito",
    "Deleção automática da mídia com privacidade",
  ],
  cta: "Iniciar Gratuitamente",
  popular: false,
  isFree: true,
};

const packages = [
  {
    id: "starter",
    name: "Starter",
    displayPrice: "R$ 4,90",
    displayPeriod: "pagamento único",
    billingDetail: "Apenas R$ 0,08 por minuto",
    installment: "Sem cobranças recorrentes",
    savings: null,
    minutes: "60 minutos",
    desc: "Perfeito para uso esporádico e testes rápidos",
    color: "#06B6D4",
    features: [
      "60 minutos de transcrição com IA",
      "Download em arquivo de texto puro (.TXT)",
      "Suporte a +1.700 plataformas e links",
      "Deleção automática da mídia com privacidade",
      "Validade de 6 meses para consumir",
    ],
    cta: "Comprar Starter",
    popular: false,
    isFree: false,
  },
  {
    id: "pro",
    name: "Pro",
    displayPrice: "R$ 17,90",
    displayPeriod: "pagamento único",
    billingDetail: "Apenas R$ 0,05 por minuto",
    installment: "Sem cobranças recorrentes",
    savings: "Mais procurado",
    minutes: "300 minutos",
    desc: "Para criadores, editores e profissionais de conteúdo",
    color: "#7C3AED",
    features: [
      "300 minutos de transcrição com IA",
      "Download em .TXT, .SRT (Legendas) e .DOCX (Word)",
      "Exportação de documento PDF formatado",
      "Síntese e resumos executivos com IA inclusos",
      "Player de áudio sincronizado com timestamps",
      "Compartilhamento público de leitura (WhatsApp/Notion)",
      "Suporte a +1.700 plataformas e links",
      "Validade de 12 meses para consumir",
    ],
    cta: "Comprar Pro",
    popular: true,
    isFree: false,
  },
  {
    id: "business",
    name: "Business",
    displayPrice: "R$ 79,90",
    displayPeriod: "pagamento único",
    billingDetail: "Apenas R$ 0,07 por minuto",
    installment: "Sem cobranças recorrentes",
    savings: null,
    minutes: "1.000 minutos",
    desc: "Para equipes, agências e alto volume de transcrição",
    color: "#EC4899",
    features: [
      "1.000 minutos de transcrição com IA",
      "Download em todos os formatos (.DOCX, .PDF, .SRT, .TXT)",
      "Síntese e resumos executivos com IA ilimitados",
      "Player de áudio sincronizado com timestamps",
      "Compartilhamento público de leitura",
      "Histórico permanente ilimitado",
      "Suporte prioritário via WhatsApp e e-mail",
      "Validade de 24 meses para consumir",
    ],
    cta: "Comprar Business",
    popular: false,
    isFree: false,
  },
];

const annualSubscriptions = [
  {
    id: "starter_annual",
    name: "Starter Anual",
    displayPrice: "R$ 3,74",
    displayPeriod: "/ mês",
    billingDetail: "R$ 44,90 faturados ao ano",
    installment: "ou 12x de R$ 4,49 no cartão",
    savings: "Economize R$ 13,90 (3 meses grátis)",
    minutes: "720 min / ano (60 min/mês)",
    desc: "Transcreva todo mês com a máxima economia anual",
    color: "#06B6D4",
    features: [
      "720 minutos no ano (60 min/mês)",
      "Economia direta de R$ 13,90 no ano",
      "Download em arquivo de texto puro (.TXT)",
      "Suporte a +1.700 plataformas e links",
      "Deleção automática da mídia com privacidade",
      "Acesso garantido durante todo o ano",
    ],
    cta: "Assinar Starter Anual",
    popular: false,
    isFree: false,
  },
  {
    id: "pro_annual",
    name: "Pro Anual",
    displayPrice: "R$ 13,25",
    displayPeriod: "/ mês",
    billingDetail: "R$ 159,00 faturados ao ano",
    installment: "ou 12x de R$ 15,90 no cartão",
    savings: "Economize R$ 55,80 (3 meses grátis)",
    minutes: "3.600 min / ano (300 min/mês)",
    desc: "O plano favorito dos criadores de conteúdo e editores",
    color: "#7C3AED",
    features: [
      "3.600 minutos no ano (300 min/mês)",
      "Super economia de R$ 55,80 no ano",
      "Download em .TXT, .SRT (Legendas), .DOCX e .PDF",
      "Síntese e resumos executivos com IA inclusos",
      "Player de áudio sincronizado com timestamps",
      "Compartilhamento público de leitura",
      "Histórico completo durante o ano todo",
      "Prioridade máxima na fila de processamento",
    ],
    cta: "Assinar Pro Anual",
    popular: true,
    isFree: false,
  },
  {
    id: "business_annual",
    name: "Business Anual",
    displayPrice: "R$ 56,58",
    displayPeriod: "/ mês",
    billingDetail: "R$ 679,00 faturados ao ano",
    installment: "ou 12x de R$ 67,90 no cartão",
    savings: "Economize R$ 279,80 (3 meses grátis)",
    minutes: "12.000 min / ano (1.000 min/mês)",
    desc: "A solução completa para empresas, produtoras e agências",
    color: "#EC4899",
    features: [
      "12.000 minutos no ano (1.000 min/mês)",
      "Mega economia de R$ 279,80 no ano",
      "Download em todos os formatos (.DOCX, .PDF, .SRT, .TXT)",
      "Resumos e sínteses com IA ilimitados",
      "Player de áudio sincronizado com timestamps",
      "Compartilhamento público de leitura",
      "Histórico permanente ilimitado",
      "Suporte VIP dedicado via WhatsApp 24/7",
    ],
    cta: "Assinar Business Anual",
    popular: false,
    isFree: false,
  },
];

const faqs = [
  {
    q: "O que está incluso no plano gratuito?",
    a: "Ao criar sua conta, você recebe 5 minutos grátis automaticamente para testar qualquer transcrição de vídeo ou áudio, sem precisar cadastrar cartão de crédito. Além disso, pelo nosso programa de indicação, você ganha mais 10 minutos a cada amigo que criar conta com o seu link.",
  },
  {
    q: "Como funciona a assinatura anual com desconto?",
    a: "Na assinatura anual você realiza um pagamento único com desconto de até 30% (equivalente a 3 meses grátis) e recebe sua cota anual completa liberada na sua conta para utilizar ao longo de 12 meses.",
  },
  {
    q: "Posso parcelar o plano anual?",
    a: "Sim! Você pode parcelar o valor anual em até 12 vezes no cartão de crédito através do processador seguro Stripe.",
  },
  {
    q: "Como funciona a cobrança por minutos?",
    a: "Cada transcrição deduz do seu saldo a duração real do áudio arredondada para cima. Por exemplo, um áudio de 2 minutos e 15 segundos consome 3 minutos do seu saldo.",
  },
  {
    q: "Os minutos expiram?",
    a: "Nos pacotes avulsos, a validade varia de 6 a 24 meses. Na assinatura anual, você conta com 12 meses de acesso contínuo com minutos garantidos.",
  },
  {
    q: "Posso transcrever áudios em outros idiomas?",
    a: "Sim! Nossa Inteligência Artificial suporta mais de 90 idiomas. O português brasileiro é o padrão com precisão máxima, mas você também pode transcrever inglês, espanhol e outros.",
  },
  {
    q: "O que acontece com meu arquivo de vídeo após a transcrição?",
    a: "Por compromisso rigoroso com a sua privacidade, todo arquivo de áudio ou vídeo é permanentemente excluído dos nossos servidores logo após a transcrição. Apenas o texto transcrito fica salvo no seu histórico protegido.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. O pagamento é processado integralmente pelo Stripe, líder global em segurança bancária digital. Não armazenamos os dados do seu cartão.",
  },
];

export default function PrecosPage() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const activePlans = [freePlan, ...(billingCycle === "annual" ? annualSubscriptions : packages)];

  const handleFreePlan = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login?signup=true";
      }
    } catch {
      window.location.href = "/login?signup=true";
    }
  };

  const handleBuyPlan = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/login?redirect=/precos&plan=${planId}`;
        return;
      }

      const refCode = typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_ref") : null;

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          email: user.email,
          affiliate_code: refCode,
          success_url: `${window.location.origin}/dashboard?payment=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/precos?payment=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.detail || "Erro ao iniciar pagamento. Tente novamente.");
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

        {/* HERO */}
        <section style={{ padding: "60px 0 30px", textAlign: "center" }}>
          <div className="container">
            <span className="badge badge-purple" style={{ marginBottom: "20px" }}>
              <Sparkles size={10} /> Preços justos e transparentes
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "16px", lineHeight: 1.1 }}>
              Escolha o plano ideal para você
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "18px", maxWidth: 580, margin: "0 auto 32px" }}>
              Transcreva com máxima precisão em português. Comece gratuitamente, assine com até 3 meses grátis ou compre pacotes avulsos sob demanda.
            </p>

            {/* BILLING CYCLE TOGGLE */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              borderRadius: "100px",
              padding: "6px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)"
            }}>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 22px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: billingCycle === "annual" ? "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)" : "transparent",
                  color: billingCycle === "annual" ? "#FFFFFF" : "var(--text-secondary)",
                  boxShadow: billingCycle === "annual" ? "0 4px 14px rgba(124, 58, 237, 0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span>Assinatura Anual</span>
                <span style={{
                  fontSize: "10px",
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#6EE7B7",
                  border: "1px solid rgba(16, 185, 129, 0.45)",
                  borderRadius: "100px",
                  padding: "2px 8px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}>
                  3 meses grátis
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 22px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: billingCycle === "monthly" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                  color: billingCycle === "monthly" ? "#FFFFFF" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <span>Pacotes Avulsos</span>
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="container" style={{ maxWidth: 1320 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
              paddingTop: "24px",
            }}>
              {activePlans.map((plan: any) => (
                <div
                  key={plan.id}
                  className={`pricing-card ${plan.popular ? "featured" : ""}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "5px 18px",
                      borderRadius: "100px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 16px rgba(124, 58, 237, 0.55)",
                      zIndex: 20,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}>
                      <Sparkles size={11} /> Mais popular
                    </div>
                  )}

                  <div>
                    {/* Plan header */}
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{ width: 34, height: 34, background: `${plan.color}18`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {plan.id === "free" ? (
                            <Sparkles size={18} color={plan.color} />
                          ) : plan.id.includes("business") ? (
                            <Crown size={18} color={plan.color} />
                          ) : plan.id.includes("pro") ? (
                            <Flame size={18} color={plan.color} />
                          ) : (
                            <Zap size={18} color={plan.color} />
                          )}
                        </div>
                        <h2 style={{ fontSize: "20px", fontWeight: 800 }}>{plan.name}</h2>
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "13px", minHeight: "36px", lineHeight: "1.4" }}>{plan.desc}</p>
                    </div>

                    {/* Savings tag */}
                    <div style={{ minHeight: "28px", marginBottom: "10px" }}>
                      {plan.savings && (
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.12)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          color: "#6EE7B7",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}>
                          {plan.savings}
                        </div>
                      )}
                    </div>

                    {/* Price - Monthly Highlighted */}
                    <div style={{ marginBottom: "22px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          className="price-amount"
                          style={{
                            color: plan.color,
                            fontSize: "2.35rem",
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            display: "inline-flex",
                            alignItems: "baseline",
                            lineHeight: 1,
                          }}
                        >
                          <span style={{ fontSize: "1.25rem", fontWeight: 700, marginRight: "4px", opacity: 0.9 }}>
                            R$
                          </span>
                          <span>{plan.displayPrice.replace("R$", "").trim()}</span>
                        </span>
                        <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>
                          {plan.displayPeriod}
                        </span>
                      </div>

                      {/* Lower weight details box */}
                      <div style={{
                        marginTop: "8px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        minHeight: "48px",
                        justifyContent: "center",
                      }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
                          {plan.billingDetail}
                        </span>
                        {plan.installment && (
                          <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 500 }}>
                            {plan.installment}
                          </span>
                        )}
                      </div>

                      <p style={{
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        fontWeight: 700,
                        marginTop: "10px",
                        marginBottom: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: `${plan.color}12`,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: `1px solid ${plan.color}25`,
                      }}>
                        <Clock size={14} color={plan.color} /> {plan.minutes}
                      </p>
                    </div>

                    {/* Features list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "26px" }}>
                      {plan.features.map((f: string) => (
                        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                          <Check size={16} color={plan.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.45 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id={`btn-plan-${plan.id}`}
                    className={plan.popular ? "btn-primary" : "btn-secondary"}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "14px",
                      fontSize: "14px",
                      fontWeight: 700,
                      opacity: loadingPlan === plan.id ? 0.7 : 1,
                      cursor: loadingPlan ? "not-allowed" : "pointer",
                      ...(plan.isFree ? {
                        background: "rgba(16, 185, 129, 0.12)",
                        borderColor: "rgba(16, 185, 129, 0.4)",
                        color: "#6EE7B7",
                      } : {}),
                    }}
                    onClick={() => plan.isFree ? handleFreePlan() : handleBuyPlan(plan.id)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === plan.id ? (
                      "Conectando ao Stripe..."
                    ) : (
                      <>{plan.cta} <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 0 100px" }}>
          <div className="container">
            <div style={{ maxWidth: 740, margin: "0 auto" }}>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "40px", textAlign: "center" }}>
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
                      <p style={{ fontWeight: 600, fontSize: "15px", margin: 0 }}>{faq.q}</p>
                      <span style={{ color: "var(--brand-primary)", fontSize: "20px", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                    </div>
                    {openFaq === i && (
                      <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginTop: "16px", margin: 0 }}>{faq.a}</p>
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
