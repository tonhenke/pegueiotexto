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
  title: "Download TikTok Videos Without Watermark: MP4 HD & MP3 | Peguei o Texto",
  description:
    "Download TikTok videos without watermark (no logo) in MP4 Full HD and extract MP3 audio. Fast, clean SnapTik alternative, 100% free with no annoying popups and 1-click AI transcription.",
  keywords: [
    "download tiktok video without watermark",
    "tiktok downloader no watermark",
    "save tiktok without logo",
    "snaptik alternative",
    "download tiktok mp4 hd",
    "extract audio from tiktok mp3",
    "free tiktok video downloader",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/download-tiktok-video",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/baixar-video-tiktok",
      "en": "https://pegueiotexto.com.br/en/download-tiktok-video",
      "x-default": "https://pegueiotexto.com.br/en/download-tiktok-video",
    },
  },
  openGraph: {
    title: "Download TikTok Without Watermark in MP4 HD | Peguei o Texto",
    description:
      "Remove TikTok watermark automatically. Download in crisp MP4 HD with no popups and optional 1-click AI transcription.",
    url: "https://pegueiotexto.com.br/en/download-tiktok-video",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "TikTok Video Downloader Without Watermark - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/en/download-tiktok-video",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Free web tool to download TikTok videos without watermark in Full HD MP4 and extract MP3 audio without intrusive popups.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1510",
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
          "name": "How do I download a TikTok video without the watermark?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Open TikTok, tap 'Share' and choose 'Copy link'. Paste the link into the box above and click 'Search Video'. Our server strips the TikTok logo and gives you a clean MP4 HD download.",
          },
        },
        {
          "@type": "Question",
          "name": "Is it free to download TikTok videos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, 100% free with no hidden fees or download quotas.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I extract the audio or background music in MP3?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can download just the MP3 audio track or convert the spoken video into text with AI.",
          },
        },
      ],
    },
  ],
};

export default function DownloadTikTokVideoEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <Script
        id="tiktok-downloader-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(0, 242, 234, 0.2) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" style={{ background: "radial-gradient(circle, rgba(254, 44, 85, 0.2) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
              <Flame size={14} color="#00F2FE" />
              TikTok Downloader • No Watermark • Clean & Free
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Download TikTok videos <br />
              <span style={{ background: "linear-gradient(135deg, #00F2FE, #4FACFE, #FE2C55)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                without watermark in MP4 HD
              </span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Remove the TikTok floating logo automatically. Save clean MP4 videos and MP3 audio files directly to your phone or computer.
            </p>
          </div>

          {/* Downloader Widget */}
          <VideoDownloader placeholder="Paste TikTok video link (tiktok.com/@user/video/... or vm.tiktok.com)..." />

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
            <span style={{ color: "#00F2FE", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px" }}>
              How to download TikTok videos without watermark
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(0, 242, 234, 0.3)", marginBottom: "8px" }}>01</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Copy Link from TikTok</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                In the TikTok app or browser, tap &apos;Share&apos; and select &apos;Copy link&apos;.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(0, 242, 234, 0.3)", marginBottom: "8px" }}>02</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Paste in Downloader</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Paste the URL into the input field above and click &apos;Search Video&apos;.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(0, 242, 234, 0.3)", marginBottom: "8px" }}>03</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Save Clean Video</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Download the MP4 file without watermark or extract the audio in MP3 with 1 click.
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
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Frequently Asked Questions about TikTok Downloads</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "Does it work with short links like vm.tiktok.com?",
                a: "Yes! Peguei o Texto supports both short links from the mobile app (vm.tiktok.com, vt.tiktok.com) and full desktop URLs."
              },
              {
                q: "Do I have to install any apps or browser extensions?",
                a: "No! The downloader runs completely online in any browser on iPhone, Android, Windows, and Mac."
              },
              {
                q: "Can I transcribe TikTok speech to text after downloading?",
                a: "Yes! Simply tap 'Transcribe Video with AI' right under the download options to get full captions and text."
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
            <Link href="/en/transcribe-tiktok" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Looking to extract the TikTok script? Use our AI Transcriber <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
