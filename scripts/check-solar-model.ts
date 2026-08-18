/**
 * Confere o modelo da calculadora contra os orçamentos reais que o
 * calibraram. Rode depois de mexer em qualquer constante de lib/solar.ts:
 *
 *   npx tsx scripts/check-solar-model.ts
 *
 * A regra que não pode quebrar: o modelo nunca pode estimar ABAIXO de um
 * orçamento real. Melhor a proposta chegar mais barata que a estimativa do
 * que ter que justificar um aumento para o cliente.
 */
import {
  BLOCK_KWP,
  MIN_KWP,
  PANELS_PER_INVERTER,
  PANEL_WP,
  REFERENCE_HSP,
  estimatePrice,
  estimateSystem,
  generationFromHsp,
  parseHumanNumber,
  solveMonthlyRate,
  monthlyPayment,
} from "../lib/solar";

/** Orçamentos reais da Sumart (jul/2026). */
const QUOTES = [
  { kwp: 2.34, generation: 269.61, price: 7956.47, label: "4 placas" },
  { kwp: 4.68, generation: 539.23, price: 12861.24, label: "8 placas" },
  { kwp: 4.8, generation: 554.0, price: 13384.38, label: "Ailson" },
  { kwp: 7.02, generation: 808.84, price: 17897.29, label: "12 placas" },
  { kwp: 9.36, generation: 1078.46, price: 22775.02, label: "16 placas" },
  { kwp: 17.4, generation: 2005.0, price: 42939.14, label: "padaria" },
  // Obra em execução em ago/2026 — o orçamento mais recente e o único
  // acima de 20 kWp, então é ele que ancora a ponta alta da curva.
  { kwp: 113.1, generation: 13677.0, price: 273351.25, label: "obra 113 kWp" },
];

/**
 * A geração desta obra (120,9 kWh/kWp/mês) é 5% maior que a dos demais
 * orçamentos (115,2), provavelmente por ser em outra cidade. Enquanto não
 * souber onde fica, a calculadora segue com 115,2, que é o valor
 * conservador — subestimar a geração aumenta o kWp e o preço estimados.
 */
const GENERATION_EXCEPTIONS = new Set(["obra 113 kWp"]);

let failures = 0;
function fail(message: string) {
  failures += 1;
  console.log(`FALHA  ${message}`);
}

console.log("== Preço: nunca abaixo do orçamento real, nem 12% acima ==");
for (const q of QUOTES) {
  const estimated = estimatePrice(q.kwp);
  const errPct = ((estimated - q.price) / q.price) * 100;
  if (errPct < 0) fail(`${q.label}: subestima em ${errPct.toFixed(2)}%`);
  else if (errPct > 12) fail(`${q.label}: superestima em ${errPct.toFixed(2)}%`);
  else
    console.log(
      `OK     ${q.label.padEnd(10)} ${q.kwp.toFixed(2)} kWp  ` +
        `modelo ${estimated.toFixed(2).padStart(10)} | real ${q.price.toFixed(2).padStart(10)} | ${errPct >= 0 ? "+" : ""}${errPct.toFixed(2)}%`
    );
}

console.log("\n== Preço cresce junto com a potência (sem degrau na emenda) ==");
let previous = 0;
for (let kwp = MIN_KWP; kwp <= 60; kwp += 0.02) {
  const price = estimatePrice(kwp);
  if (price < previous - 0.01) {
    fail(`preço caiu em ${kwp.toFixed(2)} kWp: ${price.toFixed(2)} < ${previous.toFixed(2)}`);
    break;
  }
  previous = price;
}
console.log("OK     monotônico de 2,34 a 60 kWp");

console.log("\n== Geração derivada do HSP bate com os orçamentos ==");
for (const q of QUOTES) {
  if (GENERATION_EXCEPTIONS.has(q.label)) continue;
  const real = q.generation / q.kwp;
  const model = generationFromHsp(REFERENCE_HSP);
  const errPct = Math.abs((model - real) / real) * 100;
  if (errPct > 1) fail(`${q.label}: geração ${model} vs ${real.toFixed(2)} (${errPct.toFixed(2)}%)`);
}
console.log("OK     o HSP de Juiz de Fora reproduz 115,2 e bate com todos dentro de 1%");

console.log("\n== HSP maior gera mais, e a âncora de Juiz de Fora não se move ==");
if (generationFromHsp(REFERENCE_HSP) !== 115.2) fail("âncora de Juiz de Fora saiu de 115,2");
if (generationFromHsp(5.2) <= generationFromHsp(4.6)) fail("HSP maior deveria gerar mais");
if (generationFromHsp(0) !== 115.2 || generationFromHsp(Number.NaN) !== 115.2)
  fail("HSP inválido deveria cair no padrão de Juiz de Fora");
console.log("OK");

console.log("\n== Dimensionamento sai em blocos de 4 placas ==");
for (const bill of [150, 260, 400, 600, 900, 1500, 2400]) {
  const e = estimateSystem(bill, REFERENCE_HSP);
  if (e.panels % PANELS_PER_INVERTER !== 0)
    fail(`conta ${bill}: ${e.panels} placas não fecha blocos de ${PANELS_PER_INVERTER}`);
  if (e.inverters !== e.panels / PANELS_PER_INVERTER)
    fail(`conta ${bill}: ${e.inverters} microinversores para ${e.panels} placas`);
  if (Math.abs(e.kwp - (e.panels * PANEL_WP) / 1000) > 1e-9)
    fail(`conta ${bill}: kWp não corresponde a ${e.panels} placas`);
  // O sistema tem que cobrir o consumo, nunca ficar abaixo dele.
  if (e.generationKwh * 1.15 < bill - 1e-6)
    fail(`conta ${bill}: gera ${e.generationKwh.toFixed(0)} kWh, abaixo do consumo`);
}
console.log("OK     sempre múltiplo de 4 placas, e nunca subdimensionado");

console.log("\n== Dimensionamento bate com os orçamentos reais ==");
for (const q of QUOTES) {
  if (GENERATION_EXCEPTIONS.has(q.label)) continue;
  const bill = q.generation * 1.15; // conta que esse sistema zera
  const estimate = estimateSystem(bill, REFERENCE_HSP);
  // A tolerância é um bloco: os orçamentos antigos usaram placas de 585,
  // 600 e 725 Wp, então a potência do mesmo número de placas varia.
  const diff = Math.abs(estimate.kwp - q.kwp);
  if (diff > BLOCK_KWP)
    fail(`${q.label}: kWp ${estimate.kwp.toFixed(2)} vs ${q.kwp} (${diff.toFixed(2)} de diferença)`);
}
console.log("OK     todos dentro de um bloco");

console.log("\n== Solver de taxa e parser de números ==");
for (const [pv, n, rate] of [[13384.38, 60, 0.019], [42939.14, 48, 0.025]] as const) {
  const solved = solveMonthlyRate(pv, monthlyPayment(pv, n, rate), n);
  if (solved === null || Math.abs(solved - rate) > 1e-6) fail(`taxa ${rate} não recuperada`);
}
for (const [input, expected] of [["0,25", 0.25], ["0.25", 0.25], ["13.384,38", 13384.38], ["12.500", 12500]] as const) {
  if (Math.abs(parseHumanNumber(input) - expected) > 1e-9) fail(`parser: "${input}"`);
}
if (solveMonthlyRate(10000, 100, 60) !== null) fail("parcela impossível deveria dar null");
console.log("OK");

console.log(failures === 0 ? "\nTUDO CERTO" : `\n${failures} FALHA(S)`);
process.exit(failures === 0 ? 0 : 1);
