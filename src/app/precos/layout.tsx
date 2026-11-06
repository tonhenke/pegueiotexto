import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos e Pacotes de Minutos de Transcrição | Peguei o Texto",
  description:
    "Recarregue minutos de transcrição com IA sem assinatura mensal obrigatória. Pacotes a partir de R$ 4,90 com validade permanente. Comece com 5 minutos grátis!",
  alternates: {
    canonical: "https://pegueiotexto.com.br/precos",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/precos",
      "en": "https://pegueiotexto.com.br/en/pricing",
      "x-default": "https://pegueiotexto.com.br/precos",
    },
  },
  openGraph: {
    title: "Planos e Preços de Transcrição | Peguei o Texto",
    description:
      "Pague apenas pelos minutos que usar. Pacotes de 60 a 1.000 minutos sem validade. Teste 5 minutos grátis!",
    url: "https://pegueiotexto.com.br/precos",
  },
};

export default function PrecosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

