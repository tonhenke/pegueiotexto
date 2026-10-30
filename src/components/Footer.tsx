"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");

  const footerLinks = isEnglish
    ? {
        "Solutions": [
          { label: "Legal Transcription", href: "/transcricao-juridica" },
          { label: "Academic & Research", href: "/transcricao-academica" },
          { label: "Meeting Notes", href: "/transcricao-de-reunioes" },
          { label: "Subtitle Generator (.SRT)", href: "/gerar-legendas-srt" },
          { label: "Download Web Videos", href: "/en/download-video" },
        ],
        "Download Media": [
          { label: "Download YouTube Video", href: "/baixar-video-youtube" },
          { label: "TikTok No Watermark", href: "/baixar-video-tiktok" },
          { label: "Instagram Reels Downloader", href: "/baixar-reels-instagram" },
          { label: "YouTube to MP3 Converter", href: "/baixar-audio-youtube-mp3" },
        ],
        "AI Transcription": [
          { label: "WhatsApp Voice Notes", href: "/transcrever-whatsapp" },
          { label: "YouTube Transcription", href: "/transcrever-youtube" },
          { label: "TikTok Transcription", href: "/transcrever-tiktok" },
          { label: "Instagram Reels Transcription", href: "/transcrever-instagram" },
        ],
        "Formats": [
          { label: "Convert MP3 to Text", href: "/converter-mp3-em-texto" },
          { label: "Convert MP4 to Text", href: "/converter-mp4-em-texto" },
          { label: "Convert M4A to Text", href: "/converter-m4a-em-texto" },
          { label: "Convert WAV to Text", href: "/converter-wav-em-texto" },
        ],
        "Company": [
          { label: "Blog & Guides", href: "/blog" },
          { label: "Pricing & Plans", href: "/en/pricing" },
          { label: "Affiliate Program", href: "/afiliados" },
          { label: "Feedback & Suggestions", href: "/sugestoes" },
          { label: "About Us", href: "/sobre-nos" },
          { label: "Terms of Service", href: "/termos-de-uso", target: "_blank" },
        ],
      }
    : {
        "Soluções": [
          { label: "Degravação Jurídica", href: "/transcricao-juridica" },
          { label: "Pesquisa & TCC", href: "/transcricao-academica" },
          { label: "Atas de Reuniões", href: "/transcricao-de-reunioes" },
          { label: "Gerador de Legendas (.SRT)", href: "/gerar-legendas-srt" },
          { label: "Baixar Vídeos da Web", href: "/baixar-video" },
        ],
        "Baixar Mídias": [
          { label: "Baixar Vídeo do YouTube", href: "/baixar-video-youtube" },
          { label: "TikTok Sem Marca d'Água", href: "/baixar-video-tiktok" },
          { label: "Baixar Reels Instagram", href: "/baixar-reels-instagram" },
          { label: "YouTube para MP3", href: "/baixar-audio-youtube-mp3" },
        ],
        "Transcrever IA": [
          { label: "Áudios do WhatsApp", href: "/transcrever-whatsapp" },
          { label: "YouTube Transcrição", href: "/transcrever-youtube" },
          { label: "TikTok Transcrição", href: "/transcrever-tiktok" },
          { label: "Instagram Reels", href: "/transcrever-instagram" },
        ],
        "Formatos": [
          { label: "Converter MP3 em Texto", href: "/converter-mp3-em-texto" },
          { label: "Converter MP4 em Texto", href: "/converter-mp4-em-texto" },
          { label: "Converter M4A em Texto", href: "/converter-m4a-em-texto" },
          { label: "Converter WAV em Texto", href: "/converter-wav-em-texto" },
        ],
        "Empresa": [
          { label: "Blog & Dicas", href: "/blog" },
          { label: "Preços & Planos", href: "/precos" },
          { label: "Programa de Afiliados", href: "/afiliados" },
          { label: "Sugestões & Melhorias", href: "/sugestoes" },
          { label: "Sobre nós", href: "/sobre-nos" },
          { label: "Termos de uso", href: "/termos-de-uso", target: "_blank" },
        ],
      };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href={isEnglish ? "/en" : "/"} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "16px" }}>
              <Image
                src="/logo.png"
                alt="Peguei o Texto"
                width={130}
                height={60}
                style={{ height: "42px", width: "auto", objectFit: "contain" }}
              />
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.7", maxWidth: "280px" }}>
              {isEnglish
                ? "AI video and audio transcription. Fast, accurate, and with guaranteed privacy."
                : "Transcrição de vídeos e áudios com IA. Rápido, preciso e com privacidade garantida."}
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

              {(category === "Empresa" || category === "Company") && (
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                  <a
                    href="https://startupbase.io/products/peguei-o-texto?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-neutral"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", transition: "transform 0.2s, opacity 0.2s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://statics.startupbase.io/site/badges/launched-on-sb-neutral.svg"
                      alt="Launched on StartupBase"
                      height="34"
                      style={{ height: "34px", width: "auto", display: "block" }}
                    />
                  </a>

                  <a
                    href="https://www.producthunt.com/posts/peguei-o-texto?utm_source=badge-featured&utm_medium=badge&utm_campaign=peguei-o-texto"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", transition: "transform 0.2s, opacity 0.2s" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/product-hunt-badge.svg"
                      alt="Featured on Product Hunt"
                      height="34"
                      style={{ height: "34px", width: "auto", display: "block" }}
                    />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Peguei o Texto. {isEnglish ? "All rights reserved." : "Todos os direitos reservados."}
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
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
