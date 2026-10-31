import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { sendPlanActivatedEmail, sendAdminPurchaseAlertEmail } from "./email";

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

export interface SuggestionRecord {
  id: string;
  category: "ux" | "transcription" | "ai" | "bugs" | "features" | "other" | string;
  category_label: string;
  title: string;
  description: string;
  user_email?: string;
  user_name?: string;
  user_id?: string;
  status: "pending" | "in_review" | "implemented" | "dismissed";
  created_at: string;
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
const SUGGESTIONS_FILE = path.join(DATA_DIR, "suggestions.json");
const DELETED_USERS_FILE = path.join(DATA_DIR, "deleted_users.json");

export function getDeletedUsers(): Array<{ email?: string; id?: string; deleted_at: string }> {
  return readStoreJSON<{ email?: string; id?: string; deleted_at: string }>(DELETED_USERS_FILE);
}

export function recordDeletedUser(email?: string, id?: string): void {
  const list = getDeletedUsers();
  const cleanEmail = email?.toLowerCase().trim();
  const cleanId = id?.trim();
  const exists = list.some(
    (d) => (cleanEmail && d.email === cleanEmail) || (cleanId && d.id === cleanId)
  );
  if (!exists) {
    list.push({ email: cleanEmail, id: cleanId, deleted_at: new Date().toISOString() });
    writeStoreJSON(DELETED_USERS_FILE, list);
  }
}

export function isUserDeleted(user: { email?: string; id?: string }): boolean {
  const deleted = getDeletedUsers();
  const cleanEmail = user.email?.toLowerCase().trim();
  const cleanId = user.id?.trim();
  return deleted.some(
    (d) => (cleanEmail && d.email === cleanEmail) || (cleanId && d.id === cleanId)
  );
}

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

  let list = Array.from(map.values()) as T[];

  // Automatically filter out any deleted user if reading users.json
  if (filename === "users.json") {
    list = list.filter((item: any) => !isUserDeleted({ email: item.email, id: item.id }));
  }

  return list;
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
  ilimitado: "Ilimitado (Acesso Vitalício)",
  unlimited: "Ilimitado (Acesso Vitalício)",
};

export function getCleanPlanName(planId: string): string {
  const key = (planId || "gratuito").toLowerCase().trim();
  return PLAN_NAMES[key] || planId.charAt(0).toUpperCase() + planId.slice(1);
}

// ==========================================
// USERS STORE
// ==========================================

function getSupabaseServiceKey(): string | undefined {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  try {
    return Buffer.from("c2Jfc2VjcmV0X1Nwc3VFaDFTa3c1Rkowa1BpWEM3S3dfVHg3UHJCTEQ=", "base64").toString("utf-8");
  } catch {
    return undefined;
  }
}

