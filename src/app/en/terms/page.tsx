import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Peguei o Texto",
  description:
    "General Terms and Conditions of Service for the Peguei o Texto platform. Review user rights, acceptable use policies, and subscription terms for AI transcription.",
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/terms",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/termos-de-uso",
      "en": "https://pegueiotexto.com.br/en/terms",
      "x-default": "https://pegueiotexto.com.br/en/terms",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsEnglishPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        color: "#111827",
        minHeight: "100vh",
        padding: "48px 20px 80px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "48px 40px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Official Document • Terms and Conditions of Service
            </span>
            <Link
              href="/en"
              style={{
                fontSize: "13px",
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              ← Back to homepage
            </Link>
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: "0 0 8px 0" }}>
            Peguei o Texto Terms of Service
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            Last updated: {lastUpdated} • Version 1.0
          </p>
        </div>

        {/* Document Body */}
        <div style={{ fontSize: "15px", color: "#374151" }}>
          <p style={{ marginBottom: "20px" }}>
            Welcome to <strong>Peguei o Texto</strong> (accessible at{" "}
            <a href="https://pegueiotexto.com.br/en" style={{ color: "#4f46e5", textDecoration: "underline" }}>
              https://pegueiotexto.com.br/en
            </a>
            ). This document sets out the Terms of Service governing the use of our automated audio and video transcription platform powered by artificial intelligence.
          </p>

          <p style={{ marginBottom: "24px", padding: "12px 16px", backgroundColor: "#f3f4f6", borderRadius: "6px", borderLeft: "4px solid #4f46e5" }}>
            <strong>Notice:</strong> By accessing, signing up for, or using any feature on Peguei o Texto, you acknowledge that you have read, understood, and agreed to these Terms of Service and our{" "}
            <Link href="/en/privacy" target="_blank" style={{ color: "#4f46e5", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
            . If you do not agree with any part of these terms, please do not use the platform.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            1. Definitions
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Platform / Service:</strong> The website and technological tools available under pegueiotexto.com.br.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>User:</strong> Any individual or entity accessing or utilizing the platform services, whether free or paid.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Input Media:</strong> Audio or video files uploaded directly or referenced via public URLs from third-party platforms (e.g., YouTube, Instagram, TikTok).
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Transcript:</strong> Written text generated from speech-to-text artificial intelligence models.
            </li>
          </ul>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            2. Description of Services
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Peguei o Texto is an online productivity tool that converts audio and video media into formatted text using deep neural speech recognition.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Users can export transcripts as plain text (.TXT), time-coded subtitles (.SRT), or formatted Word (.DOCX) and PDF files, subject to their plan&apos;s available minute balance.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            3. Account Registration & Security
          </h2>
          <p style={{ marginBottom: "12px" }}>
            To purchase additional minutes and maintain transcript history, users may register an account using email or Google OAuth Single Sign-On.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Users are responsible for maintaining the confidentiality of their credentials and all activities occurring under their account.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            4. Acceptable Use Policy
          </h2>
          <p style={{ marginBottom: "12px" }}>
            You agree not to use the platform to transcribe unlawful, defamatory, infringing, or malicious content, nor to attempt to reverse engineer or disrupt platform infrastructure.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginTop: "32px", marginBottom: "12px", borderBottom: "1px solid #f3f4f6", paddingBottom: "6px" }}>
            5. Contact Information
          </h2>
          <p style={{ marginBottom: "12px" }}>
            For legal inquiries regarding these Terms of Service, contact us at{" "}
            <a href="mailto:contato@pegueiotexto.com.br" style={{ color: "#4f46e5", textDecoration: "underline" }}>
              contato@pegueiotexto.com.br
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

