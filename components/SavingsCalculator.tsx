"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GENERATION_BY_CITY,
  estimateSystem,
  financingOptions,
  formatBRL,
  formatPayback,
  parseHumanNumber,
} from "@/lib/solar";

const CITIES = [...Object.keys(GENERATION_BY_CITY), "Outra cidade da região"];

/** Contas abaixo disso não chegam nem no sistema mínimo. */
const MIN_BILL = 80;

export default function SavingsCalculator({ monthlyRate }: { monthlyRate: number }) {
  const [bill, setBill] = useState("");
  const [city, setCity] = useState(CITIES[0]);

  const billValue = useMemo(() => parseHumanNumber(bill), [bill]);

  const result = useMemo(() => {
    if (!Number.isFinite(billValue) || billValue < MIN_BILL) return null;
    const estimate = estimateSystem(billValue, city);
    const options = financingOptions(estimate.investment, estimate.monthlySavings, monthlyRate);
    return { estimate, options };
  }, [billValue, city, monthlyRate]);

  const bestCovered = result?.options.filter((o) => o.coveredBySavings).at(0);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="shadow-brand-lg rounded-3xl bg-white p-6 sm:p-9">
        <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <label htmlFor="bill" className="text-sm font-semibold text-brand-navy">
              Quanto vem sua conta de luz por mês?
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-brand-navy/35">
                R$
              </span>
              <input
                id="bill"
                inputMode="decimal"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                placeholder="600"
                className="w-full rounded-xl border border-black/10 py-3.5 pl-12 pr-4 text-lg font-semibold text-brand-navy outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <div>
            <label htmlFor="city" className="text-sm font-semibold text-brand-navy">
              Cidade
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white py-3.5 pl-4 pr-4 text-base text-brand-navy outline-none focus:border-brand-orange"
            >
              {CITIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!result && (
          <p className="mt-6 text-sm text-brand-navy/50">
            Digite o valor médio da sua conta para ver a estimativa.
          </p>
        )}

        {result && (
          <div className="mt-8 border-t border-black/5 pt-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Economia por mês
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-brand-orange">
                  {formatBRL(result.estimate.monthlySavings)}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Sistema indicado
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-brand-navy">
                  {result.estimate.kwp.toFixed(2).replace(".", ",")}{" "}
                  <span className="text-lg">kWp</span>
                </span>
                <span className="mt-0.5 block text-xs text-brand-navy/50">
                  gera cerca de {Math.round(result.estimate.generationKwh)} kWh/mês
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Investimento estimado
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-brand-navy">
                  {formatBRL(result.estimate.investment)}
                </span>
                <span className="mt-0.5 block text-xs text-brand-navy/50">
                  se paga em {formatPayback(result.estimate.paybackYears)}
                </span>
              </div>
            </div>

            {/* O site inteiro fala de híbrido, mas o modelo precifica on-grid.
                Sem este aviso a pessoa compara a estimativa com uma proposta
                de híbrido e acha que o preço subiu sem explicação. */}
            <div className="mt-6 flex gap-3 rounded-xl border border-brand-orange/25 bg-brand-orange-light p-4">
              <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" fill="currentColor" aria-hidden="true">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 4a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm0 8.5a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
              </svg>
              <p className="text-sm leading-relaxed text-brand-navy/75">
                Esta estimativa é de um sistema{" "}
                <strong className="font-semibold text-brand-navy">on-grid</strong> —
                o convencional, ligado à rede. Um sistema{" "}
                <strong className="font-semibold text-brand-navy">híbrido, com bateria</strong>,
                é o que mantém sua casa com luz durante as quedas de energia, e o
                cálculo dele depende de quais equipamentos você quer manter
                funcionando e por quanto tempo. Por isso ele é dimensionado caso a
                caso, no orçamento.
              </p>
            </div>

            {result.estimate.oversized && (
              <p className="mt-6 rounded-xl bg-brand-navy-light p-4 text-sm leading-relaxed text-brand-navy/70">
                Sua conta é menor que o consumo do nosso menor sistema, então ele
                geraria mais energia do que você usa hoje. Ainda compensa se você
                pretende aumentar o consumo — carro elétrico, ar-condicionado,
                uma obra. Vale conversar antes de decidir.
              </p>
            )}

            <div className="mt-8">
              <h3 className="text-sm font-bold text-brand-navy">
                E se eu financiar?
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[26rem] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-brand-navy/40">
                      <th className="pb-2 font-semibold">Prazo</th>
                      <th className="pb-2 font-semibold">Parcela</th>
                      <th className="pb-2 font-semibold">Comparado à economia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.options.map((option) => (
                      <tr key={option.months} className="border-b border-black/5">
                        <td className="py-3 font-semibold text-brand-navy">
                          {option.months}x
                        </td>
                        <td className="py-3 text-brand-navy/80">
                          {formatBRL(option.installment)}
                        </td>
                        <td className="py-3">
                          {option.coveredBySavings ? (
                            <span className="text-brand-navy/70">
                              a economia cobre, sobram{" "}
                              <strong className="text-brand-orange">
                                {formatBRL(option.difference)}
                              </strong>
                            </span>
                          ) : (
                            <span className="text-brand-navy/45">
                              faltam {formatBRL(Math.abs(option.difference))} por mês
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-brand-navy/70">
                {bestCovered ? (
                  <>
                    A partir de <strong>{bestCovered.months}x</strong>, a economia na
                    conta de luz já cobre a parcela — na prática, o sistema ajuda a
                    pagar a si mesmo, e quando o financiamento acaba a economia fica
                    inteira pra você.
                  </>
                ) : (
                  <>
                    Nesse caso a economia ainda não cobre a parcela em nenhum prazo —
                    o sistema mínimo fica grande para o seu consumo atual. À vista ou
                    com uma entrada a conta fecha bem melhor, e a gente pode simular
                    isso com você.
                  </>
                )}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-black/5 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-brand-navy/60">
                Quer o número exato para o seu telhado?
              </p>
              <Link
                href={`/contato?conta=${encodeURIComponent(bill)}&cidade=${encodeURIComponent(city)}#formulario`}
                className="shadow-glow-orange rounded-full bg-brand-orange px-7 py-3.5 text-center text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
              >
                Quero meu estudo gratuito
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-brand-navy/45">
        Estimativa baseada em projetos reais da Sumart na região. Os valores finais
        dependem do seu telhado, do seu histórico de consumo e dos equipamentos
        escolhidos — tudo isso é levantado na visita técnica, que é gratuita. As
        parcelas são simulação: a taxa real é definida pelo banco, mediante análise
        de crédito.
      </p>
    </div>
  );
}
