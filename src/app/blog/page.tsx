import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearchFilter from "@/components/blog/BlogSearchFilter";
import { getAllPosts, getFeaturedPosts, getAllCategories } from "@/lib/blog";
import { BookOpen, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog & Dicas de Transcrição, Produtividade e IA | Peguei o Texto",
  description:
    "Confira tutoriais práticos, guias e novidades sobre inteligência artificial, transcrição de reuniões, geração de legendas SRT e produtividade de áudio e vídeo.",
  keywords: [
    "blog peguei o texto",
    "dicas de transcricao",
    "como transcrever audio",
    "produtividade com ia",
    "legendas srt",
    "transcrever reunioes",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/blog",
  },
  openGraph: {
    title: "Blog Oficial do Peguei o Texto | IA & Produtividade",
    description:
      "Aprenda a transformar gravações, reuniões e vídeos em textos limpos, atas e legendas automáticas em segundos.",
    url: "https://pegueiotexto.com.br/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts(1);
  const featuredPost = featuredPosts[0] || null;
  const categories = getAllCategories();

  // If there is a featured post, pass the remaining posts to the search/filter component
  // so it doesn't duplicate the featured one in the initial view
  const regularPosts = featuredPost
    ? allPosts.filter((p) => p.slug !== featuredPost.slug)
    : allPosts;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog do Peguei o Texto",
    "description": "Tutoriais e novidades sobre inteligência artificial, transcrição e produtividade.",
    "url": "https://pegueiotexto.com.br/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Peguei o Texto",
      "url": "https://pegueiotexto.com.br",
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
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
              <span
                className="badge"
                style={{
                  background: "rgba(124, 58, 237, 0.15)",
                  border: "1px solid rgba(124, 58, 237, 0.35)",
                  color: "#C4B5FD",
                }}
              >
                <BookOpen size={14} color="#A78BFA" /> Central de Conhecimento & Blog
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "18px",
              }}
            >
              Domine produtividade, áudio e{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #A78BFA, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                transcrição com IA
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                color: "var(--text-secondary)",
                maxWidth: 680,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Guias passo a passo, novidades e tutoriais para transformar horas de reuniões, entrevistas e vídeos em texto limpo e estruturado.
            </p>
          </div>

          {/* FEATURED POST */}
          {featuredPost && (
            <div style={{ maxWidth: 1080, margin: "0 auto 48px auto" }}>
              <BlogCard post={featuredPost} isFeatured={true} />
            </div>
          )}

          {/* SEARCH & REGULAR POSTS GRID */}
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles size={18} color="#A78BFA" />
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF" }}>
                Todos os Artigos
              </h2>
            </div>

            <BlogSearchFilter initialPosts={regularPosts} categories={categories} />
          </div>

          {/* CONVERSION CALL TO ACTION BANNER */}
          <div style={{ maxWidth: 1080, margin: "72px auto 20px auto" }}>
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
                  <Zap size={14} color="#A78BFA" /> Experimente Grátis
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
                  Economize até 90% do tempo gasto digitando áudios
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.05rem",
                    marginBottom: "28px",
                    lineHeight: 1.6,
                  }}
                >
                  Cole o link de qualquer vídeo ou suba seus arquivos MP3, WAV e MP4. Receba a transcrição completa com pontuação e resumo em segundos.
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
                    href="/"
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
                    Transcrever Agora <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/precos"
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
                    Ver Planos
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
                    <CheckCircle2 size={14} color="#10B981" /> 5 minutos grátis
                  </span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="#10B981" /> Sem cartão de crédito
                  </span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={14} color="#10B981" /> 100% confidencial
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
