import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | Peguei o Texto",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
