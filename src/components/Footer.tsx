"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import FooterBadgeCarousel from "./FooterBadgeCarousel";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");

  const footerGroups = isEnglish
    ? [
        {
          title: "Tools & Transcription",
          links: [
            { label: "YouTube Transcription", href: "/en/transcribe-youtube" },
            { label: "Instagram Reels Transcription", href: "/en/transcribe-instagram" },
            { label: "TikTok Transcription", href: "/en/transcribe-tiktok" },
            { label: "WhatsApp Voice Notes", href: "/en/transcribe-whatsapp" },
            { label: "Subtitle Generator (.SRT)", href: "/en/generate-srt-subtitles" },
            { label: "Download Web Videos", href: "/en/download-video" },
            { label: "YouTube to MP3 Converter", href: "/en/youtube-to-mp3" },
          ],
        },
        {
          title: "Solutions & Formats",
          links: [
            { label: "Legal Transcription", href: "/en/legal-transcription" },
            { label: "Academic & Research", href: "/en/academic-transcription" },
            { label: "Meeting Notes", href: "/en/meeting-transcription" },
            { label: "Convert MP3 to Text", href: "/en/convert-mp3-to-text" },
            { label: "Convert MP4 to Text", href: "/en/convert-mp4-to-text" },
            { label: "Convert M4A to Text", href: "/en/convert-m4a-to-text" },
            { label: "Convert WAV to Text", href: "/en/convert-wav-to-text" },
          ],
        },
        {
          title: "Company & Support",
          links: [
            { label: "Blog & Guides", href: "/en/blog" },
            { label: "Pricing & Plans", href: "/en/pricing" },
            { label: "Affiliate Program", href: "/afiliados" },
            { label: "Feedback & Suggestions", href: "/sugestoes" },
            { label: "About Us", href: "/en/about-us" },
            { label: "Terms of Service", href: "/en/terms", target: "_blank" },
            { label: "Privacy Policy", href: "/en/privacy" },
          ],
        },
      ]
    : [
        {
          title: "Ferramentas",
          links: [
            { label: "Transcrever YouTube", href: "/transcrever-youtube" },
            { label: "Transcrever Reels", href: "/transcrever-instagram" },
            { label: "Transcrever TikTok", href: "/transcrever-tiktok" },
            { label: "Áudios do WhatsApp", href: "/transcrever-whatsapp" },
            { label: "Gerador de Legendas (.SRT)", href: "/gerar-legendas-srt" },
            { label: "Baixar Vídeos da Web", href: "/baixar-video" },
            { label: "YouTube para MP3", href: "/baixar-audio-youtube-mp3" },
          ],
        },
        {
          title: "Soluções & Formatos",
          links: [
            { label: "Degravação Jurídica", href: "/transcricao-juridica" },
            { label: "Pesquisa & TCC", href: "/transcricao-academica" },
            { label: "Atas de Reuniões", href: "/transcricao-de-reunioes" },
            { label: "Converter MP3 em Texto", href: "/converter-mp3-em-texto" },
            { label: "Converter MP4 em Texto", href: "/converter-mp4-em-texto" },
            { label: "Converter M4A em Texto", href: "/converter-m4a-em-texto" },
            { label: "Converter WAV em Texto", href: "/converter-wav-em-texto" },
          ],
        },
        {
          title: "Empresa & Ajuda",
          links: [
            { label: "Blog & Dicas", href: "/blog" },
            { label: "Preços & Planos", href: "/precos" },
            { label: "Programa de Afiliados", href: "/afiliados" },
            { label: "Sugestões & Melhorias", href: "/sugestoes" },
            { label: "Sobre nós", href: "/sobre-nos" },
            { label: "Termos de uso", href: "/termos-de-uso", target: "_blank" },
            { label: "Privacidade", href: "/privacidade" },
          ],
        },
      ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Contact */}
          <div>
            <Link href={isEnglish ? "/en" : "/"} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "16px" }}>
              <Image
                src="/logo.png"
                alt="Peguei o Texto"
                width={130}
                height={60}
                style={{ height: "40px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p className="footer-desc" style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.7", maxWidth: "300px", marginBottom: "16px" }}>
              {isEnglish
                ? "AI video and audio transcription in seconds. Fast, accurate, and with guaranteed privacy."
                : "Transcrição de vídeos e áudios com IA em segundos. Rápido, preciso e com privacidade total."}
            </p>
            <a
              href="mailto:contato@pegueiotexto.com.br"
              className="footer-email-highlight"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#A78BFA",
                textDecoration: "none",
                fontWeight: 600,
                padding: "8px 14px",
                background: "rgba(124, 58, 237, 0.12)",
                border: "1px solid rgba(167, 139, 250, 0.25)",
                borderRadius: "8px",
                marginBottom: "20px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124, 58, 237, 0.22)";
                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(124, 58, 237, 0.12)";
                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.25)";
              }}
            >
              ✉ contato@pegueiotexto.com.br
            </a>
          </div>

          {/* 3 Balanced Link Columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="footer-col-title" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                {group.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {group.links.map((link: any) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.target}
                    rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                    className="footer-link"
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

        {/* Rotating Badges Carousel (UniScribe style) */}
        <FooterBadgeCarousel label="FIND US ON" />

        {/* Bottom bar */}
        <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "24px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Peguei o Texto. {isEnglish ? "All rights reserved." : "Todos os direitos reservados."}
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/privacidade" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
              {isEnglish ? "Privacy" : "Privacidade"}
            </Link>
            <Link
              href="/termos-de-uso"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}
            >
              {isEnglish ? "Terms of use" : "Termos de uso"}
            </Link>
            <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
            <Link href="/" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
              🇧🇷 Português
            </Link>
            <Link href="/en" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
              🇺🇸 English
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
