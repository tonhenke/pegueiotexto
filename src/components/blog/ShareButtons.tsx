"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://pegueiotexto.com.br/blog/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
        <Share2 size={15} /> Compartilhar:
      </span>

      <a
        href={shareWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        className="badge"
        style={{
          background: "rgba(37, 211, 102, 0.12)",
          color: "#25D366",
          border: "1px solid rgba(37, 211, 102, 0.25)",
          textDecoration: "none",
          padding: "6px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
        }}
      >
        WhatsApp
      </a>

      <a
        href={shareLinkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="badge"
        style={{
          background: "rgba(10, 102, 194, 0.12)",
          color: "#38BDF8",
          border: "1px solid rgba(10, 102, 194, 0.25)",
          textDecoration: "none",
          padding: "6px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
        }}
      >
        LinkedIn
      </a>

      <a
        href={shareTwitter}
        target="_blank"
        rel="noopener noreferrer"
        className="badge"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          color: "#E2E8F0",
          border: "1px solid var(--border-subtle)",
          textDecoration: "none",
          padding: "6px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
        }}
      >
        X (Twitter)
      </a>

      <button
        onClick={handleCopy}
        className="badge"
        style={{
          background: copied ? "rgba(16, 185, 129, 0.2)" : "rgba(124, 58, 237, 0.12)",
          color: copied ? "#10B981" : "#A78BFA",
          border: copied ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--border-subtle)",
          padding: "6px 12px",
          fontSize: "0.82rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {copied ? (
          <>
            <Check size={13} /> Link copiado!
          </>
        ) : (
          <>
            <LinkIcon size={13} /> Copiar link
          </>
        )}
      </button>
    </div>
  );
}
