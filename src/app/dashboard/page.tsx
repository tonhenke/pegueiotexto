"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import { Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, Eye, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<any>(null);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user profile from public.profiles
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            credits_minutes: 5,
          });
        }

        // Fetch real user history from public.transcriptions
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

  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        const plan = params.get("plan") || "créditos";
        setPaymentSuccess(`🎉 Pagamento confirmado com sucesso! O pacote ${plan.toUpperCase()} foi adicionado ao seu saldo.`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

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
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "14px",
              color: "#6EE7B7", fontSize: "14px", fontWeight: 500
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
                <span className="badge badge-purple" style={{ marginBottom: "8px", fontSize: "12px" }}>
                  Painel de Controle
                </span>
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

          {/* Quick stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              { icon: <CreditCard size={18} color="#6EE7B7" />, label: "Saldo de Minutos", value: `${credits} min`, bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
              { icon: <FileText size={18} color="#A78BFA" />, label: "Transcrições Feitas", value: `${totalTranscriptions}`, bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
              { icon: <Clock size={18} color="#67E8F9" />, label: "Tempo Transcrito", value: `${totalMinutesTranscribed} min`, bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
              { icon: <Zap size={18} color="#FCD34D" />, label: "Motor de IA", value: "Whisper Large v3", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: "14px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px" }}>
                {stat.icon}
                <div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.2, marginTop: "2px" }}>{stat.value}</p>
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
                  Cole o link de um vídeo ou envie um arquivo acima para fazer sua primeira transcrição com seus 5 minutos grátis!
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
