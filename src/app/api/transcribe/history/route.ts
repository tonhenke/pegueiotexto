import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceKey } from "@/lib/admin-store";

export const runtime = "nodejs";

function getPrivilegedSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    getSupabaseServiceKey() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET: Returns user transcription history (or all if admin requested)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("user_id")?.trim();
    const queryAll = searchParams.get("all") === "true";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const sb = getPrivilegedSupabaseClient();
    let effectiveUserId: string | null = queryUserId || null;

    // Check Authorization header if queryUserId is not provided
    const authHeader = req.headers.get("authorization") || "";
    if (!effectiveUserId && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      try {
        const { data: userData } = await sb.auth.getUser(token);
        if (userData?.user?.id) {
          effectiveUserId = userData.user.id;
        }
      } catch {}
    }

    let query = sb
      .from("transcriptions")
      .select(
        "id, title, platform, duration_seconds, minutes_deducted, created_at, text_content, srt_content, vtt_content, user_id"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (effectiveUserId && !queryAll) {
      query = query.eq("user_id", effectiveUserId);
    } else if (!effectiveUserId && !queryAll) {
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await query;

    if (error) {
      console.error("[Transcription History GET] Supabase error:", error);
      return NextResponse.json(
        { error: error.message, history: [] },
        { status: 500 }
      );
    }

    const items = data || [];
    // Also return items directly in array if caller expects an array
    const responsePayload = items;
    (responsePayload as any).history = items;
    (responsePayload as any).count = items.length;
    (responsePayload as any).status = "success";

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("[Transcription History GET] Fatal error:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno", history: [] },
      { status: 500 }
    );
  }
}

// POST: Save or store a transcription record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      title,
      platform,
      duration_seconds,
      minutes_deducted,
      text_content,
      srt_content,
      vtt_content,
      user_id,
    } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id é obrigatório para registrar a transcrição." },
        { status: 400 }
      );
    }

    const sb = getPrivilegedSupabaseClient();
    const { data, error } = await sb
      .from("transcriptions")
      .insert({
        title: title || "Transcrição de Áudio",
        platform: platform || "Web",
        duration_seconds: duration_seconds || 0,
        minutes_deducted: minutes_deducted || 0,
        text_content: text_content || "",
        srt_content: srt_content || "",
        vtt_content: vtt_content || "",
        user_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Transcription History POST] Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data }, { status: 201 });
  } catch (err: any) {
    console.error("[Transcription History POST] Fatal error:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a transcription from history
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("user_id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const sb = getPrivilegedSupabaseClient();
    let query = sb.from("transcriptions").delete().eq("id", id);
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno" },
      { status: 500 }
    );
  }
}
