import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getCandidateEndpoints(targetUrl: string, download: boolean): string[] {
  const primaryEnv = process.env.BACKEND_URL?.trim();
  const rawList = [
    primaryEnv,
    "http://127.0.0.1:8000",
    "https://pegueiotexto-production.up.railway.app",
  ].filter(Boolean) as string[];

  // Remove duplicates
  const uniqueBases = Array.from(new Set(rawList));
  return uniqueBases.map(
    (base) =>
      `${base}/api/download/video?url=${encodeURIComponent(targetUrl)}${
        download ? "&download=true" : ""
      }`
  );
}

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

  const endpoints = getCandidateEndpoints(targetUrl, download);
  let lastErrorMessage = "";

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s max per backend

      const backendRes = await fetch(endpoint, {
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

      const errJson = await backendRes.json().catch(() => null);
      if (errJson?.detail) {
        lastErrorMessage = errJson.detail;
      }
    } catch (fetchErr: any) {
      // Backend offline or timeout, continue to next candidate
      lastErrorMessage = fetchErr?.message || "Servidor indisponível";
    }
  }

  if (/sign in|bot|protect our community|--cookies/i.test(lastErrorMessage)) {
    lastErrorMessage =
      "Este vídeo do YouTube possui proteção antibot ativa em servidores de nuvem. Recomendamos utilizar a transcrição direta com inteligência artificial.";
  } else if (!lastErrorMessage || /fetch failed|failed to fetch|econnrefused|servidor indisponível/i.test(lastErrorMessage)) {
    lastErrorMessage =
      "O servidor de processamento de vídeo está temporariamente indisponível. Por favor, tente novamente em instantes.";
  }

  return NextResponse.json(
    {
      error:
        lastErrorMessage ||
        "Não foi possível processar o download do vídeo. Verifique se o vídeo é público e tente novamente.",
    },
    { status: 422 }
  );
}
