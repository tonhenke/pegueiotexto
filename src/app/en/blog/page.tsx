import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearchFilter from "@/components/blog/BlogSearchFilter";
import { getAllPosts, getFeaturedPosts, getAllCategories } from "@/lib/blog";
import { BookOpen, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Audio & Video Transcription Blog | Peguei o Texto",
  description:
    "Explore practical guides, expert tips, and tutorials on AI transcription, SRT subtitles, audio-to-text converters, and meeting productivity.",
  keywords: [
    "transcription blog",
    "audio to text tips",
    "how to transcribe audio",
    "ai audio converter",
    "srt subtitles generator",
    "meeting transcription",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en/blog",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br/blog",
      "en": "https://pegueiotexto.com.br/en/blog",
      "x-default": "https://pegueiotexto.com.br/en/blog",
    },
  },
  openGraph: {
    title: "Official Peguei o Texto Blog | AI & Productivity",
    description:
      "Transform recordings, meetings, and internet videos into clean text, action items, and automated subtitles in seconds.",
    url: "https://pegueiotexto.com.br/en/blog",
    type: "website",
  },
};

export default function EnglishBlogIndexPage() {
  const allPosts = getAllPosts("en");
  const featuredPosts = getFeaturedPosts(1, "en");
  const featuredPost = featuredPosts[0] || null;
  const categories = getAllCategories("en");

  // If there is a featured post, pass the remaining posts to the search/filter component
  // so it doesn't duplicate the featured one in the initial view
  const regularPosts = featuredPost
    ? allPosts.filter((p) => p.slug !== featuredPost.slug)
    : allPosts;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Peguei o Texto Blog",
    "description": "Guides, tutorials, and insights on artificial intelligence, audio transcription, and workflow productivity.",
    "url": "https://pegueiotexto.com.br/en/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Peguei o Texto",
      "url": "https://pegueiotexto.com.br/en",
    },
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      {/* HERO SECTION */}
      <section className="hero bg-grid" style={{ paddingTop: "96px", paddingBottom: "50px" }}>
        <div
          className="glow-orb glow-orb-1"
          style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)" }}
        />
        <div
          className="glow-orb glow-orb-2"
          style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)" }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: "40px" }}>
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
              <BookOpen size={16} />
              <span>Official Blog & Guides</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                marginBottom: "20px",
              }}
            >
              Master AI Transcription &{" "}
              <span className="text-gradient">Audio Productivity</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: 680,
                margin: "0 auto",
              }}
            >
              Practical tutorials, benchmarks, and actionable workflows to transcribe audio, videos, and meetings with maximum accuracy.
            </p>
          </div>

          {/* FEATURED POST (IF EXISTS) */}
          {featuredPost && (
            <div style={{ marginBottom: "50px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "16px",
                  color: "#A78BFA",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <Sparkles size={16} />
                <span>Featured Guide</span>
              </div>
              <BlogCard post={featuredPost} isFeatured={true} basePath="/en/blog" lang="en" />
            </div>
          )}

          {/* SEARCH, CATEGORY FILTER & POSTS GRID */}
          <BlogSearchFilter
            initialPosts={regularPosts}
            categories={categories}
            basePath="/en/blog"
            lang="en"
          />

          {/* BOTTOM CTA BANNER */}
          <div style={{ marginTop: "80px", marginBottom: "40px" }}>
            <div
              className="glass-card"
              style={{
                borderRadius: "28px",
                padding: "clamp(32px, 5vw, 54px)",
                border: "1px solid rgba(124, 58, 237, 0.4)",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.08))",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <span
                  className="badge"
                  style={{
                    background: "rgba(124, 58, 237, 0.2)",
                    color: "#C4B5FD",
                    marginBottom: "16px",
                  }}
                >
                  <Zap size={14} color="#A78BFA" /> Try It Free
                </span>

                <h3
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    lineHeight: 1.25,
                    marginBottom: "14px",
                  }}
                >
                  Save up to 90% of the time spent typing audio manually
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.05rem",
                    marginBottom: "28px",
                    lineHeight: 1.6,
                  }}
                >
                  Paste any video link or upload your MP3, WAV, and MP4 files. Receive a complete transcript with punctuation and executive summary in seconds.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "14px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  <Link
                    href="/en"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 28px",
                      fontSize: "1rem",
                      textDecoration: "none",
                      borderRadius: "14px",
                    }}
                  >
                    Transcribe Now <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/en/pricing"
                    className="btn-secondary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 24px",
                      fontSize: "1rem",
                      textDecoration: "none",
                      borderRadius: "14px",
                    }}
                  >
                    View Pricing
                  </Link>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="#10B981" /> 5 free minutes
                  </span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="#10B981" /> No credit card required
                  </span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="#10B981" /> 100% confidential
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
