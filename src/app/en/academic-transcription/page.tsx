import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, GraduationCap, BookOpen, Clock, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Transcription for Qualitative Research & Thesis | Peguei o Texto",
  description:
    "Transcribe research interviews, focus groups, lectures, and thesis recordings with AI in seconds. Verbatim speech-to-text fidelity, technical jargon handling, and instant Word (.DOCX) and PDF export. Try 5 minutes free!",
  keywords: [
    "academic transcription",
    "transcribe qualitative research interviews",
    "thesis interview transcription",
    "dissertation transcription ai",
    "transcribe lecture to text",
    "focus group transcription",
    "academic audio to text",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/academic-transcription",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcricao-academica",
      "en": "https://pegueiotexto.com.br/en/academic-transcription",
      "x-default": "https://pegueiotexto.com.br/en/academic-transcription",
    },
  },
  openGraph: {
    title: "AI Academic Transcription for Researchers & Students | Peguei o Texto",
    description: "Save dozens of hours transcribing research interviews and thesis recordings with AI. Free 5-minute trial!",
    url: "https://pegueiotexto.com.br/en/academic-transcription",
  },
};

const academicFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI transcription support qualitative academic research?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply upload your participant interview recordings in any format (MP3, M4A, WAV, or MP4). Our AI delivers verbatim, word-for-word text formatted with punctuation, ready to import into NVivo, ATLAS.ti, Word, or PDF."
      }
    },
    {
      "@type": "Question",
      "name": "Does it preserve scientific and technical terminology?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our deep learning models are trained on extensive multilingual corpora, handling multidisciplinary scientific, medical, sociological, and technical jargon with exceptional accuracy."
      }
    },
    {
      "@type": "Question",
      "name": "Can I generate thematic summaries of participant responses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! In addition to full verbatim transcripts, you can click 'AI Summary' to organize key thematic takeaways and participant perspectives into bullet points."
      }
    }
  ]
};

export default function AcademicTranscriptionEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(academicFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#6EE7B7" }}>
                <GraduationCap size={15} color="#10B981" />
                Academic & Qualitative Research Transcription
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcribe research interviews <br />
              <span style={{ background: "linear-gradient(135deg, #10B981, #06B6D4, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                and thesis recordings in seconds
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Save 20+ hours of manual audio typing per research project. Verbatim precision for qualitative coding, focus groups, and lectures ready for <strong>Word (.DOCX)</strong>, <strong>PDF</strong>, or <strong>NVivo</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <BookOpen size={14} color="#10B981" /> Verbatim fidelity for methodology rigor
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <Shield size={14} color="#10B981" /> Ethical data compliance & zero retention
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Upload interview audio (.mp3, .m4a, .wav) or lecture recording..." />
        </div>
      </section>

      {/* 3 ADVANTAGES FOR ACADEMIA */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Academic Research Efficiency
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Designed for grad students, professors, and researchers
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#6EE7B7" }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Focus on Analysis, Not Typing</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Manual transcription takes 4 to 6 hours per 1 hour of audio. Our AI transcribes an entire interview in under 60 seconds.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Verbatim Fidelity</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Captures participants&apos; exact words, colloquialisms, and technical terms without censorship or unsolicited summaries.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Ready for Word & NVivo</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Export clean .DOCX documents with timestamps and speaker paragraphs ready to import into qualitative analysis tools.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about Academic Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Is it suitable for IRB and Ethics Committee privacy standards?",
                a: "Yes. Files are encrypted in transit and purged immediately after transcription. We never sell or train public AI models on researcher data."
              },
              {
                q: "Can I transcribe recordings in different languages?",
                a: "Yes! Peguei o Texto supports over 90 languages including English, Portuguese, Spanish, French, and German."
              },
              {
                q: "Can I export timestamps for referencing quotes?",
                a: "Yes! Timestamps allow you to pinpoint exact interview moments when citing participants in your thesis or paper."
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
              Start Academic Transcription Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
