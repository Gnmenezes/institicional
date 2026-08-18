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
  /** Taxa por prazo, já com a margem. Prazo sem amostra cai no padrão. */
  ratesByTerm: Record<number, number>;
  /** Usada em prazos sem amostra própria. */
  defaultRate: number;
  /** Taxas apuradas antes da margem, para exibição no painel. */
  baseRatesByTerm: Record<number, number>;
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
  const [settings, samples] = await Promise.all([
    getSiteSettings(),
    prisma.financingSample.findMany({ orderBy: { term: "asc" } }),
  ]);

  const marginPp = settings.financingMarginPp ?? 0.25;
  const amount = settings.financingAmount;

  const baseRatesByTerm: Record<number, number> = {};
  if (amount) {
    for (const sample of samples) {
      const rate = solveMonthlyRate(amount, sample.installment, sample.term);
      if (rate !== null) baseRatesByTerm[sample.term] = rate;
    }
  }

  const found = Object.values(baseRatesByTerm);
  if (found.length === 0) {
    return {
      ratesByTerm: {},
      defaultRate: FALLBACK_MONTHLY_RATE,
      baseRatesByTerm: {},
      marginPp,
      updatedAt: settings.financingUpdatedAt ?? null,
      fromRealSample: false,
    };
  }

  const ratesByTerm: Record<number, number> = {};
  for (const [term, rate] of Object.entries(baseRatesByTerm)) {
    ratesByTerm[Number(term)] = rate + marginPp / 100;
  }

  return {
    ratesByTerm,
    // Prazo sem amostra usa a maior taxa conhecida: erra para cima, nunca
    // mostrando uma parcela melhor do que a proposta vai entregar.
    defaultRate: Math.max(...found) + marginPp / 100,
    baseRatesByTerm,
    marginPp,
    updatedAt: settings.financingUpdatedAt ?? null,
    fromRealSample: true,
  };
}
