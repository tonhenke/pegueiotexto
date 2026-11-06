import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { FileCode, Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Video, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "AI SRT Subtitle Generator & Captions Creator | Peguei o Texto",
  description:
    "Generate synchronized .SRT and .VTT subtitle files automatically for any video link or audio upload. 100% compatible with CapCut, Premiere Pro, DaVinci Resolve, and YouTube Studio. Try 5 minutes free!",
  keywords: [
    "srt subtitle generator",
    "generate srt subtitles",
    "create srt file online",
    "auto caption video with ai",
    "vtt subtitles generator",
    "capcut srt subtitles",
    "download srt from video",
    "video subtitle generator",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/generate-srt-subtitles",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/gerar-legendas-srt",
      "en": "https://pegueiotexto.com.br/en/generate-srt-subtitles",
      "x-default": "https://pegueiotexto.com.br/en/generate-srt-subtitles",
    },
  },
  openGraph: {
    title: "AI Subtitle Generator (.SRT & .VTT) | Peguei o Texto",
    description: "Generate millimeter-precise .SRT subtitle files with millisecond timestamps in seconds. Free 5-minute trial!",
    url: "https://pegueiotexto.com.br/en/generate-srt-subtitles",
  },
};

const srtFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an .SRT file and what is it used for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The .SRT (SubRip Subtitle) format is the universal standard for video captions. It includes the verbatim spoken text alongside exact start and end timestamps (hours, minutes, seconds, and milliseconds) for when each line appears on screen."
      }
    },
    {
      "@type": "Question",
      "name": "Which video editors support .SRT files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Virtually all industry video editors support .SRT files, including CapCut, Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, and YouTube Studio."
      }
    },
    {
      "@type": "Question",
      "name": "Are subtitles already synchronized with the speech timing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our artificial intelligence identifies word pauses and speaker intervals with millisecond accuracy, ensuring zero drift throughout the video."
      }
    }
  ]
};

export default function GenerateSrtSubtitlesEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(srtFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.35)", color: "#67E8F9" }}>
                <FileCode size={14} color="#06B6D4" />
                Professional .SRT & .VTT Subtitle Generator
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Generate automatic .SRT subtitles <br />
              <span style={{ background: "linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                synchronized with Artificial Intelligence
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Upload your video or paste any internet link. Get ready-to-use .SRT files with millisecond timestamps formatted for CapCut, Premiere, or YouTube.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Millisecond-accurate timestamps
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 100% compatible with CapCut & Premiere
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes to test
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Paste video link or upload file to generate .SRT subtitles..." />
        </div>
      </section>

      {/* COMPATIBILITY SOFTWARE SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>Complete Compatibility</span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Built for industry-standard editing software</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginTop: "8px" }}>
              Simply drag and drop the exported .SRT file directly onto your editor&apos;s subtitle timeline.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              { name: "CapCut (Desktop & Mobile)", desc: "Import .SRT captions with 1 click and apply pre-made animations and dynamic text presets." },
              { name: "Adobe Premiere Pro", desc: "Native caption track support with full typographic control, stroke, and background styling." },
              { name: "DaVinci Resolve", desc: "Immediate sync on Resolve's dedicated subtitle track for studio-grade grading and rendering." },
              { name: "YouTube Studio", desc: "Upload the .SRT file directly to your video manager to enable official closed captions." }
            ].map((tool, i) => (
              <div key={i} className="glass-card" style={{ padding: "28px 20px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(6, 182, 212, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Scissors size={20} color="#06B6D4" />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>{tool.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>{tool.desc}</p>
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about Subtitle Generation</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "What is the difference between .SRT and .VTT files?",
                a: ".SRT is the universal standard for video editing software (Premiere, CapCut, DaVinci). .VTT (WebVTT) is the modern web standard used directly in HTML5 <video> players and web apps."
              },
              {
                q: "Can I edit the generated subtitles before downloading?",
                a: "Yes! You can review and edit text directly in the transcript editor before exporting your final .SRT or .DOCX files."
              },
              {
                q: "Does it support multiple languages?",
                a: "Yes, Peguei o Texto supports over 90 world languages with automatic language detection."
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
              Generate .SRT Subtitles Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
