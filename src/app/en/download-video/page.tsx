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
  title: "Free Online Video Downloader: YouTube, TikTok (No Watermark) & Instagram | Peguei o Texto",
  description:
    "Download MP4 HD videos and extract MP3 audio from YouTube, TikTok (no watermark), Instagram Reels, and LinkedIn. Clean, 100% free, zero intrusive popups, with 1-click AI transcription.",
  keywords: [
    "free video downloader",
    "download youtube video",
    "tiktok downloader no watermark",
    "download instagram reels",
    "youtube to mp3 converter",
    "save video online free",
    "transcribe downloaded video",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/download-video",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/baixar-video",
      "en": "https://pegueiotexto.com.br/en/download-video",
    },
  },
  openGraph: {
    title: "Free Video Downloader: YouTube, TikTok & Reels in MP4 HD | Peguei o Texto",
    description:
      "Fast, clean and secure video downloader for YouTube, TikTok without watermark, and Reels. Zero annoying popups.",
    url: "https://pegueiotexto.com.br/en/download-video",
    locale: "en_US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Peguei o Texto - Web Video Downloader",
      "url": "https://pegueiotexto.com.br/en/download-video",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Free web tool to download MP4 HD videos and MP3 audio from YouTube, TikTok without watermark, Instagram Reels and LinkedIn.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1280",
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
      "@type": "HowTo",
      "name": "How to Download Web Videos Online for Free",
      "description": "Simple 3-step guide to download online videos in MP4 HD and MP3.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Copy the video URL",
          "text": "Open YouTube, TikTok, or Instagram and click 'Share' to copy the video link.",
          "position": 1,
        },
        {
          "@type": "HowToStep",
          "name": "Paste into Peguei o Texto",
          "text": "Paste the copied URL in the input bar and click 'Search Video'.",
          "position": 2,
        },
        {
          "@type": "HowToStep",
          "name": "Download MP4 or MP3",
          "text": "Click the download button to save the MP4 HD video without watermark or extract the MP3 audio.",
          "position": 3,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is it free to download videos with Peguei o Texto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Downloading MP4 videos and extracting MP3 audio from public platforms is 100% free without any software installation.",
          },
        },
        {
          "@type": "Question",
          "name": "How to download TikTok videos without watermark?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply paste the TikTok link into our search bar. Our engine fetches the original HD media file without the floating logo or end watermark.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I transcribe the video into text and CapCut subtitles?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Right below your download results, click 'Transcribe this Video with AI Now'. Our AI generates synced .SRT subtitles and summaries in seconds.",
          },
        },
      ],
    },
  ],
};

export default function EnglishDownloadVideoPage() {
  return (
    <>
      <Script
        id="adsbygoogle-init-en-dl"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1974829355929040"
        crossOrigin="anonymous"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main style={{ minHeight: "100vh", padding: "120px 0 80px", position: "relative" }}>
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 80%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Top Leaderboard AdSense Slot */}
          <AdsenseBanner format="leaderboard" slot="1000000001" />

          {/* Hero Header */}
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 36px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#a5b4fc",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              <Flame size={15} color="#ec4899" />
              <span>Fast Online Video & Audio Downloader</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(28px, 4.5vw, 48px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: "1.15",
                marginBottom: "16px",
                color: "#ffffff",
              }}
            >
              Download Videos in{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MP4 HD & MP3 Audio
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(15px, 2vw, 18px)",
                color: "var(--text-muted, #94a3b8)",
                lineHeight: "1.6",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Save videos from <strong>YouTube, TikTok (no watermark), Instagram Reels, Facebook & LinkedIn</strong> without installing apps and without annoying popups.
            </p>
          </div>

          {/* Video Downloader Widget */}
          <VideoDownloader placeholder="Paste video link here (YouTube, TikTok, Instagram Reels, etc.)..." />

          {/* Features Highlights Grid */}
          <section style={{ margin: "80px 0 60px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6366f1" }}>
                Exclusive Advantages
              </span>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginTop: "8px" }}>
                Why use Peguei o Texto Downloader?
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "20px",
                maxWidth: "1000px",
                margin: "0 auto",
              }}
            >
              <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <ShieldCheck size={22} color="#10b981" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Zero Popups & Spam</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Most traditional download sites bombard you with malicious redirects and casino popups. Here your link is clean, direct and safe.
                </p>
              </div>

              <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(236, 72, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Zap size={22} color="#ec4899" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>TikTok No Watermark</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Download TikTok videos in crystal-clear MP4 HD without the floating logo and without the ending ID credit scene.
                </p>
              </div>

              <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <Sparkles size={22} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Connected with AI</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                  Don&apos;t keep dead files on your hard drive: convert any video into .SRT subtitles, executive bullet points, and social drafts with 1 click.
                </p>
              </div>
            </div>
          </section>

          {/* 3 Steps Guide */}
          <section
            style={{
              padding: "48px 32px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              maxWidth: "1000px",
              margin: "0 auto 60px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
                How to download videos in 3 simple steps
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted, #94a3b8)" }}>
                Works seamlessly directly in your mobile or desktop browser without software installations.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff", fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  1
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Copy Video URL</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Open YouTube, TikTok, Instagram or LinkedIn and click &quot;Share&quot; to copy the link.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", color: "#fff", fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  2
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Paste and Search</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Paste the link into the search bar above and click &quot;Search Video&quot; to extract media options.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899 0%, #10b981 100%)", color: "#fff", fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  3
                </span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Download or Transcribe</h4>
                  <p style={{ fontSize: "13px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.5" }}>
                    Save the MP4 HD / MP3 or click to extract full text and CapCut subtitles with AI in seconds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom AdSense Banner */}
          <AdsenseBanner format="leaderboard" slot="1000000003" />

          {/* FAQ Section */}
          <section style={{ maxWidth: "800px", margin: "40px auto 0" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#a5b4fc", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                <HelpCircle size={16} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff" }}>
                Questions About Video Downloads
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                {
                  q: "Is downloading videos with Peguei o Texto really free?",
                  a: "Yes, downloading MP4 videos and extracting MP3 audio is completely free without limits or credit card requirements.",
                },
                {
                  q: "How to download TikTok without watermark?",
                  a: "Simply paste the link of any TikTok video. Our system fetches the clean source video before any overlay logos or watermarks were stamped.",
                },
                {
                  q: "Does it work on mobile phones (iPhone or Android)?",
                  a: "Yes! The platform is 100% mobile-ready in Safari and Chrome. On iPhone, simply tap download and save directly to your Files or Photos app.",
                },
                {
                  q: "How do I extract text and subtitles with AI?",
                  a: "Click 'Transcribe this Video with AI Now' right after searching. You'll be redirected with the URL prefilled to receive accurate text, timestamps, and .SRT subtitle files.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    cursor: "pointer",
                  }}
                >
                  <summary style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", listStyle: "none" }}>
                    <span>{faq.q}</span>
                    <span style={{ color: "#a5b4fc", fontSize: "16px" }}>+</span>
                  </summary>
                  <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-muted, #94a3b8)", lineHeight: "1.6" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
