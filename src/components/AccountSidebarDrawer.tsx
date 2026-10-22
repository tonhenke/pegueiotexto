"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  User,
  Lock,
  Award,
  Gift,
  CreditCard,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Sparkles,
  Crown,
  Share2,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  LogOut,
  ChevronRight,
  Smile,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AccountSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  credits: number;
  onProfileUpdated: (updatedProfile: any) => void;
  onRefreshData?: () => void;
  onLogout?: () => void;
  initialSection?: "perfil" | "senha" | "afiliados" | "indicacoes" | "plano" | null;
}

export default function AccountSidebarDrawer({
  isOpen,
  onClose,
  user,
  profile,
  credits,
  onProfileUpdated,
  onRefreshData,
  onLogout,
  initialSection = null,
}: AccountSidebarDrawerProps) {
  const supabase = createClient();

  // Accordion open section (null means all collapsed, or specific string)
  const [openSection, setOpenSection] = useState<string | null>(initialSection || null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Affiliate state
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [copiedAffiliateLink, setCopiedAffiliateLink] = useState(false);

  // Referral state
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralStats, setReferralStats] = useState({ total_invites: 0, total_minutes_earned: 0 });
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (initialSection) {
      setOpenSection(initialSection);
    }
  }, [initialSection, isOpen]);

  useEffect(() => {
    if (profile?.name) {
      setFullName(profile.name);
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    } else if (user?.email) {
      setFullName(user.email.split("@")[0]);
    }
  }, [profile, user]);

  // Load Affiliate info
  useEffect(() => {
    async function loadAffiliate() {
      if (!user?.id && !user?.email) return;
      try {
        setAffiliateLoading(true);
        const query = user.email
          ? `user_id=${user.id}&email=${encodeURIComponent(user.email)}`
          : `user_id=${user.id}`;
        const res = await fetch(`/api/affiliates?action=me&${query}`);
        const data = await res.json();
        if (data.is_affiliate) {
          setAffiliateData(data.affiliate);
        } else {
          setAffiliateData(null);
        }
      } catch (err) {
        console.error("Erro ao verificar afiliado:", err);
      } finally {
        setAffiliateLoading(false);
      }
    }

    if (isOpen) {
      loadAffiliate();
    }
  }, [user, isOpen]);

  // Load Referral stats
  useEffect(() => {
    async function loadReferral() {
      if (!user?.id) return;
      try {
        setReferralLoading(true);
        const res = await fetch(`/api/referral?user_id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setReferralStats({
            total_invites: data.total_invites || 0,
            total_minutes_earned: data.total_minutes_earned || 0,
          });
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas de convite:", err);
      } finally {
        setReferralLoading(false);
      }
    }

    if (isOpen) {
      loadReferral();
    }
  }, [user, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com.br";
  const referralCode = user?.id ? user.id.slice(0, 8) : "";
  const referralUrl = `${origin}/login?ref=${referralCode}`;
  const affiliateUrl = affiliateData?.affiliate_code ? `${origin}/?ref=${affiliateData.affiliate_code}` : "";

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // 1. Update Name
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);

    const cleanName = fullName.trim();
    if (!cleanName) {
      setNameError("Informe o seu nome de exibição.");
      return;
    }

    setSavingName(true);
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        name: cleanName,
        updated_at: new Date().toISOString(),
      });

      await supabase.auth.updateUser({
        data: { full_name: cleanName },
      });

      onProfileUpdated({
        ...profile,
        name: cleanName,
      });

      setNameSuccess("Nome atualizado com sucesso!");
      setTimeout(() => setNameSuccess(null), 3000);
    } catch (err: any) {
      setNameError(err.message || "Erro ao salvar alterações.");
    } finally {
      setSavingName(false);
    }
  };

  // 2. Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem. Digite novamente.");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordSuccess("Senha alterada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 3500);
    } catch (err: any) {
      setPasswordError(err.message || "Erro ao atualizar a senha.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCopyAffiliate = () => {
    if (!affiliateUrl) return;
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedAffiliateLink(true);
    setTimeout(() => setCopiedAffiliateLink(false), 2500);
  };

  const handleShareAffiliateWhatsApp = () => {
    if (!affiliateUrl) return;
    const msg = encodeURIComponent(
      `Conheça o Peguei o Texto! A ferramenta mais rápida para transcrever vídeos e áudios com Inteligência Artificial: ${affiliateUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedReferralLink(true);
    setTimeout(() => setCopiedReferralLink(false), 2500);
  };

  const handleShareReferralWhatsApp = () => {
    const msg = encodeURIComponent(
      `Use o Peguei o Texto para transcrever vídeos e áudios com Inteligência Artificial em segundos! Cadastre-se pelo meu link e ganhe minutos gratuitos para testar agora: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 2500);
  };

  const handleSyncClick = async () => {
    if (!onRefreshData) return;
    setIsRefreshing(true);
    await onRefreshData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "flex-end",
        transition: "all 0.3s ease",
      }}
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 8, 15, 0.7)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          cursor: "pointer",
          animation: "fadeIn 0.25s ease-out",
        }}
      />

      {/* Drawer Container (Barra Lateral) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          height: "100vh",
          background: "#0D101C",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "-12px 0 48px rgba(0, 0, 0, 0.75)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
          overflowY: "auto",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top Header of Sidebar */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.02)",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A78BFA",
              }}
            >
              <User size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                Menu da Conta
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                Configurações e Acessos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Fechar menu lateral"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile Banner & Balance Card */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* User info card */}
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: 800,
                boxShadow: "0 0 16px rgba(124, 58, 237, 0.4)",
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {displayName}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 7px",
                    borderRadius: "100px",
                    background: "rgba(124, 58, 237, 0.25)",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                    color: "#C4B5FD",
                  }}
                >
                  {profile?.plan || "Plano Gratuito"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  margin: "2px 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email || "usuario@email.com"}
              </p>
            </div>
          </div>

          {/* Quick Balance & Sync Card */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "rgba(124, 58, 237, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#A78BFA",
                }}
              >
                <Zap size={16} />
              </div>
              <div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "block" }}>
                  {credits} minutos restantes
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Saldo de transcrição
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {onRefreshData && (
                <button
                  onClick={handleSyncClick}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                  title="Sincronizar saldo de minutos"
                >
                  <RefreshCw size={12} className={isRefreshing ? "spin" : ""} />
                </button>
              )}

              <Link
                href="/precos"
                onClick={onClose}
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Recarregar <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.06)", margin: "0 24px" }} />

        {/* Navigation / Interactive Accordion Sections */}
        <div style={{ flex: 1, padding: "18px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "4px" }}>
            Acesso Rápido & Configurações
          </span>

          {/* SECTION 1: DADOS CADASTRAIS */}
          <div
            style={{
              borderRadius: "14px",
              background: openSection === "perfil" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
              border: openSection === "perfil" ? "1px solid rgba(124, 58, 237, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            <button
              onClick={() => toggleSection("perfil")}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "rgba(124, 58, 237, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#A78BFA",
                  }}
                >
                  <User size={16} />
                </div>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 600, display: "block" }}>
                    Dados Cadastrais
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Nome de exibição e ID da conta
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                color="var(--text-muted)"
                style={{
                  transform: openSection === "perfil" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {openSection === "perfil" && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <form onSubmit={handleUpdateName} style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {nameSuccess && (
                    <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={14} /> {nameSuccess}
                    </div>
                  )}
                  {nameError && (
                    <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={14} /> {nameError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      E-mail Autenticado
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "8px",
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      style={{
                        background: "none",
                        border: "none",
                        color: copiedUserId ? "#10B981" : "var(--text-muted)",
                        fontSize: "11px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: 0,
                      }}
                    >
                      {copiedUserId ? <Check size={12} /> : <Copy size={12} />}
                      {copiedUserId ? "ID copiado!" : `ID: ${user?.id ? user.id.slice(0, 8) : ""}...`}
                    </button>

                    <button
                      type="submit"
                      disabled={savingName}
                      style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "7px 16px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: savingName ? "wait" : "pointer",
                        opacity: savingName ? 0.7 : 1,
                      }}
                    >
                      {savingName ? "Salvando..." : "Salvar Nome"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* SECTION 2: ALTERAR SENHA */}
          <div
            style={{
              borderRadius: "14px",
              background: openSection === "senha" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
              border: openSection === "senha" ? "1px solid rgba(124, 58, 237, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            <button
              onClick={() => toggleSection("senha")}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "rgba(245, 158, 11, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FBBF24",
                  }}
                >
                  <Lock size={16} />
                </div>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 600, display: "block" }}>
                    Segurança & Senha
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Atualizar senha de login
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                color="var(--text-muted)"
                style={{
                  transform: openSection === "senha" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {openSection === "senha" && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <form onSubmit={handleUpdatePassword} style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {passwordSuccess && (
                    <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={14} /> {passwordSuccess}
                    </div>
                  )}
                  {passwordError && (
                    <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={14} /> {passwordError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Nova Senha
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        style={{
                          width: "100%",
                          padding: "9px 38px 9px 12px",
                          background: "rgba(0, 0, 0, 0.25)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Confirmar Nova Senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "rgba(0, 0, 0, 0.25)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                    <button
                      type="submit"
                      disabled={savingPassword}
                      style={{
                        background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "7px 16px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: savingPassword ? "wait" : "pointer",
                        opacity: savingPassword ? 0.7 : 1,
                      }}
                    >
                      {savingPassword ? "Atualizando..." : "Atualizar Senha"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* SECTION 3: PROGRAMA DE AFILIADOS */}
          <div
            style={{
              borderRadius: "14px",
              background: openSection === "afiliados" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
              border: openSection === "afiliados" ? "1px solid rgba(124, 58, 237, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            <button
              onClick={() => toggleSection("afiliados")}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#34D399",
                  }}
                >
                  <Award size={16} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      Programa de Afiliados
                    </span>
                    {affiliateData?.status === "active" && (
                      <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", fontWeight: 700 }}>
                        Ativo
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Ganhe comissões indicando o serviço
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                color="var(--text-muted)"
                style={{
                  transform: openSection === "afiliados" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {openSection === "afiliados" && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                {affiliateLoading ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                    Carregando dados de afiliado...
                  </div>
                ) : affiliateData?.status === "active" ? (
                  <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "10px 12px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>Sua comissão</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#34D399" }}>
                          {affiliateData.commission_rate || 30}% recorrente
                        </span>
                      </div>
                      <Link
                        href="/afiliados/painel"
                        onClick={onClose}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#A78BFA",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Acessar Painel <ExternalLink size={12} />
                      </Link>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                        Seu Link Exclusivo de Afiliado
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          readOnly
                          value={affiliateUrl}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                            fontSize: "12px",
                          }}
                        />
                        <button
                          onClick={handleCopyAffiliate}
                          style={{
                            background: copiedAffiliateLink ? "#10B981" : "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {copiedAffiliateLink ? <Check size={14} /> : <Copy size={14} />}
                          {copiedAffiliateLink ? "Copiado!" : "Copiar"}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleShareAffiliateWhatsApp}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "8px",
                        background: "#25D366",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Share2 size={14} /> Compartilhar no WhatsApp
                    </button>
                  </div>
                ) : affiliateData?.status === "pending" ? (
                  <div style={{ marginTop: "14px", padding: "12px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FBBF24", fontSize: "13px", fontWeight: 600 }}>
                      <Clock size={16} /> Cadastro em Análise
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "8px 0 0", lineHeight: "1.5" }}>
                      Seu pedido de afiliação foi recebido e está em análise. Assim que aprovado, você receberá um e-mail com as instruções para criar a sua senha do painel.
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: "14px", padding: "14px", borderRadius: "10px", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.2)", textAlign: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", margin: "0 0 6px" }}>
                      Ganhe até 30% em comissões recorrentes
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 12px" }}>
                      Indique o Peguei o Texto para seu público e fature com cada plano assinado.
                    </p>
                    <Link
                      href="/afiliados"
                      onClick={onClose}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 18px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Quero me tornar um Afiliado <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4: INDIQUE E GANHE */}
          <div
            style={{
              borderRadius: "14px",
              background: openSection === "indicacoes" ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
              border: openSection === "indicacoes" ? "1px solid rgba(124, 58, 237, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            <button
              onClick={() => toggleSection("indicacoes")}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#FFFFFF",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "rgba(6, 182, 212, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#67E8F9",
                  }}
                >
                  <Gift size={16} />
                </div>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 600, display: "block" }}>
                    Indique e Ganhe Minutos
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Ganhe +10 min por amigo cadastrado
                  </span>
                </div>
              </div>

              <ChevronDown
                size={16}
                color="var(--text-muted)"
                style={{
                  transform: openSection === "indicacoes" ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {openSection === "indicacoes" && (
              <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", textAlign: "center" }}>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: "#67E8F9", display: "block" }}>
                        {referralStats.total_invites}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Amigos convidados</span>
                    </div>

                    <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", textAlign: "center" }}>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: "#34D399", display: "block" }}>
                        +{referralStats.total_minutes_earned} min
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ganhos acumulados</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                      Seu Link Pessoal de Convite
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        readOnly
                        value={referralUrl}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "rgba(0, 0, 0, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "12px",
                        }}
                      />
                      <button
                        onClick={handleCopyReferral}
                        style={{
                          background: copiedReferralLink ? "#10B981" : "rgba(255, 255, 255, 0.1)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "#FFFFFF",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {copiedReferralLink ? <Check size={14} /> : <Copy size={14} />}
                        {copiedReferralLink ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleShareReferralWhatsApp}
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: "8px",
                      background: "#25D366",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Share2 size={14} /> Convidar Amigos via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: PLANOS & PREÇOS (Direct link) */}
          <Link
            href="/precos"
            onClick={onClose}
            style={{
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textDecoration: "none",
              color: "#FFFFFF",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: "rgba(124, 58, 237, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C4B5FD",
                }}
              >
                <CreditCard size={16} />
              </div>
              <div>
                <span style={{ fontSize: "14px", fontWeight: 600, display: "block" }}>
                  Planos & Recargas
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Recarregue minutos ou faça upgrade
                </span>
              </div>
            </div>

            <ChevronRight size={16} color="var(--text-muted)" />
          </Link>
        </div>

        {/* Bottom Footer with Logout button */}
        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Peguei o Texto v2.0</span>
            <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.3)" }}>Transcrições Inteligentes</span>
          </div>

          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#F87171",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Encerrar sessão"
            >
              <LogOut size={15} /> Sair da Conta
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
