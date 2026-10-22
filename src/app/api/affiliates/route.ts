import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.AFFILIATE_ADMIN_EMAIL || "tonhenke@gmail.com";
const ADMIN_PASSWORD = process.env.AFFILIATE_ADMIN_PASSWORD || "987123aA!";
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "peguei_o_texto_admin_sec_2026_safe";

function generateAdminToken(email: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${email.toLowerCase().trim()}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [email, expiresAtStr, signature] = decoded.split(":");
    if (!email || !expiresAtStr || !signature) return false;
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false;

    const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(`${email}:${expiresAtStr}`).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

function isAuthenticatedAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/affiliate_admin_token=([^;]+)/);
  const cookieToken = match ? decodeURIComponent(match[1]) : null;

  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  const xAdminToken = request.headers.get("x-admin-token");

  return (
    verifyAdminToken(cookieToken) ||
    verifyAdminToken(bearerToken) ||
    verifyAdminToken(xAdminToken)
  );
}

const AFFILIATE_SESSION_SECRET = process.env.AFFILIATE_SESSION_SECRET || "peguei_affiliate_sec_2026_auth";

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const h = crypto.scryptSync(password, s, 64).toString("hex");
  return { hash: h, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const h = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(hash));
  } catch {
    return false;
  }
}

function generateAffiliateSessionToken(affiliateId: string, email: string): string {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${affiliateId}:${email.toLowerCase().trim()}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", AFFILIATE_SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

function verifyAffiliateSessionToken(token: string | null | undefined): { affiliateId: string; email: string } | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [affiliateId, email, expiresAtStr, signature] = decoded.split(":");
    if (!affiliateId || !email || !expiresAtStr || !signature) return null;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return null;

    const expectedSignature = crypto.createHmac("sha256", AFFILIATE_SESSION_SECRET).update(`${affiliateId}:${email}:${expiresAtStr}`).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    return { affiliateId, email };
  } catch {
    return null;
  }
}

function getAuthenticatedAffiliate(request: Request): { affiliateId: string; email: string } | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/affiliate_session_token=([^;]+)/);
  const cookieToken = match ? decodeURIComponent(match[1]) : null;

  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

  const xToken = request.headers.get("x-affiliate-token");

  return (
    verifyAffiliateSessionToken(cookieToken) ||
    verifyAffiliateSessionToken(bearerToken) ||
    verifyAffiliateSessionToken(xToken)
  );
}

const BACKEND_URL = process.env.BACKEND_URL || "https://pegueiotexto-production.up.railway.app";

// Safe path resolution for local development and Vercel serverless environments
function getStorageDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "pegueiotexto_data");
  }
  return path.join(process.cwd(), "data");
}

function getBundledFilePath(filename: string): string {
  return path.join(process.cwd(), "data", filename);
}

function getTmpFilePath(filename: string): string {
  return path.join("/tmp", "pegueiotexto_data", filename);
}

const DATA_DIR = getStorageDir();
const AFFILIATES_FILE = path.join(DATA_DIR, "affiliates.json");
const CLICKS_FILE = path.join(DATA_DIR, "affiliate_clicks.json");
const CONVERSIONS_FILE = path.join(DATA_DIR, "affiliate_conversions.json");
const PAYOUTS_FILE = path.join(DATA_DIR, "affiliate_payouts.json");

export interface AffiliateRecord {
  id: string;
  user_id: string;
  affiliate_code: string;
  full_name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  pix_key_type: string;
  pix_key: string;
  pix_name: string;
  channel_type: string;
  channel_url: string;
  audience_range: string;
  commission_rate: number;
  balance_available: number;
  balance_pending: number;
  total_paid: number;
  status: "pending_review" | "active" | "suspended";
  password_hash?: string;
  password_salt?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_code: string;
  referer?: string;
  created_at: string;
}

