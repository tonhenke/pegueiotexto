import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  Zap,
  Globe,
  Mic2,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Heart,
  Clock,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Peguei o Texto: High-Accuracy AI Transcription",
  description:
    "Discover the mission behind Peguei o Texto: an AI-driven video and audio transcription platform that saves professionals dozens of hours with 99% accuracy and zero media retention.",
  keywords: [
    "about peguei o texto",
    "ai audio transcription platform",
    "video to text converter",
    "transcribe youtube reels tiktok",
    "automated srt subtitle generator",
    "speech to text company",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/about-us",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/sobre-nos",
      "en": "https://pegueiotexto.com.br/en/about-us",
      "x-default": "https://pegueiotexto.com.br/en/about-us",
    },
  },
  openGraph: {
    title: "About Us | Peguei o Texto: AI Speech-to-Text",
    description:
      "Transforming hours of speech into clean text in seconds. Learn about our core pillars of accuracy, speed, and privacy.",
    url: "https://pegueiotexto.com.br/en/about-us",
  },
};

const stats = [
  { value: "+1,700", label: "Supported Platforms", sub: "YouTube, Reels, TikTok & more" },
  { value: "99%", label: "Transcription Accuracy", sub: "Optimized neural speech models" },
  { value: "< 30s", label: "Average Delivery Time", sub: "Ultra-fast cloud processing" },
  { value: "100%", label: "Privacy & Confidentiality", sub: "Zero media storage on servers" },
];

const pillars = [
  {
    icon: <Globe size={24} />,
    color: "#7C3AED",
    title: "Multilingual Neural Models",
    desc: "Trained on massive speech corpora across 90+ languages, our AI understands accents, colloquial idioms, technical jargon, and automatically punctuates every sentence.",
  },
  {
    icon: <Zap size={24} />,
    color: "#06B6D4",
    title: "Instant Cloud Processing",
    desc: "Turn a 60-minute conference or interview into text in under 60 seconds. Say goodbye to painful real-time listening and manual typing.",
  },
  {
    icon: <Shield size={24} />,
    color: "#10B981",
    title: "Absolute Zero Retention Privacy",
    desc: "Your files belong to you. Audio and video streams are processed in memory and permanently deleted immediately after transcription finishes.",
  },
  {
    icon: <FileText size={24} />,
    color: "#F59E0B",
    title: "Export in Formats That Matter",
    desc: "From .DOCX Word documents and clean PDFs to synced .SRT subtitles for CapCut and Adobe Premiere, get files ready for immediate use.",
  },
];

const audiences = [
  {
    icon: <Users size={22} color="#A78BFA" />,
    title: "Content Creators & Editors",
    desc: "Extract spoken scripts from viral videos, generate .SRT subtitles for CapCut, and turn videos into newsletters and LinkedIn carousels.",
  },
  {
    icon: <Award size={22} color="#06B6D4" />,
    title: "Lawyers & Legal Counsel",
    desc: "Transcribe court hearings, witness testimonies, and client consultations with synced timestamps and strict privacy compliance.",
  },
  {
    icon: <Heart size={22} color="#10B981" />,
    title: "Researchers & Academics",
    desc: "Transcribe dissertation interviews, focus groups, and field recordings with verbatim precision for qualitative research.",
  },
  {
    icon: <Layers size={22} color="#F59E0B" />,
    title: "Founders & Corporate Teams",
    desc: "Convert Zoom, Google Meet, and Teams recordings into concise executive summaries and actionable task checklists.",
  },
];

export default function AboutUsEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ paddingTop: "140px", paddingBottom: "70px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(124, 58, 237, 0.12)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              color: "#C4B5FD",
              fontSize: "0.88rem",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            <Sparkles size={16} />
            <span>Our Story & Mission</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            Turning audio into actionable text <br />
            <span className="text-gradient">in seconds with AI</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 720,
              margin: "0 auto 40px",
            }}
          >
            Peguei o Texto was founded to liberate professionals, creators, and researchers from tedious manual transcription, delivering studio-grade accuracy and instant productivity.
          </p>

          {/* Stats Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
              maxWidth: "960px",
              margin: "0 auto",
            }}
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "24px 20px",
                  borderRadius: "18px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(19, 18, 45, 0.5)",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--brand-violet-light)", marginBottom: "4px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "14px" }}>
              Core Values
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                marginBottom: "14px",
              }}
            >
              Why thousands of users trust <span className="text-gradient">Peguei o Texto</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              Built from day one with three unwavering priorities: accuracy, speed, and privacy.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "32px",
                  borderRadius: "20px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(19, 18, 45, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${pillar.color}20`,
                    border: `1px solid ${pillar.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: pillar.color,
                  }}
                >
                  {pillar.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {pillar.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE SECTION */}
      <section style={{ padding: "80px 0", background: "rgba(0, 0, 0, 0.2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 56px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "14px" }}>
              Who It&apos;s For
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                marginBottom: "14px",
              }}
            >
              Designed for people who value their <span className="text-gradient">time</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
              See how Peguei o Texto accelerates workflows across different industries every day.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {audiences.map((aud, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: "28px",
                  borderRadius: "18px",
                  border: "1px solid var(--border-subtle)",
                  background: "rgba(19, 18, 45, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ marginBottom: "6px" }}>{aud.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {aud.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  {aud.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "80px 0 100px" }}>
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.18))",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              borderRadius: "28px",
              padding: "clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              Start saving hours of manual work today
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "16px",
                maxWidth: "600px",
                margin: "0 auto 32px",
                lineHeight: "1.7",
              }}
            >
              Create your account now and get <strong>5 free minutes</strong> to test the accuracy and speed of Peguei o Texto. No credit card required.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <Link
                href="/login?signup=true"
                className="btn-primary"
                style={{
                  padding: "14px 32px",
                  fontSize: "15px",
                  fontWeight: 700,
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <Sparkles size={18} /> Get Started Free
              </Link>
              <Link
                href="/en/pricing"
                className="btn-secondary"
                style={{
                  padding: "14px 28px",
                  fontSize: "15px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                View Plans & Pricing <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

