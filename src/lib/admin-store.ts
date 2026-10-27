import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  plan: string;
  plan_name: string;
  credits_minutes: number;
  referral_source: string;
  created_at: string;
  last_active_at: string;
  total_spent?: number;
}

export interface PurchaseRecord {
  id: string;
  stripe_session_id?: string;
  buyer_email: string;
  buyer_name?: string;
  user_id?: string;
  plan_id: string;
  plan_name: string;
  amount: number; // in BRL, e.g. 47.00
  currency: string; // "BRL"
  payment_method?: string; // "card", "pix", etc.
  affiliate_code?: string;
  status: "paid" | "refunded";
  created_at: string;
}

export interface AdminAlertSettings {
  webhook_url: string;
  notify_webhook: boolean;
  notify_email: boolean;
  admin_email: string;
  sound_enabled: boolean;
}

// File path helpers supporting local development and Vercel/serverless /tmp
function getStorageDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "pegueiotexto_data");
  }
  return path.join(process.cwd(), "data");
}

function getTmpFilePath(filename: string): string {
  return path.join("/tmp", "pegueiotexto_data", filename);
}

function getBundledFilePath(filename: string): string {
  return path.join(process.cwd(), "data", filename);
}

const DATA_DIR = getStorageDir();
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PURCHASES_FILE = path.join(DATA_DIR, "purchases.json");
const SETTINGS_FILE = path.join(DATA_DIR, "admin_settings.json");

export function readStoreJSON<T>(filePath: string): T[] {
  const filename = path.basename(filePath);
  const tmpPath = getTmpFilePath(filename);
  const bundledPath = getBundledFilePath(filename);

  let tmpList: any[] = [];
  let bundledList: any[] = [];

  try {
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      tmpList = JSON.parse(raw) || [];
    }
  } catch {}

  try {
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, "utf-8");
      bundledList = JSON.parse(raw) || [];
    }
  } catch {}

  const map = new Map<string, any>();
  const getRecordKey = (item: any) =>
    item.id || item.email || item.stripe_session_id || JSON.stringify(item);

  for (const item of bundledList) {
    map.set(getRecordKey(item), item);
  }
  for (const item of tmpList) {
    map.set(getRecordKey(item), item);
  }

  return Array.from(map.values()) as T[];
}

export function writeStoreJSON<T>(filePath: string, data: T[]): void {
  const filename = path.basename(filePath);
  const tmpPath = getTmpFilePath(filename);
  const bundledPath = getBundledFilePath(filename);
  const jsonStr = JSON.stringify(data, null, 2);

  // Write to bundled data folder if writable
  try {
    const parentDir = path.dirname(bundledPath);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(bundledPath, jsonStr, "utf-8");
  } catch {}

  // Always write to /tmp for serverless persistence
  try {
    const tmpDir = path.dirname(tmpPath);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(tmpPath, jsonStr, "utf-8");
  } catch {}
}

export const PLAN_NAMES: Record<string, string> = {
  gratuito: "Gratuito",
  starter: "Starter (60 min)",
  starter_annual: "Starter Anual (720 min)",
  pro: "Pro (180 min)",
  pro_annual: "Pro Anual (2.160 min - 25% OFF)",
  business: "Business (400 min)",
  business_annual: "Business Anual (4.800 min)",
};

export function getCleanPlanName(planId: string): string {
  const key = (planId || "gratuito").toLowerCase().trim();
  return PLAN_NAMES[key] || planId.charAt(0).toUpperCase() + planId.slice(1);
}

// ==========================================
// USERS STORE
// ==========================================

