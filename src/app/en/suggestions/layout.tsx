import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Feedback or Suggestions | Peguei o Texto",
  description: "Share your feature ideas, AI accuracy feedback, or report technical bugs directly to the Peguei o Texto product team.",
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/suggestions",
    languages: {
      "en": "https://pegueiotexto.com.br/en/suggestions",
      "pt-BR": "https://pegueiotexto.com.br/sugestoes",
      "x-default": "https://pegueiotexto.com.br/en/suggestions",
    },
  },
  openGraph: {
    title: "Submit Feedback or Suggestions | Peguei o Texto",
    description: "Share your feature ideas, AI accuracy feedback, or report technical bugs directly to the Peguei o Texto product team.",
    url: "https://pegueiotexto.com.br/en/suggestions",
    siteName: "Peguei o Texto",
    locale: "en_US",
    type: "website",
  },
};

export default function SuggestionsEnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
