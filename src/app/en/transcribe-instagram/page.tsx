import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Layers } from "lucide-react";

const InstagramIcon = ({ size = 20, color = "#E1306C" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcribe Instagram Reels to Text Online with AI | Peguei o Texto",
  description:
    "Paste any Instagram Reel or video URL and get an accurate transcription in seconds. Turn viral clips into scripts, LinkedIn posts, carousels, and .SRT subtitles. Try 5 minutes free!",
  keywords: [
    "transcribe instagram reels",
    "instagram video to text",
    "extract audio from instagram",
    "reels transcript generator",
    "instagram to text converter",
    "repurpose instagram reels",
    "generate srt for reels",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/transcribe-instagram",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcrever-instagram",
      "en": "https://pegueiotexto.com.br/en/transcribe-instagram",
      "x-default": "https://pegueiotexto.com.br/en/transcribe-instagram",
    },
  },
  openGraph: {
    title: "Transcribe Instagram Reels to Text with AI | Peguei o Texto",
    description: "Extract clean text and subtitles from any Instagram Reel in seconds. Free 5-minute trial!",
    url: "https://pegueiotexto.com.br/en/transcribe-instagram",
  },
};

const instagramFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I transcribe an Instagram Reel to text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open Instagram, tap the share icon on the Reel or video, and click 'Copy link'. Paste the URL into Peguei o Texto and click 'Transcribe'. Your punctuated transcript is ready in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with public and private Instagram accounts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It works with all public Instagram Reels and videos. Private accounts requiring authenticated followers cannot be accessed for privacy and compliance reasons."
      }
    },
    {
      "@type": "Question",
      "name": "How can creators repurpose transcribed Reels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Content creators and growth marketers use transcripts to spin off viral scripts into multi-slide carousels, Twitter/X threads, LinkedIn posts, and newsletter digests."
      }
    }
  ]
};

export default function TranscribeInstagramEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(instagramFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(225, 48, 108, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(225, 48, 108, 0.15)", border: "1px solid rgba(225, 48, 108, 0.35)", color: "#F472B6" }}>
                <InstagramIcon size={14} color="#E1306C" />
                Instagram Reels & Video Transcriber
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcribe Instagram Reels <br />
              <span style={{ background: "linear-gradient(135deg, #F59E0B, #E1306C, #833AB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to clean text in seconds
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Extract scripts and voiceovers from any viral Reel. Turn short-form videos into high-performing carousels, blog posts, threads, or editable .SRT captions.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Works with all public Reels
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to start
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Instant .TXT, .DOCX & .SRT export
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.instagram.com/reel/... or video URL" />
        </div>
      </section>

      {/* USE CASES FOR CREATORS */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Productivity</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>What can you do with transcribed Reels?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Repurpose social media content across platforms and 10x your output.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                title: "Build Carousels & Text Posts",
                desc: "Copy spoken insights and translate bullet points into engaging multi-image carousels for LinkedIn and Instagram.",
                icon: <Layers size={24} color="#E1306C" />
              },
              {
                title: "Deconstruct Viral Hooks",
                desc: "Study opening hooks, audience retention pacing, and calls-to-action used by top creators in your market.",
                icon: <Sparkles size={24} color="#F59E0B" />
              },
              {
                title: "Generate Subtitles (.SRT)",
                desc: "Download timestamped .SRT files to import into CapCut or Premiere and auto-caption your own short-form clips.",
                icon: <FileText size={24} color="#06B6D4" />
              }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ padding: "32px 24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>{card.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Questions & Answers</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about Instagram Reels</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "How do I copy a Reel link in Instagram?",
                a: "In the Instagram app or desktop browser, tap the paper airplane / share icon on the Reel and select 'Copy link'."
              },
              {
                q: "Does AI transcribe voices over background music?",
                a: "Yes! Our speech isolation models automatically filter out background beats and ambient noise to isolate clean spoken words."
              },
              {
                q: "Is my Instagram data stored?",
                a: "No. Peguei o Texto operates on a zero-retention policy. Downloaded audio is processed in memory and permanently deleted immediately after transcription."
              }
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>{item.q}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Bottom */}
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Link href="#video-url-input" className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px", textDecoration: "none" }}>
              Transcribe Instagram Reels Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