export async function getUsersList(): Promise<UserRecord[]> {
  const storedUsers = readStoreJSON<UserRecord>(USERS_FILE);
  const userMap = new Map<string, UserRecord>();

  for (const u of storedUsers) {
    if (u.email) userMap.set(u.email.toLowerCase().trim(), u);
  }

  // Attempt to enrich with Supabase Auth or Profiles if service role key exists
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey) {
    try {
      const sb = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // 1. Fetch Supabase Auth users
      const { data: authData } = await sb.auth.admin.listUsers();
      if (authData?.users) {
        for (const su of authData.users) {
          const email = (su.email || "").toLowerCase().trim();
          if (!email) continue;

          const existing = userMap.get(email);
          const metaName = su.user_metadata?.full_name || su.user_metadata?.name || email.split("@")[0];

          if (!existing) {
            userMap.set(email, {
              id: su.id,
              email,
              name: metaName,
              plan: "gratuito",
              plan_name: "Gratuito",
              credits_minutes: 5,
              referral_source: "organico",
              created_at: su.created_at || new Date().toISOString(),
              last_active_at: su.last_sign_in_at || su.created_at || new Date().toISOString(),
            });
          }
        }
      }

      // 2. Fetch Profiles table to update plan and credits
      const { data: profiles } = await sb.from("profiles").select("*");
      if (profiles) {
        for (const p of profiles) {
          const email = (p.email || "").toLowerCase().trim();
          const target = email ? userMap.get(email) : Array.from(userMap.values()).find((u) => u.id === p.id);
          if (target) {
            if (p.plan) {
              target.plan = p.plan;
              target.plan_name = getCleanPlanName(p.plan);
            }
            if (p.credits_minutes !== undefined) {
              target.credits_minutes = p.credits_minutes;
            }
            if (p.name && !target.name) {
              target.name = p.name;
            }
          }
        }
      }
      writeStoreJSON(USERS_FILE, Array.from(userMap.values()));
    } catch (sbErr) {
      console.warn("[AdminStore] Supabase admin sync opcional ignorado:", sbErr);
    }
  }

  // Reset and calculate total_spent per user strictly from confirmed purchases
  for (const u of userMap.values()) {
    u.total_spent = 0;
  }
  const purchases = getPurchasesList();
  for (const pur of purchases) {
    if (pur.buyer_email && pur.status === "paid") {
      const u = userMap.get(pur.buyer_email.toLowerCase().trim());
      if (u) {
        u.total_spent = Number(((u.total_spent || 0) + (pur.amount || 0)).toFixed(2));
      }
    }
  }

  // Sort by created_at descending (newest accounts first)
  return Array.from(userMap.values()).sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime();
    const timeB = new Date(b.created_at || 0).getTime();
    return timeB - timeA;
  });
}

export function upsertUser(data: Partial<UserRecord> & { email: string }): UserRecord {
  const users = readStoreJSON<UserRecord>(USERS_FILE);
  const cleanEmail = data.email.toLowerCase().trim();
  const existingIdx = users.findIndex((u) => u.email.toLowerCase().trim() === cleanEmail);

  const planId = data.plan || (existingIdx >= 0 ? users[existingIdx].plan : "gratuito");
  const planName = getCleanPlanName(planId);
  const now = new Date().toISOString();

  let userRecord: UserRecord;

  if (existingIdx >= 0) {
    userRecord = {
      ...users[existingIdx],
      ...data,
      email: cleanEmail,
      plan: planId,
      plan_name: planName,
      last_active_at: now,
    };
    users[existingIdx] = userRecord;
  } else {
    userRecord = {
      id: data.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: data.name || cleanEmail.split("@")[0],
      plan: planId,
      plan_name: planName,
      credits_minutes: data.credits_minutes ?? 5,
      referral_source: data.referral_source || "organico",
      created_at: data.created_at || now,
      last_active_at: now,
    };
    users.unshift(userRecord);
  }

  writeStoreJSON(USERS_FILE, users);
  return userRecord;
}

// ==========================================
// PURCHASES STORE
// ==========================================

export function getPurchasesList(): PurchaseRecord[] {
  const purchases = readStoreJSON<PurchaseRecord>(PURCHASES_FILE);
  return purchases.sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime();
    const timeB = new Date(b.created_at || 0).getTime();
    return timeB - timeA;
  });
}

