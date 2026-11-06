import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Clock } from "lucide-react";

const YoutubeIcon = ({ size = 20, color = "#EF4444" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcribe YouTube Video to Text Online with AI | Peguei o Texto",
  description:
    "Paste any YouTube video or Shorts link and transcribe it into text in seconds using advanced AI. 99% accuracy, automated punctuation, executive summaries, and .TXT, .DOCX, .PDF & .SRT export. Try it free!",
  keywords: [
    "transcribe youtube video",
    "youtube to text converter",
    "youtube transcript generator",
    "transcribe youtube shorts",
    "download youtube transcript",
    "convert youtube video to text",
    "generate srt from youtube",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/transcribe-youtube",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcrever-youtube",
      "en": "https://pegueiotexto.com.br/en/transcribe-youtube",
      "x-default": "https://pegueiotexto.com.br/en/transcribe-youtube",
    },
  },
  openGraph: {
    title: "Transcribe YouTube Video to Text with AI | Peguei o Texto",
    description: "Convert any YouTube video into text, summaries, and .SRT subtitles in seconds. 5 free minutes trial!",
    url: "https://pegueiotexto.com.br/en/transcribe-youtube",
  },
};

const youtubeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I transcribe a YouTube video into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply copy the URL of the YouTube video or Shorts, paste it into the Peguei o Texto input field above, and click 'Transcribe'. Advanced artificial intelligence processes the audio and delivers a punctuated transcript in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with YouTube Shorts and long podcasts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Peguei o Texto supports quick 30-second Shorts as well as long 2 to 3-hour podcasts and university lectures."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Peguei o Texto and YouTube default captions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YouTube auto-captions lack proper punctuation, fail on accents or fast speech, and do not provide paragraph breaks. Peguei o Texto leverages next-gen speech-to-text models for clean punctuation, speaker capitalization, and exportable .SRT and Word documents."
      }
    }
  ]
};

export default function TranscribeYoutubeEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#FCA5A5" }}>
                <YoutubeIcon size={14} color="#EF4444" />
                Official Transcriber for YouTube & Shorts
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcribe YouTube videos <br />
              <span style={{ background: "linear-gradient(135deg, #EF4444, #F43F5E, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to text in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Paste any podcast, lecture, interview, or Shorts URL. Get accurate text with full punctuation and download in <strong>.TXT</strong>, <strong>.DOCX</strong>, or <strong>.SRT</strong> for video editing.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 99% accuracy across 90+ languages
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> No software installation required
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="https://www.youtube.com/watch?v=... or Shorts URL" />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Step by Step</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>How to transcribe YouTube videos</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Turn hours of audio and video into editable text in less than 30 seconds.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "Copy the video URL",
                desc: "On YouTube or your mobile app, tap 'Share' and copy the link of any video, podcast, or Shorts.",
                icon: <YoutubeIcon size={24} color="#EF4444" />
              },
              {
                step: "02",
                title: "Paste into Peguei o Texto",
                desc: "Paste the URL in the box above. Our neural speech AI analyzes the track and eliminates background noise.",
                icon: <Zap size={24} color="#A78BFA" />
              },
              {
                step: "03",
                title: "Download text or subtitles",
                desc: "Copy your transcript with one click or export clean .TXT, Word .DOCX, or synced .SRT subtitles.",
                icon: <FileText size={24} color="#06B6D4" />
              }
            ].map((card) => (
              <div key={card.step} className="glass-card" style={{ padding: "32px 24px", position: "relative" }}>
                <div style={{ fontSize: "3rem", fontWeight: 900, color: "rgba(255,255,255,0.04)", position: "absolute", top: "16px", right: "20px" }}>
                  {card.step}
                </div>
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

      {/* COMPARISON TABLE */}
      <section style={{ padding: "80px 0", background: "rgba(0,0,0,0.2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Comparison</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Why our AI outperforms native YouTube captions</h2>
          </div>

          <div className="glass-card" style={{ padding: "0", overflow: "hidden", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border-subtle)", fontWeight: 700, fontSize: "14px" }}>
              <span>Feature</span>
              <span style={{ color: "#A78BFA" }}>Peguei o Texto (AI)</span>
              <span style={{ color: "var(--text-muted)" }}>YouTube Auto-Captions</span>
            </div>
            {[
              { feat: "Punctuation (commas, periods)", peguei: "Yes, flawless", yt: "No punctuation" },
              { feat: "Paragraph formatting", peguei: "Structured & readable", yt: "Confusing run-on block" },
              { feat: "Accents & technical jargon", peguei: "99% accuracy", yt: "Frequent misheard words" },
              { feat: "Direct .SRT download", peguei: "1-click export", yt: "Requires tricky extensions" },
              { feat: "Data privacy & zero retention", peguei: "Deleted immediately", yt: "Retained in platform" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", padding: "16px 24px", borderBottom: i < 4 ? "1px solid var(--border-subtle)" : "none", fontSize: "14px", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{row.feat}</span>
                <span style={{ color: "#6EE7B7", fontWeight: 600 }}>✓ {row.peguei}</span>
                <span style={{ color: "var(--text-muted)" }}>✕ {row.yt}</span>
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about YouTube Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Can I transcribe 2 or 3-hour long podcasts?",
                a: "Yes! Our cloud AI architecture is built for long-form content, transcribing multi-hour podcasts in just a few minutes."
              },
              {
                q: "Does it work with unlisted or private videos?",
                a: "Unlisted videos with a direct share link work seamlessly. Private videos requiring personal account login cannot be accessed for security reasons."
              },
              {
                q: "Can I export subtitles for CapCut, Premiere, or DaVinci?",
                a: "Absolutely! Just click 'Download .SRT' and import the file directly into CapCut, Adobe Premiere, DaVinci Resolve, or Final Cut Pro."
              },
              {
                q: "Is it free to try?",
                a: "You get 5 free minutes automatically upon signing up with no credit card required. If you need more time, flexible top-up packs start at just $1.99."
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
              Try YouTube Transcription Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
