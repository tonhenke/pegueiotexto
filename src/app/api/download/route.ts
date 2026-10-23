import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = (body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "Informe a URL do vídeo para download." },
        { status: 400 }
      );
    }

    // Fast-path: TikTok via TikWM (instant, no watermark, zero server bandwidth)
    const isTikTok = /tiktok\.com/i.test(rawUrl);
    if (isTikTok) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const tikwmRes = await fetch(
          `https://www.tikwm.com/api/?url=${encodeURIComponent(rawUrl)}`,
          {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          }
        );
        clearTimeout(timeoutId);

        if (tikwmRes.ok) {
          const tikData = await tikwmRes.json();
          if (tikData && tikData.code === 0 && tikData.data?.play) {
            const d = tikData.data;
            const playUrl = d.play.startsWith("//") ? `https:${d.play}` : d.play;
            const hdUrl = d.hdplay ? (d.hdplay.startsWith("//") ? `https:${d.hdplay}` : d.hdplay) : playUrl;
            const musicUrl = d.music ? (d.music.startsWith("//") ? `https:${d.music}` : d.music) : null;

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
        console.warn("[Download Route] TikWM fallback to backend extractor:", tikErr);
      }
    }

    // Call backend extractor for YouTube, Instagram, Facebook, LinkedIn, Twitter, etc.
    const backendRes = await fetch(`${BACKEND_URL}/api/download/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: rawUrl }),
    });

    if (!backendRes.ok) {
      const errJson = await backendRes.json().catch(() => ({}));
      const message =
        errJson.detail ||
        "Não foi possível obter os links de download para este link. Verifique se o vídeo é público.";
      return NextResponse.json({ error: message }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Download Route] Error:", err);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao processar o vídeo. Verifique se a URL está correta e tente novamente.",
      },
      { status: 500 }
    );
  }
}
