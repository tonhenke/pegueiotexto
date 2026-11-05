import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BACKEND_URL =
  process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const body = await req.json().catch(() => ({}));
    const rawUrl = (body.url || "").trim();
    const language = body.language || "auto";

    if (!rawUrl) {
      return NextResponse.json(
        { detail: "Informe a URL para transcrição." },
        { status: 400 }
      );
    }

    // Normalize YouTube URL if it's shorts, youtu.be, or embed
    const isYoutube = /youtube\.com|youtu\.be/i.test(rawUrl);
    const ytMatch = rawUrl.match(/(?:shorts\/|v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
    const normalizedUrl = (isYoutube && ytMatch)
      ? `https://www.youtube.com/watch?v=${ytMatch[1]}`
      : rawUrl;

    const backendRes = await fetch(`${BACKEND_URL}/api/transcribe/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ url: normalizedUrl, language }),
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error("[Transcribe URL] Proxy error:", err);
    return NextResponse.json(
      { detail: "Erro interno ao processar a transcrição." },
      { status: 500 }
    );
  }
}
