import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel do Usuário | Peguei o Texto",
  description: "Gerencie suas transcrições, minutos de áudio e arquivos salvos no Peguei o Texto.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

