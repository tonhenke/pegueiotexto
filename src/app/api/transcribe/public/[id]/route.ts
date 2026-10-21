import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ detail: "ID inválido." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_VYRSuA8NTBM_cqQSUdtwRA_Spnnao2Y";

  try {
    const sb = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await sb
      .from("transcriptions")
      .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at")
      .eq("id", id)
      .single();

    if (data && !error) {
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn("[Public Transcribe Route] Direct query error:", err);
  }

  // Fallback: Query Railway backend
  const backendUrl = process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";
  try {
    const backendRes = await fetch(`${backendUrl}/api/transcribe/public/${id}`);
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (backendErr) {
    console.error("[Public Transcribe Route] Backend proxy error:", backendErr);
  }

  return NextResponse.json({ detail: "Transcrição não encontrada." }, { status: 404 });
}
