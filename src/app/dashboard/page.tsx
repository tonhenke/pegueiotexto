"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";
import ReferralWidget from "@/components/ReferralWidget";
import { 
  Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, 
  Eye, Sparkles, ShieldCheck, Crown, RefreshCw, Copy, Check, 
  FileDown, Loader2, BookOpen, ListChecks, Lightbulb, 
  Search, Share2, ExternalLink, X, Filter, Award, Settings, User, Gift, Menu, 
  Languages, Globe, RotateCcw
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { exportToTxt, exportToDocx, exportToPdf } from "@/lib/exportUtils";
import AccountSidebarDrawer from "@/components/AccountSidebarDrawer";
import DashboardPromoBanner from "@/components/DashboardPromoBanner";

const TRANSLATION_LANGUAGES = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "Inglês (English)", flag: "🇺🇸" },
  { code: "es", name: "Espanhol (Español)", flag: "🇪🇸" },
  { code: "fr", name: "Francês (Français)", flag: "🇫🇷" },
  { code: "de", name: "Alemão (Deutsch)", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japonês (日本語)", flag: "🇯🇵" },
  { code: "zh", name: "Chinês (中文)", flag: "🇨🇳" },
  { code: "ru", name: "Russo (Русский)", flag: "🇷🇺" },
];

