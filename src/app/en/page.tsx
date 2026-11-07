import type { Metadata } from "next";
import HomeClintEn from "@/components/HomeClintEn";

export const metadata: Metadata = {
  title: "Peguei o Texto: AI Video & Audio Transcription in Seconds",
  description:
    "Paste any link from YouTube, TikTok, Instagram Reels or upload audio files to get 99.2% accurate transcriptions, synced CapCut subtitles (.SRT), and AI summaries in seconds. 5 minutes free trial!",
  keywords: [
    "transcribe video",
    "transcribe youtube video to text",
    "audio to text converter",
    "free video transcription",
    "transcribe instagram reels",
    "transcribe tiktok video",
    "generate srt subtitles",
    "ai transcription tool",
    "peguei o texto",
  ],
  alternates: {
    canonical: "https://pegueiotexto.com.br/en",
    languages: {
      "pt-BR": "https://pegueiotexto.com.br",
      "en": "https://pegueiotexto.com.br/en",
      "x-default": "https://pegueiotexto.com.br/en",
    },
  },
  openGraph: {
    title: "Peguei o Texto: Turn Any Video into Text & Subtitles with AI",
    description:
      "Paste any video link. Get accurate transcripts, ready-to-import CapCut subtitles (.SRT) and executive summaries in seconds.",
    url: "https://pegueiotexto.com.br/en",
    siteName: "Peguei o Texto",
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Peguei o Texto - AI Video & Audio Transcription",
      "url": "https://pegueiotexto.com.br/en",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "description":
        "AI-powered speech-to-text service that transcribes YouTube, TikTok, Instagram Reels and audio files into accurate text and subtitles in seconds.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1420",
        "bestRating": "5",
        "worstRating": "1",
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "5 free minutes upon signup to test all features",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I transcribe a YouTube, TikTok or Instagram video?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply copy the video link from YouTube, TikTok, Instagram Reels, or Vimeo, paste it into Peguei o Texto, and click 'Transcribe'. Your full text, timestamps and .SRT subtitles will be ready in seconds.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I export subtitles for CapCut and Premiere Pro?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Peguei o Texto exports universal .SRT and .VTT subtitle files formatted for direct drag-and-drop import into CapCut, Adobe Premiere, DaVinci Resolve, and Final Cut Pro.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my privacy protected? Is the media file deleted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "100% protected. All temporary audio and video files are permanently deleted from our servers immediately after transcription is completed.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I test it for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! All new accounts automatically receive 5 free minutes of transcription with zero credit card required.",
          },
        },
      ],
    },
  ],
};

export default function EnglishHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClintEn />
    </>
  );
}
