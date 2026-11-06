import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdsenseBanner from "@/components/AdsenseBanner";
import VideoDownloader from "@/components/VideoDownloader";
import Link from "next/link";
import Script from "next/script";
import {
  Download,
  Video,
  Music,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Download Instagram Reels Free: MP4 Full HD & Audio | Peguei o Texto",
  description:
    "Download Instagram Reels, feed videos, and Stories in MP4 Full HD. 100% free, no password required, no intrusive popups, with 1-click AI transcription option.",
  keywords: [
    "download instagram reels",
    "instagram reels downloader",
    "save instagram reels to camera roll",
    "download instagram video mp4",
    "free instagram reels saver",
    "instagram video download online",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/download-instagram-reels",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/baixar-reels-instagram",
      "en": "https://pegueiotexto.com.br/en/download-instagram-reels",
      "x-default": "https://pegueiotexto.com.br/en/download-instagram-reels",
    },
  },
  openGraph: {
    title: "Download Instagram Reels in MP4 Full HD | Peguei o Texto",
    description:
      "Save Instagram Reels directly to your camera roll in clean MP4 HD. Fast, safe, and no annoying popups.",
    url: "https://pegueiotexto.com.br/en/download-instagram-reels",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Instagram Reels Downloader - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/en/download-instagram-reels",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Free web tool to download Instagram Reels and videos in high-definition MP4 without intrusive ads.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1190",
        "bestRating": "5",
        "worstRating": "1",
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I download an Instagram Reel to my phone?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Open Instagram, tap the paper airplane or three dots on the Reel, and click 'Copy link'. Paste into the box above and click 'Search Video' to download MP4 directly to your device storage.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I need to log into my Instagram account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No! Peguei o Texto never asks for your password or credentials. Simply paste the link from any public Reel.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I save the Reel with audio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! The video downloads in high quality with full audio synchronization, or you can extract just the MP3 audio file.",
          },
        },
      ],
    },
  ],
};

export default function DownloadInstagramReelsEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <Script
        id="reels-downloader-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(225, 48, 108, 0.22) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(225, 48, 108, 0.15)", border: "1px solid rgba(225, 48, 108, 0.35)", color: "#F472B6", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
              <Flame size={14} color="#E1306C" />
              Instagram Reels Downloader • 100% Free & Fast
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Download Instagram Reels <br />
              <span style={{ background: "linear-gradient(135deg, #F59E0B, #E1306C, #833AB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                in MP4 Full HD with audio
              </span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Save any public Reel directly to your gallery or camera roll. Clean downloads with zero popups and 1-click AI subtitle option.
            </p>
          </div>

          {/* Downloader Widget */}
          <VideoDownloader placeholder="Paste Instagram Reel link (instagram.com/reel/...)..." />

          {/* Ad banner placeholder */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
            <AdsenseBanner slot="downloader-top-en" format="leaderboard" />
          </div>
        </div>
      </section>

      {/* 3 STEPS SECTION */}
      <section style={{ padding: "60px 0", borderTop: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{ color: "#E1306C", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Easy Steps
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px" }}>
              How to save Instagram Reels to your gallery
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(225, 48, 108, 0.3)", marginBottom: "8px" }}>01</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Copy the Reel URL</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                In the Instagram app or website, tap the paper airplane or 3 dots and tap &apos;Copy link&apos;.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(225, 48, 108, 0.3)", marginBottom: "8px" }}>02</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Paste in Search Bar</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Paste the URL into our downloader above and click &apos;Search Video&apos;.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(225, 48, 108, 0.3)", marginBottom: "8px" }}>03</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Download MP4</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Click Download to save the video with audio directly to your camera roll or downloads folder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-purple" style={{ marginBottom: "12px" }}>FAQ</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Frequently Asked Questions about Instagram Reels</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "Can I download Reels from private accounts?",
                a: "No. For privacy and compliance with Meta's terms, only public videos can be fetched."
              },
              {
                q: "Can I save Reels directly to iPhone Camera Roll?",
                a: "Yes! Open Safari on iPhone, download the MP4 file, and tap 'Save Video' to place it into your Photos app."
              },
              {
                q: "Can I transcribe the Reel voiceover?",
                a: "Yes! Click 'Transcribe Video with AI' to generate the script, carousels, or .SRT subtitles in seconds."
              }
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: "20px 24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>{item.q}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA Bottom */}
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/en/transcribe-instagram" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Need the exact script of an Instagram Reel? Try AI Transcriber <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
