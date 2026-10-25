"use client";

import { useEffect, useState } from "react";
import { ListCollapse, ChevronRight } from "lucide-react";
import type { TocItem } from "@/lib/blog";

interface TableOfContentsProps {
  toc: TocItem[];
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -65% 0px",
        threshold: 0.1,
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <nav
      className="glass-card"
      style={{
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid var(--border-subtle)",
        position: "sticky",
        top: "96px",
      }}
      aria-label="Sumário do Artigo"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: "0.95rem",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <ListCollapse size={18} color="#A78BFA" />
        <span>Neste Artigo</span>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
        {toc.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              style={{
                paddingLeft: item.level === 3 ? "14px" : "0px",
              }}
            >
              <a
                href={`#${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: item.level === 3 ? "0.85rem" : "0.9rem",
                  color: isActive ? "#A78BFA" : "#9B9EC8",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  lineHeight: 1.35,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#E0E7FF";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#9B9EC8";
                }}
              >
                <ChevronRight
                  size={12}
                  style={{
                    color: isActive ? "#A78BFA" : "transparent",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                />
                <span>{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
