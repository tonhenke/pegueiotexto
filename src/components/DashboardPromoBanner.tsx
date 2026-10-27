"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, Zap, Sparkles, ArrowRight, Check, Copy, Gift, 
  Share2, ShieldCheck, FileDown, CheckCircle2, Flame, Loader2 
} from "lucide-react";

interface DashboardPromoBannerProps {
  user: any;
  profile: any;
  currentPlan: string;
}

export default function DashboardPromoBanner({
  user,
  profile,
  currentPlan,
}: DashboardPromoBannerProps) {
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isExpired: boolean;
  }>({
    hours: "05",
    minutes: "00",
    seconds: "00",
    isExpired: false,
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralStats, setReferralStats] = useState<{
    total_invites: number;
    total_minutes_earned: number;
  }>({
    total_invites: 0,
    total_minutes_earned: 0,
  });

  const userId = user?.id || "";
  const referralCode = userId ? userId.slice(0, 8) : "";
  const referralUrl = typeof window !== "undefined" && referralCode
    ? `${window.location.origin}/login?ref=${referralCode}`
    : `https://pegueiotexto.com.br/login?ref=${referralCode}`;

  // 1. Check eligibility (Only users who registered without an affiliate or referral link)
  useEffect(() => {
    async function checkEligibility() {
      if (!userId) return;

      // If user is already on a paid plan, they don't need the welcome discount
      if (currentPlan && currentPlan !== "gratuito") {
        setIsEligible(false);
        return;
      }

      // Check localStorage for referral or affiliate code
      if (typeof window !== "undefined") {
        const storedRef = localStorage.getItem("pegueiotexto_ref");
        if (storedRef) {
          setIsEligible(false);
          return;
        }
      }

      // Check backend referral records to see if this user was referred by someone
      try {
        const res = await fetch(`/api/referral?user_id=${userId}`);
        const data = await res.json();
        if (data) {
          setReferralStats({
            total_invites: data.total_invites || 0,
            total_minutes_earned: data.total_minutes_earned || 0,
          });

          if (data.was_referred === true) {
            // User registered via an invite link
            setIsEligible(false);
            return;
          }
        }
      } catch (err) {
        console.error("Erro ao verificar indicação:", err);
      }

      // User registered organically/directly without invite or affiliate
      setIsEligible(true);
    }

    checkEligibility();
  }, [userId, currentPlan]);

  // 2. 5-Hour Countdown Timer based on user's registration date
  useEffect(() => {
    if (!user && !profile) return;

    // Use account created_at or fallback to profile created_at or now
    const createdAtStr = user?.created_at || profile?.created_at;
    const createdAt = createdAtStr ? new Date(createdAtStr).getTime() : Date.now();
    const durationMs = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const expiresAt = createdAt + durationMs;

    function updateCountdown() {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: "00",
          minutes: "00",
          seconds: "00",
          isExpired: true,
        });
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
          isExpired: false,
        });
      }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [user, profile]);

  const handleCheckoutDiscount = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: "pro_annual_discount",
          user_id: user?.id,
          email: user?.email,
          success_url: `${window.location.origin}/dashboard?payment=success&plan=pro_annual_discount`,
          cancel_url: `${window.location.origin}/dashboard?payment=cancelled`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.detail || "Erro ao iniciar pagamento com desconto. Tente novamente.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Erro no checkout com desconto:", err);
      alert("Falha de conexão com o servidor. Tente novamente em instantes.");
      setIsCheckingOut(false);
    }
  };

  const handleCopyReferral = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Oi! Estou usando o Peguei o Texto para transcrever vídeos e áudios com Inteligência Artificial em segundos. Crie sua conta grátis com meu link e ganhe minutos bônus imediatos: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // If user is already on a paid plan or not eligible for welcome discount
  if (isEligible === false && currentPlan && currentPlan !== "gratuito") {
    return null;
  }

  // If still checking eligibility
  if (isEligible === null) {
    return null;
  }

  // -------------------------------------------------------------
  // STATE 1: ACTIVE 25% DISCOUNT OFFER (First 5 hours)
  // -------------------------------------------------------------
  if (isEligible && !timeLeft.isExpired) {
    return (
      <div
        id="banner-oferta-relampago"
        style={{
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(124, 58, 237, 0.35)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.6), 0 0 35px rgba(124, 58, 237, 0.12)",
        }}
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "180px",
            height: "180px",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header & Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Plano Pro Anual com Desconto
              </h2>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#FBBF24",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                Apenas R$ 9,93 por mês
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(239, 68, 68, 0.18)",
                  color: "#F87171",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                }}
              >
                25% OFF
              </span>
            </div>
          </div>

          {/* Main Layout: Offer Details (Left) + Countdown Widget (Right) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
              alignItems: "center",
            }}
          >
            {/* Left Column: Pricing, Bullet Points, and CTAs */}
            <div>
              {/* Big Price Display */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "2.6rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  R$ 119,25
                </span>
                <span
                  style={{
                    fontSize: "1.15rem",
                    color: "var(--text-muted)",
                    textDecoration: "line-through",
                    fontWeight: 500,
                  }}
                >
                  R$ 159,00
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  cobrado anualmente
                </span>
              </div>

              {/* 2x2 Features Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "10px 18px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0 }} />
                  <span><strong>3.600 minutos</strong> no ano (300 min/mês)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0 }} />
                  <span>Modelo de IA <strong>Whisper ultra-rápido</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0 }} />
                  <span>Downloads em <strong>Word, PDF e Legendas .SRT</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0 }} />
                  <span><strong>Resumos e atas executivas</strong> com IA</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={handleCheckoutDiscount}
                  disabled={isCheckingOut}
                  id="btn-upgrade-desconto"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "12px",
                    padding: "13px 28px",
                    fontSize: "14.5px",
                    fontWeight: 700,
                    cursor: isCheckingOut ? "not-allowed" : "pointer",
                    boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCheckingOut) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(124, 58, 237, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCheckingOut) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(124, 58, 237, 0.4)";
                    }
                  }}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecionando para o Stripe...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Atualizar Agora com 25% OFF
                    </>
                  )}
                </button>

                <Link
                  href="/precos"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    textDecoration: "underline",
                    fontWeight: 500,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  Ver Todos os Planos
                </Link>
              </div>
            </div>

            {/* Right Column: Countdown Box (Matching the UniScribe Style) */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  textAlign: "center",
                  minWidth: "250px",
                  maxWidth: "320px",
                  width: "100%",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    marginBottom: "14px",
                  }}
                >
                  <Clock size={15} color="#A78BFA" />
                  <span>Oferta por Tempo Limitado</span>
                </div>

                {/* Digital Counter Display */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {/* Hours */}
                  <div>
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(124, 58, 237, 0.35)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono, monospace)",
                        color: "#E2E8F0",
                        minWidth: "48px",
                      }}
                    >
                      {timeLeft.hours}
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      horas
                    </span>
                  </div>

                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)", paddingBottom: "14px" }}>:</span>

                  {/* Minutes */}
                  <div>
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(124, 58, 237, 0.35)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono, monospace)",
                        color: "#E2E8F0",
                        minWidth: "48px",
                      }}
                    >
                      {timeLeft.minutes}
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      minutos
                    </span>
                  </div>

                  <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-muted)", paddingBottom: "14px" }}>:</span>

                  {/* Seconds */}
                  <div>
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(124, 58, 237, 0.35)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        fontFamily: "var(--font-mono, monospace)",
                        color: "#A78BFA",
                        minWidth: "48px",
                      }}
                    >
                      {timeLeft.seconds}
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      segundos
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--text-muted)" }}>
                  Válido nas primeiras 5 horas de cadastro
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: EXPIRED OFFER -> REFERRAL PROGRAM BANNER (Same space)
  // -------------------------------------------------------------
  return (
    <div
      id="banner-indique-e-ganhe"
      style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(15, 23, 42, 0.95) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.35)",
        borderRadius: "20px",
        padding: "26px 32px",
        marginBottom: "32px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.5), 0 0 35px rgba(16, 185, 129, 0.1)",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {/* Left: Message & Value Proposition */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#6EE7B7",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <Gift size={13} />
                Indique e Ganhe Minutos
              </span>

              {referralStats.total_invites > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "var(--text-secondary)",
                    padding: "3px 10px",
                    borderRadius: "100px",
                    fontSize: "12px",
                  }}
                >
                  +{referralStats.total_minutes_earned} min já ganhos
                </span>
              )}
            </div>

            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Ganhe Mais Tempo de Transcrição Indicando Amigos!
            </h2>

            <p
              style={{
                fontSize: "13.5px",
                color: "var(--text-secondary)",
                lineHeight: "1.5",
                margin: 0,
                maxWidth: "540px",
              }}
            >
              Compartilhe seu link exclusivo com amigos, colegas e equipes. Para cada novo cadastro realizado através do seu convite, você ganha <strong>+10 minutos bônus imediatos</strong> na sua conta e o seu amigo também ganha minutos grátis para testar!
            </p>
          </div>

          {/* Right: Quick Share & Copy Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {/* Input + Copy Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "6px 8px 6px 14px",
              }}
            >
              <input
                type="text"
                readOnly
                value={referralUrl}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono, monospace)",
                  width: "100%",
                }}
              />

              <button
                onClick={handleCopyReferral}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: copiedLink ? "#10B981" : "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? "Copiado!" : "Copiar"}</span>
              </button>
            </div>

            {/* Direct WhatsApp Share Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={handleShareWhatsApp}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  background: "#25D366",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 18px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(37, 211, 102, 0.25)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                <Share2 size={14} />
                <span>Convidar no WhatsApp</span>
              </button>

              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Sem limite de indicações
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
