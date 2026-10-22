"use client";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  "Produto": [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Preços", href: "/precos" },
    { label: "Programa de Afiliados", href: "/afiliados" },
  ],
  "Plataformas": [
    { label: "Áudios do WhatsApp", href: "/transcrever-whatsapp" },
    { label: "YouTube Transcrição", href: "/transcrever-youtube" },
    { label: "TikTok Transcrição", href: "/transcrever-tiktok" },
    { label: "Instagram Reels", href: "/transcrever-instagram" },
    { label: "Converter MP3 em Texto", href: "/converter-mp3-em-texto" },
    { label: "Gerador de Legendas (.SRT)", href: "/gerar-legendas-srt" },
  ],
  "Empresa": [
    { label: "Sobre nós", href: "/sobre-nos" },
    { label: "Blog", href: "#" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos de uso", href: "/termos-de-uso", target: "_blank" },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "16px" }}>
              <Image
                src="/logo.png"
                alt="Peguei o Texto"
                width={130}
                height={60}
                style={{ height: "42px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.7", maxWidth: "280px" }}>
              Transcrição de vídeos e áudios com IA. Rápido, preciso e com privacidade garantida.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                {category}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((link: any) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.target}
                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
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
            <Link href="/privacidade" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
              Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}
            >
              Termos de uso
            </Link>
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
