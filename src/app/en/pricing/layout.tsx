import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Top-up Minute Plans | Peguei o Texto",
  description:
    "Transparent pay-as-you-go minute packages for AI video and audio transcription. No recurring subscriptions, starting at $0.99. 5 free minutes on signup!",
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/pricing",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/precos",
      "en": "https://pegueiotexto.com.br/en/pricing",
      "x-default": "https://pegueiotexto.com.br/en/pricing",
    },
  },
  openGraph: {
    title: "Pricing & Top-up Minute Plans | Peguei o Texto",
    description:
      "Pay only for what you transcribe. Top-up packs from 60 to 1,000 minutes with no expiration date. Try 5 minutes free!",
    url: "https://pegueiotexto.com.br/en/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
