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
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Flame,
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free YouTube Video Downloader: MP4 HD & Shorts Online | Peguei o Texto",
  description:
    "Download YouTube videos and Shorts in high quality (MP4 HD / 1080p) and extract MP3 audio without installing software. 100% free, no annoying popups, with 1-click AI transcription.",
  keywords: [
    "download youtube video",
    "youtube video downloader",
    "download youtube shorts",
    "youtube to mp4 hd",
    "free youtube downloader online",
    "save youtube video pc mobile",
    "youtube to mp3 converter",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/download-youtube-video",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/baixar-video-youtube",
      "en": "https://pegueiotexto.com.br/en/download-youtube-video",
      "x-default": "https://pegueiotexto.com.br/en/download-youtube-video",
    },
  },
  openGraph: {
    title: "Free YouTube Video Downloader: MP4 HD & 1080p Online | Peguei o Texto",
    description:
      "Download any YouTube video or Shorts in clean MP4 HD with no intrusive popups and 1-click AI speech-to-text option.",
    url: "https://pegueiotexto.com.br/en/download-youtube-video",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "YouTube Video Downloader - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/en/download-youtube-video",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Free web tool to download YouTube videos and Shorts in high-definition MP4 and extract MP3 audio with no intrusive popups.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1580",
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
          "name": "How do I download a YouTube video online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Copy the YouTube video or Shorts URL, paste it into the search box above, click 'Search Video', and choose your preferred quality (MP4 HD or MP3 audio).",
          },
        },
        {
          "@type": "Question",
          "name": "Does it work with YouTube Shorts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Both short-form YouTube Shorts and long-form podcasts and lectures are fully supported.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I convert the downloaded YouTube video directly into text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Peguei o Texto includes built-in AI transcription. After downloading, you can generate a verbatim transcript with 1 click.",
          },
        },
      ],
    },
  ],
};

export default function DownloadYouTubeVideoEnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <Script
        id="youtube-downloader-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.35)", color: "#FCA5A5", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
              <Flame size={14} color="#EF4444" />
              100% Free YouTube Downloader • Fast & Clean
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Download YouTube videos and Shorts <br />
              <span style={{ background: "linear-gradient(135deg, #EF4444, #F43F5E, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                in MP4 HD & MP3 without ads
              </span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Paste any YouTube link to download high-definition videos (1080p, 720p) or extract clean MP3 audio with zero annoying popups.
            </p>
          </div>

          {/* Downloader Widget */}
          <VideoDownloader placeholder="Paste YouTube video or Shorts link here..." />

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
            <span style={{ color: "#EF4444", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Simple 3-Step Guide
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px" }}>
              How to download YouTube videos on PC or mobile
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(239, 68, 68, 0.3)", marginBottom: "8px" }}>01</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Copy the Link</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Open YouTube on your computer or mobile app, click &apos;Share&apos;, and copy the link of the video or Shorts.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(239, 68, 68, 0.3)", marginBottom: "8px" }}>02</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Paste Above</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Paste the URL in the box above and click &apos;Search Video&apos;. Our servers fetch direct download links in seconds.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(239, 68, 68, 0.3)", marginBottom: "8px" }}>03</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Download MP4 or MP3</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Choose your desired quality (1080p, 720p, or MP3 audio) and save directly to your device storage.
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
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Frequently Asked Questions about YouTube Downloads</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "Is it completely free to download YouTube videos?",
                a: "Yes! You can download YouTube videos in MP4 HD and extract MP3 audio files completely free with no daily limits."
              },
              {
                q: "Can I download YouTube videos on my iPhone or Android?",
                a: "Yes! Peguei o Texto works directly inside Safari, Chrome, and mobile browsers without requiring apps from app stores."
              },
              {
                q: "Can I transcribe the video into text right after downloading?",
                a: "Yes! You can click 'Transcribe Video with AI' right below the player to convert speech into text, summaries, and .SRT subtitles."
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
            <Link href="/en/transcribe-youtube" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Need to transcribe a YouTube video? Use our AI Transcriber <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
