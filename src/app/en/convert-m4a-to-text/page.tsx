import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Smartphone, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert M4A to Text Online with AI (iPhone Voice Memos) | Peguei o Texto",
  description:
    "Convert M4A audio files and iPhone Voice Memos into accurate text in seconds using AI. 99% accuracy, automated punctuation, and instant export to Word (.DOCX), PDF, and TXT. Try 5 minutes free!",
  keywords: [
    "convert m4a to text",
    "transcribe iphone voice memos",
    "m4a to text converter",
    "transcribe apple voice memo",
    "convert m4a audio to word",
    "voice memo transcription",
    "free m4a transcriber",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/convert-m4a-to-text",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/converter-m4a-em-texto",
      "en": "https://pegueiotexto.com.br/en/convert-m4a-to-text",
      "x-default": "https://pegueiotexto.com.br/en/convert-m4a-to-text",
    },
  },
  openGraph: {
    title: "Convert M4A Voice Memos to Text with AI | Peguei o Texto",
    description: "Convert Apple Voice Memos and M4A recordings to punctuated text in seconds. 5 free minutes trial!",
    url: "https://pegueiotexto.com.br/en/convert-m4a-to-text",
  },
};

const m4aFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I convert an iPhone Voice Memo (M4A) into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In the Voice Memos app on your iPhone or Mac, tap the three dots on your recording, select 'Share', save it to your Files or AirDrop it, and drop it into Peguei o Texto. Our AI transcribes it with full punctuation in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Does M4A need to be converted to MP3 first?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! Peguei o Texto natively decodes Apple AAC/M4A containers without any preliminary conversion or loss in fidelity."
      }
    },
    {
      "@type": "Question",
      "name": "Can I export to Microsoft Word (.DOCX) and PDF?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can export formatted Word documents (.DOCX), clean PDF files, or plain .TXT files with 1 click."
      }
    }
  ]
};

export default function ConvertM4aToTextEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(m4aFaqSchema) }}
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
                <Smartphone size={14} color="#A78BFA" />
                iPhone Voice Memos & M4A Audio Transcriber
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Convert M4A to text <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                online in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Recorded an important voice memo on your iPhone, iPad, or Mac? Drop the .M4A audio file and receive a punctuated transcript ready for <strong>Word (.DOCX)</strong>, <strong>PDF</strong>, or <strong>TXT</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Native Apple Voice Memos support
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
          <TranscribeForm initialPlaceholder="Drag and drop M4A file or select from your iPhone / computer..." />
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Quick & Easy
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              How to transcribe Apple Voice Memos (.M4A)
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Smartphone size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Share from iPhone</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Open Voice Memos, tap the three dots on your recording, select Share, and save or upload the .m4a file.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. AI Processes Speech</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Our neural models recognize speech nuances, isolate voices, and punctuate sentences with high fidelity.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Export Document</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Export your transcript to Word (.DOCX), PDF, or copy the clean text for Notion, Slack, or email.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about M4A Audio</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "What is an M4A file?",
                a: "M4A is Apple's standard high-quality audio file format used by Voice Memos and QuickTime. Peguei o Texto supports it with zero conversion lag."
              },
              {
                q: "Can I transcribe voice memos recorded on Apple Watch?",
                a: "Yes! Voice memos synced from your Apple Watch to your iPhone or iCloud can be uploaded directly."
              },
              {
                q: "Is there any limit on audio recording duration?",
                a: "No! You can transcribe voice memos ranging from 30 seconds to several hours."
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
              Convert M4A to Text Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

