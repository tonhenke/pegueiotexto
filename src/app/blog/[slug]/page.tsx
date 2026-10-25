import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { Calendar, Clock, ChevronRight, Sparkles, ArrowRight, Zap, User, ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artigo não encontrado | Peguei o Texto",
    };
  }

  const url = `https://pegueiotexto.com.br/blog/${post.slug}`;

  return {
    title: `${post.title} | Blog Peguei o Texto`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage
        ? [
            {
              url: post.coverImage.startsWith("http")
                ? post.coverImage
                : `https://pegueiotexto.com.br${post.coverImage}`,
              width: 1200,
              height: 675,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage
        ? [
            post.coverImage.startsWith("http")
              ? post.coverImage
              : `https://pegueiotexto.com.br${post.coverImage}`,
          ]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fullCoverImageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `https://pegueiotexto.com.br${post.coverImage}`
    : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": fullCoverImageUrl ? [fullCoverImageUrl] : undefined,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Peguei o Texto",
      "url": "https://pegueiotexto.com.br",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pegueiotexto.com.br/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": "https://pegueiotexto.com.br",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://pegueiotexto.com.br/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://pegueiotexto.com.br/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <ReadingProgressBar />
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article style={{ paddingTop: "96px", paddingBottom: "70px" }}>
        <div className="container" style={{ maxWidth: 1120 }}>
          {/* Breadcrumb Navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Início
            </Link>
            <ChevronRight size={14} />
            <Link href="/blog" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
              Blog
            </Link>
            <ChevronRight size={14} />
            <span style={{ color: "#A78BFA" }}>{post.category}</span>
          </nav>

          {/* Article Header */}
          <header style={{ maxWidth: 860, marginBottom: "36px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
              <span
                className="badge"
                style={{
                  background: "rgba(124, 58, 237, 0.15)",
                  border: "1px solid rgba(124, 58, 237, 0.35)",
                  color: "#C4B5FD",
                }}
              >
                {post.category}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                <Clock size={14} /> {post.readTime}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                marginBottom: "18px",
              }}
            >
              {post.title}
            </h1>

            <p
              style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.22rem)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {post.description}
            </p>

            {/* Author and Date bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                padding: "14px 16px",
                background: "rgba(14, 13, 36, 0.6)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  <User size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "0.95rem" }}>
                    {post.author.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {post.author.role} • {formattedDate}
                  </div>
                </div>
              </div>

              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </header>

          {/* Featured Cover Banner */}
          {post.coverImage && (
            <div
              style={{
                marginBottom: "40px",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)",
                background: "rgba(14, 13, 36, 0.6)",
                position: "relative",
                aspectRatio: "16 / 9",
                maxHeight: "480px",
              }}
            >
              <img
                src={post.coverImage}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Main Layout: Content + Sticky Sidebar */}
          <div className="blog-layout-grid">
            {/* Left Column: Markdown Prose */}
            <div className="blog-main-column">
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: post.htmlContent || "" }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div
                  style={{
                    marginTop: "48px",
                    paddingTop: "24px",
                    borderTop: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Tags:</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                        fontSize: "0.8rem",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Contextual CTA Card */}
              <div
                className="glass-card"
                style={{
                  marginTop: "48px",
                  padding: "clamp(20px, 4vw, 36px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(124, 58, 237, 0.35)",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.08))",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Sparkles size={16} color="#A78BFA" />
                  <span style={{ color: "#C4B5FD", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Experimente Agora
                  </span>
                </div>

                <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "10px" }}>
                  Transcreva seu primeiro áudio ou vídeo em segundos
                </h3>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  Faça upload de arquivos MP3, WAV, reuniões do Zoom ou cole o link do YouTube. Ganhe 5 minutos grátis para testar a precisão da nossa IA!
                </p>

                <Link
                  href="/"
                  className="btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Começar Grátis no Peguei o Texto <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <aside className="blog-sidebar-column">
              {/* Table of contents */}
              {post.tableOfContents && post.tableOfContents.length > 0 && (
                <TableOfContents toc={post.tableOfContents} />
              )}

              {/* Sidebar Action Widget */}
              <div
                className="glass-card"
                style={{
                  borderRadius: "18px",
                  padding: "24px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#A78BFA" }}>
                  <Zap size={16} />
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Peguei o Texto</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "18px" }}>
                  Converta gravações de áudio e vídeo em atas, documentos Word e legendas SRT com 98% de precisão.
                </p>
                <Link
                  href="/"
                  className="btn-primary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "10px 16px",
                    fontSize: "0.85rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                  }}
                >
                  Testar 5 Minutos Grátis
                </Link>
              </div>

              {/* Back to Blog link */}
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  paddingLeft: "4px",
                  transition: "color 0.2s ease",
                }}
              >
                <ArrowLeft size={14} /> Voltar para o Blog
              </Link>
            </aside>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section style={{ marginTop: "80px", paddingTop: "48px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "6px" }}>
                  Artigos Relacionados
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Continue lendo outros guias da mesma categoria
                </p>
              </div>

              <div className="blog-related-grid">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.slug} post={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
