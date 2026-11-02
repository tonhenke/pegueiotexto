import dns from "dns";

/**
 * Lista de domínios descartáveis/temporários mais comuns utilizados para fraude/spam.
 * Zero dependências externas.
 */
const DISPOSABLE_DOMAINS = new Set([
  // Provedores populares de e-mail temporário
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "10minutemailbox.com",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "tempmail.net",
  "tempail.com",
  "mailinator.com",
  "yopmail.com",
  "yopmail.net",
  "yopmail.fr",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamailblock.com",
  "sharklasers.com",
  "pokemail.net",
  "spam4.me",
  "grr.la",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "trashmail.org",
  "dispostable.com",
  "getairmail.com",
  "mohmal.com",
  "mohmal.in",
  "crazymailing.com",
  "generator.email",
  "emailondeck.com",
  "fakemailgenerator.com",
  "inboxkitten.com",
  "burnermail.io",
  "mytemp.email",
  "nada.ltd",
  "nada.email",
  "getnada.com",
  "dropmail.me",
  "minuteinbox.com",
  "emailfake.com",
  "tempr.email",
  "discard.email",
  "spambog.com",
  "spambog.de",
  "spambog.ru",
  "tempinbox.com",
  "mailnesia.com",
  "maildrop.cc",
  "mailcatch.com",
  "crazymail.com",
  "anonbox.net",
  "boun.cr",
  "anonymbox.com",
  "tmail.ws",
  "tmailor.com",
  "muellmail.com",
  "armyspy.com",
  "cuvox.de",
  "dayrep.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "einrot.com",
]);

/**
 * 1. Validação de formato/sintaxe RFC 5322 simplificado
 */
export function validateEmailSyntax(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim();
  if (clean.length < 6 || clean.length > 254) return false;

  // RFC 5322 regex simplificado para garantir caracteres válidos e domínio completo com TLD
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(clean);
}

/**
 * 2. Checagem de provedores temporários / descartáveis
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * 3. Verificação de registros MX no DNS (Nativa do Node.js)
 * Checa se o domínio realmente possui servidores de e-mail ativos configurados.
 */
export async function checkEmailDomainMx(email: string): Promise<{ valid: boolean; reason?: string }> {
  if (!validateEmailSyntax(email)) {
    return { valid: false, reason: "Formato de e-mail inválido." };
  }

  if (isDisposableEmail(email)) {
    return {
      valid: false,
      reason: "E-mails temporários ou descartáveis não são permitidos. Por favor, utilize um e-mail válido (Gmail, Outlook, Yahoo, corporativo, etc.).",
    };
  }

  const domain = email.split("@")[1].toLowerCase().trim();

  try {
    const mxRecords = await dns.promises.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        reason: `O domínio @${domain} não possui servidores para recebimento de e-mails configurados.`,
      };
    }
    return { valid: true };
  } catch (err: any) {
    // Se falhar o MX, tenta checar se o domínio tem registro A (fallback para servidores antigos)
    if (err.code === "ENOTFOUND" || err.code === "ENODATA" || err.code === "NXDOMAIN") {
      try {
        const aRecords = await dns.promises.resolve4(domain);
        if (aRecords && aRecords.length > 0) {
          return { valid: true };
        }
      } catch {}

      return {
        valid: false,
        reason: `Não encontramos servidores de e-mail ativos para o domínio @${domain}. Verifique se digitou corretamente.`,
      };
    }

    // Em caso de timeout de rede ou DNS local, não bloqueamos o usuário
    console.warn(`[EmailValidator] Aviso de DNS para ${domain}:`, err.code || err.message);
    return { valid: true };
  }
}