export interface AffiliateConversion {
  id: string;
  affiliate_code: string;
  plan_id: string;
  plan_name: string;
  order_amount: number;
  commission_amount: number;
  status: "pending" | "available" | "paid" | "cancelled";
  available_at: string;
  stripe_session_id?: string;
  buyer_email?: string;
  created_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_id: string;
  affiliate_code: string;
  amount: number;
  pix_key_type: string;
  pix_key: string;
  pix_name: string;
  status: "requested" | "paid" | "rejected";
  requested_at: string;
  paid_at?: string;
}

function readJSON<T>(filePath: string): T[] {
  const filename = path.basename(filePath);
  const tmpPath = getTmpFilePath(filename);
  const bundledPath = getBundledFilePath(filename);

  let tmpList: any[] = [];
  let bundledList: any[] = [];

  // 1. Try reading from /tmp (runtime mutations)
  try {
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      tmpList = JSON.parse(raw) || [];
    }
  } catch (err) {
    console.warn(`[Affiliates] Erro ao ler /tmp para ${filename}:`, err);
  }

  // 2. Try reading from project data/ directory (git-bundled records)
  try {
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, "utf-8");
      bundledList = JSON.parse(raw) || [];
    }
  } catch (err) {
    console.warn(`[Affiliates] Erro ao ler bundled ${filename}:`, err);
  }

  // Intelligently merge affiliates
  if (filename === "affiliates.json") {
    const map = new Map<string, any>();
    // First, add all bundled affiliates
    for (const item of bundledList) {
      if (item && item.affiliate_code) {
        map.set(String(item.affiliate_code).toLowerCase().trim(), item);
      }
    }
    // Second, overlay with /tmp records (which include status changes and new registrations)
    for (const item of tmpList) {
      if (item && item.affiliate_code) {
        map.set(String(item.affiliate_code).toLowerCase().trim(), item);
      }
    }
    const merged = Array.from(map.values()) as T[];

    // Ensure /tmp has the full merged dataset
    if (tmpList.length < merged.length) {
      try {
        const tmpDir = path.dirname(tmpPath);
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(tmpPath, JSON.stringify(merged, null, 2), "utf-8");
      } catch {}
    }
    return merged;
  }

  // For clicks, conversions, payouts: combine unique items by ID
  if (tmpList.length > 0 && bundledList.length > 0) {
    const map = new Map<string, any>();
    for (const item of bundledList) {
      if (item && item.id) map.set(item.id, item);
    }
    for (const item of tmpList) {
      if (item && item.id) map.set(item.id, item);
    }
    return Array.from(map.values()) as T[];
  }

  return (tmpList.length > 0 ? tmpList : bundledList) as T[];
}

