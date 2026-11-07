"use client";

import React, { useState, useEffect } from "react";

interface BadgeItem {
  title: string;
  url: string;
  imgSrc: string;
  alt: string;
  width: number;
  height: number;
}

const BADGES: BadgeItem[] = [
  {
    title: "Product Hunt",
    url: "https://www.producthunt.com/posts/peguei-o-texto?utm_source=badge-featured&utm_medium=badge&utm_campaign=peguei-o-texto",
    imgSrc: "/product-hunt-badge.svg",
    alt: "Featured on Product Hunt",
    width: 250,
    height: 54,
  },
  {
    title: "StartupBase",
    url: "https://startupbase.io/products/peguei-o-texto?utm_source=startupbase&utm_medium=badge&utm_campaign=launch-badge-neutral",
    imgSrc: "https://statics.startupbase.io/site/badges/launched-on-sb-neutral.svg",
    alt: "Launched on StartupBase",
    width: 300,
    height: 80,
  },
  {
    title: "ConfettiSaaS",
    url: "https://confettisaas.com/saas/pegueiotexto-com-br?ref=badge",
    imgSrc: "https://confettisaas.com/badge-dark.svg",
    alt: "View Peguei o Texto on ConfettiSaaS",
    width: 250,
    height: 54,
  },
  {
    title: "Fazier",
    url: "https://fazier.com/launches/pegueiotexto.com.br",
    imgSrc: "https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral",
    alt: "Featured on Fazier",
    width: 182,
    height: 43,
  },
  {
    title: "Better Launch",
    url: "https://www.betterlaunch.co/product/peguei-o-texto",
    imgSrc: "https://www.betterlaunch.co/badge-launching-dark.svg",
    alt: "Better Launch",
    width: 200,
    height: 56,
  },
  {
    title: "FoundrList",
    url: "https://www.foundrlist.com/product/pegueiotexto?utm_source=badge&utm_medium=embed",
    imgSrc: "https://www.foundrlist.com/api/badge/pegueiotexto",
    alt: "Featured on FoundrList",
    width: 150,
    height: 48,
  },
  {
    title: "Twelve Tools",
    url: "https://twelve.tools",
    imgSrc: "https://twelve.tools/badge2-dark.svg",
    alt: "Featured on Twelve Tools",
    width: 148,
    height: 40,
  },
  {
    title: "Shipybara",
    url: "https://shipybara.com/?ref=48daca65-151b-45a6-b9c1-b10341284265",
    imgSrc: "https://shipybara.com/images/badges/shipybara-badge-light.svg",
    alt: "Featured on Shipybara",
    width: 150,
    height: 54,
  },
];

interface FooterBadgeCarouselProps {
  label?: string;
}

/**
 * Rotating badge ticker inspired by UniScribe (https://www.uniscribe.co/)
 * Cycles smoothly through launch/directory badges every 3 seconds.
 * Pauses rotation when user hovers. Accessible for SEO and screen readers.
 */
export default function FooterBadgeCarousel({ label = "FIND US ON" }: FooterBadgeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BADGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginTop: "32px",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <span
        style={{
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.5)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* Accessible fallback for Screen Readers and Web Crawlers */}
      <div
        className="sr-only"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {BADGES.map((b) => (
          <a key={b.title} href={b.url} target="_blank" rel="noopener noreferrer">
            {b.title}
          </a>
        ))}
      </div>

      {/* Animated badge rotation track */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: "36px",
          width: "220px",
          maxWidth: "100%",
        }}
      >
        {BADGES.map((badge, idx) => {
          const isActive = idx === activeIndex;
          return (
            <a
              key={badge.title}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={badge.alt}
              tabIndex={isActive ? 0 : -1}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                transition: "transform 0.5s ease, opacity 0.5s ease",
                transform: isActive ? "translateY(0)" : "translateY(100%)",
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 2 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badge.imgSrc}
                alt={badge.alt}
                height="32"
                width={badge.width}
                loading="lazy"
                style={{
                  height: "32px",
                  width: "auto",
                  maxWidth: "100%",
                  display: "block",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

