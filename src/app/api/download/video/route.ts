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

  // 2. Otherwise route to backend for rock-solid merge & stream (YouTube, Facebook, etc.)
  const targetUrl = videoUrl || directUrl;
  if (targetUrl) {
    const backendEndpoint = `${BACKEND_URL}/api/download/video?url=${encodeURIComponent(
      targetUrl
    )}${download ? "&download=true" : ""}`;

    return NextResponse.redirect(backendEndpoint, 302);
  }

  return NextResponse.redirect(new URL("/baixar-video", req.url), 302);
}
