import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import {
  Shield,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  Star,
  Play,
  FileText,
  Mic2,
  Sparkles,
  Check,
  ArrowRight,
  Flame,
  Video,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Peguei o Texto: AI Video & Audio Transcription in Seconds",
  description:
    "Paste any link from YouTube, TikTok, Instagram Reels or upload audio files to get 99.2% accurate transcriptions, synced CapCut subtitles (.SRT), and AI summaries in seconds. 5 minutes free trial!",
  keywords: [
    "transcribe video",
    "transcribe youtube video to text",
    "audio to text converter",
    "free video transcription",
    "transcribe instagram reels",
    "transcribe tiktok video",
    "generate srt subtitles",
    "ai transcription tool",
    "peguei o texto",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br",
      "en": "https://pegueiotexto.com.br/en",
    },
  },
  openGraph: {
    title: "Peguei o Texto: Turn Any Video into Text & Subtitles with AI",
    description:
      "Paste any video link. Get accurate transcripts, ready-to-import CapCut subtitles (.SRT) and executive summaries in seconds.",
    url: "https://pegueiotexto.com.br/en",
    siteName: "Peguei o Texto",
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Peguei o Texto - AI Video & Audio Transcription",
      "url": "https://pegueiotexto.com.br/en",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "description":
        "AI-powered speech-to-text service that transcribes YouTube, TikTok, Instagram Reels and audio files into accurate text and subtitles in seconds.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1",
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "5 free minutes upon signup to test all features",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I transcribe a YouTube, TikTok or Instagram video?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply copy the video link from YouTube, TikTok, Instagram Reels, or Vimeo, paste it into Peguei o Texto, and click 'Transcribe'. Your full text, timestamps and .SRT subtitles will be ready in seconds.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I export subtitles for CapCut and Premiere Pro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Peguei o Texto exports universal .SRT and .VTT subtitle files formatted for direct drag-and-drop import into CapCut, Adobe Premiere, DaVinci Resolve, and Final Cut Pro.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my privacy protected? Is the media file deleted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "100% protected. All temporary audio and video files are permanently deleted from our servers immediately after transcription is completed.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I test it for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All new accounts automatically receive 5 free minutes of transcription with zero credit card required.",
          },
        },
      ],
    },
  ],
};

const steps = [
  {
    number: "01",
    title: "Paste link or upload file",
    desc: "Supports YouTube, TikTok, Instagram Reels, Vimeo, podcasts, and 1,700+ websites. Or simply drag-and-drop an MP3, MP4, WAV, or M4A file from your device.",
    icon: <Globe size={22} />,
    color: "#7C3AED",
  },
  {
    number: "02",
    title: "AI transcribes in seconds",
    desc: "Our high-precision Whisper neural engine transcribes natural speech with timestamps, speaker separation, and noise filtering in over 50 languages.",
    icon: <Zap size={22} />,
    color: "#06B6D4",
  },
  {
    number: "03",
    title: "Export & Repurpose",
    desc: "Download formatted .TXT, .DOCX, or .SRT subtitles for CapCut. Plus, generate AI executive bullet-point summaries and viral social media posts in 1 click.",
    icon: <Lock size={22} />,
    color: "#10B981",
  },
];

const features = [
  {
    icon: <Globe size={20} />,
    title: "1,700+ Platforms",
    desc: "YouTube, TikTok, Instagram Reels, Twitter/X, Facebook, podcasts, and open web videos.",
    color: "#7C3AED",
  },
  {
    icon: <Zap size={20} />,
    title: "Under 30s Speed",
    desc: "Powered by enterprise-grade AI acceleration, dramatically faster than traditional manual typing.",
    color: "#06B6D4",
  },
  {
    icon: <Shield size={20} />,
    title: "Strict Privacy",
    desc: "Your files and transcripts belong to you. Audio files are deleted automatically right after processing.",
    color: "#10B981",
  },
  {
    icon: <FileText size={20} />,
    title: "Multiple Formats",
    desc: "Export clean .TXT, formatted Word (.DOCX), and synchronized .SRT/.VTT subtitle files.",
    color: "#EC4899",
  },
  {
    icon: <Mic2 size={20} />,
    title: "Multilingual Accuracy",
    desc: "Native precision for Portuguese, English, Spanish, and 50+ languages with automatic punctuation.",
    color: "#F59E0B",
  },
  {
    icon: <Sparkles size={20} />,
    title: "5 Free Minutes",
    desc: "Test the complete platform instantly with zero credit card required upon signup.",
    color: "#8B5CF6",
  },
];

