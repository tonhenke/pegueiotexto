"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Download,
  FileText,
  Play,
  Pause,
  Copy,
  Check,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Lock,
  Headphones,
  Users,
  Award,
  FileCheck2,
} from "lucide-react";
import TranscribeForm from "@/components/TranscribeForm";

interface HearingLine {
  id: number;
  time: string;
  seconds: number;
  speaker: string;
  role: "Juiz" | "Defesa" | "Testemunha" | "Ministério Público";
  roleColor: string;
  roleBg: string;
  avatarText: string;
  text: string;
}

const SAMPLE_HEARING: HearingLine[] = [
  {
    id: 1,
    time: "00:01",
    seconds: 1,
    speaker: "Dr. Roberto Mendes",
    role: "Juiz",
    roleColor: "#60A5FA",
    roleBg: "rgba(59, 130, 246, 0.15)",
    avatarText: "⚖️",
    text: "Dr. Defensor, o senhor deseja formular perguntas diretamente à testemunha compromissada?",
  },
  {
    id: 2,
    time: "00:06",
    seconds: 6,
    speaker: "Dra. Camila Soares",
    role: "Defesa",
    roleColor: "#A78BFA",
    roleBg: "rgba(167, 139, 250, 0.15)",
    avatarText: "💼",
    text: "Sim, Excelência. Testemunha, na data dos fatos, o senhor presenciou o momento exato em que o reclamante encerrou o expediente por volta das 19h30?",
  },
  {
    id: 3,
    time: "00:13",
    seconds: 13,
    speaker: "Sr. Marcelo Nogueira",
    role: "Testemunha",
    roleColor: "#10B981",
    roleBg: "rgba(16, 185, 129, 0.15)",
    avatarText: "👤",
    text: "Sim, Doutora. Eu estava na recepção da filial e confirmo que ele permanecia nas dependências da empresa até esse horário diariamente.",
  },
  {
    id: 4,
    time: "00:20",
    seconds: 20,
    speaker: "Dr. Vinícius Prado",
    role: "Ministério Público",
    roleColor: "#F59E0B",
    roleBg: "rgba(245, 158, 11, 0.15)",
    avatarText: "🏛️",
    text: "Pela ordem, Excelência. Requeiro que conste expressamente em ata a declaração da testemunha sobre o registro do ponto biométrico.",
  },
  {
    id: 5,
    time: "00:27",
    seconds: 27,
    speaker: "Dr. Roberto Mendes",
    role: "Juiz",
    roleColor: "#60A5FA",
    roleBg: "rgba(59, 130, 246, 0.15)",
    avatarText: "⚖️",
    text: "Fica deferido e consignado na ata de instrução e julgamento. Defesa pode dar seguimento.",
  },
];

const USE_CASES = [
  {
    id: "trabalhista",
    title: "Direito Trabalhista",
    subtitle: "Audiências de Instrução & Depoimentos Pessoais",
    badge: "Mais Utilizado",
    description:
      "Degrave audiências trabalhistas inteiras separando as declarações do reclamante, preposto da reclamada e testemunhas. Localize em segundos contradições de jornada, acúmulo de função e verbas rescisórias para sustentar suas razões finais.",
    bullets: [
      "Diferenciação clara entre Juiz, Reclamante, Preposto e Testemunha",
      "Timestamps exatos para fundamentar Alegações Finais por memoriais",
      "Exportação direta para Word (.DOCX) com recuo de citação para petições",
    ],
    sampleQuote:
      "«00:14 - Testemunha: Confirmo que o reclamante realizava horas extras sem registro no espelho de ponto...»",
  },
  {
    id: "criminal",
    title: "Direito Criminal & Júri",
    subtitle: "Interrogatórios, Oitivas de Vítimas & Sessões do Júri",
    badge: "Alta Complexidade",
    description:
      "Transforme horas de depoimentos de inquéritos policiais e audiências de custódia em texto pesquisável. Encontre palavras-chave e contradições com extrema celeridade para memoriais e recursos de apelação.",
    bullets: [
      "Pesquisa instantânea de termos e contradições na íntegra das oitivas",
      "Transcreve áudios de longa duração (até 3 horas de plenário sem interrupções)",
      "Sigilo processual de acordo com o segredo de justiça e exclusão automática",
    ],
    sampleQuote:
      "«01:22:10 - Réu: Declarei em sede policial sob coação que estaria no local, mas tenho comprovante de passagem...»",
  },
  {
    id: "familia",
    title: "Família & Sucessões",
    subtitle: "Atendimentos a Clientes & Audiências de Conciliação",
    badge: "Rotina de Escritório",
    description:
      "Converta reuniões prévias com clientes e gravações de audiências de mediação no CEJUSC em relatórios detalhados. Poupe horas de anotações manuais para redigir a petição inicial de divórcio, alimentos ou partilha de bens.",
    bullets: [
      "Relatório estruturado da primeira consulta jurídica com o cliente",
      "Registro fiel dos acordos estabelecidos em conciliações",
      "Player com conferência imediata de detalhes sensíveis da lide",
    ],
    sampleQuote:
      "«00:08 - Requerente: Aceito a divisão dos bens sob a condição do pagamento da pensão alimentícia fixada...»",
  },
  {
    id: "civel",
    title: "Cível & Empresarial",
    subtitle: "Mediações, Assembleias Societárias & Perícias",
    badge: "Corporativo",
    description:
      "Tenha atas fidedignas de assembleias de acionistas, reuniões de negociação e sessões de mediação empresarial no mesmo dia. Gere documentos formatados prontos para validação dos sócios e juntada contratual.",
    bullets: [
      "Ata societária entregue aos clientes minutos após o fim da reunião",
      "Identificação nominal de cada conselheiro ou acionista participante",
      "Resumo executivo gerado por Inteligência Artificial integrado",
    ],
    sampleQuote:
      "«00:34 - Sócio Administrador: Fica aprovada a alteração da cláusula quinta do contrato social com maioria dos votos...»",
  },
  {
    id: "previdenciario",
    title: "Previdenciário",
    subtitle: "Perícias Médicas & Justificação Administrativa",
    badge: "Foco no JEF",
    description:
      "Documente com rigor técnico as respostas colhidas em perícias judiciais e audiências de justificação administrativa perante o INSS. Fundamente recursos e quesitos suplementares com extrema agilidade.",
    bullets: [
      "Transcrição minuciosa de perguntas ao perito judicial e respostas técnicas",
      "Citação do segundo exato nos autos para fundamentar quesitos complementares",
      "Compatível com arquivos extraídos dos sistemas do TRF e Juizados Especiais",
    ],
    sampleQuote:
      "«00:19 - Perito: O autor apresenta limitação funcional incompatível com a atividade habitual declarada...»",
  },
];

