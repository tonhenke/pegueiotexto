import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Scale, ShieldCheck, Clock, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Legal Transcription & Court Hearing Speech-to-Text | Peguei o Texto",
  description:
    "Transcribe court hearings, depositions, client interviews, and witness testimonies with AI in minutes. Strict legal accuracy, synced timestamps, and attorney-client confidentiality. Try 5 minutes free!",
  keywords: [
    "legal transcription ai",
    "court hearing transcription",
    "deposition transcription",
    "legal speech to text",
    "transcribe witness testimony",
    "legal audio to word",
    "confidential legal transcription",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/legal-transcription",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcricao-juridica",
      "en": "https://pegueiotexto.com.br/en/legal-transcription",
      "x-default": "https://pegueiotexto.com.br/en/legal-transcription",
    },
  },
  openGraph: {
    title: "AI Legal Transcription for Law Firms & Attorneys | Peguei o Texto",
    description: "Transcribe hearings, depositions, and testimony in minutes with total confidentiality. Free 5-minute trial!",
    url: "https://pegueiotexto.com.br/en/legal-transcription",
  },
};

const legalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI legal transcription work for court hearings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload the audio or video recording from Zoom, Microsoft Teams, Webex, or digital courtroom recorders. Our AI transcribes dialogue verbatim with proper punctuation, generating a Word (.DOCX) or PDF document ready for court filings."
      }
    },
    {
      "@type": "Question",
      "name": "How is attorney-client confidentiality and data privacy guaranteed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We operate with strict zero-retention policies. Recordings are encrypted in transit, processed in memory, and permanently purged immediately after transcription. No user data is ever retained or used to train third-party models."
      }
    },
    {
      "@type": "Question",
      "name": "Does the transcript include timestamps for citing in legal briefs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The transcript includes synced timestamps, allowing attorneys to cite the exact minute and second when a judge, witness, or opposing counsel made a statement."
      }
    }
  ]
};

export default function LegalTranscriptionEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.35)", color: "#FDE047" }}>
                <Scale size={14} color="#EAB308" />
                Legal & Court Hearing Transcription
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Court hearing and legal transcription <br />
              <span style={{ background: "linear-gradient(135deg, #EAB308, #F59E0B, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                fast, verbatim, and 100% confidential
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Transcribe courtroom hearings, depositions, arbitrations, and client meetings in minutes. Deliver verbatim evidence citations directly to <strong>Word (.DOCX)</strong> or <strong>PDF</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="#10B981" /> Strict zero data retention policy
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <Clock size={14} color="#10B981" /> Synced timestamps for brief citations
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Upload hearing audio/video (.mp3, .wav, .mp4) or paste recording URL..." />
        </div>
      </section>

      {/* 3 PILLARS FOR LAW FIRMS */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#EAB308", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Built for Legal Practice
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              Why litigation teams rely on Peguei o Texto
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(234, 179, 8, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#FDE047" }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>10x Faster Turnaround</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                A 2-hour hearing is transcribed in less than 5 minutes, saving paralegals countless hours of manual typing before tight motion deadlines.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Total Confidentiality</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Media files are deleted instantly upon transcript completion. Complete protection for sensitive privileged communications and sealed records.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Word (.DOCX) Ready</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Export clean, formatted documents with paragraphs and speakers for straightforward copy-pasting into briefs, pleadings, and motions.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about Legal Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Can I transcribe long, multi-speaker depositions?",
                a: "Yes! Our platform easily processes multi-hour audio files, cleanly separating dialogue pauses and witness exchanges."
              },
              {
                q: "Can I generate an AI summary with key testimonies and contradictions?",
                a: "Yes! Use the AI Summary tab to generate an executive briefing of the hearing, identifying testimony highlights and action items."
              },
              {
                q: "Does it work with audio extracted from Zoom or courtroom systems?",
                a: "Yes! Simply upload MP4, MP3, WAV, or M4A files downloaded from your virtual court session or local recording device."
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
              Start Legal Transcription Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

