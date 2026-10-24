"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isEnglish = pathname?.startsWith("/en");

  const navLinks = isEnglish
    ? [
        { label: "How it works", href: "/en#how-it-works" },
        { label: "Platforms", href: "/en#platforms" },
        { label: "Download Video", href: "/en/download-video" },
        { label: "Pricing", href: "/en/pricing" },
      ]
    : [
        { label: "Como funciona", href: "#como-funciona" },
        { label: "Plataformas", href: "#plataformas" },
        { label: "Baixar Vídeo", href: "/baixar-video" },
        { label: "Preços", href: "/precos" },
      ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data.user));

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        authListener.subscription.unsubscribe();
      };
    } catch (e) {
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = isEnglish ? "/en" : "/";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href={isEnglish ? "/en" : "/"} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="Peguei o Texto"
              width={120}
              height={56}
              priority
              style={{ height: "38px", width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="hidden-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA & Language */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden-mobile">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px", textDecoration: "none" }}>
                  {isEnglish ? "Dashboard" : "Meu Painel"}
                </Link>
                <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: "13px" }}>
                  {isEnglish ? "Logout" : "Sair"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">
                  {isEnglish ? "Log in" : "Entrar"}
                </Link>
                <Link href="/login" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px", textDecoration: "none" }}>
                  {isEnglish ? "Start free" : "Começar grátis"}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle & Language */}
          <div className="show-mobile" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LanguageSwitcher />
            <button
              className="btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            marginTop: "16px",
            padding: "20px",
            background: "rgba(13,12,35,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "16px", fontWeight: 500 }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider" />
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{ textAlign: "center", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  {isEnglish ? "Dashboard" : "Meu Painel"}
                </Link>
                <button onClick={handleLogout} className="btn-ghost" style={{ textAlign: "center" }}>
                  {isEnglish ? "Log out" : "Sair da conta"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  {isEnglish ? "Log in" : "Entrar"}
                </Link>
                <Link href="/login" className="btn-primary" style={{ textAlign: "center", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  {isEnglish ? "Start free" : "Começar grátis"}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
