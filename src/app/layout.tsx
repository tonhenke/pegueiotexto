import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peguei o Texto — Transcrição de Vídeos em Segundos",
  description:
    "Cole o link de qualquer vídeo do YouTube, Instagram, TikTok ou Vimeo e receba a transcrição completa em segundos. Privacidade garantida: sua mídia é deletada após o download.",
  keywords: ["transcrição", "vídeo", "YouTube", "Instagram", "TikTok", "áudio", "texto", "legendas"],
  authors: [{ name: "Peguei o Texto" }],
  openGraph: {
    title: "Peguei o Texto — Transcrição de Vídeos em Segundos",
    description: "Cole o link. Pegue o texto. Simples assim.",
    type: "website",
    locale: "pt_BR",
  },
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
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
