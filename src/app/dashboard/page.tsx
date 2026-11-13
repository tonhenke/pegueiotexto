"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TranscribeForm from "@/components/TranscribeForm";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";
import VideoDownloader from "@/components/VideoDownloader";
import DashboardPromoBanner from "@/components/DashboardPromoBanner";
import { 
  Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, 
  Eye, Sparkles, ShieldCheck, Crown, RefreshCw, Copy, Check, 
  FileDown, Loader2, BookOpen, ListChecks, Lightbulb, 
  Search, Share2, ExternalLink, X, Filter, Award, Settings, User, Gift, Menu, 
  Languages, Globe, RotateCcw, Mic, Upload, MessageSquare, ChevronRight,
  Folder, Send, Bot, CheckCircle2, ChevronDown, Scale, DollarSign,
  TrendingUp, Users, Scissors, Lock, EyeOff, Play, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { 
  exportToTxt, 
  exportToDocx, 
  exportToPdf, 
  exportToSrt, 
  exportToVtt 
} from "@/lib/exportUtils";

export type NavTab = 
  | "transcrever" 
  | "chat" 
  | "documentos" 
  | "legendas" 
  | "traducao" 
  | "downloader" 
  | "indicacoes" 
  | "afiliados" 
  | "faturamento" 
  | "configuracoes";

const TRANSLATION_LANGUAGES = [
  { code: "en", name: "Inglês (English)", flag: "🇺🇸" },
  { code: "es", name: "Espanhol (Español)", flag: "🇪🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "fr", name: "Francês (Français)", flag: "🇫🇷" },
  { code: "de", name: "Alemão (Deutsch)", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japonês (日本語)", flag: "🇯🇵" },
  { code: "zh", name: "Chinês (中文)", flag: "🇨🇳" },
  { code: "ru", name: "Russo (Русский)", flag: "🇷🇺" },
];

const ANNUAL_PLANS = [
  {
    id: "starter_annual",
    name: "Starter Anual",
    priceMonthly: "R$ 3,74",
    priceTotal: "R$ 44,90 faturados ao ano",
    savings: "Economize 3 meses (R$ 13,90)",
    minutes: "720 min / ano (1h inteira por mês)",
    desc: "Acesso contínuo com a máxima economia para advogados e criadores individuais.",
    color: "#06B6D4",
    features: [
      "720 minutos anuais de degravação com IA",
      "Exportação para Word (.DOCX) e PDF",
      "Player de áudio sincronizado com timestamps",
      "Diarização e separação de oradores",
      "Validade de 12 meses para consumir",
    ],
    popular: false,
    cta: "Assinar Starter Anual",
  },
  {
    id: "pro_annual",
    name: "Pro Anual",
    priceMonthly: "R$ 13,25",
    priceTotal: "R$ 159,00 faturados ao ano",
    savings: "Economize R$ 55,80 (3 meses grátis)",
    minutes: "3.600 min / ano (5h inteiras por mês)",
    desc: "O plano preferido por escritórios de advocacia, pesquisadores e criadores de conteúdo.",
    color: "#7C3AED",
    badge: "Recomendado para Advocacia",
    features: [
      "3.600 minutos anuais com IA de máxima fidelidade",
      "Degravação forense adaptada ao PJe Mídias",
      "Exportação direta para Word (.DOCX) forense",
      "Resumos executivos e atas com IA inclusos",
      "Tradução global para mais de 10 idiomas",
      "Legendas .SRT e .VTT sincronizadas",
      "Player interativo com timestamps exatos",
      "Suporte prioritário via WhatsApp",
    ],
    popular: true,
    cta: "Assinar Pro Anual",
  },
  {
    id: "business_annual",
    name: "Business Anual",
    priceMonthly: "R$ 56,58",
    priceTotal: "R$ 679,00 faturados ao ano",
    savings: "Economize R$ 279,80 (3 meses grátis)",
    minutes: "12.000 min / ano (~16,6h por mês)",
    desc: "Para bancas de advocacia de grande porte, empresas e agências de alto fluxo de transcrição.",
    color: "#EC4899",
    features: [
      "12.000 minutos anuais com prioridade de processamento",
      "Acesso completo a todas as ferramentas e IA",
      "Exportações ilimitadas em Word, PDF, SRT e TXT",
      "Sínteses, atas e resumos executivos ilimitados",
      "Histórico permanente protegido na nuvem",
      "Gerente de conta e suporte VIP dedicado 24/7",
    ],
    popular: false,
    cta: "Assinar Business Anual",
  },
];

const MONTHLY_PLANS = [
  {
    id: "starter",
    name: "Starter Avulso",
    priceMonthly: "R$ 4,90",
    priceTotal: "pagamento único",
    savings: null,
    minutes: "60 minutos",
    desc: "Perfeito para uso pontual e testes rápidos sem cobrança recorrente.",
    color: "#06B6D4",
    features: [
      "60 minutos de transcrição com IA",
      "Download em arquivo de texto puro (.TXT)",
      "Suporte a links e arquivos",
      "Validade de 6 meses para consumir",
    ],
    popular: false,
    cta: "Comprar Starter",
  },
  {
    id: "pro",
    name: "Pro Mensal",
    priceMonthly: "R$ 17,90",
    priceTotal: "por mês",
    savings: "Mais Procurado",
    minutes: "300 min / mês (5 horas)",
    desc: "Plano mensal flexível com todas as ferramentas profissionais inclusas.",
    color: "#7C3AED",
    badge: "Mais Popular",
    features: [
      "300 minutos mensais de transcrição com IA",
      "Exportação para Word (.DOCX), PDF e SRT",
      "Resumos executivos e atas com IA inclusos",
      "Diarização de oradores e timestamps exatos",
      "Tradução automática com IA",
    ],
    popular: true,
    cta: "Assinar Pro Mensal",
  },
  {
    id: "business",
    name: "Business Mensal",
    priceMonthly: "R$ 79,90",
    priceTotal: "por mês",
    savings: null,
    minutes: "1.000 min / mês",
    desc: "Alto volume mensal com suporte prioritário para escritórios e equipes.",
    color: "#EC4899",
    features: [
      "1.000 minutos mensais de transcrição com IA",
      "Exportação em todos os formatos (.DOCX, .PDF, .SRT, .TXT)",
      "Resumos, sínteses e atas ilimitadas",
      "Histórico permanente na nuvem",
      "Suporte prioritário via WhatsApp",
    ],
    popular: false,
    cta: "Assinar Business Mensal",
  },
];

// Helper to generate SRT string from transcription text if not in DB
function generateSrtFromText(text: string, totalDurationSeconds: number = 60): string {
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const total = sentences.length;
  const avgDuration = Math.max(2, Math.min(6, (totalDurationSeconds || 60) / Math.max(1, total)));

  const formatSrtTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
  };

  let srt = "";
  let currentTime = 0;
  sentences.forEach((sentence, index) => {
    const cleanSentence = sentence.trim();
    if (!cleanSentence) return;
    const startTime = currentTime;
    const endTime = startTime + avgDuration;
    currentTime = endTime + 0.1;

    srt += `${index + 1}\n`;
    srt += `${formatSrtTime(startTime)} --> ${formatSrtTime(endTime)}\n`;
    srt += `${cleanSentence}\n\n`;
  });

  return srt.trim();
}

function generateVttFromSrt(srtContent: string): string {
  if (!srtContent) return "WEBVTT\n\n";
  const vttTime = srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  return `WEBVTT\n\n${vttTime}`;
}

export default function DashboardPage() {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const supabase = createClient();

  // Core User and State
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

  // Central Navigation Tab State
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("transcrever");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Chat with AI state
  const [selectedChatDocId, setSelectedChatDocId] = useState<string>("");
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Subtitles (.SRT & .VTT) state
  const [selectedSrtDocId, setSelectedSrtDocId] = useState<string>("");
  const [srtCopied, setSrtCopied] = useState(false);
  const [legendasMode, setLegendasMode] = useState<"existing" | "new">("existing");

  // Translation state
  const [selectedTranslationDocId, setSelectedTranslationDocId] = useState<string>("manual");
  const [customTranslationText, setCustomTranslationText] = useState("");
  const [targetTranslationLang, setTargetTranslationLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResultText, setTranslatedResultText] = useState("");
  const [translationCopied, setTranslationCopied] = useState(false);
  const [exportingTranslationDocx, setExportingTranslationDocx] = useState(false);

  // Referral state
  const [referralStats, setReferralStats] = useState({ total_invites: 0, total_minutes_earned: 0 });
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralCodeCopied, setReferralCodeCopied] = useState(false);

  // Affiliate state
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [affiliateMetrics, setAffiliateMetrics] = useState<any>(null);
  const [affiliateConversions, setAffiliateConversions] = useState<any[]>([]);
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  const [affiliatePixKey, setAffiliatePixKey] = useState("");
  const [affiliatePayoutAmount, setAffiliatePayoutAmount] = useState("");
  const [affiliatePayoutLoading, setAffiliatePayoutLoading] = useState(false);
  const [affiliatePayoutMsg, setAffiliatePayoutMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [affiliateJoinLoading, setAffiliateJoinLoading] = useState(false);

  // Billing & Plans state
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [loadingCheckoutPlan, setLoadingCheckoutPlan] = useState<string | null>(null);

  // Settings & Profile state
  const [configSubtab, setConfigSubtab] = useState<"perfil" | "senha" | "preferencias">("perfil");
  const [configName, setConfigName] = useState("");
  const [configSavingName, setConfigSavingName] = useState(false);
  const [configNameSuccess, setConfigNameSuccess] = useState<string | null>(null);
  const [configNameError, setConfigNameError] = useState<string | null>(null);

  const [configNewPassword, setConfigNewPassword] = useState("");
  const [configConfirmPassword, setConfigConfirmPassword] = useState("");
  const [configShowPassword, setConfigShowPassword] = useState(false);
  const [configSavingPassword, setConfigSavingPassword] = useState(false);
  const [configPasswordSuccess, setConfigPasswordSuccess] = useState<string | null>(null);
  const [configPasswordError, setConfigPasswordError] = useState<string | null>(null);

  const [prefLanguage, setPrefLanguage] = useState("pt");
  const [prefDiarization, setPrefDiarization] = useState(true);
  const [prefTimestamps, setPrefTimestamps] = useState(true);
  const [prefSavedMessage, setPrefSavedMessage] = useState(false);

  // Translations cache by item
  const [translationsByItem, setTranslationsByItem] = useState<Record<string, { text: string; langCode: string; langName: string }>>({});
  const [targetLangByItem, setTargetLangByItem] = useState<Record<string, string>>({});
  const [loadingTranslationId, setLoadingTranslationId] = useState<string | null>(null);
  const [exportingTransDocxId, setExportingTransDocxId] = useState<string | null>(null);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token;
        const authHeaders: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};

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
          if (profileData.name) {
            setConfigName(profileData.name);
          }
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            credits_minutes: 25,
            plan: "gratuito",
          });
          setConfigName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
        }

        // Referral source attribution fallback
        if (user.email) {
          const userMetaRef = user.user_metadata?.referral_code_used;
          const refSource =
            (userMetaRef ? `convite_${userMetaRef}` : "") ||
            (typeof window !== "undefined" &&
              (localStorage.getItem("pegueiotexto_ref")
                ? `convite_${localStorage.getItem("pegueiotexto_ref")}`
                : ""));

          fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              email: user.email,
              name: profileData?.name || user.user_metadata?.full_name || user.email.split("@")[0],
              credits_minutes: activeCredits,
              plan: activePlan,
              referral_source: refSource,
            }),
          }).catch(() => {});
        }

        setCurrentPlan(activePlan);

        // Fetch User Transcription History
        try {
          const historyRes = await fetch("/api/transcribe/preview", {
            headers: authHeaders,
          });
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            if (Array.isArray(historyData)) {
              setHistory(historyData);
              if (historyData.length > 0) {
                setActiveItem(historyData[0]);
                setSelectedChatDocId(historyData[0].id);
                setSelectedSrtDocId(historyData[0].id);
                setSelectedTranslationDocId(historyData[0].id);
              }
            }
          }
        } catch (e) {
          console.error("Falha ao carregar histórico:", e);
        }

        // Load Referral Stats
        try {
          const refRes = await fetch(`/api/referral?user_id=${user.id}`);
          if (refRes.ok) {
            const refData = await refRes.json();
            setReferralStats({
              total_invites: refData.total_invites || 0,
              total_minutes_earned: refData.total_minutes_earned || 0,
            });
          }
        } catch (e) {
          console.error("Falha ao carregar estatísticas de convite:", e);
        }

        // Load Affiliate Info
        loadAffiliateData(user);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    } finally {
      setLoading(false);
    }
  }

  const loadAffiliateData = async (activeUser: any) => {
    if (!activeUser?.id) return;
    try {
      setAffiliateLoading(true);
      const query = activeUser.email
        ? `user_id=${activeUser.id}&email=${encodeURIComponent(activeUser.email)}`
        : `user_id=${activeUser.id}`;
      const res = await fetch(`/api/affiliates?action=me&${query}`);
      const data = await res.json();
      if (data.is_affiliate) {
        setAffiliateData(data.affiliate);
        setAffiliateMetrics(data.metrics || null);
        setAffiliateConversions(data.conversions || []);
      } else {
        setAffiliateData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar afiliado:", err);
    } finally {
      setAffiliateLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // Check query params for tab switching or payment alerts
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as NavTab;
      if (tabParam) {
        setActiveNavTab(tabParam);
      }
      if (params.get("payment") === "success") {
        setPaymentSuccess("Parabéns! Sua recarga de minutos foi creditada com sucesso.");
      }
      try {
        const cached = localStorage.getItem("peguei_translations_cache");
        if (cached) {
          setTranslationsByItem(JSON.parse(cached));
        }
      } catch {}
    }
  }, []);

  // Update selected doc text when selected translation doc changes
  useEffect(() => {
    if (selectedTranslationDocId && selectedTranslationDocId !== "manual") {
      const doc = history.find((h) => h.id === selectedTranslationDocId);
      if (doc) {
        setCustomTranslationText(doc.text_content || "");
        if (translationsByItem[doc.id]?.text) {
          setTranslatedResultText(translationsByItem[doc.id].text);
          setTargetTranslationLang(translationsByItem[doc.id].langCode || "en");
        } else {
          setTranslatedResultText("");
        }
      }
    }
  }, [selectedTranslationDocId, history, translationsByItem]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = isEn ? "/en" : "/";
  };

  // Helper values
  const credits = profile?.credits_minutes ?? 25;
  const isPaidUser = currentPlan !== "gratuito";
  const isUnlimited = currentPlan === "ilimitado";

  const getPlanConfig = () => {
    switch (currentPlan) {
      case "starter":
      case "starter_annual":
        return { label: "Starter", color: "#06B6D4", bg: "rgba(6, 182, 212, 0.12)", border: "rgba(6, 182, 212, 0.3)", quota: 720, badge: "Assinante Starter" };
      case "pro":
      case "pro_annual":
        return { label: "Pro Jurídico", color: "#A78BFA", bg: "rgba(124, 58, 237, 0.15)", border: "rgba(124, 58, 237, 0.35)", quota: 3600, badge: "Recomendado para Advocacia" };
      case "business":
      case "business_annual":
        return { label: "Business", color: "#EC4899", bg: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.35)", quota: 12000, badge: "Assinante VIP" };
      case "ilimitado":
        return { label: "Ilimitado", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.35)", quota: 99999, badge: "Plano Ilimitado" };
      default:
        return { label: "Gratuito (25 min)", color: "#10B981", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)", quota: 25, badge: "Renovação Semanal" };
    }
  };

  const activePlanCfg = getPlanConfig();
  const quotaTotal = activePlanCfg.quota;
  const progressPercent = isUnlimited ? 100 : Math.min(100, Math.round((credits / quotaTotal) * 100));

  const totalTranscriptions = history.length;
  const totalWords = history.reduce((acc, item) => acc + (item.word_count || (item.text_content?.split(/\s+/).length || 0)), 0);
  const totalHoursSaved = ((history.reduce((acc, item) => acc + (item.duration_seconds || 180), 0) / 3600) * 4).toFixed(1);

  const userName = profile?.name || user?.user_metadata?.full_name || (user?.email ? user.email.split("@")[0] : "Usuário");
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "PT";

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pegueiotexto.com.br";
  const referralCode = user?.id ? user.id.slice(0, 8) : "";
  const referralUrl = `${origin}/login?ref=${referralCode}`;
  const affiliateUrl = affiliateData?.affiliate_code ? `${origin}/?ref=${affiliateData.affiliate_code}` : "";

  // Export Handlers
  const handleExportTxt = (item: any) => {
    exportToTxt(item.text_content, item.title);
  };

  const handleExportDocx = async (item: any) => {
    await exportToDocx(item.text_content, item.title, {
      duration: item.duration_seconds,
      platform: item.platform,
    });
  };

  const handleExportPdf = (item: any) => {
    exportToPdf(item.text_content, item.title, {
      duration: item.duration_seconds,
      platform: item.platform,
    });
  };

  // Subtitles Handlers
  const currentSrtDoc = history.find((h) => h.id === selectedSrtDocId) || history[0];
  const currentSrtContent = currentSrtDoc?.srt_content || (currentSrtDoc ? generateSrtFromText(currentSrtDoc.text_content, currentSrtDoc.duration_seconds) : "");
  const currentVttContent = currentSrtDoc?.vtt_content || generateVttFromSrt(currentSrtContent);

  const handleDownloadSrt = () => {
    if (!currentSrtContent) return;
    exportToSrt(currentSrtContent, currentSrtDoc?.title || "legendas");
  };

  const handleDownloadVtt = () => {
    if (!currentVttContent) return;
    exportToVtt(currentVttContent, currentSrtDoc?.title || "legendas");
  };

  const handleCopySrt = () => {
    if (!currentSrtContent) return;
    navigator.clipboard.writeText(currentSrtContent);
    setSrtCopied(true);
    setTimeout(() => setSrtCopied(false), 2000);
  };

  // Global Translation Handler
  const handleTranslateNow = async () => {
    const textToTranslate = customTranslationText.trim();
    if (!textToTranslate) {
      alert("Por favor, selecione um documento ou digite o texto a ser traduzido.");
      return;
    }

    setIsTranslating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders: Record<string, string> = session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {};

      const res = await fetch("/api/transcribe/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({
          text: textToTranslate,
          target_language: targetTranslationLang,
          item_id: selectedTranslationDocId !== "manual" ? selectedTranslationDocId : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.translated_text) {
        setTranslatedResultText(data.translated_text);
        if (selectedTranslationDocId && selectedTranslationDocId !== "manual") {
          const langObj = TRANSLATION_LANGUAGES.find((l) => l.code === targetTranslationLang);
          const updated = {
            ...translationsByItem,
            [selectedTranslationDocId]: {
              text: data.translated_text,
              langCode: targetTranslationLang,
              langName: langObj?.name || targetTranslationLang,
            },
          };
          setTranslationsByItem(updated);
          try {
            localStorage.setItem("peguei_translations_cache", JSON.stringify(updated));
          } catch {}
        }
      } else {
        alert(data?.detail || "Erro ao traduzir texto.");
      }
    } catch (err) {
      console.error("Erro na tradução:", err);
      alert("Falha de conexão ao comunicar com o serviço de tradução com IA.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExportTranslatedDocx = async () => {
    if (!translatedResultText) return;
    setExportingTranslationDocx(true);
    try {
      const langObj = TRANSLATION_LANGUAGES.find((l) => l.code === targetTranslationLang);
      const docTitle = selectedTranslationDocId !== "manual" ? currentSrtDoc?.title || "Transcricao" : "Texto Traduzido";
      await exportToDocx(translatedResultText, `${docTitle} [${langObj?.name || targetTranslationLang}]`);
    } catch (err) {
      console.error("Erro ao exportar Word:", err);
      alert("Erro ao gerar arquivo .docx");
    } finally {
      setExportingTranslationDocx(false);
    }
  };

  // Referral Handlers
  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setReferralCodeCopied(true);
    setTimeout(() => setReferralCodeCopied(false), 2500);
  };

  const handleShareReferralWhatsApp = () => {
    const msg = encodeURIComponent(
      `Conheça o Peguei o Texto! A ferramenta mais rápida para transcrever vídeos e áudios com Inteligência Artificial em segundos. Cadastre-se pelo meu link e ganhe 25 minutos para testar agora: ${referralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  // Affiliate Handlers
  const handleCopyAffiliate = () => {
    if (!affiliateUrl) return;
    navigator.clipboard.writeText(affiliateUrl);
    setAffiliateCopied(true);
    setTimeout(() => setAffiliateCopied(false), 2500);
  };

  const handleShareAffiliateWhatsApp = () => {
    if (!affiliateUrl) return;
    const msg = encodeURIComponent(
      `Conheça o Peguei o Texto! A melhor IA para degravação jurídica e transcrição de áudios e vídeos com 99,4% de precisão: ${affiliateUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleJoinAffiliate = async () => {
    if (!user) return;
    setAffiliateJoinLoading(true);
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          user_id: user.id,
          name: userName,
          email: user.email,
          pix_key: affiliatePixKey || "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Parabéns! Sua conta de afiliado foi ativada com sucesso.");
        await loadAffiliateData(user);
      } else {
        alert(data?.detail || "Erro ao registrar conta de afiliado.");
      }
    } catch (err) {
      console.error("Erro ao ativar afiliado:", err);
      alert("Falha de conexão ao registrar afiliado.");
    } finally {
      setAffiliateJoinLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliatePixKey.trim()) {
      setAffiliatePayoutMsg({ type: "error", text: "Informe sua chave PIX para transferência." });
      return;
    }
    const val = parseFloat(affiliatePayoutAmount.replace(",", "."));
    if (isNaN(val) || val < 50) {
      setAffiliatePayoutMsg({ type: "error", text: "O valor mínimo para solicitação de saque é de R$ 50,00." });
      return;
    }

    setAffiliatePayoutLoading(true);
    setAffiliatePayoutMsg(null);
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "payout",
          affiliate_code: affiliateData?.affiliate_code,
          pix_key: affiliatePixKey.trim(),
          amount: val,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAffiliatePayoutMsg({ type: "success", text: "Solicitação de saque enviada com sucesso! Pagamento via PIX até o dia 10." });
        setAffiliatePayoutAmount("");
        await loadAffiliateData(user);
      } else {
        setAffiliatePayoutMsg({ type: "error", text: data?.detail || "Erro ao solicitar saque." });
      }
    } catch (err) {
      setAffiliatePayoutMsg({ type: "error", text: "Falha de conexão ao solicitar saque." });
    } finally {
      setAffiliatePayoutLoading(false);
    }
  };

  // Plan Checkout Handler
  const handleBuyPlan = async (planId: string) => {
    setLoadingCheckoutPlan(planId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/login?redirect=/dashboard&plan=${planId}`;
        return;
      }
      const refCode = typeof window !== "undefined" ? localStorage.getItem("pegueiotexto_ref") : null;
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: planId,
          user_id: user.id,
          email: user.email,
          affiliate_code: refCode,
          success_url: `${window.location.origin}/dashboard?payment=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/dashboard?tab=faturamento&payment=cancelled`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data?.detail || "Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Falha de conexão com o processador de pagamento.");
    } finally {
      setLoadingCheckoutPlan(null);
    }
  };

  // Settings & Profile Handlers
  const handleSaveProfileName = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigNameError(null);
    setConfigNameSuccess(null);
    const cleanName = configName.trim();
    if (!cleanName) {
      setConfigNameError("Digite seu nome completo.");
      return;
    }

    setConfigSavingName(true);
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        name: cleanName,
        updated_at: new Date().toISOString(),
      });
      await supabase.auth.updateUser({
        data: { full_name: cleanName },
      });
      setProfile((prev: any) => ({ ...prev, name: cleanName }));
      setConfigNameSuccess("Nome atualizado com sucesso!");
      setTimeout(() => setConfigNameSuccess(null), 3000);
    } catch (err: any) {
      setConfigNameError(err.message || "Erro ao salvar nome.");
    } finally {
      setConfigSavingName(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigPasswordError(null);
    setConfigPasswordSuccess(null);

    if (configNewPassword.length < 6) {
      setConfigPasswordError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (configNewPassword !== configConfirmPassword) {
      setConfigPasswordError("As senhas não coincidem.");
      return;
    }

    setConfigSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: configNewPassword });
      if (error) throw error;
      setConfigPasswordSuccess("Senha atualizada com sucesso!");
      setConfigNewPassword("");
      setConfigConfirmPassword("");
      setTimeout(() => setConfigPasswordSuccess(null), 3500);
    } catch (err: any) {
      setConfigPasswordError(err.message || "Erro ao alterar a senha.");
    } finally {
      setConfigSavingPassword(false);
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
      
      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
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
                {isEn ? "Specialized Tools" : "Ferramentas Especializadas"}
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
                <button
                  onClick={() => {
                    setActiveNavTab("legendas");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "legendas" ? "1px solid rgba(236, 72, 153, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "legendas" ? "rgba(236, 72, 153, 0.14)" : "transparent",
                    color: activeNavTab === "legendas" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "legendas" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FileText size={16} color="#EC4899" />
                    <span>{isEn ? "Subtitles (.SRT & .VTT)" : "Legendas (.SRT & .VTT)"}</span>
                  </div>
                  {activeNavTab === "legendas" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EC4899" }} />
                  )}
                </button>

                {/* Tradução com IA */}
                <button
                  onClick={() => {
                    setActiveNavTab("traducao");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "traducao" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "traducao" ? "rgba(16, 185, 129, 0.14)" : "transparent",
                    color: activeNavTab === "traducao" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "traducao" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Globe size={16} color="#10B981" />
                    <span>{isEn ? "AI Global Translation" : "Tradução Global IA"}</span>
                  </div>
                  {activeNavTab === "traducao" ? (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                  ) : (
                    <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontWeight: 700 }}>
                      PRO
                    </span>
                  )}
                </button>

                {/* Baixar Vídeo & MP3 */}
                <button
                  onClick={() => {
                    setActiveNavTab("downloader");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "downloader" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "downloader" ? "rgba(59, 130, 246, 0.14)" : "transparent",
                    color: activeNavTab === "downloader" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "downloader" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Download size={16} color="#3B82F6" />
                    <span>{isEn ? "Download Video & MP3" : "Baixar Vídeo & MP3"}</span>
                  </div>
                  {activeNavTab === "downloader" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6" }} />
                  )}
                </button>

              </nav>
            </div>

            {/* GROUP 3: CRESCIMENTO & AFILIADOS */}
            <div>
              <div style={{ padding: "0 10px 6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(167, 139, 250, 0.5)" }}>
                {isEn ? "Growth" : "Crescimento"}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                
                {/* Indique e Ganhe */}
                <button
                  onClick={() => {
                    setActiveNavTab("indicacoes");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "indicacoes" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "indicacoes" ? "rgba(16, 185, 129, 0.14)" : "transparent",
                    color: activeNavTab === "indicacoes" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "indicacoes" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Gift size={16} color="#10B981" />
                    <span>{isEn ? "Refer & Earn" : "Indique e Ganhe"}</span>
                  </div>
                  <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#6EE7B7", fontWeight: 700 }}>
                    +10 min
                  </span>
                </button>

                {/* Painel de Afiliados */}
                <button
                  onClick={() => {
                    setActiveNavTab("afiliados");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "afiliados" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "afiliados" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "afiliados" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "afiliados" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
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
                
                {/* Faturamento & Planos */}
                <button
                  onClick={() => {
                    setActiveNavTab("faturamento");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "faturamento" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "faturamento" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "faturamento" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "faturamento" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CreditCard size={16} color={activeNavTab === "faturamento" ? "#A78BFA" : "#9E96B3"} />
                    <span>{isEn ? "Billing & Plans" : "Faturamento & Planos"}</span>
                  </div>
                  {activeNavTab === "faturamento" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA" }} />
                  )}
                </button>

                {/* Configurações */}
                <button
                  onClick={() => {
                    setActiveNavTab("configuracoes");
                    setIsMobileNavOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: activeNavTab === "configuracoes" ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                    background: activeNavTab === "configuracoes" ? "rgba(124, 58, 237, 0.16)" : "transparent",
                    color: activeNavTab === "configuracoes" ? "#FFFFFF" : "#9E96B3",
                    fontWeight: activeNavTab === "configuracoes" ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Settings size={16} color={activeNavTab === "configuracoes" ? "#A78BFA" : "#9E96B3"} />
                    <span>{isEn ? "Settings" : "Configurações"}</span>
                  </div>
                  {activeNavTab === "configuracoes" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA" }} />
                  )}
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
                  setActiveNavTab("faturamento");
                  setIsMobileNavOpen(false);
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
                {isEn ? "Upgrade →" : "Recarregar →"}
              </button>
            </div>
          </div>

          {/* User Profile Bar */}
          <div
            onClick={() => {
              setActiveNavTab("configuracoes");
              setIsMobileNavOpen(false);
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
          {/* Left Title & Mobile Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
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
                  {activeNavTab === "legendas" && (isEn ? "Subtitles (.SRT & .VTT)" : "Gerador de Legendas (.SRT & .VTT)")}
                  {activeNavTab === "traducao" && (isEn ? "AI Global Translation" : "Tradução Global com IA")}
                  {activeNavTab === "downloader" && (isEn ? "Download Video & MP3" : "Baixar Vídeo & MP3")}
                  {activeNavTab === "indicacoes" && (isEn ? "Refer & Earn Free Minutes" : "Indique e Ganhe Minutos Grátis")}
                  {activeNavTab === "afiliados" && (isEn ? "Affiliate Partner Dashboard" : "Painel Oficial de Afiliados")}
                  {activeNavTab === "faturamento" && (isEn ? "Billing & Subscription Plans" : "Faturamento & Planos")}
                  {activeNavTab === "configuracoes" && (isEn ? "Account Settings" : "Configurações da Conta")}
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
                setActiveNavTab("faturamento");
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
              
              {/* TOP METRICS SUMMARY CARDS */}
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
                    background: "rgba(124, 58, 237, 0.15)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#A78BFA",
                    flexShrink: 0
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      {totalWords.toLocaleString("pt-BR")}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "4px" }}>
                      {isEn ? "Words Transcribed" : "Palavras Transcritas"}
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
                    background: "rgba(6, 182, 212, 0.15)",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#06B6D4",
                    flexShrink: 0
                  }}>
                    <Mic size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      {totalTranscriptions}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "4px" }}>
                      {isEn ? "Transcriptions Done" : "Degravações Realizadas"}
                    </div>
                  </div>
                </div>

                {/* Metric 3: Economia de Tempo */}
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
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10B981",
                    flexShrink: 0
                  }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1 }}>
                      ~{totalHoursSaved}h
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", marginTop: "4px" }}>
                      {isEn ? "Time Saved" : "Economia de Tempo Estimada"}
                    </div>
                  </div>
                </div>

              </div>

              {/* PROMO BANNER */}
              <DashboardPromoBanner
                user={user}
                profile={profile}
                currentPlan={currentPlan}
              />

              {/* TRANSCRIBE FORM CONTAINER */}
              <div style={{
                borderRadius: "20px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.14)",
                padding: "24px 24px 28px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                      {isEn ? "Start New Audio or Video Transcription" : "Iniciar Nova Degravação de Áudio ou Vídeo"}
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#A78BFA", fontWeight: 600 }}>
                    PJe Mídias • Zoom • Teams • YouTube • MP3 • MP4 • WAV • M4A
                  </span>
                </div>

                <TranscribeForm />
              </div>

              {/* RECENT TRANSCRIPTIONS SECTION */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                      {isEn ? "Recent Transcriptions" : "Transcrições Recentes"}
                    </h2>
                    <p style={{ fontSize: "12px", color: "#9E96B3", margin: "2px 0 0" }}>
                      {isEn ? "Click any file to read, play synchronized audio, or export." : "Clique em qualquer gravação para ler, ouvir sincronizado ou exportar."}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveNavTab("documentos")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#A78BFA",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <span>{isEn ? "View all documents" : "Ver todos os documentos"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div style={{
                    padding: "48px 24px",
                    textAlign: "center",
                    borderRadius: "16px",
                    background: "#151026",
                    border: "1px dashed rgba(167, 139, 250, 0.2)",
                    color: "#9E96B3"
                  }}>
                    <Mic size={32} style={{ margin: "0 auto 12px", opacity: 0.4, color: "#A78BFA" }} />
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
                      {isEn ? "No transcriptions yet" : "Nenhuma transcrição realizada ainda"}
                    </div>
                    <div style={{ fontSize: "13px", maxWidth: 420, margin: "0 auto", lineHeight: 1.5 }}>
                      {isEn ? "Paste a link above or upload an audio file to generate your first high-accuracy transcript with timestamps." : "Cole um link acima ou envie um áudio/vídeo para gerar sua primeira transcrição de alta precisão."}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {history.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: "14px",
                          background: activeItem?.id === item.id ? "rgba(124, 58, 237, 0.12)" : "#151026",
                          border: activeItem?.id === item.id ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid rgba(167, 139, 250, 0.08)",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "14px",
                          transition: "all 0.15s ease",
                          cursor: "pointer"
                        }}
                        onClick={() => setActiveItem(item)}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 260, flex: 1 }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: "10px",
                            background: "rgba(124, 58, 237, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#C4B5FD",
                            flexShrink: 0
                          }}>
                            <FileText size={18} />
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.title || "Transcrição de Áudio"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                              <span>{item.platform ? item.platform.toUpperCase() : "ÁUDIO"}</span>
                              <span>•</span>
                              <span>{item.duration_seconds ? `${Math.ceil(item.duration_seconds / 60)} min` : "1 min"}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveItem(item)}
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              padding: "6px 14px",
                              borderRadius: "8px",
                              background: "rgba(124, 58, 237, 0.15)",
                              border: "1px solid rgba(124, 58, 237, 0.35)",
                              color: "#C4B5FD",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <Play size={12} fill="#C4B5FD" />
                            <span>{isEn ? "Listen & Read" : "Ouvir & Ler"}</span>
                          </button>

                          <button
                            onClick={() => handleExportDocx(item)}
                            title="Exportar Word"
                            style={{ fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", cursor: "pointer" }}
                          >
                            .DOCX
                          </button>

                          <button
                            onClick={() => handleExportPdf(item)}
                            title="Exportar PDF"
                            style={{ fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", cursor: "pointer" }}
                          >
                            .PDF
                          </button>

                          <button
                            onClick={() => handleExportTxt(item)}
                            title="Exportar TXT"
                            style={{ fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2D9F3", cursor: "pointer" }}
                          >
                            .TXT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIVE TRANSCRIPTION READER & PLAYER */}
              {activeItem && (
                <div style={{
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid rgba(167, 139, 250, 0.1)", paddingBottom: "16px" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>
                        {activeItem.title || "Transcrição Selecionada"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#A78BFA", marginTop: "3px" }}>
                        Visualizador Sincronizado com Identificação de Oradores & Timestamps
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setSelectedChatDocId(activeItem.id);
                          setActiveNavTab("chat");
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "rgba(124, 58, 237, 0.2)",
                          border: "1px solid rgba(124, 58, 237, 0.4)",
                          color: "#C4B5FD",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>Perguntar para IA</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSrtDocId(activeItem.id);
                          setActiveNavTab("legendas");
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "rgba(236, 72, 153, 0.15)",
                          border: "1px solid rgba(236, 72, 153, 0.35)",
                          color: "#F472B6",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <FileText size={13} />
                        <span>Ver Legenda (.SRT)</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTranslationDocId(activeItem.id);
                          setActiveNavTab("traducao");
                        }}
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "7px 14px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          color: "#6EE7B7",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Globe size={13} />
                        <span>Traduzir com IA</span>
                      </button>
                    </div>
                  </div>

                  {/* Audio Player if URL available */}
                  {activeItem.audio_url && (
                    <AudioSyncPlayer initialAudioUrl={activeItem.audio_url} title={activeItem.title} />
                  )}

                  {/* Interactive Transcript Component */}
                  <div style={{
                    maxHeight: 480,
                    overflowY: "auto",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "#151026",
                    border: "1px solid rgba(167, 139, 250, 0.08)",
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#F1F5F9",
                    whiteSpace: "pre-wrap"
                  }}>
                    <InteractiveTranscript
                      text={activeItem.text_content}
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 2: CHAT COM IA                                 */}
          {/* =================================================== */}
          {activeNavTab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "calc(100vh - 120px)" }}>
              
              {/* Header Selector */}
              <div style={{
                padding: "16px 20px",
                borderRadius: "16px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(124, 58, 237, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                      Assistente Especialista em Degravações
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3" }}>
                      Faça perguntas, extraia resumos, questione contradições de testemunhas e analise fatos.
                    </div>
                  </div>
                </div>

                {/* Document Selector */}
                {history.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#9E96B3" }}>Documento Ativo:</span>
                    <select
                      value={selectedChatDocId}
                      onChange={(e) => {
                        setSelectedChatDocId(e.target.value);
                        setChatMessages([]);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.3)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        outline: "none",
                        cursor: "pointer",
                        maxWidth: 240
                      }}
                    >
                      {history.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title || "Gravação"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Chat Message Workspace */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                borderRadius: "16px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.12)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                {chatMessages.length === 0 ? (
                  <div style={{ margin: "auto", textAlign: "center", maxWidth: 440, padding: "20px" }}>
                    <Sparkles size={36} color="#A78BFA" style={{ margin: "0 auto 12px" }} />
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px" }}>
                      Como posso ajudar com a sua degravação?
                    </div>
                    <p style={{ fontSize: "13px", color: "#9E96B3", lineHeight: 1.5, marginBottom: "18px" }}>
                      Selecione um dos prompts rápidos abaixo ou digite sua pergunta sobre o depoimento ou conteúdo:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        "Quais foram as principais contradições apontadas no depoimento?",
                        "Crie uma ata executiva com os pontos acordados em tópicos claros.",
                        "Identifique todos os nomes e datas citados nesta gravação."
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setChatQuery(prompt);
                          }}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "rgba(124, 58, 237, 0.1)",
                            border: "1px solid rgba(124, 58, 237, 0.25)",
                            color: "#E2D9F3",
                            fontSize: "12px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        maxWidth: "80%",
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
                      }}
                    >
                      {msg.role === "assistant" && (
                        <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(124, 58, 237, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C4B5FD", flexShrink: 0 }}>
                          <Bot size={15} />
                        </div>
                      )}
                      <div style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        background: msg.role === "user" ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "#151026",
                        border: msg.role === "user" ? "none" : "1px solid rgba(167, 139, 250, 0.15)",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap"
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}

                {isChatLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#A78BFA", fontSize: "13px", padding: "8px 0" }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analisando o documento com Inteligência Artificial...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "14px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.2)"
              }}>
                <input
                  type="text"
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChatMessage();
                  }}
                  placeholder="Pergunte qualquer dúvida sobre o documento..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatQuery.trim() || isChatLoading}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: chatQuery.trim() && !isChatLoading ? "pointer" : "default",
                    opacity: chatQuery.trim() && !isChatLoading ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>Enviar</span>
                  <Send size={13} />
                </button>
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 3: MEUS DOCUMENTOS                             */}
          {/* =================================================== */}
          {activeNavTab === "documentos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Filter and Search Bar */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px",
                padding: "16px 20px",
                borderRadius: "16px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.12)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 260 }}>
                  <Search size={16} color="#9E96B3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar por título, texto ou data..."
                    style={{
                      background: "none",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      outline: "none",
                      width: "100%"
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {["todas", "pje", "youtube", "tiktok", "instagram"].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPlatformFilter(plat)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        border: platformFilter === plat ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid transparent",
                        background: platformFilter === plat ? "rgba(124, 58, 237, 0.2)" : "rgba(255, 255, 255, 0.04)",
                        color: platformFilter === plat ? "#C4B5FD" : "#9E96B3",
                        cursor: "pointer"
                      }}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Documents Grid / List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {history
                  .filter((item) => {
                    const matchesSearch =
                      !searchQuery ||
                      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (item.text_content && item.text_content.toLowerCase().includes(searchQuery.toLowerCase()));
                    const matchesPlatform = platformFilter === "todas" || (item.platform && item.platform.toLowerCase() === platformFilter);
                    return matchesSearch && matchesPlatform;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "14px"
                      }}
                    >
                      <div style={{ minWidth: 260, flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>
                          {item.title || "Transcrição de Áudio"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                          <span>{item.platform ? item.platform.toUpperCase() : "ÁUDIO"}</span>
                          <span>•</span>
                          <span>{item.duration_seconds ? `${Math.ceil(item.duration_seconds / 60)} min` : "1 min"}</span>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => {
                            setActiveItem(item);
                            setActiveNavTab("transcrever");
                          }}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            background: "rgba(124, 58, 237, 0.15)",
                            border: "1px solid rgba(124, 58, 237, 0.35)",
                            color: "#C4B5FD",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
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

          {/* =================================================== */}
          {/* TAB 4: LEGENDAS (.SRT & .VTT)                       */}
          {/* =================================================== */}
          {activeNavTab === "legendas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(236, 72, 153, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(236, 72, 153, 0.15)", color: "#F472B6", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Scissors size={12} />
                    <span>Legendas Profissionais com Timestamps Sincronizados</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    Gerador & Exportador de Legendas (.SRT e .VTT)
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Gere marcações temporais milissegundo a milissegundo prontas para importar com 1 clique no CapCut, Adobe Premiere Pro, DaVinci Resolve ou YouTube Studio.
                  </p>
                </div>

                {/* Subtitle Mode Switcher */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#151026", padding: "4px", borderRadius: "10px", border: "1px solid rgba(167, 139, 250, 0.15)" }}>
                  <button
                    onClick={() => setLegendasMode("existing")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      background: legendasMode === "existing" ? "rgba(236, 72, 153, 0.25)" : "transparent",
                      color: legendasMode === "existing" ? "#FFFFFF" : "#9E96B3",
                      cursor: "pointer"
                    }}
                  >
                    Usar Transcrição Existente
                  </button>
                  <button
                    onClick={() => setLegendasMode("new")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      background: legendasMode === "new" ? "rgba(236, 72, 153, 0.25)" : "transparent",
                      color: legendasMode === "new" ? "#FFFFFF" : "#9E96B3",
                      cursor: "pointer"
                    }}
                  >
                    Gerar de Novo Arquivo/Vídeo
                  </button>
                </div>
              </div>

              {legendasMode === "existing" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {history.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", borderRadius: "16px", background: "#151026", border: "1px dashed rgba(167, 139, 250, 0.2)" }}>
                      <FileText size={32} color="#EC4899" style={{ margin: "0 auto 12px" }} />
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                        Nenhuma transcrição disponível para exportar legendas
                      </div>
                      <div style={{ fontSize: "13px", color: "#9E96B3", marginBottom: "16px" }}>
                        Alterne para "Gerar de Novo Arquivo/Vídeo" acima para enviar seu primeiro arquivo.
                      </div>
                      <button
                        onClick={() => setLegendasMode("new")}
                        style={{ padding: "8px 18px", borderRadius: "10px", background: "#EC4899", border: "none", color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Enviar Vídeo ou Link
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Select Doc and Actions */}
                      <div style={{
                        padding: "18px 22px",
                        borderRadius: "16px",
                        background: "#0F0A1C",
                        border: "1px solid rgba(167, 139, 250, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "14px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 260 }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Selecionar Gravação:</span>
                          <select
                            value={selectedSrtDocId}
                            onChange={(e) => setSelectedSrtDocId(e.target.value)}
                            style={{
                              padding: "8px 14px",
                              borderRadius: "10px",
                              background: "#151026",
                              border: "1px solid rgba(167, 139, 250, 0.3)",
                              color: "#FFFFFF",
                              fontSize: "13px",
                              outline: "none",
                              cursor: "pointer",
                              maxWidth: 320
                            }}
                          >
                            {history.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.title || "Gravação"} ({new Date(h.created_at).toLocaleDateString("pt-BR")})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Download Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            onClick={handleDownloadSrt}
                            style={{
                              padding: "9px 18px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)",
                              border: "none",
                              color: "#FFFFFF",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)"
                            }}
                          >
                            <Download size={14} />
                            <span>Baixar Legenda .SRT</span>
                          </button>

                          <button
                            onClick={handleDownloadVtt}
                            style={{
                              padding: "9px 16px",
                              borderRadius: "10px",
                              background: "rgba(236, 72, 153, 0.15)",
                              border: "1px solid rgba(236, 72, 153, 0.4)",
                              color: "#F472B6",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <Download size={14} />
                            <span>Baixar .VTT</span>
                          </button>

                          <button
                            onClick={handleCopySrt}
                            style={{
                              padding: "9px 14px",
                              borderRadius: "10px",
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              color: "#E2D9F3",
                              fontSize: "13px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            {srtCopied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                            <span>{srtCopied ? "Copiado!" : "Copiar"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtitle Preview Box */}
                      <div style={{
                        borderRadius: "16px",
                        background: "#080511",
                        border: "1px solid rgba(167, 139, 250, 0.15)",
                        padding: "20px",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "#A78BFA",
                        maxHeight: 460,
                        overflowY: "auto",
                        whiteSpace: "pre-wrap"
                      }}>
                        {currentSrtContent || "Gerando marcações de tempo..."}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* New Video/Audio to Subtitle */
                <div style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(236, 72, 153, 0.3)"
                }}>
                  <TranscribeForm
                    initialPlaceholder="Cole o link do YouTube, TikTok, Instagram ou envie arquivo para extrair legendas .SRT e .VTT..."
                  />
                </div>
              )}

              {/* Supported Editors Guide */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                {[
                  { name: "CapCut (PC & Mobile)", desc: "Arraste o .SRT para a linha do tempo e aplique legendas animadas instantaneamente." },
                  { name: "Adobe Premiere Pro", desc: "Suporte nativo para faixas de Closed Captions e edição de fontes e cores." },
                  { name: "DaVinci Resolve", desc: "Sincronização imediata na trilha de legendas com precisão de milissegundos." },
                  { name: "YouTube Studio", desc: "Suba o .SRT diretamente no painel do vídeo para ativar legendas CC oficiais." }
                ].map((soft, i) => (
                  <div key={i} style={{ padding: "16px", borderRadius: "12px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.08)" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>{soft.name}</div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", lineHeight: 1.4 }}>{soft.desc}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 5: TRADUÇÃO GLOBAL COM IA                       */}
          {/* =================================================== */}
          {activeNavTab === "traducao" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.15)", color: "#6EE7B7", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Globe size={12} />
                    <span>Tradução Global com Preservação de Contexto Forense</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    Tradução Global com Inteligência Artificial
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Traduza transcrições inteiras ou textos para mais de 10 idiomas com máxima fidelidade terminológica e exporte em Word (.DOCX) ou texto.
                  </p>
                </div>

                {!isPaidUser && (
                  <div style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
                    background: "rgba(124, 58, 237, 0.15)",
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <Crown size={16} color="#FBBF24" />
                    <span style={{ fontSize: "12px", color: "#E2D9F3" }}>
                      Recurso completo dos planos <strong>Pro & Business</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Translation Controls Bar */}
              <div style={{
                padding: "18px 22px",
                borderRadius: "16px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  
                  {/* Select Doc */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3" }}>Origem:</span>
                    <select
                      value={selectedTranslationDocId}
                      onChange={(e) => setSelectedTranslationDocId(e.target.value)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "8px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.25)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        outline: "none",
                        cursor: "pointer",
                        maxWidth: 240
                      }}
                    >
                      <option value="manual">Digitar / Colar Texto Manualmente</option>
                      {history.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title || "Gravação"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Language */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3" }}>Traduzir Para:</span>
                    <select
                      value={targetTranslationLang}
                      onChange={(e) => setTargetTranslationLang(e.target.value)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "8px",
                        background: "#151026",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      {TRANSLATION_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Translate Button */}
                <button
                  onClick={handleTranslateNow}
                  disabled={isTranslating}
                  style={{
                    padding: "9px 22px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: isTranslating ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                    opacity: isTranslating ? 0.7 : 1
                  }}
                >
                  {isTranslating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  <span>{isTranslating ? "Traduzindo..." : "Traduzir com IA"}</span>
                </button>
              </div>

              {/* Split Translation Workspace */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                
                {/* Left Panel: Original Text */}
                <div style={{
                  borderRadius: "16px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#A78BFA" }}>
                      Texto Original
                    </span>
                    <span style={{ fontSize: "11px", color: "#6B6382" }}>
                      {customTranslationText.length} caracteres
                    </span>
                  </div>

                  <textarea
                    value={customTranslationText}
                    onChange={(e) => setCustomTranslationText(e.target.value)}
                    placeholder="Selecione um documento acima ou cole o texto que deseja traduzir aqui..."
                    style={{
                      width: "100%",
                      height: 420,
                      background: "#151026",
                      border: "1px solid rgba(167, 139, 250, 0.08)",
                      borderRadius: "12px",
                      padding: "14px",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      resize: "none",
                      outline: "none"
                    }}
                  />
                </div>

                {/* Right Panel: Translated Result */}
                <div style={{
                  borderRadius: "16px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#34D399" }}>
                      Resultado Traduzido com IA
                    </span>

                    {translatedResultText && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translatedResultText);
                            setTranslationCopied(true);
                            setTimeout(() => setTranslationCopied(false), 2000);
                          }}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.06)",
                            border: "none",
                            color: "#E2D9F3",
                            fontSize: "11px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {translationCopied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          <span>{translationCopied ? "Copiado!" : "Copiar"}</span>
                        </button>

                        <button
                          onClick={handleExportTranslatedDocx}
                          disabled={exportingTranslationDocx}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: "rgba(59, 130, 246, 0.15)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#93C5FD",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          {exportingTranslationDocx ? "Exportando..." : ".DOCX"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{
                    width: "100%",
                    height: 420,
                    background: "#151026",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                    borderRadius: "12px",
                    padding: "14px",
                    color: translatedResultText ? "#FFFFFF" : "#6B6382",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap"
                  }}>
                    {isTranslating ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", color: "#34D399" }}>
                        <Loader2 size={24} className="animate-spin" />
                        <span>Traduzindo com precisão terminológica...</span>
                      </div>
                    ) : (
                      translatedResultText || "O texto traduzido pela Inteligência Artificial aparecerá aqui após clicar em 'Traduzir com IA'."
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 6: BAIXAR VÍDEO & MP3                           */}
          {/* =================================================== */}
          {activeNavTab === "downloader" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(59, 130, 246, 0.15)", color: "#93C5FD", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Download size={12} />
                    <span>Download em Alta Definição & Extração de Áudio</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    Baixar Vídeo & Extrair Áudio MP3
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Baixe vídeos em alta resolução (MP4) ou extraia o áudio cristalino (MP3) de YouTube, TikTok, Instagram Reels, Facebook, Vimeo e mais de 1.700 sites.
                  </p>
                </div>
              </div>

              {/* Embedded Video Downloader Component */}
              <div style={{
                borderRadius: "20px",
                background: "#0F0A1C",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                padding: "24px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)"
              }}>
                <VideoDownloader
                  placeholder={isEn ? "Paste YouTube, TikTok, Instagram Reels, MP4 or MP3 URL..." : "Cole o link do YouTube, TikTok, Reels do Instagram, MP4 ou MP3..."}
                />
              </div>

              {/* Quick Flow Recommendation */}
              <div style={{
                padding: "18px 24px",
                borderRadius: "14px",
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "14px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Sparkles size={20} color="#A78BFA" />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                      Deseja transcrever este áudio após o download?
                    </div>
                    <div style={{ fontSize: "12px", color: "#9E96B3" }}>
                      Basta clicar na aba <strong>Transcrever</strong> para gerar sua ata forense ou texto completo em segundos.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNavTab("transcrever")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Ir para Transcrever →
                </button>
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 7: INDIQUE E GANHE                              */}
          {/* =================================================== */}
          {activeNavTab === "indicacoes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.15)", color: "#6EE7B7", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Gift size={12} />
                    <span>Programa Oficial de Indicação de Amigos</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    Indique Amigos e Ganhe Minutos Gratuitos
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Para cada amigo ou colega que se cadastrar através do seu link, você recebe <strong>+10 minutos</strong> creditados automaticamente no seu saldo, e seu amigo também ganha minutos bônus!
                  </p>
                </div>
              </div>

              {/* Referral Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                  <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>Total de Convites Confirmados</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{referralStats.total_invites} amigos</div>
                </div>

                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                  <div style={{ fontSize: "12px", color: "#6EE7B7", marginBottom: "6px" }}>Minutos Ganhos com Convites</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#34D399" }}>+{referralStats.total_minutes_earned} min</div>
                </div>

                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                  <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>Bônus por Novo Amigo</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#A78BFA" }}>+10 min imediatos</div>
                </div>
              </div>

              {/* Share Box */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                  Seu Link Exclusivo de Indicação:
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <div style={{
                    flex: 1,
                    minWidth: 260,
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "#151026",
                    border: "1px solid rgba(167, 139, 250, 0.2)",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {referralUrl}
                  </div>

                  <button
                    onClick={handleCopyReferral}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
                    }}
                  >
                    {referralCopied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                    <span>{referralCopied ? "Link Copiado!" : "Copiar Link"}</span>
                  </button>

                  <button
                    onClick={handleShareReferralWhatsApp}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      background: "#25D366",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)"
                    }}
                  >
                    <Share2 size={15} />
                    <span>Compartilhar no WhatsApp</span>
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9E96B3" }}>
                  <span>Seu Código de Indicação:</span>
                  <span
                    onClick={handleCopyReferralCode}
                    style={{ padding: "3px 8px", borderRadius: "6px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontWeight: 800, cursor: "pointer" }}
                    title="Clique para copiar código"
                  >
                    {referralCode} {referralCodeCopied ? "(Copiado!)" : ""}
                  </span>
                </div>
              </div>

              {/* 3 Step Visual Guide */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {[
                  { step: "1", title: "Envie seu link", desc: "Compartilhe seu link exclusivo com amigos, advogados, estudantes ou colegas de trabalho." },
                  { step: "2", title: "Seu amigo se cadastra", desc: "Ele cria a conta gratuita e ganha 25 minutos imediatamente para testar degravações com IA." },
                  { step: "3", title: "Minutos automáticos", desc: "Você recebe +10 minutos instantaneamente no seu saldo para usar em qualquer transcrição." }
                ].map((item) => (
                  <div key={item.step} style={{ padding: "20px", borderRadius: "14px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.08)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", marginBottom: "12px" }}>
                      {item.step}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>{item.title}</div>
                    <div style={{ fontSize: "12px", color: "#9E96B3", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 8: PAINEL DE AFILIADOS                          */}
          {/* =================================================== */}
          {activeNavTab === "afiliados" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(124, 58, 237, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ maxWidth: 640 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(124, 58, 237, 0.2)", color: "#C4B5FD", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Award size={12} />
                    <span>Programa Oficial de Afiliados Peguei o Texto</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    30% de Comissão Recorrente Mensal
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Receba 30% em todos os pagamentos mensais e anuais realizados por clientes que você indicar, enquanto eles continuarem assinando.
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#9E96B3" }}>Pagamentos via PIX</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#34D399" }}>Todo dia 10</div>
                </div>
              </div>

              {affiliateLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", color: "#A78BFA", gap: "10px" }}>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Carregando dados de afiliado...</span>
                </div>
              ) : affiliateData ? (
                <>
                  {/* Affiliate Metrics (4 Cards) */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                      <div style={{ fontSize: "12px", color: "#6EE7B7", marginBottom: "6px" }}>Saldo Disponível para Saque</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#34D399" }}>
                        R$ {affiliateMetrics?.available_balance ? Number(affiliateMetrics.available_balance).toFixed(2).replace(".", ",") : "0,00"}
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>Total de Ganhos Acumulados</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>
                        R$ {affiliateMetrics?.total_earnings ? Number(affiliateMetrics.total_earnings).toFixed(2).replace(".", ",") : "0,00"}
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>Assinaturas & Vendas</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#C4B5FD" }}>
                        {affiliateMetrics?.total_conversions || affiliateConversions.length || 0}
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>Cliques no seu Link</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>
                        {affiliateMetrics?.total_clicks || 0}
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Link Box */}
                  <div style={{
                    padding: "22px",
                    borderRadius: "16px",
                    background: "#0F0A1C",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                  }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                      Seu Link de Afiliado (30% de Comissão Recorrente):
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <div style={{
                        flex: 1,
                        minWidth: 260,
                        padding: "12px 16px",
                        borderRadius: "12px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.2)",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {affiliateUrl}
                      </div>

                      <button
                        onClick={handleCopyAffiliate}
                        style={{
                          padding: "12px 20px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                          border: "none",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {affiliateCopied ? <Check size={15} color="#10B981" /> : <Copy size={15} />}
                        <span>{affiliateCopied ? "Link Copiado!" : "Copiar Link"}</span>
                      </button>

                      <button
                        onClick={handleShareAffiliateWhatsApp}
                        style={{
                          padding: "12px 20px",
                          borderRadius: "12px",
                          background: "#25D366",
                          border: "none",
                          color: "#FFFFFF",
                          fontSize: "13px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Share2 size={15} />
                        <span>Divulgar no WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* PIX Payout Request Form */}
                  <form
                    onSubmit={handleRequestPayout}
                    style={{
                      padding: "22px",
                      borderRadius: "16px",
                      background: "#0F0A1C",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px"
                    }}
                  >
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>
                      Solicitar Saque de Comissões via PIX
                    </div>

                    {affiliatePayoutMsg && (
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: affiliatePayoutMsg.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        border: affiliatePayoutMsg.type === "success" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                        color: affiliatePayoutMsg.type === "success" ? "#6EE7B7" : "#FCA5A5",
                        fontSize: "12px"
                      }}>
                        {affiliatePayoutMsg.text}
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", color: "#9E96B3", display: "block", marginBottom: "6px" }}>Chave PIX (CPF, E-mail, Telefone ou Aleatória):</label>
                        <input
                          type="text"
                          value={affiliatePixKey}
                          onChange={(e) => setAffiliatePixKey(e.target.value)}
                          placeholder="Digite sua chave PIX..."
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "#151026",
                            border: "1px solid rgba(167, 139, 250, 0.2)",
                            color: "#FFF",
                            fontSize: "13px",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", color: "#9E96B3", display: "block", marginBottom: "6px" }}>Valor do Saque (R$ - Mínimo R$ 50,00):</label>
                        <input
                          type="text"
                          value={affiliatePayoutAmount}
                          onChange={(e) => setAffiliatePayoutAmount(e.target.value)}
                          placeholder="50,00"
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "#151026",
                            border: "1px solid rgba(167, 139, 250, 0.2)",
                            color: "#FFF",
                            fontSize: "13px",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={affiliatePayoutLoading}
                      style={{
                        alignSelf: "flex-start",
                        padding: "10px 24px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: affiliatePayoutLoading ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: affiliatePayoutLoading ? 0.7 : 1
                      }}
                    >
                      {affiliatePayoutLoading ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                      <span>{affiliatePayoutLoading ? "Processando..." : "Confirmar Solicitação de Saque"}</span>
                    </button>
                  </form>
                </>
              ) : (
                /* Activate Affiliate Account */
                <div style={{
                  padding: "48px 32px",
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  textAlign: "center",
                  maxWidth: 600,
                  margin: "0 auto"
                }}>
                  <Award size={48} color="#A78BFA" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", marginBottom: "8px" }}>
                    Ative seu Código de Afiliado com 1 Clique
                  </h3>
                  <p style={{ fontSize: "14px", color: "#9E96B3", lineHeight: 1.6, marginBottom: "24px" }}>
                    Fature 30% de comissão recorrente todos os meses por cada pessoa ou escritório que contratar o Peguei o Texto através da sua indicação.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 360, margin: "0 auto 24px" }}>
                    <input
                      type="text"
                      value={affiliatePixKey}
                      onChange={(e) => setAffiliatePixKey(e.target.value)}
                      placeholder="Sua chave PIX para pagamentos (opcional)"
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.25)",
                        color: "#FFF",
                        fontSize: "13px",
                        outline: "none",
                        textAlign: "center"
                      }}
                    />
                    <button
                      onClick={handleJoinAffiliate}
                      disabled={affiliateJoinLoading}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: affiliateJoinLoading ? "default" : "pointer",
                        boxShadow: "0 4px 16px rgba(124, 58, 237, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      {affiliateJoinLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      <span>{affiliateJoinLoading ? "Ativando..." : "Quero Ser um Afiliado Agora"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 9: FATURAMENTO & PLANOS                         */}
          {/* =================================================== */}
          {activeNavTab === "faturamento" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* Current Active Plan Status Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A78BFA" }}>
                      Plano Ativo no Momento
                    </span>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "100px",
                      background: activePlanCfg.bg,
                      color: activePlanCfg.color,
                      border: `1px solid ${activePlanCfg.border}`
                    }}>
                      {activePlanCfg.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>
                    {credits} minutos disponíveis para degravação
                  </div>
                  <div style={{ fontSize: "13px", color: "#9E96B3", marginTop: "4px" }}>
                    {!isPaidUser && typeof profile?.days_until_renewal === "number" ? (
                      <span style={{ color: "#34D399", fontWeight: 600 }}>
                        🔄 Renovação gratuita de 25 min em {profile.days_until_renewal} dias
                      </span>
                    ) : (
                      <span>Acesso contínuo sem limites de velocidade</span>
                    )}
                  </div>
                </div>

                <div style={{ width: 200 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9E96B3", marginBottom: "6px" }}>
                    <span>Consumo</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div style={{ width: "100%", height: 8, borderRadius: 100, background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)" }} />
                  </div>
                </div>
              </div>

              {/* Billing Cycle Selector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px",
                  borderRadius: "100px",
                  background: "#151026",
                  border: "1px solid rgba(167, 139, 250, 0.2)"
                }}>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      background: billingCycle === "annual" ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "transparent",
                      color: billingCycle === "annual" ? "#FFFFFF" : "#9E96B3",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>Anual com Desconto</span>
                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.25)", color: "#6EE7B7" }}>
                      3 meses grátis
                    </span>
                  </button>

                  <button
                    onClick={() => setBillingCycle("monthly")}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "none",
                      background: billingCycle === "monthly" ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "transparent",
                      color: billingCycle === "monthly" ? "#FFFFFF" : "#9E96B3",
                      cursor: "pointer"
                    }}
                  >
                    Mensal / Avulso
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {(billingCycle === "annual" ? ANNUAL_PLANS : MONTHLY_PLANS).map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      borderRadius: "20px",
                      background: plan.popular ? "linear-gradient(180deg, #1B1333 0%, #110B24 100%)" : "#151026",
                      border: plan.popular ? "2px solid #7C3AED" : "1px solid rgba(167, 139, 250, 0.12)",
                      padding: "26px 22px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      boxShadow: plan.popular ? "0 10px 40px rgba(124, 58, 237, 0.25)" : "none"
                    }}
                  >
                    {plan.popular && (
                      <div style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                        padding: "3px 14px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 800,
                        color: "#FFF",
                        letterSpacing: "0.04em",
                        boxShadow: "0 2px 10px rgba(124, 58, 237, 0.4)"
                      }}>
                        RECOMENDADO PARA ADVOCACIA
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "#FFFFFF", marginBottom: "4px" }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "16px", minHeight: 32 }}>
                        {plan.desc}
                      </div>

                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                          <span style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF" }}>{plan.priceMonthly}</span>
                          <span style={{ fontSize: "12px", color: "#9E96B3" }}>/ mês</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 600, marginTop: "2px" }}>
                          {plan.priceTotal}
                        </div>
                        {plan.savings && (
                          <div style={{ fontSize: "11px", color: "#34D399", fontWeight: 700, marginTop: "2px" }}>
                            {plan.savings}
                          </div>
                        )}
                      </div>

                      {/* Minutes Pill */}
                      <div style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        background: "rgba(124, 58, 237, 0.15)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                        color: "#C4B5FD",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "18px"
                      }}>
                        <Zap size={14} color="#F59E0B" />
                        <span>{plan.minutes}</span>
                      </div>

                      {/* Feature List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "24px" }}>
                        {plan.features.map((feat, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#E2D9F3" }}>
                            <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyPlan(plan.id)}
                      disabled={loadingCheckoutPlan === plan.id}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "12px",
                        background: plan.popular ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(255, 255, 255, 0.08)",
                        border: plan.popular ? "none" : "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: loadingCheckoutPlan === plan.id ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: plan.popular ? "0 4px 16px rgba(124, 58, 237, 0.4)" : "none"
                      }}
                    >
                      {loadingCheckoutPlan === plan.id ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                      <span>{loadingCheckoutPlan === plan.id ? "Conectando checkout..." : plan.cta}</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 10: CONFIGURAÇÕES DA CONTA                      */}
          {/* =================================================== */}
          {activeNavTab === "configuracoes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 840 }}>
              
              {/* Header Card */}
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "#0F0A1C",
                border: "1px solid rgba(167, 139, 250, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px" }}>
                    Configurações da Conta
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0 }}>
                    Gerencie seus dados de acesso, senha, preferências de transcrição e faturamento.
                  </p>
                </div>

                {/* Subtabs */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {[
                    { id: "perfil", label: "Meu Perfil" },
                    { id: "senha", label: "Segurança & Senha" },
                    { id: "preferencias", label: "Preferências" }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setConfigSubtab(sub.id as any)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "none",
                        background: configSubtab === sub.id ? "rgba(124, 58, 237, 0.25)" : "transparent",
                        color: configSubtab === sub.id ? "#FFFFFF" : "#9E96B3",
                        cursor: "pointer"
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtab 1: Meu Perfil */}
              {configSubtab === "perfil" && (
                <div style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "20px",
                      color: "#FFFFFF"
                    }}>
                      {userInitials}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>{userName}</div>
                      <div style={{ fontSize: "13px", color: "#9E96B3" }}>{user?.email}</div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfileName} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {configNameSuccess && (
                      <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7", fontSize: "12px" }}>
                        {configNameSuccess}
                      </div>
                    )}
                    {configNameError && (
                      <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", fontSize: "12px" }}>
                        {configNameError}
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                        Nome Completo de Exibição:
                      </label>
                      <input
                        type="text"
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: "#151026",
                          border: "1px solid rgba(167, 139, 250, 0.2)",
                          color: "#FFF",
                          fontSize: "13px",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                        E-mail Cadastrado:
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          background: "#151026",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "#6B6382",
                          fontSize: "13px",
                          cursor: "not-allowed"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                        Identificador Único (ID do Usuário):
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="text"
                          value={user?.id || ""}
                          disabled
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "#151026",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#6B6382",
                            fontSize: "12px",
                            cursor: "not-allowed"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (user?.id) {
                              navigator.clipboard.writeText(user.id);
                              alert("ID copiado com sucesso!");
                            }
                          }}
                          style={{ padding: "10px 16px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#E2D9F3", fontSize: "12px", cursor: "pointer" }}
                        >
                          Copiar ID
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={configSavingName}
                      style={{
                        alignSelf: "flex-start",
                        padding: "10px 24px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: configSavingName ? "default" : "pointer"
                      }}
                    >
                      {configSavingName ? "Salvando..." : "Salvar Alterações de Perfil"}
                    </button>
                  </form>
                </div>
              )}

              {/* Subtab 2: Segurança & Senha */}
              {configSubtab === "senha" && (
                <form
                  onSubmit={handleSavePassword}
                  style={{
                    padding: "24px",
                    borderRadius: "18px",
                    background: "#0F0A1C",
                    border: "1px solid rgba(167, 139, 250, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
                    Alterar Senha de Acesso
                  </div>

                  {configPasswordSuccess && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7", fontSize: "12px" }}>
                      {configPasswordSuccess}
                    </div>
                  )}
                  {configPasswordError && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", fontSize: "12px" }}>
                      {configPasswordError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                      Nova Senha (Mínimo 6 caracteres):
                    </label>
                    <input
                      type={configShowPassword ? "text" : "password"}
                      value={configNewPassword}
                      onChange={(e) => setConfigNewPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.2)",
                        color: "#FFF",
                        fontSize: "13px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                      Confirme a Nova Senha:
                    </label>
                    <input
                      type={configShowPassword ? "text" : "password"}
                      value={configConfirmPassword}
                      onChange={(e) => setConfigConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: "#151026",
                        border: "1px solid rgba(167, 139, 250, 0.2)",
                        color: "#FFF",
                        fontSize: "13px",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      id="showPass"
                      checked={configShowPassword}
                      onChange={(e) => setConfigShowPassword(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <label htmlFor="showPass" style={{ fontSize: "12px", color: "#9E96B3", cursor: "pointer" }}>
                      Mostrar senhas digitadas
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={configSavingPassword}
                    style={{
                      alignSelf: "flex-start",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: configSavingPassword ? "default" : "pointer"
                    }}
                  >
                    {configSavingPassword ? "Atualizando..." : "Atualizar Senha"}
                  </button>
                </form>
              )}

              {/* Subtab 3: Preferências */}
              {configSubtab === "preferencias" && (
                <div style={{
                  padding: "24px",
                  borderRadius: "18px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px"
                }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF" }}>
                    Preferências do Sistema de Degravação
                  </div>

                  {prefSavedMessage && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7", fontSize: "12px" }}>
                      Preferências salvas com sucesso!
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "12px", background: "#151026" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>Diarização Automática de Oradores</div>
                        <div style={{ fontSize: "12px", color: "#9E96B3" }}>Identificar quem está falando (Juiz, Advogado, Testemunha) em cada gravação</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={prefDiarization}
                        onChange={(e) => setPrefDiarization(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "12px", background: "#151026" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>Timestamps Sincronizados</div>
                        <div style={{ fontSize: "12px", color: "#9E96B3" }}>Incluir minutagem precisa a cada início de frase nas transcrições</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={prefTimestamps}
                        onChange={(e) => setPrefTimestamps(e.target.checked)}
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPrefSavedMessage(true);
                      setTimeout(() => setPrefSavedMessage(false), 2500);
                    }}
                    style={{
                      alignSelf: "flex-start",
                      padding: "10px 24px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Salvar Preferências
                  </button>
                </div>
              )}

              {/* Danger Zone: Logout */}
              <div style={{
                padding: "20px 24px",
                borderRadius: "16px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#FCA5A5" }}>Encerrar Sessão</div>
                  <div style={{ fontSize: "12px", color: "#9E96B3" }}>Desconectar sua conta neste dispositivo</div>
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Sair da Conta
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
