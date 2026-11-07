"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Lock,
  FileAudio,
  Play,
  Clock,
  ShieldCheck,
  Check,
  Globe,
  Video,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPendingMedia } from "@/lib/pendingMedia";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const isSignupParam = searchParams.get("signup") === "true";
  const reasonParam = searchParams.get("reason");
  const redirectParam = searchParams.get("redirect") || "";
  const refParam = searchParams.get("ref");
  const bonusParam = searchParams.get("bonus");
  const emailParam = searchParams.get("email");
  const langParam = searchParams.get("lang");
  const previewParam = searchParams.get("preview") === "true";
  const hasBonus15 = bonusParam === "15min";

  // Language state: PT or EN
  const initialIsEn =
    langParam === "en" ||
    redirectParam.includes("/en/") ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/en"));
  const [isEn, setIsEn] = useState(initialIsEn);

  const [hasReferral, setHasReferral] = useState(false);
  const [isLogin, setIsLogin] = useState(
    !isSignupParam && reasonParam !== "transcribe" && !refParam && !hasBonus15 && !previewParam
  );

  // Preview state
  const [showPreview, setShowPreview] = useState(previewParam || reasonParam === "transcribe");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    title: string;
    platform: string;
    thumbnail?: string;
    duration: number;
    total_minutes: number;
    preview_text: string;
    segments?: Array<{ start: number; end: number; text: string }>;
    exceeds_free: boolean;
    fileName?: string;
    fileSize?: number;
  } | null>(null);

  // Form fields
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Referral and 15-min bonus effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (hasBonus15) {
        setIsLogin(false);
        if (emailParam) {
          setEmail(decodeURIComponent(emailParam));
        }
      }

      let ref = refParam;
      if (!ref) {
        const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
        if (match) ref = decodeURIComponent(match[1]);
      }
      if (ref) {
        localStorage.setItem("pegueiotexto_ref", ref);
        document.cookie = `pegueiotexto_ref=${encodeURIComponent(ref)};path=/;max-age=${
          60 * 24 * 60 * 60
        }`;
        setHasReferral(true);
        setIsLogin(false);
      } else {
        const storedRef = localStorage.getItem("pegueiotexto_ref");
        if (storedRef) {
          setHasReferral(true);
        }
      }
    }
  }, [refParam, hasBonus15, emailParam]);

  // Load pending media and fetch preview
  useEffect(() => {
    let isMounted = true;

    async function loadPreview() {
      try {
        const pending = await getPendingMedia();
        if (!pending) return;

        setShowPreview(true);
        setIsLogin(false);

        // Case 1: Uploaded local file
        if (pending.mode === "upload" || pending.fileName) {
          const dur = pending.duration || 180;
          const totalMin = Math.max(1, Math.ceil(dur / 60));
          const sample = isEn
            ? "Audio file loaded and ready for full transcription. Our AI model will transcribe speech, detect speakers, and generate synchronized subtitles."
            : "Arquivo de áudio carregado e pronto para transcrição completa. Nosso modelo de IA transcreverá as falas, identificará pontuação e gerará legendas sincronizadas.";

          if (isMounted) {
            setPreviewData({
              title: pending.fileName || (isEn ? "Audio File" : "Arquivo de Áudio"),
              platform: isEn ? "Uploaded File" : "Arquivo de Áudio",
              duration: dur,
              total_minutes: totalMin,
              preview_text: sample,
              exceeds_free: dur > 300,
              fileName: pending.fileName,
              fileSize: pending.fileSize,
            });
          }
          return;
        }

        // Case 2: URL to preview
        if (pending.url) {
          setPreviewLoading(true);
          try {
            const res = await fetch("/api/transcribe/preview", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: pending.url,
                language: isEn ? "en" : "auto",
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (isMounted) {
                setPreviewData({
                  title: data.title || (isEn ? "Web Video" : "Vídeo da Internet"),
                  platform: data.platform || "Web",
                  thumbnail: data.thumbnail,
                  duration: data.duration || 180,
                  total_minutes: data.total_minutes || Math.max(1, Math.ceil((data.duration || 180) / 60)),
                  preview_text:
                    data.preview_text ||
                    (isEn
                      ? "Transcription sample successfully generated with high-accuracy AI."
                      : "Amostra da transcrição gerada com sucesso pela Inteligência Artificial."),
                  segments: data.segments,
                  exceeds_free: (data.duration || 180) > 300,
                });
              }
            }
          } catch (e) {
            console.warn("Could not fetch online preview:", e);
          } finally {
            if (isMounted) setPreviewLoading(false);
          }
        }
      } catch (err) {
        console.warn("Error loading preview:", err);
      }
    }

    loadPreview();
    return () => {
      isMounted = false;
    };
  }, [isEn]);

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      let refToPass =
        refParam || (typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_ref") : null);
      if (!refToPass && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
        if (match) refToPass = decodeURIComponent(match[1]);
      }
      const refQuery = refToPass ? `&ref=${encodeURIComponent(refToPass)}` : "";
      const dashboardPath = isEn ? "/en/dashboard" : "/dashboard";
      const target = `${window.location.origin}${dashboardPath}?auto_transcribe=true${refQuery}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: target,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro Google login:", err);
      setErrorMsg(err.message || (isEn ? "Error connecting with Google." : "Erro ao conectar com Google."));
      setLoading(false);
    }
  };

  const redirectAfterAuth = () => {
    if (redirectParam) {
      router.push(redirectParam);
    } else {
      router.push(isEn ? "/en/dashboard?auto_transcribe=true" : "/dashboard?auto_transcribe=true");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg(isEn ? "Please enter email and password." : "Preencha e-mail e senha.");
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg(isEn ? "Please provide your name." : "Por favor, informe seu nome.");
      return;
    }

    if (!isLogin && password.length < 6) {
      setErrorMsg(
        isEn
          ? "Password must be at least 6 characters long."
          : "A senha deve ter no mínimo 6 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error(isEn ? "Incorrect email or password." : "E-mail ou senha incorretos.");
          }
          throw error;
        }

        if (data.user) {
          redirectAfterAuth();
        }
      } else {
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email.trim(),
              name: name.trim(),
              password,
              ref_code: effectiveRef,
              bonus_code: hasBonus15 ? "15min" : undefined,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(
              data.detail ||
                (isEn ? "Could not create account. Please try again." : "Não foi possível criar a conta. Tente novamente.")
            );
          }

          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (signInErr) {
            console.warn("Aviso signIn pós cadastro:", signInErr);
          }

          if (typeof window !== "undefined") {
            localStorage.removeItem("pegueiotexto_ref");
            localStorage.removeItem("pending_referral_code");
            document.cookie = "pegueiotexto_ref=;path=/;max-age=0";
          }

          setSuccessMsg(
            isEn
              ? "Account created successfully! Unlocking your minutes..."
              : "Conta criada com sucesso! Liberando seus minutos..."
          );
          setTimeout(() => {
            redirectAfterAuth();
          }, 600);
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          if (fetchErr.name === "AbortError") {
            throw new Error(
              isEn
                ? "Server took too long to respond. Please check connection and try again."
                : "O servidor demorou para responder. Verifique sua conexão e tente novamente."
            );
          }
          throw fetchErr;
        }
      }
    } catch (err: any) {
      console.error("Erro auth:", err);
      setErrorMsg(
        err.message ||
          (isEn ? "An authentication error occurred." : "Ocorreu um erro na autenticação.")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDurationDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: showPreview ? "1100px" : "440px",
        margin: "0 auto",
        transition: "all 0.3s ease",
      }}
    >
      {/* Top Bar with Logo & Language Selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          width: "100%",
        }}
      >
        <Link href={isEn ? "/en" : "/"} style={{ display: "inline-block", textDecoration: "none" }}>
          <Image
            src="/logo.png"
            alt="Peguei o Texto"
            width={160}
            height={75}
            priority
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
          />
        </Link>

        {/* Language Switcher Pill */}
        <button
          type="button"
          onClick={() => setIsEn(!isEn)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#E2E8F0",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          title={isEn ? "Mudar para Português" : "Switch to English"}
        >
          <Globe size={13} color="#A78BFA" />
          <span>{isEn ? "🇺🇸 EN" : "🇧🇷 PT"}</span>
        </button>
      </div>

      {/* Main Container: Split-screen if preview is active, centered single column if not */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showPreview ? "repeat(auto-fit, minmax(360px, 1fr))" : "1fr",
          gap: "28px",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        {/* ======================================================== */}
        {/* LEFT PANEL: TRANSCRIPTION TEASER PREVIEW (IF ACTIVE)   */}
        {/* ======================================================== */}
        {showPreview && (
          <div
            className="clint-card"
            style={{
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(167, 139, 250, 0.35)",
              background:
                "linear-gradient(145deg, rgba(22, 13, 38, 0.95) 0%, rgba(10, 6, 20, 0.98) 100%)",
              boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(124, 58, 237, 0.18)",
              borderRadius: "24px",
            }}
          >
            {/* Top Badge */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.35)",
                    color: "#6EE7B7",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#10B981",
                      boxShadow: "0 0 8px #10B981",
                    }}
                  />
                  {isEn ? "AI Preview Generated" : "Prévia IA Gerada"}
                </div>

                {previewData && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#A78BFA",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    <Clock size={13} />
                    <span>
                      {previewData.duration
                        ? formatDurationDisplay(previewData.duration)
                        : "3:00"}
                    </span>
                  </div>
                )}
              </div>

              {/* Media Title & Info */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.3))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                  }}
                >
                  {previewData?.platform === "YouTube" ? (
                    <Video size={20} color="#F87171" />
                  ) : (
                    <FileAudio size={20} color="#A78BFA" />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {previewData?.title ||
                      (previewLoading
                        ? isEn
                          ? "Analyzing media..."
                          : "Identificando mídia..."
                        : isEn
                        ? "Selected Audio/Video"
                        : "Áudio/Vídeo Selecionado")}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      margin: "3px 0 0 0",
                    }}
                  >
                    {previewData?.platform || "Peguei o Texto IA"} •{" "}
                    {isEn ? "Whisper Large v3" : "Modelo Whisper v3"}
                  </p>
                </div>
              </div>

              {/* Transcription Snippet Preview */}
              <div
                style={{
                  background: "rgba(5, 3, 10, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "rgba(167, 139, 250, 0.15)",
                    color: "#C4B5FD",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  [00:00 - 00:26]
                </div>

                {previewLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#A78BFA", padding: "16px 0" }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span style={{ fontSize: "13px" }}>
                      {isEn ? "Extracting audio preview with AI..." : "Transcrevendo amostra rápida com IA..."}
                    </span>
                  </div>
                ) : (
                  <>
                    <p
                      style={{
                        color: "#F1F5F9",
                        fontSize: "13.5px",
                        lineHeight: "1.7",
                        margin: 0,
                        fontWeight: 450,
                      }}
                    >
                      {previewData?.preview_text ||
                        (isEn
                          ? "Welcome to Peguei o Texto! Your audio has been identified and transcribed with state-of-the-art AI precision."
                          : "Olá e bem-vindo ao Peguei o Texto! Seu áudio foi identificado e processado com máxima fidelidade pela inteligência artificial.")}
                    </p>

                    {/* Blurred lines simulation */}
                    <div
                      style={{
                        marginTop: "12px",
                        filter: "blur(4.5px)",
                        userSelect: "none",
                        pointerEvents: "none",
                        color: "#94A3B8",
                        fontSize: "13px",
                        lineHeight: "1.7",
                      }}
                    >
                      <p style={{ margin: "4px 0", opacity: 0.85 }}>
                        {isEn
                          ? "The full transcription contains detailed timestamps, speaker identification, and executive summaries."
                          : "A transcrição completa contém marcas temporais detalhadas por minuto, identificação de falas e resumos executivos inteligentes."}
                      </p>
                      <p style={{ margin: "4px 0", opacity: 0.55 }}>
                        {isEn
                          ? "Export in .SRT for CapCut, Premiere and YouTube, plus clean text without grammatical errors."
                          : "Exporte em formato .SRT para CapCut, Premiere e YouTube, além do texto limpo sem erros gramaticais."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Lock Box with 5-minute Free Plan Rules / Upsell Notification */}
            <div
              style={{
                borderRadius: "16px",
                padding: "16px 18px",
                background:
                  previewData?.exceeds_free
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(124, 58, 237, 0.12) 100%)"
                    : "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(124, 58, 237, 0.14) 100%)",
                border: previewData?.exceeds_free
                  ? "1px solid rgba(245, 158, 11, 0.35)"
                  : "1px solid rgba(16, 185, 129, 0.35)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: previewData?.exceeds_free ? "#FCD34D" : "#6EE7B7",
                  fontWeight: 700,
                  fontSize: "13px",
                  marginBottom: "6px",
                }}
              >
                <Lock size={15} />
                {previewData?.exceeds_free
                  ? isEn
                    ? `Total: ${previewData.total_minutes} min (Free plan includes 5 min)`
                    : `Arquivo com ${previewData.total_minutes} min (Plano grátis inclui 5 min)`
                  : isEn
                  ? "100% Covered by your Free 5-Minute Signup Gift!"
                  : "100% Coberto pelo seu Presente de 5 Minutos Grátis!"}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "12.5px",
                  color: "#E2E8F0",
                  lineHeight: 1.5,
                }}
              >
                {previewData?.exceeds_free
                  ? isEn
                    ? `Your free signup gives you 5 free minutes to test. Since this media is ${previewData.total_minutes} minutes, you will be able to unlock the remainder by adding extra minutes or upgrading in 1 click inside your dashboard.`
                    : `Seu cadastro inclui 5 minutos grátis para você testar. Como este arquivo possui ${previewData.total_minutes} minutos, você poderá desbloquear o restante adquirindo créditos avulsos ou plano com 1 clique no painel.`
                  : isEn
                  ? "Complete your free signup to unlock the full transcript, AI executive summary, and export subtitles (.SRT) right away."
                  : "Conclua seu cadastro grátis ao lado para destravar a transcrição completa, o resumo executivo de IA e exportar legendas (.SRT)."}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px",
                  fontSize: "11px",
                  color: "#94A3B8",
                }}
              >
                <ShieldCheck size={14} color="#10B981" />
                <span>
                  {isEn
                    ? "Encrypted processing • Media permanently deleted after processing"
                    : "Processamento criptografado • Arquivos excluídos permanentemente após o uso"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RIGHT PANEL: SIGNUP / LOGIN FORM                         */}
        {/* ======================================================== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Main Title */}
          <div style={{ textAlign: showPreview ? "left" : "center", marginBottom: "22px" }}>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "6px",
                color: "#FFFFFF",
              }}
            >
              {isLogin
                ? isEn
                  ? "Welcome back"
                  : "Bem-vindo de volta"
                : showPreview
                ? isEn
                  ? "Unlock your full transcript"
                  : "Desbloqueie sua transcrição"
                : isEn
                ? "Create free account"
                : "Criar conta grátis"}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
              {isLogin
                ? isEn
                  ? "Sign in to access your transcription dashboard"
                  : "Entre para acessar suas transcrições"
                : isEn
                ? "5 free minutes upon signup. No credit card required."
                : "5 minutos grátis no cadastro. Sem cartão de crédito."}
            </p>
          </div>

          {/* 15-Minute Bonus Banner from Downloader */}
          {hasBonus15 && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(124, 58, 237, 0.28) 0%, rgba(236, 72, 153, 0.22) 100%)",
                border: "1px solid rgba(167, 139, 250, 0.55)",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "20px",
                textAlign: "left",
                boxShadow: "0 6px 24px rgba(124, 58, 237, 0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#C4B5FD",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                <span>🎁</span> {isEn ? "15-Minute Bonus Activated!" : "Presente de 15 Minutos Ativado!"}
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#E2E8F0", lineHeight: 1.5 }}>
                {isEn
                  ? "Complete your signup to unlock 15 free minutes in your balance!"
                  : "Conclua seu cadastro para liberar 15 minutos grátis de transcrição no seu saldo!"}
              </p>
            </div>
          )}

          {/* Referral Welcome Bonus Banner */}
          {hasReferral && !hasBonus15 && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.16) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.45)",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "20px",
                textAlign: "left",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#6EE7B7",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                <span>🎁</span> {isEn ? "Friend Referral Activated!" : "Convite de Amigo Ativado!"}
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#E2E8F0", lineHeight: 1.5 }}>
                {isEn
                  ? "You were invited! Sign up now to receive 15 minutes (5 min base + 10 min bonus gift)."
                  : "Você foi convidado! Crie sua conta grátis agora e ganhe 15 minutos (5 min cadastro + 10 min de presente)."}
              </p>
            </div>
          )}

          {/* Card */}
          <div className="glass-card" style={{ padding: "30px", borderRadius: "20px" }}>
            {/* Feedback messages */}
            {errorMsg && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  marginBottom: "18px",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#FCA5A5",
                  fontSize: "13px",
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  marginBottom: "18px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#6EE7B7",
                  fontSize: "13px",
                  lineHeight: 1.4,
                }}
              >
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Google 1-Click Login */}
            <button
              id="btn-google-login"
              type="button"
              className="btn-secondary"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "15px",
                marginBottom: "18px",
                padding: "12px 16px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              {isEn ? "Continue with Google" : "Continuar com Google"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div className="divider" style={{ flex: 1, margin: 0 }} />
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {isEn ? "or with email" : "ou com e-mail"}
              </span>
              <div className="divider" style={{ flex: 1, margin: 0 }} />
            </div>

            {/* Email & Password Form */}
            <form
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    {isEn ? "Your Name" : "Nome"}
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    className="input-base"
                    placeholder={isEn ? "John Doe" : "Seu nome"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  {isEn ? "Email Address" : "E-mail"}
                </label>
                <input
                  id="input-email"
                  type="email"
                  required
                  className="input-base"
                  placeholder={isEn ? "your@email.com" : "seu@email.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {isEn ? "Password" : "Senha"}
                  </label>
                  {isLogin && (
                    <a
                      href="#"
                      style={{
                        fontSize: "12px",
                        color: "#A78BFA",
                        textDecoration: "none",
                      }}
                    >
                      {isEn ? "Forgot?" : "Esqueceu?"}
                    </a>
                  )}
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
                    style={{ paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-auth"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "15px",
                  marginTop: "6px",
                  padding: "13px 20px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />{" "}
                    {isLogin
                      ? isEn
                        ? "Connecting..."
                        : "Conectando..."
                      : isEn
                      ? "Creating account..."
                      : "Criando conta..."}
                  </>
                ) : (
                  <>
                    {isLogin
                      ? isEn
                        ? "Log In"
                        : "Entrar"
                      : showPreview
                      ? isEn
                        ? "Unlock my transcript →"
                        : "Desbloquear transcrição →"
                      : isEn
                      ? "Create free account"
                      : "Criar conta grátis"}{" "}
                    {!showPreview && <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Toggle between Login and Signup */}
          <p
            style={{
              textAlign: showPreview ? "left" : "center",
              marginTop: "18px",
              color: "var(--text-muted)",
              fontSize: "14px",
            }}
          >
            {isLogin
              ? isEn
                ? "Don't have an account?"
                : "Não tem conta?"
              : isEn
              ? "Already have an account?"
              : "Já tem conta?"}{" "}
            <button
              id="btn-toggle-auth"
              type="button"
              className="btn-ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              style={{
                padding: "0",
                color: "#A78BFA",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {isLogin ? (isEn ? "Sign up free" : "Criar grátis") : isEn ? "Log in" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "110px 20px 60px",
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <Loader2 className="animate-spin" size={28} />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
