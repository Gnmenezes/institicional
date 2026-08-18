import FinancingForm from "@/components/admin/FinancingForm";
import { getSiteSettings, getFinancingRate } from "@/lib/settings";
import { FALLBACK_MONTHLY_RATE } from "@/lib/solar";

export default async function FinanciamentoPage() {
  const [settings, rate] = await Promise.all([getSiteSettings(), getFinancingRate()]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Taxa de financiamento</h1>
      <p className="mt-1 text-sm text-brand-navy/50">
        Define a taxa usada na calculadora de economia do site.
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
          Taxa em uso agora
        </p>
        <p className="mt-2 text-3xl font-extrabold text-brand-navy">
          {(rate.monthlyRate * 100).toFixed(2).replace(".", ",")}%{" "}
          <span className="text-base font-semibold text-brand-navy/50">ao mês</span>
        </p>
        <p className="mt-2 text-sm text-brand-navy/60">
          {rate.fromRealSample
            ? `Apurada de um financiamento real (${(rate.baseRate! * 100).toFixed(2).replace(".", ",")}% a.m.) mais ${rate.marginPp.toString().replace(".", ",")} p.p. de margem.`
            : "Ainda não há amostra cadastrada — usando o valor padrão."}
        </p>
      </div>

      <div className="mt-6">
        <FinancingForm
          initialAmount={settings.financingAmount}
          initialInstallment={settings.financingInstallment}
          initialTerm={settings.financingTerm}
          initialMarginPp={settings.financingMarginPp ?? 0.25}
          updatedAt={settings.financingUpdatedAt?.toISOString() ?? null}
          usingFallback={!rate.fromRealSample}
          fallbackRate={FALLBACK_MONTHLY_RATE}
        />
      </div>
    </div>
  );
}
