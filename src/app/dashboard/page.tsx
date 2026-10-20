"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import { Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, Eye, Sparkles, ShieldCheck, Crown, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("gratuito");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token;
        const authHeaders: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        // 1. Fetch user profile from public.profiles
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        let activeCredits = 5;
        let activePlan = "gratuito";

        if (profileData) {
          setProfile(profileData);
          activeCredits = profileData.credits_minutes ?? 5;
          if (profileData.plan) {
            activePlan = String(profileData.plan).trim().toLowerCase();
          }
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            credits_minutes: 5,
            plan: "gratuito",
          });
        }

        // 2. Real-time Payment Verification & Status Sync
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        const isPaymentSuccess = params.get("payment") === "success";
        const planParam = params.get("plan");

        if (sessionId) {
          try {
            const verifyRes = await fetch("/api/checkout/verify-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({ session_id: sessionId }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              activePlan = (verifyData.plan || planParam || activePlan).toLowerCase();
              activeCredits = verifyData.new_balance ?? activeCredits;
              
              setProfile((prev: any) => ({
                ...prev,
                credits_minutes: activeCredits,
                plan: activePlan,
              }));
              setCurrentPlan(activePlan);

              const addedText = verifyData.credits_added ? ` (+${verifyData.credits_added} minutos)` : "";
              setPaymentSuccess(
                `🎉 Pagamento confirmado com sucesso! O plano ${activePlan.toUpperCase()}${addedText} foi ativado. Seu saldo atual é de ${activeCredits} minutos.`
              );

              // Client fallback in case Supabase RLS blocked server anon write
              if (verifyData.rls_fallback_needed) {
                await supabase.from("profiles").upsert({
                  id: user.id,
                  credits_minutes: activeCredits,
                  plan: activePlan,
                  updated_at: new Date().toISOString(),
                });
              }
            }
          } catch (e) {
            console.error("Erro na verificação da sessão Stripe:", e);
          } finally {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Automatic sync with Stripe for recent payments (e.g. Pix)
          try {
            const syncRes = await fetch("/api/checkout/sync-status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                user_id: user.id,
                email: user.email,
              }),
            });
            const syncData = await syncRes.json();
            if (syncRes.ok && syncData.success) {
              if (syncData.plan) {
                activePlan = String(syncData.plan).trim().toLowerCase();
                setCurrentPlan(activePlan);
              }
              if (syncData.credits_minutes !== undefined && syncData.credits_minutes > activeCredits) {
                activeCredits = syncData.credits_minutes;
              }
              setProfile((prev: any) => ({
                ...prev,
                credits_minutes: activeCredits,
                plan: activePlan,
              }));

              if (syncData.fulfilled_now) {
                const addedText = syncData.credits_added ? ` (+${syncData.credits_added} minutos)` : "";
                setPaymentSuccess(
                  `🎉 Pagamento confirmado com sucesso! O plano ${activePlan.toUpperCase()}${addedText} foi ativado. Seu novo saldo é de ${activeCredits} minutos.`
                );
              }

              // Update profiles table safely with fallback if 'plan' column does not exist yet
              try {
                const { error: upsertErr } = await supabase.from("profiles").upsert({
                  id: user.id,
                  credits_minutes: activeCredits,
                  plan: activePlan,
                  updated_at: new Date().toISOString(),
                });
                if (upsertErr) {
                  await supabase.from("profiles").upsert({
                    id: user.id,
                    credits_minutes: activeCredits,
                    updated_at: new Date().toISOString(),
                  });
                }
              } catch (eUpsert) {
                console.warn("Profiles upsert fallback:", eUpsert);
              }
            }
          } catch (e) {
            console.error("Erro na sincronização com servidor:", e);
          }

          if (isPaymentSuccess) {
            const p = planParam || "contratado";
            setPaymentSuccess(`🎉 Pagamento confirmado com sucesso! O pacote ${p.toUpperCase()} foi adicionado ao seu saldo.`);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        setCurrentPlan(activePlan);

        // 3. Fetch user history
        const { data: histData } = await supabase
          .from("transcriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (histData) {
          setHistory(histData);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();

    // Listen to credit updates from TranscribeForm
    const onCreditsUpdated = (e: any) => {
      const data = e.detail;
      if (data?.credits_remaining !== undefined) {
        setProfile((prev: any) => ({
          ...prev,
          credits_minutes: data.credits_remaining,
        }));
      }
      loadUserData();
    };

    window.addEventListener("credits_updated", onCreditsUpdated);
    return () => window.removeEventListener("credits_updated", onCreditsUpdated);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const downloadText = (text: string, title: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const credits = profile?.credits_minutes ?? 5;
  const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Visitante";
  const totalTranscriptions = history.length;
  const totalMinutesTranscribed = history.reduce((acc, curr) => acc + (curr.minutes_deducted || 0), 0);

  // Plan styling configurations
  const planConfigs: Record<string, { label: string; badge: string; color: string; bg: string; border: string }> = {
    starter: {
      label: "Starter",
      badge: "60 min contratados",
      color: "#67E8F9",
      bg: "rgba(6, 182, 212, 0.08)",
      border: "rgba(6, 182, 212, 0.3)",
    },
    pro: {
      label: "Pro",
      badge: "300 min contratados",
      color: "#A78BFA",
      bg: "rgba(124, 58, 237, 0.08)",
      border: "rgba(124, 58, 237, 0.3)",
    },
    business: {
      label: "Business",
      badge: "1.000 min contratados",
      color: "#F9A8D4",
      bg: "rgba(236, 72, 153, 0.08)",
      border: "rgba(236, 72, 153, 0.3)",
    },
    gratuito: {
      label: "Gratuito",
      badge: "5 min de teste",
      color: "#94A3B8",
      bg: "rgba(255, 255, 255, 0.03)",
      border: "var(--border-subtle)",
    },
  };

  const activePlanCfg = planConfigs[currentPlan] || planConfigs.gratuito;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ paddingTop: "110px", paddingBottom: "80px" }}>
        <div className="container">
          {/* Payment Success Alert */}
          {paymentSuccess && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", marginBottom: "28px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "14px",
              color: "#6EE7B7", fontSize: "14px", fontWeight: 500,
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.15)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🎉</span>
                <span>{paymentSuccess}</span>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setPaymentSuccess(null)}
                style={{ padding: "4px 8px", fontSize: "12px", color: "#6EE7B7" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Header */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span className="badge badge-purple" style={{ fontSize: "12px" }}>
                    Painel de Controle
                  </span>

                  {/* Active Plan Tag next to Dashboard Title */}
                  {currentPlan === "starter" ? (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(6, 182, 212, 0.15)",
                      border: "1px solid rgba(6, 182, 212, 0.4)",
                      borderRadius: "100px", padding: "4px 12px",
                      fontSize: "12px", color: "#67E8F9", fontWeight: 700
                    }}>
                      <Sparkles size={12} color="#67E8F9" /> Plano Starter
                    </div>
                  ) : currentPlan === "pro" ? (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(124, 58, 237, 0.15)",
                      border: "1px solid rgba(124, 58, 237, 0.4)",
                      borderRadius: "100px", padding: "4px 12px",
                      fontSize: "12px", color: "#A78BFA", fontWeight: 700
                    }}>
                      <Zap size={12} color="#A78BFA" /> Plano Pro
                    </div>
                  ) : currentPlan === "business" ? (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(236, 72, 153, 0.15)",
                      border: "1px solid rgba(236, 72, 153, 0.4)",
                      borderRadius: "100px", padding: "4px 12px",
                      fontSize: "12px", color: "#F9A8D4", fontWeight: 700
                    }}>
                      <Crown size={12} color="#F9A8D4" /> Plano Business
                    </div>
                  ) : (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "100px", padding: "4px 12px",
                      fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600
                    }}>
                      Plano Gratuito
                    </div>
                  )}
                </div>

                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  Olá, <span className="text-gradient">{userName}</span>!
                </h1>
              </div>

              {/* Credits & Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "100px",
                  padding: "8px 18px"
                }}>
                  <Zap size={16} color="#A78BFA" />
                  <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 700 }}>
                    {credits} min restantes
                  </span>
                </div>

                <button
                  onClick={() => {
                    setLoading(true);
                    loadUserData();
                  }}
                  className="btn-ghost"
                  title="Sincronizar pagamentos e créditos"
                  style={{ padding: "8px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} className={loading ? "spin" : ""} /> Sincronizar
                </button>

                <Link href="/precos" className="btn-primary" style={{ fontSize: "13px", padding: "8px 18px", textDecoration: "none" }}>
                  Recarregar minutos <ArrowRight size={14} />
                </Link>

                {user ? (
                  <button onClick={handleLogout} className="btn-ghost" title="Encerrar sessão" style={{ padding: "8px 14px", fontSize: "13px" }}>
                    <LogOut size={15} /> Sair
                  </button>
                ) : (
                  <Link href="/login" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "13px", textDecoration: "none" }}>
                    Criar conta grátis
                  </Link>
                )}
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              Cole o link de qualquer vídeo ou faça upload. Sua mídia é automaticamente excluída após o download.
            </p>
          </div>

          {/* Quick stats (Including Plano Vigente prominent card) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              {
                icon: currentPlan === "business" ? <Crown size={20} color={activePlanCfg.color} /> : <Sparkles size={20} color={activePlanCfg.color} />,
                label: "Plano Vigente",
                value: activePlanCfg.label,
                subtext: activePlanCfg.badge,
                bg: activePlanCfg.bg,
                border: activePlanCfg.border
              },
              {
                icon: <CreditCard size={20} color="#6EE7B7" />,
                label: "Saldo Disponível",
                value: `${credits} min`,
                subtext: "Liberado para uso",
                bg: "rgba(16,185,129,0.08)",
                border: "rgba(16,185,129,0.25)"
              },
              {
                icon: <FileText size={20} color="#A78BFA" />,
                label: "Transcrições Feitas",
                value: `${totalTranscriptions}`,
                subtext: "Histórico salvo",
                bg: "rgba(124,58,237,0.08)",
                border: "rgba(124,58,237,0.2)"
              },
              {
                icon: <Clock size={20} color="#67E8F9" />,
                label: "Tempo Transcrito",
                value: `${totalMinutesTranscribed} min`,
                subtext: "Total consumido",
                bg: "rgba(6,182,212,0.08)",
                border: "rgba(6,182,212,0.2)"
              },
              {
                icon: <Zap size={20} color="#FCD34D" />,
                label: "Motor de IA",
                value: "Whisper Large v3",
                subtext: "Precisão máxima",
                bg: "rgba(245,158,11,0.08)",
                border: "rgba(245,158,11,0.2)"
              },
            ].map((stat) => (
              <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                {stat.icon}
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
                  <p style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.2, marginTop: "2px" }}>{stat.value}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>{stat.subtext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Transcribe Widget */}
          <div style={{ marginBottom: "60px" }}>
            <TranscribeForm />
          </div>

          {/* Recent History Table */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Seu histórico de transcrições
              </h2>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Apenas o texto é salvo • Mídias excluídas
              </span>
            </div>

            {history.length === 0 ? (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, background: "rgba(124,58,237,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Sparkles size={22} color="#A78BFA" />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>Nenhuma transcrição salva ainda</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: 420, margin: "0 auto" }}>
                  Cole o link de um vídeo ou envie um arquivo acima para transcrever com seu saldo disponível!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {history.map((item) => (
                  <div key={item.id} className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ width: 40, height: 40, background: "rgba(124,58,237,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={18} color="#A78BFA" />
                    </div>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {new Date(item.created_at).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })} •{" "}
                        {Math.floor((item.duration_seconds || 0) / 60)}m {Math.round((item.duration_seconds || 0) % 60)}s •{" "}
                        <span style={{ color: "#A78BFA" }}>{item.platform || "Web"}</span> •{" "}
                        <span style={{ color: "#6EE7B7" }}>-{item.minutes_deducted || 1} min</span>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        className="btn-ghost"
                        onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                        style={{ fontSize: "13px", padding: "6px 14px" }}
                      >
                        <Eye size={14} /> {activeItem?.id === item.id ? "Fechar" : "Ler texto"}
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => downloadText(item.text_content, item.title)}
                        style={{ fontSize: "13px", padding: "6px 14px" }}
                      >
                        <Download size={14} /> Baixar .TXT
                      </button>
                    </div>

                    {/* Expandable text preview */}
                    {activeItem?.id === item.id && (
                      <div style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "16px",
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: "10px",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        maxHeight: "240px",
                        overflowY: "auto",
                        color: "var(--text-secondary)"
                      }}>
                        {item.text_content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
