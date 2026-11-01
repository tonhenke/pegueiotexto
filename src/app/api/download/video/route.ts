import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("directUrl") || searchParams.get("url");

  if (target && /^https?:\/\//i.test(target)) {
    return NextResponse.redirect(target, 302);
  }

  return NextResponse.redirect(new URL("/baixar-video", req.url), 302);
}