export async function recordPurchase(data: Partial<PurchaseRecord> & { buyer_email: string; plan_id: string; amount: number }): Promise<PurchaseRecord> {
  const purchases = readStoreJSON<PurchaseRecord>(PURCHASES_FILE);

  // Check idempotency by stripe_session_id
  if (data.stripe_session_id) {
    const existing = purchases.find((p) => p.stripe_session_id === data.stripe_session_id);
    if (existing) {
      return existing;
    }
  }

  const cleanPlan = data.plan_id.toLowerCase().trim();
  const planName = data.plan_name || getCleanPlanName(cleanPlan);
  const now = new Date().toISOString();

  const purchase: PurchaseRecord = {
    id: data.id || `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    stripe_session_id: data.stripe_session_id,
    buyer_email: data.buyer_email.toLowerCase().trim(),
    buyer_name: data.buyer_name || data.buyer_email.split("@")[0],
    user_id: data.user_id,
    plan_id: cleanPlan,
    plan_name: planName,
    amount: Number(data.amount || 0),
    currency: data.currency || "BRL",
    payment_method: data.payment_method || "card",
    affiliate_code: data.affiliate_code,
    status: "paid",
    created_at: now,
  };

  purchases.unshift(purchase);
  writeStoreJSON(PURCHASES_FILE, purchases);

  // Update user's plan in user store
  upsertUser({
    email: purchase.buyer_email,
    name: purchase.buyer_name,
    plan: cleanPlan,
    plan_name: planName,
  });

  // Dispatch alert notification
  await dispatchPurchaseAlert(purchase);

  return purchase;
}

// ==========================================
// SETTINGS & ALERT DISPATCHER
// ==========================================

export function getAdminSettings(): AdminAlertSettings {
  try {
    const filename = path.basename(SETTINGS_FILE);
    const tmpPath = getTmpFilePath(filename);
    const bundledPath = getBundledFilePath(filename);

    if (fs.existsSync(tmpPath)) {
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    }
    if (fs.existsSync(bundledPath)) {
      return JSON.parse(fs.readFileSync(bundledPath, "utf-8"));
    }
  } catch {}

  return {
    admin_email: process.env.AFFILIATE_ADMIN_EMAIL || "tonhenke@gmail.com",
    webhook_url: process.env.ADMIN_PURCHASE_WEBHOOK_URL || "",
    notify_webhook: true,
    notify_email: true,
    sound_enabled: true,
  };
}

export function saveAdminSettings(settings: Partial<AdminAlertSettings>): AdminAlertSettings {
  const current = getAdminSettings();
  const updated: AdminAlertSettings = {
    ...current,
    ...settings,
  };

  const filename = path.basename(SETTINGS_FILE);
  const tmpPath = getTmpFilePath(filename);
  const bundledPath = getBundledFilePath(filename);
  const jsonStr = JSON.stringify(updated, null, 2);

  try {
    const parentDir = path.dirname(bundledPath);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(bundledPath, jsonStr, "utf-8");
  } catch {}

  try {
    const tmpDir = path.dirname(tmpPath);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(tmpPath, jsonStr, "utf-8");
  } catch {}

  return updated;
}

export async function dispatchPurchaseAlert(purchase: PurchaseRecord): Promise<void> {
  const settings = getAdminSettings();
  const webhookUrl = settings.webhook_url || process.env.ADMIN_PURCHASE_WEBHOOK_URL;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(purchase.amount);

  const formattedDate = new Date(purchase.created_at).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(`\n======================================================`);
  console.log(`🎉 [NOVA COMPRA CONFIRMADA NO PEGUEI O TEXTO] 🎉`);
  console.log(`Cliente: ${purchase.buyer_email} (${purchase.buyer_name || "N/A"})`);
  console.log(`Plano: ${purchase.plan_name} (${purchase.plan_id})`);
  console.log(`Valor: ${formattedAmount}`);
  console.log(`Data: ${formattedDate}`);
  console.log(`Stripe Session: ${purchase.stripe_session_id || "N/A"}`);
  if (purchase.affiliate_code) console.log(`Afiliado: ${purchase.affiliate_code}`);
  console.log(`======================================================\n`);

  // Webhook dispatch (Discord, Telegram, Zapier, Make, n8n, WhatsApp gateway)
  if (webhookUrl && settings.notify_webhook !== false) {
    try {
      if (webhookUrl.includes("discord.com/api/webhooks")) {
        // Discord Rich Embed
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "Peguei o Texto Vendas",
            avatar_url: "https://pegueiotexto.com.br/logo.png",
            embeds: [
              {
                title: "💰 Nova Venda Confirmada!",
                color: 0x10b981, // Emerald Green
                fields: [
                  { name: "👤 Cliente", value: purchase.buyer_email, inline: true },
                  { name: "📦 Plano", value: purchase.plan_name, inline: true },
                  { name: "💵 Valor", value: `**${formattedAmount}**`, inline: true },
                  { name: "📅 Data e Hora", value: formattedDate, inline: true },
                  { name: "💳 Pagamento", value: (purchase.payment_method || "card").toUpperCase(), inline: true },
                  { name: "🤝 Afiliado", value: purchase.affiliate_code || "Nenhum (Orgânico)", inline: true },
                ],
                footer: {
                  text: `Stripe ID: ${purchase.stripe_session_id || purchase.id}`,
                },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } else if (webhookUrl.includes("api.telegram.org")) {
        // Telegram Bot API
        const text = `🎉 *NOVA VENDA CONFIRMADA!*\n\n` +
          `👤 *Cliente:* \`${purchase.buyer_email}\`\n` +
          `📦 *Plano:* *${purchase.plan_name}*\n` +
          `💵 *Valor:* *${formattedAmount}*\n` +
          `💳 *Pagamento:* ${purchase.payment_method?.toUpperCase() || "CARTÃO"}\n` +
          `📅 *Data:* ${formattedDate}\n` +
          (purchase.affiliate_code ? `🤝 *Afiliado:* ${purchase.affiliate_code}\n` : "") +
          `🆔 *Stripe:* \`${purchase.stripe_session_id || purchase.id}\``;

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            parse_mode: "Markdown",
          }),
        });
      } else {
        // Generic Webhook (Zapier, Make, n8n, Slack, WhatsApp bridge)
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "purchase.completed",
            purchase,
            formatted_amount: formattedAmount,
            formatted_date: formattedDate,
            customer: {
              email: purchase.buyer_email,
              name: purchase.buyer_name,
            },
          }),
        });
      }
    } catch (whErr) {
      console.warn("[AdminStore] Erro ao disparar webhook de alerta:", whErr);
    }
  }

  // Resend Email Dispatch (if RESEND_API_KEY is available)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && settings.notify_email !== false) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Peguei o Texto <vendas@pegueiotexto.com.br>",
          to: [settings.admin_email || "tonhenke@gmail.com"],
          subject: `🎉 Nova Venda! ${purchase.plan_name} - ${formattedAmount} (${purchase.buyer_email})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #7c3aed; margin-top: 0;">🎉 Nova Compra Realizada!</h2>
              <p style="font-size: 16px; color: #374151;">Uma nova compra acabou de ser confirmada na plataforma <strong>Peguei o Texto</strong>:</p>
              
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 8px 0;"><strong>👤 Cliente:</strong> ${purchase.buyer_email} (${purchase.buyer_name || "N/A"})</p>
                <p style="margin: 8px 0;"><strong>📦 Plano:</strong> ${purchase.plan_name}</p>
                <p style="margin: 8px 0;"><strong>💵 Valor:</strong> <span style="font-size: 18px; color: #059669; font-weight: bold;">${formattedAmount}</span></p>
                <p style="margin: 8px 0;"><strong>💳 Método:</strong> ${(purchase.payment_method || "card").toUpperCase()}</p>
                <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${formattedDate}</p>
                ${purchase.affiliate_code ? `<p style="margin: 8px 0;"><strong>🤝 Código de Afiliado:</strong> ${purchase.affiliate_code}</p>` : ""}
                <p style="margin: 8px 0;"><strong>🆔 ID Stripe:</strong> <code>${purchase.stripe_session_id || purchase.id}</code></p>
              </div>

              <a href="https://pegueiotexto.com.br/admin" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Ver no Dashboard de Admin →
              </a>
            </div>
          `,
        }),
      });
    } catch (resendErr) {
      console.warn("[AdminStore] Erro ao enviar e-mail via Resend:", resendErr);
    }
  }
}
