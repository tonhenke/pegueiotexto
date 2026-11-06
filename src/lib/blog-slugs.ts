export const BLOG_SLUG_MAP_PT_TO_EN: Record<string, string> = {
  "baixar-musicas-do-youtube": "download-youtube-music-mp3",
  "baixar-video-do-facebook": "download-facebook-videos",
  "baixar-video-do-pinterest": "download-pinterest-videos",
  "baixar-video-do-twitter": "download-twitter-x-videos",
  "baixar-video-do-youtube": "download-youtube-videos",
  "baixar-video-link": "download-videos-from-any-link",
  "baixar-video-tiktok": "download-tiktok-videos-without-watermark",
  "como-gerar-legendas-srt-para-videos-do-youtube-e-tiktok": "how-to-generate-srt-subtitles",
  "como-transcrever-audio-do-whatsapp-em-texto": "how-to-transcribe-whatsapp-voice-notes",
  "como-transcrever-reunioes": "how-to-transcribe-meetings",
  "como-transcrever-video-do-youtube-em-texto": "how-to-transcribe-youtube-video-to-text",
  "como-transcrever-video-guia-definitivo": "how-to-transcribe-video-ultimate-guide",
  "melhores-ferramentas-para-converter-mp3-em-texto-2026": "how-to-convert-mp3-to-text",
  "melhores-ferramentas-para-transcrever-video": "best-ai-audio-to-text-converters",
  "transcrever-video-em-texto-online-gratis": "transcribe-video-to-text-online-free",
  "transcricao-de-audio": "audio-transcription-guide",
  "transcricao-de-entrevistas-academicas-tcc-e-pesquisas": "academic-interview-transcription-research-thesis",
};

export const BLOG_SLUG_MAP_EN_TO_PT: Record<string, string> = Object.entries(
  BLOG_SLUG_MAP_PT_TO_EN
).reduce((acc, [pt, en]) => {
  acc[en] = pt;
  return acc;
}, {} as Record<string, string>);

