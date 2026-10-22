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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  onProfileUpdated: (updatedProfile: any) => void;
  initialTab?: "perfil" | "afiliados" | "indicacoes" | "plano";
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  user,
  profile,
  onProfileUpdated,
  initialTab = "perfil",
}: AccountSettingsModalProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"perfil" | "afiliados" | "indicacoes" | "plano">(initialTab);

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

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

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

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com.br";
  const referralCode = user?.id ? user.id.slice(0, 8) : "";
  const referralUrl = `${origin}/login?ref=${referralCode}`;
  const affiliateUrl = affiliateData?.affiliate_code ? `${origin}/?ref=${affiliateData.affiliate_code}` : "";

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
      // Update Supabase profile
      await supabase.from("profiles").upsert({
        id: user.id,
        name: cleanName,
        updated_at: new Date().toISOString(),
      });

      // Update Supabase auth metadata
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
      setPasswordError(err.message || "Erro ao atualizar a senha. Tente novamente.");
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
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopiedReferralLink(true);
    setTimeout(() => setCopiedReferralLink(false), 2500);
  };

  const handleShareReferralWhatsApp = () => {
    if (!referralUrl) return;
    const msg = encodeURIComponent(
      `Oi! Use o Peguei o Texto para transcrever vídeos do YouTube, Instagram e áudios com Inteligência Artificial em segundos. Crie sua conta grátis com meu link e ganhe 15 minutos bônus:\n${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleCopyUserId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 2000);
  };

  const planLabel = profile?.plan ? profile.plan.toUpperCase() : "GRATUITO";
  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          border: "1px solid rgba(124, 58, 237, 0.35)",
          background: "linear-gradient(145deg, rgba(22, 18, 48, 0.95) 0%, rgba(12, 10, 28, 0.98) 100%)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 58, 237, 0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "16px",
                fontWeight: 800,
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.4)",
              }}
            >
              {userInitials}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
                  Minha Conta & Preferências
                </h2>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "rgba(124, 58, 237, 0.2)",
                    color: "#C084FC",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                  }}
                >
                  {planLabel}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                {user?.email || "Usuário conectado"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
            title="Fechar (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS NAVIGATION */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(0, 0, 0, 0.15)",
            padding: "0 16px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {[
            { id: "perfil", label: "Dados Cadastrais", icon: User },
            { id: "afiliados", label: "Programa de Afiliados", icon: Award },
            { id: "indicacoes", label: "Indique e Ganhe", icon: Gift },
            { id: "plano", label: "Plano & Minutos", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 16px",
                  fontSize: "13px",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? "#FFFFFF" : "var(--text-muted)",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${isSelected ? "var(--brand-primary)" : "transparent"}`,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={15} color={isSelected ? "var(--brand-primary)" : "currentColor"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* TAB 1: DADOS CADASTRAIS & SEGURANÇA */}
          {activeTab === "perfil" && (
            <div>
              {/* Name Edit Form */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={16} color="var(--brand-primary)" /> Dados do Perfil
                </h3>

                {nameSuccess && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#6EE7B7",
                      fontSize: "13px",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircle2 size={16} color="#10B981" /> {nameSuccess}
                  </div>
                )}

                {nameError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#FCA5A5",
                      fontSize: "13px",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AlertCircle size={16} color="#EF4444" /> {nameError}
                  </div>
                )}

                <form onSubmit={handleUpdateName}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Nome de Exibição
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "#121028",
                        border: "1px solid var(--border-subtle)",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                      E-mail Cadastrado (Não alterável)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-muted)",
                        fontSize: "14px",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingName}
                    className="btn-primary"
                    style={{ padding: "8px 20px", fontSize: "13px", fontWeight: 700 }}
                  >
                    {savingName ? "Salvando..." : "Salvar Nome"}
                  </button>
                </form>
              </div>

              {/* Password Change Form */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "14px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Lock size={16} color="var(--brand-primary)" /> Alterar Senha de Acesso
                </h3>

                {passwordSuccess && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#6EE7B7",
                      fontSize: "13px",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircle2 size={16} color="#10B981" /> {passwordSuccess}
                  </div>
                )}

                {passwordError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#FCA5A5",
                      fontSize: "13px",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AlertCircle size={16} color="#EF4444" /> {passwordError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        Nova Senha
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 6 dígitos"
                          required
                          minLength={6}
                          style={{
                            width: "100%",
                            padding: "10px 38px 10px 12px",
                            borderRadius: "8px",
                            background: "#121028",
                            border: "1px solid var(--border-subtle)",
                            color: "#FFFFFF",
                            fontSize: "14px",
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
                          }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                        Confirmar Nova Senha
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                        required
                        minLength={6}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          background: "#121028",
                          border: "1px solid var(--border-subtle)",
                          color: "#FFFFFF",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn-secondary"
                    style={{ padding: "8px 20px", fontSize: "13px", fontWeight: 600 }}
                  >
                    {savingPassword ? "Atualizando..." : "Atualizar Senha"}
                  </button>
                </form>
              </div>

              {/* Account Identifier Card */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.25)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  ID do Usuário: <code style={{ color: "#FFFFFF", fontSize: "12px" }}>{user?.id || "N/A"}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="btn-ghost"
                  style={{ padding: "4px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {copiedUserId ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  {copiedUserId ? "Copiado!" : "Copiar ID"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRAMA DE AFILIADOS */}
          {activeTab === "afiliados" && (
            <div>
              {affiliateLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <RefreshCw size={24} className="spin" color="var(--brand-primary)" style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Verificando status de parceiro...</p>
                </div>
              ) : affiliateData && affiliateData.status === "active" ? (
                /* CASO 1: AFILIADO OFICIAL ATIVO */
                <div>
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)",
                      border: "1px solid rgba(16, 185, 129, 0.35)",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "100px",
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#6EE7B7",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <ShieldCheck size={14} color="#10B981" /> Afiliado Parceiro Oficial
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        Comissão: <strong style={{ color: "#FFFFFF" }}>25% em Pix</strong>
                      </span>
                    </div>

                    <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 4px", color: "#FFFFFF" }}>
                      Seu link oficial de divulgação está ativo
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px" }}>
                      Compartilhe este link com seu público. Qualquer venda gerada nos próximos 60 dias rende 25% de comissão direta no seu Pix.
                    </p>

                    {/* Copy Link Box */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#121028",
                        border: "1px solid rgba(124, 58, 237, 0.4)",
                        borderRadius: "10px",
                        padding: "6px 8px 6px 14px",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <code style={{ fontSize: "13px", color: "#A78BFA", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {affiliateUrl}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyAffiliate}
                        style={{
                          padding: "8px 14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: "none",
                          background: copiedAffiliateLink ? "#10B981" : "var(--brand-primary)",
                          color: "#FFFFFF",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s",
                        }}
                      >
                        {copiedAffiliateLink ? <Check size={14} /> : <Copy size={14} />}
                        {copiedAffiliateLink ? "Copiado!" : "Copiar"}
                      </button>
                      <button
                        type="button"
                        onClick={handleShareAffiliateWhatsApp}
                        style={{
                          padding: "8px 14px",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: "none",
                          background: "#059669",
                          color: "#FFFFFF",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Share2 size={14} /> WhatsApp
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Código: <strong style={{ color: "#FFFFFF" }}>{affiliateData.affiliate_code}</strong> • Chave Pix: <strong style={{ color: "#FFFFFF" }}>{affiliateData.pix_key}</strong>
                      </span>
                      <Link
                        href="/afiliados/painel"
                        className="btn-primary"
                        style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        Abrir Painel de Afiliado <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : affiliateData && affiliateData.status === "pending_review" ? (
                /* CASO 2: AFILIADO EM ANÁLISE */
                <div
                  style={{
                    padding: "24px",
                    borderRadius: "14px",
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    textAlign: "center",
                  }}
                >
                  <Clock size={36} color="#FCD34D" style={{ margin: "0 auto 12px" }} />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 12px",
                      borderRadius: "100px",
                      background: "rgba(245, 158, 11, 0.2)",
                      color: "#FCD34D",
                      display: "inline-block",
                      marginBottom: "12px",
                    }}
                  >
                    Candidatura em Análise de Moderação
                  </span>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 8px" }}>
                    Sua inscrição está sendo avaliada
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 18px" }}>
                    Recebemos os dados cadastrais para o código <strong>{affiliateData.affiliate_code}</strong>. Nossa equipe avalia os canais manualmente (prazo de 24 a 48 horas úteis). Assim que aprovado, você receberá o comunicado com o link de ativação via WhatsApp.
                  </p>
                </div>
              ) : (
                /* CASO 3: AINDA NÃO É AFILIADO */
                <div>
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      background: "radial-gradient(circle at top right, rgba(124, 58, 237, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%), var(--bg-card)",
                      border: "1px solid rgba(124, 58, 237, 0.35)",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Award size={18} color="#A78BFA" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Monetize sua Audiência
                      </span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.3 }}>
                      Ganhe 25% de comissão promovendo o Peguei o Texto
                    </h3>

                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 20px" }}>
                      Receba pagamentos recorrentes direto no seu Pix promovendo pacotes de minutos e assinaturas anuais da transcrição com Inteligência Artificial mais precisa do Brasil.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "22px" }}>
                      <div style={{ padding: "12px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ color: "#10B981", fontWeight: 800, fontSize: "16px" }}>25% fixo</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Em todas as vendas</div>
                      </div>
                      <div style={{ padding: "12px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ color: "#67E8F9", fontWeight: 800, fontSize: "16px" }}>Pix Direto</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Saques a partir de R$ 100</div>
                      </div>
                      <div style={{ padding: "12px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ color: "#A78BFA", fontWeight: 800, fontSize: "16px" }}>60 Dias</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px" }}>Janela de cookie ativo</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                      <Link
                        href="/afiliados#inscricao"
                        className="btn-primary"
                        style={{ padding: "10px 22px", fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        Quero me candidatar como afiliado <ArrowRight size={15} />
                      </Link>
                      <Link
                        href="/afiliados/login"
                        className="btn-ghost"
                        style={{ padding: "10px 16px", fontSize: "13px", textDecoration: "none" }}
                      >
                        Já é afiliado? Entrar
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INDIQUE E GANHE MINUTOS */}
          {activeTab === "indicacoes" && (
            <div>
              <div
                style={{
                  padding: "22px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Gift size={18} color="#A78BFA" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Programa de Recomendação
                  </span>
                </div>

                <h3 style={{ fontSize: "19px", fontWeight: 800, margin: "0 0 6px" }}>
                  Indique amigos e ganhe minutos de transcrição grátis
                </h3>

                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 18px" }}>
                  Você ganha <strong style={{ color: "#6EE7B7" }}>+10 minutos</strong> de créditos para cada pessoa que criar conta com o seu link, e seu amigo já começa com <strong style={{ color: "#67E8F9" }}>15 minutos grátis</strong>!
                </p>

                {/* Referral Link Box */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#121028",
                    border: "1px solid rgba(124, 58, 237, 0.4)",
                    borderRadius: "10px",
                    padding: "6px 8px 6px 14px",
                    marginBottom: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <code style={{ fontSize: "13px", color: "#67E8F9", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {referralUrl}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "8px",
                      border: "none",
                      background: copiedReferralLink ? "#10B981" : "var(--brand-primary)",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s",
                    }}
                  >
                    {copiedReferralLink ? <Check size={14} /> : <Copy size={14} />}
                    {copiedReferralLink ? "Copiado!" : "Copiar Link"}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareReferralWhatsApp}
                    style={{
                      padding: "8px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "8px",
                      border: "none",
                      background: "#059669",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Share2 size={14} /> WhatsApp
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <div style={{ padding: "14px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Amigos Convidados</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>{referralStats.total_invites}</div>
                  </div>
                  <div style={{ padding: "14px", background: "rgba(0, 0, 0, 0.3)", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Minutos Bônus Ganhos</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#6EE7B7" }}>+{referralStats.total_minutes_earned} min</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANO & MINUTOS */}
          {activeTab === "plano" && (
            <div>
              <div
                style={{
                  padding: "24px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Seu Plano Vigente
                    </span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, margin: "2px 0 0", color: "#FFFFFF" }}>
                      Plano {planLabel}
                    </h3>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Saldo Disponível</span>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#6EE7B7" }}>
                      {profile?.credits_minutes ?? 5} min
                    </div>
                  </div>
                </div>

                <div style={{ padding: "14px 18px", borderRadius: "10px", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.25)", marginBottom: "20px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Seus minutos nunca expiram enquanto sua conta estiver ativa. Ao transcrever novos vídeos, a duração é debitada proporcionalmente por minuto.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href="/precos"
                    className="btn-primary"
                    style={{ padding: "10px 22px", fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    Fazer Upgrade de Plano <Sparkles size={16} />
                  </Link>
                  <Link
                    href="/precos#pacotes"
                    className="btn-secondary"
                    style={{ padding: "10px 20px", fontSize: "13px", textDecoration: "none" }}
                  >
                    Recarregar Minutos Avulsos
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
