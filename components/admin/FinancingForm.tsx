"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  monthlyPayment,
  parseHumanNumber,
  solveMonthlyRate,
  toInputValue,
} from "@/lib/solar";

type Props = {
  initialAmount: number | null;
  initialInstallment: number | null;
  initialTerm: number | null;
  initialMarginPp: number;
  updatedAt: string | null;
  usingFallback: boolean;
  fallbackRate: number;
};

export default function FinancingForm({
  initialAmount,
  initialInstallment,
  initialTerm,
  initialMarginPp,
  updatedAt,
  usingFallback,
  fallbackRate,
}: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState(initialAmount ? toInputValue(initialAmount) : "");
  const [installment, setInstallment] = useState(
    initialInstallment ? toInputValue(initialInstallment) : ""
  );
  const [term, setTerm] = useState(initialTerm?.toString() ?? "");
  const [marginPp, setMarginPp] = useState(toInputValue(initialMarginPp));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Prévia ao vivo: mostra a taxa antes de salvar, pra conferir se bate com
  // a proposta do banco que está na mão.
  const previewAmount = parseHumanNumber(amount);
  const previewInstallment = parseHumanNumber(installment);
  const previewTerm = Number(term);
  const previewMargin = parseHumanNumber(marginPp);
  const previewBase =
    Number.isFinite(previewAmount) && Number.isFinite(previewInstallment) && previewTerm > 0
      ? solveMonthlyRate(previewAmount, previewInstallment, previewTerm)
      : null;
  const previewFinal =
    previewBase !== null && Number.isFinite(previewMargin)
      ? previewBase + previewMargin / 100
      : null;

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
        installment: previewInstallment,
        term: previewTerm,
        marginPp: previewMargin,
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
        Pegue uma <strong>proposta de financiamento recente</strong> e copie os três
        valores abaixo. O site calcula sozinho a taxa efetiva — que é sempre maior
        que a taxa anunciada pelo banco, porque inclui IOF, tarifas e seguro.
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
            placeholder="13384,38"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="installment" className="text-sm font-medium text-brand-navy">
            Valor da parcela (R$)
          </label>
          <input
            id="installment"
            required
            inputMode="decimal"
            value={installment}
            onChange={(e) => setInstallment(e.target.value)}
            placeholder="433,03"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="term" className="text-sm font-medium text-brand-navy">
            Número de parcelas
          </label>
          <input
            id="term"
            required
            inputMode="numeric"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="60"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
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
            placeholder="0,25"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <p className="text-xs leading-relaxed text-brand-navy/50">
        A margem é somada à taxa apurada, então o site mostra uma parcela um pouco
        <strong className="font-semibold text-brand-navy/70"> pior </strong>
        que a real. É de propósito: é melhor o cliente receber uma proposta melhor
        do que esperava do que ter que explicar por que ficou mais cara.
      </p>

      {previewBase !== null && previewFinal !== null && (
        <div className="rounded-xl border border-brand-orange/30 bg-brand-orange-light p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
            Prévia
          </p>
          <p className="mt-2 text-sm text-brand-navy/80">
            Taxa efetiva apurada:{" "}
            <strong>{(previewBase * 100).toFixed(2).replace(".", ",")}% a.m.</strong>
          </p>
          <p className="mt-1 text-sm text-brand-navy/80">
            Com a margem, o site vai usar:{" "}
            <strong>{(previewFinal * 100).toFixed(2).replace(".", ",")}% a.m.</strong>
          </p>
          <p className="mt-3 text-xs text-brand-navy/55">
            Exemplo: um sistema de R$ 20.000 apareceria como{" "}
            {monthlyPayment(20000, 60, previewFinal).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            em 60x.
          </p>
        </div>
      )}

      {amount && installment && term && previewBase === null && (
        <p className="text-sm text-red-600">
          Esses valores não formam um financiamento válido. Confira se a parcela e o
          prazo correspondem ao valor financiado.
        </p>
      )}

      {usingFallback && (
        <p className="text-xs leading-relaxed text-brand-navy/50">
          Enquanto não houver uma amostra salva, a calculadora usa{" "}
          {(fallbackRate * 100).toFixed(2).replace(".", ",")}% a.m., apurado de uma
          proposta real de julho de 2026.
        </p>
      )}

      {updatedAt && (
        <p className="text-xs text-brand-navy/50">
          Última atualização: {new Date(updatedAt).toLocaleDateString("pt-BR")}
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Taxa atualizada com sucesso.</p>}

      <button
        type="submit"
        disabled={saving || previewBase === null}
        className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Atualizar taxa"}
      </button>
    </form>
  );
}
