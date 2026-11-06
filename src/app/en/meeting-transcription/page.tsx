import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Briefcase, ListChecks, Clock, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Meeting Transcription & Automated Meeting Minutes | Peguei o Texto",
  description:
    "Transcribe Google Meet, Zoom, and Microsoft Teams recordings in seconds. Generate automated meeting minutes, executive summaries, and action item checklists with AI. Try 5 minutes free!",
  keywords: [
    "meeting transcription ai",
    "automated meeting minutes",
    "transcribe zoom meeting",
    "transcribe google meet",
    "meeting summary generator",
    "action items from meeting",
    "transcribe teams recording",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/meeting-transcription",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcricao-de-reunioes",
      "en": "https://pegueiotexto.com.br/en/meeting-transcription",
      "x-default": "https://pegueiotexto.com.br/en/meeting-transcription",
    },
  },
  openGraph: {
    title: "AI Meeting Minutes & Recording Transcriptions | Peguei o Texto",
    description: "Never spend hours drafting meeting minutes again. Transcribe recordings and generate action items with AI. Free trial!",
    url: "https://pegueiotexto.com.br/en/meeting-transcription",
  },
};

const meetingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I transcribe a Zoom, Meet, or Teams meeting recording?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply upload the recorded audio or video file (MP4, M4A, etc.) or paste your recording URL. Our AI generates a full punctuated transcript in under a minute."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI create meeting minutes and action plans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Click 'AI Summary' after transcription. Our model analyzes dialogue to outline key decisions, debate topics, and an organized Action Item checklist with deliverables and assignees."
      }
    },
    {
      "@type": "Question",
      "name": "Can I share minutes with my team on Slack or Notion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Export to Word (.DOCX), PDF, copy text with 1 click, or generate a private public link to share directly in Slack, Notion, or WhatsApp."
      }
    }
  ]
};

export default function MeetingTranscriptionEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(meetingFaqSchema) }}
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
                <Briefcase size={14} color="#A78BFA" />
                Meeting Transcription & AI Minutes Generator
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Meeting transcription & automated minutes <br />
              <span style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Stop taking notes manually during client calls and sprint reviews. Upload Zoom, Meet, or Teams recordings to get <strong>verbatim transcripts</strong>, <strong>executive summaries</strong>, and <strong>action items</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <ListChecks size={14} color="#10B981" /> Automatic Action Items & Next Steps
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <Clock size={14} color="#10B981" /> 60-minute meeting parsed in 60s
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Upload meeting recording (.mp4, .m4a, .mp3) or paste video URL..." />
        </div>
      </section>

      {/* 3 STEPS FOR TEAMS */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--brand-primary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Executive Workflow
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              From meeting recording to actionable minutes in 3 steps
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(124, 58, 237, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#A78BFA" }}>
                <Briefcase size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>1. Upload Recording</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Drop video or audio files from Zoom, Google Meet, Teams, or Slack huddles into our secure uploader.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#06B6D4" }}>
                <ListChecks size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>2. AI Synthesizes Decisions</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Our model extracts meeting highlights, agreed decisions, deadlines, and responsible team members.
              </p>
            </div>

            <div className="card" style={{ padding: "28px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "#10B981" }}>
                <Download size={20} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>3. Share with Team</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Export clean Word (.DOCX) or PDF minutes, or send a secure link directly into Slack and Notion.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about Meeting Transcriptions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Do I need a bot to join my meeting?",
                a: "No intrusive meeting bots required! Simply record natively in Zoom, Google Meet, or Teams, and upload the file when you're done."
              },
              {
                q: "Is sensitive company business protected?",
                a: "Yes. All media is encrypted in transit and purged immediately after processing with strict zero retention."
              },
              {
                q: "Can I edit the generated minutes before sharing?",
                a: "Yes! You can edit, copy, and tailor text in the built-in editor before exporting to Word or PDF."
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
              Transcribe Your Meeting Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
