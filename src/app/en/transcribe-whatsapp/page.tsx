import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranscribeForm from "@/components/TranscribeForm";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap, Shield, FileText, ArrowRight, Smartphone, Lock, Share2 } from "lucide-react";

const WhatsAppIcon = ({ size = 20, color = "#25D366" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Transcribe WhatsApp Voice Notes to Text Online with AI | Peguei o Texto",
  description:
    "Convert long WhatsApp voice messages (.opus, .ogg, .m4a) into clean, punctuated text and AI summaries in seconds. 100% private with zero retention. Try 5 minutes free!",
  keywords: [
    "transcribe whatsapp audio",
    "whatsapp voice note to text",
    "convert whatsapp audio to text",
    "read whatsapp voice message",
    "summarize whatsapp audio",
    "opus to text converter",
    "transcribe voice message online",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/transcribe-whatsapp",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/transcrever-whatsapp",
      "en": "https://pegueiotexto.com.br/en/transcribe-whatsapp",
      "x-default": "https://pegueiotexto.com.br/en/transcribe-whatsapp",
    },
  },
  openGraph: {
    title: "Transcribe WhatsApp Voice Notes to Text with AI | Peguei o Texto",
    description: "No time to listen to 10-minute voice notes? Read them in seconds with AI punctuation and summaries. Free trial!",
    url: "https://pegueiotexto.com.br/en/transcribe-whatsapp",
  },
};

const whatsappFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I transcribe a WhatsApp voice note into text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply share or download the voice note from WhatsApp on your mobile or desktop, and drop it into the Peguei o Texto file uploader. Our neural AI natively parses .opus and .ogg audio formats and generates accurate text in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Does it support long voice messages over 10 or 20 minutes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Unlike browser extensions that crash on longer audio, our cloud infrastructure seamlessly processes voice notes and audio memos of any length."
      }
    },
    {
      "@type": "Question",
      "name": "Are my voice notes and conversations kept private?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, absolutely. Under our zero-retention privacy policy, audio files are processed in memory and permanently deleted immediately after transcription. Only you have access to the output."
      }
    },
    {
      "@type": "Question",
      "name": "Can I generate an executive summary with action items?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! In addition to full verbatim transcription, you can generate an AI Summary that highlights key takeaways and creates an action item checklist."
      }
    }
  ]
};

export default function TranscribeWhatsAppEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(whatsappFaqSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "60px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(37, 211, 102, 0.22) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <span className="badge" style={{ background: "rgba(37, 211, 102, 0.15)", border: "1px solid rgba(37, 211, 102, 0.35)", color: "#86EFAC" }}>
                <WhatsAppIcon size={15} color="#25D366" />
                WhatsApp Voice Notes & Audio Transcriber
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              Transcribe WhatsApp voice notes <br />
              <span style={{ background: "linear-gradient(135deg, #25D366, #10B981, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                to text in seconds with AI
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto 32px", lineHeight: 1.6 }}>
              In a meeting or loud environment and can&apos;t listen to a 10-minute voice message? Upload the audio or drag the file to read everything with <strong>clean punctuation</strong> and <strong>executive summaries</strong>.
            </p>

            {/* Quick stats pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Native support for .OPUS, .OGG & .M4A
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> 5 free minutes with no card
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={14} color="#10B981" /> Audio deleted instantly (100% confidential)
              </span>
            </div>
          </div>

          {/* Form */}
          <TranscribeForm initialPlaceholder="Upload WhatsApp audio file (.opus, .ogg, .m4a) or paste a link..." />
        </div>
      </section>

      {/* HOW TO EXPORT FROM WHATSAPP SECTION */}
      <section style={{ padding: "70px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "#25D366", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "8px" }}>
              How to export audio from WhatsApp in 3 steps
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Fast and straightforward from your phone or WhatsApp Web on desktop.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            <div className="card" style={{ padding: "28px", border: "1px solid rgba(37, 211, 102, 0.2)" }}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "rgba(37, 211, 102, 0.3)", marginBottom: "12px" }}>
                01
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Smartphone size={18} color="#25D366" /> Share the Audio
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                In WhatsApp, tap and hold the voice message, choose &apos;Forward&apos; or &apos;Share&apos;, and save it to your device files or downloads.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", border: "1px solid rgba(37, 211, 102, 0.2)" }}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "rgba(37, 211, 102, 0.3)", marginBottom: "12px" }}>
                02
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Zap size={18} color="#25D366" /> Drop File Above
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Switch to &apos;Upload file&apos; tab on Peguei o Texto and drop the .opus or .ogg file. Our neural speech AI processes it instantly.
              </p>
            </div>

            <div className="card" style={{ padding: "28px", border: "1px solid rgba(37, 211, 102, 0.2)" }}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "rgba(37, 211, 102, 0.3)", marginBottom: "12px" }}>
                03
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={18} color="#25D366" /> Read & Export
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                Get the full verbatim text with correct punctuation, generate an AI summary, and export to .TXT or Word .DOCX.
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
            <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions about WhatsApp Transcription</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "What is an .opus file from WhatsApp?",
                a: "OPUS is WhatsApp's default compressed audio format for voice notes. Peguei o Texto includes native decoder support for OPUS, OGG, and M4A with zero conversion delay."
              },
              {
                q: "Can I use it on WhatsApp Web from my computer?",
                a: "Yes! In WhatsApp Web, click the arrow on any voice message, select 'Download', and drag the file directly into our uploader."
              },
              {
                q: "Is it safe for business and confidential client notes?",
                a: "Absolutely. All files are encrypted in transit and purged immediately after processing. We never use client voice notes to train AI models."
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
              Transcribe WhatsApp Voice Note Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

