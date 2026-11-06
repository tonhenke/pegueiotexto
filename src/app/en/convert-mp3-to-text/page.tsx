import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Music, Headphones, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert MP3 to Text Online Free with AI | Peguei o Texto",
  description:
    "Convert MP3 audio recordings into accurate text in seconds using AI. 99% accuracy, automated punctuation, and instant export to Word (.DOCX), PDF, and TXT. Try 5 minutes free!",
  keywords: [
    "convert mp3 to text",
    "transcribe mp3 online",
    "mp3 to text converter",
    "audio to word converter",
    "speech to text mp3",
    "transcribe voice recording",
    "free mp3 transcriber",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/convert-mp3-to-text",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/converter-mp3-em-texto",
      "en": "https://pegueiotexto.com.br/en/convert-mp3-to-text",
      "x-default": "https://pegueiotexto.com.br/en/convert-mp3-to-text",
    },
  },
  openGraph: {
    title: "Convert MP3 Audio to Text Online with AI | Peguei o Texto",
    description: "Convert voice memos, lectures, and interviews into cleanly punctuated text in seconds. 5 free minutes trial!",
    url: "https://pegueiotexto.com.br/en/convert-mp3-to-text",
  },
};

const mp3FaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert an MP3 audio file into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply drag and drop your MP3 file into the Peguei o Texto uploader. Our artificial intelligence transcribes the speech with accurate punctuation and provides formatted Word (.DOCX), PDF, and TXT exports."
      }
    },
    {
      "@type": "Question",
      "name": "Can I transcribe long MP3 recordings over 1 hour?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our cloud processing handles multi-hour recordings of meetings, lectures, seminars, and interviews with consistent accuracy."
      }
    },
    {
      "@type": "Question",
      "name": "What other audio formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Besides MP3, we support WAV, M4A, AAC, OGG, OPUS, FLAC, and video formats including MP4, MOV, and WebM."
      }
    },
    {
      "@type": "Question",
      "name": "Is my audio data confidential and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Your audio file is automatically purged from our servers immediately after the transcription completes. Zero data retention guaranteed."
      }
    }
  ]
};

export default function ConvertMp3ToTextEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mp3FaqSchema) }}
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
                <Music size={14} color="#A78BFA" />
                Professional MP3 to Text Converter
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Convert MP3 to text <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Upload recordings of meetings, interviews, lectures, or voice memos. Receive clean text with <strong>perfect punctuation</strong> and export to <strong>Word (.DOCX)</strong>, <strong>PDF</strong>, or <strong>TXT</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 99% accuracy across 90+ languages
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Direct export to Word and PDF
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes instantly
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Drag and drop MP3 file or click to select from your device..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              How to convert MP3 to text
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Headphones size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Upload MP3</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Select the audio file recorded on your phone, voice recorder, or laptop and drop it into the uploader.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. AI Transcribes</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                In less than 60 seconds, our AI engine converts speech to text, adding punctuation, capitalization, and paragraphs.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Export Document</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Copy the text with 1 click or download as formatted Word (.DOCX), PDF, or .SRT subtitle files.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about MP3 Conversion</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "What is the maximum MP3 file size supported?",
                a: "You can upload MP3 audio files up to 2 GB directly through your browser."
              },
              {
                q: "Can I generate an executive summary from my MP3 recording?",
                a: "Yes! Click the 'AI Summary' tab after transcription to generate bullet points, takeaways, and next steps automatically."
              },
              {
                q: "Does it distinguish between different speakers?",
                a: "Yes, our advanced speech models separate sentences by speaker turns and natural dialogue pauses."
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
              Convert MP3 to Text Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
