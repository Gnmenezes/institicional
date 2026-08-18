"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FINANCING_TERMS,
  monthlyPayment,
  parseHumanNumber,
  solveMonthlyRate,
  toInputValue,
} from "@/lib/solar";

type Props = {
  initialAmount: number | null;
  initialInstallments: Record<number, number>;
  initialMarginPp: number;
  updatedAt: string | null;
  usingFallback: boolean;
  fallbackRate: number;
};

export default function FinancingForm({
  initialAmount,
  initialInstallments,
  initialMarginPp,
  updatedAt,
  usingFallback,
  fallbackRate,
}: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState(initialAmount ? toInputValue(initialAmount) : "");
  const [installments, setInstallments] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      FINANCING_TERMS.map((term) => [
        term,
        initialInstallments[term] ? toInputValue(initialInstallments[term]) : "",
      ])
    )
  );
  const [marginPp, setMarginPp] = useState(toInputValue(initialMarginPp));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const previewAmount = parseHumanNumber(amount);
  const previewMargin = parseHumanNumber(marginPp);

  // Prévia ao vivo, para conferir contra a proposta do banco antes de salvar.
  const preview = FINANCING_TERMS.map((term) => {
    const value = parseHumanNumber(installments[term] ?? "");
    const base =
      Number.isFinite(previewAmount) && Number.isFinite(value)
        ? solveMonthlyRate(previewAmount, value, term)
        : null;
    return {
      term,
      base,
      final: base !== null && Number.isFinite(previewMargin) ? base + previewMargin / 100 : null,
    };
  });

  const anyValid = preview.some((p) => p.base !== null);
  const anyInvalid = preview.some(
    (p) => p.base === null && (installments[p.term] ?? "").trim() !== ""
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const response = await fetch("/api/admin/financing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: previewAmount,
        marginPp: previewMargin,
        installments: FINANCING_TERMS.map((term) => ({
          term,
          installment: parseHumanNumber(installments[term] ?? ""),
        })).filter((i) => Number.isFinite(i.installment) && i.installment > 0),
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="rounded-xl bg-brand-navy-light p-4 text-xs leading-relaxed text-brand-navy/70">
        Pegue uma <strong>simulação de financiamento recente</strong> e copie o
        valor financiado e a parcela de cada prazo. O site apura sozinho a taxa
        efetiva — que é sempre maior que a anunciada pelo banco, porque inclui
        IOF, tarifas, seguro e carência.
        <br />
        <br />
        Cada prazo tem a sua taxa: quanto mais curto, menos esses custos se
        diluem, e mais alta ela fica.
      </div>

      <div>
        <label htmlFor="amount" className="text-sm font-medium text-brand-navy">
          Valor financiado (R$)
        </label>
        <input
          id="amount"
          required
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="42.939,14"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
        <p className="mt-1.5 text-xs text-brand-navy/50">
          O preço do sistema, não o saldo devedor do banco.
        </p>
      </div>

      <div>
        <span className="text-sm font-medium text-brand-navy">Parcela de cada prazo (R$)</span>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          {FINANCING_TERMS.map((term) => (
            <div key={term}>
              <label htmlFor={`inst-${term}`} className="text-xs font-semibold text-brand-navy/60">
                {term}x
              </label>
              <input
                id={`inst-${term}`}
                inputMode="decimal"
                value={installments[term] ?? ""}
                onChange={(e) =>
                  setInstallments((prev) => ({ ...prev, [term]: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="marginPp" className="text-sm font-medium text-brand-navy">
          Margem de segurança (p.p. ao mês)
        </label>
        <input
          id="marginPp"
          required
          inputMode="decimal"
          value={marginPp}
          onChange={(e) => setMarginPp(e.target.value)}
          className="mt-1.5 w-full max-w-[10rem] rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
        <p className="mt-2 text-xs leading-relaxed text-brand-navy/50">
          Somada à taxa apurada, então o site mostra uma parcela um pouco
          <strong className="font-semibold text-brand-navy/70"> pior </strong>
          que a real. É de propósito: melhor o cliente receber uma proposta melhor
          do que esperava do que ter que explicar por que ficou mais cara.
        </p>
      </div>

      {anyValid && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange-light p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
            Prévia
          </p>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-brand-navy/45">
                <th className="pb-1 font-semibold">Prazo</th>
                <th className="pb-1 font-semibold">Taxa apurada</th>
                <th className="pb-1 font-semibold">Com margem</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p) => (
                <tr key={p.term}>
                  <td className="py-1 font-semibold text-brand-navy">{p.term}x</td>
                  <td className="py-1 text-brand-navy/70">
                    {p.base !== null ? `${(p.base * 100).toFixed(2).replace(".", ",")}%` : "—"}
                  </td>
                  <td className="py-1 font-semibold text-brand-navy">
                    {p.final !== null ? `${(p.final * 100).toFixed(2).replace(".", ",")}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-brand-navy/55">
            Num sistema de R$ 20.000 o site mostraria:{" "}
            {preview
              .filter((p) => p.final !== null)
              .map(
                (p) =>
                  `${p.term}x de ${monthlyPayment(20000, p.term, p.final!).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}`
              )
              .join(" · ")}
          </p>
        </div>
      )}

      {anyInvalid && (
        <p className="text-sm text-red-600">
          Algum prazo tem valores que não formam um financiamento válido. Confira
          se a parcela corresponde ao valor financiado.
        </p>
      )}

      {usingFallback && (
        <p className="text-xs leading-relaxed text-brand-navy/50">
          Enquanto não houver amostra salva, a calculadora usa{" "}
          {(fallbackRate * 100).toFixed(2).replace(".", ",")}% a.m.
        </p>
      )}

      {updatedAt && (
        <p className="text-xs text-brand-navy/50">
          Última atualização: {new Date(updatedAt).toLocaleDateString("pt-BR")}
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Taxas atualizadas com sucesso.</p>}

      <button
        type="submit"
        disabled={saving || !anyValid}
        className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Atualizar taxas"}
      </button>
    </form>
  );
}
