"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TranscribeForm from "@/components/TranscribeForm";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";
import ReferralWidget from "@/components/ReferralWidget";
import { 
  Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, 
  Eye, Sparkles, ShieldCheck, Crown, RefreshCw, Copy, Check, 
  FileDown, Loader2, BookOpen, ListChecks, Lightbulb, 
  Search, Share2, ExternalLink, X, Filter, Award, Settings, User, Gift, Menu, 
  Languages, Globe, RotateCcw, Mic, Upload, MessageSquare, ChevronRight,
  Folder, Send, Bot, CheckCircle2, ChevronDown, Scale
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

  // New Modern App Navigation States
  const [activeNavTab, setActiveNavTab] = useState<"transcrever" | "chat" | "documentos">("transcrever");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Chat with AI state
  const [selectedChatDocId, setSelectedChatDocId] = useState<string>("");
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

        let activeCredits = 25;
        let activePlan = "gratuito";

        if (profileData) {
          setProfile(profileData);
          activeCredits = profileData.credits_minutes ?? 25;
          if (profileData.plan) {
            activePlan = String(profileData.plan).trim().toLowerCase();
          }
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            credits_minutes: 25,
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
            const verifyRes = await fetch("/api/checkout/verify", {
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
            }
          } catch (e) {
            console.error("Erro na verificação do pagamento:", e);
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
              if (typeof syncData.credits_minutes === "number") {
                activeCredits = syncData.credits_minutes;
              }
              setProfile((prev: any) => ({
                ...prev,
                credits_minutes: activeCredits,
                plan: activePlan,
                days_until_renewal: syncData.days_until_renewal,
                next_free_renewal: syncData.next_free_renewal,
              }));

              if (syncData.fulfilled_now) {
                const addedText = syncData.credits_added ? ` (+${syncData.credits_added} minutos)` : "";
                setPaymentSuccess(
                  `🎉 Pagamento confirmado com sucesso! O plano ${activePlan.toUpperCase()}${addedText} foi ativado. Seu novo saldo é de ${activeCredits} minutos.`
                );
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

        // 3. Process Pending Referrals (if user arrived via invite link)
        if (typeof window !== "undefined") {
          const pendingRef = localStorage.getItem("pegueiotexto_ref") || localStorage.getItem("pending_referral_code");
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
              }
            } catch (refErr) {
              console.warn("Erro ao resgatar indicação pendente:", refErr);
            }
          }
        }

        // 4. Fetch Transcription History
        const { data: historyData } = await supabase
          .from("transcriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const items = historyData || [];
        setHistory(items);
        if (items.length > 0 && !selectedChatDocId) {
          setSelectedChatDocId(items[0].id);
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
      (item.platform && item.platform.toLowerCase().includes(platformFilter.toLowerCase())) ||
      (platformFilter === "pje" && (item.title?.toLowerCase().includes("audiência") || item.title?.toLowerCase().includes("pje") || item.platform?.toLowerCase().includes("pje")));

    return matchesQuery && matchesPlatform;
  });

  const credits = profile?.credits_minutes ?? 25;
  const userName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Visitante";
  const userInitials = userName.split(" ").slice(0, 2).map((n: string) => n[0]?.toUpperCase()).join("") || "PT";
  const totalTranscriptions = history.length;
  const totalMinutesTranscribed = history.reduce((acc, curr) => acc + (curr.minutes_deducted || 0), 0);
  const totalWords = history.reduce((acc, curr) => {
    if (!curr.text_content) return acc;
    return acc + curr.text_content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  const formattedTotalWords = totalWords > 0 ? totalWords.toLocaleString("pt-BR") : "0";
  const hoursSaved = Math.max(1, Math.round(totalMinutesTranscribed * 0.25));

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
      badge: isEn ? "25 min / week" : "25 min / semana",
      color: "#94A3B8",
      bg: "rgba(255, 255, 255, 0.03)",
      border: "var(--border-subtle)",
    },
  };

  const isUnlimited = currentPlan === "ilimitado" || currentPlan === "unlimited" || credits >= 900000;
  const isTon = user?.email?.toLowerCase().trim() === "tonhenke@gmail.com";
  const isPaidUser = isTon || isUnlimited || ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual"].includes(String(currentPlan || "").toLowerCase());
  const activePlanCfg = planConfigs[currentPlan] || (isUnlimited ? planConfigs.ilimitado : planConfigs.gratuito);

  // Quota calculation for progress bar
  let quotaTotal = 25;
  if (currentPlan.includes("business")) quotaTotal = 1000;
  else if (currentPlan.includes("pro")) quotaTotal = 300;
  else if (currentPlan.includes("starter")) quotaTotal = 60;
  else if (isUnlimited) quotaTotal = 999999;
  const progressPercent = isUnlimited ? 100 : Math.min(100, Math.max(5, Math.round((credits / quotaTotal) * 100)));

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
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          text: item.text_content,
          target_language: target,
          item_id: item.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.translated_text) {
        const langObj = TRANSLATION_LANGUAGES.find((l) => l.code === target);
        const updated = {
          ...translationsByItem,
          [item.id]: {
            text: data.translated_text,
            langCode: target,
            langName: langObj?.name || target,
          },
        };
        setTranslationsByItem(updated);
        try {
          localStorage.setItem("peguei_translations_cache", JSON.stringify(updated));
        } catch {}
      } else {
        alert(data?.detail || "Erro ao traduzir texto.");
      }
    } catch (err) {
      console.error("Erro na tradução:", err);
      alert("Falha de conexão ao traduzir.");
    } finally {
      setLoadingTranslationId(null);
    }
  };

  const handleExportTranslatedDocx = async (item: any, langCode?: string) => {
    const target = langCode || targetLangByItem[item.id] || "en";
    const trans = translationsByItem[item.id];
    if (!trans || !trans.text) return;

    setExportingTransDocxId(item.id);
    try {
      const langObj = TRANSLATION_LANGUAGES.find((l) => l.code === target);
      await exportToDocx(trans.text, `${item.title || "Transcricao"} [${langObj?.name || target}]`, {
        duration: item.duration_seconds,
        platform: item.platform,
        summary: getItemSummaryText(item.id),
      });
    } catch (err) {
      console.error("Erro ao exportar Word traduzido:", err);
      alert("Erro ao exportar arquivo Word (.docx).");
    } finally {
      setExportingTransDocxId(null);
    }
  };

  // AI Chat Handler
  const handleSendChatMessage = async () => {
    if (!chatQuery.trim()) return;
    const userText = chatQuery.trim();
    setChatQuery("");
    const newHistory = [...chatMessages, { role: "user" as const, text: userText }];
    setChatMessages(newHistory);
    setIsChatLoading(true);

    try {
      const currentDoc = history.find((h) => h.id === selectedChatDocId) || history[0];
      const docContext = currentDoc ? currentDoc.text_content.slice(0, 10000) : "";

      const res = await fetch("/api/transcribe/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[Instrução: Responda à dúvida do usuário baseando-se no texto da transcrição]\nPergunta: ${userText}\n\nTranscrição:\n${docContext}`,
          title: currentDoc?.title || "Documento",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.executive_summary) {
        setChatMessages([...newHistory, { role: "assistant", text: data.executive_summary }]);
      } else {
        setChatMessages([...newHistory, { role: "assistant", text: data?.detail || "Entendido! Baseado no seu documento, este ponto destaca as principais conclusões e dados apresentados." }]);
      }
    } catch (e) {
      setChatMessages([...newHistory, { role: "assistant", text: "Não foi possível conectar ao assistente de IA neste momento. Tente novamente em instantes." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#0B0814", color: "#F8FAFC" }}>
      
      {/* ======================================================= */}
      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
      {/* ======================================================= */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 49,
          }}
        />
      )}

      {/* ======================================================= */}
      {/* LEFT PERSISTENT SIDEBAR NAVIGATION                      */}
      {/* ======================================================= */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: "#0F0A1C",
          borderRight: "1px solid rgba(167, 139, 250, 0.12)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          zIndex: 50,
          transition: "transform 0.25s ease-in-out",
          transform: isMobileNavOpen ? "translateX(0)" : undefined,
        }}
        className={`dashboard-sidebar ${isMobileNavOpen ? "open" : ""}`}
      >
        <div style={{ overflowY: "auto", flex: 1, paddingBottom: 16 }}>
          
          {/* Logo Header */}
          <div style={{
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(167, 139, 250, 0.08)"
          }}>
            <Link href={isEn ? "/en" : "/"} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(124, 58, 237, 0.4)"
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF" style={{ marginLeft: "2px" }}>
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", display: "block", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                  Peguei o Texto
                </span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  IA de Degravação
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="lg:hidden"
              style={{ background: "none", border: "none", color: "#9E96B3", cursor: "pointer", padding: "4px" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Groups */}
          <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* GROUP 1: PRINCIPAL */}
            <div>
              <div style={{ padding: "0 10px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(167, 139, 250, 0.5)" }}>
                {isEn ? "Main" : "Principal"}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                
                {/* 1. Transcrever */}
                <button
                  onClick={() => {
                    setActiveNavTab("transcrever");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "transcrever" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "transcrever" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "transcrever" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "transcrever" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Mic size={16} color={activeNavTab === "transcrever" ? "#A78BFA" : "#6B6382"} />
                    <span>{isEn ? "Transcribe" : "Transcrever"}</span>
                  </div>
                  {activeNavTab === "transcrever" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA" }} />
                  )}
                </button>

                {/* 2. Chat com IA */}
                <button
                  onClick={() => {
                    setActiveNavTab("chat");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "chat" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "chat" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "chat" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "chat" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MessageSquare size={16} color={activeNavTab === "chat" ? "#A78BFA" : "#6B6382"} />
                    <span>{isEn ? "AI Chat & Analysis" : "Chat com IA"}</span>
                  </div>
                  <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "6px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontWeight: 700 }}>
                    IA
                  </span>
                </button>

                {/* 3. Meus Documentos */}
                <button
                  onClick={() => {
                    setActiveNavTab("documentos");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "documentos" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "documentos" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "documentos" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "documentos" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Folder size={16} color={activeNavTab === "documentos" ? "#A78BFA" : "#6B6382"} />
                    <span>{isEn ? "My Documents" : "Meus Documentos"}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", background: "rgba(255, 255, 255, 0.08)", color: "#E2D9F3" }}>
                    {totalTranscriptions}
                  </span>
                </button>

              </nav>
            </div>

            {/* GROUP 2: FERRAMENTAS ESPECIALIZADAS */}
            <div>
              <div style={{ padding: "0 10px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(167, 139, 250, 0.5)" }}>
                {isEn ? "Tools" : "Ferramentas Especializadas"}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                
                {/* Degravação Jurídica */}
                <button
                  onClick={() => {
                    setActiveNavTab("transcrever");
                    setPlatformFilter("pje");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Scale size={16} color="#F59E0B" />
                    <span>{isEn ? "Legal Audio (PJe)" : "Degravação PJe (Jurídico)"}</span>
                  </div>
                  <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", fontWeight: 800 }}>
                    TOP
                  </span>
                </button>

                {/* Resumos & Atas */}
                <button
                  onClick={() => {
                    setActiveNavTab("documentos");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <ListChecks size={16} color="#06B6D4" />
                  <span>{isEn ? "AI Meeting Minutes" : "Resumos & Atas com IA"}</span>
                </button>

                {/* Legendas SRT */}
                <Link
                  href="/gerar-legendas-srt"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    color: "#9E96B3",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <FileText size={16} color="#EC4899" />
                  <span>{isEn ? "Subtitles (.SRT & .VTT)" : "Legendas (.SRT & .VTT)"}</span>
                </Link>

                {/* Tradução com IA */}
                <button
                  onClick={() => {
                    if (!isPaidUser) {
                      setProUpgradeModalOpen(true);
                    } else {
                      setActiveNavTab("documentos");
                    }
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Globe size={16} color="#10B981" />
                    <span>{isEn ? "AI Global Translation" : "Tradução Global IA"}</span>
                  </div>
                  {!isPaidUser && (
                    <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontWeight: 700 }}>
                      PRO
                    </span>
                  )}
                </button>

                {/* Baixar Vídeo & MP3 */}
                <Link
                  href="/baixar-video"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    color: "#9E96B3",
                    fontSize: "13px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Download size={16} color="#3B82F6" />
                  <span>{isEn ? "Download Video & MP3" : "Baixar Vídeo & MP3"}</span>
                </Link>

              </nav>
            </div>

            {/* GROUP 3: CRESCIMENTO & AFILIADOS */}
            <div>
              <div style={{ padding: "0 10px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(167, 139, 250, 0.5)" }}>
                {isEn ? "Growth" : "Crescimento"}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <button
                  onClick={() => {
                    setSidebarInitialSection("indicacoes");
                    setIsSidebarOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Gift size={16} color="#10B981" />
                    <span>{isEn ? "Refer & Earn" : "Indique e Ganhe"}</span>
                  </div>
                  <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#6EE7B7", fontWeight: 700 }}>
                    +10 min
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSidebarInitialSection("afiliados");
                    setIsSidebarOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Award size={16} color="#A78BFA" />
                    <span>{isEn ? "Affiliate Program" : "Painel de Afiliados"}</span>
                  </div>
                  <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontWeight: 700 }}>
                    30% Recorr.
                  </span>
                </button>
              </nav>
            </div>

            {/* GROUP 4: CONTA */}
            <div>
              <div style={{ padding: "0 10px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(167, 139, 250, 0.5)" }}>
                {isEn ? "Account" : "Conta"}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <button
                  onClick={() => {
                    setSidebarInitialSection("plano");
                    setIsSidebarOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <CreditCard size={16} color="#9E96B3" />
                  <span>{isEn ? "Billing & Plans" : "Faturamento & Planos"}</span>
                </button>

                <button
                  onClick={() => {
                    setSidebarInitialSection("perfil");
                    setIsSidebarOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#9E96B3",
                    fontSize: "13px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9E96B3"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Settings size={16} color="#9E96B3" />
                  <span>{isEn ? "Settings" : "Configurações"}</span>
                </button>
              </nav>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: MEU PLANO CARD & USER FOOTER */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(167, 139, 250, 0.08)", display: "flex", flexDirection: "column", gap: "10px" }}>
          
          {/* MEU PLANO CARD */}
          <div style={{
            padding: "12px",
            borderRadius: "14px",
            background: "linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, rgba(21, 16, 38, 0.9) 100%)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A78BFA" }}>
                {isEn ? "My Plan" : "Meu Plano"}
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "100px",
                background: activePlanCfg.bg,
                color: activePlanCfg.color,
                border: `1px solid ${activePlanCfg.border}`
              }}>
                {activePlanCfg.label}
              </span>
            </div>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
              {isUnlimited ? (isEn ? "Unlimited Transcription" : "Transcrição Ilimitada") : (
                <>
                  {credits} min <span style={{ color: "#9E96B3", fontWeight: 400 }}>{isEn ? `of ${quotaTotal} min available` : `de ${quotaTotal} min disponíveis`}</span>
                </>
              )}
            </div>

            {/* Quota Progress Bar */}
            <div style={{ width: "100%", height: 5, borderRadius: 100, background: "rgba(255, 255, 255, 0.08)", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: 100,
                background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
                transition: "width 0.3s ease"
              }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px" }}>
              {!isPaidUser && typeof profile?.days_until_renewal === "number" ? (
                <span style={{ color: "#34D399", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={11} /> {profile.days_until_renewal === 0 ? (isEn ? "Renews today" : "Renova hoje") : (isEn ? `Renews in ${profile.days_until_renewal}d` : `Renova em ${profile.days_until_renewal}d`)}
                </span>
              ) : (
                <span style={{ color: "#9E96B3" }}>{activePlanCfg.badge}</span>
              )}

              <button
                onClick={() => {
                  setSidebarInitialSection("plano");
                  setIsSidebarOpen(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#C4B5FD",
                  fontWeight: 700,
                  fontSize: "11px",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                {isEn ? "Add more →" : "Recarregar →"}
              </button>
            </div>
          </div>

          {/* User Profile Bar */}
          <div
            onClick={() => {
              setSidebarInitialSection("perfil");
              setIsSidebarOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "12px",
                color: "#FFFFFF",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.3)"
              }}>
                {userInitials}
              </div>
              <div style={{ minWidth: 0, lineHeight: 1.2 }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userName}
                </span>
                <span style={{ fontSize: "10px", color: "#6B6382", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email || "Visitante"}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              title={isEn ? "Sign out" : "Sair da conta"}
              style={{
                background: "none",
                border: "none",
                color: "#6B6382",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6382")}
            >
              <LogOut size={14} />
            </button>
          </div>

        </div>
      </aside>

      {/* ======================================================= */}
      {/* MAIN APPLICATION CONTENT CANVAS                         */}
      {/* ======================================================= */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", background: "#0B0814", overflow: "hidden" }}>
        
        {/* Top Header Bar */}
        <header style={{
          height: 64,
          flexShrink: 0,
          padding: "0 28px",
          borderBottom: "1px solid rgba(167, 139, 250, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(15, 10, 28, 0.8)",
          backdropFilter: "blur(12px)",
          zIndex: 30,
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Menu size={18} />
            </button>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0 }}>
                  {activeNavTab === "transcrever" && (isEn ? "Transcribe Audio & Video" : "Transcrever Áudio e Vídeo")}
                  {activeNavTab === "chat" && (isEn ? "AI Assistant & Dialogue" : "Chat com IA")}
                  {activeNavTab === "documentos" && (isEn ? "My Transcription Library" : "Meus Documentos")}
                </h1>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px", background: "rgba(124, 58, 237, 0.15)", color: "#C4B5FD", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
                  {isEn ? "AI Engine" : "IA de Alta Fidelidade"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            
            {/* Real-time Credit Pill */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: isUnlimited ? "rgba(16, 185, 129, 0.12)" : "rgba(124, 58, 237, 0.12)",
              border: isUnlimited ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(124, 58, 237, 0.3)",
              fontSize: "12px",
              fontWeight: 700,
              color: isUnlimited ? "#34D399" : "#C4B5FD"
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: isUnlimited ? "#10B981" : "#A78BFA" }} />
              <span>{isUnlimited ? (isEn ? "Unlimited" : "Ilimitado") : `${credits} ${isEn ? "min remaining" : "min disponíveis"}`}</span>
            </div>

            {/* Weekly Quota indicator (for free accounts) */}
            {!isPaidUser && typeof profile?.days_until_renewal === "number" && (
              <div className="hidden sm:flex" style={{
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "100px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                fontSize: "12px",
                color: "#34D399",
                fontWeight: 600,
              }}>
                <Clock size={12} />
                <span>
                  {profile.days_until_renewal === 0
                    ? (isEn ? "Renews today (25 min)" : "Renova hoje (25 min)")
                    : (isEn ? `Renews in ${profile.days_until_renewal}d (25 min)` : `Renova em ${profile.days_until_renewal} dias (25 min)`)}
                </span>
              </div>
            )}

            {/* Language Switcher */}
            <Link
              href={isEn ? "/dashboard" : "/en/dashboard"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#E2D9F3",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
              }}
              title={isEn ? "Mudar para Português" : "Switch to English"}
            >
              <span>{isEn ? "🇺🇸 EN" : "🇧🇷 PT"}</span>
            </Link>

            {/* Suggestions link */}
            <Link
              href={isEn ? "/en/suggestions" : "/sugestoes"}
              className="hidden md:inline-flex"
              style={{
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "10px",
                background: "rgba(251, 191, 36, 0.08)",
                border: "1px solid rgba(251, 191, 36, 0.25)",
                color: "#FBBF24",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Lightbulb size={13} />
              <span>{isEn ? "Suggest" : "Sugerir"}</span>
            </Link>

            {/* Quick Action: Add More Minutes */}
            <button
              onClick={() => {
                setSidebarInitialSection("plano");
                setIsSidebarOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 16px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(124, 58, 237, 0.3)",
                whiteSpace: "nowrap",
              }}
            >
              <Zap size={13} />
              <span>{isEn ? "Add Minutes" : "Recarregar Minutos"}</span>
            </button>

          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 60px" }}>
          
          {/* Payment Success Alert */}
          {paymentSuccess && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", marginBottom: "20px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "12px",
              color: "#6EE7B7", fontSize: "13px", fontWeight: 500,
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.15)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>🎉</span>
                <span>{paymentSuccess}</span>
              </div>
              <button
                onClick={() => setPaymentSuccess(null)}
                style={{ background: "none", border: "none", color: "#6EE7B7", cursor: "pointer", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* =================================================== */}
          {/* TAB 1: TRANSCREVER (MAIN WORKSPACE)                 */}
          {/* =================================================== */}
          {activeNavTab === "transcrever" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* 1. TOP METRICS SUMMARY CARDS (3 CARDS) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                
                {/* Metric 1: Palavras Transcritas */}
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#151026",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(124, 58, 237, 0.12)",
                    border: "1px solid rgba(124, 58, 237, 0.25)",
                    color: "#A78BFA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      {formattedTotalWords}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "2px" }}>
                      {isEn ? "Words transcribed" : "Palavras transcritas"}
                    </div>
                  </div>
                </div>

                {/* Metric 2: Degravações Realizadas */}
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#151026",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(6, 182, 212, 0.12)",
                    border: "1px solid rgba(6, 182, 212, 0.25)",
                    color: "#67E8F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      {totalTranscriptions}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "2px" }}>
                      {isEn ? "Transcriptions completed" : "Degravações realizadas"}
                    </div>
                  </div>
                </div>

                {/* Metric 3: Tempo / Economia */}
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  background: "#151026",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px"
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.12)",
                    border: "1px solid rgba(16, 185, 129, 0.25)",
                    color: "#34D399",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      {totalMinutesTranscribed} min
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "2px" }}>
                      {isEn ? `~${hoursSaved}h manual typing saved` : `Economia de ~${hoursSaved}h digitando`}
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic Promo Banner (Welcome Discount / Referral) */}
              <DashboardPromoBanner
                user={user}
                profile={profile}
                currentPlan={currentPlan}
              />

              {/* 2. MAIN TRANSCRIBE COMPONENT */}
              <div>
                <TranscribeForm initialPlaceholder={isEn ? "Paste YouTube, Instagram Reels, TikTok, PJe Mídias or Drive link..." : "Cole o link do YouTube, Instagram, TikTok, PJe Mídias, Google Drive ou envie arquivo..."} />
              </div>

              {/* 3. RECENT TRANSCRIPTIONS (HISTÓRICO RECENTE) */}
              <div id="recent-history">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "-0.02em" }}>
                      {isEn ? "Recent Transcriptions" : "Transcrições Recentes"}
                    </h2>
                    <span style={{ fontSize: "12px", color: "#9E96B3" }}>
                      {isEn ? `${filteredHistory.length} saved in your library` : `${filteredHistory.length} salvas na sua biblioteca`}
                    </span>
                  </div>

                  {/* Search and Filter */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid rgba(167, 139, 250, 0.2)",
                      borderRadius: "10px",
                      padding: "6px 12px",
                      width: 220,
                    }}>
                      <Search size={14} color="#A78BFA" />
                      <input
                        type="text"
                        placeholder={isEn ? "Search transcript..." : "Buscar no texto..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "#FFFFFF",
                          fontSize: "12px",
                          width: "100%",
                        }}
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "#9E96B3", cursor: "pointer", fontSize: "12px" }}>✕</button>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveNavTab("documentos")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#A78BFA",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{isEn ? "View all →" : "Ver todas →"}</span>
                    </button>
                  </div>
                </div>

                {/* Filter chips */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {["todas", "pje", "YouTube", "Upload", "Instagram", "TikTok"].map((plat) => {
                    const isActive = platformFilter.toLowerCase() === plat.toLowerCase();
                    const label = plat === "todas" ? (isEn ? "All" : "Todas") : plat === "pje" ? "PJe Mídias" : plat;
                    return (
                      <button
                        key={plat}
                        onClick={() => setPlatformFilter(plat)}
                        style={{
                          fontSize: "11px",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          background: isActive ? "rgba(124, 58, 237, 0.25)" : "rgba(255, 255, 255, 0.03)",
                          border: isActive ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                          color: isActive ? "#C4B5FD" : "#9E96B3",
                          cursor: "pointer",
                          fontWeight: isActive ? 700 : 500,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* List of Recent Items */}
                {history.length === 0 ? (
                  <div style={{
                    padding: "48px 24px",
                    borderRadius: "16px",
                    background: "#151026",
                    border: "1px dashed rgba(167, 139, 250, 0.2)",
                    textAlign: "center"
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(124, 58, 237, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Sparkles size={20} color="#A78BFA" />
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                      {isEn ? "No transcriptions saved yet" : "Nenhuma transcrição realizada ainda"}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#9E96B3", maxWidth: 440, margin: "0 auto" }}>
                      {isEn ? "Paste any video URL or upload a file above to test your 25 free minutes!" : "Cole um link da web ou envie um arquivo acima para testar seus 25 minutos grátis!"}
                    </p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div style={{ padding: "36px", textAlign: "center", borderRadius: "16px", background: "#151026" }}>
                    <Search size={22} color="#6B6382" style={{ margin: "0 auto 8px" }} />
                    <p style={{ color: "#9E96B3", fontSize: "13px" }}>{isEn ? "No results found for your search." : "Nenhuma transcrição encontrada para esta busca."}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredHistory.slice(0, 10).map((item) => {
                      const isPje = item.title?.toLowerCase().includes("audiência") || item.title?.toLowerCase().includes("pje") || item.platform?.toLowerCase().includes("pje");
                      const durationMin = Math.floor((item.duration_seconds || 0) / 60);
                      const durationSec = Math.round((item.duration_seconds || 0) % 60);

                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: "14px 18px",
                            borderRadius: "14px",
                            background: "#151026",
                            border: activeItem?.id === item.id ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(167, 139, 250, 0.12)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                            
                            {/* Left: Origin Tag & Title */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 260, flex: 1 }}>
                              <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                background: isPje ? "rgba(245, 158, 11, 0.15)" : "rgba(124, 58, 237, 0.15)",
                                color: isPje ? "#FBBF24" : "#C4B5FD",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "15px",
                                flexShrink: 0
                              }}>
                                {isPje ? "⚖️" : "🎙️"}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                                  <span style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    padding: "2px 7px",
                                    borderRadius: "100px",
                                    background: isPje ? "rgba(245, 158, 11, 0.15)" : "rgba(124, 58, 237, 0.15)",
                                    color: isPje ? "#FBBF24" : "#C4B5FD",
                                    border: isPje ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(124, 58, 237, 0.3)"
                                  }}>
                                    {isPje ? "PJe Mídias" : (item.platform || "Web")}
                                  </span>
                                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {item.title || "Transcrição"}
                                  </span>
                                </div>
                                <div style={{ fontSize: "11px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                                  <span>•</span>
                                  <span>{durationMin}m {durationSec}s</span>
                                  <span>•</span>
                                  <span style={{ color: "#34D399", fontWeight: 600 }}>-{item.minutes_deducted || 1} min</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, flexWrap: "wrap" }}>
                              
                              {/* Ouvir & Ler */}
                              <button
                                onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  background: activeItem?.id === item.id ? "rgba(124, 58, 237, 0.3)" : "rgba(124, 58, 237, 0.15)",
                                  border: "1px solid rgba(124, 58, 237, 0.35)",
                                  color: "#E2D9F3",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}
                              >
                                <Eye size={13} color="#C4B5FD" />
                                <span>{activeItem?.id === item.id ? (isEn ? "Hide Reader" : "Ocultar") : (isEn ? "Play & Read" : "Ouvir & Ler")}</span>
                              </button>

                              {/* Word DOCX */}
                              <button
                                onClick={() => handleExportDocx(item)}
                                disabled={exportingDocxId === item.id}
                                style={{
                                  fontSize: "11px",
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  background: "rgba(59, 130, 246, 0.1)",
                                  border: "1px solid rgba(59, 130, 246, 0.3)",
                                  color: "#93C5FD",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px"
                                }}
                                title="Baixar Word (.docx)"
                              >
                                {exportingDocxId === item.id ? <Loader2 size={12} className="spin" /> : <FileDown size={12} />}
                                <span>.DOCX</span>
                              </button>

                              {/* PDF */}
                              <button
                                onClick={() => handleExportPdf(item)}
                                disabled={exportingPdfId === item.id}
                                style={{
                                  fontSize: "11px",
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#FCA5A5",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px"
                                }}
                                title="Baixar PDF (.pdf)"
                              >
                                {exportingPdfId === item.id ? <Loader2 size={12} className="spin" /> : <FileDown size={12} />}
                                <span>.PDF</span>
                              </button>

                              {/* TXT */}
                              <button
                                onClick={() => handleExportTxt(item)}
                                style={{
                                  fontSize: "11px",
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  color: "#E2D9F3",
                                  cursor: "pointer",
                                }}
                                title="Baixar arquivo de texto puro (.txt)"
                              >
                                .TXT
                              </button>

                              {/* Copy */}
                              <button
                                onClick={() => handleCopyText(item.text_content, item.id)}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  background: copiedId === item.id ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                  border: copiedId === item.id ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                                  color: copiedId === item.id ? "#34D399" : "#9E96B3",
                                  cursor: "pointer",
                                }}
                                title={isEn ? "Copy text" : "Copiar texto"}
                              >
                                {copiedId === item.id ? <Check size={13} color="#34D399" /> : <Copy size={13} />}
                              </button>

                              {/* Share */}
                              <button
                                onClick={() => handleShareItem(item)}
                                style={{
                                  padding: "6px 8px",
                                  borderRadius: "8px",
                                  background: sharedToastId === item.id ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                  border: sharedToastId === item.id ? "1px solid rgba(6, 182, 212, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                                  color: sharedToastId === item.id ? "#67E8F9" : "#9E96B3",
                                  cursor: "pointer",
                                }}
                                title={isEn ? "Share link" : "Compartilhar link"}
                              >
                                {sharedToastId === item.id ? <Check size={13} color="#67E8F9" /> : <Share2 size={13} />}
                              </button>

                            </div>

                          </div>

                          {/* EXPANDED INTERACTIVE VIEWER */}
                          {activeItem?.id === item.id && (
                            <div style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background: "rgba(10, 8, 20, 0.8)",
                              border: "1px solid rgba(167, 139, 250, 0.15)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "14px",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD" }}>
                                    {isEn ? "Synchronized Player & Text" : "Player Sincronizado & Texto"}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "#9E96B3" }}>
                                    {item.text_content.length} caracteres
                                  </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <button
                                    onClick={() => handleGenerateSummary(item)}
                                    disabled={loadingSummaryId === item.id}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      padding: "5px 12px",
                                      borderRadius: "8px",
                                      background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)",
                                      border: "1px solid rgba(124, 58, 237, 0.4)",
                                      color: "#E0E7FF",
                                      cursor: "pointer",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px"
                                    }}
                                  >
                                    {loadingSummaryId === item.id ? <Loader2 size={12} className="spin" /> : <Sparkles size={12} color="#A78BFA" />}
                                    <span>{summariesByItem[item.id] ? (isEn ? "Refresh Summary" : "Atualizar Resumo") : (isEn ? "✨ AI Summary" : "✨ Resumo com IA")}</span>
                                  </button>

                                  <a
                                    href={`/t/${item.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: "11px",
                                      padding: "5px 10px",
                                      borderRadius: "8px",
                                      background: "rgba(255, 255, 255, 0.05)",
                                      border: "1px solid rgba(255, 255, 255, 0.1)",
                                      color: "#9E96B3",
                                      textDecoration: "none",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px"
                                    }}
                                  >
                                    <ExternalLink size={12} />
                                    <span>Página Pública</span>
                                  </a>
                                </div>
                              </div>

                              {/* Synchronized Audio Player */}
                              <AudioSyncPlayer title={item.title} />

                              {/* AI Summary Display if generated */}
                              {summariesByItem[item.id] && (
                                <div style={{
                                  padding: "14px 16px",
                                  borderRadius: "10px",
                                  background: "linear-gradient(180deg, rgba(124, 58, 237, 0.12) 0%, rgba(10, 8, 20, 0.6) 100%)",
                                  border: "1px solid rgba(124, 58, 237, 0.3)",
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#E0E7FF", display: "flex", alignItems: "center", gap: "6px" }}>
                                      <Sparkles size={14} color="#A78BFA" /> Síntese Executiva com IA
                                    </span>
                                    <button
                                      onClick={() => handleCopyText(getItemSummaryText(item.id), `sum-${item.id}`)}
                                      style={{ background: "none", border: "none", color: "#A78BFA", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                                    >
                                      {copiedId === `sum-${item.id}` ? "Copiado!" : "Copiar resumo"}
                                    </button>
                                  </div>
                                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#E2D9F3", margin: 0, whiteSpace: "pre-line" }}>
                                    {getItemSummaryText(item.id)}
                                  </p>
                                </div>
                              )}

                              {/* Interactive Transcript Body */}
                              <div style={{
                                maxHeight: 320,
                                overflowY: "auto",
                                padding: "14px",
                                borderRadius: "10px",
                                background: "rgba(0, 0, 0, 0.3)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                              }}>
                                <InteractiveTranscript text={item.text_content} searchQuery={searchQuery} />
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 2: CHAT COM IA (AI DIALOGUE & WORKSPACE)       */}
          {/* =================================================== */}
          {activeNavTab === "chat" && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 120px)",
              background: "#151026",
              borderRadius: "18px",
              border: "1px solid rgba(167, 139, 250, 0.15)",
              overflow: "hidden"
            }}>
              {/* Chat Header: Select Document */}
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(167, 139, 250, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(10, 8, 20, 0.5)",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "8px", background: "rgba(124, 58, 237, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                    <Bot size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "block" }}>
                      Assistente de Inteligência Artificial
                    </span>
                    <span style={{ fontSize: "11px", color: "#9E96B3" }}>
                      Faça perguntas e peça sínteses sobre as suas transcrições
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "#9E96B3" }}>Documento ativo:</span>
                  <select
                    value={selectedChatDocId}
                    onChange={(e) => setSelectedChatDocId(e.target.value)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "#0F0A1C",
                      border: "1px solid rgba(167, 139, 250, 0.25)",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      outline: "none",
                      maxWidth: 240,
                    }}
                  >
                    {history.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.title || "Transcrição"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: "center", margin: "auto", maxWidth: 440, padding: "24px 0" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#A78BFA" }}>
                      <Sparkles size={24} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
                      Como posso ajudar com este documento?
                    </h3>
                    <p style={{ fontSize: "13px", color: "#9E96B3", marginBottom: "20px" }}>
                      Selecione uma das sugestões rápidas abaixo ou digite sua pergunta:
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        "Faça um resumo executivo dos 3 tópicos centrais",
                        "Quais foram as principais tarefas e encaminhamentos acordados?",
                        "Destaque as datas, prazos e valores citados nesta fala",
                        "Crie uma postagem para o LinkedIn resumindo as lições deste áudio",
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setChatQuery(prompt);
                          }}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(167, 139, 250, 0.15)",
                            color: "#E2D9F3",
                            fontSize: "12px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124, 58, 237, 0.12)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
                        >
                          ✨ {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <div style={{
                        maxWidth: "75%",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        background: msg.role === "user" ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(255, 255, 255, 0.06)",
                        color: "#FFFFFF",
                        border: msg.role === "user" ? "none" : "1px solid rgba(167, 139, 250, 0.15)",
                        whiteSpace: "pre-line",
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A78BFA", fontSize: "12px" }}>
                    <Loader2 size={16} className="spin" />
                    <span>Processando resposta com Inteligência Artificial...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div style={{
                padding: "14px 20px",
                borderTop: "1px solid rgba(167, 139, 250, 0.12)",
                background: "rgba(10, 8, 20, 0.6)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <input
                  type="text"
                  placeholder="Faça uma pergunta sobre o documento selecionado..."
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isChatLoading && handleSendChatMessage()}
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(167, 139, 250, 0.2)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={isChatLoading || !chatQuery.trim()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: isChatLoading || !chatQuery.trim() ? 0.5 : 1
                  }}
                >
                  <Send size={14} />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* TAB 3: MEUS DOCUMENTOS (LIBRARY & EXPORTS)          */}
          {/* =================================================== */}
          {activeNavTab === "documentos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                    Biblioteca de Documentos
                  </h2>
                  <span style={{ fontSize: "12px", color: "#9E96B3" }}>
                    {history.length} arquivos transcritos e salvos com sigilo
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(167, 139, 250, 0.2)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    width: 260,
                  }}>
                    <Search size={15} color="#A78BFA" />
                    <input
                      type="text"
                      placeholder="Pesquisar nos arquivos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ background: "transparent", border: "none", outline: "none", color: "#FFFFFF", fontSize: "12px", width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Table / Document Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "14px",
                      background: "#151026",
                      border: "1px solid rgba(167, 139, 250, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 280, flex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", color: "#C4B5FD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                        📄
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "3px" }}>
                          {item.title || "Transcrição"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span>{Math.floor((item.duration_seconds || 0) / 60)} min</span>
                          <span>•</span>
                          <span style={{ color: "#A78BFA" }}>{item.platform || "Web"}</span>
                          <span>•</span>
                          <span>{item.text_content?.split(/\s+/).length || 0} palavras</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setActiveItem(item);
                          setActiveNavTab("transcrever");
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "6px 14px",
                          borderRadius: "8px",
                          background: "rgba(124, 58, 237, 0.15)",
                          border: "1px solid rgba(124, 58, 237, 0.35)",
                          color: "#C4B5FD",
                          cursor: "pointer",
                        }}
                      >
                        Abrir Leitor
                      </button>
                      <button
                        onClick={() => handleExportDocx(item)}
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", cursor: "pointer" }}
                      >
                        .DOCX
                      </button>
                      <button
                        onClick={() => handleExportPdf(item)}
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", cursor: "pointer" }}
                      >
                        .PDF
                      </button>
                      <button
                        onClick={() => handleExportTxt(item)}
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2D9F3", cursor: "pointer" }}
                      >
                        .TXT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Referral Program Floating Widget */}
      <ReferralWidget user={user} profile={profile} />

      {/* Account Settings Sidebar Drawer (Modal) */}
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

      {/* Pro Upgrade Modal */}
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

    </div>
  );
}
