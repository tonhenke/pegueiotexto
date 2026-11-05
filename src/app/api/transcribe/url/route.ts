import { NextRequest, NextResponse } from "next/server";
import { Ytdl } from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import os from "os";

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

    // 1. First, attempt backend native transcription (fastest if native YouTube captions exist, or TikTok/Instagram)
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/transcribe/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ url: normalizedUrl, language }),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }

      // If backend rejected due to Auth (401) or Credits (402), return that directly
      if (backendRes.status === 401 || backendRes.status === 402) {
        const errData = await backendRes.json().catch(() => ({}));
        return NextResponse.json(errData, { status: backendRes.status });
      }
    } catch (backendErr) {
      console.warn("[Transcribe URL] Backend initial attempt failed:", backendErr);
    }

    // 2. If it is a YouTube URL and backend failed (antibot or subtitles disabled):
    // Use @distube/ytdl-core to reliably download the audio without bot check and upload to Whisper!
    if (isYoutube) {
      try {
        const ytdl = new Ytdl();
        const info = await ytdl.getInfo(normalizedUrl);
        const videoTitle = info.videoDetails?.title || "Vídeo do YouTube";
        const tempId = Math.random().toString(36).substring(2, 10);
        const tempFilePath = path.join(os.tmpdir(), `yt_audio_${tempId}.m4a`);

        // Download audio stream reliably
        await new Promise<void>((resolve, reject) => {
          const stream = ytdl.download(normalizedUrl, {
            filter: { hasAudio: true, hasVideo: false },
          });
          const writeStream = fs.createWriteStream(tempFilePath);
          stream.pipe(writeStream);
          writeStream.on("finish", () => resolve());
          writeStream.on("error", reject);
          stream.on("error", reject);
        });

        // Read file and send to backend /api/transcribe/upload
        const fileBuffer = await fs.promises.readFile(tempFilePath);
        fs.promises.unlink(tempFilePath).catch(() => {});

        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: "audio/mp4" });
        formData.append("file", blob, "youtube_audio.m4a");
        formData.append("language", language);
        formData.append("title", videoTitle);
        formData.append("platform", "YouTube");

        const uploadRes = await fetch(`${BACKEND_URL}/api/transcribe/upload`, {
          method: "POST",
          headers: {
            ...(authHeader ? { Authorization: authHeader } : {}),
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadData.platform = "YouTube";
          uploadData.title = videoTitle;
          return NextResponse.json(uploadData);
        }

        const uploadErr = await uploadRes.json().catch(() => ({}));
        return NextResponse.json(uploadErr, {
          status: uploadRes.status || 500,
        });
      } catch (ytdlError: any) {
        console.error("[Transcribe URL] ytdl-core fallback failed:", ytdlError);
      }
    }

    return NextResponse.json(
      {
        detail:
          "Não foi possível transcrever este link no momento. Verifique se o vídeo é público ou faça o upload direto do arquivo pela aba 'Enviar arquivo'.",
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("[Transcribe URL] Fatal error:", err);
    return NextResponse.json(
      { detail: "Erro interno ao processar a transcrição." },
      { status: 500 }
    );
  }
}
