"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  DollarSign,
  CreditCard,
  Sparkles,
  Zap,
  Crown,
  Star,
  Building,
  Volume2,
  VolumeX,
  Bell,
  Send,
  Edit3,
  ChevronRight,
  Filter,
  Lightbulb,
  Trash2,
  MessageSquare,
  Tag,
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

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  plan_name: string;
  credits_minutes: number;
  referral_source: string;
  created_at: string;
  last_active_at: string;
  total_spent?: number;
}

interface AdminPurchase {
  id: string;
  stripe_session_id?: string;
  buyer_email: string;
  buyer_name?: string;
  user_id?: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  payment_method?: string;
  affiliate_code?: string;
  status: "paid" | "refunded";
  created_at: string;
}

interface AdminSettings {
  admin_email: string;
  webhook_url: string;
  notify_webhook: boolean;
  notify_email: boolean;
  sound_enabled: boolean;
}

interface Props {
  initialTab?: "usuarios" | "vendas" | "afiliados" | "sugestoes";
}

export default function AdminHub({ initialTab = "usuarios" }: Props) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"usuarios" | "vendas" | "afiliados" | "sugestoes">(initialTab);

  // Authentication state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("tonhenke@gmail.com");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("tonhenke@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Global loading
  const [loading, setLoading] = useState(false);

  // Sound notification
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevPurchasesCountRef = useRef<number | null>(null);

  // TAB 1: USERS STATE
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersSummary, setUsersSummary] = useState<any>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userPlanFilter, setUserPlanFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editSaving, setEditSaving] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // TAB 2: PURCHASES STATE
  const [purchases, setPurchases] = useState<AdminPurchase[]>([]);
  const [purchasesSummary, setPurchasesSummary] = useState<any>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [webhookInput, setWebhookInput] = useState("");
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [webhookMsg, setWebhookMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testingAlert, setTestingAlert] = useState(false);

  // TAB 3: AFFILIATES STATE
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [affiliatesSummary, setAffiliatesSummary] = useState<any>(null);
  const [affiliateStatusFilter, setAffiliateStatusFilter] = useState<"all" | "pending_review" | "active" | "suspended">("pending_review");
  const [affiliateSearchTerm, setAffiliateSearchTerm] = useState("");
  const [processingAffiliateCode, setProcessingAffiliateCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [lastApprovedAffiliate, setLastApprovedAffiliate] = useState<AdminAffiliate | null>(null);

  // TAB 4: SUGGESTIONS STATE
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionCategoryFilter, setSuggestionCategoryFilter] = useState("all");
  const [suggestionStatusFilter, setSuggestionStatusFilter] = useState("all");
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [updatingSuggestionId, setUpdatingSuggestionId] = useState<string | null>(null);

  const getAdminToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("affiliate_admin_token");
    }
    return null;
  };

  // Sound alert using Web Audio API
  const playCashChime = () => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {}
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/users?t=${Date.now()}`, {
        cache: "no-store",
        headers: { ...(token ? { "x-admin-token": token } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setUsersSummary(data.summary || null);
      }
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
    }
  };

  // Fetch Purchases
  const fetchPurchases = async (isBackgroundPoll = false) => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/purchases", {
        headers: { ...(token ? { "x-admin-token": token } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        const newPurchases: AdminPurchase[] = data.purchases || [];
        setPurchases(newPurchases);
        setPurchasesSummary(data.summary || null);
        if (data.settings) {
          setSettings(data.settings);
          setWebhookInput(data.settings.webhook_url || "");
        }

        // Detect new purchases in background poll and sound chime
        if (
          isBackgroundPoll &&
          prevPurchasesCountRef.current !== null &&
          newPurchases.length > prevPurchasesCountRef.current &&
          soundEnabled
        ) {
          playCashChime();
        }
        prevPurchasesCountRef.current = newPurchases.length;
      }
    } catch (e) {
      console.error("Erro ao carregar vendas:", e);
    }
  };

  // Fetch Affiliates
  const fetchAffiliates = async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/affiliates?action=admin_list", {
        headers: { ...(token ? { "x-admin-token": token } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        const serverAffiliates: AdminAffiliate[] = data.affiliates || [];
        setAffiliates(serverAffiliates);

        const pending = serverAffiliates.filter((a) => a.status === "pending_review").length;
        const active = serverAffiliates.filter((a) => a.status === "active").length;
        const suspended = serverAffiliates.filter((a) => a.status === "suspended").length;

        setAffiliatesSummary({
          total: serverAffiliates.length,
          pending,
          active,
          suspended,
          total_clicks: data.summary?.total_clicks || 0,
          total_conversions: data.summary?.total_conversions || 0,
          total_payouts_paid: data.summary?.total_payouts_paid || 0,
        });
      }
    } catch (e) {
      console.error("Erro ao carregar afiliados:", e);
    }
  };

  // Fetch Suggestions
  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/suggestions");
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (e) {
      console.error("Erro ao carregar sugestões:", e);
    }
  };

  const handleUpdateSuggestionStatus = async (id: string, newStatus: string) => {
    setUpdatingSuggestionId(id);
    try {
      const res = await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      }
    } catch (e) {
      console.error("Erro ao atualizar status da sugestão:", e);
    } finally {
      setUpdatingSuggestionId(null);
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta sugestão?")) return;
    try {
      const res = await fetch(`/api/suggestions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error("Erro ao excluir sugestão:", e);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchPurchases(), fetchAffiliates(), fetchSuggestions()]);
    setLoading(false);
  };

  // Auth check on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        setCheckingAuth(true);
        const token = getAdminToken();
        const res = await fetch("/api/affiliates?action=admin_check_auth", {
          headers: { ...(token ? { "x-admin-token": token } : {}) },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (data.email) setAdminEmail(data.email);
          await fetchAllData();
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

  // Real-time polling for sales (every 25 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchPurchases(true);
    }, 25000);
    return () => clearInterval(interval);
  }, [isAuthenticated, soundEnabled]);

  // Login Handler
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
        await fetchAllData();
      } else {
        setLoginError(data.detail || "E-mail ou senha de administrador incorretos.");
      }
    } catch {
      setLoginError("Erro de conexão ao servidor. Tente novamente.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleAdminLogout = async () => {
    try {
      await fetch("/api/affiliates?action=admin_logout", { method: "POST" });
    } catch {}

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("affiliate_admin_token");
    }

    setIsAuthenticated(false);
  };

  // Save Webhook Settings
  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWebhook(true);
    setWebhookMsg(null);

    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/purchases?action=save_settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({
          webhook_url: webhookInput.trim(),
          sound_enabled: soundEnabled,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        setWebhookMsg({ type: "success", text: "Webhook de notificações salvo com sucesso!" });
      } else {
        setWebhookMsg({ type: "error", text: data.detail || "Erro ao salvar webhook." });
      }
    } catch {
      setWebhookMsg({ type: "error", text: "Erro de conexão ao servidor." });
    } finally {
      setSavingWebhook(false);
    }
  };

  // Test Alert Dispatch
  const handleTestAlert = async () => {
    setTestingAlert(true);
    setWebhookMsg(null);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/purchases?action=test_alert", {
        method: "POST",
        headers: { ...(token ? { "x-admin-token": token } : {}) },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        playCashChime();
        setWebhookMsg({ type: "success", text: "Alerta de teste enviado com sucesso! Verifique seu canal." });
      } else {
        setWebhookMsg({ type: "error", text: data.detail || "Erro ao disparar teste." });
      }
    } catch {
      setWebhookMsg({ type: "error", text: "Erro ao conectar com servidor." });
    } finally {
      setTestingAlert(false);
    }
  };

  // User Plan Edit Handler
  const handleSaveUserEdit = async () => {
    if (!editingUser) return;
    setEditSaving(true);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/users?action=update_user_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({
          email: editingUser.email,
          plan: editPlan,
          credits_minutes: Number(editCredits),
        }),
      });
      if (res.ok) {
        await fetchUsers();
        setEditingUser(null);
      }
    } catch (e) {
      console.error("Erro ao atualizar usuário:", e);
    } finally {
      setEditSaving(false);
    }
  };

  // Delete User
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    setDeleteError(null);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/admin/users?action=delete_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({
          email: userToDelete.email,
          id: userToDelete.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.email !== userToDelete.email && u.id !== userToDelete.id));
        if (usersSummary) {
          setUsersSummary((prev: any) => ({
            ...prev,
            total_users: Math.max(0, (prev?.total_users || 1) - 1),
          }));
        }
        setUserToDelete(null);
        fetchUsers();
      } else {
        setDeleteError(data.detail || "Erro ao excluir usuário.");
      }
    } catch (err: any) {
      setDeleteError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setDeletingUser(false);
    }
  };

  // Affiliate Status Update
  const handleUpdateAffiliateStatus = async (affiliateCode: string, newStatus: "active" | "suspended" | "pending_review") => {
    setProcessingAffiliateCode(affiliateCode);
    setActionSuccess(null);

    const targetAff = affiliates.find((a) => a.affiliate_code === affiliateCode);
    if (targetAff) {
      const updatedAff = { ...targetAff, status: newStatus };
      setLastApprovedAffiliate(updatedAff);
      setAffiliates((prev) => prev.map((a) => (a.affiliate_code === affiliateCode ? updatedAff : a)));
    }

    try {
      const token = getAdminToken();
      const res = await fetch("/api/affiliates?action=admin_update_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify({ affiliate_code: affiliateCode, status: newStatus }),
      });

      if (res.ok) {
        setActionSuccess(`Status de ${affiliateCode} alterado para "${newStatus}".`);
        fetchAffiliates();
      }
    } catch {
      console.warn("Erro ao atualizar afiliado");
    } finally {
      setProcessingAffiliateCode(null);
    }
  };

  // WhatsApp activation for affiliates
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
      `Após definir sua senha, você poderá pegar seu link de divulgação e acompanhar seus ganhos em tempo real.\n\n` +
      `Boas vendas e seja muito bem-vindo!`
    );

    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, "_blank");
  };

  // Plan styling helper
  const renderPlanBadge = (planId: string) => {
    const p = (planId || "gratuito").toLowerCase().trim();
    if (p === "pro_annual" || p.includes("pro_anual")) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)",
            color: "#FDE68A",
            border: "1px solid rgba(245, 158, 11, 0.5)",
          }}
        >
          <Star size={13} color="#FCD34D" fill="#FCD34D" /> Pro Anual (25% OFF)
        </span>
      );
    }
    if (p === "pro") {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            background: "rgba(124, 58, 237, 0.2)",
            color: "#C4B5FD",
            border: "1px solid rgba(124, 58, 237, 0.4)",
          }}
        >
          <Crown size={13} color="#A78BFA" /> Pro
        </span>
      );
    }
    if (p.includes("starter")) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            background: "rgba(6, 182, 212, 0.2)",
            color: "#67E8F9",
            border: "1px solid rgba(6, 182, 212, 0.4)",
          }}
        >
          <Zap size={13} color="#22D3EE" /> {p.includes("annual") ? "Starter Anual" : "Starter"}
        </span>
      );
    }
    if (p.includes("business")) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            background: "rgba(16, 185, 129, 0.2)",
            color: "#6EE7B7",
            border: "1px solid rgba(16, 185, 129, 0.4)",
          }}
        >
          <Building size={13} color="#34D399" /> {p.includes("annual") ? "Business Anual" : "Business"}
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 600,
          background: "rgba(156, 163, 175, 0.15)",
          color: "#D1D5DB",
          border: "1px solid rgba(156, 163, 175, 0.3)",
        }}
      >
        <Sparkles size={12} color="#9CA3AF" /> Gratuito (5 min)
      </span>
    );
  };

  // Format Date in PT-BR
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const term = userSearchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.email.toLowerCase().includes(term) ||
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.referral_source && u.referral_source.toLowerCase().includes(term));

    const matchesPlan =
      userPlanFilter === "all" ||
      (userPlanFilter === "paid" && (u.plan || "").toLowerCase() !== "gratuito") ||
      (u.plan || "").toLowerCase() === userPlanFilter.toLowerCase() ||
      (userPlanFilter === "pro" && (u.plan || "").toLowerCase().startsWith("pro")) ||
      (userPlanFilter === "starter" && (u.plan || "").toLowerCase().startsWith("starter"));

    return matchesSearch && matchesPlan;
  });

  // Filtered Affiliates
  const filteredAffiliates = affiliates.filter((aff) => {
    const matchesStatus = affiliateStatusFilter === "all" || aff.status === affiliateStatusFilter;
    const term = affiliateSearchTerm.toLowerCase();
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
    <main style={{ minHeight: "100vh", background: "var(--bg-base)", color: "#FFFFFF" }}>
      <Navbar />

      <div style={{ paddingTop: "105px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: isAuthenticated ? 1220 : 480 }}>
          {/* LOADING STATE */}
          {checkingAuth ? (
            <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
              <RefreshCw size={36} className="spin" style={{ margin: "0 auto 16px", color: "var(--brand-primary)" }} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Verificando credenciais de acesso...</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>Aguarde um instante.</p>
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
                  style={{ marginBottom: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ShieldCheck size={13} color="#A78BFA" /> Acesso Administrativo Restrito
                </span>

                <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 4px" }}>Painel de Gestão & Moderação</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
                  Informe suas credenciais autorizadas para gerenciar usuários, planos e compras.
                </p>
              </div>

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
                  <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

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
            </div>
          ) : (
            /* ============================================================== */
            /* AUTHENTICATED ADMIN DASHBOARD */
            /* ============================================================== */
            <div>
              {/* TOP HEADER */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span className="badge badge-purple" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <ShieldCheck size={14} color="#A78BFA" /> Painel de Controle Oficial
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Admin: <strong style={{ color: "#C4B5FD" }}>{adminEmail}</strong>
                      </span>
                    </div>

                    <h1 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                      Gestão da Plataforma Peguei o Texto
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
                      Acompanhe novos usuários, planos ativos, histórico de compras em tempo real e parceiros.
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="btn-ghost"
                      style={{
                        padding: "8px 12px",
                        fontSize: "13px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: soundEnabled ? "#34D399" : "var(--text-muted)",
                      }}
                      title={soundEnabled ? "Som de vendas ativo" : "Som de vendas mutado"}
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      {soundEnabled ? "Som Ativo" : "Mudo"}
                    </button>

                    <button
                      onClick={fetchAllData}
                      disabled={loading}
                      className="btn-ghost"
                      style={{ padding: "8px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      title="Atualizar dados agora"
                    >
                      <RefreshCw size={14} className={loading ? "spin" : ""} /> Atualizar
                    </button>

                    <button
                      onClick={handleAdminLogout}
                      className="btn-ghost"
                      style={{ padding: "8px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px", color: "#FCA5A5" }}
                    >
                      <LogOut size={14} /> Sair
                    </button>
                  </div>
                </div>

                {/* PRIMARY TAB NAVIGATION */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    borderBottom: "1px solid var(--border-subtle)",
                    marginTop: "24px",
                    paddingBottom: "2px",
                    overflowX: "auto",
                  }}
                >
                  {/* TAB 1: USUÁRIOS */}
                  <button
                    onClick={() => setActiveTab("usuarios")}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === "usuarios" ? "3px solid #7C3AED" : "3px solid transparent",
                      color: activeTab === "usuarios" ? "#FFFFFF" : "var(--text-muted)",
                      padding: "12px 18px",
                      fontSize: "14px",
                      fontWeight: activeTab === "usuarios" ? 700 : 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Users size={17} color={activeTab === "usuarios" ? "#A78BFA" : "var(--text-muted)"} />
                    Usuários & Contas
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        background: activeTab === "usuarios" ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.08)",
                        color: activeTab === "usuarios" ? "#C4B5FD" : "var(--text-muted)",
                      }}
                    >
                      {users.length}
                    </span>
                  </button>

                  {/* TAB 2: VENDAS */}
                  <button
                    onClick={() => setActiveTab("vendas")}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === "vendas" ? "3px solid #10B981" : "3px solid transparent",
                      color: activeTab === "vendas" ? "#FFFFFF" : "var(--text-muted)",
                      padding: "12px 18px",
                      fontSize: "14px",
                      fontWeight: activeTab === "vendas" ? 700 : 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <DollarSign size={17} color={activeTab === "vendas" ? "#34D399" : "var(--text-muted)"} />
                    Vendas & Compras
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        background: activeTab === "vendas" ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.08)",
                        color: activeTab === "vendas" ? "#6EE7B7" : "var(--text-muted)",
                      }}
                    >
                      {purchases.length}
                    </span>
                  </button>

                  {/* TAB 3: AFILIADOS */}
                  <button
                    onClick={() => setActiveTab("afiliados")}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === "afiliados" ? "3px solid #F59E0B" : "3px solid transparent",
                      color: activeTab === "afiliados" ? "#FFFFFF" : "var(--text-muted)",
                      padding: "12px 18px",
                      fontSize: "14px",
                      fontWeight: activeTab === "afiliados" ? 700 : 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ShieldCheck size={17} color={activeTab === "afiliados" ? "#FCD34D" : "var(--text-muted)"} />
                    Afiliados & Moderação
                    {affiliatesSummary?.pending > 0 && (
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          background: "#F59E0B",
                          color: "#000000",
                          fontWeight: 800,
                        }}
                      >
                        {affiliatesSummary.pending}
                      </span>
                    )}
                  </button>

                  {/* TAB 4: SUGESTÕES & FEEDBACK */}
                  <button
                    onClick={() => setActiveTab("sugestoes")}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === "sugestoes" ? "3px solid #38BDF8" : "3px solid transparent",
                      color: activeTab === "sugestoes" ? "#FFFFFF" : "var(--text-muted)",
                      padding: "12px 18px",
                      fontSize: "14px",
                      fontWeight: activeTab === "sugestoes" ? 700 : 500,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Lightbulb size={17} color={activeTab === "sugestoes" ? "#38BDF8" : "var(--text-muted)"} />
                    Sugestões & Feedback
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        background: activeTab === "sugestoes" ? "rgba(56, 189, 248, 0.3)" : "rgba(255, 255, 255, 0.08)",
                        color: activeTab === "sugestoes" ? "#7DD3FC" : "var(--text-muted)",
                        fontWeight: 700,
                      }}
                    >
                      {suggestions.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* ============================================================== */}
              {/* TAB 1 CONTENT: USUÁRIOS & CONTAS */}
              {/* ============================================================== */}
              {activeTab === "usuarios" && (
                <div>
                  {/* KPI SUMMARY CARDS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: "16px",
                      marginBottom: "28px",
                    }}
                  >
                    {/* Total Usuários */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase" }}>
                          Total de Contas
                        </span>
                        <Users size={16} color="#A78BFA" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF" }}>
                        {usersSummary?.total_users ?? users.length}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Usuários registrados no Peguei o Texto
                      </p>
                    </div>

                    {/* Novos Hoje */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#34D399", fontWeight: 700, textTransform: "uppercase" }}>
                          Novos Cadastros (24h)
                        </span>
                        <TrendingUp size={16} color="#34D399" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#34D399" }}>
                        +{usersSummary?.new_today ?? 0}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        {usersSummary?.new_this_week ?? 0} novos nos últimos 7 dias
                      </p>
                    </div>

                    {/* Assinantes Pagantes */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#FCD34D", fontWeight: 700, textTransform: "uppercase" }}>
                          Usuários Pagantes
                        </span>
                        <Crown size={16} color="#FCD34D" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FCD34D" }}>
                        {usersSummary?.paid_users ?? 0}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Planos Starter, Pro ou Business
                      </p>
                    </div>

                    {/* Taxa de Conversão */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase" }}>
                          Taxa de Conversão
                        </span>
                        <Sparkles size={16} color="#67E8F9" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#67E8F9" }}>
                        {usersSummary?.conversion_rate ?? 0}%
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Usuários que compraram créditos
                      </p>
                    </div>
                  </div>

                  {/* CONTROLS & FILTERS */}
                  <div
                    className="glass-card"
                    style={{
                      padding: "16px 20px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    {/* Search */}
                    <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "420px" }}>
                      <Search
                        size={16}
                        color="var(--text-muted)"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                      />
                      <input
                        type="text"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Buscar por e-mail, nome ou origem..."
                        style={{
                          width: "100%",
                          padding: "10px 14px 10px 36px",
                          borderRadius: "8px",
                          background: "#0E0C20",
                          border: "1px solid var(--border-subtle)",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Plan Filter Pills */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", flex: "1 1 auto" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", marginRight: "4px" }}>
                        Filtrar por plano:
                      </span>
                      {[
                        { id: "all", label: "Todos" },
                        { id: "paid", label: "Pagantes ⭐" },
                        { id: "gratuito", label: "Gratuito" },
                        { id: "starter", label: "Starter" },
                        { id: "pro", label: "Pro" },
                        { id: "business", label: "Business" },
                        { id: "ilimitado", label: "Ilimitado 👑" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setUserPlanFilter(item.id)}
                          style={{
                            background: userPlanFilter === item.id ? "rgba(124, 58, 237, 0.3)" : "rgba(255, 255, 255, 0.05)",
                            color: userPlanFilter === item.id ? "#C4B5FD" : "var(--text-muted)",
                            border: userPlanFilter === item.id ? "1px solid #7C3AED" : "1px solid rgba(255, 255, 255, 0.1)",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {item.label}
                        </button>
                      ))}

                      <button
                        onClick={async () => {
                          setLoading(true);
                          await fetchUsers();
                          setLoading(false);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "rgba(124, 58, 237, 0.15)",
                          color: "#C4B5FD",
                          border: "1px solid rgba(124, 58, 237, 0.4)",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginLeft: "auto",
                          transition: "all 0.15s ease",
                        }}
                        title="Sincronizar em tempo real com o Supabase"
                      >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        <span>Sincronizar</span>
                      </button>
                    </div>
                  </div>

                  {/* USERS TABLE */}
                  <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-subtle)" }}>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Usuário</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Data de Criação</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Plano Atual</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Saldo</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Origem</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Total Gasto</th>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                                Nenhum usuário localizado com os filtros selecionados.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((u) => {
                              const initials = (u.name || u.email)
                                .slice(0, 2)
                                .toUpperCase();

                              return (
                                <tr
                                  key={u.id || u.email}
                                  style={{
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                    transition: "background 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.02)")}
                                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                >
                                  {/* User */}
                                  <td style={{ padding: "14px 20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                      <div
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                          borderRadius: "50%",
                                          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)",
                                          border: "1px solid rgba(124, 58, 237, 0.4)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontWeight: 800,
                                          fontSize: "12px",
                                          color: "#C4B5FD",
                                          flexShrink: 0,
                                        }}
                                      >
                                        {initials}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{u.name || u.email.split("@")[0]}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{u.email}</div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Created At */}
                                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                                    {formatDateBR(u.created_at)}
                                  </td>

                                  {/* Plan */}
                                  <td style={{ padding: "14px 16px" }}>{renderPlanBadge(u.plan)}</td>

                                  {/* Credits */}
                                  <td style={{ padding: "14px 16px" }}>
                                    <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{u.credits_minutes ?? 5}</span>{" "}
                                    <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>min</span>
                                  </td>

                                  {/* Origin */}
                                  <td style={{ padding: "14px 16px" }}>
                                    {u.referral_source && u.referral_source !== "organico" ? (
                                      <span
                                        style={{
                                          padding: "3px 8px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          background: "rgba(245, 158, 11, 0.15)",
                                          color: "#FCD34D",
                                          border: "1px solid rgba(245, 158, 11, 0.3)",
                                        }}
                                      >
                                        {u.referral_source}
                                      </span>
                                    ) : (
                                      <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Orgânico</span>
                                    )}
                                  </td>

                                  {/* Total Spent */}
                                  <td style={{ padding: "14px 16px", fontWeight: 700, color: u.total_spent ? "#34D399" : "var(--text-muted)" }}>
                                    {u.total_spent
                                      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(u.total_spent)
                                      : "R$ 0,00"}
                                  </td>

                                  {/* Action */}
                                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                      <button
                                        onClick={() => {
                                          setEditingUser(u);
                                          setEditPlan(u.plan || "gratuito");
                                          setEditCredits(u.credits_minutes ?? 5);
                                        }}
                                        style={{
                                          background: "rgba(255, 255, 255, 0.05)",
                                          border: "1px solid rgba(255, 255, 255, 0.15)",
                                          borderRadius: "6px",
                                          padding: "6px 10px",
                                          color: "#C4B5FD",
                                          fontSize: "12px",
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                        title="Editar plano e créditos"
                                      >
                                        <Edit3 size={13} /> Gerenciar
                                      </button>

                                      {u.email.toLowerCase().trim() !== "tonhenke@gmail.com" && (
                                        <button
                                          onClick={() => {
                                            setDeleteError(null);
                                            setUserToDelete(u);
                                          }}
                                          style={{
                                            background: "rgba(239, 68, 68, 0.1)",
                                            border: "1px solid rgba(239, 68, 68, 0.25)",
                                            borderRadius: "6px",
                                            padding: "6px 8px",
                                            color: "#F87171",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.15s ease",
                                          }}
                                          title={`Excluir conta de ${u.email}`}
                                          onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "rgba(239, 68, 68, 0.25)";
                                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(239, 68, 68, 0.5)";
                                          }}
                                          onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.background = "rgba(239, 68, 68, 0.1)";
                                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(239, 68, 68, 0.25)";
                                          }}
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* MODAL: EDIT USER PLAN / CREDITS */}
                  {editingUser && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                      }}
                      onClick={() => setEditingUser(null)}
                    >
                      <div
                        className="glass-card"
                        style={{
                          width: "100%",
                          maxWidth: "460px",
                          padding: "28px",
                          background: "#121028",
                          border: "1px solid #7C3AED",
                          borderRadius: "16px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px" }}>Gerenciar Plano do Usuário</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" }}>
                          {editingUser.email}
                        </p>

                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                            Plano Ativo
                          </label>
                          <select
                            value={editPlan}
                            onChange={(e) => setEditPlan(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              background: "#0A091A",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              fontSize: "14px",
                            }}
                          >
                            <option value="gratuito">Gratuito (5 min)</option>
                            <option value="starter">Starter (60 min)</option>
                            <option value="starter_annual">Starter Anual (720 min)</option>
                            <option value="pro">Pro (180 min)</option>
                            <option value="pro_annual">Pro Anual (2.160 min - 25% OFF)</option>
                            <option value="business">Business (400 min)</option>
                            <option value="business_annual">Business Anual (4.800 min)</option>
                            <option value="ilimitado">Ilimitado (Acesso Vitalício / Admin)</option>
                          </select>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                            Saldo de Minutos (Créditos)
                          </label>
                          <input
                            type="number"
                            value={editCredits}
                            onChange={(e) => setEditCredits(parseInt(e.target.value, 10) || 0)}
                            style={{
                              width: "100%",
                              padding: "10px 14px",
                              borderRadius: "8px",
                              background: "#0A091A",
                              color: "#FFFFFF",
                              border: "1px solid var(--border-subtle)",
                              fontSize: "14px",
                            }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                          {editingUser.email.toLowerCase().trim() !== "tonhenke@gmail.com" ? (
                            <button
                              type="button"
                              onClick={() => {
                                const target = editingUser;
                                setEditingUser(null);
                                setDeleteError(null);
                                setUserToDelete(target);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "rgba(239, 68, 68, 0.12)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#F87171",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <Trash2 size={13} /> Excluir Conta
                            </button>
                          ) : <div />}

                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => setEditingUser(null)}
                              className="btn-ghost"
                              style={{ padding: "8px 16px", fontSize: "13px" }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={editSaving}
                              onClick={handleSaveUserEdit}
                              className="btn-primary"
                              style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 700 }}
                            >
                              {editSaving ? "Salvando..." : "Salvar Alterações"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL: DELETE USER CONFIRMATION */}
                  {userToDelete && (
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.82)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                      }}
                      onClick={() => !deletingUser && setUserToDelete(null)}
                    >
                      <div
                        className="glass-card"
                        style={{
                          maxWidth: "460px",
                          width: "100%",
                          padding: "28px",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          borderRadius: "16px",
                          background: "#0D0B1C",
                          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "12px",
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.35)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#F87171",
                              flexShrink: 0,
                            }}
                          >
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                              Excluir Usuário
                            </h3>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                              Esta ação é permanente e irreversível
                            </p>
                          </div>
                        </div>

                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
                          Você está prestes a excluir definitivamente a conta de <strong style={{ color: "#FFFFFF" }}>{userToDelete.name || userToDelete.email}</strong> (<span style={{ color: "#C4B5FD" }}>{userToDelete.email}</span>).
                          <br /><br />
                          O acesso será revogado no Supabase Auth e seu perfil, transcrições e histórico de créditos serão permanentemente apagados.
                        </p>

                        {deleteError && (
                          <div
                            style={{
                              padding: "10px 14px",
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              borderRadius: "8px",
                              color: "#FCA5A5",
                              fontSize: "13px",
                              marginBottom: "16px",
                            }}
                          >
                            {deleteError}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            disabled={deletingUser}
                            onClick={() => {
                              setUserToDelete(null);
                              setDeleteError(null);
                            }}
                            className="btn-ghost"
                            style={{ padding: "9px 18px", fontSize: "13px" }}
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={deletingUser}
                            onClick={handleConfirmDeleteUser}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              background: "#DC2626",
                              border: "none",
                              borderRadius: "8px",
                              color: "#FFFFFF",
                              padding: "9px 20px",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: deletingUser ? "not-allowed" : "pointer",
                              boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                              opacity: deletingUser ? 0.7 : 1,
                            }}
                          >
                            <Trash2 size={15} />
                            {deletingUser ? "Excluindo..." : "Sim, Excluir Definitivamente"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2 CONTENT: VENDAS & COMPRAS (REAL-TIME FEED & ALERTS) */}
              {/* ============================================================== */}
              {activeTab === "vendas" && (
                <div>
                  {/* SALES SUMMARY CARDS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: "16px",
                      marginBottom: "28px",
                    }}
                  >
                    {/* Faturamento Total */}
                    <div
                      className="glass-card"
                      style={{
                        padding: "20px",
                        background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%), var(--bg-card)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#34D399", fontWeight: 700, textTransform: "uppercase" }}>
                          Faturamento Acumulado
                        </span>
                        <DollarSign size={16} color="#34D399" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#34D399" }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          purchasesSummary?.total_revenue || 0
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Total bruto recebido na plataforma
                      </p>
                    </div>

                    {/* Total de Pedidos */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase" }}>
                          Vendas Concluídas
                        </span>
                        <CreditCard size={16} color="#A78BFA" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF" }}>
                        {purchasesSummary?.total_orders || purchases.length}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        {purchasesSummary?.orders_today || 0} compras realizadas hoje
                      </p>
                    </div>

                    {/* Ticket Médio */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#FCD34D", fontWeight: 700, textTransform: "uppercase" }}>
                          Ticket Médio
                        </span>
                        <TrendingUp size={16} color="#FCD34D" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FCD34D" }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          purchasesSummary?.average_ticket || 0
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Valor médio por transação
                      </p>
                    </div>

                    {/* Faturamento do Mês */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase" }}>
                          Receita Últimos 30 Dias
                        </span>
                        <Clock size={16} color="#67E8F9" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#67E8F9" }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          purchasesSummary?.revenue_month || 0
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        {purchasesSummary?.orders_month || 0} pedidos neste período
                      </p>
                    </div>
                  </div>

                  {/* NOTIFICATION SETTINGS BOX */}
                  <div
                    className="glass-card"
                    style={{
                      padding: "24px",
                      marginBottom: "28px",
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                      background: "radial-gradient(circle at top left, rgba(124, 58, 237, 0.08), transparent 70%), var(--bg-card)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Bell size={18} color="#A78BFA" />
                          <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
                            Como você deseja ser avisado a cada nova compra?
                          </h3>
                        </div>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                          Toda vez que alguém realiza uma compra, o sistema dispara alertas imediatos para você nunca perder uma venda.
                        </p>
                      </div>

                      <button
                        onClick={handleTestAlert}
                        disabled={testingAlert}
                        className="btn-secondary"
                        style={{
                          padding: "8px 16px",
                          fontSize: "13px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#A78BFA",
                        }}
                      >
                        <Send size={14} /> {testingAlert ? "Disparando teste..." : "Testar Notificação Agora"}
                      </button>
                    </div>

                    {webhookMsg && (
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                          fontSize: "13px",
                          background: webhookMsg.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          border: webhookMsg.type === "success" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                          color: webhookMsg.type === "success" ? "#6EE7B7" : "#FCA5A5",
                        }}
                      >
                        {webhookMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleSaveWebhook} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{ flex: "1 1 340px", position: "relative" }}>
                        <input
                          type="url"
                          value={webhookInput}
                          onChange={(e) => setWebhookInput(e.target.value)}
                          placeholder="Cole sua Webhook URL do Discord, Telegram Bot, Make, n8n ou Zapier..."
                          style={{
                            width: "100%",
                            padding: "11px 14px",
                            borderRadius: "8px",
                            background: "#0E0C20",
                            border: "1px solid var(--border-subtle)",
                            color: "#FFFFFF",
                            fontSize: "13px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={savingWebhook}
                        className="btn-primary"
                        style={{ padding: "11px 20px", fontSize: "13px", fontWeight: 700 }}
                      >
                        {savingWebhook ? "Salvando..." : "Salvar Webhook de Alertas"}
                      </button>
                    </form>

                    <div style={{ marginTop: "12px", display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "12px", color: "var(--text-muted)" }}>
                      <span>✉️ E-mail de notificação: <strong style={{ color: "#C4B5FD" }}>{adminEmail}</strong></span>
                      <span>🔔 Alerta Sonoro no Navegador: <strong style={{ color: soundEnabled ? "#34D399" : "#FCA5A5" }}>{soundEnabled ? "Ligado" : "Desligado"}</strong></span>
                      <span>🔄 Atualização em tempo real: <strong style={{ color: "#34D399" }}>Ativa (a cada 25s)</strong></span>
                    </div>
                  </div>

                  {/* PURCHASES TABLE / FEED */}
                  <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                        <DollarSign size={18} color="#10B981" /> Feed de Compras Realizadas
                      </h3>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {purchases.length} transação(ões) registradas
                      </span>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-subtle)" }}>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Data & Hora</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Cliente</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Plano</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Valor Pago</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Método</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Canal</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>ID Stripe</th>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.length === 0 ? (
                            <tr>
                              <td colSpan={8} style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                                Nenhuma compra realizada até o momento.
                              </td>
                            </tr>
                          ) : (
                            purchases.map((pur) => (
                              <tr
                                key={pur.id || pur.stripe_session_id}
                                style={{
                                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                  transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.02)")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                              >
                                <td style={{ padding: "14px 20px", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                                  {formatDateBR(pur.created_at)}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{pur.buyer_name || pur.buyer_email.split("@")[0]}</div>
                                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{pur.buyer_email}</div>
                                </td>

                                <td style={{ padding: "14px 16px" }}>{renderPlanBadge(pur.plan_id)}</td>

                                <td style={{ padding: "14px 16px", fontWeight: 800, fontSize: "14px", color: "#34D399" }}>
                                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pur.amount || 0)}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      background: "rgba(255, 255, 255, 0.08)",
                                      color: "#E2E8F0",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {pur.payment_method === "pix" ? "PIX" : "CARTÃO"}
                                  </span>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  {pur.affiliate_code ? (
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        padding: "3px 8px",
                                        borderRadius: "6px",
                                        background: "rgba(245, 158, 11, 0.15)",
                                        color: "#FCD34D",
                                      }}
                                    >
                                      Afiliado: {pur.affiliate_code}
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Orgânica</span>
                                  )}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  {pur.stripe_session_id ? (
                                    <a
                                      href={`https://dashboard.stripe.com/payments`}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        fontSize: "12px",
                                        color: "#A78BFA",
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                      title={pur.stripe_session_id}
                                    >
                                      <code>{pur.stripe_session_id.slice(0, 14)}...</code>
                                      <ExternalLink size={12} />
                                    </a>
                                  ) : (
                                    <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>—</span>
                                  )}
                                </td>

                                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "4px 10px",
                                      borderRadius: "9999px",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      background: "rgba(16, 185, 129, 0.2)",
                                      color: "#34D399",
                                      border: "1px solid rgba(16, 185, 129, 0.4)",
                                    }}
                                  >
                                    <CheckCircle2 size={12} /> Pago
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3 CONTENT: AFILIADOS & CANDIDATURAS */}
              {/* ============================================================== */}
              {activeTab === "afiliados" && (
                <div>
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
                      onClick={() => setAffiliateStatusFilter("pending_review")}
                      style={{
                        padding: "20px",
                        cursor: "pointer",
                        border: affiliateStatusFilter === "pending_review" ? "1px solid rgba(245, 158, 11, 0.7)" : "1px solid rgba(245, 158, 11, 0.3)",
                        background: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.1), transparent 70%), var(--bg-card)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#FCD34D", fontWeight: 700, textTransform: "uppercase" }}>
                          Pendentes de Análise
                        </span>
                        <Clock size={16} color="#FCD34D" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FCD34D" }}>
                        {affiliatesSummary?.pending || 0}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Aguardando sua moderação
                      </p>
                    </div>

                    {/* Ativos */}
                    <div
                      className="glass-card"
                      onClick={() => setAffiliateStatusFilter("active")}
                      style={{
                        padding: "20px",
                        cursor: "pointer",
                        border: affiliateStatusFilter === "active" ? "1px solid rgba(16, 185, 129, 0.7)" : "1px solid rgba(16, 185, 129, 0.3)",
                        background: affiliateStatusFilter === "active" ? "radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 70%), var(--bg-card)" : "var(--bg-card)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#34D399", fontWeight: 700, textTransform: "uppercase" }}>
                          Afiliados Aprovados
                        </span>
                        <CheckCircle2 size={16} color="#34D399" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#34D399" }}>
                        {affiliatesSummary?.active || 0}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Divulgando ativamente
                      </p>
                    </div>

                    {/* Total de Candidaturas */}
                    <div
                      className="glass-card"
                      onClick={() => setAffiliateStatusFilter("all")}
                      style={{
                        padding: "20px",
                        cursor: "pointer",
                        border: affiliateStatusFilter === "all" ? "1px solid #7C3AED" : "1px solid var(--border-subtle)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 700, textTransform: "uppercase" }}>
                          Total de Candidaturas
                        </span>
                        <Users size={16} color="#A78BFA" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFFFFF" }}>
                        {affiliatesSummary?.total || 0}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Todas as solicitações
                      </p>
                    </div>

                    {/* Comissões Pagas */}
                    <div className="glass-card" style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#67E8F9", fontWeight: 700, textTransform: "uppercase" }}>
                          Comissões Pagas
                        </span>
                        <TrendingUp size={16} color="#67E8F9" />
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "#67E8F9" }}>
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          affiliatesSummary?.total_payouts_paid || 0
                        )}
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Repassado aos parceiros
                      </p>
                    </div>
                  </div>

                  {/* WHATSAPP BANNER IF APPROVED */}
                  {lastApprovedAffiliate && (
                    <div
                      className="glass-card"
                      style={{
                        padding: "16px 20px",
                        marginBottom: "24px",
                        background: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <CheckCircle2 size={24} color="#34D399" />
                        <div>
                          <div style={{ fontWeight: 800, color: "#6EE7B7" }}>
                            Candidatura de {lastApprovedAffiliate.full_name} ({lastApprovedAffiliate.affiliate_code}) aprovada!
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            Notifique o parceiro no WhatsApp com a mensagem oficial e link de ativação em 1 clique.
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendWhatsAppNotification(lastApprovedAffiliate)}
                        style={{
                          background: "#25D366",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 18px",
                          fontSize: "13px",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Phone size={15} /> Notificar via WhatsApp
                      </button>
                    </div>
                  )}

                  {/* SEARCH & FILTERS */}
                  <div
                    className="glass-card"
                    style={{
                      padding: "16px 20px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div style={{ position: "relative", flex: "1 1 280px", maxWidth: "420px" }}>
                      <Search
                        size={16}
                        color="var(--text-muted)"
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                      />
                      <input
                        type="text"
                        value={affiliateSearchTerm}
                        onChange={(e) => setAffiliateSearchTerm(e.target.value)}
                        placeholder="Buscar por nome, e-mail, telefone ou código..."
                        style={{
                          width: "100%",
                          padding: "10px 14px 10px 36px",
                          borderRadius: "8px",
                          background: "#0E0C20",
                          border: "1px solid var(--border-subtle)",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[
                        { id: "pending_review", label: "Pendentes" },
                        { id: "active", label: "Aprovados" },
                        { id: "suspended", label: "Suspensos" },
                        { id: "all", label: "Todos" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAffiliateStatusFilter(item.id as any)}
                          style={{
                            background: affiliateStatusFilter === item.id ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.05)",
                            color: affiliateStatusFilter === item.id ? "#FCD34D" : "var(--text-muted)",
                            border: affiliateStatusFilter === item.id ? "1px solid #F59E0B" : "1px solid rgba(255, 255, 255, 0.1)",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AFFILIATES TABLE */}
                  <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                        <thead>
                          <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-subtle)" }}>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)" }}>Parceiro</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Código</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Canal & Audiência</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Chave Pix</th>
                            <th style={{ padding: "14px 16px", fontWeight: 700, color: "var(--text-secondary)" }}>Status</th>
                            <th style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-secondary)", textAlign: "right" }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAffiliates.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                                Nenhum parceiro encontrado nesta categoria.
                              </td>
                            </tr>
                          ) : (
                            filteredAffiliates.map((aff) => (
                              <tr
                                key={aff.id || aff.affiliate_code}
                                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
                              >
                                <td style={{ padding: "14px 20px" }}>
                                  <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{aff.full_name}</div>
                                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                    {aff.email} • {aff.phone}
                                  </div>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  <code
                                    style={{
                                      background: "rgba(124, 58, 237, 0.2)",
                                      color: "#C4B5FD",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {aff.affiliate_code}
                                  </code>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  {aff.channel_url ? (
                                    <a
                                      href={aff.channel_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        color: "#67E8F9",
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      {aff.channel_type?.toUpperCase()} <ExternalLink size={12} />
                                    </a>
                                  ) : (
                                    <span>{aff.channel_type}</span>
                                  )}
                                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{aff.audience_range}</div>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  <div style={{ fontSize: "12px", color: "#E2E8F0" }}>{aff.pix_key || "Não informada"}</div>
                                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{aff.pix_key_type}</div>
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                  {aff.status === "active" && (
                                    <span style={{ color: "#34D399", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      <CheckCircle2 size={13} /> Ativo
                                    </span>
                                  )}
                                  {aff.status === "pending_review" && (
                                    <span style={{ color: "#FCD34D", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      <Clock size={13} /> Pendente
                                    </span>
                                  )}
                                  {aff.status === "suspended" && (
                                    <span style={{ color: "#FCA5A5", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      <XCircle size={13} /> Suspenso
                                    </span>
                                  )}
                                </td>

                                <td style={{ padding: "14px 20px", textAlign: "right" }}>
                                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    {aff.status !== "active" && (
                                      <button
                                        onClick={() => handleUpdateAffiliateStatus(aff.affiliate_code, "active")}
                                        disabled={processingAffiliateCode === aff.affiliate_code}
                                        style={{
                                          background: "rgba(16, 185, 129, 0.2)",
                                          border: "1px solid rgba(16, 185, 129, 0.4)",
                                          color: "#34D399",
                                          borderRadius: "6px",
                                          padding: "5px 10px",
                                          fontSize: "12px",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                        }}
                                      >
                                        Aprovar
                                      </button>
                                    )}
                                    {aff.status === "active" && (
                                      <button
                                        onClick={() => handleSendWhatsAppNotification(aff)}
                                        style={{
                                          background: "rgba(37, 211, 102, 0.15)",
                                          border: "1px solid rgba(37, 211, 102, 0.4)",
                                          color: "#25D366",
                                          borderRadius: "6px",
                                          padding: "5px 10px",
                                          fontSize: "12px",
                                          fontWeight: 700,
                                          cursor: "pointer",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                      >
                                        <Phone size={12} /> WhatsApp
                                      </button>
                                    )}
                                    {aff.status !== "suspended" && (
                                      <button
                                        onClick={() => handleUpdateAffiliateStatus(aff.affiliate_code, "suspended")}
                                        disabled={processingAffiliateCode === aff.affiliate_code}
                                        style={{
                                          background: "rgba(239, 68, 68, 0.15)",
                                          border: "1px solid rgba(239, 68, 68, 0.3)",
                                          color: "#FCA5A5",
                                          borderRadius: "6px",
                                          padding: "5px 10px",
                                          fontSize: "12px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Suspender
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: SUGESTÕES & FEEDBACK                             */}
              {/* ======================================================== */}
              {activeTab === "sugestoes" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Stats Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Total de Sugestões
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF" }}>
                        {suggestions.length}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        Enviadas pela comunidade
                      </div>
                    </div>

                    <div
                      style={{
                        background: "rgba(245, 158, 11, 0.05)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#FCD34D", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Pendentes
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#FBBF24" }}>
                        {suggestions.filter((s) => s.status === "pending" || !s.status).length}
                      </div>
                      <div style={{ fontSize: "12px", color: "#FCD34D", marginTop: "4px" }}>
                        Aguardando avaliação
                      </div>
                    </div>

                    <div
                      style={{
                        background: "rgba(56, 189, 248, 0.05)",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#7DD3FC", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Em Análise
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38BDF8" }}>
                        {suggestions.filter((s) => s.status === "in_review").length}
                      </div>
                      <div style={{ fontSize: "12px", color: "#7DD3FC", marginTop: "4px" }}>
                        No roadmap técnico
                      </div>
                    </div>

                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.05)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#6EE7B7", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Implementadas
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10B981" }}>
                        {suggestions.filter((s) => s.status === "implemented").length}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6EE7B7", marginTop: "4px" }}>
                        Lançadas na plataforma
                      </div>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "14px",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 280px" }}>
                      <Search size={16} color="var(--text-muted)" />
                      <input
                        type="text"
                        value={suggestionSearch}
                        onChange={(e) => setSuggestionSearch(e.target.value)}
                        placeholder="Buscar por título, autor ou palavras na descrição..."
                        style={{
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "#FFFFFF",
                          fontSize: "14px",
                          width: "100%",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <select
                        value={suggestionCategoryFilter}
                        onChange={(e) => setSuggestionCategoryFilter(e.target.value)}
                        style={{
                          background: "rgba(0, 0, 0, 0.4)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="all">Todas as Categorias</option>
                        <option value="ux">🎨 UX & Interface</option>
                        <option value="transcription">🎙️ Transcrição & Áudio</option>
                        <option value="ai">🤖 Inteligência Artificial</option>
                        <option value="bugs">🐛 Bugs & Problemas</option>
                        <option value="features">💡 Nova Funcionalidade</option>
                        <option value="other">💬 Outros</option>
                      </select>

                      <select
                        value={suggestionStatusFilter}
                        onChange={(e) => setSuggestionStatusFilter(e.target.value)}
                        style={{
                          background: "rgba(0, 0, 0, 0.4)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="all">Todos os Status</option>
                        <option value="pending">🟡 Pendente</option>
                        <option value="in_review">🔵 Em Análise</option>
                        <option value="implemented">🟢 Implementada</option>
                        <option value="dismissed">⚪ Descartada</option>
                      </select>

                      <button
                        onClick={fetchSuggestions}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <RefreshCw size={14} />
                        <span>Atualizar</span>
                      </button>
                    </div>
                  </div>

                  {/* Suggestions List */}
                  {suggestions.length === 0 ? (
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px dashed rgba(255, 255, 255, 0.12)",
                        borderRadius: "16px",
                        padding: "60px 20px",
                        textAlign: "center",
                      }}
                    >
                      <Lightbulb size={40} color="#FBBF24" style={{ margin: "0 auto 16px auto", opacity: 0.6 }} />
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
                        Nenhuma sugestão recebida ainda
                      </h3>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 20px auto" }}>
                        Assim que os usuários enviarem ideias ou reportarem problemas pela página{" "}
                        <Link href="/sugestoes" style={{ color: "#38BDF8", textDecoration: "underline" }} target="_blank">
                          /sugestoes
                        </Link>
                        , elas aparecerão listadas aqui em tempo real!
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {suggestions
                        .filter((s) => {
                          const matchesCategory = suggestionCategoryFilter === "all" || s.category === suggestionCategoryFilter;
                          const matchesStatus = suggestionStatusFilter === "all" || s.status === suggestionStatusFilter;
                          const matchesSearch =
                            !suggestionSearch ||
                            s.title?.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
                            s.description?.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
                            s.user_email?.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
                            s.user_name?.toLowerCase().includes(suggestionSearch.toLowerCase());
                          return matchesCategory && matchesStatus && matchesSearch;
                        })
                        .map((s) => {
                          const categoryPills: Record<string, { bg: string; text: string; icon: string }> = {
                            ux: { bg: "rgba(129, 140, 248, 0.15)", text: "#818CF8", icon: "🎨" },
                            transcription: { bg: "rgba(52, 211, 153, 0.15)", text: "#34D399", icon: "🎙️" },
                            ai: { bg: "rgba(192, 132, 252, 0.15)", text: "#C084FC", icon: "🤖" },
                            bugs: { bg: "rgba(248, 113, 113, 0.15)", text: "#F87171", icon: "🐛" },
                            features: { bg: "rgba(251, 191, 36, 0.15)", text: "#FBBF24", icon: "💡" },
                            other: { bg: "rgba(255, 255, 255, 0.1)", text: "#E2E8F0", icon: "💬" },
                          };
                          const catInfo = categoryPills[s.category] || categoryPills.other;
                          const formattedDate = s.created_at
                            ? new Date(s.created_at).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Data N/A";

                          return (
                            <div
                              key={s.id}
                              style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "14px",
                                padding: "22px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {/* Top Bar of Card */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <span
                                    style={{
                                      background: catInfo.bg,
                                      color: catInfo.text,
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      padding: "4px 10px",
                                      borderRadius: "100px",
                                    }}
                                  >
                                    {catInfo.icon} {s.category_label || s.category}
                                  </span>

                                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                    📅 {formattedDate}
                                  </span>
                                </div>

                                {/* Status Selector & Actions */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <select
                                    value={s.status || "pending"}
                                    onChange={(e) => handleUpdateSuggestionStatus(s.id, e.target.value)}
                                    disabled={updatingSuggestionId === s.id}
                                    style={{
                                      background:
                                        s.status === "implemented"
                                          ? "rgba(16, 185, 129, 0.2)"
                                          : s.status === "in_review"
                                          ? "rgba(56, 189, 248, 0.2)"
                                          : s.status === "dismissed"
                                          ? "rgba(255, 255, 255, 0.08)"
                                          : "rgba(245, 158, 11, 0.2)",
                                      border: "1px solid rgba(255, 255, 255, 0.15)",
                                      color:
                                        s.status === "implemented"
                                          ? "#34D399"
                                          : s.status === "in_review"
                                          ? "#38BDF8"
                                          : s.status === "dismissed"
                                          ? "#94A3B8"
                                          : "#FBBF24",
                                      borderRadius: "8px",
                                      padding: "6px 12px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <option value="pending">🟡 Pendente</option>
                                    <option value="in_review">🔵 Em Análise</option>
                                    <option value="implemented">🟢 Implementada</option>
                                    <option value="dismissed">⚪ Descartada</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteSuggestion(s.id)}
                                    title="Excluir sugestão"
                                    style={{
                                      background: "rgba(239, 68, 68, 0.1)",
                                      border: "1px solid rgba(239, 68, 68, 0.25)",
                                      borderRadius: "8px",
                                      padding: "6px 10px",
                                      color: "#FCA5A5",
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 0 0" }}>
                                {s.title}
                              </h4>

                              {/* Description Box */}
                              <div
                                style={{
                                  background: "rgba(0, 0, 0, 0.3)",
                                  border: "1px solid rgba(255, 255, 255, 0.05)",
                                  borderRadius: "10px",
                                  padding: "12px 16px",
                                  fontSize: "14px",
                                  color: "#E2E8F0",
                                  lineHeight: 1.6,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {s.description}
                              </div>

                              {/* Author Footer */}
                              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
                                <span>
                                  👤 <strong>Autor:</strong> {s.user_name || "Não informado"}
                                </span>
                                {s.user_email ? (
                                  <span>
                                    ✉️{" "}
                                    <a
                                      href={`mailto:${s.user_email}?subject=Resposta sobre sua sugestão no Peguei o Texto`}
                                      style={{ color: "#38BDF8", textDecoration: "none" }}
                                    >
                                      {s.user_email}
                                    </a>
                                  </span>
                                ) : (
                                  <span>✉️ Anônimo</span>
                                )}
                                {s.user_id && (
                                  <span style={{ fontFamily: "monospace", opacity: 0.7 }}>
                                    ID: {s.user_id.substring(0, 8)}...
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
