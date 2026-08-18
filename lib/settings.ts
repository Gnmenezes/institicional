import { prisma } from "@/lib/prisma";
import { FALLBACK_MONTHLY_RATE, solveMonthlyRate } from "@/lib/solar";

const SETTINGS_ID = "singleton";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "" },
  });
  return settings;
}

export function sanitizeWhatsappNumber(input: string) {
  return input.replace(/\D/g, "");
}

export type FinancingRate = {
  /** Taxa mensal usada na calculadora, já com a margem de segurança. */
  monthlyRate: number;
  /** Taxa apurada na amostra, antes da margem. */
  baseRate: number | null;
  marginPp: number;
  updatedAt: Date | null;
  /** Falso enquanto ninguém cadastrou uma amostra real de financiamento. */
  fromRealSample: boolean;
};

/**
 * Taxa de financiamento da calculadora.
 *
 * Ela não é digitada: sai de um financiamento real que o Gabriel cadastra no
 * painel (valor financiado, parcela e prazo). O banco anuncia uma taxa que
 * não inclui IOF, tarifas e seguro, então apurar pela parcela é o único jeito
 * de chegar no custo que o cliente realmente paga. Por cima ainda vai uma
 * margem, para o site nunca prometer parcela melhor do que a proposta entrega.
 */
export async function getFinancingRate(): Promise<FinancingRate> {
  const settings = await getSiteSettings();
  const marginPp = settings.financingMarginPp ?? 0.25;

  const baseRate =
    settings.financingAmount && settings.financingInstallment && settings.financingTerm
      ? solveMonthlyRate(
          settings.financingAmount,
          settings.financingInstallment,
          settings.financingTerm
        )
      : null;

  if (baseRate === null) {
    return {
      monthlyRate: FALLBACK_MONTHLY_RATE,
      baseRate: null,
      marginPp,
      updatedAt: settings.financingUpdatedAt ?? null,
      fromRealSample: false,
    };
  }

  return {
    monthlyRate: baseRate + marginPp / 100,
    baseRate,
    marginPp,
    updatedAt: settings.financingUpdatedAt ?? null,
    fromRealSample: true,
  };
}
