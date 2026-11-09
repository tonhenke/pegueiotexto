import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalInteractiveView from "./LegalInteractiveView";

export const metadata: Metadata = {
  title: "Transcrição Automática para Advogados — Depoimentos, Oitivas e Audiências com IA | Peguei o Texto",
  description:
    "Degrave audiências judiciais do PJe Mídias, oitivas e depoimentos em minutos com Inteligência Artificial. Identificação de oradores, timestamps para juntada aos autos, exportação em Word (.DOCX) e sigilo absoluto. Teste 5 minutos grátis!",
  keywords: [
    "transcricao de audiencias judiciais",
    "degravacao de audiencia",
    "transcricao automatica advogados",
    "transcrever depoimento judicial",
    "degravacao juridica com ia",
    "transcricao de audiencia trabalhista",
    "transcrever pericia judicial",
    "degravacao de audio pje midias",
    "transcricao juridica online gratis",
    "converter gravacao de audiencia em texto",
    "transcrever oitiva de testemunhas",
    "ia para advogados transcricao",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/transcricao-juridica",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcricao-juridica",
      "en": "https://pegueiotexto.com.br/en/legal-transcription",
      "x-default": "https://pegueiotexto.com.br/transcricao-juridica",
    },
  },
  openGraph: {
    title: "Transcrição Automática para Advogados — Audiências e Oitivas com IA | Peguei o Texto",
    description:
      "Elimine a transcrição manual no seu escritório. Converta áudios e vídeos de audiências judiciais em texto com timestamps e exportação Word (.DOCX). Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/transcricao-juridica",
    siteName: "Peguei o Texto",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Transcrição Automática para Advogados | Peguei o Texto",
    description:
      "Degravação de audiências, oitivas e perícias judiciais com IA. Timestamps, oradores e exportação DOCX.",
  },
};

const juridicoSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Peguei o Texto — Transcrição Jurídica com IA",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "url": "https://pegueiotexto.com.br/transcricao-juridica",
      "description":
        "Plataforma de inteligência artificial especializada na degravação de audiências judiciais, oitivas de testemunhas e reuniões forenses com identificação de oradores e exportação para Word e PDF.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
        "description": "5 minutos grátis para novos advogados no cadastro",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.95",
        "ratingCount": "890",
        "bestRating": "5",
        "worstRating": "1",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "A transcrição automática gerada por IA tem validade jurídica e pode ser juntada aos autos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. No Direito Processual brasileiro (art. 369 e 406 do CPC), as partes têm o direito de empregar todos os meios legais e moralmente legítimos para provar a verdade dos fatos. A transcrição atua como documento degravado para fundamentar petições iniciais, alegações finais e recursos. O sistema inclui marcações de tempo (timestamps), permitindo a conferência do minuto exato na mídia oficial do PJe.",
          },
        },
        {
          "@type": "Question",
          "name": "Como o Peguei o Texto garante o sigilo profissional, a LGPD e o segredo de justiça?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O sigilo da relação advogado-cliente (art. 7º, II do Estatuto da OAB) e a conformidade com a LGPD são assegurados por criptografia ponta a ponta (TLS 1.3 e AES-256) e deleção permanente dos arquivos temporários de áudio dos servidores logo após o processamento. Seus dados jamais são usados para treinar modelos de terceiros.",
          },
        },
        {
          "@type": "Question",
          "name": "O sistema aceita arquivos extraídos diretamente do PJe Mídias e gravações do Zoom / Teams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. O motor aceita arquivos de áudio e vídeo de até 3 horas de duração nos formatos MP4, MP3, WAV, M4A, OGG, OPUS (áudios de WhatsApp), bem como links de gravações.",
          },
        },
        {
          "@type": "Question",
          "name": "A IA identifica automaticamente quem está falando (Juiz, Advogado, Testemunha)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. A tecnologia aplica diarização inteligente de oradores, diferenciando os intervenientes e organizando as falas em parágrafos separados com indicação temporal.",
          },
        },
        {
          "@type": "Question",
          "name": "Posso exportar o texto formatado diretamente para o Microsoft Word (.DOCX)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. A exportação em .DOCX é gerada com formatação forense limpa, pronta para ser colada diretamente nas peças processuais.",
          },
        },
        {
          "@type": "Question",
          "name": "Quanto tempo leva para degravar uma audiência completa de 1 a 2 horas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A velocidade de processamento é de cerca de 10x a 15x mais rápida que o tempo real. Uma audiência de 1 hora é degravada em cerca de 3 a 5 minutos.",
          },
        },
      ],
    },
  ],
};

export default function TranscricaoJuridicaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base, #060309)", color: "var(--text-main, #FFFFFF)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(juridicoSchema) }}
      />

      <LegalInteractiveView />

      <Footer />
    </main>
  );
}
