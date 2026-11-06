import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Video, FileCheck, Layers, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert MP4 Video to Text Online with AI | Peguei o Texto",
  description:
    "Convert any MP4 video into accurate text and subtitles in seconds using AI. Perfect for Zoom meetings, webinars, and recorded lectures. Export to Word (.DOCX), PDF, and .SRT. Try 5 minutes free!",
  keywords: [
    "convert mp4 to text",
    "transcribe mp4 video",
    "video to text converter",
    "transcribe zoom meeting mp4",
    "extract text from mp4",
    "mp4 to docx",
    "mp4 to srt subtitle generator",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/convert-mp4-to-text",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/converter-mp4-em-texto",
      "en": "https://pegueiotexto.com.br/en/convert-mp4-to-text",
      "x-default": "https://pegueiotexto.com.br/en/convert-mp4-to-text",
    },
  },
  openGraph: {
    title: "Convert MP4 Video to Text with AI | Peguei o Texto",
    description: "Extract text, meeting notes, and subtitles from MP4 video files in seconds. 5 free minutes trial!",
    url: "https://pegueiotexto.com.br/en/convert-mp4-to-text",
  },
};

const mp4FaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert an MP4 video into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply drag and drop your MP4 video file into the upload area on Peguei o Texto. Our artificial intelligence extracts the audio track and generates a verbatim, punctuated transcript in under a minute."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to convert MP4 to MP3 before uploading?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! You can upload the .MP4 file directly. Our system processes audio from the video container with no preliminary conversion needed."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with Zoom and Google Meet recordings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Peguei o Texto is widely used for recorded Zoom meetings, Google Meet calls, webinars, and university classes up to several hours long."
      }
    }
  ]
};

export default function ConvertMp4ToTextEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mp4FaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.35)", color: "#C4B5FD" }}>
                <Video size={14} color="#A78BFA" />
                Professional MP4 to Text & Subtitle Converter
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Convert MP4 video to text <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Upload any MP4 video recording from meetings, webinars, or classes. Get clean text with <strong>automatic punctuation</strong>, <strong>executive summaries</strong>, and <strong>.SRT subtitles</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 99% accuracy across 90+ languages
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Export to Word (.DOCX), PDF & .SRT
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Drag and drop MP4 video or click to select from your device..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Fast Workflow
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              How to transcribe MP4 videos into text
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Video size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Upload Video</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Select your MP4 file from Zoom, Teams, Meet, or your camera roll and drag it into the uploader.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. Neural Transcription</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Our cloud speech AI extracts speech tracks, cleans background noise, and formats punctuation in seconds.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Export & Share</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Export clean documents to Word, PDF, or .SRT subtitles ready for editing software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>FAQ</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about MP4 Video Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Can I transcribe 2GB video files?",
                a: "Yes! Peguei o Texto supports high-definition video files up to 2 GB with rapid browser uploading."
              },
              {
                q: "Does it extract timecoded subtitles (.SRT)?",
                a: "Yes! You can download synchronized .SRT or .VTT files directly to import into CapCut or Premiere."
              },
              {
                q: "Is the video deleted after transcription?",
                a: "Yes. In strict compliance with data privacy standards, uploaded media is destroyed as soon as the transcription finishes."
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
              Convert MP4 to Text Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
