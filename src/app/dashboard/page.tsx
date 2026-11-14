"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TranscribeForm from "@/components/TranscribeForm";
import AudioSyncPlayer from "@/components/AudioSyncPlayer";
import InteractiveTranscript from "@/components/InteractiveTranscript";
import VideoDownloader from "@/components/VideoDownloader";
import DashboardPromoBanner from "@/components/DashboardPromoBanner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { 
  Clock, FileText, Zap, CreditCard, LogOut, ArrowRight, Download, 
  Eye, Sparkles, ShieldCheck, Crown, RefreshCw, Copy, Check, 
  FileDown, Loader2, BookOpen, ListChecks, Lightbulb, 
  Search, Share2, ExternalLink, X, Filter, Award, Settings, User, Gift, Menu, 
  Languages, Globe, RotateCcw, Mic, Upload, MessageSquare, ChevronRight,
  Folder, Send, Bot, CheckCircle2, ChevronDown, Scale, DollarSign,
  TrendingUp, Users, Scissors, Lock, EyeOff, Play, AlertCircle, Layout, Bug, HelpCircle
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
  | "documentos" 
  | "legendas" 
  | "traducao" 
  | "downloader" 
  | "indicacoes" 
  | "afiliados" 
  | "faturamento" 
  | "configuracoes"
  | "sugestoes";

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
    desc: "Acesso contínuo com a máxima economia para criadores e uso individual.",
    color: "#06B6D4",
    features: [
      "720 minutos anuais de transcrição com IA",
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
    desc: "O plano mais completo para criadores, pesquisadores, equipes e profissionais.",
    color: "#7C3AED",
    badge: "Mais Popular",
    features: [
      "3.600 minutos anuais com IA de máxima fidelidade",
      "Separação precisa de múltiplos oradores",
      "Exportação direta para Word (.DOCX) e PDF formatado",
      "Resumos executivos e sínteses com IA inclusos",
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
    desc: "Para empresas, produtoras, agências e alto fluxo de transcrição.",
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
      "Resumos executivos e sínteses com IA inclusos",
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
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Central Navigation Tab State
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("transcrever");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);



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

  // Affiliate Registration Form State (for non-affiliates)
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCpfCnpj, setRegCpfCnpj] = useState("");
  const [regPixKeyType, setRegPixKeyType] = useState("cpf");
  const [regPixKey, setRegPixKey] = useState("");
  const [regChannelType, setRegChannelType] = useState("instagram");
  const [regChannelUrl, setRegChannelUrl] = useState("");
  const [regAffiliateCode, setRegAffiliateCode] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Suggestions state
  const [sugCategory, setSugCategory] = useState<string>("features");
  const [sugTitle, setSugTitle] = useState("");
  const [sugDescription, setSugDescription] = useState("");
  const [sugLoading, setSugLoading] = useState(false);
  const [sugSuccess, setSugSuccess] = useState(false);
  const [sugError, setSugError] = useState<string | null>(null);

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
            setRegFullName(profileData.name);
          }
        } else {
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            credits_minutes: 25,
            plan: "gratuito",
          });
          const initialN = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
          setConfigName(initialN);
          setRegFullName(initialN);
        }

        if (user.email) {
          setRegEmail(user.email);
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
          const historyRes = await fetch(`/api/transcribe/history?user_id=${user.id}`, {
            headers: authHeaders,
          });
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            const list = Array.isArray(historyData)
              ? historyData
              : (historyData.history || []);
            if (Array.isArray(list)) {
              setHistory(list);
              if (list.length > 0) {
                setActiveItem(list[0]);
                setSelectedSrtDocId(list[0].id);
                setSelectedTranslationDocId(list[0].id);
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
    if (!activeUser?.id && !activeUser?.email) return;
    try {
      setAffiliateLoading(true);
      const query = activeUser.email
        ? `user_id=${activeUser.id}&email=${encodeURIComponent(activeUser.email)}`
        : `user_id=${activeUser.id}`;
      const res = await fetch(`/api/affiliates?action=me&${query}`);
      const data = await res.json();
      if (data.is_affiliate && data.affiliate) {
        setAffiliateData(data.affiliate);
        setAffiliateMetrics(data.metrics || null);
        setAffiliateConversions(data.conversions || []);
      } else {
        setAffiliateData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar afiliado:", err);
      setAffiliateData(null);
    } finally {
      setAffiliateLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleTranscriptionEvent = (e: any) => {
      const data = e?.detail;
      if (data?.title && (data?.text || data?.id)) {
        const newItem = {
          id: data.id || `local_${Date.now()}`,
          title: data.title,
          platform: data.platform || "Web",
          duration_seconds: data.duration || 180,
          minutes_deducted: data.minutes_deducted || 0,
          created_at: new Date().toISOString(),
          text_content: data.text || "",
          srt_content: data.srt || "",
          vtt_content: data.vtt || "",
        };
        setHistory((prev) => [newItem, ...prev.filter((h) => h.id !== newItem.id)]);
        setActiveItem(newItem);
        setSelectedSrtDocId(newItem.id);
        setSelectedTranslationDocId(newItem.id);
      }
      loadUserData();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("credits_updated", handleTranscriptionEvent);
      window.addEventListener("transcription_created", handleTranscriptionEvent);

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

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("credits_updated", handleTranscriptionEvent);
        window.removeEventListener("transcription_created", handleTranscriptionEvent);
      }
    };
  }, []);

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
        return { label: "Pro", color: "#A78BFA", bg: "rgba(124, 58, 237, 0.15)", border: "rgba(124, 58, 237, 0.35)", quota: 3600, badge: "Assinante Pro" };
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

  const handleCopyDocText = (item: any) => {
    if (!item?.text_content) return;
    navigator.clipboard.writeText(item.text_content);
    setCopiedDocId(item.id);
    setTimeout(() => {
      setCopiedDocId((prev) => (prev === item.id ? null : prev));
    }, 2000);
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
      alert("Falha de conexão com o serviço de tradução.");
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
      `Conheça o Peguei o Texto! A melhor IA para transcrição de áudios e vídeos com 99,4% de precisão e exportação completa: ${affiliateUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  const handleApplyAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regCpfCnpj.trim() || !regPixKey.trim()) {
      setRegError("Por favor, preencha todos os campos obrigatórios para enviar sua candidatura.");
      return;
    }

    const cleanCode = regAffiliateCode.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") || (user?.id ? user.id.slice(0, 8) : "parceiro");

    setRegSubmitting(true);
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          user_id: user?.id || `user_${Date.now()}`,
          full_name: regFullName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          cpf_cnpj: regCpfCnpj.trim(),
          pix_key_type: regPixKeyType,
          pix_key: regPixKey.trim(),
          pix_name: regFullName.trim(),
          channel_type: regChannelType,
          channel_url: regChannelUrl.trim(),
          audience_range: "1k_10k",
          affiliate_code: cleanCode,
        }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.affiliate)) {
        setRegSuccess("Candidatura enviada com sucesso! Atualizando seu painel de parceiro...");
        setTimeout(async () => {
          await loadAffiliateData(user);
        }, 1200);
      } else {
        setRegError(data?.detail || "Erro ao registrar candidatura de afiliado.");
      }
    } catch (err) {
      console.error("Erro na candidatura:", err);
      setRegError("Falha de conexão ao enviar formulário de candidatura.");
    } finally {
      setRegSubmitting(false);
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
          user_id: user?.id,
          email: user?.email,
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

  // Suggestion Handler
  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSugError(null);

    if (sugTitle.trim().length < 4) {
      setSugError("O título precisa ter pelo menos 4 caracteres.");
      return;
    }
    if (sugDescription.trim().length < 12) {
      setSugError("Por favor, descreva sua ideia ou observação com pelo menos 12 caracteres.");
      return;
    }

    setSugLoading(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: sugCategory,
          title: sugTitle.trim(),
          description: sugDescription.trim(),
          user_email: user?.email || undefined,
          user_name: userName || undefined,
          user_id: user?.id || undefined,
        }),
      });

      if (res.ok) {
        setSugSuccess(true);
        setSugTitle("");
        setSugDescription("");
      } else {
        const d = await res.json();
        setSugError(d?.detail || "Erro ao enviar sugestão.");
      }
    } catch (err) {
      setSugError("Falha de conexão ao enviar sugestão.");
    } finally {
      setSugLoading(false);
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
                
                {/* Degravação Jurídica / PJe */}
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
                  {activeNavTab === "traducao" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
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
                                    {activeNavTab === "documentos" && (isEn ? "My Transcription Library" : "Meus Documentos")}
                  {activeNavTab === "legendas" && (isEn ? "Subtitles (.SRT & .VTT)" : "Gerador de Legendas (.SRT & .VTT)")}
                  {activeNavTab === "traducao" && (isEn ? "AI Global Translation" : "Tradução Global com IA")}
                  {activeNavTab === "downloader" && (isEn ? "Download Video & MP3" : "Baixar Vídeo & MP3")}
                  {activeNavTab === "indicacoes" && (isEn ? "Refer & Earn Free Minutes" : "Indique e Ganhe Minutos Grátis")}
                  {activeNavTab === "afiliados" && (isEn ? "Affiliate Partner Dashboard" : "Painel Oficial de Afiliados")}
                  {activeNavTab === "faturamento" && (isEn ? "Billing & Subscription Plans" : "Faturamento & Planos")}
                  {activeNavTab === "configuracoes" && (isEn ? "Account Settings" : "Configurações da Conta")}
                  {activeNavTab === "sugestoes" && (isEn ? "Feedback & Feature Suggestions" : "Envie Sugestões ou Relate Problemas")}
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

            {/* Language Switcher Dropdown */}
            <LanguageSwitcher />

            {/* Suggestions button (In-dashboard!) */}
            <button
              onClick={() => setActiveNavTab("sugestoes")}
              className="hidden md:inline-flex"
              style={{
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "10px",
                background: activeNavTab === "sugestoes" ? "rgba(251, 191, 36, 0.2)" : "rgba(251, 191, 36, 0.08)",
                border: activeNavTab === "sugestoes" ? "1px solid rgba(251, 191, 36, 0.5)" : "1px solid rgba(251, 191, 36, 0.25)",
                color: "#FBBF24",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Lightbulb size={13} />
              <span>{isEn ? "Suggest" : "Sugerir"}</span>
            </button>

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
                    {history.slice(0, 5).map((item) => {
                      const isExpanded = expandedDocId === item.id;
                      const wordCount = item.text_content ? item.text_content.trim().split(/\s+/).filter(Boolean).length : 0;
                      return (
                        <div
                          key={item.id}
                          style={{
                            borderRadius: "14px",
                            background: isExpanded ? "#130D24" : "#151026",
                            border: isExpanded ? "1px solid rgba(124, 58, 237, 0.45)" : "1px solid rgba(167, 139, 250, 0.1)",
                            boxShadow: isExpanded ? "0 8px 24px rgba(124, 58, 237, 0.15)" : "none",
                            transition: "all 0.2s ease",
                            overflow: "hidden",
                          }}
                        >
                          {/* Header Row */}
                          <div
                            style={{
                              padding: "16px 20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "14px",
                              cursor: "pointer",
                            }}
                            onClick={() => setExpandedDocId((prev) => (prev === item.id ? null : item.id))}
                          >
                            <div style={{ minWidth: 260, flex: 1 }}>
                              <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>{item.title || (isEn ? "Audio Transcription" : "Transcrição de Áudio")}</span>
                                {isExpanded && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      padding: "2px 8px",
                                      borderRadius: "6px",
                                      background: "rgba(124, 58, 237, 0.25)",
                                      color: "#C4B5FD",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {isEn ? "Open" : "Aberto"}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: "12px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                                <span>{item.platform ? item.platform.toUpperCase() : (isEn ? "AUDIO" : "ÁUDIO")}</span>
                                <span>•</span>
                                <span>{item.duration_seconds ? `${Math.ceil(item.duration_seconds / 60)} min` : "1 min"}</span>
                                <span>•</span>
                                <span>{new Date(item.created_at).toLocaleDateString(isEn ? "en-US" : "pt-BR")}</span>
                                {wordCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{wordCount.toLocaleString(isEn ? "en-US" : "pt-BR")} {isEn ? "words" : "palavras"}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setExpandedDocId((prev) => (prev === item.id ? null : item.id))}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: "8px",
                                  background: isExpanded ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(124, 58, 237, 0.15)",
                                  border: isExpanded ? "1px solid #A78BFA" : "1px solid rgba(124, 58, 237, 0.35)",
                                  color: isExpanded ? "#FFFFFF" : "#C4B5FD",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  boxShadow: isExpanded ? "0 0 12px rgba(124, 58, 237, 0.4)" : "none",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                                <span>{isExpanded ? (isEn ? "Close Reader" : "Fechar Leitor") : (isEn ? "Open Reader" : "Abrir Leitor")}</span>
                              </button>
                              <button
                                onClick={() => handleExportDocx(item)}
                                title={isEn ? "Export DOCX" : "Exportar DOCX"}
                                style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", cursor: "pointer" }}
                              >
                                .DOCX
                              </button>
                              <button
                                onClick={() => handleExportPdf(item)}
                                title={isEn ? "Export PDF" : "Exportar PDF"}
                                style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", cursor: "pointer" }}
                              >
                                .PDF
                              </button>
                              <button
                                onClick={() => handleExportTxt(item)}
                                title={isEn ? "Export TXT" : "Exportar TXT"}
                                style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2D9F3", cursor: "pointer" }}
                              >
                                .TXT
                              </button>
                            </div>
                          </div>

                          {/* EXPANDED INLINE READER */}
                          {isExpanded && (
                            <div
                              style={{
                                borderTop: "1px solid rgba(167, 139, 250, 0.12)",
                                background: "#0D081C",
                                padding: "20px 24px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                              }}
                            >
                              {/* Inner Reader Toolbar */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#A78BFA",
                                      background: "rgba(124, 58, 237, 0.15)",
                                      border: "1px solid rgba(124, 58, 237, 0.3)",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    <Sparkles size={13} color="#C4B5FD" />
                                    {isEn ? "Synchronized AI Transcript" : "Visualizador Sincronizado de Transcrição"}
                                  </span>

                                  {wordCount > 0 && (
                                    <span style={{ fontSize: "12px", color: "#9E96B3" }}>
                                      {wordCount.toLocaleString(isEn ? "en-US" : "pt-BR")} {isEn ? "words" : "palavras"}
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                  <button
                                    onClick={() => handleCopyDocText(item)}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                      background: copiedDocId === item.id ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
                                      border: copiedDocId === item.id ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                                      color: copiedDocId === item.id ? "#6EE7B7" : "#FFFFFF",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    {copiedDocId === item.id ? <Check size={13} /> : <Copy size={13} />}
                                    <span>{copiedDocId === item.id ? (isEn ? "Copied!" : "Copiado!") : (isEn ? "Copy Text" : "Copiar Texto")}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedSrtDocId(item.id);
                                      setActiveNavTab("legendas");
                                    }}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                      background: "rgba(236, 72, 153, 0.15)",
                                      border: "1px solid rgba(236, 72, 153, 0.35)",
                                      color: "#F472B6",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    <FileText size={13} />
                                    <span>{isEn ? "Subtitles (.SRT)" : "Legenda (.SRT)"}</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedTranslationDocId(item.id);
                                      setActiveNavTab("traducao");
                                    }}
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                      background: "rgba(16, 185, 129, 0.15)",
                                      border: "1px solid rgba(16, 185, 129, 0.35)",
                                      color: "#6EE7B7",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    <Globe size={13} />
                                    <span>{isEn ? "Translate" : "Traduzir com IA"}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Audio Player only if URL exists */}
                              {item.audio_url && (
                                <AudioSyncPlayer initialAudioUrl={item.audio_url} title={item.title} />
                              )}

                              {/* Transcript Content Box */}
                              <div
                                style={{
                                  maxHeight: "480px",
                                  overflowY: "auto",
                                  padding: "18px 20px",
                                  borderRadius: "12px",
                                  background: "#151026",
                                  border: "1px solid rgba(167, 139, 250, 0.12)",
                                  fontSize: "14px",
                                  lineHeight: 1.75,
                                  color: "#F1F5F9",
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {item.text_content ? (
                                  <InteractiveTranscript
                                    text={item.text_content}
                                    searchQuery={searchQuery}
                                  />
                                ) : (
                                  <div style={{ color: "#9E96B3", fontStyle: "italic" }}>
                                    {isEn ? "No text available for this transcription." : "Nenhum texto disponível para esta transcrição."}
                                  </div>
                                )}
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
          {/* TAB 3: MEUS DOCUMENTOS                             */}
          {/* =================================================== */}
          {activeNavTab === "documentos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
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
                    placeholder={isEn ? "Search by title, text or date..." : "Pesquisar por título, texto ou data..."}
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
                  .map((item) => {
                    const isExpanded = expandedDocId === item.id;
                    const wordCount = item.text_content ? item.text_content.trim().split(/\s+/).filter(Boolean).length : 0;
                    return (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: "14px",
                          background: isExpanded ? "#130D24" : "#151026",
                          border: isExpanded ? "1px solid rgba(124, 58, 237, 0.45)" : "1px solid rgba(167, 139, 250, 0.1)",
                          boxShadow: isExpanded ? "0 8px 24px rgba(124, 58, 237, 0.15)" : "none",
                          transition: "all 0.2s ease",
                          overflow: "hidden"
                        }}
                      >
                        {/* Header Row */}
                        <div
                          style={{
                            padding: "16px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "14px",
                            cursor: "pointer"
                          }}
                          onClick={() => setExpandedDocId((prev) => (prev === item.id ? null : item.id))}
                        >
                          <div style={{ minWidth: 260, flex: 1 }}>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>{item.title || (isEn ? "Audio Transcription" : "Transcrição de Áudio")}</span>
                              {isExpanded && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    background: "rgba(124, 58, 237, 0.25)",
                                    color: "#C4B5FD",
                                    fontWeight: 600,
                                  }}
                                >
                                  {isEn ? "Open" : "Aberto"}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "#9E96B3", display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                              <span>{item.platform ? item.platform.toUpperCase() : (isEn ? "AUDIO" : "ÁUDIO")}</span>
                              <span>•</span>
                              <span>{item.duration_seconds ? `${Math.ceil(item.duration_seconds / 60)} min` : "1 min"}</span>
                              <span>•</span>
                              <span>{new Date(item.created_at).toLocaleDateString(isEn ? "en-US" : "pt-BR")}</span>
                              {wordCount > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{wordCount.toLocaleString(isEn ? "en-US" : "pt-BR")} {isEn ? "words" : "palavras"}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setExpandedDocId((prev) => (prev === item.id ? null : item.id))}
                              style={{
                                padding: "6px 14px",
                                borderRadius: "8px",
                                background: isExpanded ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" : "rgba(124, 58, 237, 0.15)",
                                border: isExpanded ? "1px solid #A78BFA" : "1px solid rgba(124, 58, 237, 0.35)",
                                color: isExpanded ? "#FFFFFF" : "#C4B5FD",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: isExpanded ? "0 0 12px rgba(124, 58, 237, 0.4)" : "none",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                              <span>{isExpanded ? (isEn ? "Close Reader" : "Fechar Leitor") : (isEn ? "Open Reader" : "Abrir Leitor")}</span>
                            </button>
                            <button
                              onClick={() => handleExportDocx(item)}
                              title={isEn ? "Export DOCX" : "Exportar DOCX"}
                              style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#93C5FD", cursor: "pointer" }}
                            >
                              .DOCX
                            </button>
                            <button
                              onClick={() => handleExportPdf(item)}
                              title={isEn ? "Export PDF" : "Exportar PDF"}
                              style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", cursor: "pointer" }}
                            >
                              .PDF
                            </button>
                            <button
                              onClick={() => handleExportTxt(item)}
                              title={isEn ? "Export TXT" : "Exportar TXT"}
                              style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#E2D9F3", cursor: "pointer" }}
                            >
                              .TXT
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED INLINE READER */}
                        {isExpanded && (
                          <div
                            style={{
                              borderTop: "1px solid rgba(167, 139, 250, 0.12)",
                              background: "#0D081C",
                              padding: "20px 24px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "18px",
                            }}
                          >
                            {/* Inner Reader Toolbar */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#A78BFA",
                                    background: "rgba(124, 58, 237, 0.15)",
                                    border: "1px solid rgba(124, 58, 237, 0.3)",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <Sparkles size={13} color="#C4B5FD" />
                                  {isEn ? "Synchronized AI Transcript" : "Visualizador Sincronizado de Transcrição"}
                                </span>

                                {wordCount > 0 && (
                                  <span style={{ fontSize: "12px", color: "#9E96B3" }}>
                                    {wordCount.toLocaleString(isEn ? "en-US" : "pt-BR")} {isEn ? "words" : "palavras"}
                                  </span>
                                )}
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <button
                                  onClick={() => handleCopyDocText(item)}
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    background: copiedDocId === item.id ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.06)",
                                    border: copiedDocId === item.id ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                                    color: copiedDocId === item.id ? "#6EE7B7" : "#FFFFFF",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  {copiedDocId === item.id ? <Check size={13} /> : <Copy size={13} />}
                                  <span>{copiedDocId === item.id ? (isEn ? "Copied!" : "Copiado!") : (isEn ? "Copy Text" : "Copiar Texto")}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedSrtDocId(item.id);
                                    setActiveNavTab("legendas");
                                  }}
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    background: "rgba(236, 72, 153, 0.15)",
                                    border: "1px solid rgba(236, 72, 153, 0.35)",
                                    color: "#F472B6",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <FileText size={13} />
                                  <span>{isEn ? "Subtitles (.SRT)" : "Legenda (.SRT)"}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedTranslationDocId(item.id);
                                    setActiveNavTab("traducao");
                                  }}
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    background: "rgba(16, 185, 129, 0.15)",
                                    border: "1px solid rgba(16, 185, 129, 0.35)",
                                    color: "#6EE7B7",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <Globe size={13} />
                                  <span>{isEn ? "Translate" : "Traduzir com IA"}</span>
                                </button>
                              </div>
                            </div>

                            {/* Audio Player if URL exists */}
                            {item.audio_url && (
                              <AudioSyncPlayer initialAudioUrl={item.audio_url} title={item.title} />
                            )}

                            {/* Transcript Content Box */}
                            <div
                              style={{
                                maxHeight: "480px",
                                overflowY: "auto",
                                padding: "18px 20px",
                                borderRadius: "12px",
                                background: "#151026",
                                border: "1px solid rgba(167, 139, 250, 0.12)",
                                fontSize: "14px",
                                lineHeight: 1.75,
                                color: "#F1F5F9",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item.text_content ? (
                                <InteractiveTranscript
                                  text={item.text_content}
                                  searchQuery={searchQuery}
                                />
                              ) : (
                                <div style={{ color: "#9E96B3", fontStyle: "italic" }}>
                                  {isEn ? "No text available for this transcription." : "Nenhum texto disponível para esta transcrição."}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 4: LEGENDAS (.SRT & .VTT)                       */}
          {/* =================================================== */}
          {activeNavTab === "legendas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
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
                    <span>{isEn ? "Professional Subtitles with Synchronized Timestamps" : "Legendas Profissionais com Timestamps Sincronizados"}</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    {isEn ? "Subtitles (.SRT & .VTT) Generator & Exporter" : "Gerador & Exportador de Legendas (.SRT e .VTT)"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    {isEn ? "Generate millisecond-precise timestamps ready to import with 1 click into CapCut, Adobe Premiere Pro, DaVinci Resolve, or YouTube Studio." : "Gere marcações temporais milissegundo a milissegundo prontas para importar com 1 clique no CapCut, Adobe Premiere Pro, DaVinci Resolve ou YouTube Studio."}
                  </p>
                </div>

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
                    {isEn ? "Use Saved Transcript" : "Usar Transcrição Existente"}
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
                    {isEn ? "Upload New Media/Link" : "Gerar de Novo Arquivo/Vídeo"}
                  </button>
                </div>
              </div>

              {legendasMode === "existing" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {history.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", borderRadius: "16px", background: "#151026", border: "1px dashed rgba(167, 139, 250, 0.2)" }}>
                      <FileText size={32} color="#EC4899" style={{ margin: "0 auto 12px" }} />
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                        {isEn ? "No transcriptions available to export subtitles" : "Nenhuma transcrição disponível para exportar legendas"}
                      </div>
                      <div style={{ fontSize: "13px", color: "#9E96B3", marginBottom: "16px" }}>
                        Alterne para "{isEn ? "Upload New Media/Link" : "Gerar de Novo Arquivo/Vídeo"}" acima para enviar seu primeiro arquivo.
                      </div>
                      <button
                        onClick={() => setLegendasMode("new")}
                        style={{ padding: "8px 18px", borderRadius: "10px", background: "#EC4899", border: "none", color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                      >
                        {isEn ? "Upload Video or Link" : "Enviar Vídeo ou Link"}
                      </button>
                    </div>
                  ) : (
                    <>
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
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>{isEn ? "Select Recording:" : "Selecionar Gravação:"}</span>
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
                    <span>{isEn ? "Global AI Translation with Context Preservation" : "Tradução Global com Preservação de Contexto"}</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    {isEn ? "Global AI Translation" : "Tradução Global com Inteligência Artificial"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    {isEn ? "Translate entire transcripts or custom texts into more than 10 languages with maximum fidelity and export as Word (.DOCX) or plain text." : "Traduza transcrições inteiras ou textos para mais de 10 idiomas com máxima fidelidade e exporte em Word (.DOCX) ou texto puro."}
                  </p>
                </div>
              </div>

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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3" }}>{isEn ? "Source:" : "Origem:"}</span>
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
                      <option value="manual">{isEn ? "Type / Paste Text Manually" : "Digitar / Colar Texto Manualmente"}</option>
                      {history.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title || "Gravação"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3" }}>{isEn ? "Translate To:" : "Traduzir Para:"}</span>
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
                  <span>{isTranslating ? (isEn ? "Translating..." : "Traduzindo...") : (isEn ? "Translate with AI" : "Traduzir com IA")}</span>
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
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
                        <span>Traduzindo com precisão...</span>
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
                      Basta clicar na aba <strong>Transcrever</strong> para gerar sua ata ou texto completo em segundos.
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
                    <span>{isEn ? "Official Friend Referral Program" : "Programa Oficial de Indicação de Amigos"}</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    {isEn ? "Refer Friends and Earn Free Minutes" : "Indique Amigos e Ganhe Minutos Gratuitos"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    {isEn ? "For every friend or colleague who registers via your link, you get <strong>+10 minutes</strong> automatically credited to your balance, and your friend also gets bonus minutes!" : "Para cada amigo ou colega que se cadastrar através do seu link, você recebe <strong>+10 minutos</strong> creditados automaticamente no seu saldo, e seu amigo também ganha minutos bônus!"}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                  <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>{isEn ? "Total Confirmed Invites" : "Total de Convites Confirmados"}</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>{referralStats.total_invites} {isEn ? "friends" : "amigos"}</div>
                </div>

                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                  <div style={{ fontSize: "12px", color: "#6EE7B7", marginBottom: "6px" }}>{isEn ? "Minutes Earned with Invites" : "Minutos Ganhos com Convites"}</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#34D399" }}>+{referralStats.total_minutes_earned} min</div>
                </div>

                <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                  <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>{isEn ? "Bonus per New Friend" : "Bônus por Novo Amigo"}</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#A78BFA" }}>{isEn ? "+10 min instant" : "+10 min imediatos"}</div>
                </div>
              </div>

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
                  {isEn ? "Your Exclusive Referral Link:" : "Seu Link Exclusivo de Indicação:"}
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {[
                  { step: "1", title: "Envie seu link", desc: "Compartilhe seu link exclusivo com amigos, colegas ou nas suas redes sociais." },
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
                    <span>{isEn ? "Official Peguei o Texto Affiliate Program" : "Programa Oficial de Afiliados Peguei o Texto"}</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    {isEn ? "30% Recurring Monthly Commission" : "30% de Comissão Recorrente Mensal"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    {isEn ? "Earn 30% on all monthly and annual subscription payments made by clients you refer, for as long as they stay subscribed." : "Receba 30% em todos os pagamentos mensais e anuais realizados por clientes que você indicar, enquanto eles continuarem assinando."}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#9E96B3" }}>{isEn ? "Monthly Payouts via PIX" : "Pagamentos via PIX"}</div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#34D399" }}>{isEn ? "Every 10th" : "Todo dia 10"}</div>
                </div>
              </div>

              {affiliateLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", color: "#A78BFA", gap: "10px" }}>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Verificando status de afiliado...</span>
                </div>
              ) : affiliateData && affiliateData.status === "active" ? (
                /* CASO 1: JÁ É AFILIADO ATIVO */
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                      <div style={{ fontSize: "12px", color: "#6EE7B7", marginBottom: "6px" }}>{isEn ? "Available Balance for Payout" : "Saldo Disponível para Saque"}</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#34D399" }}>
                        R$ {affiliateMetrics?.balance_available ? Number(affiliateMetrics.balance_available).toFixed(2).replace(".", ",") : "0,00"}
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>{isEn ? "Total Accumulated Earnings" : "Total de Ganhos Acumulados"}</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>
                        R$ {affiliateMetrics?.total_earnings ? Number(affiliateMetrics.total_earnings).toFixed(2).replace(".", ",") : "0,00"}
                      </div>
                    </div>

                    <div style={{ padding: "18px 20px", borderRadius: "16px", background: "#151026", border: "1px solid rgba(167, 139, 250, 0.12)" }}>
                      <div style={{ fontSize: "12px", color: "#9E96B3", marginBottom: "6px" }}>{isEn ? "Subscriptions & Sales" : "Assinaturas & Vendas"}</div>
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
                      {isEn ? "Request Commission Payout via PIX" : "Solicitar Saque de Comissões via PIX"}
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
                        <label style={{ fontSize: "12px", color: "#9E96B3", display: "block", marginBottom: "6px" }}>{isEn ? "PIX Key (CPF, Email, Phone, or Random Key):" : "Chave PIX (CPF, E-mail, Telefone ou Aleatória):"}</label>
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
                        <label style={{ fontSize: "12px", color: "#9E96B3", display: "block", marginBottom: "6px" }}>{isEn ? "Payout Amount (R$ - Minimum R$ 50.00):" : "Valor do Saque (R$ - Mínimo R$ 50,00):"}</label>
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
                      <span>{affiliatePayoutLoading ? (isEn ? "Processing..." : "Processando...") : (isEn ? "Confirm Payout Request" : "Confirmar Solicitação de Saque")}</span>
                    </button>
                  </form>
                </>
              ) : affiliateData && affiliateData.status === "pending_review" ? (
                /* CASO 2: CANDIDATURA EM ANÁLISE */
                <div style={{
                  padding: "40px 32px",
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  textAlign: "center",
                  maxWidth: 640,
                  margin: "0 auto"
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Clock size={28} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", marginBottom: "8px" }}>
                    {isEn ? "Your Affiliate Application is Under Review" : "Sua Candidatura a Afiliado está em Análise"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#9E96B3", lineHeight: 1.6, marginBottom: "20px" }}>
                    {isEn ? "We received your application and it is currently being reviewed by our team. You will be notified as soon as your partner account is approved and your sales dashboard is unlocked!" : "Recebemos seus dados e sua solicitação está em moderação pela nossa equipe. Você receberá um aviso assim que a afiliação for aprovada e seu painel de vendas for liberado!"}
                  </p>

                  <div style={{
                    background: "#151026",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#E2D9F3"
                  }}>
                    <div><strong>Nome:</strong> {affiliateData.full_name}</div>
                    <div><strong>E-mail:</strong> {affiliateData.email}</div>
                    <div><strong>Código Reservado:</strong> <span style={{ color: "#C4B5FD" }}>{affiliateData.affiliate_code}</span></div>
                    <div><strong>Status:</strong> <span style={{ color: "#FBBF24", fontWeight: 700 }}>Em Análise Manual</span></div>
                  </div>
                </div>
              ) : (
                /* CASO 3: NÃO É AFILIADO -> FLUXO DE CADASTRO / CANDIDATURA */
                <div style={{
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  padding: "32px",
                  maxWidth: 720,
                  margin: "0 auto",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)"
                }}>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ width: 50, height: 50, borderRadius: "14px", background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#FFF" }}>
                      <Award size={26} />
                    </div>
                    <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px" }}>
                      {isEn ? "Official Affiliate Program Application" : "Candidatura para o Programa Oficial de Afiliados"}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#9E96B3", lineHeight: 1.5, margin: 0 }}>
                      {isEn ? "Fill in the form below to apply. You will earn <strong>30% recurring lifetime commission</strong> on all subscription renewals and purchases generated." : "Preencha o formulário abaixo para se candidatar. Você terá direito a <strong>30% de comissão recorrente vitalícia</strong> em todas as mensalidades e compras geradas."}
                    </p>
                  </div>

                  {regSuccess && (
                    <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
                      {regSuccess}
                    </div>
                  )}

                  {regError && (
                    <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", fontSize: "13px", marginBottom: "20px" }}>
                      {regError}
                    </div>
                  )}

                  <form onSubmit={handleApplyAffiliate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          {isEn ? "Full Name *" : "Nome Completo *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="Ex: Pedro Henrique Silva"
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
                          {isEn ? "Contact Email *" : "E-mail de Contato *"}
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="seu@email.com"
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

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          {isEn ? "WhatsApp / Phone Number *" : "WhatsApp / Telefone com DDD *"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
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
                          CPF ou CNPJ (para emissão de recibo PIX) *
                        </label>
                        <input
                          type="text"
                          required
                          value={regCpfCnpj}
                          onChange={(e) => setRegCpfCnpj(e.target.value)}
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
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

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          Tipo de Chave PIX *
                        </label>
                        <select
                          value={regPixKeyType}
                          onChange={(e) => setRegPixKeyType(e.target.value)}
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
                        >
                          <option value="cpf">CPF</option>
                          <option value="cnpj">CNPJ</option>
                          <option value="email">E-mail</option>
                          <option value="phone">Telefone / Celular</option>
                          <option value="random">Chave Aleatória</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          Chave PIX para Recebimentos *
                        </label>
                        <input
                          type="text"
                          required
                          value={regPixKey}
                          onChange={(e) => setRegPixKey(e.target.value)}
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
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          Canal Principal de Divulgação
                        </label>
                        <select
                          value={regChannelType}
                          onChange={(e) => setRegChannelType(e.target.value)}
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
                        >
                          <option value="instagram">Instagram (Reels / Stories)</option>
                          <option value="youtube">YouTube (Canal / Shorts)</option>
                          <option value="tiktok">TikTok</option>
                          <option value="blog">Blog ou Site</option>
                          <option value="whatsapp">Grupos & WhatsApp</option>
                          <option value="outros">Indicação Direta & Outros</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                          Link do Canal, Perfil ou Rede Social
                        </label>
                        <input
                          type="text"
                          value={regChannelUrl}
                          onChange={(e) => setRegChannelUrl(e.target.value)}
                          placeholder="https://instagram.com/seu_perfil ou canal"
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

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                        Código de Afiliado Desejado (Ex: seu nome ou marca)
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#6B6382" }}>pegueiotexto.com.br/?ref=</span>
                        <input
                          type="text"
                          value={regAffiliateCode}
                          onChange={(e) => setRegAffiliateCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                          placeholder="seunome"
                          style={{
                            flex: 1,
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: "#151026",
                            border: "1px solid rgba(124, 58, 237, 0.3)",
                            color: "#C4B5FD",
                            fontWeight: 700,
                            fontSize: "13px",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={regSubmitting}
                      style={{
                        marginTop: "8px",
                        padding: "14px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: regSubmitting ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 16px rgba(124, 58, 237, 0.4)",
                        opacity: regSubmitting ? 0.7 : 1
                      }}
                    >
                      {regSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                      <span>{regSubmitting ? "Enviando Candidatura..." : "Enviar Candidatura para Afiliado (30% Recorrente)"}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 9: FATURAMENTO & PLANOS                         */}
          {/* =================================================== */}
          {activeNavTab === "faturamento" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
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
                      {isEn ? "Current Active Plan" : "Plano Ativo no Momento"}
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
                    {credits} {isEn ? "minutes available for transcription" : "minutos disponíveis para degravação"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#9E96B3", marginTop: "4px" }}>
                    {!isPaidUser && typeof profile?.days_until_renewal === "number" ? (
                      <span style={{ color: "#34D399", fontWeight: 600 }}>
                        🔄 {isEn ? `Free 25 min renewal in ${profile.days_until_renewal} days` : `Renovação gratuita de 25 min em ${profile.days_until_renewal} dias`}
                      </span>
                    ) : (
                      <span>{isEn ? "Continuous access with high-speed priority" : "Acesso contínuo sem limites de velocidade"}</span>
                    )}
                  </div>
                </div>

                <div style={{ width: 200 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9E96B3", marginBottom: "6px" }}>
                    <span>{isEn ? "Usage" : "Consumo"}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div style={{ width: "100%", height: 8, borderRadius: 100, background: "rgba(255, 255, 255, 0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${progressPercent}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)" }} />
                  </div>
                </div>
              </div>

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
                    <span>{isEn ? "Annual (Best Value)" : "Anual com Desconto"}</span>
                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.25)", color: "#6EE7B7" }}>
                      {isEn ? "3 months free" : "3 meses grátis"}
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
                    {isEn ? "Monthly / One-Time" : "Mensal / Avulso"}
                  </button>
                </div>
              </div>

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
                        {isEn ? "MOST POPULAR" : "MAIS POPULAR"}
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
                          <span style={{ fontSize: "12px", color: "#9E96B3" }}>{isEn ? "/ month" : "/ mês"}</span>
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
                      <span>{loadingCheckoutPlan === plan.id ? (isEn ? "Connecting checkout..." : "Conectando checkout...") : plan.cta}</span>
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
                    {isEn ? "Account Settings" : "Configurações da Conta"}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0 }}>
                    {isEn ? "Manage your profile, password security, transcription preferences, and billing." : "Gerencie seus dados de acesso, senha, preferências de transcrição e faturamento."}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {[
                    { id: "perfil", label: isEn ? "My Profile" : "Meu Perfil" },
                    { id: "senha", label: isEn ? "Security & Password" : "Segurança & Senha" },
                    { id: "preferencias", label: isEn ? "Preferences" : "Preferências" }
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
                        {isEn ? "Full Display Name:" : "Nome Completo de Exibição:"}
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
                      {isEn ? "Show passwords" : "Mostrar senhas digitadas"}
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
                    {configSavingPassword ? (isEn ? "Updating..." : "Atualizando...") : (isEn ? "Update Password" : "Atualizar Senha")}
                  </button>
                </form>
              )}

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
                    {isEn ? "Transcription Engine Preferences" : "Preferências do Sistema de Transcrição"}
                  </div>

                  {prefSavedMessage && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6EE7B7", fontSize: "12px" }}>
                      {isEn ? "Preferences saved successfully!" : "Preferências salvas com sucesso!"}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "12px", background: "#151026" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>{isEn ? "Automatic Speaker Diarization" : "Diarização Automática de Oradores"}</div>
                        <div style={{ fontSize: "12px", color: "#9E96B3" }}>{isEn ? "Identify who is speaking in meetings, interviews, or depositions" : "Identificar quem está falando em reuniões, entrevistas ou depoimentos"}</div>
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
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>{isEn ? "Synchronized Timestamps" : "Timestamps Sincronizados"}</div>
                        <div style={{ fontSize: "12px", color: "#9E96B3" }}>{isEn ? "Include accurate timestamps at the beginning of each sentence" : "Incluir minutagem precisa a cada início de frase nas transcrições"}</div>
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
                    {isEn ? "Save Preferences" : "Salvar Preferências"}
                  </button>
                </div>
              )}

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
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#FCA5A5" }}>{isEn ? "Sign Out" : "Encerrar Sessão"}</div>
                  <div style={{ fontSize: "12px", color: "#9E96B3" }}>{isEn ? "Disconnect your account on this device" : "Desconectar sua conta neste dispositivo"}</div>
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
                  {isEn ? "Sign Out" : "Sair da Conta"}
                </button>
              </div>

            </div>
          )}

          {/* =================================================== */}
          {/* TAB 11: SUGESTÕES & FEEDBACK (IN-DASHBOARD)         */}
          {/* =================================================== */}
          {activeNavTab === "sugestoes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 780 }}>
              
              <div style={{
                padding: "24px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(15, 10, 28, 0.9) 100%)",
                border: "1px solid rgba(251, 191, 36, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(251, 191, 36, 0.15)", color: "#FBBF24", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>
                    <Lightbulb size={12} />
                    <span>Canal Direto com o time do Peguei o Texto</span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
                    Sua Sugestão ou Relato de Problema
                  </h2>
                  <p style={{ fontSize: "13px", color: "#9E96B3", margin: 0, lineHeight: 1.5 }}>
                    Sentiu falta de uma funcionalidade, quer sugerir uma melhoria ou encontrou alguma instabilidade? Conte para nós para implementarmos!
                  </p>
                </div>
              </div>

              {sugSuccess ? (
                <div style={{
                  padding: "40px 32px",
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  textAlign: "center"
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#FFFFFF", marginBottom: "8px" }}>
                    Muito obrigado pelo seu feedback!
                  </h3>
                  <p style={{ fontSize: "14px", color: "#9E96B3", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 20px" }}>
                    Sua mensagem foi enviada diretamente para a equipe técnica e de produto. Avaliamos todas as sugestões para as próximas atualizações.
                  </p>
                  <button
                    onClick={() => setSugSuccess(false)}
                    style={{
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
                    Enviar Outra Sugestão
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: "28px",
                  borderRadius: "20px",
                  background: "#0F0A1C",
                  border: "1px solid rgba(167, 139, 250, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}>
                  {sugError && (
                    <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#FCA5A5", fontSize: "13px" }}>
                      {sugError}
                    </div>
                  )}

                  {/* Category Selector Chips */}
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "8px" }}>
                      Categoria da Sugestão:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {[
                        { id: "features", label: "💡 Nova Funcionalidade" },
                        { id: "ux", label: "🎨 UX & Interface" },
                        { id: "transcription", label: "🎙️ Transcrição & Áudio" },
                        { id: "ai", label: "🤖 Inteligência Artificial" },
                        { id: "bugs", label: "🐛 Bugs ou Erros" }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSugCategory(cat.id)}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            border: sugCategory === cat.id ? "1px solid rgba(251, 191, 36, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                            background: sugCategory === cat.id ? "rgba(251, 191, 36, 0.15)" : "#151026",
                            color: sugCategory === cat.id ? "#FBBF24" : "#9E96B3",
                            cursor: "pointer"
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmitSuggestion} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#9E96B3", display: "block", marginBottom: "6px" }}>
                        Título Resumido da Ideia:
                      </label>
                      <input
                        type="text"
                        value={sugTitle}
                        onChange={(e) => setSugTitle(e.target.value)}
                        placeholder="Ex: Adicionar exportação para Notion ou suporte a áudio gravado direto"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
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
                        Detalhes & Como isso ajudaria o seu dia a dia:
                      </label>
                      <textarea
                        value={sugDescription}
                        onChange={(e) => setSugDescription(e.target.value)}
                        placeholder="Conte com detalhes o que você gostaria de ver ou o que aconteceu..."
                        style={{
                          width: "100%",
                          height: 160,
                          padding: "14px 16px",
                          borderRadius: "10px",
                          background: "#151026",
                          border: "1px solid rgba(167, 139, 250, 0.2)",
                          color: "#FFF",
                          fontSize: "13px",
                          lineHeight: 1.6,
                          outline: "none",
                          resize: "none"
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sugLoading}
                      style={{
                        alignSelf: "flex-start",
                        padding: "12px 28px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                        border: "none",
                        color: "#FFFFFF",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: sugLoading ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 14px rgba(245, 158, 11, 0.3)",
                        opacity: sugLoading ? 0.7 : 1
                      }}
                    >
                      {sugLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      <span>{sugLoading ? "Enviando..." : "Enviar Sugestão"}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
