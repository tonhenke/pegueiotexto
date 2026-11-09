import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "contato@pegueiotexto.com.br";
const SMTP_PASS = process.env.SMTP_PASS || "L4SRYb2jj8Rx";
const FROM_NAME = "Peguei o Texto";
const FROM_EMAIL = `"${FROM_NAME}" <${SMTP_USER}>`;

export function escapeHtml(str: unknown): string {
  if (typeof str !== "string") {
    return str === null || str === undefined ? "" : String(str);
  }
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTransporter() {
  if (!SMTP_PASS) {
    console.warn("[Email] SMTP_PASS vazio.");
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

/**
 * 1. E-mail de Boas-Vindas para novos usuários
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP_PASS não configurado. E-mail de boas-vindas ignorado para:", to);
    return false;
  }

  const cleanName = escapeHtml(name && name.trim() ? name.trim() : to.split("@")[0]);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bem-vindo ao Peguei o Texto!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
        
        <!-- HEADER LOGO -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="https://pegueiotexto.com.br" style="text-decoration: none;">
            <img src="https://pegueiotexto.com.br/logo.png" alt="Peguei o Texto" width="160" style="height: auto; max-height: 48px; object-fit: contain;" />
          </a>
        </div>

        <!-- MAIN CARD -->
        <div style="background: #14122a; border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 16px; padding: 32px 28px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- BADGE -->
          <div style="display: inline-block; background: rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.5); color: #C4B5FD; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 20px;">
            🎉 5 Minutos Grátis Liberados
          </div>

          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 14px; color: #ffffff; line-height: 1.3;">
            Olá, ${cleanName}! Seja muito bem-vindo ao Peguei o Texto.
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 20px;">
            Sua conta foi criada com sucesso! Para você já começar a aproveitar, acabamos de liberar <strong>5 minutos de transcrição gratuita</strong> no seu saldo.
          </p>

          <!-- HIGHLIGHT BOX -->
          <div style="background: rgba(124, 58, 237, 0.1); border-left: 4px solid #7C3AED; padding: 16px 18px; border-radius: 8px; margin-bottom: 24px;">
            <p style="font-size: 14px; margin: 0; color: #e2e8f0; line-height: 1.5;">
              ⚡ <strong>Transcreva em segundos:</strong> Cole links do YouTube, Instagram Reels, TikTok, Facebook ou envie arquivos MP3/MP4/WAV direto do seu computador ou celular.
            </p>
          </div>

          <!-- STEPS -->
          <h3 style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 14px;">
            Como transcrever seu primeiro vídeo agora:
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 36px;">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: #7C3AED; color: #ffffff; font-weight: 800; font-size: 12px; text-align: center; line-height: 26px;">1</div>
              </td>
              <td style="padding: 10px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                Acesse o painel e <strong>cole o link do vídeo</strong> ou faça upload do seu arquivo de áudio.
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 36px;">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: #7C3AED; color: #ffffff; font-weight: 800; font-size: 12px; text-align: center; line-height: 26px;">2</div>
              </td>
              <td style="padding: 10px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                A nossa Inteligência Artificial processa a fala e pontua o texto com <strong>mais de 98% de precisão</strong>.
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; vertical-align: top; width: 36px;">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: #7C3AED; color: #ffffff; font-weight: 800; font-size: 12px; text-align: center; line-height: 26px;">3</div>
              </td>
              <td style="padding: 10px 0; font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                Exporte em <strong>Word (.docx)</strong>, <strong>PDF</strong>, <strong>Legendas (.srt/.vtt)</strong> ou copie o texto direto com 1 clique!
              </td>
            </tr>
          </table>

          <!-- CTA BUTTON -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://pegueiotexto.com.br/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);">
              Começar a Transcrever Agora →
            </a>
          </div>

          <!-- REFERRAL TIP -->
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 14px 16px; text-align: center;">
            <p style="font-size: 13px; color: #FCD34D; margin: 0;">
              🎁 <strong>Quer mais minutos?</strong> No seu painel você tem um link de indicação exclusivo: cada amigo que você convidar ganha +10 min e você também ganha +10 min grátis!
            </p>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 28px; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 6px;">Peguei o Texto — Transcrição Inteligente com Inteligência Artificial</p>
          <p style="margin: 0;">Dúvidas ou suporte? Responda este e-mail para falar diretamente com a nossa equipe.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "🎉 Bem-vindo ao Peguei o Texto! Seus 5 minutos grátis estão liberados",
      html,
    });
    console.log(`[Email] Boas-vindas enviado com sucesso para ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (err: any) {
    console.error(`[Email] Falha ao enviar boas-vindas para ${to}:`, err.message);
    return false;
  }
}

/**
 * 2. E-mail de Ativação / Mudança de Plano
 */
export async function sendPlanActivatedEmail({
  to,
  name,
  planName,
  minutesAdded,
  amountFormatted,
  stripeSessionId,
}: {
  to: string;
  name?: string;
  planName: string;
  minutesAdded: number;
  amountFormatted?: string;
  stripeSessionId?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP_PASS não configurado. E-mail de plano ignorado para:", to);
    return false;
  }

  const cleanName = escapeHtml(name && name.trim() ? name.trim() : to.split("@")[0]);
  const safePlanName = escapeHtml(planName);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Plano Ativado com Sucesso!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
        
        <!-- HEADER LOGO -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="https://pegueiotexto.com.br" style="text-decoration: none;">
            <img src="https://pegueiotexto.com.br/logo.png" alt="Peguei o Texto" width="160" style="height: auto; max-height: 48px; object-fit: contain;" />
          </a>
        </div>

        <!-- MAIN CARD -->
        <div style="background: #14122a; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 16px; padding: 32px 28px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- BADGE -->
          <div style="display: inline-block; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.5); color: #34D399; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 20px;">
            ✓ Pagamento Confirmado
          </div>

          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 14px; color: #ffffff; line-height: 1.3;">
            Parabéns, ${cleanName}! O seu plano ${safePlanName} está ativo.
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px;">
            Seu pagamento foi aprovado e processado com segurança pela Stripe. Os seus novos créditos já foram adicionados à sua conta.
          </p>

          <!-- DETAILS CARD -->
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Plano Contratado:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safePlanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Créditos Adicionados:</td>
                <td style="padding: 8px 0; color: #34D399; font-weight: 800; font-size: 16px; text-align: right;">+${minutesAdded} minutos</td>
              </tr>
              ${amountFormatted ? `
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Valor Pago:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${amountFormatted}</td>
              </tr>
              ` : ""}
              ${stripeSessionId ? `
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Identificador:</td>
                <td style="padding: 8px 0; color: #a78bfa; font-family: monospace; font-size: 12px; text-align: right;">${stripeSessionId.slice(0, 18)}...</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <!-- PERKS -->
          <h3 style="font-size: 15px; font-weight: 700; color: #ffffff; margin: 0 0 12px;">
            O que você tem liberado agora:
          </h3>
          <ul style="font-size: 14px; color: #cbd5e1; line-height: 1.8; margin: 0 0 28px; padding-left: 20px;">
            <li>Transcrições ultra-rápidas com Whisper IA de última geração;</li>
            <li>Vídeos e áudios de longa duração;</li>
            <li>Exportação ilimitada em <strong>Word (.docx)</strong>, <strong>PDF</strong>, <strong>SRT</strong> e <strong>VTT</strong>;</li>
            <li>Suporte prioritário da equipe.</li>
          </ul>

          <!-- CTA BUTTON -->
          <div style="text-align: center; margin-bottom: 12px;">
            <a href="https://pegueiotexto.com.br/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #06B6D4 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);">
              Acessar Meu Painel e Saldo →
            </a>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 28px; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 6px;">Peguei o Texto — Obrigado pela confiança!</p>
          <p style="margin: 0;">Se precisar de qualquer apoio, responda diretamente a este e-mail.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `🚀 Seu plano ${planName} foi ativado no Peguei o Texto!`,
      html,
    });
    console.log(`[Email] Confirmação de plano enviada com sucesso para ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (err: any) {
    console.error(`[Email] Falha ao enviar confirmação de plano para ${to}:`, err.message);
    return false;
  }
}

/**
 * 3. Alerta imediato de nova compra para o administrador (Ton Henke)
 */
export async function sendAdminPurchaseAlertEmail({
  buyerEmail,
  buyerName,
  planName,
  amountFormatted,
  paymentMethod,
  stripeSessionId,
  affiliateCode,
}: {
  buyerEmail: string;
  buyerName?: string;
  planName: string;
  amountFormatted: string;
  paymentMethod?: string;
  stripeSessionId?: string;
  affiliateCode?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const adminEmail = process.env.AFFILIATE_ADMIN_EMAIL || "tonhenke@gmail.com";
  const nowBR = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const safeBuyerEmail = escapeHtml(buyerEmail);
  const safeBuyerName = escapeHtml(buyerName || "N/A");
  const safePlanName = escapeHtml(planName);
  const safePaymentMethod = escapeHtml((paymentMethod || "cartao").toUpperCase());
  const safeAffiliateCode = escapeHtml(affiliateCode || "");
  const safeStripeSessionId = escapeHtml(stripeSessionId || "N/A");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; color: #111827;">
      <h2 style="color: #059669; margin-top: 0;">🎉 Nova Compra Confirmada no Peguei o Texto!</h2>
      <p style="font-size: 15px; color: #4b5563;">Uma nova transação acabou de ser aprovada pela Stripe:</p>
      
      <div style="background: #f3f4f6; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
        <p style="margin: 6px 0;"><strong>👤 Cliente:</strong> ${safeBuyerEmail} (${safeBuyerName})</p>
        <p style="margin: 6px 0;"><strong>📦 Plano:</strong> ${safePlanName}</p>
        <p style="margin: 6px 0;"><strong>💵 Valor:</strong> <span style="font-size: 18px; color: #059669; font-weight: 800;">${amountFormatted}</span></p>
        <p style="margin: 6px 0;"><strong>💳 Método:</strong> ${safePaymentMethod}</p>
        <p style="margin: 6px 0;"><strong>📅 Data:</strong> ${nowBR}</p>
        ${affiliateCode ? `<p style="margin: 6px 0;"><strong>🤝 Afiliado:</strong> ${safeAffiliateCode}</p>` : `<p style="margin: 6px 0;"><strong>🤝 Canal:</strong> Venda Direta / Orgânica</p>`}
        <p style="margin: 6px 0;"><strong>🆔 Stripe Session:</strong> <code>${safeStripeSessionId}</code></p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://pegueiotexto.com.br/admin" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">
          Abrir Dashboard de Admin →
        </a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `💰 Nova Venda! ${planName} - ${amountFormatted} (${buyerEmail})`,
      html,
    });
    return true;
  } catch (err: any) {
    console.error("[Email] Falha ao enviar alerta de venda para admin:", err.message);
    return false;
  }
}

/**
 * 4. Notificação de Nova Sugestão / Feedback para a equipe (feedbacks@pegueiotexto.com.br)
 */
export async function sendSuggestionNotificationEmail({
  category,
  categoryLabel,
  title,
  description,
  userEmail,
  userName,
  userId,
}: {
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  userEmail?: string;
  userName?: string;
  userId?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const targetEmail = process.env.FEEDBACK_TARGET_EMAIL || "feedbacks@pegueiotexto.com.br";
  const nowBR = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
    ux: { bg: "#EEF2FF", text: "#4338CA", icon: "🎨" },
    transcription: { bg: "#ECFDF5", text: "#065F46", icon: "🎙️" },
    ai: { bg: "#F5F3FF", text: "#6D28D9", icon: "🤖" },
    bugs: { bg: "#FEF2F2", text: "#991B1B", icon: "🐛" },
    features: { bg: "#FFFBEB", text: "#92400E", icon: "💡" },
    other: { bg: "#F3F4F6", text: "#374151", icon: "💬" },
  };

  const style = categoryColors[category] || categoryColors.other;

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCategoryLabel = escapeHtml(categoryLabel);
  const safeUserName = escapeHtml(userName || "");
  const safeUserEmail = escapeHtml(userEmail || "");
  const safeUserId = escapeHtml(userId || "");

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Nova Sugestão Recebida</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
      <div style="max-width: 620px; margin: 0 auto; padding: 32px 20px;">
        
        <!-- HEADER -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
            💡 Nova Sugestão da Comunidade
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #94a3b8;">
            Enviada via página de sugestões do Peguei o Texto
          </p>
        </div>

        <!-- MAIN CARD -->
        <div style="background-color: #151329; border: 1px solid #2a274c; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
          
          <!-- CATEGORY BADGE -->
          <div style="margin-bottom: 16px;">
            <span style="display: inline-block; background-color: ${style.bg}; color: ${style.text}; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 9999px;">
              ${style.icon} ${safeCategoryLabel}
            </span>
          </div>

          <!-- TITLE -->
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.35;">
            ${safeTitle}
          </h2>

          <!-- DESCRIPTION BOX -->
          <div style="background-color: #0b0a16; border: 1px solid #221f3f; border-radius: 12px; padding: 18px; margin-bottom: 22px;">
            <div style="font-size: 12px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
              Detalhes da Sugestão / Problema:
            </div>
            <div style="font-size: 15px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">
${safeDescription}
            </div>
          </div>

          <!-- AUTHOR INFO -->
          <div style="background-color: rgba(255, 255, 255, 0.03); border-top: 1px solid #221f3f; padding-top: 16px; font-size: 13px; color: #94a3b8;">
            <p style="margin: 4px 0;"><strong>👤 Autor:</strong> ${safeUserName || "Não informado"} ${userEmail ? `(&lt;${safeUserEmail}&gt;)` : "(Anônimo)"}</p>
            <p style="margin: 4px 0;"><strong>📅 Data:</strong> ${nowBR}</p>
            ${userId ? `<p style="margin: 4px 0;"><strong>🆔 User ID:</strong> <code style="color: #cbd5e1;">${safeUserId}</code></p>` : ""}
          </div>

          <!-- ADMIN HUB LINK -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://pegueiotexto.com.br/admin" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
              Ver no Hub de Admin →
            </a>
          </div>

        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
          Peguei o Texto • Sistema de Feedback e Melhoria Contínua
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: targetEmail,
      replyTo: userEmail || SMTP_USER,
      subject: `💡 [${categoryLabel}] ${title}`,
      html,
    });
    console.log(`[Email] Sugestão enviada com sucesso para ${targetEmail}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Erro ao enviar sugestão para equipe:", err.message);
    return false;
  }
}

/**
 * 5. E-mail de agradecimento para o usuário que enviou a sugestão
 */
export async function sendSuggestionUserConfirmationEmail({
  to,
  userName,
  title,
  categoryLabel,
}: {
  to: string;
  userName?: string;
  title: string;
  categoryLabel: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const cleanName = escapeHtml(userName && userName.trim() ? userName.trim() : to.split("@")[0]);
  const safeTitle = escapeHtml(title);
  const safeCategoryLabel = escapeHtml(categoryLabel);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Obrigado pela sua sugestão!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">
            Peguei o <span style="color: #a78bfa;">Texto</span>
          </h1>
        </div>

        <div style="background-color: #151329; border: 1px solid #2a274c; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
          <div style="font-size: 36px; margin-bottom: 12px; text-align: center;">💡</div>
          <h2 style="text-align: center; margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #ffffff;">
            Olá, ${cleanName}! Obrigado pela sua contribuição.
          </h2>

          <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 16px 0;">
            Recebemos com muito carinho a sua sugestão na categoria <strong>${safeCategoryLabel}</strong>:
          </p>

          <div style="background-color: #0b0a16; border-left: 4px solid #7c3aed; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 15px; font-weight: 700; color: #ffffff;">
              "${safeTitle}"
            </p>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            Nossa equipe de produto analisa todas as ideias enviadas para priorizar as melhorias que mais geram valor para a nossa comunidade.
          </p>

          <div style="text-align: center; margin-top: 26px;">
            <a href="https://pegueiotexto.com.br/dashboard" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">
              Acessar meu Dashboard →
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
          Peguei o Texto • Evoluindo com a sua ajuda
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `💡 Recebemos sua sugestão para o Peguei o Texto!`,
      html,
    });
    return true;
  } catch (err: any) {
    console.warn("[Email] Falha ao enviar confirmação de sugestão para o usuário:", err.message);
    return false;
  }
}

/**
 * 7. E-mail de Código OTP de 6 dígitos para Confirmação de Cadastro
 */
export async function sendOtpEmail({
  to,
  name,
  code,
}: {
  to: string;
  name?: string;
  code: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] SMTP não configurado. Código OTP ignorado para:", to);
    return false;
  }

  const cleanName = escapeHtml(name && name.trim() ? name.trim() : to.split("@")[0]);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seu Código de Confirmação</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
      <div style="max-width: 540px; margin: 0 auto; padding: 32px 20px;">
        
        <!-- HEADER LOGO -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://pegueiotexto.com.br" style="text-decoration: none;">
            <img src="https://pegueiotexto.com.br/logo.png" alt="Peguei o Texto" width="160" style="height: auto; max-height: 46px; object-fit: contain;" />
          </a>
        </div>

        <!-- MAIN CARD -->
        <div style="background: #14122a; border: 1px solid rgba(124, 58, 237, 0.35); border-radius: 16px; padding: 32px 26px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); text-align: center;">
          
          <!-- BADGE -->
          <div style="display: inline-block; background: rgba(124, 58, 237, 0.18); border: 1px solid rgba(124, 58, 237, 0.5); color: #C4B5FD; padding: 5px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 18px;">
            🔒 Confirmação de Cadastro
          </div>

          <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #ffffff;">
            Olá, ${cleanName}!
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px;">
            Para validar seu e-mail e <strong>liberar seus 5 minutos grátis</strong> de transcrição no Peguei o Texto, insira o código de segurança abaixo:
          </p>

          <!-- OTP CODE BOX -->
          <div style="background: rgba(124, 58, 237, 0.12); border: 2px dashed #7C3AED; border-radius: 14px; padding: 20px 16px; margin-bottom: 24px;">
            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #A78BFA; text-shadow: 0 0 20px rgba(139, 92, 246, 0.4); text-indent: 10px;">
              ${code}
            </div>
          </div>

          <p style="font-size: 13px; color: #94a3b8; margin: 0 0 8px;">
            ⏱️ Este código é válido por <strong>10 minutos</strong>.
          </p>
          <p style="font-size: 12px; color: #64748b; margin: 0;">
            Se você não tentou criar uma conta no Peguei o Texto, ignore este e-mail.
          </p>

        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
          Peguei o Texto • Transcrição inteligente com IA<br>
          <span style="font-size: 11px; color: #475569;">@pegueiotexto.com.br #${code}</span>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `🔒 Seu código de confirmação: ${code} - Peguei o Texto`,
      text: `Olá, ${cleanName}!\n\nSeu código de confirmação no Peguei o Texto é: ${code}\n\nEste código expira em 10 minutos.\n\n@pegueiotexto.com.br #${code}`,
      html,
    });
    return true;
  } catch (err: any) {
    console.error("[Email] Falha ao enviar código OTP:", err.message);
    return false;
  }
}

