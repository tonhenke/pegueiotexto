"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Users,
  Search,
  Filter,
  RefreshCw,
  Share2,
  Copy,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  Tv,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminAffiliate {
  id: string;
  user_id: string;
  affiliate_code: string;
  full_name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  pix_key_type: string;
  pix_key: string;
  pix_name: string;
  channel_type: string;
  channel_url: string;
  audience_range: string;
  commission_rate: number;
  balance_available: number;
  balance_pending: number;
  total_paid: number;
  status: "pending_review" | "active" | "suspended";
  created_at: string;
  clicks_count?: number;
  conversions_count?: number;
  total_revenue?: number;
}

export default function AdminAfiliadosPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [summary, setSummary] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending_review" | "active" | "suspended">("pending_review");
  const [searchTerm, setSearchTerm] = useState("");

  // Processing state
  const [processingCode, setProcessingCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchAffiliatesList = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/affiliates?action=admin_list");
      const data = await res.json();
      if (res.ok) {
        setAffiliates(data.affiliates || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error("Erro ao buscar lista de afiliados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        await fetchAffiliatesList();
      } catch (err) {
        console.error("Erro de inicialização:", err);
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleUpdateStatus = async (affiliateCode: string, newStatus: "active" | "suspended" | "pending_review") => {
    setProcessingCode(affiliateCode);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/affiliates?action=admin_update_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliate_code: affiliateCode,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionSuccess(
          newStatus === "active"
            ? `Afiliado ${affiliateCode} aprovado com sucesso! Você já pode enviar o comunicado no WhatsApp.`
            : `Status do afiliado ${affiliateCode} alterado para ${newStatus}.`
        );
        await fetchAffiliatesList();
      } else {
        alert(data.detail || "Erro ao atualizar status.");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setProcessingCode(null);
    }
  };

  const handleSendWhatsAppNotification = (aff: AdminAffiliate) => {
    // Clean phone numbers: remove all non-digits
    let cleanPhone = aff.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = `55${cleanPhone}`;
    }

    const domain = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com";
    const msg = encodeURIComponent(
      `Olá, ${aff.full_name}! Boas notícias: sua candidatura ao Programa de Afiliados do Peguei o Texto foi aprovada com sucesso! 🎉\n\nSeu código exclusivo é: ${aff.affiliate_code}\n\nAcesse o seu painel de afiliado para pegar seu link de divulgação e materiais de apoio:\n${domain}/afiliados/painel\n\nBoas vendas e seja muito bem-vindo!`
    );

    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, "_blank");
  };

  const filteredAffiliates = affiliates.filter((aff) => {
    const matchesStatus = statusFilter === "all" || aff.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      aff.full_name.toLowerCase().includes(term) ||
      aff.email.toLowerCase().includes(term) ||
      aff.affiliate_code.toLowerCase().includes(term) ||
      aff.phone.includes(term) ||
      aff.cpf_cnpj.includes(term);

    return matchesStatus && matchesSearch;
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ paddingTop: "110px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: 1180 }}>
          {/* HEADER */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <span
                  className="badge badge-purple"
                  style={{
                    marginBottom: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldCheck size={14} color="#A78BFA" /> Painel de Moderação
                </span>
                <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, margin: 0 }}>
                  Gestão do Programa de Afiliados
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
                  Avalie candidaturas, aprove parceiros e envie a notificação oficial no WhatsApp em 1 clique.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link href="/afiliados/painel" className="btn-secondary" style={{ padding: "9px 16px", fontSize: "13px", textDecoration: "none" }}>
                  Ver Painel Geral
                </Link>
                <button
                  onClick={fetchAffiliatesList}
                  disabled={loading}
                  className="btn-ghost"
                  style={{ padding: "9px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} className={loading ? "spin" : ""} /> Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* KPI CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {/* Pendentes */}
            <div
              className="glass-card"
              style={{
                padding: "20px",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                background: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.1), transparent 70%), var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#FCD34D", fontWeight: 700, textTransform: "uppercase" }}>
                  Pendentes de Análise
                </span>
                <Clock size={16} color="#FCD34D" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#FCD34D" }}>
                {summary?.pending || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Aguardando sua moderação
              </p>
            </div>

            {/* Ativos */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#6EE7B7", fontWeight: 700, textTransform: "uppercase" }}>
                  Afiliados Aprovados
                </span>
                <CheckCircle2 size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#6EE7B7" }}>
                {summary?.active || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Links ativos gerando tráfego
              </p>
            </div>

            {/* Total Cliques */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Cliques Rastreados
                </span>
                <Users size={16} color="#67E8F9" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-primary)" }}>
                {summary?.total_clicks || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Acessos únicos da rede
              </p>
            </div>

            {/* Total Vendas */}
            <div className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                  Vendas Geradas
                </span>
                <TrendingUp size={16} color="#A78BFA" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--text-primary)" }}>
                {summary?.total_conversions || 0}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                Assinaturas e pacotes pagos
              </p>
            </div>
          </div>

          {/* ACTION SUCCESS ALERT */}
          {actionSuccess && (
            <div
              style={{
                padding: "14px 18px",
                marginBottom: "24px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#6EE7B7",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>{actionSuccess}</span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setActionSuccess(null)}
                style={{ padding: "4px 8px", fontSize: "12px", color: "#6EE7B7" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* FILTER CONTROLS */}
          <div
            className="glass-card"
            style={{
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* Status Tabs */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                onClick={() => setStatusFilter("pending_review")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: statusFilter === "pending_review" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                  color: statusFilter === "pending_review" ? "#FCD34D" : "var(--text-muted)",
                  borderBottom: statusFilter === "pending_review" ? "1px solid rgba(245, 158, 11, 0.5)" : "none",
                  transition: "all 0.2s",
                }}
              >
                Pendentes ({summary?.pending || 0})
              </button>

              <button
                onClick={() => setStatusFilter("active")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: statusFilter === "active" ? "rgba(16, 185, 129, 0.2)" : "transparent",
                  color: statusFilter === "active" ? "#6EE7B7" : "var(--text-muted)",
                  borderBottom: statusFilter === "active" ? "1px solid rgba(16, 185, 129, 0.5)" : "none",
                  transition: "all 0.2s",
                }}
              >
                Aprovados ({summary?.active || 0})
              </button>

              <button
                onClick={() => setStatusFilter("all")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: statusFilter === "all" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  color: statusFilter === "all" ? "#FFFFFF" : "var(--text-muted)",
                  transition: "all 0.2s",
                }}
              >
                Todos ({summary?.total || 0})
              </button>
            </div>

            {/* Search Box */}
            <div style={{ position: "relative", minWidth: "260px" }}>
              <input
                type="text"
                className="input-base"
                placeholder="Buscar por nome, e-mail, código ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px",
                  fontSize: "13px",
                  borderRadius: "100px",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              />
              <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          {/* CANDIDATES LIST */}
          {filteredAffiliates.length === 0 ? (
            <div className="glass-card" style={{ padding: "48px 24px", textAlign: "center" }}>
              <Clock size={36} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>
                Nenhum cadastro encontrado neste filtro
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
                {statusFilter === "pending_review"
                  ? "Todas as candidaturas já foram avaliadas! Parabéns."
                  : "Nenhum parceiro corresponde aos critérios pesquisados."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredAffiliates.map((aff) => {
                const isPending = aff.status === "pending_review";
                const isActive = aff.status === "active";
                const isSuspended = aff.status === "suspended";
                const isProcessing = processingCode === aff.affiliate_code;

                return (
                  <div
                    key={aff.id}
                    className="glass-card"
                    style={{
                      padding: "24px 28px",
                      border: `1px solid ${
                        isPending
                          ? "rgba(245, 158, 11, 0.35)"
                          : isActive
                          ? "rgba(16, 185, 129, 0.35)"
                          : "var(--border-subtle)"
                      }`,
                    }}
                  >
                    {/* Top Row: Name, Status, Date */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "rgba(124, 58, 237, 0.2)",
                            color: "#A78BFA",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: 800,
                          }}
                        >
                          {aff.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ fontSize: "17px", fontWeight: 800, margin: 0 }}>{aff.full_name}</h3>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            Inscrito em {new Date(aff.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "100px",
                          background: isPending
                            ? "rgba(245, 158, 11, 0.15)"
                            : isActive
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(255, 255, 255, 0.08)",
                          color: isPending ? "#FCD34D" : isActive ? "#6EE7B7" : "var(--text-muted)",
                          border: `1px solid ${
                            isPending
                              ? "rgba(245, 158, 11, 0.4)"
                              : isActive
                              ? "rgba(16, 185, 129, 0.4)"
                              : "rgba(255, 255, 255, 0.12)"
                          }`,
                        }}
                      >
                        {isPending ? "Pendente de Moderação" : isActive ? "Afiliado Aprovado" : "Pausado / Recusado"}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "16px",
                        padding: "16px",
                        borderRadius: "10px",
                        background: "rgba(0, 0, 0, 0.2)",
                        marginBottom: "18px",
                        fontSize: "13px",
                      }}
                    >
                      {/* Channel & Audience */}
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          Canal / Plataforma
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, color: "var(--text-primary)" }}>
                          <Tv size={14} color="#67E8F9" />
                          <span style={{ textTransform: "capitalize" }}>{aff.channel_type}</span> • {aff.audience_range}
                        </div>
                        {aff.channel_url ? (
                          <a
                            href={aff.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color: "#67E8F9",
                              fontSize: "12px",
                              marginTop: "6px",
                              textDecoration: "underline",
                            }}
                          >
                            Inspecionar Canal <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>URL não informada</span>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          Contatos
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                          <Phone size={13} color="#10B981" /> {aff.phone}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                          <Mail size={13} color="#A78BFA" /> {aff.email}
                        </div>
                      </div>

                      {/* Financial / Pix */}
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          Dados Financeiros (Pix)
                        </span>
                        <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                          Chave: {aff.pix_key} ({aff.pix_key_type})
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                          Titular: {aff.pix_name} • CPF: {aff.cpf_cnpj}
                        </div>
                      </div>

                      {/* Code & Performance */}
                      <div>
                        <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                          Código & Desempenho
                        </span>
                        <div style={{ color: "var(--brand-primary)", fontWeight: 700 }}>
                          ref={aff.affiliate_code}
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                          {aff.clicks_count || 0} cliques • {aff.conversions_count || 0} vendas
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS ROW */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* WhatsApp Button (Available if active, or can be used anytime) */}
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppNotification(aff)}
                          style={{
                            padding: "9px 18px",
                            fontSize: "13px",
                            fontWeight: 700,
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "none",
                            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            color: "#FFFFFF",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <Phone size={14} /> Notificar no WhatsApp
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(aff.affiliate_code, "active")}
                            disabled={isProcessing}
                            className="btn-primary"
                            style={{
                              padding: "9px 20px",
                              fontSize: "13px",
                              fontWeight: 700,
                              background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <CheckCircle2 size={15} /> {isProcessing ? "Aprovando..." : "Aprovar Afiliado"}
                          </button>
                        )}

                        {isActive && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(aff.affiliate_code, "suspended")}
                            disabled={isProcessing}
                            className="btn-ghost"
                            style={{
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#FCA5A5",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <XCircle size={14} /> Pausar Conta
                          </button>
                        )}

                        {isSuspended && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(aff.affiliate_code, "active")}
                            disabled={isProcessing}
                            className="btn-secondary"
                            style={{
                              padding: "8px 14px",
                              fontSize: "12px",
                              color: "#6EE7B7",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <CheckCircle2 size={14} /> Reativar Afiliado
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
