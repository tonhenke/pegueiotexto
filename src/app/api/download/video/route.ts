import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const directUrl = searchParams.get("directUrl")?.trim();
  const videoUrl = searchParams.get("url")?.trim();
  const download =
    searchParams.get("download") === "1" ||
    searchParams.get("download") === "true";

  // 1. If a valid, non-IP-bound direct CDN URL is provided (TikTok, Instagram)
  if (
    directUrl &&
    /^https?:\/\//i.test(directUrl) &&
    !/googlevideo\.com|manifest/i.test(directUrl) &&
    !/\.m3u8/i.test(directUrl)
  ) {
    return NextResponse.redirect(directUrl, 302);
  }

  const targetUrl = videoUrl || directUrl;
  if (!targetUrl) {
    return NextResponse.redirect(new URL("/baixar-video", req.url), 302);
  }

  const backendEndpoint = `${BACKEND_URL}/api/download/video?url=${encodeURIComponent(
    targetUrl
  )}${download ? "&download=true" : ""}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s max for video download & merge

    const backendRes = await fetch(backendEndpoint, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const contentType =
        backendRes.headers.get("content-type") || "video/mp4";
      const contentDisposition =
        backendRes.headers.get("content-disposition") ||
        'attachment; filename="video.mp4"';

      return new NextResponse(backendRes.body as any, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
          "Cache-Control": "no-cache",
        },
      });
    }

    // Backend returned an error (e.g. 422 YouTube bot block)
    const errJson = await backendRes.json().catch(() => null);
    let errorMsg =
      errJson?.detail ||
      "Não foi possível processar o download do vídeo. Verifique se o vídeo é público e tente novamente.";

    if (
      /sign in|bot|protect our community|--cookies/i.test(errorMsg)
    ) {
      errorMsg =
        "Este vídeo do YouTube possui proteção antibot ativa em servidores de nuvem. Recomendamos utilizar a transcrição direta por inteligência artificial com legendas sincronizadas.";
    }

    const referer = req.headers.get("referer");
    if (referer && referer.includes("dashboard")) {
      const baseUrl = referer.split("?")[0];
      return NextResponse.redirect(
        `${baseUrl}?tab=downloader&error=${encodeURIComponent(errorMsg)}`,
        302
      );
    }

    // Return a clean styled error page instead of raw JSON
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Aviso de Download | Peguei o Texto</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { background: #0B0814; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #0F0A1C; border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 20px; padding: 36px 32px; max-width: 520px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
          .icon { font-size: 40px; margin-bottom: 16px; }
          h1 { font-size: 20px; font-weight: 800; margin: 0 0 12px; color: #FCA5A5; }
          p { font-size: 14px; color: #9E96B3; line-height: 1.6; margin: 0 0 24px; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 12px; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: #FFF; text-decoration: none; font-weight: 700; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">⚠️</div>
          <h1>Proteção de Mídia Identificada</h1>
          <p>${errorMsg}</p>
          <a class="btn" href="/dashboard?tab=downloader">Voltar ao Painel</a>
        </div>
      </body>
      </html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (err: any) {
    console.error("[Download Video Proxy Error]:", err);
    return NextResponse.redirect(
      new URL("/dashboard?tab=downloader&error=download_failed", req.url),
      302
    );
  }
}
