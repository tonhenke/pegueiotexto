import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard | Peguei o Texto",
  description: "Manage your audio transcriptions, minutes balance, and saved documents on Peguei o Texto.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnglishDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

