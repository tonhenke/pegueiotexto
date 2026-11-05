import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateEmailSyntax, isDisposableEmail } from "@/lib/email-validator";
import { sendWelcomeEmail } from "@/lib/email";
import { getSupabaseServiceKey, upsertUser } from "@/lib/admin-store";
import { getStoredReferrals, saveStoredReferrals, ReferralRecord } from "@/app/api/referral/route";

export const dynamic = "force-dynamic";

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
    const { email, name, password, ref_code } = body;

    if (!email || !password) {
      return NextResponse.json(
        { detail: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { detail: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name || cleanEmail.split("@")[0]).trim();

    // 1. Validação de formato e bloqueio de provedores descartáveis (0ms)
    if (!validateEmailSyntax(cleanEmail)) {
      return NextResponse.json(
        { detail: "Por favor, digite um formato de e-mail válido." },
        { status: 400 }
      );
    }

    if (isDisposableEmail(cleanEmail)) {
      return NextResponse.json(
        {
          detail:
            "E-mails temporários ou descartáveis não são permitidos. Por favor, utilize um e-mail válido (Gmail, Outlook, Yahoo, etc.).",
        },
        { status: 400 }
      );
    }

    const sb = getPrivilegedSupabaseClient();

    // 2. Checar se já existe no perfil ou no Supabase Auth
    try {
      const { data: existingProfile } = await sb
        .from("profiles")
        .select("id, email")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        return NextResponse.json(
          { detail: "Este e-mail já possui cadastro. Por favor, faça login com sua senha." },
          { status: 409 }
        );
      }
    } catch (checkErr) {
      console.warn("[Signup] Erro ao verificar duplicidade de perfil:", checkErr);
    }

    // 3. Criar usuário confirmado no Supabase Auth
    let userId = "";
    try {
      const { data: newAuth, error: createErr } = await sb.auth.admin.createUser({
        email: cleanEmail,
        password: String(password),
        email_confirm: true,
        user_metadata: { full_name: cleanName },
      });

      if (createErr) {
        if (createErr.message?.toLowerCase().includes("already registered") || createErr.message?.toLowerCase().includes("already exists")) {
          return NextResponse.json(
            { detail: "Este e-mail já possui cadastro. Por favor, faça login com sua senha." },
            { status: 409 }
          );
        }
        throw createErr;
      }

      userId = newAuth.user.id;
    } catch (authErr: any) {
      console.error("[Signup] Erro ao criar conta no Supabase Auth:", authErr);
      return NextResponse.json(
        { detail: authErr.message || "Não foi possível criar a conta. Tente novamente." },
        { status: 500 }
      );
    }

    // 4. Salvar perfil inicial no Supabase com 5 minutos
    let initialCredits = 5;
    const nowIso = new Date().toISOString();

    try {
      await sb.from("profiles").upsert({
        id: userId,
        email: cleanEmail,
        name: cleanName,
        plan: "gratuito",
        credits_minutes: initialCredits,
        updated_at: nowIso,
      });
    } catch (profErr) {
      console.warn("[Signup] Erro ao gravar perfil:", profErr);
    }

    // 5. Se houver código de indicação (ref_code), processar bônus
    const cleanRef = ref_code ? String(ref_code).trim().toLowerCase() : "";
    let referralAwarded = false;

    if (cleanRef && !userId.toLowerCase().startsWith(cleanRef)) {
      try {
        const { data: allProfiles } = await sb
          .from("profiles")
          .select("id, name, email, credits_minutes");

        const referrer = allProfiles?.find(
          (p) =>
            p.id.toLowerCase().startsWith(cleanRef) ||
            p.id.replace(/-/g, "").toLowerCase().startsWith(cleanRef) ||
            (p.email && p.email.toLowerCase() === cleanRef) ||
            (p.email && p.email.toLowerCase().split("@")[0] === cleanRef)
        );

        if (referrer && referrer.id !== userId) {
          // +10 min para quem indicou
          const refCredits = Number(referrer.credits_minutes ?? 5) + 10;
          await sb.from("profiles").update({ credits_minutes: refCredits, updated_at: nowIso }).eq("id", referrer.id);
          upsertUser({ id: referrer.id, email: referrer.email, name: referrer.name, credits_minutes: refCredits });

          // +10 min para o novo usuário (5 + 10 = 15)
          initialCredits = 15;
          await sb.from("profiles").update({ credits_minutes: initialCredits, updated_at: nowIso }).eq("id", userId);

          // Gravar histórico de referral
          const storedRefs = getStoredReferrals();
          const newRefRecord: ReferralRecord = {
            id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            referrer_id: referrer.id,
            referrer_email: referrer.email,
            referred_user_id: userId,
            referred_email: cleanEmail,
            minutes_awarded_referrer: 10,
            minutes_awarded_referred: 10,
            created_at: nowIso,
          };
          storedRefs.push(newRefRecord);
          saveStoredReferrals(storedRefs);
          referralAwarded = true;
        }
      } catch (refErr) {
        console.warn("[Signup] Erro ao processar indicação automática:", refErr);
      }
    }

    // 6. Sincronizar com admin-store (users.json)
    try {
      upsertUser({
        id: userId,
        email: cleanEmail,
        name: cleanName,
        plan: "gratuito",
        credits_minutes: initialCredits,
        referral_source: cleanRef ? `convite_${cleanRef}` : "organico",
      });
    } catch {}

    // 7. Disparar e-mail de Boas-Vindas de forma assíncrona (não-bloqueante)
    sendWelcomeEmail({ to: cleanEmail, name: cleanName }).catch((err) => {
      console.warn("[Signup] Falha no disparo de boas-vindas assíncrono:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso!",
      user: {
        id: userId,
        email: cleanEmail,
        credits: initialCredits,
        referral_awarded: referralAwarded,
      },
    });
  } catch (err: any) {
    console.error("[Signup] Erro inesperado:", err);
    return NextResponse.json(
      { detail: err.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