export default function DashboardPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("gratuito");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("todas");
  const [sharedToastId, setSharedToastId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarInitialSection, setSidebarInitialSection] = useState<"perfil" | "senha" | "afiliados" | "indicacoes" | "plano" | null>(null);

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

        if (user.email) {
          const userMetaRef = user.user_metadata?.referral_code_used;
          const refSource =
            (userMetaRef ? `convite_${userMetaRef}` : "") ||
            (typeof window !== "undefined" &&
              (localStorage.getItem("pegueiotexto_ref")
                ? `convite_${localStorage.getItem("pegueiotexto_ref")}`
                : localStorage.getItem("pending_referral_code")
                ? `convite_${localStorage.getItem("pending_referral_code")}`
                : localStorage.getItem("peguei_affiliate_click_code")
                ? `afiliado_${localStorage.getItem("peguei_affiliate_click_code")}`
                : null)) ||
            (user.app_metadata?.provider === "google" ? "google_oauth" : "organico");

          fetch("/api/admin/users?action=record_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || profileData?.name || user.email.split("@")[0],
              plan: activePlan,
              credits_minutes: activeCredits,
              referral_source: refSource,
            }),
          }).catch(() => {});
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

              // Sync purchase and plan directly to Admin Store
              if (user.email) {
                fetch("/api/admin/users?action=record_user", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || profileData?.name || user.email.split("@")[0],
                    plan: activePlan,
                    credits_minutes: activeCredits,
                  }),
                }).catch(() => {});
              }

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

        // 4. Check & Claim pending referral bonus if present
        if (typeof window !== "undefined") {
          let pendingRef =
            localStorage.getItem("pegueiotexto_ref") ||
            localStorage.getItem("pending_referral_code");

          if (!pendingRef && typeof document !== "undefined") {
            const match = document.cookie.match(/(?:^|;\s*)pegueiotexto_ref=([^;]+)/);
            if (match) pendingRef = decodeURIComponent(match[1]);
          }

          if (!pendingRef) {
            const urlParams = new URLSearchParams(window.location.search);
            pendingRef = urlParams.get("ref");
          }

          if (pendingRef) {
            try {
              const refRes = await fetch("/api/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ref_code: pendingRef,
                  new_user_id: user.id,
                  new_user_email: user.email,
                }),
              });
              const refData = await refRes.json();
              if (refRes.ok && refData.success) {
                setProfile((prev: any) => ({
                  ...prev,
                  credits_minutes: refData.new_balance,
                }));
                setPaymentSuccess(
                  `🎉 Parabéns! Você recebeu +${refData.minutes_awarded} minutos bônus de boas-vindas pelo convite de ${refData.referrer_name}! Seu saldo agora é de ${refData.new_balance} minutos.`
                );
                localStorage.removeItem("pegueiotexto_ref");
                localStorage.removeItem("pending_referral_code");
                document.cookie = "pegueiotexto_ref=;path=/;max-age=0";
              } else if (refData.already_claimed) {
                localStorage.removeItem("pegueiotexto_ref");
                localStorage.removeItem("pending_referral_code");
                document.cookie = "pegueiotexto_ref=;path=/;max-age=0";
              }
            } catch (refErr) {
              console.error("Erro ao resgatar indicação:", refErr);
            }
          }
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
    window.location.href = isEn ? "/en" : "/";
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [summariesByItem, setSummariesByItem] = useState<Record<string, any>>({});
  const [loadingSummaryId, setLoadingSummaryId] = useState<string | null>(null);
  const [exportingDocxId, setExportingDocxId] = useState<string | null>(null);
  const [exportingPdfId, setExportingPdfId] = useState<string | null>(null);

  // Translation states for history items
  const [translationsByItem, setTranslationsByItem] = useState<Record<string, {
    text: string;
    langCode: string;
    langName: string;
  }>>({});
  const [targetLangByItem, setTargetLangByItem] = useState<Record<string, string>>({});
  const [loadingTranslationId, setLoadingTranslationId] = useState<string | null>(null);
  const [openTranslateItemId, setOpenTranslateItemId] = useState<string | null>(null);
  const [exportingTransDocxId, setExportingTransDocxId] = useState<string | null>(null);
  const [proUpgradeModalOpen, setProUpgradeModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("peguei_translations_cache");
        if (cached) {
          setTranslationsByItem(JSON.parse(cached));
        }
      } catch (e) {
        console.warn("Error loading cached translations:", e);
      }
    }
  }, []);

  const getItemSummaryText = (itemId: string) => {
    const s = summariesByItem[itemId];
    if (!s) return "";
    let str = "";
    if (s.executive_summary) str += `RESUMO EXECUTIVO:\n${s.executive_summary}\n\n`;
    if (s.key_points && s.key_points.length > 0) {
      str += `PONTOS PRINCIPAIS:\n${s.key_points.map((p: string) => `• ${p}`).join("\n")}\n\n`;
    }
    if (s.takeaway) str += `PRINCIPAL CONCLUSAO:\n${s.takeaway}\n`;
    return str.trim();
  };

  const handleExportTxt = (item: any) => {
    const summary = getItemSummaryText(item.id);
    const content = summary ? `${summary}\n\n====================\nTRANSCRIÇÃO COMPLETA:\n====================\n\n${item.text_content}` : item.text_content;
    exportToTxt(content, item.title || "transcricao");
  };

  const handleExportDocx = async (item: any) => {
    setExportingDocxId(item.id);
    try {
      await exportToDocx(item.text_content, item.title || "Transcrição", {
        duration: item.duration_seconds,
        platform: item.platform,
        summary: getItemSummaryText(item.id),
      });
    } catch (err) {
      console.error("Erro ao exportar Word:", err);
      alert("Erro ao exportar arquivo Word (.docx).");
    } finally {
      setExportingDocxId(null);
    }
  };

  const handleExportPdf = async (item: any) => {
    setExportingPdfId(item.id);
    try {
      await exportToPdf(item.text_content, item.title || "Transcrição", {
        duration: item.duration_seconds,
        platform: item.platform,
        summary: getItemSummaryText(item.id),
      });
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
      alert("Erro ao exportar arquivo PDF.");
    } finally {
      setExportingPdfId(null);
    }
  };

  const handleGenerateSummary = async (item: any) => {
    setLoadingSummaryId(item.id);
    try {
      const res = await fetch("/api/transcribe/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: item.text_content,
          title: item.title || "Transcrição",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSummariesByItem((prev) => ({
          ...prev,
          [item.id]: data,
        }));
      } else {
        const errMsg = typeof data?.detail === "string" && data.detail !== "Not Found"
          ? data.detail
          : "Não foi possível gerar o resumo neste momento. Tente novamente em instantes.";
        alert(errMsg);
      }
    } catch (err) {
      console.error("Erro ao gerar resumo:", err);
      alert("Falha de conexão com o servidor ao gerar resumo.");
    } finally {
      setLoadingSummaryId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleShareItem = (item: any) => {
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/t/${item.id}`
      : `https://pegueiotexto.com.br/t/${item.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setSharedToastId(item.id);
      setTimeout(() => setSharedToastId(null), 2500);
    }
  };

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.text_content && item.text_content.toLowerCase().includes(q));

    const matchesPlatform =
      platformFilter === "todas" ||
      (item.platform && item.platform.toLowerCase().includes(platformFilter.toLowerCase()));

    return matchesQuery && matchesPlatform;
  });

  const credits = profile?.credits_minutes ?? 5;
  const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Visitante";
  const totalTranscriptions = history.length;
  const totalMinutesTranscribed = history.reduce((acc, curr) => acc + (curr.minutes_deducted || 0), 0);

  // Plan styling configurations
  const planConfigs: Record<string, { label: string; badge: string; color: string; bg: string; border: string }> = {
    starter: {
      label: "Starter",
      badge: isEn ? "60 mins plan" : "60 min contratados",
      color: "#67E8F9",
      bg: "rgba(6, 182, 212, 0.08)",
      border: "rgba(6, 182, 212, 0.3)",
    },
    starter_annual: {
      label: isEn ? "Starter Annual" : "Starter Anual",
      badge: isEn ? "Annual Subscription (720 min)" : "Assinatura Anual (720 min)",
      color: "#67E8F9",
      bg: "rgba(6, 182, 212, 0.12)",
      border: "rgba(6, 182, 212, 0.4)",
    },
    pro: {
      label: "Pro",
      badge: isEn ? "300 mins plan" : "300 min contratados",
      color: "#A78BFA",
      bg: "rgba(124, 58, 237, 0.08)",
      border: "rgba(124, 58, 237, 0.3)",
    },
    pro_annual: {
      label: isEn ? "Pro Annual" : "Pro Anual",
      badge: isEn ? "Annual Subscription (3,600 min)" : "Assinatura Anual (3.600 min)",
      color: "#A78BFA",
      bg: "rgba(124, 58, 237, 0.12)",
      border: "rgba(124, 58, 237, 0.45)",
    },
    business: {
      label: "Business",
      badge: isEn ? "1,000 mins plan" : "1.000 min contratados",
      color: "#F9A8D4",
      bg: "rgba(236, 72, 153, 0.08)",
      border: "rgba(236, 72, 153, 0.3)",
    },
    business_annual: {
      label: isEn ? "Business Annual" : "Business Anual",
      badge: isEn ? "Annual Subscription (12,000 min)" : "Assinatura Anual (12.000 min)",
      color: "#F9A8D4",
      bg: "rgba(236, 72, 153, 0.12)",
      border: "rgba(236, 72, 153, 0.45)",
    },
    ilimitado: {
      label: isEn ? "Unlimited" : "Ilimitado",
      badge: isEn ? "Unlimited Transcription" : "Transcrição Ilimitada",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.35)",
    },
    unlimited: {
      label: isEn ? "Unlimited" : "Ilimitado",
      badge: isEn ? "Unlimited Transcription" : "Transcrição Ilimitada",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.35)",
    },
    gratuito: {
      label: isEn ? "Free" : "Gratuito",
      badge: isEn ? "5 min trial" : "5 min de teste",
      color: "#94A3B8",
      bg: "rgba(255, 255, 255, 0.03)",
      border: "var(--border-subtle)",
    },
  };

  const isUnlimited = currentPlan === "ilimitado" || currentPlan === "unlimited" || credits >= 900000;
  const isTon = user?.email?.toLowerCase().trim() === "tonhenke@gmail.com";
  const isPaidUser = isTon || isUnlimited || ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual"].includes(String(currentPlan || "").toLowerCase());
  const activePlanCfg = planConfigs[currentPlan] || (isUnlimited ? planConfigs.ilimitado : planConfigs.gratuito);

  const handleTranslateHistoryItem = async (item: any, langCode?: string) => {
    if (!isPaidUser) {
      setProUpgradeModalOpen(true);
      return;
    }
    const target = langCode || targetLangByItem[item.id] || "en";
    setLoadingTranslationId(item.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch("/api/transcribe/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          text: item.text_content,
          target_language: target,
          title: item.title || "Transcrição",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTranslationsByItem((prev) => {
          const updated = {
            ...prev,
            [item.id]: {
              text: data.translated_text,
              langCode: target,
              langName: data.target_language_name || target.toUpperCase(),
            },
          };
          try {
            localStorage.setItem("peguei_translations_cache", JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        setOpenTranslateItemId(item.id);
      } else {
        const errMsg = typeof data?.detail === "string" && data.detail !== "Not Found"
          ? data.detail
          : "Não foi possível realizar a tradução neste momento.";
        alert(errMsg);
      }
    } catch (err) {
      console.error("Erro ao traduzir no histórico:", err);
      alert("Falha de conexão com o servidor ao traduzir.");
    } finally {
      setLoadingTranslationId(null);
    }
  };

  const handleExportTranslatedDocx = async (item: any) => {
    const trans = translationsByItem[item.id];
    if (!trans) return;
    setExportingTransDocxId(item.id);
    try {
      const docTitle = `${item.title || "Transcrição"} (${trans.langName})`;
      await exportToDocx(trans.text, docTitle, {
        duration: item.duration_seconds,
        platform: item.platform,
        engine: "Peguei o Texto IA - Tradução",
      });
    } catch (err) {
      console.error("Erro ao exportar Word traduzido:", err);
      alert("Erro ao exportar arquivo Word (.docx).");
    } finally {
      setExportingTransDocxId(null);
    }
  };

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
                    {isEn ? "Control Panel" : "Painel de Controle"}
                  </span>

                  {/* Active Plan Tag next to Dashboard Title */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: activePlanCfg.bg,
                    border: `1px solid ${activePlanCfg.border}`,
                    borderRadius: "100px", padding: "4px 12px",
                    fontSize: "12px", color: activePlanCfg.color, fontWeight: 700
                  }}>
                    {isUnlimited ? (
                      <Crown size={12} color={activePlanCfg.color} />
                    ) : currentPlan.includes("business") ? (
                      <Crown size={12} color={activePlanCfg.color} />
                    ) : currentPlan.includes("pro") ? (
                      <Zap size={12} color={activePlanCfg.color} />
                    ) : currentPlan.includes("starter") ? (
                      <Sparkles size={12} color={activePlanCfg.color} />
                    ) : null}
                    <span>{isEn ? `${activePlanCfg.label} Plan` : `Plano ${activePlanCfg.label}`}</span>
                  </div>
                </div>

                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {isEn ? "Hello, " : "Olá, "}<span className="text-gradient">{userName}</span>!
                </h1>
              </div>

              {/* Credits & Clean Action Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: isUnlimited ? "rgba(16, 185, 129, 0.12)" : "rgba(124,58,237,0.12)",
                  border: isUnlimited ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "100px",
                  padding: "8px 18px"
                }}>
                  <Zap size={16} color={isUnlimited ? "#10B981" : "#A78BFA"} />
                  <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 700 }}>
                    {isUnlimited ? (isEn ? "Unlimited" : "Ilimitado") : `${credits} ${isEn ? "min remaining" : "min restantes"}`}
                  </span>
                </div>

                {!isUnlimited && (
                  <Link href={isEn ? "/en/pricing" : "/precos"} className="btn-primary" style={{ fontSize: "13px", padding: "8px 18px", textDecoration: "none" }}>
                    {isEn ? "Add more minutes" : "Recarregar minutos"} <ArrowRight size={14} />
                  </Link>
                )}

                <Link
                  href={isEn ? "/en/suggestions" : "/sugestoes"}
                  id="btn-dashboard-feedback"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    padding: "8px 14px",
                    borderRadius: "100px",
                    background: "rgba(251, 191, 36, 0.08)",
                    border: "1px solid rgba(251, 191, 36, 0.25)",
                    color: "#FBBF24",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251, 191, 36, 0.16)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(251, 191, 36, 0.08)")}
                >
                  <Lightbulb size={14} />
                  <span>{isEn ? "Suggest Feature" : "Sugerir Melhoria"}</span>
                </Link>

                <button
                  onClick={() => {
                    setSidebarInitialSection(null);
                    setIsSidebarOpen(true);
                  }}
                  id="btn-open-sidebar"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "6px 14px 6px 8px",
                    borderRadius: "100px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title="Abrir menu de opções e configurações"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <Menu size={18} color="#FFFFFF" />
                </button>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
              {isEn
                ? "Paste any video link or upload audio. Your media is automatically deleted after processing."
                : "Cole o link de qualquer vídeo ou faça upload. Sua mídia é automaticamente excluída após o download."}
            </p>
          </div>

          {/* Quick stats (Including Plano Vigente prominent card) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "40px" }}>
            {[
              {
                icon: currentPlan === "business" ? <Crown size={20} color={activePlanCfg.color} /> : <Sparkles size={20} color={activePlanCfg.color} />,
                label: isEn ? "Current Plan" : "Plano Vigente",
                value: activePlanCfg.label,
                subtext: activePlanCfg.badge,
                bg: activePlanCfg.bg,
                border: activePlanCfg.border
              },
              {
                icon: <CreditCard size={20} color={currentPlan === "gratuito" && credits <= 1 ? "#F59E0B" : "#6EE7B7"} />,
                label: isEn ? "Available Balance" : "Saldo Disponível",
                value: `${credits} min`,
                subtext: currentPlan === "gratuito" && credits <= 1 ? (isEn ? "⚠️ Almost depleted" : "⚠️ Quase esgotado") : (isEn ? "Ready to use" : "Liberado para uso"),
                bg: currentPlan === "gratuito" && credits <= 1 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                border: currentPlan === "gratuito" && credits <= 1 ? "rgba(245,158,11,0.35)" : "rgba(16,185,129,0.25)"
              },
              {
                icon: <FileText size={20} color="#A78BFA" />,
                label: isEn ? "Transcriptions Done" : "Transcrições Feitas",
                value: `${totalTranscriptions}`,
                subtext: isEn ? "Saved history" : "Histórico salvo",
                bg: "rgba(124,58,237,0.08)",
                border: "rgba(124,58,237,0.2)"
              },
              {
                icon: <Clock size={20} color="#67E8F9" />,
                label: isEn ? "Time Transcribed" : "Tempo Transcrito",
                value: `${totalMinutesTranscribed} min`,
                subtext: isEn ? "Total consumed" : "Total consumido",
                bg: "rgba(6,182,212,0.08)",
                border: "rgba(6,182,212,0.2)"
              },
              {
                icon: <Zap size={20} color="#FCD34D" />,
                label: isEn ? "AI Engine" : "Motor de IA",
                value: isEn ? "Advanced AI" : "IA Avançada",
                subtext: isEn ? "Maximum accuracy" : "Precisão máxima",
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

          {/* Dynamic Promo Banner: 5h Welcome Discount (25% OFF Pro Anual) -> Referral Program */}
          <DashboardPromoBanner
            user={user}
            profile={profile}
            currentPlan={currentPlan}
          />

          {/* Main Transcribe Widget */}
          <div style={{ marginBottom: "60px" }}>
            <TranscribeForm />
          </div>

          {/* Recent History Table */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                {isEn ? "Your transcription history" : "Seu histórico de transcrições"}
              </h2>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {isEn ? "Only text is saved • Media deleted" : "Apenas o texto é salvo • Mídias excluídas"}
              </span>
            </div>

            {/* Global Search & Filters Bar */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginBottom: "24px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "14px",
              padding: "16px 20px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 260 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    width: "100%",
                    maxWidth: 480,
                  }}>
                    <Search size={16} color="#A78BFA" />
                    <input
                      type="text"
                      placeholder={isEn ? "Search word or phrase across all transcriptions..." : "Buscar palavra ou frase em todas as transcrições..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        width: "100%",
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "14px" }}
                        title={isEn ? "Clear search" : "Limpar busca"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {filteredHistory.length} {isEn ? (filteredHistory.length === 1 ? "result" : "results") : (filteredHistory.length === 1 ? "resultado" : "resultados")}
                    {searchQuery && ` ${isEn ? "for" : "para"} "${searchQuery}"`}
                  </span>
                </div>
              </div>

              {/* Platform filter pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "4px" }}>
                  {isEn ? "Platform:" : "Plataforma:"}
                </span>
                {["todas", "YouTube", "Upload", "Instagram", "TikTok", "Vimeo"].map((plat) => {
                  const isActive = platformFilter.toLowerCase() === plat.toLowerCase();
                  const label = plat === "todas" ? (isEn ? "All" : "Todas") : plat;
                  return (
                    <button
                      key={plat}
                      onClick={() => setPlatformFilter(plat)}
                      style={{
                        fontSize: "12px",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        background: isActive ? "rgba(124, 58, 237, 0.2)" : "rgba(255, 255, 255, 0.03)",
                        border: isActive ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid var(--border-subtle)",
                        color: isActive ? "#C4B5FD" : "var(--text-secondary)",
                        cursor: "pointer",
                        fontWeight: isActive ? 600 : 400,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, background: "rgba(124,58,237,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Sparkles size={22} color="#A78BFA" />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>
                  {isEn ? "No transcriptions saved yet" : "Nenhuma transcrição salva ainda"}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: 420, margin: "0 auto" }}>
                  {isEn ? "Paste a video link or upload a file above to transcribe with your available balance!" : "Cole o link de um vídeo ou envie um arquivo acima para transcrever com seu saldo disponível!"}
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="glass-card" style={{ padding: "36px", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: "rgba(255, 255, 255, 0.05)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Search size={20} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
                  {isEn ? "No results found" : "Nenhum resultado encontrado"}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", maxWidth: 380, margin: "0 auto 16px" }}>
                  {isEn ? `No transcriptions match "${searchQuery}" with the selected filters.` : `Não encontramos transcrições correspondentes a "${searchQuery}" com os filtros selecionados.`}
                </p>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setPlatformFilter("todas");
                  }}
                  style={{ fontSize: "12px", padding: "6px 14px" }}
                >
                  {isEn ? "Clear search filters" : "Limpar filtros de busca"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredHistory.map((item) => (
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
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        className="btn-ghost"
                        onClick={() => handleCopyText(item.text_content, item.id)}
                        style={{
                          fontSize: "13px", padding: "6px 12px",
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          color: copiedId === item.id ? "#6EE7B7" : undefined,
                          borderColor: copiedId === item.id ? "rgba(16, 185, 129, 0.4)" : undefined,
                          background: copiedId === item.id ? "rgba(16, 185, 129, 0.12)" : undefined
                        }}
                        title={isEn ? "Copy text to clipboard" : "Copiar texto para a área de transferência"}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={14} color="#6EE7B7" /> {isEn ? "Copied!" : "Copiado!"}
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> {isEn ? "Copy" : "Copiar"}
                          </>
                        )}
                      </button>

                      <button
                        className="btn-ghost"
                        onClick={() => handleShareItem(item)}
                        style={{
                          fontSize: "13px", padding: "6px 12px",
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          color: sharedToastId === item.id ? "#67E8F9" : undefined,
                          borderColor: sharedToastId === item.id ? "rgba(6, 182, 212, 0.4)" : undefined,
                          background: sharedToastId === item.id ? "rgba(6, 182, 212, 0.12)" : undefined
                        }}
                        title={isEn ? "Copy public link for this transcript" : "Copiar link público desta transcrição para WhatsApp ou Notion"}
                      >
                        {sharedToastId === item.id ? (
                          <>
                            <Check size={14} color="#67E8F9" /> {isEn ? "Link copied!" : "Link copiado!"}
                          </>
                        ) : (
                          <>
                            <Share2 size={14} /> {isEn ? "Share" : "Compartilhar"}
                          </>
                        )}
                      </button>

                      <button
                        className="btn-ghost"
                        onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                        style={{
                          fontSize: "13px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px",
                          borderColor: activeItem?.id === item.id ? "rgba(124, 58, 237, 0.5)" : undefined,
                          background: activeItem?.id === item.id ? "rgba(124, 58, 237, 0.12)" : undefined,
                          color: activeItem?.id === item.id ? "#A78BFA" : undefined
                        }}
                      >
                        <Eye size={14} /> {activeItem?.id === item.id ? (isEn ? "Hide" : "Ocultar") : (isEn ? "View text & AI" : "Ver texto & IA")}
                      </button>

                      <button
                        className="btn-ghost"
                        onClick={() => handleExportTxt(item)}
                        style={{ fontSize: "12px", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                        title={isEn ? "Download plain text file (.txt)" : "Baixar arquivo de texto puro (.txt)"}
                      >
                        <Download size={13} /> .TXT
                      </button>

                      <button
                        className="btn-ghost"
                        onClick={() => handleExportDocx(item)}
                        disabled={exportingDocxId === item.id}
                        style={{
                          fontSize: "12px", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "5px",
                          borderColor: "rgba(59, 130, 246, 0.35)", background: "rgba(59, 130, 246, 0.08)", color: "#93C5FD"
                        }}
                        title={isEn ? "Download formatted Microsoft Word document (.docx)" : "Baixar documento formatado para Microsoft Word (.docx)"}
                      >
                        {exportingDocxId === item.id ? (
                          <>
                            <Loader2 size={13} className="spin" /> {isEn ? "Generating Word..." : "Gerando Word..."}
                          </>
                        ) : (
                          <>
                            <FileDown size={13} /> .DOCX (Word)
                          </>
                        )}
                      </button>

                      <button
                        className="btn-primary"
                        onClick={() => handleExportPdf(item)}
                        disabled={exportingPdfId === item.id}
                        style={{
                          fontSize: "12px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "5px",
                          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                          boxShadow: "0 2px 10px rgba(239, 68, 68, 0.3)"
                        }}
                        title={isEn ? "Download PDF document (.pdf)" : "Baixar documento em formato PDF (.pdf)"}
                      >
                        {exportingPdfId === item.id ? (
                          <>
                            <Loader2 size={13} className="spin" /> {isEn ? "Generating PDF..." : "Gerando PDF..."}
                          </>
                        ) : (
                          <>
                            <FileDown size={13} /> .PDF
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expandable text preview with AI Summary & Full Transcript */}
                    {activeItem?.id === item.id && (
                      <div style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "20px",
                        background: "rgba(10, 10, 15, 0.65)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        fontSize: "14px",
                        lineHeight: 1.6
                      }}>
                        {/* Top bar */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingBottom: "14px",
                          marginBottom: "16px",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          flexWrap: "wrap",
                          gap: "10px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="badge badge-purple" style={{ fontSize: "11px" }}>
                              {isEn ? "Details" : "Detalhes"}
                            </span>
                            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                              {item.text_content.length} {isEn ? "characters" : "caracteres"}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <a
                              href={`/t/${item.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: "12px",
                                padding: "6px 12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                borderRadius: "8px",
                                background: "rgba(6, 182, 212, 0.12)",
                                border: "1px solid rgba(6, 182, 212, 0.35)",
                                color: "#67E8F9",
                                textDecoration: "none",
                                fontWeight: 600,
                              }}
                              title={isEn ? "Open public read-only page" : "Abrir página pública de leitura para WhatsApp ou Notion"}
                            >
                              <ExternalLink size={13} /> {isEn ? "Open public page ↗" : "Abrir página pública ↗"}
                            </a>

                            <button
                              onClick={() => handleGenerateSummary(item)}
                              disabled={loadingSummaryId === item.id}
                              style={{
                                fontSize: "12px",
                                padding: "6px 14px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)",
                                border: "1px solid rgba(124, 58, 237, 0.5)",
                                color: "#E0E7FF",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              {loadingSummaryId === item.id ? (
                                <>
                                  <Loader2 size={13} className="spin" color="#A78BFA" /> {isEn ? "Generating summary..." : "Gerando resumo..."}
                                </>
                              ) : summariesByItem[item.id] ? (
                                <>
                                  <RefreshCw size={13} color="#A78BFA" /> {isEn ? "Refresh AI Summary" : "Atualizar Resumo com IA"}
                                </>
                              ) : (
                                <>
                                  <Sparkles size={13} color="#A78BFA" /> {isEn ? "✨ Generate AI Summary" : "✨ Gerar Resumo com IA"}
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                if (!isPaidUser) {
                                  setProUpgradeModalOpen(true);
                                  return;
                                }
                                setOpenTranslateItemId(openTranslateItemId === item.id ? null : item.id);
                              }}
                              style={{
                                fontSize: "12px",
                                padding: "6px 14px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                borderRadius: "8px",
                                background: openTranslateItemId === item.id
                                  ? "linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(147, 51, 234, 0.35) 100%)"
                                  : "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
                                border: openTranslateItemId === item.id
                                  ? "1px solid rgba(147, 51, 234, 0.6)"
                                  : "1px solid rgba(59, 130, 246, 0.4)",
                                color: "#E0E7FF",
                                cursor: "pointer",
                                fontWeight: 600,
                                transition: "all 0.2s ease",
                              }}
                              title={isEn ? "Translate transcript to other languages with AI" : "Traduzir transcrição para outros idiomas com Inteligência Artificial"}
                            >
                              <Languages size={13} color="#93C5FD" />
                              <span>{translationsByItem[item.id] ? (isEn ? "View Translation" : "Ver Tradução") : (isEn ? "Translate with AI" : "Traduzir com IA")}</span>
                              {!isPaidUser && (
                                <span style={{
                                  fontSize: "9px",
                                  fontWeight: 800,
                                  padding: "2px 5px",
                                  borderRadius: "4px",
                                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                                  color: "#000",
                                  letterSpacing: "0.04em",
                                }}>
                                  👑 PRO
                                </span>
                              )}
                            </button>

                            <button
                              onClick={() => handleCopyText(item.text_content, `inner-${item.id}`)}
                              className="btn-ghost"
                              style={{
                                fontSize: "12px",
                                padding: "6px 12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                borderRadius: "8px",
                                background: copiedId === `inner-${item.id}` ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                border: copiedId === `inner-${item.id}` ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid var(--border-subtle)",
                                color: copiedId === `inner-${item.id}` ? "#6EE7B7" : "var(--text-secondary)",
                                cursor: "pointer"
                              }}
                            >
                              {copiedId === `inner-${item.id}` ? (
                                <>
                                  <Check size={13} color="#6EE7B7" /> {isEn ? "Text copied!" : "Texto copiado!"}
                                </>
                              ) : (
                                <>
                                  <Copy size={13} /> {isEn ? "Copy full text" : "Copiar texto completo"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Synchronized Audio Player for quick verification */}
                        <AudioSyncPlayer title={item.title} />

                        {/* AI Summary Loading state */}
                        {loadingSummaryId === item.id && (
                          <div style={{
                            padding: "20px",
                            marginBottom: "18px",
                            background: "rgba(124, 58, 237, 0.08)",
                            borderRadius: "12px",
                            border: "1px dashed rgba(124, 58, 237, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                          }}>
                            <Loader2 size={24} className="spin" color="#A78BFA" />
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                                {isEn ? "Analyzing content with Artificial Intelligence..." : "Analisando conteúdo com Inteligência Artificial..."}
                              </p>
                              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                {isEn ? "Synthesizing core takeaways and key lessons in seconds." : "Sintetizando pontos centrais e lições práticas em segundos."}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* AI Summary Section if present */}
                        {summariesByItem[item.id] && (
                          <div style={{
                            padding: "18px",
                            marginBottom: "20px",
                            background: "linear-gradient(180deg, rgba(124, 58, 237, 0.12) 0%, rgba(10, 10, 20, 0.4) 100%)",
                            borderRadius: "12px",
                            border: "1px solid rgba(124, 58, 237, 0.35)",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Sparkles size={16} color="#A78BFA" />
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#E0E7FF" }}>
                                  {isEn ? "AI Smart Summary" : "Síntese Inteligente com IA"}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopyText(getItemSummaryText(item.id), `sum-${item.id}`)}
                                className="btn-ghost"
                                style={{
                                  fontSize: "11px",
                                  padding: "4px 10px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  color: copiedId === `sum-${item.id}` ? "#6EE7B7" : "#A78BFA"
                                }}
                              >
                                {copiedId === `sum-${item.id}` ? <Check size={12} color="#6EE7B7" /> : <Copy size={12} />}
                                {copiedId === `sum-${item.id}` ? (isEn ? "Summary copied!" : "Resumo copiado!") : (isEn ? "Copy summary" : "Copiar resumo")}
                              </button>
                            </div>

                            {/* Executive Summary */}
                            <div style={{ marginBottom: "14px" }}>
                              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#A78BFA", fontWeight: 700, marginBottom: "4px" }}>
                                {isEn ? "Executive Summary" : "Resumo Executivo"}
                              </p>
                              <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6 }}>
                                {summariesByItem[item.id].executive_summary}
                              </p>
                            </div>

                            {/* Key Points */}
                            {summariesByItem[item.id].key_points && summariesByItem[item.id].key_points.length > 0 && (
                              <div style={{ marginBottom: "14px" }}>
                                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#67E8F9", fontWeight: 700, marginBottom: "6px" }}>
                                  {isEn ? "Key Points" : "Pontos Principais"}
                                </p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                                  {summariesByItem[item.id].key_points.map((pt: string, idx: number) => (
                                    <li key={idx} style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                      <span style={{ color: "#67E8F9", fontSize: "14px", lineHeight: 1 }}>•</span>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Takeaway */}
                            {summariesByItem[item.id].takeaway && (
                              <div style={{
                                padding: "12px 14px",
                                background: "rgba(16, 185, 129, 0.08)",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                borderRadius: "8px",
                              }}>
                                <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6EE7B7", fontWeight: 700, marginBottom: "3px" }}>
                                  {isEn ? "Core Takeaway" : "Principal Conclusão"}
                                </p>
                                <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0 }}>
                                  {summariesByItem[item.id].takeaway}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* AI Translation Section */}
                        {openTranslateItemId === item.id && (
                          <div style={{
                            padding: "18px 20px",
                            marginBottom: "20px",
                            background: "linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(10, 10, 22, 0.6) 100%)",
                            borderRadius: "14px",
                            border: "1px solid rgba(59, 130, 246, 0.35)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)"
                          }}>
                            {/* Translation Header & Controls */}
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              flexWrap: "wrap",
                              marginBottom: "16px",
                              paddingBottom: "14px",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                  width: 32, height: 32,
                                  borderRadius: "8px",
                                  background: "rgba(59, 130, 246, 0.2)",
                                  display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                  <Languages size={18} color="#93C5FD" />
                                </div>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
                                      {isEn ? "AI Translation" : "Tradução com Inteligência Artificial"}
                                    </h4>
                                    <span style={{
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      background: "rgba(16, 185, 129, 0.15)",
                                      color: "#6EE7B7",
                                      border: "1px solid rgba(16, 185, 129, 0.3)"
                                    }}>
                                      {isEn ? "✓ Pro Plan Active" : "✓ Plano Pro Ativo"}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                                    {isEn
                                      ? "Translate text while preserving natural nuance, technical terms, and punctuation."
                                      : "Traduza o texto mantendo o sentido natural, termos técnicos e pontuação."}
                                  </p>
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                {/* Language selector */}
                                <select
                                  value={targetLangByItem[item.id] || "en"}
                                  onChange={(e) => setTargetLangByItem((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                  disabled={loadingTranslationId === item.id}
                                  style={{
                                    padding: "8px 12px",
                                    background: "rgba(15, 23, 42, 0.8)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "13px",
                                    outline: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  {TRANSLATION_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code} style={{ background: "#0F172A", color: "#F1F5F9" }}>
                                      {lang.flag} {lang.name}
                                    </option>
                                  ))}
                                </select>

                                {/* Translate action button */}
                                <button
                                  onClick={() => handleTranslateHistoryItem(item)}
                                  disabled={loadingTranslationId === item.id}
                                  style={{
                                    fontSize: "13px",
                                    padding: "8px 16px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    borderRadius: "8px",
                                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                                    color: "#FFF",
                                    border: "none",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)"
                                  }}
                                >
                                  {loadingTranslationId === item.id ? (
                                    <>
                                      <Loader2 size={14} className="spin" /> Traduzindo...
                                    </>
                                  ) : translationsByItem[item.id] ? (
                                    <>
                                      <RotateCcw size={14} /> Traduzir Novamente
                                    </>
                                  ) : (
                                    <>
                                      <Languages size={14} /> Traduzir Agora
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => setOpenTranslateItemId(null)}
                                  className="btn-ghost"
                                  style={{ padding: "6px 8px", fontSize: "12px" }}
                                  title="Fechar painel de tradução"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>

                            {/* Loading State */}
                            {loadingTranslationId === item.id && (
                              <div style={{
                                padding: "24px",
                                background: "rgba(59, 130, 246, 0.08)",
                                borderRadius: "10px",
                                border: "1px dashed rgba(59, 130, 246, 0.4)",
                                display: "flex",
                                alignItems: "center",
                                gap: "14px"
                              }}>
                                <Loader2 size={24} className="spin" color="#93C5FD" />
                                <div>
                                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                                    Traduzindo transcrição com Inteligência Artificial...
                                  </p>
                                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0" }}>
                                    Convertendo o áudio transcrito para o idioma selecionado com máxima fidelidade.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Translated Content */}
                            {!loadingTranslationId && translationsByItem[item.id] && (
                              <div>
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: "12px",
                                  flexWrap: "wrap",
                                  gap: "8px"
                                }}>
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#93C5FD" }}>
                                    Texto Traduzido ({translationsByItem[item.id].langName}):
                                  </span>

                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <button
                                      onClick={() => handleCopyText(translationsByItem[item.id].text, `trans-${item.id}`)}
                                      className="btn-ghost"
                                      style={{
                                        fontSize: "12px",
                                        padding: "6px 12px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        borderRadius: "6px",
                                        background: copiedId === `trans-${item.id}` ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                        color: copiedId === `trans-${item.id}` ? "#6EE7B7" : "var(--text-secondary)"
                                      }}
                                    >
                                      {copiedId === `trans-${item.id}` ? (
                                        <>
                                          <Check size={13} color="#6EE7B7" /> Copiado!
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} /> Copiar Tradução
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={() => exportToTxt(translationsByItem[item.id].text, `${item.title || "transcricao"}_${translationsByItem[item.id].langCode}`)}
                                      className="btn-ghost"
                                      style={{
                                        fontSize: "12px",
                                        padding: "6px 12px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        borderRadius: "6px",
                                        color: "var(--text-secondary)"
                                      }}
                                    >
                                      <FileText size={13} /> Baixar .TXT
                                    </button>

                                    <button
                                      onClick={() => handleExportTranslatedDocx(item)}
                                      disabled={exportingTransDocxId === item.id}
                                      className="btn-ghost"
                                      style={{
                                        fontSize: "12px",
                                        padding: "6px 12px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        borderRadius: "6px",
                                        background: "rgba(59, 130, 246, 0.1)",
                                        borderColor: "rgba(59, 130, 246, 0.35)",
                                        color: "#93C5FD"
                                      }}
                                    >
                                      {exportingTransDocxId === item.id ? (
                                        <>
                                          <Loader2 size={13} className="spin" /> Gerando Word...
                                        </>
                                      ) : (
                                        <>
                                          <FileDown size={13} /> Baixar Word (.DOCX)
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div style={{
                                  maxHeight: "340px",
                                  overflowY: "auto",
                                  padding: "16px",
                                  background: "rgba(0, 0, 0, 0.35)",
                                  borderRadius: "10px",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  fontSize: "14px",
                                  lineHeight: 1.7,
                                  color: "var(--text-primary)",
                                  whiteSpace: "pre-wrap"
                                }}>
                                  {translationsByItem[item.id].text}
                                </div>
                              </div>
                            )}

                            {/* Empty State when opened but not translated yet */}
                            {!loadingTranslationId && !translationsByItem[item.id] && (
                              <div style={{ textAlign: "center", padding: "24px 16px" }}>
                                <div style={{
                                  width: 44, height: 44,
                                  background: "rgba(59, 130, 246, 0.12)",
                                  borderRadius: "12px",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  margin: "0 auto 12px"
                                }}>
                                  <Globe size={22} color="#93C5FD" />
                                </div>
                                <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, margin: "0 0 4px" }}>
                                  {isEn ? "Ready to translate this text" : "Pronto para traduzir este texto"}
                                </p>
                                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                                  {isEn
                                    ? <>Select target language above and click <strong>Translate Now</strong> to convert this text with AI in seconds.</>
                                    : <>Selecione o idioma de destino no seletor acima e clique em <strong>Traduzir Agora</strong> para converter este texto com IA em segundos.</>}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Full transcript viewer with clickable timestamps & search highlighting */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700, margin: 0 }}>
                              {isEn ? "Full Transcript" : "Texto Completo"}
                            </p>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {isEn ? "Click any timestamp [00:00] to play synced audio" : "Clique em qualquer timestamp [00:00] para tocar o áudio sincronizado"}
                            </span>
                          </div>
                          <div style={{
                            maxHeight: "340px",
                            overflowY: "auto",
                            padding: "16px",
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                          }}>
                            <InteractiveTranscript text={item.text_content} searchQuery={searchQuery} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ReferralWidget user={user} profile={profile} />
      
      {/* Account Settings Sidebar Drawer (Barra Lateral) */}
      <AccountSidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        profile={profile}
        credits={credits}
        onProfileUpdated={(updatedProfile) => {
          setProfile(updatedProfile);
        }}
        onRefreshData={loadUserData}
        onLogout={handleLogout}
        initialSection={sidebarInitialSection}
      />

      {/* Pro Upgrade Modal for Free Users trying Translation */}
      {proUpgradeModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "16px"
        }} onClick={() => setProUpgradeModalOpen(false)}>
          <div style={{
            maxWidth: 480,
            width: "100%",
            background: "linear-gradient(180deg, #181829 0%, #0F0F1A 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(124, 58, 237, 0.4)",
            padding: "32px 28px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
            textAlign: "center"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: 60, height: 60,
              borderRadius: "18px",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
              fontSize: "28px"
            }}>
              👑
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#FFF", marginBottom: "8px" }}>
              {isEn ? "Exclusive Pro Feature" : "Recurso Exclusivo do Plano Pro"}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
              {isEn
                ? "Automated translation into 9 languages with Artificial Intelligence (English, Spanish, French, German, and more) is exclusively available for Pro and Business subscribers."
                : "A tradução automática para 9 idiomas com Inteligência Artificial (Inglês, Espanhol, Francês, Alemão e mais) é um recurso exclusivo para assinantes dos planos Pro e Business."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href={isEn ? "/en/pricing" : "/precos"}
                className="btn-primary"
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textAlign: "center",
                  display: "block",
                  borderRadius: "10px",
                  textDecoration: "none"
                }}
              >
                {isEn ? "View Plans with 25% OFF" : "Ver Planos com 25% OFF"}
              </Link>
              <button
                onClick={() => setProUpgradeModalOpen(false)}
                className="btn-ghost"
                style={{ padding: "10px 20px", fontSize: "13px" }}
              >
                {isEn ? "Close" : "Fechar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
