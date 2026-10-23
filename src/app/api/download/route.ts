import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "Informe a URL do vídeo para download." },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // 1. TIKTOK (TikWM: Instant, No Watermark, Zero Server Bandwidth)
    // -------------------------------------------------------------
    if (/tiktok\.com/i.test(rawUrl)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const tikwmRes = await fetch(
          `https://www.tikwm.com/api/?url=${encodeURIComponent(rawUrl)}`,
          {
            signal: controller.signal,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          }
        );
        clearTimeout(timeoutId);

        if (tikwmRes.ok) {
          const tikData = await tikwmRes.json();
          if (tikData && tikData.code === 0 && tikData.data?.play) {
            const d = tikData.data;
            const playUrl = d.play.startsWith("//") ? `https:${d.play}` : d.play;
            const hdUrl = d.hdplay
              ? d.hdplay.startsWith("//")
                ? `https:${d.hdplay}`
                : d.hdplay
              : playUrl;
            const musicUrl = d.music
              ? d.music.startsWith("//")
                ? `https:${d.music}`
                : d.music
              : null;

            return NextResponse.json({
              status: "success",
              data: {
                title: d.title || "Vídeo do TikTok",
                duration: d.duration || 0,
                thumbnail: d.cover || "",
                uploader: d.author?.nickname || d.author?.unique_id || "TikTok",
                platform: "TikTok",
                video_url: playUrl,
                video_hd_url: hdUrl,
                audio_url: musicUrl,
                formats: [
                  {
                    id: "hd",
                    label: "MP4 HD (Sem Marca D'água)",
                    ext: "mp4",
                    quality: "HD",
                    url: hdUrl,
                  },
                  {
                    id: "sd",
                    label: "MP4 Rápido",
                    ext: "mp4",
                    quality: "SD",
                    url: playUrl,
                  },
                  ...(musicUrl
                    ? [
                        {
                          id: "mp3",
                          label: "Áudio Original (MP3)",
                          ext: "mp3",
                          quality: "128k",
                          url: musicUrl,
                        },
                      ]
                    : []),
                ],
              },
            });
          }
        }
      } catch (tikErr) {
        console.warn("[Download Route] TikWM error:", tikErr);
      }
    }

    // -------------------------------------------------------------
    // 2. INSTAGRAM (Reels, Posts, Stories via direct Node.js extractor)
    // -------------------------------------------------------------
    if (/instagram\.com/i.test(rawUrl)) {
      try {
        // Normalize /reels/ to /reel/
        const normalizedUrl = rawUrl.replace(/\/reels\//i, "/reel/");
        const SnapVideo = require("cakkatrok-instagram-downloader");
        const igData = await SnapVideo(normalizedUrl);

        if (igData && igData.status === "ok" && igData.media?.length > 0) {
          const videoItem =
            igData.media.find((m: any) => m.type === "video") || igData.media[0];

          let directCdn = videoItem.url;
          const tokenMatch = videoItem.url.match(/token=([^&]+)/);
          if (tokenMatch) {
            try {
              const payload = JSON.parse(
                Buffer.from(tokenMatch[1].split(".")[1], "base64").toString()
              );
              if (payload.url) directCdn = payload.url;
            } catch (tokenErr) {
              console.warn("[Instagram] Error decoding token payload:", tokenErr);
            }
          }

          // Extract shortcode for clean title & thumbnail
          const shortcodeMatch = normalizedUrl.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
          const shortcode = shortcodeMatch ? shortcodeMatch[1] : "";

          return NextResponse.json({
            status: "success",
            data: {
              title: shortcode
                ? `Instagram Reel (${shortcode})`
                : "Instagram Reel",
              duration: 30,
              thumbnail: "",
              uploader: "Instagram",
              platform: "Instagram",
              video_url: videoItem.url,
              video_hd_url: directCdn,
              audio_url: directCdn,
              formats: [
                {
                  id: "hd",
                  label: "MP4 HD (Download Rápido)",
                  ext: "mp4",
                  quality: "HD",
                  url: videoItem.url,
                },
                {
                  id: "cdn",
                  label: "MP4 Direto (Alta Definição)",
                  ext: "mp4",
                  quality: "Original",
                  url: directCdn,
                },
              ],
            },
          });
        }
      } catch (igErr: any) {
        console.warn("[Download Route] Instagram direct error:", igErr?.message || igErr);
      }
    }

    // -------------------------------------------------------------
    // 3. YOUTUBE (oEmbed Metadata + Stream Extractor + Fail-Safe Resolution)
    // -------------------------------------------------------------
    if (/youtube\.com|youtu\.be/i.test(rawUrl)) {
      // Extract video ID
      const ytMatch = rawUrl.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
      const videoId = ytMatch ? ytMatch[1] : null;

      // 1. Fetch official YouTube oEmbed metadata (instant, no bot check, 100% reliable)
      let oembedTitle = "Vídeo do YouTube";
      let oembedAuthor = "YouTube";
      let oembedThumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";

      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`,
          { headers: { "User-Agent": "Mozilla/5.0" } }
        );
        if (oembedRes.ok) {
          const oeData = await oembedRes.json();
          if (oeData.title) oembedTitle = oeData.title;
          if (oeData.author_name) oembedAuthor = oeData.author_name;
          if (oeData.thumbnail_url) oembedThumbnail = oeData.thumbnail_url;
        }
      } catch (oeErr) {
        console.warn("[Download Route] YouTube oEmbed error:", oeErr);
      }

      // 2. Try backend stream resolution (with Android client)
      let videoUrl = "";
      let audioUrl = "";
      let formats: any[] = [];

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const backendRes = await fetch(`${BACKEND_URL}/api/download/info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawUrl }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (backendRes.ok) {
          const bData = await backendRes.json();
          if (bData && bData.data?.video_url) {
            videoUrl = bData.data.video_url;
            audioUrl = bData.data.audio_url || videoUrl;
            formats = bData.data.formats || [];
          }
        }
      } catch (bErr) {
        console.warn("[Download Route] Backend stream error:", bErr);
      }

      // 3. Fallback direct resolver if cloud datacenter IP was challenged
      const fallbackDownloadUrl = videoId
        ? `https://ssyoutube.com/watch?v=${videoId}`
        : rawUrl;

      const finalVideoUrl = videoUrl || fallbackDownloadUrl;
      const finalAudioUrl = audioUrl || fallbackDownloadUrl;

      if (!formats.length) {
        formats = [
          {
            id: "mp4-hd",
            label: "MP4 HD (Download Rápido)",
            ext: "mp4",
            quality: "HD",
            url: finalVideoUrl,
          },
          {
            id: "mp3-audio",
            label: "Áudio MP3 (Download)",
            ext: "mp3",
            quality: "128k",
            url: finalAudioUrl,
          },
        ];
      }

      return NextResponse.json({
        status: "success",
        data: {
          title: oembedTitle,
          thumbnail: oembedThumbnail,
          uploader: oembedAuthor,
          platform: "YouTube",
          duration: 0,
          video_url: finalVideoUrl,
          video_hd_url: finalVideoUrl,
          audio_url: finalAudioUrl,
          formats,
        },
      });
    }

    // -------------------------------------------------------------
    // 4. OTHER PLATFORMS (Facebook, LinkedIn, etc. via Backend)
    // -------------------------------------------------------------
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const backendRes = await fetch(`${BACKEND_URL}/api/download/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch (backendErr: any) {
      console.warn("[Download Route] Backend proxy error:", backendErr?.message || backendErr);
    }

    return NextResponse.json(
      {
        error:
          "Não foi possível obter os links deste vídeo. Verifique se o perfil ou publicação está pública.",
      },
      { status: 422 }
    );
  } catch (err: any) {
    console.error("[Download Route] Fatal error:", err);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao processar o vídeo. Verifique o link e tente novamente.",
      },
      { status: 500 }
    );
  }
}
