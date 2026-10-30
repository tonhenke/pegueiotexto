import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getUsersList, upsertUser, deleteUserAccount, UserRecord } from "@/lib/admin-store";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    const paidPlans = ["starter", "starter_annual", "pro", "pro_annual", "business", "business_annual", "ilimitado", "unlimited"];
    const paidUsers = users.filter((u) => paidPlans.includes((u.plan || "").toLowerCase().trim())).length;
    const freeUsers = totalUsers - paidUsers;

    const conversionRate = totalUsers > 0 ? Number(((paidUsers / totalUsers) * 100).toFixed(1)) : 0;

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
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

      // Dispatch welcome email via Zoho Mail if it is a new signup
      if (body.is_new_signup) {
        sendWelcomeEmail({
          to: email,
          name: name || user.name,
        }).catch((err) => console.warn("[Email] Erro ao disparar boas-vindas:", err));
      }

      return NextResponse.json({ success: true, user });
    }

    // Action 1.5: Send welcome email manually (testing or admin resend)
    if (action === "send_welcome") {
      const { email, name } = body;
      if (!email) {
        return NextResponse.json({ detail: "E-mail é obrigatório." }, { status: 400 });
      }
      const sent = await sendWelcomeEmail({ to: email, name });
      return NextResponse.json({ success: sent });
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

    // Action 3: Delete user account (admin only)
    if (action === "delete_user") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
      }

      const { email, id } = body;
      if (!email && !id) {
        return NextResponse.json({ detail: "E-mail ou ID do usuário é obrigatório." }, { status: 400 });
      }

      if (email && email.toLowerCase().trim() === "tonhenke@gmail.com") {
        return NextResponse.json({ detail: "Não é permitido excluir a conta do Administrador principal." }, { status: 400 });
      }

      const result = await deleteUserAccount({ email, id });
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ detail: "Ação não reconhecida." }, { status: 400 });
  } catch (err: any) {
    console.error("[Admin Users POST] Erro:", err);
    return NextResponse.json({ detail: err.message || "Erro interno do servidor." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");
    const idParam = searchParams.get("id");
    const body = await request.json().catch(() => ({}));

    const email = body.email || emailParam;
    const id = body.id || idParam;

    if (!email && !id) {
      return NextResponse.json({ detail: "E-mail ou ID é obrigatório." }, { status: 400 });
    }

    if (email && email.toLowerCase().trim() === "tonhenke@gmail.com") {
      return NextResponse.json({ detail: "Não é permitido excluir a conta do Administrador principal." }, { status: 400 });
    }

    const result = await deleteUserAccount({ email, id });
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("[Admin Users DELETE] Erro:", err);
    return NextResponse.json({ detail: err.message || "Erro ao excluir usuário." }, { status: 500 });
  }
}