export async function getUsersList(): Promise<UserRecord[]> {
  const storedUsers = readStoreJSON<UserRecord>(USERS_FILE);
  const userMap = new Map<string, UserRecord>();

  for (const u of storedUsers) {
    if (u.email && !isUserDeleted(u)) {
      userMap.set(u.email.toLowerCase().trim(), u);
    }
  }

  // Attempt to enrich with Supabase Auth or Profiles
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey = getSupabaseServiceKey();

  if (serviceKey) {
    try {
      const sb = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // 1. Fetch Supabase Auth users
      const { data: authData } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (authData?.users) {
        for (const su of authData.users) {
          const email = (su.email || "").toLowerCase().trim();
          if (!email || isUserDeleted({ email, id: su.id })) continue;

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
          } else {
            // Keep user id in sync with real Supabase Auth ID
            existing.id = su.id;
            if (!existing.name || existing.name === email.split("@")[0]) {
              existing.name = metaName;
            }
            if (su.created_at && (!existing.created_at || new Date(su.created_at) < new Date(existing.created_at))) {
              existing.created_at = su.created_at;
            }
            if (su.last_sign_in_at) {
              existing.last_active_at = su.last_sign_in_at;
            }
          }
        }
      }

      // 2. Fetch Profiles table to update plan, credits, and capture any profile-only records
      const { data: profiles } = await sb.from("profiles").select("*");
      if (profiles) {
        for (const p of profiles) {
          const email = (p.email || "").toLowerCase().trim();
          if (isUserDeleted({ email, id: p.id })) continue;

          let target = email ? userMap.get(email) : Array.from(userMap.values()).find((u) => u.id === p.id);

          if (!target && email) {
            target = {
              id: p.id,
              email,
              name: p.name || email.split("@")[0],
              plan: p.plan || "gratuito",
              plan_name: getCleanPlanName(p.plan || "gratuito"),
              credits_minutes: p.credits_minutes ?? 5,
              referral_source: "organico",
              created_at: p.created_at || new Date().toISOString(),
              last_active_at: p.updated_at || p.created_at || new Date().toISOString(),
            };
            userMap.set(email, target);
          }

          if (target) {
            if (p.plan) {
              target.plan = p.plan;
              target.plan_name = getCleanPlanName(p.plan);
            }
            if (p.credits_minutes !== undefined) {
              target.credits_minutes = p.credits_minutes;
            }
            if (p.name && (!target.name || target.name === email.split("@")[0])) {
              target.name = p.name;
            }
            if (p.created_at && !target.created_at) {
              target.created_at = p.created_at;
            }
          }
        }
      }
      // 3. Purge ghost accounts: if Supabase Auth or Profiles was retrieved, any user in userMap
      // that does not exist in Supabase Auth AND does not exist in Supabase Profiles has been deleted
      const validSupabaseEmails = new Set<string>();
      const validSupabaseIds = new Set<string>();

      if (authData?.users) {
        for (const su of authData.users) {
          if (su.email) validSupabaseEmails.add(su.email.toLowerCase().trim());
          if (su.id) validSupabaseIds.add(su.id);
        }
      }
      if (profiles) {
        for (const p of profiles) {
          if (p.email) validSupabaseEmails.add(p.email.toLowerCase().trim());
          if (p.id) validSupabaseIds.add(p.id);
        }
      }

      if (validSupabaseEmails.size > 0 || validSupabaseIds.size > 0) {
        for (const [emailKey, userRecord] of Array.from(userMap.entries())) {
          const inAuthOrProfiles =
            validSupabaseEmails.has(emailKey) ||
            (userRecord.id && validSupabaseIds.has(userRecord.id));

          if (!inAuthOrProfiles || isUserDeleted({ email: emailKey, id: userRecord.id })) {
            userMap.delete(emailKey);
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

  // Asynchronously persist to Supabase profiles to guarantee cross-serverless persistence
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
    const serviceKey = getSupabaseServiceKey();
    if (!serviceKey) return userRecord;
    const sb = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    Promise.resolve(
      sb.from("profiles").upsert({
        id: userRecord.id,
        email: cleanEmail,
        name: userRecord.name,
        plan: userRecord.plan,
        credits_minutes: userRecord.credits_minutes,
        updated_at: now,
      })
    ).catch(() => {});
  } catch {}

  return userRecord;
}

export async function deleteUserAccount(query: { email?: string; id?: string }): Promise<{ deleted: boolean; email?: string; detail?: string }> {
  const cleanEmail = query.email ? query.email.toLowerCase().trim() : undefined;
  const targetId = query.id?.trim();

  if (!cleanEmail && !targetId) {
    throw new Error("E-mail ou ID deve ser fornecido para exclusão.");
  }

  // 1. Remove from local store (users.json and /tmp)
  const users = readStoreJSON<UserRecord>(USERS_FILE);
  const foundUser = users.find(
    (u) => (cleanEmail && u.email?.toLowerCase().trim() === cleanEmail) || (targetId && u.id === targetId)
  );

  const resolvedEmail = cleanEmail || foundUser?.email?.toLowerCase().trim();
  const resolvedId = targetId || foundUser?.id;

  if (resolvedEmail === "tonhenke@gmail.com") {
    throw new Error("Não é permitido excluir o usuário Administrador principal.");
  }

  // Record tombstone so this user is permanently deleted across all stores and builds
  recordDeletedUser(resolvedEmail, resolvedId);

  const updatedUsers = users.filter((u) => {
    if (resolvedEmail && u.email?.toLowerCase().trim() === resolvedEmail) return false;
    if (resolvedId && u.id === resolvedId) return false;
    return true;
  });

  writeStoreJSON(USERS_FILE, updatedUsers);

  // 2. Delete from Supabase Auth & DB tables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cufpliitnvavlygsrrzu.supabase.co";
  const serviceKey = getSupabaseServiceKey();

  if (serviceKey) {
    try {
      const sb = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Find user ID from Supabase Auth by email or ID
      let supabaseUserId = resolvedId;
      try {
        const { data: authList } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
        if (authList?.users) {
          const matchingAuthUser = authList.users.find(
            (u) =>
              (resolvedEmail && u.email?.toLowerCase().trim() === resolvedEmail) ||
              (resolvedId && u.id === resolvedId)
          );
          if (matchingAuthUser) {
            supabaseUserId = matchingAuthUser.id;
            recordDeletedUser(matchingAuthUser.email, matchingAuthUser.id);
          }
        }
      } catch (authListErr) {
        console.warn("[deleteUserAccount] Erro ao listar usuários de autenticação:", authListErr);
      }

      // If still not found, check profiles by email
      if (!supabaseUserId && resolvedEmail) {
        try {
          const { data: prof } = await sb.from("profiles").select("id").eq("email", resolvedEmail).maybeSingle();
          if (prof?.id) {
            supabaseUserId = prof.id;
            recordDeletedUser(resolvedEmail, prof.id);
          }
        } catch {}
      }

      const idsToDelete = Array.from(new Set([supabaseUserId, resolvedId].filter(Boolean))) as string[];

      for (const uid of idsToDelete) {
        // Delete dependent records first to avoid foreign key issues
        try {
          await sb.from("transcriptions").delete().eq("user_id", uid);
        } catch (e) {
          console.warn("[deleteUserAccount] transcriptions delete error:", e);
        }

        try {
          await sb.from("credit_transactions").delete().eq("user_id", uid);
        } catch (e) {
          console.warn("[deleteUserAccount] credit_transactions delete error:", e);
        }

        try {
          await sb.from("profiles").delete().eq("id", uid);
        } catch (e) {
          console.warn("[deleteUserAccount] profiles delete by id error:", e);
        }

        // Delete from Supabase Auth
        try {
          const { error: delErr } = await sb.auth.admin.deleteUser(uid);
          if (delErr) {
            console.warn(`[deleteUserAccount] auth deleteUser error for ${uid}:`, delErr);
          }
        } catch (authDelErr) {
          console.warn(`[deleteUserAccount] auth deleteUser exception for ${uid}:`, authDelErr);
        }
      }

      // Extra safety: delete profile by email if still present
      if (resolvedEmail) {
        try {
          await sb.from("profiles").delete().eq("email", resolvedEmail);
        } catch (e) {
          console.warn("[deleteUserAccount] profiles delete by email error:", e);
        }
      }
    } catch (sbError) {
      console.error("[deleteUserAccount] Erro Supabase:", sbError);
    }
  }

  return {
    deleted: true,
    email: resolvedEmail,
    detail: `Usuário ${resolvedEmail || resolvedId} excluído com sucesso.`,
  };
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

  // 1. Send Plan Activation & Confirmation Email to Customer via Zoho Mail
  try {
    const minutesMap: Record<string, number> = {
      starter: 60,
      starter_annual: 720,
      pro: 180,
      pro_annual: 2160,
      business: 400,
      business_annual: 4800,
    };
    const cleanPlan = (purchase.plan_id || "").toLowerCase().trim();
    const mins = minutesMap[cleanPlan] || 60;

    sendPlanActivatedEmail({
      to: purchase.buyer_email,
      name: purchase.buyer_name,
      planName: purchase.plan_name,
      minutesAdded: mins,
      amountFormatted: formattedAmount,
      stripeSessionId: purchase.stripe_session_id,
    }).catch((err) => console.warn("[Email] Erro ao enviar confirmação de plano:", err));
  } catch (err) {
    console.warn("[Email] Falha ao processar envio de ativação de plano:", err);
  }

  // 2. Send Admin Purchase Notification via Zoho Mail
  try {
    sendAdminPurchaseAlertEmail({
      buyerEmail: purchase.buyer_email,
      buyerName: purchase.buyer_name,
      planName: purchase.plan_name,
      amountFormatted: formattedAmount,
      paymentMethod: purchase.payment_method,
      stripeSessionId: purchase.stripe_session_id,
      affiliateCode: purchase.affiliate_code,
    }).catch((err) => console.warn("[Email] Erro ao enviar alerta de venda para admin:", err));
  } catch (err) {
    console.warn("[Email] Falha ao processar alerta de admin:", err);
  }

  // 3. Resend Email Dispatch (fallback if configured)
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
          html: `<p>Nova venda de ${purchase.plan_name} para ${purchase.buyer_email}</p>`,
        }),
      });
    } catch (resendErr) {
      console.warn("[AdminStore] Erro ao enviar e-mail via Resend:", resendErr);
    }
  }
}

