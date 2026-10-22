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
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  Tv,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

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
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("tonhenke@gmail.com");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("tonhenke@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [loading, setLoading] = useState(false);
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [summary, setSummary] = useState<any>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending_review" | "active" | "suspended">("pending_review");
  const [searchTerm, setSearchTerm] = useState("");

  // Processing state
  const [processingCode, setProcessingCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [lastApprovedAffiliate, setLastApprovedAffiliate] = useState<AdminAffiliate | null>(null);

  const getAdminToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("affiliate_admin_token");
    }
    return null;
  };

  const fetchAffiliatesList = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      const res = await fetch("/api/affiliates?action=admin_list", {
        headers: {
          ...(token ? { "x-admin-token": token } : {}),
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("affiliate_admin_token");
        }
        return;
      }

      const data = await res.json();
      if (res.ok) {
        let serverAffiliates: AdminAffiliate[] = data.affiliates || [];

        // Fallback to locally cached list if server returned empty (safety net for serverless restarts)
        if (serverAffiliates.length === 0 && typeof window !== "undefined") {
          try {
            const cached = localStorage.getItem("admin_cached_affiliates_list");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                serverAffiliates = parsed;
              }
            }
          } catch {}
        }

        // Apply any status overrides stored locally
        if (typeof window !== "undefined") {
          try {
            const rawOverrides = localStorage.getItem("admin_affiliates_status_overrides");
            if (rawOverrides) {
              const overrides = JSON.parse(rawOverrides);
              serverAffiliates = serverAffiliates.map((aff) => {
                if (overrides[aff.affiliate_code]) {
                  return { ...aff, status: overrides[aff.affiliate_code] };
                }
                return aff;
              });
            }
            // Save current enriched list to cache
            if (serverAffiliates.length > 0) {
              localStorage.setItem("admin_cached_affiliates_list", JSON.stringify(serverAffiliates));
            }
          } catch {}
        }

        setAffiliates(serverAffiliates);

        // Recalculate summary from serverAffiliates so badges and filters match 100%
        const pendingCount = serverAffiliates.filter((a) => a.status === "pending_review").length;
        const activeCount = serverAffiliates.filter((a) => a.status === "active").length;
        const suspendedCount = serverAffiliates.filter((a) => a.status === "suspended").length;

        // If there are no pending reviews but there are active affiliates, switch to active tab
        if (pendingCount === 0 && activeCount > 0 && statusFilter === "pending_review") {
          setStatusFilter("active");
        }

        setSummary({
          total: serverAffiliates.length,
          pending: pendingCount,
          active: activeCount,
          suspended: suspendedCount,
          total_clicks: data.summary?.total_clicks || 0,
          total_conversions: data.summary?.total_conversions || 0,
          total_payouts_paid: data.summary?.total_payouts_paid || 0,
        });
      }
    } catch (err) {
      console.error("Erro ao buscar lista de afiliados:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial authentication check
  useEffect(() => {
    async function checkAuth() {
      try {
        setCheckingAuth(true);
        const token = getAdminToken();
        const res = await fetch("/api/affiliates?action=admin_check_auth", {
          headers: {
            ...(token ? { "x-admin-token": token } : {}),
          },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (data.email) setAdminEmail(data.email);
          await fetchAffiliatesList();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Erro ao validar sessão:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Informe o e-mail e a senha de administrador.");
      return;
    }

    setLoginLoading(true);

    try {
      const res = await fetch("/api/affiliates?action=admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("affiliate_admin_token", data.token);
        }
        setIsAuthenticated(true);
        setAdminEmail(data.email || loginEmail);
        setLoginPassword("");
        await fetchAffiliatesList();
      } else {
        setLoginError(data.detail || "E-mail ou senha de administrador incorretos.");
      }
    } catch (err) {
      setLoginError("Erro de conexão ao servidor. Tente novamente.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/affiliates?action=admin_logout", { method: "POST" });
    } catch {}

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("affiliate_admin_token");
    }

    setIsAuthenticated(false);
    setAffiliates([]);
    setSummary(null);
  };

  const handleUpdateStatus = async (affiliateCode: string, newStatus: "active" | "suspended" | "pending_review") => {
    setProcessingCode(affiliateCode);
    setActionSuccess(null);

    // 1. Optimistic UI update: update state immediately so the admin sees the change in 0ms
    const targetAff = affiliates.find((a) => a.affiliate_code === affiliateCode);
    if (targetAff) {
      const updatedAff: AdminAffiliate = { ...targetAff, status: newStatus };
      setLastApprovedAffiliate(updatedAff);

      setAffiliates((prev) =>
        prev.map((a) => (a.affiliate_code === affiliateCode ? updatedAff : a))
      );

      setSummary((prev: any) => {
        if (!prev) return prev;
        const wasPending = targetAff.status === "pending_review";
        const wasActive = targetAff.status === "active";
        return {
          ...prev,
          pending: wasPending && newStatus !== "pending_review" ? Math.max(0, prev.pending - 1) : prev.pending,
          active: newStatus === "active" ? (wasActive ? prev.active : prev.active + 1) : (wasActive ? Math.max(0, prev.active - 1) : prev.active),
        };
      });
    }

    // Save status override to localStorage for rock-solid persistence across reloads
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("admin_affiliates_status_overrides") || "{}";
        const overrides = JSON.parse(raw);
        overrides[affiliateCode] = newStatus;
        localStorage.setItem("admin_affiliates_status_overrides", JSON.stringify(overrides));
      } catch {}
    }

    // Auto-switch filter tab so approved affiliate is immediately visible
    if (newStatus === "active") {
      setStatusFilter("active");
    }

    setActionSuccess(
      newStatus === "active"
        ? `Afiliado ${affiliateCode} aprovado com sucesso! Você já pode enviar o comunicado no WhatsApp.`
        : `Status do afiliado ${affiliateCode} alterado para ${newStatus}.`
    );

    // 2. Call server API
    try {
      const token = getAdminToken();
      const res = await fetch("/api/affiliates?action=admin_update_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({
          affiliate_code: affiliateCode,
          status: newStatus,
        }),
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        alert("Sessão expirada. Faça login novamente.");
        return;
      }

      // Re-fetch list to sync all metrics from backend
      await fetchAffiliatesList();
    } catch (err) {
      console.warn("Aviso ao sincronizar atualização de status com o servidor:", err);
    } finally {
      setProcessingCode(null);
    }
  };

  const handleSendWhatsAppNotification = (aff: AdminAffiliate) => {
    let cleanPhone = aff.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = `55${cleanPhone}`;
    }

    const domain = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com.br";
    const activationUrl = `${domain}/afiliados/ativar?codigo=${aff.affiliate_code}`;
    const msg = encodeURIComponent(
      `Olá, ${aff.full_name}! Boas notícias: sua candidatura ao Programa de Afiliados do Peguei o Texto foi aprovada com sucesso! 🎉\n\n` +
      `Para ativar sua conta e acessar seu painel exclusivo, crie sua senha de acesso no link abaixo:\n` +
      `👉 ${activationUrl}\n\n` +
      `Seu usuário de acesso será seu e-mail cadastrado: ${aff.email}\n` +
      `Seu código de parceiro: ${aff.affiliate_code}\n\n` +
      `Após definir sua senha, você poderá acessar seu painel, pegar seu link de divulgação e acompanhar seus ganhos em tempo real.\n\n` +
      `Boas vendas e seja muito bem-vindo!`
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
        <div className="container" style={{ maxWidth: isAuthenticated ? 1180 : 480 }}>
          {/* LOADING STATE */}
          {checkingAuth ? (
            <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
              <RefreshCw size={36} className="spin" style={{ margin: "0 auto 16px", color: "var(--brand-primary)" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Verificando credenciais de acesso...</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
                Aguarde um instante.
              </p>
            </div>
          ) : !isAuthenticated ? (
            /* ADMIN LOGIN SCREEN */
            <div
              className="glass-card"
              style={{
                padding: "36px 32px",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                background: "radial-gradient(circle at top right, rgba(124, 58, 237, 0.15), transparent 70%), var(--bg-card)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Header Icon */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)",
                    border: "1px solid rgba(124, 58, 237, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  <Lock size={26} color="#A78BFA" />
                </div>

                <span
                  className="badge badge-purple"
                  style={{
                    marginBottom: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ShieldCheck size={13} color="#A78BFA" /> Acesso Administrativo Restrito
                </span>

                <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 4px" }}>
                  Painel de Moderação
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
                  Informe suas credenciais autorizadas para gerenciar candidatos e comissões.
                </p>
              </div>

              {/* Error Alert */}
              {loginError && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <ShieldAlert size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "6px",
                    }}
                  >
                    E-mail de Administrador
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@pegueiotexto.com.br"
                      style={{
                        width: "100%",
                        padding: "12px 14px 12px 38px",
                        borderRadius: "10px",
                        background: "#121028",
                        color: "#FFFFFF",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "14px",
                        outline: "none",
                        colorScheme: "dark",
                      }}
                    />
                    <Mail
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "6px",
                    }}
                  >
                    Senha de Acesso
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Digite sua senha de admin"
                      style={{
                        width: "100%",
                        padding: "12px 42px 12px 38px",
                        borderRadius: "10px",
                        background: "#121028",
                        color: "#FFFFFF",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "14px",
                        outline: "none",
                        colorScheme: "dark",
                      }}
                    />
                    <KeyRound
                      size={16}
                      color="var(--text-muted)"
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "13px",
                    fontSize: "14px",
                    fontWeight: 800,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 6px 20px rgba(124, 58, 237, 0.4)",
                  }}
                >
                  {loginLoading ? (
                    <>
                      <RefreshCw size={16} className="spin" /> Autenticando...
                    </>
                  ) : (
                    <>
                      Entrar no Painel <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Link
                  href="/"
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                  }}
                >
                  ← Voltar para a página inicial
                </Link>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div>
              {/* HEADER */}
              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span
                        className="badge badge-purple"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <ShieldCheck size={14} color="#A78BFA" /> Painel de Moderação
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Autenticado como: <strong style={{ color: "#C4B5FD" }}>{adminEmail}</strong>
                      </span>
                    </div>

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
                      title="Atualizar lista"
                    >
                      <RefreshCw size={14} className={loading ? "spin" : ""} /> Atualizar
                    </button>
                    <button
                      onClick={handleAdminLogout}
                      className="btn-ghost"
                      style={{
                        padding: "9px 14px",
                        fontSize: "13px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#FCA5A5",
                      }}
                      title="Sair do painel administrativo"
                    >
                      <LogOut size={14} /> Sair
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
                  onClick={() => setStatusFilter("pending_review")}
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    border: statusFilter === "pending_review" ? "1px solid rgba(245, 158, 11, 0.7)" : "1px solid rgba(245, 158, 11, 0.3)",
                    background: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.1), transparent 70%), var(--bg-card)",
                    transition: "all 0.2s ease",
                  }}
                  title="Filtrar por pendentes"
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
                <div
                  className="glass-card"
                  onClick={() => setStatusFilter("active")}
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    border: statusFilter === "active" ? "1px solid rgba(16, 185, 129, 0.7)" : "1px solid rgba(16, 185, 129, 0.3)",
                    background: statusFilter === "active" ? "radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 70%), var(--bg-card)" : "var(--bg-card)",
                    transition: "all 0.2s ease",
                  }}
                  title="Filtrar por afiliados aprovados"
                >
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
                <div
                  className="glass-card"
                  onClick={() => setStatusFilter("all")}
                  style={{ padding: "20px", cursor: "pointer" }}
                  title="Ver todos os afiliados"
                >
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
                <div
                  className="glass-card"
                  onClick={() => setStatusFilter("all")}
                  style={{ padding: "20px", cursor: "pointer" }}
                  title="Ver todos os afiliados"
                >
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
                    padding: "16px 20px",
                    marginBottom: "24px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#6EE7B7",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={20} color="#10B981" />
                    <span style={{ fontWeight: 600 }}>{actionSuccess}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {lastApprovedAffiliate && (
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppNotification(lastApprovedAffiliate)}
                        style={{
                          padding: "8px 16px",
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
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                        }}
                      >
                        <Phone size={14} /> Abrir WhatsApp Agora
                      </button>
                    )}
                    <button
                      className="btn-ghost"
                      onClick={() => setActionSuccess(null)}
                      style={{ padding: "4px 8px", fontSize: "12px", color: "#6EE7B7" }}
                    >
                      ✕
                    </button>
                  </div>
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
                      color: "#FFFFFF",
                      colorScheme: "dark",
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

                  {statusFilter === "pending_review" && (summary?.active || 0) > 0 && (
                    <div style={{ marginTop: "18px" }}>
                      <button
                        type="button"
                        onClick={() => setStatusFilter("active")}
                        className="btn-secondary"
                        style={{
                          padding: "9px 20px",
                          fontSize: "13px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                          color: "#6EE7B7",
                          cursor: "pointer",
                        }}
                      >
                        <CheckCircle2 size={16} color="#10B981" />
                        Ver {summary?.active} Afiliado{summary?.active > 1 ? "s" : ""} Aprovado{summary?.active > 1 ? "s" : ""}
                      </button>
                    </div>
                  )}
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
                            {/* WhatsApp Button */}
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
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
