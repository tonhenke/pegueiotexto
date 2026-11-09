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

  if (!supabaseKey) {
    return NextResponse.json({ detail: "Serviço temporariamente indisponível." }, { status: 503 });
  }

  try {
    const sb = createClient(supabaseUrl, supabaseKey);

    // Verify caller authentication if token is provided
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    let callerUserId: string | null = null;
    if (token) {
      try {
        const { data: userData } = await sb.auth.getUser(token);
        if (userData?.user?.id) {
          callerUserId = userData.user.id;
        }
      } catch {}
    }

    // Attempt query with is_public check
    let record: any = null;
    try {
      const { data, error } = await sb
        .from("transcriptions")
        .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at, user_id, is_public")
        .eq("id", id)
        .single();
      if (!error && data) {
        record = data;
      }
    } catch {}

    if (!record) {
      const { data, error } = await sb
        .from("transcriptions")
        .select("id, title, platform, duration_seconds, text_content, srt_content, vtt_content, created_at, user_id")
        .eq("id", id)
        .single();
      if (!error && data) {
        record = data;
      }
    }

    if (record) {
      // If marked private explicitly, allow only the owner
      if (record.is_public === false && callerUserId !== record.user_id) {
        return NextResponse.json({ detail: "Esta transcrição é privada." }, { status: 403 });
      }

      const { user_id: _, is_public: __, ...safeData } = record;
      return NextResponse.json(safeData);
    }
  } catch (err) {
    console.warn("[Public Transcribe Route] Direct query error:", err);
  }

  // Fallback: Query Railway backend
  const backendUrl = process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";
  try {
    const backendRes = await fetch(`${backendUrl}/api/transcribe/public/${id}`, {
      headers: {
        ...(request.headers.get("authorization") ? { authorization: request.headers.get("authorization")! } : {}),
      },
    });
    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (backendErr) {
    console.error("[Public Transcribe Route] Backend proxy error:", backendErr);
  }

  return NextResponse.json({ detail: "Transcrição não encontrada." }, { status: 404 });
}
