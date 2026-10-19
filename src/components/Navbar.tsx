"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Plataformas", href: "#plataformas" },
  { label: "Preços", href: "/precos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    window.location.href = "/";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden-mobile">
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

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hidden-mobile">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px", textDecoration: "none" }}>
                  Meu Painel
                </Link>
                <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: "13px" }}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Entrar</Link>
                <Link href="/login" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px", textDecoration: "none" }}>
                  Começar grátis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="btn-ghost show-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
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
                  Meu Painel
                </Link>
                <button onClick={handleLogout} className="btn-ghost" style={{ textAlign: "center" }}>
                  Sair da conta
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>Entrar</Link>
                <Link href="/login" className="btn-primary" style={{ textAlign: "center", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  Começar grátis
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
