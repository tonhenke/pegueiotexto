import { Metadata } from "next";
import AdminHub from "@/components/AdminHub";

export const metadata: Metadata = {
  title: "Painel de Administração | Peguei o Texto",
  description: "Gestão completa de usuários, planos ativos, compras e moderação de afiliados.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminHub initialTab="usuarios" />;
}
