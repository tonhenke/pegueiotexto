"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  FileText,
  CreditCard,
  RefreshCw,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PainelAfiliadosPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [conversions, setConversions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const [activeTab, setActiveTab] = useState<"extrato" | "saques" | "materiais">("extrato");

  // Payout request state
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin test approval
  const [approving, setApproving] = useState(false);

  const loadAffiliateData = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/affiliates?action=me&user_id=${userId}`);
      const data = await res.json();

      if (data.is_affiliate) {
        setAffiliate(data.affiliate);
        setMetrics(data.metrics);
        setConversions(data.conversions || []);
        setPayouts(data.payouts || []);
      } else {
        setAffiliate(null);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do afiliado:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login?redirect=/afiliados/painel";
          return;
        }

        setUser(user);
        await loadAffiliateData(user.id);
      } catch (err) {
        console.error("Erro na inicialização do painel:", err);
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleCopyLink = () => {
    if (!affiliate?.affiliate_code) return;
    const domain = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com";
    const link = `${domain}/?ref=${affiliate.affiliate_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!affiliate?.affiliate_code) return;
    const domain = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com";
    const link = `${domain}/?ref=${affiliate.affiliate_code}`;
    const msg = encodeURIComponent(
      `Conheça o Peguei o Texto! A ferramenta mais rápida para transcrever vídeos do YouTube, Instagram e TikTok com Inteligência Artificial: ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleRequestPayout = async () => {
    if (!user || !affiliate) return;
    setRequestingPayout(true);
    setPayoutMsg(null);

    try {
      const res = await fetch("/api/affiliates?action=payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          affiliate_code: affiliate.affiliate_code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Erro ao solicitar saque.");
      }

      setPayoutMsg({ type: "success", text: data.message });
      await loadAffiliateData(user.id);
    } catch (err: any) {
      setPayoutMsg({ type: "error", text: err.message });
    } finally {
      setRequestingPayout(false);
    }
  };

  const handleAdminApproveSelf = async () => {
    if (!affiliate?.affiliate_code) return;
    setApproving(true);
    try {
      const res = await fetch("/api/affiliates?action=admin_approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliate_code: affiliate.affiliate_code,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadAffiliateData(user.id);
      } else {
        alert(data.detail || "Erro ao aprovar.");
      }
    } catch (err) {
      alert("Erro ao aprovar afiliado.");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ paddingTop: "140px", textAlign: "center" }}>
          <div className="container">
            <RefreshCw size={32} className="spin" color="var(--brand-primary)" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Carregando painel de afiliado...</p>
          </div>
        </div>
      </main>
    );
  }

  // Case: User is not yet an affiliate
  if (!affiliate) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ paddingTop: "130px", paddingBottom: "100px" }}>
          <div className="container" style={{ maxWidth: 680, textAlign: "center" }}>
            <div className="glass-card" style={{ padding: "48px 32px" }}>
              <Award size={48} color="#A78BFA" style={{ margin: "0 auto 16px" }} />
              <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "12px" }}>
                Você ainda não é um afiliado
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.6, marginBottom: "28px" }}>
                Faça sua inscrição gratuita para começar a ganhar 25% de comissão por cada indicação de pacote ou plano anual do Peguei o Texto.
              </p>
              <Link href="/afiliados#inscricao" className="btn-primary" style={{ padding: "14px 28px", fontSize: "15px", textDecoration: "none" }}>
                Fazer Inscrição como Afiliado <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const domain = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com";
  const affiliateUrl = `${domain}/?ref=${affiliate.affiliate_code}`;
  const isPendingReview = affiliate.status === "pending_review";
  const minPayout = metrics?.min_payout_amount || 100.0;
  const balanceAvailable = metrics?.balance_available || 0;
  const canWithdraw = balanceAvailable >= minPayout;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ paddingTop: "110px", paddingBottom: "100px" }}>
        <div className="container">
          {/* HEADER */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span className="badge badge-purple" style={{ fontSize: "12px" }}>
                    Painel do Afiliado
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: isPendingReview ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: isPendingReview ? "#FCD34D" : "#6EE7B7",
                      border: `1px solid ${isPendingReview ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                    }}
                  >
                    {isPendingReview ? "Em Análise de Moderação" : "Afiliado Aprovado"}
                  </span>
                </div>
                <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, margin: 0 }}>
                  Olá, {affiliate.full_name}
                </h1>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Link href="/dashboard" className="btn-secondary" style={{ padding: "9px 18px", fontSize: "13px", textDecoration: "none" }}>
                  Ir ao Painel Principal
                </Link>
                <button
                  onClick={() => loadAffiliateData(user.id)}
                  className="btn-ghost"
                  style={{ padding: "9px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  title="Atualizar métricas"
                >
                  <RefreshCw size={14} /> Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* PENDING REVIEW BANNER (OPÇÃO B: MODERAÇÃO MANUAL) */}
          {isPendingReview && (
            <div
              style={{
                padding: "24px",
                borderRadius: "14px",
                background: "radial-gradient(circle at top left, rgba(245, 158, 11, 0.12), transparent 70%), var(--bg-card)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                marginBottom: "32px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={22} color="#FCD34D" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#FCD34D", marginBottom: "4px" }}>
                    Candidatura em Análise de Moderação
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 14px" }}>
                    Recebemos os seus dados cadastrais e as informações do seu canal. Nossa equipe está revisando sua inscrição (prazo de 24 a 48 horas úteis). Assim que aprovado, seu link de divulgação será ativado para rastreamento de vendas.
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                    <div>
                      Código reservado: <strong style={{ color: "#FFFFFF" }}>{affiliate.affiliate_code}</strong>
                    </div>
                    <div>
                      Chave Pix: <strong style={{ color: "#FFFFFF" }}>{affiliate.pix_key}</strong>
                    </div>
                    <div>
                      Canal: <strong style={{ color: "#FFFFFF" }}>{affiliate.channel_type}</strong>
                    </div>
                  </div>

                  {/* Admin instant approval button */}
                  <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <button
                      type="button"
                      onClick={handleAdminApproveSelf}
                      disabled={approving}
                      className="btn-secondary"
                      style={{
                        padding: "8px 16px",
                        fontSize: "12px",
                        background: "rgba(16, 185, 129, 0.15)",
                        borderColor: "rgba(16, 185, 129, 0.4)",
                        color: "#6EE7B7",
                        fontWeight: 700,
                      }}
                    >
                      {approving ? "Aprovando..." : "✦ Aprovar agora para testes (Ação de Administrador)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE AFFILIATE LINK HERO BOX */}
          <div
            className="glass-card"
            style={{
              padding: "24px 28px",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              marginBottom: "32px",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%), var(--bg-card)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: "1 1 320px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Seu Link Exclusivo de Afiliado
                </span>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 10px" }}>
                  Compartilhe este link em vídeos, redes sociais ou descrições. As compras em até 60 dias geram 25% de comissão para você.
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: "1 1 260px",
                      background: "rgba(0, 0, 0, 0.35)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "#67E8F9",
                      fontWeight: 600,
                      wordBreak: "break-all",
                    }}
                  >
                    {affiliateUrl}
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="btn-primary"
                    style={{ padding: "10px 18px", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                    {copied ? "Link Copiado!" : "Copiar Link"}
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="btn-secondary"
                    style={{ padding: "10px 18px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Share2 size={15} /> WhatsApp
                  </button>
                </div>
              </div>

              {/* Commission rate tag */}
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Sua Comissão
                </div>
                <div style={{ fontSize: "26px", fontWeight: 900, color: "#6EE7B7" }}>
                  25%
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Cookie: 60 dias
                </div>
              </div>
            </div>
          </div>

          {/* METRICS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "18px",
              marginBottom: "36px",
            }}
          >
            {/* Total Clicks */}
            <div className="glass-card" style={{ padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Cliques no Link</span>
                <Users size={16} color="#67E8F9" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>
                {metrics?.total_clicks || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Acessos únicos rastreados
              </p>
            </div>

            {/* Total Conversions */}
            <div className="glass-card" style={{ padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Vendas Concluídas</span>
                <TrendingUp size={16} color="#A78BFA" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>
                {metrics?.total_conversions || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Taxa: {metrics?.conversion_rate || 0}% de conversão
              </p>
            </div>

            {/* Saldo Disponível */}
            <div
              className="glass-card"
              style={{
                padding: "22px 20px",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 70%), var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#6EE7B7", fontWeight: 700 }}>Saldo Disponível</span>
                <DollarSign size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "#6EE7B7" }}>
                R$ {balanceAvailable.toFixed(2).replace(".", ",")}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Pronto para resgate via Pix
              </p>
            </div>

            {/* Saldo Pendente (14 dias) */}
            <div className="glass-card" style={{ padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Saldo em Garantia</span>
                <Clock size={16} color="#FCD34D" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#FCD34D" }}>
                R$ {(metrics?.balance_pending || 0).toFixed(2).replace(".", ",")}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Retenção legal de 14 dias
              </p>
            </div>

            {/* Total Já Pago */}
            <div className="glass-card" style={{ padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>Total Já Pago</span>
                <ShieldCheck size={16} color="#A78BFA" />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>
                R$ {(metrics?.total_paid || 0).toFixed(2).replace(".", ",")}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Transferido para seu Pix
              </p>
            </div>
          </div>

          {/* PAYOUT REQUEST BOX */}
          <div
            className="glass-card"
            style={{
              padding: "24px 28px",
              marginBottom: "36px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 4px" }}>
                  Solicitação de Resgate via Pix
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>
                  Chave cadastrada: <strong style={{ color: "#FFFFFF" }}>{affiliate.pix_key}</strong> ({affiliate.pix_key_type}) • Titular: {affiliate.pix_name}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Mínimo para resgate: <strong style={{ color: "#FFFFFF" }}>R$ 100,00</strong>
                  </div>
                  {!canWithdraw && (
                    <div style={{ fontSize: "11px", color: "#FCD34D", marginTop: "2px" }}>
                      Faltam R$ {(minPayout - balanceAvailable).toFixed(2).replace(".", ",")} para atingir o mínimo
                    </div>
                  )}
                </div>

                <button
                  onClick={handleRequestPayout}
                  disabled={!canWithdraw || requestingPayout || isPendingReview}
                  className="btn-primary"
                  style={{
                    padding: "11px 22px",
                    fontSize: "14px",
                    fontWeight: 700,
                    opacity: canWithdraw && !isPendingReview ? 1 : 0.5,
                    cursor: canWithdraw && !isPendingReview ? "pointer" : "not-allowed",
                  }}
                >
                  {requestingPayout ? "Solicitando..." : "Solicitar Transferência Pix"}
                </button>
              </div>
            </div>

            {payoutMsg && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  background: payoutMsg.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: payoutMsg.type === "success" ? "#6EE7B7" : "#FCA5A5",
                  border: `1px solid ${payoutMsg.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                }}
              >
                {payoutMsg.text}
              </div>
            )}
          </div>

          {/* TABS NAVIGATION */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveTab("extrato")}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeTab === "extrato" ? "var(--brand-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "extrato" ? "2px solid var(--brand-primary)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Extrato de Comissões ({conversions.length})
            </button>

            <button
              onClick={() => setActiveTab("saques")}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeTab === "saques" ? "var(--brand-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "saques" ? "2px solid var(--brand-primary)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Histórico de Saques Pix ({payouts.length})
            </button>

            <button
              onClick={() => setActiveTab("materiais")}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: activeTab === "materiais" ? "var(--brand-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "materiais" ? "2px solid var(--brand-primary)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Kit de Divulgação & Copys
            </button>
          </div>

          {/* TAB 1: COMMISSIONS TABLE */}
          {activeTab === "extrato" && (
            <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
              {conversions.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <TrendingUp size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>
                    Nenhuma conversão registrada ainda
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 440, margin: "0 auto 20px" }}>
                    Compartilhe seu link exclusivo em seus vídeos, bio do Instagram e grupos para começar a gerar vendas.
                  </p>
                  <button onClick={handleCopyLink} className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px" }}>
                    Copiar Meu Link de Afiliado
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Data</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Plano Vendido</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Valor da Venda</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Sua Comissão (25%)</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Status</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Liberação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversions.map((conv) => {
                        const isPending = conv.status === "pending";
                        const isAvailable = conv.status === "available";
                        const isPaid = conv.status === "paid";

                        return (
                          <tr key={conv.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                            <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>
                              {new Date(conv.created_at).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {conv.plan_name}
                            </td>
                            <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>
                              R$ {conv.order_amount.toFixed(2).replace(".", ",")}
                            </td>
                            <td style={{ padding: "14px 18px", fontWeight: 800, color: "#6EE7B7" }}>
                              R$ {conv.commission_amount.toFixed(2).replace(".", ",")}
                            </td>
                            <td style={{ padding: "14px 18px" }}>
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  background: isPending
                                    ? "rgba(245, 158, 11, 0.15)"
                                    : isAvailable
                                    ? "rgba(16, 185, 129, 0.15)"
                                    : "rgba(124, 58, 237, 0.15)",
                                  color: isPending ? "#FCD34D" : isAvailable ? "#6EE7B7" : "#A78BFA",
                                }}
                              >
                                {isPending ? "Garantia (14 dias)" : isAvailable ? "Disponível para Saque" : "Já Pago"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "12px" }}>
                              {conv.available_at ? new Date(conv.available_at).toLocaleDateString("pt-BR") : "Imediata"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAYOUTS HISTORY */}
          {activeTab === "saques" && (
            <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
              {payouts.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <CreditCard size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>
                    Nenhum pedido de saque registrado
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: 440, margin: "0 auto" }}>
                    Assim que seu saldo disponível atingir R$ 100,00, você poderá solicitar resgates via Pix nesta aba.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-subtle)" }}>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Data da Solicitação</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Valor (R$)</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Chave Pix de Destino</th>
                        <th style={{ padding: "14px 18px", color: "var(--text-muted)", fontWeight: 600 }}>Status do Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((pay) => (
                        <tr key={pay.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                          <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>
                            {new Date(pay.requested_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td style={{ padding: "14px 18px", fontWeight: 800, color: "#6EE7B7" }}>
                            R$ {pay.amount.toFixed(2).replace(".", ",")}
                          </td>
                          <td style={{ padding: "14px 18px", color: "var(--text-secondary)" }}>
                            {pay.pix_key} ({pay.pix_key_type})
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: "6px",
                                background: pay.status === "paid" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                color: pay.status === "paid" ? "#6EE7B7" : "#FCD34D",
                              }}
                            >
                              {pay.status === "paid" ? "Transferência Concluída" : "Processando Envio Pix"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MARKETING KIT */}
          {activeTab === "materiais" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>
                  1. Roteiro / Descrição para Vídeos do YouTube
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "14px" }}>
                  Copie e cole na descrição dos seus vídeos ou no comentário fixado:
                </p>
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "16px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                  }}
                >
{`⚡ Como transcrevo meus vídeos em segundos com Inteligência Artificial:
Conheça o Peguei o Texto! Transcreve vídeos do YouTube, Reels do Instagram e TikTok com 98% de precisão em português e gera arquivos .SRT para legendas.

👉 Teste grátis agora pelo link: ${affiliateUrl}`}
                </div>
              </div>

              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>
                  2. Chamada para Stories e Bio do Instagram
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "14px" }}>
                  Ideal para figurinha de link nos Stories ou Link na Bio:
                </p>
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "16px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                  }}
                >
{`Transforme qualquer vídeo da internet em texto em segundos com IA.
Acesse pelo link e teste com minutos grátis:
${affiliateUrl}`}
                </div>
              </div>

              <div className="glass-card" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px" }}>
                  3. Principais Argumentos de Venda para Destacar
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "12px" }}>
                  <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)" }}>
                    <strong style={{ color: "#67E8F9" }}>Precisão Máxima:</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                      98% de assertividade no português brasileiro com pontuação inteligente.
                    </p>
                  </div>
                  <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)" }}>
                    <strong style={{ color: "#A78BFA" }}>Economia Anual:</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                      Planos anuais a partir de R$ 3,74/mês com até 3 meses grátis.
                    </p>
                  </div>
                  <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.02)" }}>
                    <strong style={{ color: "#6EE7B7" }}>Pronto para Usar:</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
                      Downloads em .TXT, .SRT (Legendas) e Word (.DOCX) em 1 clique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
