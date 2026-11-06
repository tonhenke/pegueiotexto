import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, AudioLines, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert WAV to Text Online Free with AI (Lossless Audio) | Peguei o Texto",
  description:
    "Convert high-fidelity uncompressed WAV audio into text in seconds using AI. 99% accuracy across 90+ languages, automatic punctuation, and export to Word (.DOCX), PDF, and TXT. Try 5 minutes free!",
  keywords: [
    "convert wav to text",
    "transcribe wav audio",
    "wav to text converter",
    "lossless audio transcription",
    "transcribe studio audio wav",
    "wav to word docx",
    "voice recorder wav to text",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/convert-wav-to-text",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/converter-wav-em-texto",
      "en": "https://pegueiotexto.com.br/en/convert-wav-to-text",
      "x-default": "https://pegueiotexto.com.br/en/convert-wav-to-text",
    },
  },
  openGraph: {
    title: "Convert WAV Audio to Text with AI | Peguei o Texto",
    description: "Transcribe studio-quality WAV audio recordings with near-perfect accuracy in seconds. 5 free minutes trial!",
    url: "https://pegueiotexto.com.br/en/convert-wav-to-text",
  },
};

const wavFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert a WAV audio file into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply drop your WAV file into the Peguei o Texto upload field. Our AI parses uncompressed audio tracks and delivers a punctuated transcript in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Why do WAV files achieve higher transcription accuracy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WAV is a lossless, uncompressed audio format that preserves high-frequency phonemes and subtle speech cues, enabling our AI models to reach peak accuracy."
      }
    },
    {
      "@type": "Question",
      "name": "Does it support high-end studio and field recorder files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We support WAV files from professional field gear such as Zoom, Tascam, Rode, and Sony voice recorders, including multi-hour conference hearings."
      }
    }
  ]
};

export default function ConvertWavToTextEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wavFaqSchema) }}
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
                <AudioLines size={14} color="#A78BFA" />
                Lossless WAV & Studio Audio Transcriber
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Convert WAV to text <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Upload professional audio tracks from podcasts, legal hearings, field interviews, or studio recordings. Get high-precision text exported directly to <strong>Word (.DOCX)</strong>, <strong>PDF</strong>, or <strong>TXT</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Lossless acoustic recognition
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 99% accuracy across 90+ languages
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes on signup
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Drag and drop WAV file or click to select from your device..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Studio Quality
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              How to transcribe WAV recordings
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <AudioLines size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Upload WAV File</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Select your high-fidelity WAV file from field recorders or DAWs (up to 2 GB) and drop it into the uploader.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. Neural Decoding</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Our deep speech model takes advantage of lossless audio clarity to transcribe complex terms and accents.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Export Document</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Download clean, punctuated text in Word (.DOCX), PDF, or copy directly with 1 click.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about WAV Audio</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "What is the file upload limit for WAV?",
                a: "You can upload WAV files up to 2 GB with rapid browser streaming."
              },
              {
                q: "Can I transcribe multiple speakers in a courtroom or panel discussion?",
                a: "Yes! Our AI handles multi-speaker discussions with accurate paragraph formatting and punctuation."
              },
              {
                q: "Is confidential research or legal audio protected?",
                a: "Yes. All audio data is processed transiently and deleted immediately following transcription."
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
              Convert WAV to Text Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
