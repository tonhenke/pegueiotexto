import fs from "fs";
import path from "path";

export interface PendingOtp {
  email: string;
  name: string;
  password: string; // Plain password temporarily held for account creation upon verification
  code: string;
  createdAt: number;
  expiresAt: number;
  lastSentAt: number;
  attempts: number;
}

function getTmpOtpFile(): string {
  const dir = path.join("/tmp", "pegueiotexto_data");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
  return path.join(dir, "active_otps.json");
}

function readOtps(): Map<string, PendingOtp> {
  const map = new Map<string, PendingOtp>();
  try {
    const filePath = getTmpOtpFile();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const list: PendingOtp[] = JSON.parse(raw) || [];
      const now = Date.now();
      for (const item of list) {
        if (item.expiresAt > now) {
          map.set(item.email.toLowerCase().trim(), item);
        }
      }
    }
  } catch {}
  return map;
}

function writeOtps(map: Map<string, PendingOtp>): void {
  try {
    const filePath = getTmpOtpFile();
    const list = Array.from(map.values()).filter((item) => item.expiresAt > Date.now());
    fs.writeFileSync(filePath, JSON.stringify(list), "utf-8");
  } catch {}
}

export function savePendingOtp(data: {
  email: string;
  name: string;
  password: string;
  code: string;
}): { success: boolean; error?: string; retryAfterSeconds?: number } {
  const cleanEmail = data.email.toLowerCase().trim();
  const map = readOtps();
  const existing = map.get(cleanEmail);
  const now = Date.now();

  // Rate limit: 60 seconds cooldown between code resends
  if (existing && now - existing.lastSentAt < 60 * 1000) {
    const waitSeconds = Math.ceil((60 * 1000 - (now - existing.lastSentAt)) / 1000);
    return {
      success: false,
      error: `Aguarde ${waitSeconds} segundos antes de solicitar um novo código.`,
      retryAfterSeconds: waitSeconds,
    };
  }

  const record: PendingOtp = {
    email: cleanEmail,
    name: data.name.trim(),
    password: data.password,
    code: data.code.trim(),
    createdAt: now,
    expiresAt: now + 10 * 60 * 1000, // 10 minutes
    lastSentAt: now,
    attempts: 0,
  };

  map.set(cleanEmail, record);
  writeOtps(map);
  return { success: true };
}

export function verifyPendingOtp(
  email: string,
  inputCode: string
): { valid: boolean; error?: string; data?: { email: string; name: string; password: string } } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = inputCode.trim();
  const map = readOtps();
  const record = map.get(cleanEmail);

  if (!record) {
    return {
      valid: false,
      error: "Nenhum código ativo encontrado para este e-mail. Solicite um novo código.",
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    map.delete(cleanEmail);
    writeOtps(map);
    return {
      valid: false,
      error: "Este código expirou. Por favor, solicite um novo código de confirmação.",
    };
  }

  if (record.attempts >= 5) {
    map.delete(cleanEmail);
    writeOtps(map);
    return {
      valid: false,
      error: "Número máximo de tentativas incorretas excedido. Solicite um novo código.",
    };
  }

  if (record.code !== cleanCode) {
    record.attempts += 1;
    map.set(cleanEmail, record);
    writeOtps(map);
    const remaining = 5 - record.attempts;
    return {
      valid: false,
      error: `Código incorreto. Você ainda tem ${remaining} tentativa(s).`,
    };
  }

  // Success: consume and delete the OTP
  map.delete(cleanEmail);
  writeOtps(map);

  return {
    valid: true,
    data: {
      email: record.email,
      name: record.name,
      password: record.password,
    },
  };
}
