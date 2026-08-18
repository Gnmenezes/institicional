// Modelo de estimativa da calculadora de economia.
//
// Os parâmetros abaixo foram calibrados em cima de propostas reais da Sumart
// (jul/2026) e reproduzem aquelas propostas com menos de 0,5% de erro. Se os
// preços ou a tarifa mudarem, é aqui que se mexe.

/** Tarifa de energia usada nas propostas (R$/kWh). */
export const TARIFF = 1.15;

/**
 * Quanto da conta atual vira economia. Já considera o Fio B vigente.
 * Atenção: o Fio B é progressivo até 2029, então este número tende a cair
 * com o tempo e precisa ser revisto a cada reajuste.
 */
export const SAVINGS_SHARE = 0.86;

/** Geração média por cidade, em kWh por kWp instalado por mês. */
export const GENERATION_BY_CITY: Record<string, number> = {
  "Juiz de Fora": 115.3,
  Guiricema: 123.5,
};

/** Cidades sem medição própria usam o menor valor conhecido (conservador). */
export const DEFAULT_GENERATION = 115.3;

/** Menor sistema que a Sumart instala, e o preço dele. */
export const MIN_KWP = 2.4;
export const MIN_PRICE = 8500;

/** Curva de preço: R$/kWp = A * kWp^B, ajustada em propostas reais. */
const PRICE_A = 3236;
const PRICE_B = -0.0949;

/**
 * Taxa mensal usada quando ainda não há amostra de financiamento cadastrada.
 * Corresponde ao custo efetivo apurado numa proposta real de banco — bem
 * acima do que o banco anuncia como taxa nominal.
 */
export const FALLBACK_MONTHLY_RATE = 0.025;

export const FINANCING_TERMS = [36, 48, 60] as const;

export function generationForCity(city?: string | null) {
  if (!city) return DEFAULT_GENERATION;
  return GENERATION_BY_CITY[city] ?? DEFAULT_GENERATION;
}

/** Parcela de um financiamento (Tabela Price). */
export function monthlyPayment(principal: number, months: number, monthlyRate: number) {
  if (monthlyRate <= 0) return principal / months;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Descobre a taxa mensal efetiva a partir de um financiamento real: quanto
 * foi financiado, quanto ficou a parcela e em quantas vezes. Não há fórmula
 * fechada para isso, então resolve por bisseção — que sempre converge no
 * intervalo, ao contrário de Newton.
 *
 * Devolve null quando os dados não descrevem um financiamento possível
 * (parcela que nem cobre o principal, por exemplo).
 */
export function solveMonthlyRate(principal: number, installment: number, months: number) {
  if (principal <= 0 || installment <= 0 || months <= 0) return null;
  // Sem juros a parcela seria principal/months; nada abaixo disso é válido.
  if (installment <= principal / months) return null;
  // Parcela absurda: acima disso a taxa passaria de 100% ao mês.
  if (installment >= principal) return null;

  let low = 0;
  let high = 1;
  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    if (monthlyPayment(principal, months, mid) < installment) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

export type SystemEstimate = {
  kwp: number;
  generationKwh: number;
  investment: number;
  monthlySavings: number;
  paybackYears: number;
  /** Verdadeiro quando o consumo é menor que o do sistema mínimo. */
  oversized: boolean;
};

/** Estima o sistema a partir do valor da conta de luz. */
export function estimateSystem(monthlyBill: number, city?: string | null): SystemEstimate {
  const generationPerKwp = generationForCity(city);
  const consumptionKwh = monthlyBill / TARIFF;
  const rawKwp = consumptionKwh / generationPerKwp;

  const oversized = rawKwp < MIN_KWP;
  const kwp = Math.max(rawKwp, MIN_KWP);

  const investment = Math.max(kwp * PRICE_A * kwp ** PRICE_B, MIN_PRICE);
  const monthlySavings = monthlyBill * SAVINGS_SHARE;

  return {
    kwp,
    generationKwh: kwp * generationPerKwp,
    investment,
    monthlySavings,
    paybackYears: investment / (monthlySavings * 12),
    oversized,
  };
}

export type FinancingOption = {
  months: number;
  installment: number;
  /** A economia gerada cobre a parcela? */
  coveredBySavings: boolean;
  /** Diferença entre economia e parcela (positiva quando sobra). */
  difference: number;
};

export function financingOptions(
  investment: number,
  monthlySavings: number,
  monthlyRate: number
): FinancingOption[] {
  return FINANCING_TERMS.map((months) => {
    const installment = monthlyPayment(investment, months, monthlyRate);
    return {
      months,
      installment,
      coveredBySavings: monthlySavings >= installment,
      difference: monthlySavings - installment,
    };
  });
}

/**
 * Lê um número digitado por gente, aceitando tanto "13.384,38" quanto
 * "13384.38". O ponto é ambíguo: em "12.500" separa milhar, em "0.25" é
 * decimal. A regra aqui é: vírgula sempre decide o decimal; sem vírgula, o
 * ponto só vale como milhar quando vem seguido de exatamente três dígitos.
 */
export function parseHumanNumber(input: string): number {
  const cleaned = input.replace(/\s/g, "").replace(/R\$/gi, "");
  if (!cleaned) return NaN;

  let normalized: string;
  if (cleaned.includes(",")) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    normalized = cleaned.replace(/\./g, "");
  } else {
    normalized = cleaned;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
}

/** Formata para digitação em português (decimal com vírgula). */
export function toInputValue(value: number) {
  return value.toString().replace(".", ",");
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatPayback(years: number) {
  const totalMonths = Math.round(years * 12);
  const wholeYears = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (wholeYears === 0) return `${months} meses`;
  if (months === 0) return wholeYears === 1 ? "1 ano" : `${wholeYears} anos`;
  return `${wholeYears} ${wholeYears === 1 ? "ano" : "anos"} e ${months} ${months === 1 ? "mês" : "meses"}`;
}
