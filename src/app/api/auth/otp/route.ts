import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { checkEmailDomainMx } from "@/lib/email-validator";
import { sendOtpEmail, sendWelcomeEmail } from "@/lib/email";
import { savePendingOtp, verifyPendingOtp } from "@/lib/otp-store";
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
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const body = await request.json().catch(() => ({}));

    // ============================================================
    // ACTION: SEND OTP CODE
    // ============================================================
    if (action === "send") {
      const { email, name, password } = body;

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

      // 1. Verificação de sintaxe, domínios descartáveis e MX no DNS
      const validation = await checkEmailDomainMx(cleanEmail);
      if (!validation.valid) {
        return NextResponse.json(
          { detail: validation.reason || "E-mail inválido." },
          { status: 400 }
        );
      }

      // 2. Verificar se o e-mail já existe no Supabase
      const sb = getPrivilegedSupabaseClient();
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
        console.warn("[OTP] Erro ao verificar duplicidade de perfil:", checkErr);
      }

      // 3. Gerar código de 6 dígitos criptograficamente seguro
      const code = crypto.randomInt(100000, 1000000).toString();

      // 4. Salvar na store temporária (com rate limiting de 60s)
      const saveResult = savePendingOtp({
        email: cleanEmail,
        name: cleanName,
        password: String(password),
        code,
      });

      if (!saveResult.success) {
        return NextResponse.json(
          {
            detail: saveResult.error,
            retry_after: saveResult.retryAfterSeconds,
          },
          { status: 429 }
        );
      }

      // 5. Enviar e-mail com o código OTP
      const sent = await sendOtpEmail({
        to: cleanEmail,
        name: cleanName,
        code,
      });

      if (!sent) {
        return NextResponse.json(
          { detail: "Não foi possível enviar o e-mail com o código. Verifique o endereço e tente novamente." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Código de confirmação enviado para seu e-mail.",
        email: cleanEmail,
      });
    }

    // ============================================================
    // ACTION: VERIFY OTP CODE & CREATE ACCOUNT
    // ============================================================
    if (action === "verify") {
      const { email, code, ref_code } = body;

      if (!email || !code) {
        return NextResponse.json(
          { detail: "E-mail e código de 6 dígitos são obrigatórios." },
          { status: 400 }
        );
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanCode = String(code).trim().replace(/\s+/g, "");

      // 1. Validar código na store
      const verifyRes = verifyPendingOtp(cleanEmail, cleanCode);
      if (!verifyRes.valid || !verifyRes.data) {
        return NextResponse.json(
          { detail: verifyRes.error || "Código inválido ou expirado." },
          { status: 400 }
        );
      }

      const { name, password } = verifyRes.data;
      const sb = getPrivilegedSupabaseClient();
      let userId = "";

      // 2. Criar ou ativar o usuário no Supabase Auth com email_confirm: true
      try {
        const { data: authList } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existingAuth = authList?.users?.find(
          (u) => u.email?.toLowerCase() === cleanEmail
        );

        if (existingAuth) {
          userId = existingAuth.id;
          await sb.auth.admin.updateUserById(userId, {
            password,
            email_confirm: true,
            user_metadata: { full_name: name },
          });
        } else {
          const { data: newAuth, error: createErr } = await sb.auth.admin.createUser({
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: { full_name: name },
          });

          if (createErr) throw createErr;
          userId = newAuth.user.id;
        }
      } catch (authErr: any) {
        console.error("[OTP Verify] Erro ao criar usuário no Supabase Auth:", authErr);
        return NextResponse.json(
          { detail: "Erro ao criar conta no banco de dados: " + (authErr.message || "") },
          { status: 500 }
        );
      }

      // 3. Salvar perfil inicial no Supabase profiles com 25 minutos renováveis a cada 7 dias
      let initialCredits = 25;
      const nowIso = new Date().toISOString();

      try {
        await sb.from("profiles").upsert({
          id: userId,
          email: cleanEmail,
          name,
          plan: "gratuito",
          credits_minutes: initialCredits,
          updated_at: nowIso,
          last_free_renewal_at: nowIso,
        });
      } catch (profErr) {
        try {
          await sb.from("profiles").upsert({
            id: userId,
            email: cleanEmail,
            name,
            plan: "gratuito",
            credits_minutes: initialCredits,
            updated_at: nowIso,
          });
        } catch (fallbackErr) {
          console.warn("[OTP Verify] Erro ao gravar profile:", fallbackErr);
        }
      }

      try {
        await sb.from("credit_transactions").insert({
          user_id: userId,
          amount_minutes: initialCredits,
          type: "initial_free_credits",
        });
      } catch {}

      // 4. Se houver código de indicação (ref_code), processar bônus de indicação
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
            const refCredits = Number(referrer.credits_minutes ?? 25) + 10;
            await sb.from("profiles").update({ credits_minutes: refCredits, updated_at: nowIso }).eq("id", referrer.id);
            upsertUser({ id: referrer.id, email: referrer.email, name: referrer.name, credits_minutes: refCredits });

            // +10 min para o novo usuário (25 + 10 = 35)
            initialCredits = 35;
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
          console.warn("[OTP Verify] Erro ao processar indicação automática:", refErr);
        }
      }

      // 5. Sincronizar com admin-store (users.json)
      try {
        upsertUser({
          id: userId,
          email: cleanEmail,
          name,
          plan: "gratuito",
          credits_minutes: initialCredits,
          referral_source: cleanRef ? `convite_${cleanRef}` : "organico",
        });
      } catch {}

      // 6. Disparar e-mail de Boas-Vindas
      sendWelcomeEmail({ to: cleanEmail, name }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: "Conta ativada com sucesso!",
        user: {
          id: userId,
          email: cleanEmail,
          credits: initialCredits,
          referral_awarded: referralAwarded,
        },
      });
    }

    return NextResponse.json({ detail: "Ação inválida." }, { status: 400 });
  } catch (err: any) {
    console.error("[OTP Route] Erro inesperado:", err);
    return NextResponse.json(
      { detail: err.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
