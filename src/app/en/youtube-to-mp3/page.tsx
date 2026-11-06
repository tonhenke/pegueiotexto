import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdsenseBanner from "@/components/AdsenseBanner";
import VideoDownloader from "@/components/VideoDownloader";
import Link from "next/link";
import Script from "next/script";
import {
  Download,
  Music,
  Headphones,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Flame,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free YouTube to MP3 Converter: High-Quality Audio Downloader | Peguei o Texto",
  description:
    "Convert and download YouTube videos, podcasts, and music into high-bitrate MP3 audio online. 100% free, no installation, no popups, with 1-click AI audio-to-text transcription.",
  keywords: [
    "youtube to mp3 converter",
    "download youtube audio mp3",
    "convert youtube video to audio",
    "free youtube to mp3 online",
    "extract audio from youtube",
    "youtube podcast mp3 download",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/youtube-to-mp3",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/baixar-audio-youtube-mp3",
      "en": "https://pegueiotexto.com.br/en/youtube-to-mp3",
      "x-default": "https://pegueiotexto.com.br/en/youtube-to-mp3",
    },
  },
  openGraph: {
    title: "YouTube to MP3 Converter: Free High Quality Audio | Peguei o Texto",
    description:
      "Convert any YouTube video into crystal-clear MP3 audio in seconds with zero annoying popups and optional AI transcription.",
    url: "https://pegueiotexto.com.br/en/youtube-to-mp3",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "YouTube to MP3 Converter - Peguei o Texto",
      "url": "https://pegueiotexto.com.br/en/youtube-to-mp3",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description":
        "Free web tool to convert YouTube videos and podcasts into high-fidelity MP3 audio files without software installation.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1080",
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
          "name": "How do I convert a YouTube video to MP3 online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste any YouTube link into the box above, click 'Search Video', and select the 'Download MP3 Audio' option to save the audio track directly.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the audio quality and bitrate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The tool extracts the original high-fidelity audio stream in up to 320 kbps MP3 quality.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I convert long YouTube podcasts and audiobooks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We support multi-hour YouTube podcasts, interviews, and audiobooks with no duration limits.",
          },
        },
      ],
    },
  ],
};

export default function YouTubeToMp3EnglishPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <Script
        id="youtube-mp3-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <div className="glow-orb glow-orb-1" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)" }} />
        <div className="glow-orb glow-orb-2" />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.35)", color: "#C084FC", fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>
              <Headphones size={14} color="#A855F7" />
              High-Bitrate YouTube to MP3 Audio Converter
            </div>

            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Convert YouTube to MP3 audio <br />
              <span style={{ background: "linear-gradient(135deg, #A855F7, #EC4899, #F43F5E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                fast, free, and without popups
              </span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              Extract audio tracks from YouTube videos, long podcasts, and music. Download clean MP3 files with no spammy advertisements.
            </p>
          </div>

          {/* Downloader Widget */}
          <VideoDownloader placeholder="Paste YouTube link to extract MP3 audio..." />

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
            <span style={{ color: "#A855F7", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Easy Steps
            </span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "8px" }}>
              How to convert YouTube videos to MP3
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(168, 85, 247, 0.3)", marginBottom: "8px" }}>01</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Copy YouTube URL</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Copy the link of any YouTube video or podcast from your browser or mobile app.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(168, 85, 247, 0.3)", marginBottom: "8px" }}>02</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Paste and Search</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Paste the URL in the box above and tap &apos;Search Video&apos; to process audio streams.
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "rgba(168, 85, 247, 0.3)", marginBottom: "8px" }}>03</div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Download MP3</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13.5px", lineHeight: 1.5 }}>
                Click &apos;Download MP3 Audio&apos; to save the file or transcribe it into text with 1 click.
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
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Frequently Asked Questions about YouTube to MP3</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                q: "Can I listen offline on iPhone or Android?",
                a: "Yes! Once downloaded, the MP3 file is stored on your device and can be played in Apple Music, Spotify local files, or any media player."
              },
              {
                q: "Can I convert YouTube music mixes and live sets?",
                a: "Yes! Peguei o Texto supports long video sets, DJ mixes, and study lo-fi tracks."
              },
              {
                q: "Can I transcribe the extracted MP3 audio to text?",
                a: "Yes! Click 'Transcribe Audio with AI' on the download screen to receive an accurate text transcript with punctuation."
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
            <Link href="/en/convert-mp3-to-text" className="btn-secondary" style={{ padding: "12px 24px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Already have an MP3 to transcribe? Try our MP3 to Text Converter <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
