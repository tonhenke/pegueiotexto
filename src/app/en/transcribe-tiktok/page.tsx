import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Layers, TrendingUp } from "lucide-react";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcribe TikTok Videos to Text Online with AI | Peguei o Texto",
  description:
    "Paste any TikTok video link and get an accurate transcript and script in seconds. Convert viral short videos into carousels, articles, and .SRT subtitles. Try 5 minutes free!",
  keywords: [
    "transcribe tiktok video",
    "tiktok to text converter",
    "extract script from tiktok",
    "tiktok transcript generator",
    "convert tiktok to text",
    "repurpose tiktok video",
    "tiktok srt subtitles",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/transcribe-tiktok",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcrever-tiktok",
      "en": "https://pegueiotexto.com.br/en/transcribe-tiktok",
      "x-default": "https://pegueiotexto.com.br/en/transcribe-tiktok",
    },
  },
  openGraph: {
    title: "Transcribe TikTok Video to Text with AI | Peguei o Texto",
    description: "Extract the exact script and speech from any TikTok video in seconds. Free 5-minute trial!",
    url: "https://pegueiotexto.com.br/en/transcribe-tiktok",
  },
};

const tiktokFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I transcribe a TikTok video into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Open TikTok, click the share icon and select 'Copy link'. Paste the URL into Peguei o Texto and click 'Transcribe'. Advanced AI processes the audio and outputs the full transcript in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Can I export .SRT subtitle files from TikTok?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can export ready-to-import .SRT files with synced timestamps for CapCut, Adobe Premiere, or DaVinci Resolve, plus formatted Word (.DOCX) and .TXT files."
      }
    },
    {
      "@type": "Question",
      "name": "Does it support mobile short links like vm.tiktok.com?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Peguei o Texto automatically handles mobile short links (vm.tiktok.com, vt.tiktok.com) and full desktop URLs."
      }
    }
  ]
};

export default function TranscribeTikTokEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tiktokFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(0, 242, 234, 0.2) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(254, 44, 85, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#FFFFFF" }}>
                <TikTokIcon size={14} />
                Official TikTok Video & Voiceover Transcriber
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcribe TikTok videos <br />
              <span style={{ background: "linear-gradient(135deg, #00F2FE, #4FACFE, #FE2C55)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to text and scripts with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Paste any TikTok link. Extract the script, generate CapCut-ready .SRT captions, or repurpose viral content into articles and LinkedIn carousels.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Supports vm.tiktok & vt.tiktok links
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes on signup
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> .TXT, .DOCX and .SRT formats
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.tiktok.com/@user/video/... or vm.tiktok.com/..." />
        </div>
      </section>

      {/* WHY CREATORS USE IT */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Growth & Repurposing</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Why top creators transcribe TikTok videos</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Turn high-engagement video speech into versatile written assets in seconds.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                title: "Repurpose to YouTube Shorts & Reels",
                desc: "Export synchronized .SRT subtitle files and import them directly into CapCut for effortless multi-platform posting.",
                icon: <FileText size={24} color="#00F2FE" />
              },
              {
                title: "Reverse-Engineer Viral Scripts",
                desc: "Study the exact hooks, emotional triggers, and cadence of top trending creators in your industry.",
                icon: <TrendingUp size={24} color="#FE2C55" />
              },
              {
                title: "Create LinkedIn & Twitter Content",
                desc: "Turn spoken advice into step-by-step text posts, summaries, or newsletters without typing a word manually.",
                icon: <Layers size={24} color="#A78BFA" />
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
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>FAQ</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about TikTok Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "How do I get the link from the TikTok app?",
                a: "Tap the arrow or share button on the right side of the TikTok screen, scroll to 'Copy link', and paste it directly into our tool."
              },
              {
                q: "Can I transcribe videos with trending background songs?",
                a: "Yes! Our AI features neural voice isolation that separates vocals from loud background beats and ambient music."
              },
              {
                q: "Is there any watermark on the exported files?",
                a: "No. You receive clean text (.TXT, .DOCX) and subtitle (.SRT) files with no watermarks or restrictions."
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
              Transcribe TikTok Video Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

