import { Resend } from "resend";

type LeadEmailInput = {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  billAmount?: string | null;
  message?: string | null;
};

export async function sendLeadNotification(lead: LeadEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      "RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL não configurados — notificação de lead não enviada por e-mail (o lead já foi salvo no banco)."
    );
    return;
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Nome: ${lead.name}`,
    `Telefone: ${lead.phone}`,
    lead.email ? `E-mail: ${lead.email}` : null,
    lead.city ? `Cidade: ${lead.city}` : null,
    lead.billAmount ? `Valor médio da conta de luz: ${lead.billAmount}` : null,
    lead.message ? `Mensagem: ${lead.message}` : null,
  ].filter(Boolean);

  await resend.emails.send({
    from: "Site Sumart <onboarding@resend.dev>",
    to,
    subject: `Novo pedido de orçamento — ${lead.name}`,
    text: lines.join("\n"),
  });
}
