import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtppro.zoho.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "contato@pegueiotexto.com.br";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_NAME = "Peguei o Texto";
const FROM_EMAIL = `"${FROM_NAME}" <${SMTP_USER}>`;

function getTransporter() {
  if (!SMTP_PASS) {
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
      rejectUnauthorized: false,
    },
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

  const cleanName = name && name.trim() ? name.trim() : to.split("@")[0];

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

  const cleanName = name && name.trim() ? name.trim() : to.split("@")[0];

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
            Parabéns, ${cleanName}! O seu plano ${planName} está ativo.
          </h1>

          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px;">
            Seu pagamento foi aprovado e processado com segurança pela Stripe. Os seus novos créditos já foram adicionados à sua conta.
          </p>

          <!-- DETAILS CARD -->
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Plano Contratado:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${planName}</td>
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

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; color: #111827;">
      <h2 style="color: #059669; margin-top: 0;">🎉 Nova Compra Confirmada no Peguei o Texto!</h2>
      <p style="font-size: 15px; color: #4b5563;">Uma nova transação acabou de ser aprovada pela Stripe:</p>
      
      <div style="background: #f3f4f6; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
        <p style="margin: 6px 0;"><strong>👤 Cliente:</strong> ${buyerEmail} (${buyerName || "N/A"})</p>
        <p style="margin: 6px 0;"><strong>📦 Plano:</strong> ${planName}</p>
        <p style="margin: 6px 0;"><strong>💵 Valor:</strong> <span style="font-size: 18px; color: #059669; font-weight: 800;">${amountFormatted}</span></p>
        <p style="margin: 6px 0;"><strong>💳 Método:</strong> ${(paymentMethod || "cartao").toUpperCase()}</p>
        <p style="margin: 6px 0;"><strong>📅 Data:</strong> ${nowBR}</p>
        ${affiliateCode ? `<p style="margin: 6px 0;"><strong>🤝 Afiliado:</strong> ${affiliateCode}</p>` : `<p style="margin: 6px 0;"><strong>🤝 Canal:</strong> Venda Direta / Orgânica</p>`}
        <p style="margin: 6px 0;"><strong>🆔 Stripe Session:</strong> <code>${stripeSessionId || "N/A"}</code></p>
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
