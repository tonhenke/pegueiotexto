"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Calculator,
  Users,
  Award,
  HelpCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AfiliadosPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAffiliate, setIsAffiliate] = useState<boolean | null>(null);
  const [affiliateData, setAffiliateData] = useState<any>(null);

  // Calculator state
  const [proSalesCount, setProSalesCount] = useState<number>(10);
  const [businessSalesCount, setBusinessSalesCount] = useState<number>(2);

  // Form state
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");

  const [pixKeyType, setPixKeyType] = useState("cpf_cnpj");
  const [pixKey, setPixKey] = useState("");
  const [pixName, setPixName] = useState("");

  const [channelType, setChannelType] = useState("youtube");
  const [channelUrl, setChannelUrl] = useState("");
  const [audienceRange, setAudienceRange] = useState("5k_25k");
  const [desiredCode, setDesiredCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          if (!email) setEmail(user.email || "");

          // Check if already an affiliate
          const res = await fetch(`/api/affiliates?action=me&user_id=${user.id}`);
          const json = await res.json();
          if (json.is_affiliate) {
            setIsAffiliate(true);
            setAffiliateData(json.affiliate);
          } else {
            setIsAffiliate(false);
          }
        }
      } catch (err) {
        console.error("Erro ao verificar afiliado:", err);
      }
    }
    checkAuth();
  }, []);

  // Earnings calculation:
  // Pro Anual: R$ 159,00 -> 25% = R$ 39,75
  // Business Anual: R$ 679,00 -> 25% = R$ 169,75
  const commissionPro = 39.75;
  const commissionBusiness = 169.75;
  const monthlyEarnings = proSalesCount * commissionPro + businessSalesCount * commissionBusiness;
  const annualEarnings = monthlyEarnings * 12;

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!agreeTerms) {
      setFormError("Você precisa concordar com as regras e boas práticas do programa de afiliados.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !cpfCnpj.trim() || !pixKey.trim()) {
      setFormError("Por favor, preencha todos os campos obrigatórios da candidatura.");
      return;
    }

    const effectiveUserId =
      currentUser?.id ||
      (typeof window !== "undefined" && localStorage.getItem("pegueiotexto_applicant_uid")) ||
      `aff_usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (typeof window !== "undefined") {
      localStorage.setItem("pegueiotexto_applicant_uid", effectiveUserId);
    }

    // Auto-generate safe code if empty
    let safeCode = desiredCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (safeCode.length < 3) {
      safeCode = fullName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 8) + Math.floor(100 + Math.random() * 900);
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliates?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: effectiveUserId,
          full_name: fullName.trim(),
          email: (email || currentUser?.email || "").trim(),
          phone: phone.trim(),
          cpf_cnpj: cpfCnpj.trim(),
          pix_key_type: pixKeyType,
          pix_key: pixKey.trim(),
          pix_name: (pixName || fullName).trim(),
          channel_type: channelType,
          channel_url: channelUrl.trim(),
          audience_range: audienceRange,
          affiliate_code: safeCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Erro ao processar sua inscrição. Tente novamente.");
      }

      const confirmedCode = data.affiliate?.affiliate_code || safeCode;
      if (typeof window !== "undefined") {
        localStorage.setItem("my_affiliate_code", confirmedCode);
      }

      setFormSuccess(data.message || "Candidatura enviada com sucesso! Redirecionando para o seu painel...");
      setIsAffiliate(true);
      setTimeout(() => {
        window.location.href = `/afiliados/painel?code=${confirmedCode}`;
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  };

  const affiliateFaqs = [
    {
      q: "Qual é a porcentagem de comissão do programa?",
      a: "Você recebe 25% de comissão sobre qualquer venda concluída através do seu link exclusivo, tanto em pacotes avulsos quanto nas assinaturas anuais.",
    },
    {
      q: "Como e quando recebo meus pagamentos?",
      a: "Os repasses são feitos diretamente via Pix na chave cadastrada no seu perfil. O valor mínimo para solicitar resgate é de R$ 100,00 e você pode solicitar a qualquer momento assim que o saldo estiver disponível.",
    },
    {
      q: "Qual é o prazo de liberação da comissão?",
      a: "Para garantir segurança contra fraudes e respeitar o prazo de garantia e arrependimento do consumidor, as comissões permanecem em status pendente por 14 dias antes de migrarem automaticamente para saldo disponível para saque.",
    },
    {
      q: "Por quanto tempo o cookie de indicação permanece ativo?",
      a: "O cookie de rastreamento tem validade de 60 dias. Se o visitante clicar no seu link e realizar a compra em até 2 meses, a comissão é creditada a você.",
    },
    {
      q: "Como funciona o processo de aprovação de novos afiliados?",
      a: "Trabalhamos com moderação manual para preservar a qualidade da nossa rede parceira. Após enviar o formulário, nossa equipe analisa o seu canal e dados em até 24 a 48 horas úteis para ativar o seu link oficial.",
    },
    {
      q: "Posso utilizar anúncios pagos no Google ou Meta?",
      a: "Sim, tráfego pago é bem-vindo, desde que não sejam criados anúncios usando o nome exato da nossa marca como palavra-chave direta no Google Ads (proibição de bidding em termo de marca) ou promessas enganosas.",
    },
    {
      q: "Posso comprar com meu próprio link para ganhar desconto?",
      a: "Não. A autocompra é proibida pelas regras de boas práticas e resulta na suspensão do cadastro de afiliado.",
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ paddingTop: "110px", paddingBottom: "100px" }}>
        {/* HERO SECTION */}
        <section style={{ padding: "40px 0 60px", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <span
              className="badge badge-purple"
              style={{
                marginBottom: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 18px",
                fontSize: "13px",
              }}
            >
              <Award size={14} color="#A78BFA" /> Programa Oficial de Afiliados
            </span>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
                marginBottom: "20px",
              }}
            >
              Ganhe <span style={{ color: "var(--brand-primary)" }}>25% de comissão</span> promovendo a transcrição com IA mais precisa do Brasil
            </h1>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "19px",
                maxWidth: 680,
                margin: "0 auto 36px",
                lineHeight: 1.6,
              }}
            >
              Monetize sua audiência de criadores, podcasters, agências e profissionais. Receba pagamentos recorrentes direto no seu Pix com janela de atribuição de 60 dias.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href="#inscricao"
                className="btn-primary"
                style={{ padding: "14px 32px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}
              >
                Quero me tornar afiliado <ArrowRight size={18} />
              </a>

              {isAffiliate ? (
                <Link
                  href="/afiliados/painel"
                  className="btn-secondary"
                  style={{ padding: "14px 28px", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}
                >
                  Acessar meu painel <ExternalLink size={16} />
                </Link>
              ) : (
                <a
                  href="#calculadora"
                  className="btn-secondary"
                  style={{ padding: "14px 28px", fontSize: "15px", fontWeight: 600, textDecoration: "none" }}
                >
                  Calcular meus ganhos
                </a>
              )}
            </div>

            {/* Quick Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "28px",
                flexWrap: "wrap",
                marginTop: "44px",
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10B981" /> 25% em todas as vendas
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10B981" /> Cookie longo de 60 dias
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10B981" /> Pagamento rápido via Pix
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10B981" /> Painel de métricas em tempo real
              </div>
            </div>
          </div>
        </section>

        {/* 4 VALUE PILLARS */}
        <section style={{ padding: "20px 0 70px" }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              <div className="glass-card" style={{ padding: "32px 24px" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    background: "rgba(124, 58, 237, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <DollarSign size={24} color="#A78BFA" />
                </div>
                <h2 style={{ fontSize: "19px", fontWeight: 800, marginBottom: "8px" }}>
                  Comissão de 25% por venda
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Receba R$ 39,75 por cada plano Pro Anual e até R$ 169,75 por venda do plano Business Anual. Lucro alto com produto de alta demanda.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "32px 24px" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    background: "rgba(6, 182, 212, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <Clock size={24} color="#67E8F9" />
                </div>
                <h2 style={{ fontSize: "19px", fontWeight: 800, marginBottom: "8px" }}>
                  Cookie de 60 Dias
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Sua indicação fica guardada. Se a pessoa clicar no seu link e decidir assinar em até 60 dias, a comissão é creditada para você.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "32px 24px" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <Zap size={24} color="#6EE7B7" />
                </div>
                <h2 style={{ fontSize: "19px", fontWeight: 800, marginBottom: "8px" }}>
                  Repasses via Pix
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Solicite seus resgates com valor mínimo acessível de R$ 100,00. O dinheiro cai diretamente na sua chave Pix cadastrada.
                </p>
              </div>

              <div className="glass-card" style={{ padding: "32px 24px" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "12px",
                    background: "rgba(236, 72, 153, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <TrendingUp size={24} color="#F9A8D4" />
                </div>
                <h2 style={{ fontSize: "19px", fontWeight: 800, marginBottom: "8px" }}>
                  Painel Transparente
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  Acompanhe cliques em tempo real, cadastros gerados, conversões e saldo acumulado em um dashboard profissional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EARNINGS CALCULATOR */}
        <section id="calculadora" style={{ padding: "40px 0 70px" }}>
          <div className="container" style={{ maxWidth: 980 }}>
            <div
              className="glass-card"
              style={{
                padding: "44px 36px",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                background: "radial-gradient(circle at top right, rgba(124, 58, 237, 0.12), transparent 60%), var(--bg-card)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#A78BFA",
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  <Calculator size={15} /> Simule seu Potencial
                </span>
                <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Quanto você pode faturar por mês?
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: 520, margin: "8px auto 0" }}>
                  Ajuste a quantidade de assinaturas estimadas e veja a projeção da sua comissão de 25%.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "36px",
                  alignItems: "center",
                }}
              >
                {/* Sliders */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Pro Anual */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Assinaturas Pro Anual (R$ 159/ano):
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#A78BFA" }}>
                        {proSalesCount} vendas/mês
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={proSalesCount}
                      onChange={(e) => setProSalesCount(Number(e.target.value))}
                      style={{
                        width: "100%",
                        accentColor: "var(--brand-primary)",
                        cursor: "pointer",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      <span>0</span>
                      <span>50</span>
                      <span>100 vendas</span>
                    </div>
                  </div>

                  {/* Business Anual */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Assinaturas Business Anual (R$ 679/ano):
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#F9A8D4" }}>
                        {businessSalesCount} vendas/mês
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={businessSalesCount}
                      onChange={(e) => setBusinessSalesCount(Number(e.target.value))}
                      style={{
                        width: "100%",
                        accentColor: "#EC4899",
                        cursor: "pointer",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      <span>0</span>
                      <span>15</span>
                      <span>30 vendas</span>
                    </div>
                  </div>
                </div>

                {/* Earnings Result Box */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "16px",
                    padding: "28px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                    Sua comissão mensal estimada
                  </p>
                  <div
                    style={{
                      fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
                      fontWeight: 900,
                      color: "#6EE7B7",
                      margin: "8px 0",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    R$ {monthlyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 16px" }}>
                    Equivalente a <strong style={{ color: "#FFFFFF" }}>R$ {annualEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> por ano direto no seu Pix
                  </p>

                  <a
                    href="#inscricao"
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px", textDecoration: "none" }}
                  >
                    Começar a Faturar Agora <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REGISTRATION FORM SECTION */}
        <section id="inscricao" style={{ padding: "40px 0 70px" }}>
          <div className="container" style={{ maxWidth: 740 }}>
            <div
              className="glass-card"
              style={{
                padding: "40px 32px",
                border: "1px solid rgba(124, 58, 237, 0.35)",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <span className="badge badge-purple" style={{ marginBottom: "10px" }}>
                  Candidatura de Afiliado
                </span>
                <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Preencha seus dados para participar
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
                  Aprovação por moderação manual em até 24 a 48 horas úteis.
                </p>
              </div>

              {formSuccess ? (
                <div
                  style={{
                    padding: "24px",
                    borderRadius: "14px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#6EE7B7",
                    textAlign: "center",
                  }}
                >
                  <CheckCircle2 size={36} color="#10B981" style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                    Inscrição Enviada com Sucesso!
                  </h3>
                  <p style={{ fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{formSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication}>
                  {formError && (
                    <div
                      style={{
                        padding: "12px 16px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        color: "#FCA5A5",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <AlertCircle size={16} color="#EF4444" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Step indicators */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "28px",
                      borderBottom: "1px solid var(--border-subtle)",
                      paddingBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: step >= 1 ? "var(--brand-primary)" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: step >= 1 ? "var(--brand-primary)" : "rgba(255,255,255,0.06)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        1
                      </span>
                      Seus Dados
                    </div>

                    <ChevronRight size={14} color="var(--text-muted)" />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: step >= 2 ? "var(--brand-primary)" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: step >= 2 ? "var(--brand-primary)" : "rgba(255,255,255,0.06)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        2
                      </span>
                      Chave Pix
                    </div>

                    <ChevronRight size={14} color="var(--text-muted)" />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: step >= 3 ? "var(--brand-primary)" : "var(--text-muted)",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: step >= 3 ? "var(--brand-primary)" : "rgba(255,255,255,0.06)",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        3
                      </span>
                      Canal & Link
                    </div>
                  </div>

                  {/* STEP 1: PERSONAL INFO */}
                  {step === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Nome Completo / Razão Social *
                        </label>
                        <input
                          type="text"
                          className="input-base"
                          placeholder="Ex: Pedro Henrique Silva"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "rgba(13, 12, 35, 0.9)",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                            E-mail da sua conta *
                          </label>
                          <input
                            type="email"
                            className="input-base"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "8px",
                              background: "rgba(13, 12, 35, 0.9)",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              colorScheme: "dark",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                            WhatsApp com DDD *
                          </label>
                          <input
                            type="tel"
                            className="input-base"
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "8px",
                              background: "rgba(13, 12, 35, 0.9)",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              colorScheme: "dark",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          CPF ou CNPJ (para emissão e repasse) *
                        </label>
                        <input
                          type="text"
                          className="input-base"
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                          value={cpfCnpj}
                          onChange={(e) => setCpfCnpj(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "rgba(13, 12, 35, 0.9)",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          if (!fullName || !email || !phone || !cpfCnpj) {
                            setFormError("Por favor, preencha todos os campos do Passo 1.");
                            return;
                          }
                          setFormError(null);
                          setStep(2);
                        }}
                        style={{ marginTop: "12px", width: "100%", justifyContent: "center", padding: "13px" }}
                      >
                        Avançar para Dados Bancários Pix <ArrowRight size={15} />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: PIX PAYOUT INFO */}
                  {step === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Tipo de Chave Pix *
                        </label>
                        <select
                          className="input-base"
                          value={pixKeyType}
                          onChange={(e) => setPixKeyType(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "#121028",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        >
                          <option value="cpf_cnpj" style={{ background: "#121028", color: "#FFFFFF" }}>CPF ou CNPJ</option>
                          <option value="email" style={{ background: "#121028", color: "#FFFFFF" }}>E-mail</option>
                          <option value="telefone" style={{ background: "#121028", color: "#FFFFFF" }}>Telefone Celular</option>
                          <option value="aleatoria" style={{ background: "#121028", color: "#FFFFFF" }}>Chave Aleatória (EVP)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Chave Pix Exata *
                        </label>
                        <input
                          type="text"
                          className="input-base"
                          placeholder="Informe sua chave Pix"
                          value={pixKey}
                          onChange={(e) => setPixKey(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "rgba(13, 12, 35, 0.9)",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Nome do Titular da Conta Bancária *
                        </label>
                        <input
                          type="text"
                          className="input-base"
                          placeholder="Nome que aparece no comprovante bancário"
                          value={pixName}
                          onChange={(e) => setPixName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "rgba(13, 12, 35, 0.9)",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setStep(1)}
                          style={{ flex: "1", justifyContent: "center", padding: "13px" }}
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            if (!pixKey) {
                              setFormError("Por favor, preencha a sua chave Pix.");
                              return;
                            }
                            setFormError(null);
                            setStep(3);
                          }}
                          style={{ flex: "2", justifyContent: "center", padding: "13px" }}
                        >
                          Avançar para Canal & Link <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CHANNEL & CUSTOM LINK */}
                  {step === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                            Canal Principal de Divulgação *
                          </label>
                          <select
                            className="input-base"
                            value={channelType}
                            onChange={(e) => setChannelType(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "8px",
                              background: "#121028",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              colorScheme: "dark",
                            }}
                          >
                            <option value="youtube" style={{ background: "#121028", color: "#FFFFFF" }}>Canal no YouTube</option>
                            <option value="instagram" style={{ background: "#121028", color: "#FFFFFF" }}>Instagram (Reels / Stories)</option>
                            <option value="tiktok" style={{ background: "#121028", color: "#FFFFFF" }}>TikTok</option>
                            <option value="blog" style={{ background: "#121028", color: "#FFFFFF" }}>Blog / Artigos SEO</option>
                            <option value="curso" style={{ background: "#121028", color: "#FFFFFF" }}>Cursos / Comunidade</option>
                            <option value="newsletter" style={{ background: "#121028", color: "#FFFFFF" }}>Newsletter</option>
                            <option value="trafego_pago" style={{ background: "#121028", color: "#FFFFFF" }}>Tráfego Pago</option>
                            <option value="outros" style={{ background: "#121028", color: "#FFFFFF" }}>Outros</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                            Faixa de Audiência Mensal
                          </label>
                          <select
                            className="input-base"
                            value={audienceRange}
                            onChange={(e) => setAudienceRange(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "8px",
                              background: "#121028",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              colorScheme: "dark",
                            }}
                          >
                            <option value="iniciante" style={{ background: "#121028", color: "#FFFFFF" }}>Até 5.000 seguidores / visitas</option>
                            <option value="5k_25k" style={{ background: "#121028", color: "#FFFFFF" }}>5.000 a 25.000 seguidores</option>
                            <option value="25k_100k" style={{ background: "#121028", color: "#FFFFFF" }}>25.000 a 100.000 seguidores</option>
                            <option value="100k_mais" style={{ background: "#121028", color: "#FFFFFF" }}>Mais de 100.000 seguidores</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Link do seu Canal ou Perfil Principal *
                        </label>
                        <input
                          type="url"
                          className="input-base"
                          placeholder="https://youtube.com/@seucanal ou https://instagram.com/seu_perfil"
                          value={channelUrl}
                          onChange={(e) => setChannelUrl(e.target.value)}
                          required
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            background: "rgba(13, 12, 35, 0.9)",
                            color: "#FFFFFF",
                            border: "1px solid var(--border-subtle)",
                            colorScheme: "dark",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                          Código de Afiliado Desejado (Slug do seu link - opcional)
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            className="input-base"
                            placeholder="ex: seunome ou canaltech (deixe em branco para automático)"
                            value={desiredCode}
                            onChange={(e) => setDesiredCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "8px",
                              background: "rgba(13, 12, 35, 0.9)",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              colorScheme: "dark",
                            }}
                          />
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                          Seu link será: <strong style={{ color: "var(--brand-primary)" }}>pegueiotexto.com.br/?ref={desiredCode || "seucodigo"}</strong>
                        </p>
                      </div>

                      {/* Terms Acceptance */}
                      <div
                        style={{
                          padding: "14px",
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--border-subtle)",
                          marginTop: "6px",
                        }}
                      >
                        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", fontSize: "13px", color: "var(--text-secondary)" }}>
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            style={{ marginTop: "2px" }}
                          />
                          <span>
                            Concordo com os termos do programa: proibição de spam, proibição de autocompra e anúncios que violem direitos de marca. Entendo que o valor mínimo de saque é de R$ 100,00 e que as comissões passam por retenção de segurança de 14 dias.
                          </span>
                        </label>
                      </div>

                      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setStep(2)}
                          style={{ flex: "1", justifyContent: "center", padding: "13px" }}
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={submitting}
                          style={{ flex: "2", justifyContent: "center", padding: "13px", fontWeight: 700 }}
                        >
                          {submitting ? "Enviando Candidatura..." : "Concluir Inscrição de Afiliado"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ padding: "40px 0 60px" }}>
          <div className="container" style={{ maxWidth: 740 }}>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "36px",
                textAlign: "center",
              }}
            >
              Dúvidas frequentes de afiliados
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {affiliateFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: "0", cursor: "pointer", overflow: "hidden" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "15px", margin: 0 }}>{faq.q}</p>
                    <span
                      style={{
                        color: "var(--brand-primary)",
                        fontSize: "20px",
                        flexShrink: 0,
                        transition: "transform 0.2s",
                        transform: openFaq === i ? "rotate(45deg)" : "none",
                      }}
                    >
                      +
                    </span>
                  </div>
                  {openFaq === i && (
                    <div style={{ padding: "0 24px 20px", borderTop: "1px solid var(--border-subtle)" }}>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          lineHeight: "1.7",
                          marginTop: "16px",
                          margin: 0,
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
