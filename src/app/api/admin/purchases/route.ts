import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  getPurchasesList,
  recordPurchase,
  getAdminSettings,
  saveAdminSettings,
  dispatchPurchaseAlert,
  PurchaseRecord,
} from "@/lib/admin-store";

export async function GET(request: Request) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
  }

  try {
    const purchases = getPurchasesList();
    const settings = getAdminSettings();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const paidPurchases = purchases.filter((p) => p.status === "paid");
    const totalRevenue = paidPurchases.reduce((acc, p) => acc + (p.amount || 0), 0);
    const totalOrders = paidPurchases.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const salesToday = paidPurchases.filter((p) => new Date(p.created_at) >= oneDayAgo);
    const revenueToday = salesToday.reduce((acc, p) => acc + (p.amount || 0), 0);

    const salesThisMonth = paidPurchases.filter((p) => new Date(p.created_at) >= thirtyDaysAgo);
    const revenueThisMonth = salesThisMonth.reduce((acc, p) => acc + (p.amount || 0), 0);

    return NextResponse.json({
      success: true,
      purchases,
      settings,
      summary: {
        total_revenue: Number(totalRevenue.toFixed(2)),
        total_orders: totalOrders,
        average_ticket: Number(avgTicket.toFixed(2)),
        orders_today: salesToday.length,
        revenue_today: Number(revenueToday.toFixed(2)),
        orders_month: salesThisMonth.length,
        revenue_month: Number(revenueThisMonth.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("[Admin Purchases GET] Erro:", err);
    return NextResponse.json({ detail: "Erro ao buscar histórico de vendas." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const body = await request.json().catch(() => ({}));

    // Action 1: Record a purchase (called from checkout webhook or backend verify)
    if (action === "record_purchase") {
      const {
        buyer_email,
        buyer_name,
        user_id,
        plan_id,
        plan_name,
        amount,
        currency,
        payment_method,
        stripe_session_id,
        affiliate_code,
      } = body;

      if (!buyer_email || !plan_id || amount === undefined) {
        return NextResponse.json({ detail: "Dados de compra incompletos." }, { status: 400 });
      }

      const purchase = await recordPurchase({
        buyer_email,
        buyer_name,
        user_id,
        plan_id,
        plan_name,
        amount: Number(amount),
        currency: currency || "BRL",
        payment_method: payment_method || "card",
        stripe_session_id,
        affiliate_code,
      });

      return NextResponse.json({ success: true, purchase });
    }

    // Action 2: Save Alert Settings (Admin only)
    if (action === "save_settings") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
      }

      const { webhook_url, notify_webhook, notify_email, sound_enabled, admin_email } = body;
      const updated = saveAdminSettings({
        webhook_url,
        notify_webhook: notify_webhook !== false,
        notify_email: notify_email !== false,
        sound_enabled: sound_enabled !== false,
        admin_email,
      });

      return NextResponse.json({ success: true, settings: updated });
    }

    // Action 3: Send Test Alert (Admin only)
    if (action === "test_alert") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso administrativo não autorizado." }, { status: 401 });
      }

      const testPurchase: PurchaseRecord = {
        id: `test_${Date.now()}`,
        stripe_session_id: `cs_test_${Math.random().toString(36).substring(2, 10)}`,
        buyer_email: "cliente.teste@exemplo.com",
        buyer_name: "Cliente de Teste",
        plan_id: "pro_annual",
        plan_name: "Pro Anual (2.160 min - 25% OFF)",
        amount: 963.0,
        currency: "BRL",
        payment_method: "cartao",
        status: "paid",
        created_at: new Date().toISOString(),
      };

      await dispatchPurchaseAlert(testPurchase);

      return NextResponse.json({
        success: true,
        message: "Notificação de teste disparada com sucesso! Verifique seu webhook ou canal configurado.",
      });
    }

    return NextResponse.json({ detail: "Ação não reconhecida." }, { status: 400 });
  } catch (err) {
    console.error("[Admin Purchases POST] Erro:", err);
    return NextResponse.json({ detail: "Erro interno do servidor." }, { status: 500 });
  }
}
