import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envie sua Sugestão ou Melhoria | Peguei o Texto",
  description: "Compartilhe suas ideias de recursos, melhorias na IA ou relate problemas diretamente para a equipe do Peguei o Texto.",
  alternates: {
    canonical: "https://pegueiotexto.com.br/sugestoes",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/sugestoes",
      "en": "https://pegueiotexto.com.br/en/suggestions",
      "x-default": "https://pegueiotexto.com.br/en/suggestions",
    },
  },
  openGraph: {
    title: "Envie sua Sugestão ou Melhoria | Peguei o Texto",
    description: "Compartilhe suas ideias de recursos, melhorias na IA ou relate problemas diretamente para a equipe do Peguei o Texto.",
    url: "https://pegueiotexto.com.br/sugestoes",
    siteName: "Peguei o Texto",
    locale: "pt_BR",
    type: "website",
  },
};

export default function SugestoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
