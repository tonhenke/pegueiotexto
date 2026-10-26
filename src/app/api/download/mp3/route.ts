import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url")?.trim();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "URL do vídeo não informada." },
        { status: 400 }
      );
    }

    const backendEndpoint = `${BACKEND_URL}/api/download/mp3?url=${encodeURIComponent(videoUrl)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for download + conversion

    const backendRes = await fetch(backendEndpoint, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!backendRes.ok) {
      const errJson = await backendRes.json().catch(() => null);
      return NextResponse.json(
        {
          error:
            errJson?.detail ||
            "Não foi possível converter o áudio deste vídeo no momento. Tente novamente.",
        },
        { status: backendRes.status || 500 }
      );
    }

    const contentDisposition =
      backendRes.headers.get("content-disposition") ||
      'attachment; filename="audio.mp3"';
    const contentType =
      backendRes.headers.get("content-type") || "audio/mpeg";

    return new NextResponse(backendRes.body as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("[Download MP3 Proxy Error]:", err);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao processar o download do áudio. Tente novamente.",
      },
      { status: 500 }
    );
  }
}