const FREE_PLAN = {
  id: "free",
  name: "Começar Grátis",
  currency: "R$",
  numericPrice: "0",
  period: "grátis",
  billingNote: "Sem cartão de crédito",
  capacityText: "5 min grátis em degravação",
  desc: "Ideal para testar a acurácia com depoimentos reais e conferir a pontuação",
  color: "#10B981",
  features: [
    "5 minutos grátis imediatos no cadastro",
    "Sem necessidade de cartão de crédito",
    "Suporte a PJe Mídias, Zoom, Teams, MP4 e MP3",
    "Identificação e separação de oradores",
    "Player sincronizado com áudio e timestamps",
    "Sigilo profissional e deleção automática",
  ],
  cta: "Testar 5 Minutos Grátis",
  popular: false,
  badge: "Teste Sem Cartão",
  href: "/login?signup=true",
};

const PACKAGES = [
  {
    id: "starter",
    name: "Starter Jurídico",
    currency: "R$",
    numericPrice: "4,90",
    period: "pagamento único",
    billingNote: "Sem cobranças recorrentes",
    capacityText: "60 min em degravação",
    desc: "Perfeito para audiências esporádicas e casos específicos",
    color: "#06B6D4",
    features: [
      "60 minutos de degravação com IA",
      "Suporte a PJe Mídias, Zoom, Teams e MP3/MP4/WAV",
      "Download em arquivo de texto puro (.TXT)",
      "Player sincronizado com timestamps",
      "Deleção automática da mídia com sigilo total",
      "Validade de 6 meses para consumir",
    ],
    cta: "Comprar Pacote Starter",
    popular: false,
    badge: null,
    href: "/login?signup=true&plan=starter",
  },
  {
    id: "pro",
    name: "Pro Escritório",
    currency: "R$",
    numericPrice: "17,90",
    period: "pagamento único",
    billingNote: "Sem cobranças recorrentes",
    capacityText: "300 min em degravação",
    desc: "O pacote avulso mais escolhido por advogados atuantes e bancas jurídicas",
    color: "#7C3AED",
    features: [
      "300 minutos de degravação com IA (5 horas)",
      "Exportação para Word (.DOCX) pronta para petições",
      "Exportação em PDF formatado e legendas (.SRT)",
      "Identificação automática de oradores (Diarização)",
      "Síntese e Resumos Executivos com IA inclusos",
      "Player de áudio sincronizado com clique-para-ouvir",
      "Suporte a links do PJe Mídias, Google Drive e Zoom",
      "Validade de 12 meses para consumir",
    ],
    cta: "Comprar Pacote Pro",
    popular: true,
    badge: "Mais Procurado no Avulso",
    href: "/login?signup=true&plan=pro",
  },
  {
    id: "business",
    name: "Banca Jurídica",
    currency: "R$",
    numericPrice: "79,90",
    period: "pagamento único",
    billingNote: "Sem cobranças recorrentes",
    capacityText: "1.000 min em degravação",
    desc: "Para escritórios com grande volume pontual de audiências de instrução e júri",
    color: "#EC4899",
    features: [
      "1.000 minutos de transcrição com IA de alta precisão",
      "Exportação em todos os formatos (.DOCX, .PDF, .SRT, .TXT)",
      "Sínteses e relatórios jurídicos com IA ilimitados",
      "Suporte a arquivos pesados de até 3 horas de duração",
      "Prioridade máxima na fila de processamento",
      "Suporte prioritário via WhatsApp e e-mail",
      "Validade de 24 meses para consumir",
    ],
    cta: "Comprar Pacote Banca",
    popular: false,
    badge: null,
    href: "/login?signup=true&plan=business",
  },
];

