import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pegueiotexto.com.br"),
  title: {
    default: "Peguei o Texto: Transcrição de Vídeos do YouTube, Instagram e TikTok com IA",
    template: "%s | Peguei o Texto",
  },
  description:
    "Transcreva qualquer vídeo do YouTube, Instagram Reels, TikTok, Vimeo ou arquivo em texto em segundos com IA Whisper. 98% de precisão em português. 5 minutos grátis!",
  keywords: [
    "transcrever video",
    "transcrever video do youtube",
    "transcrever audio em texto",
    "transcrição de video gratis",
    "transcrever reels instagram",
    "transcrever tiktok",
    "gerar legendas srt",
    "converter video em texto",
    "whisper ia portugues",
    "ia transcrição",
    "peguei o texto"
  ],
  authors: [{ name: "Peguei o Texto", url: "https://pegueiotexto.com.br" }],
  creator: "Peguei o Texto",
  publisher: "Peguei o Texto",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://pegueiotexto.com.br",
  },
  openGraph: {
    title: "Peguei o Texto: Transcrição de Vídeos em Segundos com IA",
    description: "Cole o link de qualquer vídeo da internet e receba a transcrição e legendas (.SRT) prontas em segundos. 5 minutos grátis!",
    url: "https://pegueiotexto.com.br",
    siteName: "Peguei o Texto",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peguei o Texto: Transcrição de Vídeos em Segundos",
    description: "Cole o link. Pegue o texto. Transcreva YouTube, TikTok, Instagram e áudios com IA.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Peguei o Texto",
      "url": "https://pegueiotexto.com.br",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "description":
        "Transcreva vídeos do YouTube, Instagram, TikTok e áudios em segundos usando Inteligência Artificial Whisper com 98% de precisão em português.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL",
        "description": "5 minutos grátis no cadastro para testar",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como transcrever um vídeo do YouTube ou internet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basta copiar o link do vídeo (YouTube, Instagram Reels, TikTok, Vimeo), colar no Peguei o Texto e clicar em 'Transcrever'. O texto completo e legendas (.SRT) são gerados em segundos.",
          },
        },
        {
          "@type": "Question",
          "name": "Minha privacidade está segura? O vídeo é deletado?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Totalmente segura e em conformidade com a LGPD. Todos os arquivos temporários de áudio são permanentemente excluídos dos servidores imediatamente após a transcrição.",
          },
        },
        {
          "@type": "Question",
          "name": "Posso testar gratuitamente?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim! Novos usuários recebem 5 minutos de transcrição gratuita automaticamente ao criar sua conta, sem necessidade de cartão de crédito.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-7YWGQ5XSXY"} />
      </body>
    </html>
  );
}
