"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  Mail,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";

function AtivarAfiliadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("codigo") || searchParams.get("code") || "";

  const [loading, setLoading] = useState(true);
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadInfo() {
      if (!code) {
        setErrorMessage("Código de ativação não informado na URL. Verifique o link recebido no WhatsApp.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/affiliates?action=get_activation_info&code=${encodeURIComponent(code)}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setAffiliateInfo(data);
        } else {
          setErrorMessage(data.detail || "Candidatura não localizada com este código.");
        }
      } catch (err) {
        setErrorMessage("Erro ao conectar ao servidor. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    loadInfo();
  }, [code]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 6) {
      setFormError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não coincidem. Digite a mesma senha nos dois campos.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/affiliates?action=affiliate_set_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliate_code: code,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("affiliate_session_token", data.token);
          localStorage.setItem("my_affiliate_code", code);
        }

        setFormSuccess("Senha criada com sucesso! Redirecionando para seu painel...");
        setTimeout(() => {
          router.push("/afiliados/painel");
        }, 1500);
      } else {
        setFormError(data.detail || "Erro ao definir senha.");
      }
    } catch (err) {
      setFormError("Erro de conexão ao servidor. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: 520 }}>
        {/* LOADING STATE */}
        {loading ? (
          <div className="glass-card" style={{ padding: "60px 24px", textAlign: "center" }}>
            <RefreshCw size={36} className="spin" style={{ margin: "0 auto 16px", color: "var(--brand-primary)" }} />
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Validando link de aprovação...</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "6px" }}>
              Aguarde um instante.
            </p>
          </div>
        ) : errorMessage ? (
          /* ERROR STATE (INVALID OR NOT FOUND) */
          <div className="glass-card" style={{ padding: "40px 32px", textAlign: "center" }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <AlertCircle size={28} color="#EF4444" />
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px" }}>
              Link Não Encontrado
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 24px" }}>
              {errorMessage}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/afiliados" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "13px", textDecoration: "none" }}>
                Conhecer o Programa
              </Link>
              <Link href="/afiliados/login" className="btn-primary" style={{ padding: "10px 20px", fontSize: "13px", textDecoration: "none" }}>
                Ir para o Login
              </Link>
            </div>
          </div>
        ) : affiliateInfo?.status === "pending_review" ? (
          /* PENDING REVIEW STATE */
          <div className="glass-card" style={{ padding: "40px 32px", textAlign: "center" }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <Clock size={28} color="#F59E0B" />
            </div>

            <span className="badge badge-purple" style={{ marginBottom: "10px" }}>
              Candidatura em Moderação
            </span>

            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "6px 0 10px" }}>
              Olá, {affiliateInfo?.full_name}!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 24px" }}>
              Sua inscrição ainda está sendo avaliada por nossos moderadores. A criação de senha e o acesso ao painel serão liberados assim que a aprovação for confirmada.
            </p>

            <Link href="/" className="btn-primary" style={{ padding: "10px 24px", fontSize: "13px", textDecoration: "none" }}>
              Voltar para o Início
            </Link>
          </div>
        ) : affiliateInfo?.has_password ? (
          /* ALREADY HAS PASSWORD */
          <div className="glass-card" style={{ padding: "40px 32px", textAlign: "center" }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <CheckCircle2 size={28} color="#10B981" />
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px" }}>
              Senha Já Cadastrada!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 24px" }}>
              Olá, <strong>{affiliateInfo?.full_name}</strong>! Você já criou sua senha anteriormente. Acesse a tela de login para entrar diretamente no seu painel com seu e-mail: <strong style={{ color: "#FFFFFF" }}>{affiliateInfo?.email}</strong>.
            </p>

            <Link href={`/afiliados/login?email=${encodeURIComponent(affiliateInfo?.email || "")}`} className="btn-primary" style={{ padding: "11px 26px", fontSize: "14px", textDecoration: "none" }}>
              Acessar Tela de Login <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* ACTIVE AFFILIATE: SET PASSWORD FORM */
          <div
            className="glass-card"
            style={{
              padding: "36px 32px",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 70%), var(--bg-card)",
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
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)",
                  border: "1px solid rgba(16, 185, 129, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <KeyRound size={26} color="#6EE7B7" />
              </div>

              <span
                className="badge badge-purple"
                style={{
                  marginBottom: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#6EE7B7",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                }}
              >
                <CheckCircle2 size={13} color="#10B981" /> Cadastro Aprovado com Sucesso!
              </span>

              <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 4px" }}>
                Crie sua Senha de Acesso
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
                Olá, <strong>{affiliateInfo?.full_name}</strong>! Defina sua senha pessoal para acessar o seu painel de parceiro.
              </p>
            </div>

            {/* Error Alert */}
            {formError && (
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
                <span>{formError}</span>
              </div>
            )}

            {/* Success Alert */}
            {formSuccess && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#6EE7B7",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0 }} />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSetPassword}>
              {/* Email (Readonly & Locked) */}
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
                  Seu E-mail de Usuário (Fixo da Moderação)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    disabled
                    value={affiliateInfo?.email || ""}
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 38px",
                      borderRadius: "10px",
                      background: "rgba(0, 0, 0, 0.4)",
                      color: "#A78BFA",
                      fontWeight: 600,
                      border: "1px solid var(--border-subtle)",
                      fontSize: "14px",
                      cursor: "not-allowed",
                      outline: "none",
                    }}
                  />
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  Este será o e-mail que você utilizará para fazer login no seu painel.
                </span>
              </div>

              {/* Password */}
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
                  Nova Senha de Acesso (Mínimo 6 caracteres) *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha segura"
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
                  <Lock
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

              {/* Confirm Password */}
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
                  Confirme a Senha *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha digitada"
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
                  <KeyRound
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "14px",
                  fontWeight: 800,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="spin" /> Criando Senha e Acessando...
                  </>
                ) : (
                  <>
                    Salvar Senha e Acessar Painel <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AtivarAfiliadoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <Suspense
        fallback={
          <div style={{ paddingTop: "140px", textAlign: "center" }}>
            <RefreshCw size={36} className="spin" style={{ margin: "0 auto", color: "var(--brand-primary)" }} />
          </div>
        }
      >
        <AtivarAfiliadoContent />
      </Suspense>
      <Footer />
    </main>
  );
}
