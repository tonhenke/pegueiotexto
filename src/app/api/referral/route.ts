import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import {
  readStoreJSON,
  writeStoreJSON,
  getSupabaseServiceKey,
  upsertUser,
} from "@/lib/admin-store";

export interface ReferralRecord {
  id: string;
  referrer_id: string;
  referrer_email?: string;
  referred_user_id: string;
  referred_email?: string;
  minutes_awarded_referrer: number;
  minutes_awarded_referred: number;
  created_at: string;
}

const REFERRALS_FILE = path.join(process.cwd(), "data", "referrals.json");

export function getStoredReferrals(): ReferralRecord[] {
  return readStoreJSON<ReferralRecord>(REFERRALS_FILE);
}

export function saveStoredReferrals(records: ReferralRecord[]) {
  writeStoreJSON(REFERRALS_FILE, records);
}

function getPrivilegedSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey = getSupabaseServiceKey() || "";
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET: Returns referral stats for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ detail: "user_id é obrigatório." }, { status: 400 });
  }

  const referralCode = userId.slice(0, 8).toLowerCase();
  const referrals = getStoredReferrals();
  const userReferrals = referrals.filter(
    (r) =>
      r.referrer_id === userId ||
      (r.referrer_id && r.referrer_id.toLowerCase().startsWith(referralCode))
  );
  const wasReferred = referrals.some((r) => r.referred_user_id === userId);

  const totalInvites = userReferrals.length;
  const totalMinutesEarned = userReferrals.reduce(
    (acc, r) => acc + (r.minutes_awarded_referrer || 10),
    0
  );

  return NextResponse.json({
    referral_code: referralCode,
    total_invites: totalInvites,
    total_minutes_earned: totalMinutesEarned,
    was_referred: wasReferred,
    history: userReferrals.map((r) => ({
      created_at: r.created_at,
      minutes: r.minutes_awarded_referrer,
      referred_email: r.referred_email
        ? r.referred_email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
        : undefined,
    })),
  });
}

// POST: Claims a referral when an invited user registers/logs in
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref_code, new_user_id, new_user_email } = body;

    if (!ref_code || !new_user_id) {
      return NextResponse.json(
        { detail: "ref_code e new_user_id são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanRef = String(ref_code).trim().toLowerCase();

    // 1. Prevent self-referral
    if (new_user_id.toLowerCase().startsWith(cleanRef)) {
      return NextResponse.json(
        {
          success: false,
          message: "Não é permitido utilizar o próprio link de convite.",
        },
        { status: 400 }
      );
    }

    // 2. Check if this new user has already claimed a referral bonus
    const referrals = getStoredReferrals();
    const alreadyClaimed = referrals.some(
      (r) =>
        r.referred_user_id === new_user_id ||
        (new_user_email &&
          r.referred_email &&
          r.referred_email.toLowerCase() === new_user_email.toLowerCase())
    );

    if (alreadyClaimed) {
      return NextResponse.json({
        success: false,
        already_claimed: true,
        message: "O bônus de indicação para esta conta já foi concedido anteriormente.",
      });
    }

    // 3. Find the referrer user in Supabase profiles using targeted query
    const sb = getPrivilegedSupabaseClient();
    let referrer: any = null;

    const { data: directProfiles } = await sb
      .from("profiles")
      .select("id, name, email, credits_minutes")
      .or(`id.ilike.${cleanRef}%,email.ilike.${cleanRef}%`)
      .limit(1);

    if (directProfiles && directProfiles.length > 0) {
      referrer = directProfiles[0];
    }

    // Fallback: search in Supabase Auth user by ID
    if (!referrer && cleanRef.length >= 8) {
      try {
        const { data: userData } = await sb.auth.admin.getUserById(cleanRef);
        if (userData?.user) {
          referrer = {
            id: userData.user.id,
            name:
              userData.user.user_metadata?.full_name ||
              userData.user.email?.split("@")[0] ||
              "Usuário",
            email: userData.user.email || "",
            credits_minutes: 5,
          };
        }
      } catch (authErr) {
        console.warn("[Referral] Fallback auth getUserById error:", authErr);
      }
    }

    if (!referrer) {
      return NextResponse.json(
        {
          success: false,
          message: "Código de convite inválido ou usuário que indicou não encontrado.",
        },
        { status: 404 }
      );
    }

    if (
      referrer.id === new_user_id ||
      (new_user_email &&
        referrer.email &&
        referrer.email.toLowerCase() === new_user_email.toLowerCase())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Não é permitido utilizar o próprio convite.",
        },
        { status: 400 }
      );
    }

    // 4. Award credits:
    // +10 minutes to the referrer
    const referrerCurrentCredits = Number(referrer.credits_minutes ?? 5);
    const referrerNewCredits = referrerCurrentCredits + 10;
    await sb
      .from("profiles")
      .update({
        credits_minutes: referrerNewCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referrer.id);

    // Sync referrer with admin-store
    try {
      upsertUser({
        id: referrer.id,
        email: referrer.email,
        name: referrer.name,
        credits_minutes: referrerNewCredits,
      });
    } catch {}

    // +10 minutes to the new invited user
    let newBalance = 15; // default 5 free + 10 referral bonus
    const { data: invitedProfile } = await sb
      .from("profiles")
      .select("id, credits_minutes, email, name")
      .eq("id", new_user_id)
      .single();

    if (invitedProfile) {
      const invitedCurrentCredits = Number(invitedProfile.credits_minutes ?? 5);
      newBalance = invitedCurrentCredits + 10;
      await sb
        .from("profiles")
        .update({
          credits_minutes: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq("id", new_user_id);
    } else {
      await sb.from("profiles").upsert({
        id: new_user_id,
        credits_minutes: newBalance,
        email: new_user_email || "",
        plan: "gratuito",
        updated_at: new Date().toISOString(),
      });
    }

    // Sync new user with admin-store
    try {
      upsertUser({
        id: new_user_id,
        email: new_user_email || invitedProfile?.email || "",
        name: invitedProfile?.name,
        credits_minutes: newBalance,
        referral_source: `convite_${cleanRef}`,
      });
    } catch {}

    // Persist metadata in Supabase Auth user for audit/recovery
    try {
      await sb.auth.admin.updateUserById(new_user_id, {
        user_metadata: {
          referred_by_id: referrer.id,
          referral_code_used: cleanRef,
          referral_claimed_at: new Date().toISOString(),
        },
      });
    } catch {}

    // 5. Save referral record persistently
    const newRecord: ReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referrer_id: referrer.id,
      referrer_email: referrer.email,
      referred_user_id: new_user_id,
      referred_email: new_user_email,
      minutes_awarded_referrer: 10,
      minutes_awarded_referred: 10,
      created_at: new Date().toISOString(),
    };

    referrals.push(newRecord);
    saveStoredReferrals(referrals);

    return NextResponse.json({
      success: true,
      minutes_awarded: 10,
      new_balance: newBalance,
      referrer_name: referrer.name || "Amigo",
      message: "Parabéns! Você e seu amigo ganharam 10 minutos cada.",
    });
  } catch (err: any) {
    console.error("[Referral Claim] Erro no processamento:", err);
    return NextResponse.json(
      {
        success: false,
        detail: err.message || "Erro interno ao processar indicação.",
      },
      { status: 500 }
    );
  }
}
