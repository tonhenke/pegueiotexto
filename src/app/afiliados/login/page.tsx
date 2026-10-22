"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  Award,
} from "lucide-react";

function AfiliadoLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefilledEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPendingNotice(null);
    setActivationCode(null);

    if (!email.trim() || !password) {
      setErrorMsg("Informe o e-mail e a senha cadastrados.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/affiliates?action=affiliate_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("affiliate_session_token", data.token);
          if (data.affiliate?.affiliate_code) {
            localStorage.setItem("my_affiliate_code", data.affiliate.affiliate_code);
          }
        }
        router.push("/afiliados/painel");
      } else {
        if (data.status === "pending_review") {
          setPendingNotice(data.detail);
        } else if (data.needs_activation && data.affiliate_code) {
          setActivationCode(data.affiliate_code);
          setErrorMsg(data.detail);
        } else {
          setErrorMsg(data.detail || "E-mail ou senha incorretos.");
        }
      }
    } catch (err) {
      setErrorMsg("Erro de conexão ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px" }}>
      <div className="container" style={{ maxWidth: 460 }}>
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
              <Award size={26} color="#A78BFA" />
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
              <ShieldCheck size={13} color="#A78BFA" /> Portal do Parceiro Afiliado
            </span>

            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "6px 0 4px" }}>
              Entrar no Painel de Afiliado
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
              Acesse suas métricas em tempo real, links de divulgação e solicitação de saques Pix.
            </p>
          </div>

          {/* Pending Notice Alert */}
          {pendingNotice && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#FCD34D",
                fontSize: "13px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              <Clock size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Candidatura em Moderação:</strong>
                <p style={{ margin: "4px 0 0" }}>{pendingNotice}</p>
              </div>
            </div>
          )}

          {/* Activation Notice Alert */}
          {activationCode && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#6EE7B7",
                fontSize: "13px",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontWeight: 700 }}>
                <CheckCircle2 size={16} color="#10B981" /> Parabéns, você foi aprovado!
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--text-secondary)" }}>
                Para o primeiro acesso, você só precisa cadastrar a sua senha pessoal.
              </p>
              <Link
                href={`/afiliados/ativar?codigo=${activationCode}`}
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                }}
              >
                Cadastrar Senha Agora <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && !activationCode && (
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
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
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
                E-mail do Cadastro *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
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
                Senha de Acesso *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
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
              disabled={loading}
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
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" /> Verificando Acesso...
                </>
              ) : (
                <>
                  Entrar no Painel <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sub Links */}
          <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "18px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "0 0 10px" }}>
              Ainda não participa do programa?
            </p>
            <Link
              href="/afiliados"
              style={{
                fontSize: "13px",
                color: "var(--brand-primary)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Inscreva-se como Afiliado e ganhe 25% →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AfiliadosLoginPage() {
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
        <AfiliadoLoginContent />
      </Suspense>
      <Footer />
    </main>
  );
}