const stats = [
  { number: "99.2%", label: "Transcription Accuracy" },
  { number: "< 30s", label: "Average Processing Time" },
  { number: "1,700+", label: "Supported Platforms" },
  { number: "100%", label: "Data Privacy Guaranteed" },
];

export default function EnglishHomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="hero bg-grid" style={{ paddingTop: "100px", paddingBottom: "70px", position: "relative" }}>
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            {/* Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                background: "rgba(139, 92, 246, 0.12)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "#c084fc",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              <Sparkles size={14} color="#c084fc" />
              <span>Next-Gen AI Video & Audio Transcription</span>
            </div>

            {/* Heading */}
            <h1 className="hero-title" style={{ marginBottom: "24px", color: "var(--text-primary)" }}>
              Paste the link.
              <br />
              <span className="text-gradient">Get the text.</span>
            </h1>

            <p className="hero-subtitle" style={{ margin: "0 auto 40px", maxWidth: "680px" }}>
              Transcribe any video from <strong>YouTube, TikTok, Instagram Reels, Vimeo</strong> or upload your audio file.
              Get 99.2% accurate text, synced CapCut subtitles (.SRT), and AI summaries in seconds.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "50px" }}>
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: "16px", padding: "14px 32px", textDecoration: "none" }}>
                <Mic2 size={18} /> Transcribe with AI Free
              </Link>
              <Link href="/en/download-video" className="btn-secondary" style={{ fontSize: "16px", padding: "14px 28px", textDecoration: "none" }}>
                <Video size={18} /> Free Video Downloader
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                maxWidth: "840px",
                margin: "0 auto",
                padding: "24px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              {stats.map((s, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
                    {s.number}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", marginTop: "4px" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" style={{ padding: "80px 0", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8b5cf6" }}>
              Simple 3-Step Workflow
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginTop: "8px" }}>
              How Peguei o Texto Works
            </h2>
            <p style={{ color: "var(--text-muted, #94a3b8)", fontSize: "15px", marginTop: "8px" }}>
              Zero software installations, zero complex configurations. Ready directly in your browser.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              maxWidth: "1060px",
              margin: "0 auto",
            }}
          >
            {steps.map((st, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 24px",
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${st.color}22`,
                    color: st.color,
                    marginBottom: "20px",
                  }}
                >
                  {st.icon}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: st.color, letterSpacing: "0.06em", marginBottom: "8px" }}>
                  STEP {st.number}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CORE FEATURES ══════════════════════ */}
      <section id="platforms" style={{ padding: "80px 0", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 50px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ec4899" }}>
              Built for Creators & Pros
            </span>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginTop: "8px" }}>
              Everything You Need to Turn Speech into Content
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              maxWidth: "1060px",
              margin: "0 auto",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${f.color}22`,
                    color: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FAQ SECTION ══════════════════════ */}
      <section style={{ padding: "80px 0", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#818cf8" }}>
              Got Questions?
            </span>
            <h2 style={{ fontSize: "30px", fontWeight: 800, color: "#ffffff", marginTop: "8px" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "How does the 5-minute free trial work?",
                a: "When you sign up, your account is immediately credited with 5 minutes of high-accuracy AI transcription. You can paste any link or upload an audio file right away with zero credit card required.",
              },
              {
                q: "Which video and audio formats are supported?",
                a: "You can paste links from YouTube, TikTok, Instagram Reels, Facebook, Vimeo, and Twitter/X. For direct file uploads, we support MP3, MP4, WAV, M4A, AAC, and OGG formats up to 500MB.",
              },
              {
                q: "Can I import subtitles directly into CapCut or Premiere?",
                a: "Yes! Simply download the .SRT or .VTT file from your transcript dashboard. You can drag and drop it straight into CapCut, Premiere Pro, or DaVinci Resolve with full timing synchronization.",
              },
              {
                q: "What languages can Peguei o Texto transcribe?",
                a: "Our neural AI models natively transcribe English, Portuguese, Spanish, French, German, Italian, and over 50 languages with punctuation and capitalization.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  cursor: "pointer",
                }}
              >
                <summary
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    listStyle: "none",
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: "#a5b4fc", fontSize: "16px" }}>+</span>
                </summary>
                <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div
            style={{
              marginTop: "60px",
              padding: "40px 30px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
              Ready to Turn Video into Content in Seconds?
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "15px", maxWidth: "560px", margin: "0 auto 24px" }}>
              Join creators, journalists, researchers, and video editors saving hours every week with Peguei o Texto.
            </p>
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              <span>Start Free with 5 Minutes</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
