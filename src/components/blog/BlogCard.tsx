import Link from "next/link";
import { Calendar, Clock, ArrowUpRight, Sparkles } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  isFeatured?: boolean;
}

export default function BlogCard({ post, isFeatured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isFeatured) {
    return (
      <article
        className="glass-card"
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(124, 58, 237, 0.35)",
          boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          position: "relative",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0px",
          }}
        >
          {/* Cover gradient or visual */}
          <div
            style={{
              minHeight: "260px",
              background: post.coverGradient || "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "32px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span
                className="badge"
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
              >
                <Sparkles size={12} color="#F59E0B" /> Artigo em Destaque
              </span>
              <span
                className="badge"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {post.category}
              </span>
            </div>

            <div style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.85rem" }}>
              Peguei o Texto • Blog Oficial
            </div>
          </div>

          {/* Text Content */}
          <div
            style={{
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "rgba(14, 13, 36, 0.85)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginBottom: "14px",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Calendar size={14} /> {formattedDate}
              </span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Clock size={14} /> {post.readTime}
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.25,
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {post.title}
              </Link>
            </h2>

            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              {post.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Por <strong style={{ color: "var(--text-primary)" }}>{post.author.name}</strong>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  borderRadius: "12px",
                }}
              >
                Ler Artigo <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="glass-card"
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Visual Header / Cover */}
      <Link
        href={`/blog/${post.slug}`}
        style={{
          display: "block",
          textDecoration: "none",
          height: "160px",
          background: post.coverGradient || "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
          padding: "20px",
          position: "relative",
        }}
      >
        <span
          className="badge"
          style={{
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(6px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "0.75rem",
          }}
        >
          {post.category}
        </span>
      </Link>

      {/* Body */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginBottom: "12px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Calendar size={13} /> {formattedDate}
            </span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={13} /> {post.readTime}
            </span>
          </div>

          <h3
            style={{
              fontSize: "1.18rem",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.35,
              marginBottom: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {post.title}
            </Link>
          </h3>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.55,
              marginBottom: "18px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid rgba(124, 58, 237, 0.1)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {post.author.name}
          </span>

          <Link
            href={`/blog/${post.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#A78BFA",
              textDecoration: "none",
            }}
          >
            Ler mais <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