/**
 * 8. E-mail com presente de 15 minutos grátis para Leads do Baixar Vídeo
 */
export async function sendBonus15Email({
  to,
  claimUrl,
}: {
  to: string;
  claimUrl: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] Transporter indisponível para bônus de 15 minutos.");
    return false;
  }

  const cleanName = escapeHtml(to.split("@")[0]);
  const safeClaimUrl = encodeURI(claimUrl);
  const safeTo = escapeHtml(to);

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seus 15 Minutos Grátis Chegaram!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0a16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
      <div style="max-width: 580px; margin: 0 auto; padding: 32px 20px;">
        
        <!-- HEADER LOGO -->
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="https://pegueiotexto.com.br" style="text-decoration: none;">
            <img src="https://pegueiotexto.com.br/logo.png" alt="Peguei o Texto" width="160" style="height: auto; max-height: 48px; object-fit: contain;" />
          </a>
        </div>

        <!-- MAIN CARD -->
        <div style="background: #14122a; border: 1px solid rgba(124, 58, 237, 0.4); border-radius: 16px; padding: 36px 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          
          <!-- BADGE -->
          <div style="display: inline-block; background: rgba(124, 58, 237, 0.2); border: 1px solid rgba(124, 58, 237, 0.5); color: #C4B5FD; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 20px;">
            🎁 Presente Exclusivo de 15 Minutos
          </div>

          <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 16px; color: #ffffff; line-height: 1.3;">
            Olá! Seus 15 minutos de transcrição grátis estão prontos para você.
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 22px;">
            Como você usou nossa ferramenta de download de vídeos, preparamos um benefício especial: <strong>15 minutos gratuitos</strong> de transcrição de áudio e vídeo com inteligência artificial para você testar quando quiser.
          </p>

          <!-- HIGHLIGHT BOX -->
          <div style="background: rgba(124, 58, 237, 0.12); border-left: 4px solid #7C3AED; padding: 18px 20px; border-radius: 8px; margin-bottom: 28px;">
            <p style="font-size: 14px; margin: 0; color: #e2e8f0; line-height: 1.6;">
              ⚡ <strong>O que você pode fazer com seus 15 minutos:</strong><br>
              • Transcrever vídeos do YouTube, Instagram Reels e TikTok colando o link.<br>
              • Enviar arquivos MP3, MP4 ou áudios do WhatsApp gravados.<br>
              • Exportar textos formatados, resumos com IA e arquivos de legenda SRT/VTT.
            </p>
          </div>

          <!-- ACTION BUTTON -->
          <div style="text-align: center; margin: 32px 0 24px;">
            <a href="${safeClaimUrl}" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45); letter-spacing: -0.01em;">
              Ativar Meus 15 Minutos Grátis →
            </a>
          </div>

          <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; text-align: center; margin: 0;">
            🔒 <em>Importante:</em> O benefício de 15 minutos é vinculado a este e-mail (${safeTo}) e será creditado no seu saldo assim que você criar sua senha pelo link acima.
          </p>

        </div>

        <!-- FOOTER -->
        <div style="text-align: center; margin-top: 26px; font-size: 12px; color: #64748b;">
          Peguei o Texto • Transcrição inteligente de áudio e vídeo com IA<br>
          <a href="https://pegueiotexto.com.br" style="color: #a78bfa; text-decoration: none;">pegueiotexto.com.br</a>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "🎁 Seus 15 minutos de transcrição grátis no Peguei o Texto chegaram!",
      text: `Olá!\n\nSeus 15 minutos de transcrição gratuita com IA no Peguei o Texto estão liberados.\n\nPara ativar agora seu saldo, acesse o link abaixo:\n${claimUrl}\n\nEquipe Peguei o Texto`,
      html,
    });
    console.log(`[Email] Bônus de 15 minutos enviado com sucesso para ${to}`);
    return true;
  } catch (err: any) {
    console.error(`[Email] Falha ao enviar bônus de 15 minutos para ${to}:`, err.message);
    return false;
  }
}


