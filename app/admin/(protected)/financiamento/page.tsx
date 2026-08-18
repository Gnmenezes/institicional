import FinancingForm from "@/components/admin/FinancingForm";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getFinancingRate } from "@/lib/settings";
import { FALLBACK_MONTHLY_RATE, FINANCING_TERMS } from "@/lib/solar";

export default async function FinanciamentoPage() {
  const [settings, rate, samples] = await Promise.all([
    getSiteSettings(),
    getFinancingRate(),
    prisma.financingSample.findMany(),
  ]);

  const initialInstallments = Object.fromEntries(
    samples.map((s) => [s.term, s.installment])
  ) as Record<number, number>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Taxa de financiamento</h1>
      <p className="mt-1 text-sm text-brand-navy/50">
        Define as taxas usadas na calculadora de economia do site.
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
          Taxas em uso agora
        </p>
        {rate.fromRealSample ? (
          <>
            <div className="mt-3 flex flex-wrap gap-6">
              {FINANCING_TERMS.map((term) => {
                const value = rate.ratesByTerm[term] ?? rate.defaultRate;
                const own = rate.ratesByTerm[term] !== undefined;
                return (
                  <div key={term}>
                    <span className="block text-xs font-semibold text-brand-navy/45">{term}x</span>
                    <span className="text-2xl font-extrabold text-brand-navy">
                      {(value * 100).toFixed(2).replace(".", ",")}%
                    </span>
                    {!own && (
                      <span className="ml-1 text-xs text-brand-navy/40">(sem amostra)</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-brand-navy/60">
              Apuradas de uma simulação real, mais{" "}
              {rate.marginPp.toString().replace(".", ",")} p.p. de margem. A taxa
              cai nos prazos longos porque IOF, tarifas e carência se diluem mais.
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-3xl font-extrabold text-brand-navy">
              {(rate.defaultRate * 100).toFixed(2).replace(".", ",")}%{" "}
              <span className="text-base font-semibold text-brand-navy/50">ao mês</span>
            </p>
            <p className="mt-2 text-sm text-brand-navy/60">
              Ainda não há amostra cadastrada — usando o valor padrão.
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <FinancingForm
          initialAmount={settings.financingAmount}
          initialInstallments={initialInstallments}
          initialMarginPp={settings.financingMarginPp ?? 0.25}
          updatedAt={settings.financingUpdatedAt?.toISOString() ?? null}
          usingFallback={!rate.fromRealSample}
          fallbackRate={FALLBACK_MONTHLY_RATE}
        />
      </div>
    </div>
  );
}