const ANNUAL_PLANS = [
  {
    id: "starter_annual",
    name: "Starter Anual",
    currency: "R$",
    numericPrice: "3,74",
    period: "/ mês",
    billingNote: "R$ 44,90 faturados ao ano (economize 3 meses)",
    capacityText: "720 min/ano em degravação",
    desc: "Acesso contínuo com a máxima economia para advogados autônomos",
    color: "#06B6D4",
    features: [
      "720 minutos anuais de degravação com IA",
      "Economia direta de 3 meses grátis",
      "Download em arquivo de texto (.TXT)",
      "Player sincronizado com timestamps",
      "Deleção de arquivos e sigilo LGPD garantidos",
    ],
    cta: "Assinar Starter Anual",
    popular: false,
    badge: "Economize 3 Meses",
    href: "/login?signup=true&plan=starter_annual",
  },
  {
    id: "pro_annual",
    name: "Pro Anual Escritório",
    currency: "R$",
    numericPrice: "13,25",
    period: "/ mês",
    billingNote: "R$ 159,00 faturados ao ano (economize R$ 55,80)",
    capacityText: "3.600 min/ano em degravação",
    desc: "A solução completa para o fluxo mensal de audiências, oitivas e petições",
    color: "#7C3AED",
    features: [
      "3.600 minutos anuais com IA de alta fidelidade (5h/mês)",
      "Exportação para Word (.DOCX) e PDF pronta para juntada",
      "Identificação de oradores e resumos executivos com IA",
      "Prioridade máxima na fila de conversão",
      "Super economia de R$ 55,80 em relação ao avulso",
    ],
    cta: "Assinar Pro Anual (Recomendado)",
    popular: true,
    badge: "Mais Escolhido por Escritórios",
    href: "/login?signup=true&plan=pro_annual",
  },
  {
    id: "business_annual",
    name: "Banca Anual Corporativa",
    currency: "R$",
    numericPrice: "56,58",
    period: "/ mês",
    billingNote: "R$ 679,00 faturados ao ano (economize R$ 279,80)",
    capacityText: "12.000 min/ano em degravação",
    desc: "Para departamentos jurídicos e bancas com dezenas de advogados",
    color: "#EC4899",
    features: [
      "12.000 minutos no ano com prioridade instantânea",
      "Download ilimitado em DOCX, PDF e legendas SRT",
      "Múltiplas audiências simultâneas de longa duração",
      "Atendimento dedicado via WhatsApp para o escritório",
      "Economia de R$ 279,80 ao ano",
    ],
    cta: "Assinar Corporativo Anual",
    popular: false,
    badge: "Grande Volume",
    href: "/login?signup=true&plan=business_annual",
  },
];

const FAQS = [
  {
    q: "A transcrição automática gerada por IA tem validade jurídica e pode ser juntada aos autos?",
    a: "Sim. No Direito Processual brasileiro (art. 369 e 406 do CPC), as partes têm o direito de empregar todos os meios legais e moralmente legítimos para provar a verdade dos fatos. A transcrição de áudio atua como documento degravado para fundamentar petições iniciais, contestações, alegações finais e memoriais. Como nosso sistema inclui marcação precisa de tempo (timestamps [00:00]), o magistrado e a parte contrária podem conferir com precisão cirúrgica o minuto exato da gravação oficial depositada no PJe Mídias.",
  },
  {
    q: "Como o Peguei o Texto garante o sigilo profissional, a LGPD e o segredo de justiça?",
    a: "O sigilo da relação advogado-cliente (art. 7º, II do Estatuto da OAB) e a conformidade com a LGPD são prioridades inegociáveis. Todos os uploads trafegam por canais criptografados (TLS 1.3 com AES-256). Os arquivos temporários de áudio e vídeo são excluídos de forma permanente e irreversível dos nossos servidores imediatamente após o término do processamento. Seus dados e transcrições jamais são utilizados para treinar modelos de Inteligência Artificial de terceiros.",
  },
  {
    q: "O sistema aceita arquivos extraídos diretamente do PJe Mídias e gravações do Zoom / Teams?",
    a: "Com certeza! Nosso motor de processamento aceita todos os formatos comuns do ecossistema forense e de audiências remotas: MP4, MP3, WAV, M4A, OGG, OPUS (áudios de WhatsApp), bem como links diretos de gravações armazenadas no Google Drive, YouTube (vídeos não listados) e plataformas compatíveis.",
  },
  {
    q: "A IA identifica automaticamente quem está falando (Juiz, Advogado, Testemunha, Réu)?",
    a: "Sim! A nossa tecnologia aplica algoritmos avançados de diarização de oradores, diferenciando os tons de voz e separando as falas em parágrafos distintos. Você visualiza a divisão das falas no editor e no player sincronizado, podendo editar os nomes dos intervenientes antes de exportar o documento definitivo para Word (.DOCX).",
  },
  {
    q: "Posso exportar o texto formatado diretamente para o Microsoft Word (.DOCX)?",
    a: "Sim! A partir do pacote Pro, a exportação em .DOCX é gerada com formatação limpa e profissional, incluindo cabeçalho, oradores destacados e marcações temporais. Basta copiar os trechos fáticos ou o documento integral e colar diretamente na sua peça processual no formato padrão dos tribunais.",
  },
  {
    q: "Quanto tempo leva para degravar uma audiência completa de 1 a 2 horas?",
    a: "Nossa infraestrutura com aceleração por IA processa arquivos em uma velocidade média de 10x a 15x mais rápida que o tempo real. Uma audiência de 60 minutos é transcrita com pontuação em cerca de 3 a 5 minutos. Uma audiência longa de 2 horas fica pronta em aproximadamente 8 minutos, sem travar seu computador.",
  },
];

