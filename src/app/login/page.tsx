"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Mail,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const isSignupParam = searchParams.get("signup") === "true";
  const reasonParam = searchParams.get("reason");
  const redirectParam = searchParams.get("redirect");
  const refParam = searchParams.get("ref");

  const [hasReferral, setHasReferral] = useState(false);
  const [isLogin, setIsLogin] = useState(!isSignupParam && reasonParam !== "transcribe" && !refParam);

  // OTP Verification Step State
  const [otpStep, setOtpStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let ref = refParam;
      if (!ref) {
        const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
        if (match) ref = decodeURIComponent(match[1]);
      }
      if (ref) {
        localStorage.setItem("pegueiotexto_ref", ref);
        document.cookie = `pegueiotexto_ref=${encodeURIComponent(ref)};path=/;max-age=${60 * 24 * 60 * 60}`;
        setHasReferral(true);
        setIsLogin(false);
      } else {
        const storedRef = localStorage.getItem("pegueiotexto_ref");
        if (storedRef) {
          setHasReferral(true);
        }
      }
    }
  }, [refParam]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus OTP input when switching to OTP step
  useEffect(() => {
    if (otpStep === "otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [otpStep]);

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      let refToPass = refParam || (typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_ref") : null);
      if (!refToPass && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
        if (match) refToPass = decodeURIComponent(match[1]);
      }
      const refQuery = refToPass ? `&ref=${encodeURIComponent(refToPass)}` : "";
      const target = `${window.location.origin}/dashboard?auto_transcribe=true${refQuery}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: target,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro Google login:", err);
      setErrorMsg(err.message || "Erro ao conectar com Google.");
      setLoading(false);
    }
  };

  const redirectAfterAuth = () => {
    if (redirectParam) {
      router.push(redirectParam);
    } else {
      router.push("/dashboard?auto_transcribe=true");
    }
  };

  // Envio inicial (Login ou Step 1 do Cadastro com envio de OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Preencha e-mail e senha.");
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg("Por favor, informe seu nome.");
      return;
    }

    if (!isLogin && password.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Fluxo de Login tradicional
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("E-mail ou senha incorretos.");
          }
          throw error;
        }

        if (data.user) {
          redirectAfterAuth();
        }
      } else {
        // Fluxo de Cadastro: Step 1 -> Enviar OTP com validação rigorosa de DNS MX e descartáveis
        const res = await fetch("/api/auth/otp?action=send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            name: name.trim(),
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Erro ao validar e-mail.");
        }

        setOtpStep("otp");
        setOtpCode("");
        setResendCooldown(60);
        setSuccessMsg(`Código de 6 dígitos enviado para ${email.trim()}!`);
      }
    } catch (err: any) {
      console.error("Erro auth:", err);
      setErrorMsg(err.message || "Ocorreu um erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  // Verificação do Código OTP de 6 dígitos
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim().replace(/\s+/g, "");
    if (code.length < 6) {
      setErrorMsg("Digite o código completo de 6 dígitos.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      let effectiveRef =
        (typeof window !== "undefined" &&
          (localStorage.getItem("pegueiotexto_ref") ||
            localStorage.getItem("pending_referral_code") ||
            localStorage.getItem("peguei_affiliate_click_code"))) ||
        "";

      if (!effectiveRef && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
        if (match) effectiveRef = decodeURIComponent(match[1]);
      }

      const res = await fetch("/api/auth/otp?action=verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code,
          ref_code: effectiveRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Código incorreto ou expirado.");
      }

      // Logar imediatamente na sessão com as credenciais confirmadas
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // Limpar rastro de convite local
      if (typeof window !== "undefined") {
        localStorage.removeItem("pegueiotexto_ref");
        localStorage.removeItem("pending_referral_code");
        document.cookie = "pegueiotexto_ref=;path=/;max-age=0";
      }

      setSuccessMsg("Conta confirmada com sucesso! Liberando seus minutos...");
      setTimeout(() => {
        redirectAfterAuth();
      }, 700);
    } catch (err: any) {
      console.error("Erro OTP verify:", err);
      setErrorMsg(err.message || "Código incorreto ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp?action=send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Não foi possível reenviar o código.");
      }

      setSuccessMsg("Novo código enviado com sucesso para seu e-mail!");
      setResendCooldown(60);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao reenviar código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <Link href="/" style={{ display: "inline-block", textDecoration: "none", marginBottom: "16px" }}>
          <Image
            src="/logo.png"
            alt="Peguei o Texto"
            width={160}
            height={75}
            priority
            style={{ height: "54px", width: "auto", objectFit: "contain" }}
          />
        </Link>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>
          {isLogin
            ? "Bem-vindo de volta"
            : otpStep === "otp"
            ? "Confirme seu e-mail"
            : "Criar conta grátis"}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {isLogin
            ? "Entre para acessar suas transcrições"
            : otpStep === "otp"
            ? "Validação de segurança em 1 etapa"
            : "5 minutos grátis no cadastro. Sem cartão."}
        </p>
      </div>

      {/* Referral Welcome Bonus Banner */}
      {hasReferral && otpStep === "form" && (
        <div style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.16) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.45)",
          borderRadius: "14px",
          padding: "16px 18px",
          marginBottom: "20px",
          textAlign: "left",
          boxShadow: "0 4px 20px rgba(16, 185, 129, 0.18)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6EE7B7", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
            <span>🎁</span> Convite de Amigo Ativado!
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#E2E8F0", lineHeight: 1.5 }}>
            Você foi convidado! Crie sua conta grátis agora e ganhe <strong>15 minutos</strong> (5 minutos de cadastro + <strong>10 minutos bônus de presente</strong>).
          </p>
        </div>
      )}

      {/* Motivating banner if redirected from transcribe */}
      {(reasonParam === "transcribe" || isSignupParam) && !hasReferral && otpStep === "form" && (
        <div style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.15))",
          border: "1px solid rgba(124,58,237,0.35)",
          borderRadius: "14px",
          padding: "16px 18px",
          marginBottom: "20px",
          textAlign: "left",
          boxShadow: "0 4px 20px rgba(124,58,237,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A78BFA", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
            <Sparkles size={16} /> Falta pouco para ver sua transcrição!
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
            Crie sua conta em 10 segundos para acessar o texto. Você já começa com <strong>5 minutos grátis</strong> creditados automaticamente!
          </p>
        </div>
      )}

      {/* Card */}
      <div className="glass-card" style={{ padding: "34px" }}>
        {/* Feedback messages */}
        {errorMsg && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px", marginBottom: "20px",
            borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#FCA5A5", fontSize: "13px", lineHeight: 1.4
          }}>
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 16px", marginBottom: "20px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "#6EE7B7", fontSize: "13px", lineHeight: 1.4
          }}>
            <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: STEP OTP (VERIFICAÇÃO DE CÓDIGO DE 6 DÍGITOS) */}
        {/* ======================================================== */}
        {!isLogin && otpStep === "otp" ? (
          <div>
            <div style={{ textAlign: "center", marginBottom: "22px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                boxShadow: "0 0 25px rgba(124, 58, 237, 0.2)"
              }}>
                <Mail size={24} color="#A78BFA" />
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, margin: "0 0 8px" }}>
                Enviamos um código de 6 dígitos para:
              </p>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px", padding: "4px 12px", color: "#F1F5F9", fontSize: "13px", fontWeight: 600
              }}>
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("form");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "transparent", border: "none", color: "#A78BFA",
                    fontSize: "12px", cursor: "pointer", textDecoration: "underline", padding: 0
                  }}
                >
                  Alterar
                </button>
              </div>
            </div>

            {/* OTP Form with accessible single input and visual segmented boxes */}
            <form
              id="otp-verification-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOtp();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div>
                <label
                  htmlFor="otp-code-input"
                  style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "10px", textAlign: "center" }}
                >
                  Digite o código recebido:
                </label>

                {/* Container com input real invisível e caixas visuais estilizadas */}
                <div style={{ position: "relative", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
                  <input
                    ref={otpInputRef}
                    id="otp-code-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtpCode(val);
                      setErrorMsg("");
                      if (val.length === 6) {
                        handleVerifyOtp(val);
                      }
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "text",
                      zIndex: 2,
                    }}
                  />

                  {/* 6 Caixas Visuais Espaçadas */}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const char = otpCode[idx] || "";
                      const isFocused = otpCode.length === idx || (idx === 5 && otpCode.length === 6);
                      return (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            height: "56px",
                            borderRadius: "12px",
                            background: "rgba(15, 12, 30, 0.8)",
                            border: isFocused
                              ? "2px solid #8B5CF6"
                              : char
                              ? "1px solid rgba(139, 92, 246, 0.5)"
                              : "1px solid rgba(255, 255, 255, 0.12)",
                            boxShadow: isFocused ? "0 0 16px rgba(139, 92, 246, 0.35)" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: 800,
                            fontFamily: "ui-monospace, monospace",
                            color: "#FFFFFF",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {char}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>
                  Dica: Você pode copiar e colar o código de 6 dígitos diretamente.
                </p>
              </div>

              {/* Botão de Verificação */}
              <button
                id="btn-confirm-otp"
                type="submit"
                className="btn-primary"
                disabled={loading || otpCode.length < 6}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "15px",
                  padding: "14px",
                  opacity: loading || otpCode.length < 6 ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verificando e liberando conta...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Confirmar e Liberar 5 Minutos
                  </>
                )}
              </button>

              {/* Ações de Reenvio e Voltar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("form");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="btn-ghost"
                  style={{ fontSize: "13px", padding: 0, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ArrowLeft size={14} /> Voltar
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="btn-ghost"
                  style={{
                    fontSize: "13px",
                    padding: 0,
                    color: resendCooldown > 0 ? "var(--text-muted)" : "#A78BFA",
                    cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                  {resendCooldown > 0 ? `Reenviar código em ${resendCooldown}s` : "Reenviar código"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: LOGIN OU STEP 1 DO CADASTRO (FORMULÁRIO) */
          /* ======================================================== */
          <div>
            {/* Social login */}
            <button
              id="btn-google-login"
              type="button"
              className="btn-secondary"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", fontSize: "15px", marginBottom: "20px", opacity: loading ? 0.7 : 1 }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continuar com Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div className="divider" style={{ flex: 1, margin: 0 }} />
              <span style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 500 }}>ou com e-mail</span>
              <div className="divider" style={{ flex: 1, margin: 0 }} />
            </div>

            {/* Form */}
            <form style={{ display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "8px" }}>Nome</label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    className="input-base"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "8px" }}>E-mail</label>
                <input
                  id="input-email"
                  type="email"
                  required
                  className="input-base"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>Senha</label>
                  {isLogin && <a href="#" style={{ fontSize: "12px", color: "#A78BFA", textDecoration: "none" }}>Esqueceu?</a>}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="input-password"
                    type={showPass ? "text" : "password"}
                    required
                    className="input-base"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", padding: "6px" }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {!isLogin && (
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px", margin: "6px 0 0" }}>
                    Mínimo de 6 caracteres.
                  </p>
                )}
              </div>

              <button
                id="btn-submit-auth"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", fontSize: "15px", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> {isLogin ? "Conectando..." : "Verificando e-mail..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Entrar" : "Continuar para confirmação"} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Toggle */}
      <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-muted)", fontSize: "14px" }}>
        {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          id="btn-toggle-auth"
          type="button"
          className="btn-ghost"
          onClick={() => {
            setIsLogin(!isLogin);
            setOtpStep("form");
            setErrorMsg("");
            setSuccessMsg("");
          }}
          style={{ padding: "0", color: "#A78BFA", fontWeight: 600, fontSize: "14px" }}
        >
          {isLogin ? "Criar grátis" : "Entrar"}
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* Glow orbs */}
      <div className="glow-orb glow-orb-1" style={{ opacity: 0.5 }} />
      <div className="glow-orb glow-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "120px 24px 60px", position: "relative" }}>
        <Suspense fallback={<div style={{ textAlign: "center", color: "#94a3b8" }}><Loader2 className="animate-spin" size={28} /></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
