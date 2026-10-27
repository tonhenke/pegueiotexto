import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Persistent file storage fallback for referrals
const DATA_DIR = path.join(process.cwd(), "data");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.json");

interface ReferralRecord {
  id: string;
  referrer_id: string;
  referred_user_id: string;
  referred_email?: string;
  minutes_awarded_referrer: number;
  minutes_awarded_referred: number;
  created_at: string;
}

function getStoredReferrals(): ReferralRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(REFERRALS_FILE)) {
      fs.writeFileSync(REFERRALS_FILE, JSON.stringify([]), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(REFERRALS_FILE, "utf-8");
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error("[Referral] Erro ao ler referrals.json:", err);
    return [];
  }
}

function saveStoredReferrals(records: ReferralRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(REFERRALS_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("[Referral] Erro ao salvar referrals.json:", err);
  }
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_VYRSuA8NTBM_cqQSUdtwRA_Spnnao2Y";
  return createClient(supabaseUrl, supabaseKey);
}

// GET: Returns referral stats for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ detail: "user_id é obrigatório." }, { status: 400 });
  }

  const referralCode = userId.slice(0, 8);
  const referrals = getStoredReferrals();
  const userReferrals = referrals.filter((r) => r.referrer_id === userId);
  const wasReferred = referrals.some((r) => r.referred_user_id === userId);

  const totalInvites = userReferrals.length;
  const totalMinutesEarned = userReferrals.reduce((acc, r) => acc + (r.minutes_awarded_referrer || 10), 0);

  return NextResponse.json({
    referral_code: referralCode,
    total_invites: totalInvites,
    total_minutes_earned: totalMinutesEarned,
    was_referred: wasReferred,
    history: userReferrals.map((r) => ({
      created_at: r.created_at,
      minutes: r.minutes_awarded_referrer,
    })),
  });
}

// POST: Claims a referral when an invited user registers/logs in
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ref_code, new_user_id, new_user_email } = body;

    if (!ref_code || !new_user_id) {
      return NextResponse.json({ detail: "ref_code e new_user_id são obrigatórios." }, { status: 400 });
    }

    const cleanRef = String(ref_code).trim().toLowerCase();

    // 1. Prevent self-referral
    if (new_user_id.toLowerCase().startsWith(cleanRef)) {
      return NextResponse.json({
        success: false,
        message: "Não é permitido utilizar o próprio link de convite.",
      }, { status: 400 });
    }

    // 2. Check if this new user has already claimed a referral bonus
    const referrals = getStoredReferrals();
    const alreadyClaimed = referrals.some((r) => r.referred_user_id === new_user_id);

    if (alreadyClaimed) {
      return NextResponse.json({
        success: false,
        already_claimed: true,
        message: "O bônus de indicação para esta conta já foi concedido anteriormente.",
      });
    }

    // 3. Find the referrer user in Supabase profiles
    const sb = getSupabaseClient();
    const { data: allProfiles, error: profErr } = await sb
      .from("profiles")
      .select("id, name, email, credits_minutes");

    let referrer = null;
    if (allProfiles && allProfiles.length > 0) {
      referrer = allProfiles.find((p) => p.id.toLowerCase().startsWith(cleanRef));
    }

    // If referrer profile not found via prefix search
    if (!referrer) {
      // Try exact ID match
      const { data: exactUser } = await sb
        .from("profiles")
        .select("id, name, email, credits_minutes")
        .eq("id", cleanRef)
        .single();
      if (exactUser) {
        referrer = exactUser;
      }
    }

    // If referrer cannot be determined
    if (!referrer) {
      return NextResponse.json({
        success: false,
        message: "Código de convite inválido ou usuário que indicou não encontrado.",
      }, { status: 404 });
    }

    if (referrer.id === new_user_id) {
      return NextResponse.json({
        success: false,
        message: "Não é permitido utilizar o próprio convite.",
      }, { status: 400 });
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

    // +10 minutes to the new invited user
    let newBalance = 15; // default 5 free + 10 referral bonus
    const { data: invitedProfile } = await sb
      .from("profiles")
      .select("id, credits_minutes")
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

    // 5. Save referral record persistently
    const newRecord: ReferralRecord = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referrer_id: referrer.id,
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
    return NextResponse.json({
      success: false,
      detail: err.message || "Erro interno ao processar indicação.",
    }, { status: 500 });
  }
}