export default function LegalInteractiveView() {
  // Demo player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [playbackSeconds, setPlaybackSeconds] = useState(1);
  const [copiedDemo, setCopiedDemo] = useState(false);

  // Use case tabs
  const [activeUseCase, setActiveUseCase] = useState(0);

  // Pricing mode: default to "anual" as requested!
  const [pricingMode, setPricingMode] = useState<"anual" | "avulso">("anual");

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Playback timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const next = prev + 1;
          if (next > 30) {
            setIsPlaying(false);
            return 1;
          }
          const foundIdx = SAMPLE_HEARING.findIndex(
            (line, idx) =>
              next >= line.seconds &&
              (idx === SAMPLE_HEARING.length - 1 || next < SAMPLE_HEARING[idx + 1].seconds)
          );
          if (foundIdx !== -1) {
            setCurrentLineIndex(foundIdx);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectLine = (index: number) => {
    setCurrentLineIndex(index);
    setPlaybackSeconds(SAMPLE_HEARING[index].seconds);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCopyTranscript = () => {
    const textToCopy = SAMPLE_HEARING.map(
      (l) => `[${l.time}] ${l.role} (${l.speaker}): ${l.text}`
    ).join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2500);
  };

  const handleDownloadDocxMock = () => {
    const textToSave =
      "TERMO DE DEGRAVAÇÃO DE AUDIÊNCIA JUDICIAL\n\nPROCESSO: 0001234-56.2024.5.02.0000\nAUTOS: AÇÃO TRABALHISTA - RITO ORDINÁRIO\n\n" +
      SAMPLE_HEARING.map(
        (l) => `[${l.time}] ${l.role.toUpperCase()} (${l.speaker}):\n${l.text}\n`
      ).join("\n");
    const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Degravacao_Audiencia_Exemplo_Peguei_o_Texto.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Combine free plan as first column with the active tier plans
  const currentPricingPlans = [
    FREE_PLAN,
    ...(pricingMode === "anual" ? ANNUAL_PLANS : PACKAGES),
  ];

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "hidden" }}>
      {/* AURORA LIGHTING EFFECTS (CLINT SIGNATURE) */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb-center" />
        <div className="aurora-orb-left" />
        <div className="aurora-orb-right" />
        <div className="aurora-beam" />
        <div className="aurora-beam-2" />
      </div>
      <div className="bg-grid-overlay" aria-hidden="true" />

      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "90px",
          paddingBottom: "60px",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          {/* Trust Authority Pill */}
          <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "22px" }}>
            <span
              className="badge-pill"
              style={{
                borderColor: "rgba(167, 139, 250, 0.35)",
                background: "rgba(124, 58, 237, 0.12)",
                boxShadow: "0 0 25px rgba(124, 58, 237, 0.2)",
              }}
            >
              <span className="pill-dot" style={{ background: "#10B981" }} />
              <Scale size={15} style={{ color: "#A78BFA" }} />
              <span>Solução Especializada para Advogados & Escritórios • LGPD Compliant</span>
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "clamp(2.3rem, 5.2vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.14,
              letterSpacing: "-0.03em",
              marginBottom: "22px",
              color: "#FFFFFF",
            }}
          >
            Degravação de audiências e oitivas <br />
            <span
              style={{
                background: "linear-gradient(110deg, #FFFFFF 15%, #C4A4FF 50%, #67E8F9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              com IA, oradores e timestamps em minutos
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "var(--text-muted, #9E96B3)",
              maxWidth: 780,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            Elimine as horas exaustivas de transcrição manual de depoimentos judiciais.
            Converta gravações do <strong>PJe Mídias</strong>, <strong>Zoom</strong> e{" "}
            <strong>Teams</strong> em texto com <strong>fidelidade gramatical</strong>,{" "}
            <strong>identificação de oradores</strong> e exportação direta para{" "}
            <strong>Word (.DOCX)</strong> para juntar às suas petições.
          </p>

          {/* Trust Value Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "38px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#E2D9F3" }}>
              <ShieldCheck size={18} color="#10B981" />
              <span>Sigilo absoluto (deleção permanente pós-transcrição)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#E2D9F3" }}>
              <Zap size={18} color="#67E8F9" />
              <span>10× mais rápido que degravação humana</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#E2D9F3" }}>
              <Award size={18} color="#F59E0B" />
              <span>5 minutos grátis imediatos no cadastro</span>
            </div>
          </div>

          {/* Transcribe Form Integration */}
          <div style={{ maxWidth: 860, margin: "0 auto 48px", position: "relative" }}>
            <TranscribeForm initialPlaceholder="Cole o link do PJe Mídias, gravação do Zoom/Teams ou envie MP4, MP3, WAV, M4A..." />
          </div>

          {/* Quick CTA Sub-text */}
          <p style={{ fontSize: "13px", color: "var(--text-dim, #6B6382)", marginTop: "-20px" }}>
            Sem necessidade de cartão de crédito. Seus arquivos são processados com isolamento e criptografia.
          </p>
        </div>
      </section>

      {/* COMPATIBILITY STRIP */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "24px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(12, 8, 20, 0.65)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "36px",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#A78BFA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Compatível com o Ecossistema Forense:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                🏛️ PJe Mídias (CNJ)
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                🎥 Zoom Audiências
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                💻 Microsoft Teams
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                🎙️ Gravadores Sony / Olympus
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                📱 WhatsApp (.opus / .ogg)
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", display: "flex", alignItems: "center", gap: "6px" }}>
                📄 Word (.DOCX) & PDF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE HEARING MOCKUP */}
      <section style={{ position: "relative", zIndex: 2, padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                color: "#67E8F9",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Demonstração ao Vivo
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                marginBottom: "14px",
                color: "#FFFFFF",
              }}
            >
              Veja como uma audiência real fica transcrita
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", maxWidth: 650, margin: "0 auto" }}>
              Clique nas falas para ouvir o áudio simulado ou aperte o Play. Teste a separação por oradores,
              marcação temporal e a facilidade de cópia para petições.
            </p>
          </div>

          {/* Interactive Player Card */}
          <div
            className="clint-card"
            style={{
              padding: "28px",
              borderRadius: "20px",
              background: "linear-gradient(rgba(14, 9, 24, 0.85), rgba(11, 7, 20, 0.92))",
              border: "1px solid rgba(167, 139, 250, 0.25)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(124, 58, 237, 0.15)",
            }}
          >
            {/* Player Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                paddingBottom: "20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? "Pausar audiência" : "Reproduzir audiência"}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "none",
                    background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
                    transition: "transform 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: "2px" }} />}
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>
                      audiencia_instrucao_0001234.mp4
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: "rgba(16, 185, 129, 0.18)",
                        color: "#10B981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      PJe Mídias
                    </span>
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--text-muted, #9E96B3)" }}>
                    Diarização ativa: 4 Oradores identificados • 99.4% precisão
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleCopyTranscript}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: copiedDemo ? "#10B981" : "#E2D9F3",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {copiedDemo ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedDemo ? "Copiado para Petição!" : "Copiar com Timestamps"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDocxMock}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    color: "#93C5FD",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Download size={15} />
                  <span>Baixar Modelo (.DOCX)</span>
                </button>
              </div>
            </div>

            {/* Audio Wave Timeline Bar */}
            <div style={{ margin: "20px 0 24px", position: "relative" }}>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setPlaybackSeconds(Math.max(1, Math.round(pct * 30)));
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (playbackSeconds / 30) * 100)}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #60A5FA, #7C3AED, #06B6D4)",
                    borderRadius: "4px",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "var(--text-dim, #6B6382)",
                  marginTop: "6px",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <span>
                  00:{playbackSeconds < 10 ? `0${playbackSeconds}` : playbackSeconds}
                </span>
                <span>00:30 (Trecho demonstrativo da audiência)</span>
              </div>
            </div>

            {/* Transcript Lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SAMPLE_HEARING.map((item, idx) => {
                const isActive = currentLineIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectLine(idx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      background: isActive
                        ? "rgba(124, 58, 237, 0.16)"
                        : "rgba(255, 255, 255, 0.02)",
                      border: isActive
                        ? "1px solid rgba(167, 139, 250, 0.45)"
                        : "1px solid rgba(255, 255, 255, 0.04)",
                      boxShadow: isActive ? "0 4px 20px rgba(124, 58, 237, 0.2)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Timestamp & Speaker Badge */}
                    <div style={{ minWidth: "140px", flexShrink: 0 }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          background: item.roleBg,
                          border: `1px solid ${item.roleColor}40`,
                          fontSize: "12px",
                          fontWeight: 700,
                          color: item.roleColor,
                          marginBottom: "4px",
                        }}
                      >
                        <span>{item.avatarText}</span>
                        <span>{item.role}</span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: isActive ? "#A78BFA" : "var(--text-dim, #6B6382)",
                          fontFamily: "var(--font-mono, monospace)",
                          fontWeight: 600,
                        }}
                      >
                        [{item.time}]
                      </div>
                    </div>

                    {/* Dialogue Text */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.6)",
                          marginBottom: "3px",
                          fontWeight: 500,
                        }}
                      >
                        {item.speaker}
                      </div>
                      <p
                        style={{
                          fontSize: "14.5px",
                          lineHeight: 1.55,
                          color: isActive ? "#FFFFFF" : "var(--text-muted, #D1CADF)",
                          fontWeight: isActive ? 600 : 400,
                          margin: 0,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>

                    {/* Play/Jump Icon */}
                    <div style={{ alignSelf: "center", color: isActive ? "#A78BFA" : "rgba(255, 255, 255, 0.2)" }}>
                      <Headphones size={16} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom note */}
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                fontSize: "13px",
                color: "var(--text-muted, #9E96B3)",
              }}
            >
              <span>
                💡 <strong>Dica Processual:</strong> Basta clicar e copiar as falas com os minutos exatos para fundamentar contradições em sede de Alegações Finais ou Apelação.
              </span>
              <Link
                href="/login?signup=true"
                style={{
                  color: "#67E8F9",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none",
                }}
              >
                Degravar áudio real agora <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "80px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(10, 6, 18, 0.4)",
        }}
      >
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                color: "#A78BFA",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Celeridade Processual
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Como degravar audiências em 3 passos
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", marginTop: "8px" }}>
              Do arquivo bruto à citação perfeita na petição em menos de 5 minutos
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {/* Step 1 */}
            <div
              className="clint-card"
              style={{
                padding: "32px 28px",
                borderRadius: "18px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "rgba(255, 255, 255, 0.06)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                01
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: "#60A5FA",
                }}
              >
                <Scale size={24} />
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "12px", color: "#FFFFFF" }}>
                1. Envie a Gravação
              </h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6, flex: 1 }}>
                Faça upload do arquivo baixado do <strong>PJe Mídias</strong>, gravação do <strong>Zoom</strong>,{" "}
                <strong>Teams</strong>, <strong>Google Meet</strong> ou áudio do gravador de voz. Suporte a vídeos e áudios de até 3 horas.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="clint-card"
              style={{
                padding: "32px 28px",
                borderRadius: "18px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "rgba(255, 255, 255, 0.06)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                02
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(124, 58, 237, 0.15)",
                  border: "1px solid rgba(167, 139, 250, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: "#A78BFA",
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "12px", color: "#FFFFFF" }}>
                2. IA Jurídica Degrava
              </h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6, flex: 1 }}>
                Nossa IA processa o diálogo aplicando gramática jurídica, separando os oradores (Juiz, Partes, Testemunhas) e inserindo marcações de tempo sincronizadas automaticamente.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="clint-card"
              style={{
                padding: "32px 28px",
                borderRadius: "18px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "rgba(255, 255, 255, 0.06)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                03
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: "#10B981",
                }}
              >
                <Download size={24} />
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: 700, marginBottom: "12px", color: "#FFFFFF" }}>
                3. Junte Direto na Peça
              </h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6, flex: 1 }}>
                Exporte o texto formatado para <strong>Word (.DOCX)</strong> ou <strong>PDF</strong> com timestamps prontos para fundamentar suas petições iniciais, contestações e recursos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORENSIC ROUTINE BENTO FEATURES */}
      <section style={{ position: "relative", zIndex: 2, padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span
              style={{
                color: "#67E8F9",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Projetado para Escritórios
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Funcionalidades que transformam a rotina jurídica
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", marginTop: "8px" }}>
              Rigor técnico, velocidade extrema e segurança para quem não pode perder prazos processuais.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Feature 1 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(124, 58, 237, 0.15)",
                  color: "#A78BFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Users size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                Identificação de Oradores (Diarização)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Nossa IA distingue automaticamente as vozes do magistrado, advogados, partes e testemunhas. Essencial para elaborar atas de audiência minuciosas e sem ambiguidades.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60A5FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                Exportação Direta para Word (.DOCX)
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Baixe o arquivo com formatação limpa, parágrafos recuados e timestamps para integrar imediatamente às suas peças sem perder tempo reformatando textos desajustados.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                1 Hora de Audiência em ~3 Minutos
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Enquanto a degravação manual por estagiários leva de 4 a 8 horas, o Peguei o Texto entrega o texto completo em minutos. Audiência de manhã, peça pronta à tarde.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(236, 72, 153, 0.15)",
                  color: "#F472B6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                Sigilo Absoluto & Deleção Imediata
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Respeito rigoroso ao dever de sigilo do Estatuto da Advocacia e à LGPD. Seus arquivos de áudio são criptografados e excluídos permanentemente logo após a transcrição.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#FBBF24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Award size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                Português Jurídico & Jargão Forense
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Modelos afinados com termos forenses brasileiros (ex: *de cujus*, *in dubio pro reo*, *preclusão consumativa*, *contradita*, *embargos declaratórios*), evitando erros bizarros.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="clint-card" style={{ padding: "28px", borderRadius: "16px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "rgba(6, 182, 212, 0.15)",
                  color: "#67E8F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Headphones size={20} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "10px" }}>
                Player Sincronizado para Conferência
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6 }}>
                Dúvida em uma palavra crucial da oitiva? Clique em qualquer trecho do texto e o player salta imediatamente para o segundo exato do áudio para você tirar a teima.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE: TRADICIONAL VS PEGUEI O TEXTO */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "80px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(8, 5, 14, 0.5)",
        }}
      >
        <div className="container" style={{ maxWidth: 1040, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                color: "#F59E0B",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Análise Comparativa de Custos
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Chega de pagar caro ou perder horas com degravação
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", marginTop: "8px" }}>
              Compare o custo real por audiência e o tempo de entrega entre os dois métodos:
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
            }}
          >
            {/* Degravação Manual / Terceirizada */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "20px",
                padding: "32px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#EF4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  ✕
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#EF4444" }}>
                  Degravação Manual / Terceirizada
                </h3>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", marginBottom: "24px" }}>
                Método tradicional moroso com custo elevado e risco de vazamento
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)" }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                  <span>
                    <strong>R$ 150 a R$ 300 por audiência de 1 hora</strong> cobrados por profissionais terceirizados
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)" }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                  <span><strong>Prazo de 24h a 72h úteis</strong> (inviável para prazos fatais de agravo ou contestação)</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)" }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                  <span><strong>Risco de vazamento de dados sensíveis</strong> ao repassar áudios a terceiros</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)" }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                  <span>Formatação inconsistente sem marcação exata de timestamps</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "rgba(255, 255, 255, 0.75)" }}>
                  <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                  <span>Correções e ajustes exigem retrabalho demorado</span>
                </div>
              </div>
            </div>

            {/* Peguei o Texto com IA */}
            <div
              className="clint-card"
              style={{
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid rgba(167, 139, 250, 0.45)",
                background: "linear-gradient(rgba(20, 13, 33, 0.9), rgba(14, 9, 24, 0.95))",
                boxShadow: "0 20px 50px rgba(124, 58, 237, 0.25)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "24px",
                  padding: "4px 14px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Recomendado para Advocacia
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF" }}>
                  Peguei o Texto com IA Jurídica
                </h3>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #9E96B3)", marginBottom: "24px" }}>
                Agilidade, máxima economia e controle total na ponta dos seus dedos
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "#FFFFFF" }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>
                  <span>
                    <strong>1 hora de audiência sai por menos de R$ 2,97</strong>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "#FFFFFF" }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>
                  <span><strong>Audiência de 1 hora pronta em 3 a 5 minutos</strong> (disponível 24 horas por dia)</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "#FFFFFF" }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>
                  <span><strong>Sigilo profissional e deleção permanente</strong> em servidores seguros</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "#FFFFFF" }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>
                  <span><strong>Exportação direta para Word (.DOCX)</strong> com formatação forense e timestamps</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px", color: "#FFFFFF" }}>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>✓</span>
                  <span><strong>Player sincronizado:</strong> clique no texto e ouça a gravação no segundo exato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS USE CASES TABS */}
      <section style={{ position: "relative", zIndex: 2, padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                color: "#A78BFA",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Especialidades Jurídicas
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Como os advogados usam o Peguei o Texto
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", marginTop: "8px" }}>
              Cenários de uso do áudio bruto do tribunal até a petição pronta para protocolo
            </p>
          </div>

          {/* Area Tabs Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "36px",
            }}
          >
            {USE_CASES.map((uc, idx) => {
              const isSelected = activeUseCase === idx;
              return (
                <button
                  key={uc.id}
                  type="button"
                  onClick={() => setActiveUseCase(idx)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: isSelected
                      ? "1px solid rgba(167, 139, 250, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(79, 70, 229, 0.25))"
                      : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#FFFFFF" : "var(--text-muted, #9E96B3)",
                    boxShadow: isSelected ? "0 4px 20px rgba(124, 58, 237, 0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {uc.title}
                </button>
              );
            })}
          </div>

          {/* Tab Content Card */}
          {USE_CASES[activeUseCase] && (
            <div
              className="clint-card"
              style={{
                padding: "36px",
                borderRadius: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "36px",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: "rgba(124, 58, 237, 0.2)",
                      color: "#C4A4FF",
                      border: "1px solid rgba(124, 58, 237, 0.4)",
                    }}
                  >
                    {USE_CASES[activeUseCase].badge}
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--text-dim, #6B6382)", fontWeight: 500 }}>
                    {USE_CASES[activeUseCase].subtitle}
                  </span>
                </div>

                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
                  {USE_CASES[activeUseCase].title}
                </h3>

                <p style={{ fontSize: "15px", color: "var(--text-muted, #9E96B3)", lineHeight: 1.6, marginBottom: "22px" }}>
                  {USE_CASES[activeUseCase].description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {USE_CASES[activeUseCase].bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#E2D9F3" }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Quote Box */}
              <div
                style={{
                  background: "rgba(6, 3, 9, 0.7)",
                  border: "1px solid rgba(167, 139, 250, 0.2)",
                  borderRadius: "14px",
                  padding: "24px",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 700, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileCheck2 size={16} /> Trecho Formatado Pronto para Citação na Peça
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    color: "rgba(255, 255, 255, 0.85)",
                    fontFamily: "var(--font-sans, sans-serif)",
                    background: "rgba(255, 255, 255, 0.03)",
                    padding: "16px",
                    borderRadius: "8px",
                    borderLeft: "3px solid #7C3AED",
                  }}
                >
                  {USE_CASES[activeUseCase].sampleQuote}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
                  <Link
                    href="/login?signup=true"
                    className="btn-primary"
                    style={{
                      padding: "10px 20px",
                      fontSize: "13px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Degravar caso similar grátis <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRICING PLANS SECTION (PEGUEI O TEXTO MODEL) */}
      <section
        id="precos"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "90px 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(10, 6, 18, 0.5)",
        }}
      >
        <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                color: "#10B981",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Preços Transparentes em Reais
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Escolha como prefere transcrever
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "16px", marginTop: "8px", maxWidth: 680, margin: "8px auto 0" }}>
              Sem surpresas cambiais e sem contratos que prendem seu escritório. 
              Comece com <strong>5 minutos grátis imediatos</strong> para testar na prática.
            </p>

            {/* Toggle: Planos Anuais (EM DESTAQUE) vs Pacotes Avulsos */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                padding: "6px",
                borderRadius: "14px",
                border: "1px solid rgba(167, 139, 250, 0.3)",
                boxShadow: "0 4px 20px rgba(124, 58, 237, 0.15)",
                marginTop: "28px",
              }}
            >
              <button
                type="button"
                onClick={() => setPricingMode("anual")}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: pricingMode === "anual" ? "linear-gradient(135deg, #8B5CF6, #7C3AED)" : "transparent",
                  color: pricingMode === "anual" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                  boxShadow: pricingMode === "anual" ? "0 2px 14px rgba(124, 58, 237, 0.4)" : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⭐ Planos Anuais Recorrentes</span>
                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.25)",
                    color: "#10B981",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  3 meses grátis
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPricingMode("avulso")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: pricingMode === "avulso" ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "transparent",
                  color: pricingMode === "avulso" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                  boxShadow: pricingMode === "avulso" ? "0 2px 14px rgba(124, 58, 237, 0.4)" : "none",
                  transition: "all 0.2s",
                }}
              >
                Pacotes Avulsos (Sem Mensalidade)
              </button>
            </div>
          </div>

          {/* Pricing Grid (4 Columns: Começar Grátis + 3 Tiers) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {currentPricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="clint-card"
                style={{
                  borderRadius: "20px",
                  padding: "32px 18px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: plan.popular
                    ? "1px solid rgba(167, 139, 250, 0.6)"
                    : plan.id === "free"
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  background: plan.popular
                    ? "linear-gradient(rgba(22, 14, 38, 0.95), rgba(14, 9, 24, 0.98))"
                    : plan.id === "free"
                    ? "linear-gradient(rgba(10, 24, 18, 0.75), rgba(11, 7, 20, 0.85))"
                    : "linear-gradient(rgba(14, 9, 24, 0.75), rgba(11, 7, 20, 0.85))",
                  boxShadow: plan.popular
                    ? "0 25px 60px rgba(124, 58, 237, 0.35), 0 0 25px rgba(124, 58, 237, 0.2)"
                    : "none",
                }}
              >
                {/* Top Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "20px",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: plan.popular
                        ? "linear-gradient(135deg, #8B5CF6, #7C3AED)"
                        : plan.id === "free"
                        ? "linear-gradient(135deg, #10B981, #059669)"
                        : "rgba(255, 255, 255, 0.12)",
                      color: "#FFFFFF",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#FFFFFF", marginBottom: "6px" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #9E96B3)", minHeight: "36px", lineHeight: 1.4 }}>
                    {plan.desc}
                  </p>
                </div>

                {/* Price Display (R$ guaranteed on same line as number) */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "rgba(255, 255, 255, 0.75)",
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                      }}
                    >
                      {plan.currency}
                    </span>
                    <span
                      style={{
                        fontSize: "38px",
                        fontWeight: 900,
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {plan.numericPrice}
                    </span>
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: "var(--text-dim, #9E96B3)",
                        whiteSpace: "nowrap",
                        marginLeft: "2px",
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {plan.billingNote && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-dim, #6B6382)",
                        marginTop: "4px",
                      }}
                    >
                      {plan.billingNote}
                    </div>
                  )}

                  {/* Quadro essencial de capacidade */}
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "6px 8px",
                      borderRadius: "8px",
                      background: plan.id === "free" ? "rgba(16, 185, 129, 0.12)" : "rgba(124, 58, 237, 0.12)",
                      border: plan.id === "free" ? "1px solid rgba(16, 185, 129, 0.28)" : "1px solid rgba(167, 139, 250, 0.25)",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: plan.id === "free" ? "#10B981" : "#C4A4FF",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>⚡</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {plan.capacityText}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13.5px", color: "rgba(255, 255, 255, 0.85)" }}>
                      <CheckCircle2 size={15} color={plan.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.href}
                  className={plan.popular ? "btn-primary" : "btn-secondary"}
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background:
                      plan.id === "free"
                        ? "rgba(16, 185, 129, 0.18)"
                        : plan.popular
                        ? undefined
                        : "rgba(255, 255, 255, 0.05)",
                    border:
                      plan.id === "free"
                        ? "1px solid rgba(16, 185, 129, 0.4)"
                        : undefined,
                    color: plan.id === "free" ? "#10B981" : undefined,
                  }}
                >
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div
            style={{
              marginTop: "48px",
              padding: "24px",
              borderRadius: "16px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <ShieldCheck size={28} color="#10B981" />
            <div>
              <strong style={{ color: "#FFFFFF", fontSize: "15px" }}>
                Garantia Incondicional de Satisfação:
              </strong>{" "}
              <span style={{ color: "var(--text-muted, #9E96B3)", fontSize: "14px" }}>
                Comece com 5 minutos grátis imediatos. Se adquirir um pacote e não ficar satisfeito com a precisão jurídica, devolvemos 100% do seu valor em até 7 dias.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ position: "relative", zIndex: 2, padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                color: "#60A5FA",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Segurança & Aspectos Jurídicos
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 800,
                marginTop: "10px",
                color: "#FFFFFF",
              }}
            >
              Perguntas Frequentes sobre Degravação com IA
            </h2>
            <p style={{ color: "var(--text-muted, #9E96B3)", fontSize: "15px", marginTop: "8px" }}>
              Tire todas as dúvidas sobre validade, sigilo profissional e rotina processual.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="clint-card"
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: isOpen
                      ? "1px solid rgba(167, 139, 250, 0.45)"
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: "#FFFFFF",
                    }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        color: isOpen ? "#A78BFA" : "var(--text-dim, #6B6382)",
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 24px 22px",
                        fontSize: "14.5px",
                        lineHeight: 1.65,
                        color: "var(--text-muted, #D1CADF)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                        paddingTop: "16px",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL GLOWING CTA BANNER */}
      <section style={{ position: "relative", zIndex: 2, padding: "90px 0 110px" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
          <div
            className="clint-card"
            style={{
              padding: "50px 36px",
              borderRadius: "24px",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(30, 18, 54, 0.85) 0%, rgba(14, 9, 24, 0.95) 100%)",
              border: "1px solid rgba(167, 139, 250, 0.4)",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(124, 58, 237, 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 14px",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#10B981",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              <Sparkles size={14} /> Comece em menos de 2 minutos
            </div>

            <h2
              style={{
                fontSize: "clamp(2rem, 4.2vw, 3rem)",
                fontWeight: 900,
                color: "#FFFFFF",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              Modernize a degravação do seu escritório hoje
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: "var(--text-muted, #9E96B3)",
                maxWidth: 620,
                margin: "0 auto 32px",
                lineHeight: 1.6,
              }}
            >
              Junte-se a advogados e bancas jurídicas que economizam dezenas de horas toda semana.
              Crie sua conta e receba <strong>5 minutos grátis imediatos</strong> para testar em uma audiência real.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <Link
                href="/login?signup=true"
                className="btn-primary"
                style={{
                  padding: "16px 36px",
                  fontSize: "16px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                Degravar Primeira Audiência Grátis <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-dim, #6B6382)" }}>
              <span>✓ Sem cartão de crédito</span>
              <span>✓ Suporte a PJe Mídias</span>
              <span>✓ Arquivos deletados com sigilo</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
