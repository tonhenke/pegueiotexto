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
    return NextResponse.json(
      { error: "URL do vídeo não fornecida." },
      { status: 400 }
    );
  }

  // Sanitize filename
  let filename = "video.mp4";
  const urlParam = searchParams.get("filename")?.trim();
  if (urlParam) {
    const clean = urlParam
      .replace(/[^\w\s\u00C0-\u00FF-]/gi, "")
      .trim()
      .slice(0, 50);
    if (clean) filename = `${clean}.mp4`;
  }

  // 2. Fetch processed stream from Railway backend
  const backendEndpoint = `${BACKEND_URL}/api/download/video?url=${encodeURIComponent(
    targetUrl
  )}${download ? "&download=true" : ""}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout for download and merge

    const backendRes = await fetch(backendEndpoint, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const contentType =
        backendRes.headers.get("content-type") || "video/mp4";
      const contentDisposition =
        backendRes.headers.get("content-disposition") ||
        `attachment; filename="${filename}"`;

      return new NextResponse(backendRes.body as any, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
          "Cache-Control": "no-cache",
        },
      });
    }

    // Backend returned an error
    const errJson = await backendRes.json().catch(() => null);
    let errorMsg =
      errJson?.detail ||
      "Não foi possível processar o download do vídeo. Verifique se o vídeo é público e tente novamente.";

    if (/sign in|bot|protect our community|--cookies/i.test(errorMsg)) {
      errorMsg =
        "Este vídeo do YouTube possui proteção antibot ativa em servidores de nuvem. Recomendamos utilizar a transcrição direta com inteligência artificial.";
    }

    return NextResponse.json(
      { error: errorMsg },
      { status: backendRes.status || 422 }
    );
  } catch (err: any) {
    console.error("[Download Video Proxy Error]:", err);
    return NextResponse.json(
      {
        error:
          "Ocorreu uma falha na comunicação com o servidor de download de vídeo.",
      },
      { status: 500 }
    );
  }
}