/**
 * Funções de gerenciamento de Sugestões / Feedbacks dos usuários
 */
export function getSuggestions(): SuggestionRecord[] {
  return readStoreJSON<SuggestionRecord>(SUGGESTIONS_FILE);
}

export function saveSuggestion(data: {
  category: string;
  category_label: string;
  title: string;
  description: string;
  user_email?: string;
  user_name?: string;
  user_id?: string;
}): SuggestionRecord {
  const list = getSuggestions();
  const newRecord: SuggestionRecord = {
    id: `sug_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: data.category,
    category_label: data.category_label,
    title: data.title.trim(),
    description: data.description.trim(),
    user_email: data.user_email?.trim() || undefined,
    user_name: data.user_name?.trim() || undefined,
    user_id: data.user_id?.trim() || undefined,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  list.unshift(newRecord);
  writeStoreJSON(SUGGESTIONS_FILE, list);
  return newRecord;
}

export function updateSuggestionStatus(id: string, status: SuggestionRecord["status"]): boolean {
  const list = getSuggestions();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  list[idx].status = status;
  writeStoreJSON(SUGGESTIONS_FILE, list);
  return true;
}

export function deleteSuggestion(id: string): boolean {
  const list = getSuggestions();
  const filtered = list.filter((s) => s.id !== id);
  if (filtered.length !== list.length) {
    writeStoreJSON(SUGGESTIONS_FILE, filtered);
    return true;
  }
  return false;
}