function writeJSON<T>(filePath: string, data: T[]): void {
  const filename = path.basename(filePath);
  const tmpPath = getTmpFilePath(filename);
  const bundledPath = getBundledFilePath(filename);

  // 1. Always write to /tmp (writable in serverless)
  try {
    const tmpDir = path.dirname(tmpPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`[Affiliates] Aviso ao gravar /tmp ${filename}:`, err);
  }

  // 2. Also try writing to project data/ folder (works in local dev; safe no-op on read-only serverless)
  try {
    const bundledDir = path.dirname(bundledPath);
    if (!fs.existsSync(bundledDir)) {
      fs.mkdirSync(bundledDir, { recursive: true });
    }
    fs.writeFileSync(bundledPath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Expected to silently catch on read-only serverless filesystems
  }
}

// Automatically mature pending commissions after 14 days
function matureCommissionsForAffiliate(affiliateCode: string) {
  const conversions = readJSON<AffiliateConversion>(CONVERSIONS_FILE);
  const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
  const affIndex = affiliates.findIndex((a) => a.affiliate_code === affiliateCode);
  if (affIndex === -1) return;

  const now = new Date();
  let updatedAny = false;
  let newlyAvailableSum = 0;

  for (const conv of conversions) {
    if (conv.affiliate_code === affiliateCode && conv.status === "pending") {
      const releaseDate = new Date(conv.available_at);
      if (now >= releaseDate) {
        conv.status = "available";
        newlyAvailableSum += conv.commission_amount;
        updatedAny = true;
      }
    }
  }

  if (updatedAny) {
    writeJSON(CONVERSIONS_FILE, conversions);
    affiliates[affIndex].balance_pending = Math.max(0, affiliates[affIndex].balance_pending - newlyAvailableSum);
    affiliates[affIndex].balance_available = Number((affiliates[affIndex].balance_available + newlyAvailableSum).toFixed(2));
    affiliates[affIndex].updated_at = new Date().toISOString();
    writeJSON(AFFILIATES_FILE, affiliates);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "me";
    const userId = searchParams.get("user_id");
    const affiliateCode = searchParams.get("affiliate_code");
    const emailParam = searchParams.get("email")?.toLowerCase().trim();

    if (action === "check_code") {
      const code = searchParams.get("code")?.toLowerCase().trim() || "";
      if (!code) {
        return NextResponse.json({ available: false, message: "Código não informado." });
      }
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const exists = affiliates.some((a) => a.affiliate_code === code);
      return NextResponse.json({ available: !exists, code });
    }

    if (action === "admin_check_auth") {
      const isAuth = isAuthenticatedAdmin(request);
      return NextResponse.json({
        authenticated: isAuth,
        email: isAuth ? ADMIN_EMAIL : null,
      });
    }

    if (action === "admin_list") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso restrito ao administrador." }, { status: 401 });
      }

      // Try Railway Cloud Backend
      try {
        const backendRes = await fetch(`${BACKEND_URL}/api/affiliates/list`, {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        });
        if (backendRes.ok) {
          const data = await backendRes.json();
          // Merge with any local files
          const localAffiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
          if (localAffiliates.length > 0) {
            const backendCodes = new Set((data.affiliates || []).map((a: any) => a.affiliate_code));
            for (const la of localAffiliates) {
              if (!backendCodes.has(la.affiliate_code)) {
                data.affiliates.unshift({
                  ...la,
                  clicks_count: 0,
                  conversions_count: 0,
                  total_revenue: 0,
                  total_commission_generated: 0,
                  payouts_count: 0,
                });
                data.summary.total += 1;
                if (la.status === "pending_review") data.summary.pending += 1;
                else if (la.status === "active") data.summary.active += 1;
              }
            }
          }
          return NextResponse.json(data);
        }
      } catch (err) {
        console.warn("[Affiliates Proxy] Erro ao buscar da Railway, usando local:", err);
      }

      // Local fallback
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const clicks = readJSON<AffiliateClick>(CLICKS_FILE);
      const conversions = readJSON<AffiliateConversion>(CONVERSIONS_FILE);
      const payouts = readJSON<AffiliatePayout>(PAYOUTS_FILE);

      const enrichedAffiliates = affiliates.map((aff) => {
        const affClicks = clicks.filter((c) => c.affiliate_code === aff.affiliate_code).length;
        const affConversions = conversions.filter((c) => c.affiliate_code === aff.affiliate_code);
        const affPayouts = payouts.filter((p) => p.affiliate_code === aff.affiliate_code);

        return {
          ...aff,
          clicks_count: affClicks,
          conversions_count: affConversions.length,
          total_revenue: affConversions.reduce((acc, c) => acc + c.order_amount, 0),
          total_commission_generated: affConversions.reduce((acc, c) => acc + c.commission_amount, 0),
          payouts_count: affPayouts.length,
        };
      });

      const pendingCount = affiliates.filter((a) => a.status === "pending_review").length;
      const activeCount = affiliates.filter((a) => a.status === "active").length;
      const suspendedCount = affiliates.filter((a) => a.status === "suspended").length;

      return NextResponse.json({
        affiliates: enrichedAffiliates.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        summary: {
          total: affiliates.length,
          pending: pendingCount,
          active: activeCount,
          suspended: suspendedCount,
          total_clicks: clicks.length,
          total_conversions: conversions.length,
          total_payouts_paid: payouts.filter((p) => p.status === "paid").reduce((acc, p) => acc + p.amount, 0),
        },
      });
    }

    if (action === "get_activation_info") {
      const code = searchParams.get("code")?.toLowerCase().trim() || "";
      if (!code) {
        return NextResponse.json({ valid: false, detail: "Código de ativação não informado." }, { status: 400 });
      }

      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const aff = affiliates.find((a) => a.affiliate_code.toLowerCase().trim() === code);

      if (!aff) {
        return NextResponse.json({ valid: false, detail: "Candidatura não localizada com este código." }, { status: 404 });
      }

      return NextResponse.json({
        valid: true,
        affiliate_code: aff.affiliate_code,
        full_name: aff.full_name,
        email: aff.email,
        status: aff.status,
        has_password: Boolean(aff.password_hash),
      });
    }

    if (action === "affiliate_check_auth") {
      const auth = getAuthenticatedAffiliate(request);
      if (!auth) {
        return NextResponse.json({ authenticated: false });
      }

      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const aff = affiliates.find((a) => a.id === auth.affiliateId || a.email.toLowerCase().trim() === auth.email.toLowerCase().trim());

      if (!aff || aff.status !== "active") {
        return NextResponse.json({ authenticated: false, status: aff?.status || null });
      }

      const { password_hash, password_salt, ...safeAffiliate } = aff;
      return NextResponse.json({
        authenticated: true,
        affiliate: safeAffiliate,
      });
    }

    if (action === "me") {
      const auth = getAuthenticatedAffiliate(request);
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      let affiliate: AffiliateRecord | undefined = undefined;

      if (auth) {
        affiliate = affiliates.find((a) => a.id === auth.affiliateId || a.email.toLowerCase().trim() === auth.email.toLowerCase().trim());
      } else if (userId || affiliateCode || emailParam) {
        affiliate = affiliates.find(
          (a) =>
            (emailParam && a.email.toLowerCase().trim() === emailParam) ||
            (userId && a.user_id === userId) ||
            (affiliateCode && a.affiliate_code.toLowerCase().trim() === affiliateCode.toLowerCase().trim())
        );
      }

      if (!affiliate) {
        return NextResponse.json({ is_affiliate: false });
      }

      // If pending or suspended, block full dashboard metrics
      if (affiliate.status !== "active") {
        return NextResponse.json({
          is_affiliate: true,
          allowed: false,
          status: affiliate.status,
          affiliate: {
            id: affiliate.id,
            user_id: affiliate.user_id,
            affiliate_code: affiliate.affiliate_code,
            full_name: affiliate.full_name,
            email: affiliate.email,
            status: affiliate.status,
            created_at: affiliate.created_at,
          },
          detail: affiliate.status === "pending_review"
            ? "Sua candidatura está em processo de moderação manual. Você receberá o link de ativação assim que for aceito."
            : "Esta conta de afiliado está suspensa.",
        });
      }

      // Check matured commissions (14-day hold)
      matureCommissionsForAffiliate(affiliate.affiliate_code);

      // Re-read after potential maturation
      const updatedAffiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      affiliate = updatedAffiliates.find((a) => a.id === affiliate!.id) || affiliate;

      const clicks = readJSON<AffiliateClick>(CLICKS_FILE).filter((c) => c.affiliate_code === affiliate!.affiliate_code);
      const conversions = readJSON<AffiliateConversion>(CONVERSIONS_FILE).filter((c) => c.affiliate_code === affiliate!.affiliate_code);
      const payouts = readJSON<AffiliatePayout>(PAYOUTS_FILE).filter((p) => p.affiliate_code === affiliate!.affiliate_code);

      const totalClicks = clicks.length;
      const totalConversions = conversions.length;
      const conversionRate = totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(1)) : 0;

      return NextResponse.json({
        is_affiliate: true,
        allowed: true,
        affiliate: {
          id: affiliate.id,
          user_id: affiliate.user_id,
          affiliate_code: affiliate.affiliate_code,
          full_name: affiliate.full_name,
          email: affiliate.email,
          phone: affiliate.phone,
          cpf_cnpj: affiliate.cpf_cnpj,
          pix_key_type: affiliate.pix_key_type,
          pix_key: affiliate.pix_key,
          pix_name: affiliate.pix_name,
          channel_type: affiliate.channel_type,
          channel_url: affiliate.channel_url,
          audience_range: affiliate.audience_range,
          commission_rate: affiliate.commission_rate,
          balance_available: affiliate.balance_available,
          balance_pending: affiliate.balance_pending,
          total_paid: affiliate.total_paid,
          status: affiliate.status,
          created_at: affiliate.created_at,
        },
        metrics: {
          total_clicks: totalClicks,
          total_conversions: totalConversions,
          conversion_rate: conversionRate,
          balance_available: affiliate.balance_available,
          balance_pending: affiliate.balance_pending,
          total_paid: affiliate.total_paid,
          min_payout_amount: 100.0,
          hold_period_days: 14,
        },
        conversions: conversions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        payouts: payouts.sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()),
      });
    }

    return NextResponse.json({ detail: "Ação inválida." }, { status: 400 });
  } catch (err) {
    console.error("[Affiliates GET] Erro:", err);
    return NextResponse.json({ detail: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const body = await request.json().catch(() => ({}));

    // 1. REGISTRO DE AFILIADO (OPÇÃO B: MODERAÇÃO MANUAL - pending_review)
    if (action === "register") {
      const {
        user_id,
        full_name,
        email,
        phone,
        cpf_cnpj,
        pix_key_type,
        pix_key,
        pix_name,
        channel_type,
        channel_url,
        audience_range,
        affiliate_code,
      } = body;

      if (!user_id || !full_name || !email || !phone || !cpf_cnpj || !pix_key || !affiliate_code) {
        return NextResponse.json({ detail: "Todos os campos obrigatórios devem ser preenchidos." }, { status: 400 });
      }

      // Try Railway backend first
      try {
        const backendRes = await fetch(`${BACKEND_URL}/api/affiliates/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          // Write to local json file as well
          try {
            const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
            const exists = affiliates.some((a) => a.affiliate_code === data.affiliate.affiliate_code);
            if (!exists) {
              affiliates.unshift(data.affiliate);
              writeJSON(AFFILIATES_FILE, affiliates);
            }
          } catch {}
          return NextResponse.json(data);
        } else if (backendRes.status === 409 || backendRes.status === 400) {
          const errData = await backendRes.json();
          return NextResponse.json(errData, { status: backendRes.status });
        }
      } catch (err) {
        console.warn("[Affiliates Proxy] Erro ao registrar na Railway, usando local:", err);
      }

      const cleanCode = String(affiliate_code)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "");

      if (cleanCode.length < 3) {
        return NextResponse.json({ detail: "O código de afiliado deve conter ao menos 3 caracteres alfanuméricos." }, { status: 400 });
      }

      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);

      // Check if email is already registered (strictly by email, never by anonymous applicant user_id)
      const cleanEmail = email.trim().toLowerCase();
      const existingUser = affiliates.find(
        (a) => a.email.toLowerCase().trim() === cleanEmail
      );
      if (existingUser) {
        return NextResponse.json({
          success: false,
          already_registered: true,
          status: existingUser.status,
          detail:
            existingUser.status === "active"
              ? `O e-mail '${cleanEmail}' já possui cadastro de afiliado aprovado. Acesse a área de login para entrar.`
              : `O e-mail '${cleanEmail}' já possui uma candidatura em análise pela moderação.`,
        }, { status: 409 });
      }

      // Check if code is taken
      const codeExists = affiliates.some((a) => a.affiliate_code === cleanCode);
      if (codeExists) {
        return NextResponse.json({ detail: "Este código de afiliado já está em uso. Por favor, escolha outro." }, { status: 409 });
      }

      const now = new Date().toISOString();
      const newAffiliate: AffiliateRecord = {
        id: `aff_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        user_id,
        affiliate_code: cleanCode,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        cpf_cnpj: cpf_cnpj.trim(),
        pix_key_type: pix_key_type || "cpf_cnpj",
        pix_key: pix_key.trim(),
        pix_name: (pix_name || full_name).trim(),
        channel_type: channel_type || "outros",
        channel_url: (channel_url || "").trim(),
        audience_range: audience_range || "iniciante",
        commission_rate: 0.25, // 25% padrão
        balance_available: 0,
        balance_pending: 0,
        total_paid: 0,
        status: "pending_review", // Moderação Manual alinhada com o usuário
        created_at: now,
        updated_at: now,
      };

      affiliates.push(newAffiliate);
      writeJSON(AFFILIATES_FILE, affiliates);

      return NextResponse.json({
        success: true,
        affiliate: newAffiliate,
        message: "Candidatura enviada com sucesso! Seus dados foram recebidos e estão em análise.",
      });
    }

    if (action === "admin_sync_registration") {
      const { affiliate } = body;
      if (!affiliate || !affiliate.affiliate_code) {
        return NextResponse.json({ detail: "Dados inválidos." }, { status: 400 });
      }
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const idx = affiliates.findIndex(
        (a) => a.affiliate_code.toLowerCase().trim() === String(affiliate.affiliate_code).toLowerCase().trim()
      );
      if (idx === -1) {
        affiliates.unshift(affiliate);
        writeJSON(AFFILIATES_FILE, affiliates);
      }
      return NextResponse.json({ success: true, total: affiliates.length });
    }

    // 2. RASTREIO DE CLIQUE
    if (action === "track_click") {
      const { affiliate_code, referer } = body;
      if (!affiliate_code) {
        return NextResponse.json({ detail: "affiliate_code é obrigatório." }, { status: 400 });
      }

      const cleanCode = String(affiliate_code).trim().toLowerCase();
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const aff = affiliates.find((a) => a.affiliate_code === cleanCode && a.status === "active");

      if (aff) {
        const clicks = readJSON<AffiliateClick>(CLICKS_FILE);
        clicks.push({
          id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          affiliate_code: cleanCode,
          referer: referer || "",
          created_at: new Date().toISOString(),
        });
        writeJSON(CLICKS_FILE, clicks);
      }

      return NextResponse.json({ tracked: !!aff });
    }

    // 3. SOLICITAÇÃO DE SAQUE PIX (Mínimo R$ 100,00)
    if (action === "payout") {
      const { user_id, affiliate_code } = body;
      if (!user_id || !affiliate_code) {
        return NextResponse.json({ detail: "Dados incompletos." }, { status: 400 });
      }

      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const affIndex = affiliates.findIndex(
        (a) => a.affiliate_code.toLowerCase().trim() === affiliate_code.toLowerCase().trim() && (!user_id || a.user_id === user_id || a.affiliate_code === user_id)
      );

      if (affIndex === -1) {
        return NextResponse.json({ detail: "Afiliado não encontrado." }, { status: 404 });
      }

      const affiliate = affiliates[affIndex];
      if (affiliate.status !== "active") {
        return NextResponse.json({ detail: "Sua conta precisa estar aprovada para solicitar saques." }, { status: 403 });
      }

      const minPayout = 100.0;
      if (affiliate.balance_available < minPayout) {
        return NextResponse.json({
          detail: `O saldo mínimo para resgate é de R$ ${minPayout.toFixed(2).replace(".", ",")}. Seu saldo disponível atual é de R$ ${affiliate.balance_available.toFixed(2).replace(".", ",")}.`,
        }, { status: 400 });
      }

      const payoutAmount = affiliate.balance_available;
      const payouts = readJSON<AffiliatePayout>(PAYOUTS_FILE);

      const newPayout: AffiliatePayout = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        affiliate_id: affiliate.id,
        affiliate_code: affiliate.affiliate_code,
        amount: payoutAmount,
        pix_key_type: affiliate.pix_key_type,
        pix_key: affiliate.pix_key,
        pix_name: affiliate.pix_name,
        status: "requested",
        requested_at: new Date().toISOString(),
      };

      payouts.push(newPayout);
      writeJSON(PAYOUTS_FILE, payouts);

      // Update affiliate balances
      affiliate.balance_available = 0;
      affiliate.updated_at = new Date().toISOString();
      writeJSON(AFFILIATES_FILE, affiliates);

      return NextResponse.json({
        success: true,
        payout: newPayout,
        message: `Solicitação de saque de R$ ${payoutAmount.toFixed(2).replace(".", ",")} via Pix registrada com sucesso!`,
      });
    }

    // 4. AFILIADO: CRIAÇÃO / DEFINIÇÃO DE SENHA (PÓS-APROVAÇÃO)
    if (action === "affiliate_set_password") {
      const { affiliate_code, password } = body;
      if (!affiliate_code || !password) {
        return NextResponse.json({ detail: "Código de afiliado e senha são obrigatórios." }, { status: 400 });
      }

      if (typeof password !== "string" || password.length < 6) {
        return NextResponse.json({ detail: "A senha deve conter no mínimo 6 caracteres." }, { status: 400 });
      }

      const cleanCode = String(affiliate_code).toLowerCase().trim();
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const affIndex = affiliates.findIndex((a) => a.affiliate_code === cleanCode);

      if (affIndex === -1) {
        return NextResponse.json({ detail: "Cadastro de afiliado não encontrado." }, { status: 404 });
      }

      const aff = affiliates[affIndex];
      if (aff.status !== "active") {
        return NextResponse.json({ detail: "Apenas parceiros aprovados podem definir a senha de acesso." }, { status: 403 });
      }

      const { hash, salt } = hashPassword(password);
      aff.password_hash = hash;
      aff.password_salt = salt;
      aff.updated_at = new Date().toISOString();
      writeJSON(AFFILIATES_FILE, affiliates);

      const token = generateAffiliateSessionToken(aff.id, aff.email);
      const { password_hash: _, password_salt: __, ...safeAff } = aff;

      const response = NextResponse.json({
        success: true,
        token,
        affiliate: safeAff,
        message: "Senha criada com sucesso! Redirecionando para o seu painel...",
      });

      response.cookies.set("affiliate_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      return response;
    }

    // 5. AFILIADO: LOGIN NO PAINEL COM E-MAIL E SENHA
    if (action === "affiliate_login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ detail: "Informe o e-mail e a senha cadastrados." }, { status: 400 });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const aff = affiliates.find((a) => a.email.toLowerCase().trim() === cleanEmail);

      if (!aff) {
        return NextResponse.json({ detail: "Nenhum cadastro de afiliado encontrado com este e-mail." }, { status: 404 });
      }

      if (aff.status === "pending_review") {
        return NextResponse.json({
          detail: "Sua candidatura ainda está em análise pela nossa equipe de moderação. Você receberá o link de ativação no WhatsApp assim que for aprovado.",
          status: "pending_review",
        }, { status: 403 });
      }

      if (aff.status === "suspended") {
        return NextResponse.json({
          detail: "Sua conta de afiliado está temporariamente suspensa. Entre em contato com o suporte.",
          status: "suspended",
        }, { status: 403 });
      }

      if (!aff.password_hash || !aff.password_salt) {
        return NextResponse.json({
          detail: "Sua conta já foi aprovada, mas você ainda não cadastrou sua senha de acesso.",
          needs_activation: true,
          affiliate_code: aff.affiliate_code,
        }, { status: 403 });
      }

      const isMatch = verifyPassword(password, aff.password_hash, aff.password_salt);
      if (!isMatch) {
        return NextResponse.json({ detail: "Senha incorreta. Verifique suas credenciais." }, { status: 401 });
      }

      const token = generateAffiliateSessionToken(aff.id, aff.email);
      const { password_hash: _, password_salt: __, ...safeAff } = aff;

      const response = NextResponse.json({
        success: true,
        token,
        affiliate: safeAff,
        message: "Login de afiliado realizado com sucesso!",
      });

      response.cookies.set("affiliate_session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });

      return response;
    }

    // 6. AFILIADO: LOGOUT
    if (action === "affiliate_logout") {
      const response = NextResponse.json({ success: true, message: "Sessão de afiliado encerrada com sucesso." });
      response.cookies.set("affiliate_session_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    // 7. ADMIN AUTHENTICATION & MODERAÇÃO
    if (action === "admin_login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ detail: "E-mail e senha são obrigatórios." }, { status: 400 });
      }

      if (
        email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim() ||
        password !== ADMIN_PASSWORD
      ) {
        return NextResponse.json({ detail: "Credenciais de administrador incorretas." }, { status: 401 });
      }

      const token = generateAdminToken(email);
      const response = NextResponse.json({
        success: true,
        token,
        email: ADMIN_EMAIL,
        message: "Login de administrador realizado com sucesso.",
      });

      response.cookies.set("affiliate_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    if (action === "admin_logout") {
      const response = NextResponse.json({ success: true, message: "Sessão encerrada com sucesso." });
      response.cookies.set("affiliate_admin_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    if (action === "admin_approve" || action === "admin_update_status") {
      if (!isAuthenticatedAdmin(request)) {
        return NextResponse.json({ detail: "Acesso restrito ao administrador." }, { status: 401 });
      }

      const affiliate_code = body.affiliate_code;
      const status = body.status || (action === "admin_approve" ? "active" : "");
      if (!affiliate_code || !status) {
        return NextResponse.json({ detail: "affiliate_code e status são obrigatórios." }, { status: 400 });
      }

      const cleanCode = String(affiliate_code).toLowerCase().trim();
      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const affIndex = affiliates.findIndex((a) => a.affiliate_code === cleanCode);

      if (affIndex === -1) {
        return NextResponse.json({ detail: "Afiliado não encontrado." }, { status: 404 });
      }

      affiliates[affIndex].status = status;
      affiliates[affIndex].updated_at = new Date().toISOString();
      writeJSON(AFFILIATES_FILE, affiliates);

      // Best-effort async sync with Railway backend
      try {
        fetch(`${BACKEND_URL}/api/affiliates/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ affiliate_code: cleanCode, status }),
        }).catch(() => {});
      } catch {}

      return NextResponse.json({
        success: true,
        affiliate: affiliates[affIndex],
        message: status === "active" ? `Afiliado ${cleanCode} aprovado com sucesso!` : `Status do afiliado ${cleanCode} alterado para ${status}.`,
      });
    }

    // 5. REGISTRO DE CONVERSÃO (Chamado após compra confirmada)
    if (action === "record_conversion") {
      const { affiliate_code, plan_id, plan_name, order_amount, stripe_session_id, buyer_email } = body;
      if (!affiliate_code || !plan_id || !order_amount) {
        return NextResponse.json({ detail: "Parâmetros incompletos." }, { status: 400 });
      }

      const affiliates = readJSON<AffiliateRecord>(AFFILIATES_FILE);
      const affIndex = affiliates.findIndex((a) => a.affiliate_code === affiliate_code.toLowerCase().trim());
      if (affIndex === -1) {
        return NextResponse.json({ recorded: false, reason: "Afiliado não localizado." });
      }

      const affiliate = affiliates[affIndex];
      const commissionRate = affiliate.commission_rate || 0.25;
      const commissionAmount = Number((order_amount * commissionRate).toFixed(2));

      // 14 days maturation
      const now = new Date();
      const availableDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const conversions = readJSON<AffiliateConversion>(CONVERSIONS_FILE);
      const newConv: AffiliateConversion = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        affiliate_code: affiliate.affiliate_code,
        plan_id,
        plan_name: plan_name || plan_id,
        order_amount,
        commission_amount: commissionAmount,
        status: "pending",
        available_at: availableDate.toISOString(),
        stripe_session_id,
        buyer_email,
        created_at: now.toISOString(),
      };

      conversions.push(newConv);
      writeJSON(CONVERSIONS_FILE, conversions);

      affiliate.balance_pending = Number((affiliate.balance_pending + commissionAmount).toFixed(2));
      affiliate.updated_at = now.toISOString();
      writeJSON(AFFILIATES_FILE, affiliates);

      return NextResponse.json({
        recorded: true,
        conversion: newConv,
      });
    }

    return NextResponse.json({ detail: "Ação POST inválida." }, { status: 400 });
  } catch (err) {
    console.error("[Affiliates POST] Erro:", err);
    return NextResponse.json({ detail: "Erro interno do servidor." }, { status: 500 });
  }
}
