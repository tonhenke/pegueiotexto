"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3.5px",
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.05)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${scrollProgress}%`,
          height: "100%",
          background: "linear-gradient(90deg, #7C3AED, #06B6D4, #EC4899)",
          boxShadow: "0 0 10px rgba(124, 58, 237, 0.7)",
          transition: "width 0.1s ease-out",
        }}
      />
    </div>
  );
}
