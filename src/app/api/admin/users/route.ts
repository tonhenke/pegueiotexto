import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getUsersList, upsertUser, UserRecord } from "@/lib/admin-store";

export async function GET(request: Request) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
  }

  try {
    const users = await getUsersList();

    // Calculate metrics
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalUsers = users.length;
    const newToday = users.filter((u) => new Date(u.created_at) >= oneDayAgo).length;
    const newThisWeek = users.filter((u) => new Date(u.created_at) >= sevenDaysAgo).length;

    const paidPlans = ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual"];
    const paidUsers = users.filter((u) => paidPlans.includes((u.plan || "").toLowerCase().trim())).length;
    const freeUsers = totalUsers - paidUsers;

    const conversionRate = totalUsers > 0 ? Number(((paidUsers / totalUsers) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      users,
      summary: {
        total_users: totalUsers,
        new_today: newToday,
        new_this_week: newThisWeek,
        paid_users: paidUsers,
        free_users: freeUsers,
        conversion_rate: conversionRate,
      },
    });
  } catch (err) {
    console.error("[Admin Users GET] Erro:", err);
    return NextResponse.json({ detail: "Erro ao buscar lista de usuários." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const body = await request.json().catch(() => ({}));

    // Action 1: Record user creation or activity (called on signup / login / dashboard load)
    if (action === "record_user") {
      const { id, email, name, plan, credits_minutes, referral_source } = body;
      if (!email) {
        return NextResponse.json({ detail: "E-mail é obrigatório." }, { status: 400 });
      }

      const user = upsertUser({
        id,
        email,
        name,
        plan,
        credits_minutes,
        referral_source,
      });

      return NextResponse.json({ success: true, user });
    }

    // Action 2: Update user plan or credits (admin only)
    if (action === "update_user_plan") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
      }

      const { email, plan, credits_minutes } = body;
      if (!email) {
        return NextResponse.json({ detail: "E-mail é obrigatório." }, { status: 400 });
      }

      const user = upsertUser({
        email,
        plan,
        credits_minutes,
      });

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ detail: "Ação não reconhecida." }, { status: 400 });
  } catch (err) {
    console.error("[Admin Users POST] Erro:", err);
    return NextResponse.json({ detail: "Erro interno do servidor." }, { status: 500 });
  }
}
