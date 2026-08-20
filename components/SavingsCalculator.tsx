"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import ContactForm from "@/components/ContactForm";
import ScrollCta from "@/components/ScrollCta";
import {
  type CityOption,
  MINIMUM_BILL,
  MIN_BILLED_KWH,
  PROFILE_MESSAGES,
  profileForBill,
  estimateSystem,
  financingOptions,
  formatBRL,
  formatPayback,
  parseHumanNumber,
} from "@/lib/solar";

/** Contas abaixo disso não chegam nem no sistema mínimo. */
const MIN_BILL = 80;

const OTHER_CITY = "Outra cidade da região";

/** Agrupa a economia anual em faixas, para medir sem registrar valor individual. */
function perfilLabel(economiaAnual: number) {
  if (economiaAnual < 3000) return "ate-3k";
  if (economiaAnual < 8000) return "3k-8k";
  if (economiaAnual < 20000) return "8k-20k";
  return "acima-20k";
}

export default function SavingsCalculator({
  ratesByTerm,
  defaultRate,
  cities,
}: {
  ratesByTerm: Record<number, number>;
  defaultRate: number;
  cities: CityOption[];
}) {
  const [bill, setBill] = useState("");
  const [city, setCity] = useState(cities[0]?.name ?? OTHER_CITY);

  const billValue = useMemo(() => parseHumanNumber(bill), [bill]);

  const result = useMemo(() => {
    if (!Number.isFinite(billValue) || billValue < MIN_BILL) return null;
    const hsp = cities.find((c) => c.name === city)?.hsp;
    const estimate = estimateSystem(billValue, hsp);
    const options = financingOptions(
      estimate.investment,
      estimate.monthlySavings,
      ratesByTerm,
      defaultRate
    );
    return { estimate, options };
  }, [billValue, city, ratesByTerm, defaultRate, cities]);

  const bestCovered = result?.options.filter((o) => o.coveredBySavings).at(0);

  // Uma simulação por visita, e não uma por tecla digitada: o que interessa
  // medir é quantas pessoas chegam a ver um resultado.
  const jaContou = useRef(false);
  useEffect(() => {
    if (!result || jaContou.current) return;
    jaContou.current = true;
    track("simulou_calculadora", {
      // Faixa em vez do valor exato: serve para saber com quem o site fala,
      // sem guardar o dado financeiro de ninguém.
      faixa: perfilLabel(result.estimate.monthlySavings * 12),
      cidade: city,
    });
  }, [result, city]);

  // Quem gasta R$ 250 e quem gasta R$ 3.000 estão em conversas diferentes.
  const profile = result ? PROFILE_MESSAGES[profileForBill(billValue)] : null;

  // Vai junto com o lead: assim a Sumart sabe o que a pessoa viu no site.
  const simulationSummary = result
    ? `conta de ${formatBRL(billValue)} em ${city} · sistema de ${result.estimate.kwp
        .toFixed(2)
        .replace(".", ",")} kWp (${result.estimate.panels} placas) · economia estimada de ${formatBRL(
        result.estimate.monthlySavings
      )}/mês · investimento estimado de ${formatBRL(result.estimate.investment)}`
    : undefined;

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
              {cities.map((option) => (
                <option key={`${option.name}-${option.state}`} value={option.name}>
                  {option.name} — {option.state}
                </option>
              ))}
              {/* Fora da lista, a conta usa a irradiação de Juiz de Fora. */}
              <option value={OTHER_CITY}>{OTHER_CITY}</option>
            </select>
          </div>
        </div>

        {!result && (
          <p className="mt-6 text-sm text-brand-navy/50">
            Digite o valor médio da sua conta para ver a estimativa.
          </p>
        )}

        {result?.estimate.atMinimumBill && (
          <div className="mt-8 border-t border-black/5 pt-8">
            <h3 className="text-base font-bold text-brand-navy">
              Com essa conta, o sistema não se paga
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-navy/70">
              Mesmo gerando toda a energia que você usa, a distribuidora continua
              cobrando o custo de disponibilidade ({MIN_BILLED_KWH} kWh) mais a
              iluminação pública — cerca de {formatBRL(MINIMUM_BILL)} por mês. Sobra
              pouco para economizar, e o investimento levaria mais tempo para se
              pagar do que a vida útil do sistema.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-navy/70">
              Se o seu consumo vai crescer — obra, carro elétrico, ar-condicionado
              — vale conversar. A gente dimensiona pensando no consumo futuro.
            </p>
          </div>
        )}

        {result && !result.estimate.atMinimumBill && (
          <div className="mt-8 border-t border-black/5 pt-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <span className="block min-h-[2rem] text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Economia por ano
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-brand-orange">
                  {formatBRL(result.estimate.monthlySavings * 12)}
                </span>
              </div>
              <div>
                <span className="block min-h-[2rem] text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Sistema indicado
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-brand-navy">
                  {result.estimate.kwp.toFixed(2).replace(".", ",")}{" "}
                  <span className="text-lg">kWp</span>
                </span>
                <span className="mt-0.5 block text-xs text-brand-navy/50">
                  {result.estimate.panels} placas ·{" "}
                  {result.estimate.inverters}{" "}
                  {result.estimate.inverters === 1 ? "microinversor" : "microinversores"}
                </span>
                <span className="mt-0.5 block text-xs text-brand-navy/50">
                  gera cerca de {Math.round(result.estimate.generationKwh)} kWh/mês
                </span>
              </div>
              <div>
                {/* O tipo de sistema vai no rótulo, e não só no aviso abaixo:
                    é o número que a pessoa leva na cabeça. */}
                <span className="block min-h-[2rem] text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
                  Investimento estimado
                  <span className="block text-brand-orange/70">para sistema on-grid</span>
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
                Estes valores são de um sistema{" "}
                <strong className="font-semibold text-brand-navy">on-grid</strong>, que
                desliga junto com a rede numa queda de energia. O{" "}
                <strong className="font-semibold text-brand-navy">
                  híbrido, com bateria
                </strong>
                , mantém a casa ligada — mas o cálculo depende do que você quer manter
                funcionando e por quanto tempo. Marque &ldquo;híbrido&rdquo; abaixo e a
                gente faz esse estudo pro seu caso.
              </p>
            </div>

            {profile && (
              <div className="mt-6 border-l-2 border-brand-orange/40 pl-4">
                <h3 className="text-sm font-bold text-brand-navy">{profile.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-navy/65">
                  {profile.text}
                </p>
              </div>
            )}

            {result.estimate.oversized && (
              <p className="mt-6 rounded-xl bg-brand-navy-light p-4 text-sm leading-relaxed text-brand-navy/70">
                O menor sistema que instalamos já gera mais do que você consome
                hoje — o tamanho acima é esse mínimo, e sobra geração para quando
                o consumo crescer.
              </p>
            )}

            <div className="mt-8">
              <h3 className="text-sm font-bold text-brand-navy">
                E se eu financiar?
              </h3>
              {/* O mensal mora aqui, e não junto do destaque anual: é com a
                  parcela que ele precisa ser comparado. */}
              <p className="mt-1.5 text-sm text-brand-navy/60">
                Sua economia é de{" "}
                <strong className="font-semibold text-brand-navy">
                  {formatBRL(result.estimate.monthlySavings)} por mês
                </strong>
                . Comparando com a parcela de cada prazo:
              </p>
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
                              faltam {formatBRL(Math.abs(option.difference))}
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

            <div id="orcamento" className="mt-9 scroll-mt-24 border-t border-black/5 pt-8">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange/70">
                Próximo passo
              </span>
              <h3 className="mt-3">
                <ScrollCta
                  targetId="orcamento"
                  /* Folga pequena de propósito: o botão encosta logo abaixo do
                     cabeçalho e sobra mais formulário à vista. */
                  offset={12}
                  className="animate-cta-pulse shadow-glow-orange block w-full rounded-2xl bg-brand-orange px-6 py-5 text-center text-xl font-extrabold leading-tight text-white transition-colors hover:bg-brand-orange-dark sm:px-8 sm:py-6 sm:text-3xl"
                >
                  Solicite agora seu orçamento personalizado
                </ScrollCta>
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-navy/70 sm:text-base">
                Agora que você já tem uma ideia de quanto custa um{" "}
                <strong className="font-semibold text-brand-navy">sistema on-grid</strong>{" "}
                — um valor médio, tirado de projetos que já instalamos —, o próximo
                passo é o número exato do seu caso. Preencha os dados abaixo e a gente
                monta seu orçamento personalizado, seja on-grid ou híbrido.
              </p>
              <div className="mt-6">
                <Suspense fallback={<div className="h-96" />}>
                  <ContactForm
                    compact
                    defaultBillAmount={bill}
                    defaultCity={city === OTHER_CITY ? "" : city}
                    simulation={simulationSummary}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-brand-navy/45">
        Estimativa baseada em projetos reais da Sumart na região. Como cada
        microinversor comporta 4 placas, os sistemas são montados de 4 em 4 — por
        isso o tamanho sugerido sobe em degraus. Os valores finais dependem do seu
        telhado, do seu histórico de consumo e dos equipamentos escolhidos — tudo
        isso é levantado na visita técnica. As parcelas são
        simulação: a taxa real é definida pelo banco, mediante análise de crédito.
      </p>
    </div>
  );
}
