import { NextResponse } from "next/server";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { validateEmailSyntax, isDisposableEmail } from "@/lib/email-validator";
import { sendBonus15Email } from "@/lib/email";
import { readStoreJSON, writeStoreJSON, getSupabaseServiceKey } from "@/lib/admin-store";

export const dynamic = "force-dynamic";

export interface DownloaderLead {
  id: string;
  email: string;
  video_url?: string;
  video_title?: string;
  status: "pending" | "claimed";
  created_at: string;
}

const LEADS_FILE = path.join(process.cwd(), "data", "downloader_leads.json");

function getPrivilegedSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey = getSupabaseServiceKey() || "";
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, video_url, video_title } = body;

    if (!email) {
      return NextResponse.json({ detail: "Por favor, informe seu e-mail." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Validação em memória (0ms)
    if (!validateEmailSyntax(cleanEmail)) {
      return NextResponse.json({ detail: "Por favor, digite um e-mail válido." }, { status: 400 });
    }

    if (isDisposableEmail(cleanEmail)) {
      return NextResponse.json(
        { detail: "E-mails temporários não são permitidos. Digite um e-mail real para receber seus 15 minutos." },
        { status: 400 }
      );
    }

    // 2. Montar URL de ativação do bônus
    const urlObj = new URL(request.url);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || urlObj.host;
    const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${proto}://${host}`;

    const token = `b15_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const claimUrl = `${baseUrl}/login?signup=true&bonus=15min&email=${encodeURIComponent(cleanEmail)}&token=${token}`;

    // 3. Gravar no Supabase (tabela downloader_leads)
    const sb = getPrivilegedSupabaseClient();
    try {
      await sb.from("downloader_leads").upsert(
        {
          id: token,
          email: cleanEmail,
          video_url: video_url ? String(video_url).slice(0, 500) : null,
          video_title: video_title ? String(video_title).slice(0, 255) : null,
          status: "pending",
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );
    } catch (sbErr) {
      console.warn("[DownloaderLead] Aviso ao gravar lead no Supabase:", sbErr);
    }

    // 4. Gravar também no arquivo local como fallback seguro
    try {
      const leads = readStoreJSON<DownloaderLead>(LEADS_FILE);
      const existing = leads.find((l) => l.email === cleanEmail);
      if (!existing) {
        leads.unshift({
          id: token,
          email: cleanEmail,
          video_url: video_url ? String(video_url).slice(0, 300) : undefined,
          video_title: video_title ? String(video_title).slice(0, 150) : undefined,
          status: "pending",
          created_at: new Date().toISOString(),
        });
        writeStoreJSON(LEADS_FILE, leads.slice(0, 2000));
      }
    } catch (saveErr) {
      console.warn("[DownloaderLead] Erro ao salvar lead local:", saveErr);
    }

    // 5. Disparar e-mail com 15 minutos grátis de forma assíncrona (não-bloqueante)
    sendBonus15Email({ to: cleanEmail, claimUrl }).catch((mailErr) => {
      console.warn("[DownloaderLead] Erro no envio assíncrono do e-mail de 15 minutos:", mailErr);
    });

    return NextResponse.json({
      success: true,
      message: "Download liberado e 15 minutos enviados com sucesso!",
    });
  } catch (err: any) {
    console.error("[DownloaderLead] Erro inesperado:", err);
    return NextResponse.json({ detail: "Erro ao processar." }, { status: 500 });
  }
}
