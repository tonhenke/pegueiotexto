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
    // 3. YOUTUBE (Direct via @distube/ytdl-core in Node.js)
    // -------------------------------------------------------------
    if (/youtube\.com|youtu\.be/i.test(rawUrl)) {
      try {
        const { Ytdl } = require("@distube/ytdl-core");
        const ytdl = new Ytdl();
        const info = await ytdl.getInfo(rawUrl);

        if (info && info.videoDetails) {
          const details = info.videoDetails;
          const formats = info.formats || [];

          // Find best video and audio streams
          const videoFormats = formats.filter(
            (f: any) => f.url && (f.hasVideo || f.qualityLabel)
          );
          const audioFormats = formats.filter(
            (f: any) => f.url && f.hasAudio && !f.hasVideo
          );

          const bestVideo = videoFormats[0]?.url || "";
          const bestAudio = audioFormats[0]?.url || bestVideo;

          // Build format list for user selection
          const formattedOptions = videoFormats
            .slice(0, 4)
            .map((f: any, idx: number) => ({
              id: `yt-${idx}`,
              label: `MP4 ${f.qualityLabel || f.container || "HD"}`,
              ext: f.container || "mp4",
              quality: f.qualityLabel || "HD",
              url: f.url,
            }));

          return NextResponse.json({
            status: "success",
            data: {
              title: details.title || "Vídeo do YouTube",
              duration: parseInt(details.lengthSeconds || "0", 10),
              thumbnail: details.thumbnails?.[details.thumbnails.length - 1]?.url || "",
              uploader: details.author?.name || "YouTube",
              platform: "YouTube",
              video_url: bestVideo,
              video_hd_url: bestVideo,
              audio_url: bestAudio,
              formats: [
                ...formattedOptions,
                ...(bestAudio
                  ? [
                      {
                        id: "audio",
                        label: "Áudio MP3 / M4A Original",
                        ext: "m4a",
                        quality: "128k",
                        url: bestAudio,
                      },
                    ]
                  : []),
              ],
            },
          });
        }
      } catch (ytErr: any) {
        console.warn("[Download Route] YouTube direct error, falling back to backend:", ytErr?.message || ytErr);
      }
    }

    // -------------------------------------------------------------
    // 4. FALLBACK: Python Backend (yt-dlp) for Facebook, LinkedIn, etc.
    // -------------------------------------------------------------
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
