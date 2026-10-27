import crypto from "crypto";

export const ADMIN_EMAIL = process.env.AFFILIATE_ADMIN_EMAIL || "tonhenke@gmail.com";
export const ADMIN_PASSWORD = process.env.AFFILIATE_ADMIN_PASSWORD || "987123aA!";
export const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "peguei_o_texto_admin_sec_2026_safe";

export function generateAdminToken(email: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = `${email.toLowerCase().trim()}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

export function verifyAdminToken(token: string | null | undefined): boolean {
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

export function isAuthenticatedAdmin(request: Request): boolean {
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

export function verifyAdminCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;
  return (
    email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() &&
    password === ADMIN_PASSWORD
  );
}
