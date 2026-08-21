import { Resend } from "resend";

type LeadEmailInput = {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  billAmount?: string | null;
  systemType?: string | null;
  roofType?: string | null;
  simulation?: string | null;
  futureLoad?: string | null;
  message?: string | null;
};

export const SYSTEM_TYPE_LABELS: Record<string, string> = {
  HIBRIDO: "Híbrido (com bateria)",
  ONGRID: "Convencional (on-grid)",
  INDEFINIDO: "Ainda não sei / quer orientação",
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
    lead.roofType ? `Telhado: ${lead.roofType}` : null,
    lead.systemType
      ? `Tipo de sistema: ${SYSTEM_TYPE_LABELS[lead.systemType] ?? lead.systemType}`
      : null,
    lead.simulation ? `Simulou no site: ${lead.simulation}` : null,
    lead.futureLoad ? `Vai aumentar o consumo: ${lead.futureLoad}` : null,
    lead.message ? `Mensagem: ${lead.message}` : null,
  ].filter(Boolean);

  // Híbrido precisa de dimensionamento caso a caso, então vale destacar
  // no assunto pra esse lead não entrar na fila como um orçamento comum.
  const subject =
    lead.systemType === "HIBRIDO"
      ? `Novo pedido de orçamento (HÍBRIDO) — ${lead.name}`
      : `Novo pedido de orçamento — ${lead.name}`;

  await resend.emails.send({
    from: "Site Sumart <onboarding@resend.dev>",
    to,
    subject,
    text: lines.join("\n"),
  });
}
