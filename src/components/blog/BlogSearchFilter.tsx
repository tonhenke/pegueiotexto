"use client";

import { useState, useMemo } from "react";
import { Search, X, Layers } from "lucide-react";
import BlogCard from "./BlogCard";
import type { BlogPost, BlogCategory } from "@/lib/blog";

interface BlogSearchFilterProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogSearchFilter({ initialPosts, categories }: BlogSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === "Todos" || post.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, searchTerm, selectedCategory]);

  return (
    <div>
      {/* Search and Filters Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artigos, tutoriais, dicas de áudio..."
            style={{
              width: "100%",
              padding: "14px 44px 14px 48px",
              background: "rgba(14, 13, 36, 0.7)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "9999px",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              outline: "none",
              backdropFilter: "blur(12px)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-primary)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(124, 58, 237, 0.3)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setSelectedCategory("Todos")}
            className="badge"
            style={{
              padding: "8px 16px",
              fontSize: "0.85rem",
              cursor: "pointer",
              borderRadius: "9999px",
              transition: "all 0.2s ease",
              background:
                selectedCategory === "Todos" ? "var(--gradient-cta)" : "rgba(255, 255, 255, 0.04)",
              color: selectedCategory === "Todos" ? "#FFFFFF" : "var(--text-secondary)",
              border:
                selectedCategory === "Todos"
                  ? "1px solid transparent"
                  : "1px solid var(--border-subtle)",
              fontWeight: selectedCategory === "Todos" ? 700 : 400,
            }}
          >
            <Layers size={13} style={{ marginRight: "4px", display: "inline" }} /> Todos ({initialPosts.length})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="badge"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  borderRadius: "9999px",
                  transition: "all 0.2s ease",
                  background: isSelected ? "var(--gradient-cta)" : "rgba(255, 255, 255, 0.04)",
                  color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                  border: isSelected ? "1px solid transparent" : "1px solid var(--border-subtle)",
                  fontWeight: isSelected ? 700 : 400,
                }}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredPosts.length > 0 ? (
        <div className="blog-cards-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div
          className="glass-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            borderRadius: "20px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "16px" }}>
            Nenhum artigo encontrado para os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Todos");
            }}
            className="btn-secondary"
            style={{
              padding: "10px 24px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
