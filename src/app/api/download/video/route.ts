import { NextRequest, NextResponse } from "next/server";
import { Ytdl } from "@distube/ytdl-core";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get("url")?.trim();
    const itagStr = searchParams.get("itag")?.trim();
    const titleParam = searchParams.get("title")?.trim();

    if (!videoUrl) {
      return NextResponse.json(
        { error: "URL do vídeo não informada." },
        { status: 400 }
      );
    }

    const ytdl = new Ytdl();
    const info = await ytdl.getInfo(videoUrl);
    const rawTitle = titleParam || info.videoDetails.title || "video";
    const asciiTitle =
      rawTitle
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 _-]/g, "")
        .replace(/\s+/g, " ")
        .slice(0, 60)
        .trim() || "video";

    const itag = itagStr ? parseInt(itagStr, 10) : undefined;
    const downloadOptions: any = itag
      ? { quality: itag }
      : { filter: { hasVideo: true } };

    const nodeStream = ytdl.download(videoUrl, downloadOptions);
    const webStream = Readable.toWeb(nodeStream as any);

    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${asciiTitle}.mp4"; filename*=UTF-8''${encodeURIComponent(rawTitle)}.mp4`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("[Download Video Route Error]:", err);
    return NextResponse.json(
      { error: "Não foi possível realizar o download do vídeo no momento." },
      { status: 500 }
    );
  }
}
