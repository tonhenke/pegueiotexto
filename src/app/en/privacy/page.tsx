import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Shield,
  Lock,
  Trash2,
  FileText,
  CheckCircle2,
  Mail,
  Scale,
  EyeOff,
  Server,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Peguei o Texto",
  description:
    "Learn how Peguei o Texto protects your data and confidentiality. Zero media retention policy: uploaded audio and video files are permanently deleted immediately after transcription.",
  keywords: [
    "privacy policy peguei o texto",
    "zero retention audio transcription",
    "ai transcription security",
    "confidential transcription service",
    "data protection terms",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/privacy",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/privacidade",
      "en": "https://pegueiotexto.com.br/en/privacy",
      "x-default": "https://pegueiotexto.com.br/en/privacy",
    },
  },
  openGraph: {
    title: "Privacy Policy | Peguei o Texto",
    description:
      "Strict zero media storage policy. Your audio and video files are permanently deleted after transcription.",
    url: "https://pegueiotexto.com.br/en/privacy",
  },
};

export default function PrivacyEnglishPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <section style={{ paddingTop: "140px", paddingBottom: "100px", position: "relative" }}>
        {/* Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "350px",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "860px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div
              className="badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                marginBottom: "20px",
                borderRadius: "9999px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#34D399",
              }}
            >
              <Shield size={14} /> Privacy & Data Protection
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: "16px",
              }}
            >
              Privacy <span className="text-gradient">Policy</span>
            </h1>

            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Last updated: {lastUpdated} • GDPR & Global Compliance
            </p>
          </div>

          {/* Quick Summary Card */}
          <div
            className="glass-card"
            style={{
              padding: "28px 32px",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              background: "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(124,58,237,0.05))",
              marginBottom: "56px",
            }}
          >
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Lock size={18} color="#10B981" /> 1-Minute Summary: Our Core Commitments
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Zero media retention:</strong> Your audio and video files are permanently deleted immediately after transcription finishes.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>No AI training on your data:</strong> Your confidential content is never used to train or fine-tune third-party generative models.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Full control:</strong> You can delete any transcript from your dashboard or remove your entire account at any time.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Encrypted in transit:</strong> End-to-end HTTPS/TLS encrypted connections protect all communications.
                </span>
              </div>
            </div>
          </div>

          {/* Policy Document Content */}
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: "1.8",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* 1. GENERAL INFORMATION */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Scale size={20} color="#7C3AED" /> 1. General Information & Data Controller
              </h2>
              <p style={{ marginBottom: "12px" }}>
                This Privacy Policy describes transparently how <strong>Peguei o Texto</strong> (available at <Link href="/en" style={{ color: "#06B6D4", textDecoration: "none" }}>https://pegueiotexto.com.br/en</Link>) collects, processes, and protects user data.
              </p>
              <p>
                By using our platform, you acknowledge the terms outlined here, crafted in strict compliance with global privacy regulations including GDPR and LGPD.
              </p>
            </section>

            {/* 2. DATA WE COLLECT */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <UserCheck size={20} color="#06B6D4" /> 2. Data We Collect
              </h2>
              <p style={{ marginBottom: "14px" }}>
                We collect only the minimum necessary information required to operate our service:
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Account & Authentication Data:</strong> When registering or logging in with Google OAuth, we receive your name, email address, and user ID to manage access and minutes balance.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Transcript Text History:</strong> Transcribed text is stored in your private dashboard for reading, editing, and downloading. You may permanently delete transcripts anytime.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Payment Records:</strong> Records of purchased minute packs, transaction dates, and status. Credit card details are handled directly by PCI-compliant payment gateways and are never stored on our servers.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Anonymous Performance Analytics:</strong> Aggregate technical diagnostics (browser type, load times, error logs) to maintain infrastructure reliability.
                </li>
              </ul>
            </section>

            {/* 3. ZERO RETENTION POLICY */}
            <section
              style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                padding: "28px",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#F87171",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Trash2 size={20} /> 3. What We Do NOT Store (Zero Retention Policy)
              </h2>
              <p style={{ marginBottom: "12px", color: "var(--text-primary)" }}>
                <strong>Your media files are never preserved.</strong> We maintain a strict deletion protocol:
              </p>
              <ul style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>
                  <strong>Uploaded Files (MP3, MP4, WAV, M4A, etc.):</strong> Processed in isolated temporary containers and <strong>permanently purged</strong> immediately once transcription is delivered.
                </li>
                <li>
                  <strong>Public Media Links (YouTube, Reels, TikTok):</strong> Audio streams are parsed on the fly. No video or audio tracks are kept on disk.
                </li>
                <li>
                  <strong>Zero AI Model Training:</strong> Your files and generated transcripts are never used to train or fine-tune public foundation AI models.
                </li>
              </ul>
            </section>

            {/* 4. CONTACT */}
            <section>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Mail size={20} color="#10B981" /> 4. Contact & Data Privacy Officer
              </h2>
              <p style={{ marginBottom: "12px" }}>
                If you have questions regarding this Privacy Policy or wish to request data deletion, contact us at:
              </p>
              <p>
                <a href="mailto:contato@pegueiotexto.com.br" style={{ color: "#06B6D4", textDecoration: "none", fontWeight: 600 }}>
                  contato@pegueiotexto.com.br
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
