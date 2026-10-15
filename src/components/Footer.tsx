"use client";
import Link from "next/link";
import { Mic2 } from "lucide-react";

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const footerLinks = {
  "Produto": [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Preços", href: "/precos" },
    { label: "API para devs", href: "#api" },
    { label: "Changelog", href: "#changelog" },
  ],
  "Plataformas": [
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Vimeo", href: "#" },
  ],
  "Empresa": [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Termos de uso", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "16px" }}>
              <div style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Mic2 size={18} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Peguei o <span className="text-gradient">Texto</span>
              </span>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.7", maxWidth: "280px", marginBottom: "24px" }}>
              Transcrição de vídeos e áudios com IA. Rápido, preciso e com privacidade garantida.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { icon: <TwitterIcon />, href: "#" },
                { icon: <InstagramIcon />, href: "#" },
                { icon: <LinkedinIcon />, href: "#" },
              ].map((social, i) => (
                <a key={i} href={social.href} className="btn-ghost" style={{ padding: "8px", borderRadius: "8px" }}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                {category}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Peguei o Texto. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacidade", "Termos", "Cookies"].map((item) => (
              <a key={item} href="#" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
