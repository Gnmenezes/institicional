"use client";

import { useEffect, useState } from "react";

/**
 * Duas casas vizinhas explicando a diferença entre on-grid e híbrido.
 *
 * A animação passa por quatro momentos: o sol gerando, as placas levantando
 * para mostrar o que existe embaixo delas, a energia chegando na casa e —
 * o ponto da história — a queda de luz, quando só a casa com bateria
 * continua acesa.
 *
 * Cada fase tem um texto: sem ele o desenho seria enfeite. Dá para navegar
 * pelos botões, e aí a troca automática para, porque quem clicou está
 * conduzindo.
 */

const FASES = [
  {
    titulo: "O sol vira energia",
    texto:
      "As placas captam a luz do sol e geram energia em corrente contínua. Isso acontece igual nos dois sistemas.",
  },
  {
    titulo: "O que existe embaixo das placas",
    texto:
      "No on-grid, cada placa tem seu microinversor logo abaixo. No híbrido, um inversor central converte tudo e ainda carrega o banco de baterias.",
  },
  {
    titulo: "A energia chega na casa",
    texto:
      "A energia convertida abastece a casa. O que sobra vai para a rede da distribuidora e volta como crédito na conta.",
  },
  {
    titulo: "Faltou luz na rua",
    texto:
      "Sem rede, o on-grid desliga por segurança — é uma exigência técnica, não um defeito. O híbrido puxa da bateria e a casa continua funcionando.",
  },
];

const INTERVALO_MS = 6500;

const CINZA = "#353693";
const LARANJA = "#ff6a1a";
const ACESO = "#ffd27a";
const APAGADO = "#3a3b74";

export default function SystemsAnimation() {
  const [fase, setFase] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (manual) return;
    const timer = window.setTimeout(
      () => setFase((f) => (f + 1) % FASES.length),
      INTERVALO_MS
    );
    return () => window.clearTimeout(timer);
  }, [fase, manual]);

  const levantado = fase === 1;
  const apagao = fase === 3;
  const fluxoCasa = fase >= 2;
  const fluxoRede = fase === 2;

  // O tracejado só corre quando a pessoa aceita movimento; parado, ele ainda
  // mostra o caminho que a energia percorre.
  const fluxo = (ativo: boolean) =>
    `transition-opacity duration-500 ${ativo ? "opacity-100 animate-flow" : "opacity-20"}`;

  const janela = (aceso: boolean) => ({
    fill: aceso ? ACESO : APAGADO,
    transition: "fill 600ms ease",
  });

  const placas = (lift: boolean) => ({
    transform: lift ? "translateY(-22px)" : "translateY(0)",
    transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
  });

  const micro = (visivel: boolean) => ({
    opacity: visivel ? 1 : 0,
    transition: "opacity 500ms ease 150ms",
  });

  return (
    <div>
      <div className="shadow-brand overflow-hidden rounded-3xl bg-white p-4 sm:p-6">
        <svg
          viewBox="0 0 880 430"
          className="h-auto w-full"
          role="img"
          aria-label={`${FASES[fase].titulo}. ${FASES[fase].texto}`}
        >
          {/* ---------- céu e chão ---------- */}
          <rect x="0" y="0" width="880" height="430" fill="#f7f8fe" />
          <line x1="20" y1="360" x2="860" y2="360" stroke={CINZA} strokeOpacity="0.18" strokeWidth="2" />

          {/* ---------- sol ---------- */}
          <g style={{ opacity: apagao ? 0.35 : 1, transition: "opacity 600ms ease" }}>
            <circle cx="440" cy="58" r="26" fill="#fff1e8" />
            <circle cx="440" cy="58" r="16" fill={LARANJA} />
            <g className="animate-sun-rays" style={{ transformOrigin: "440px 58px" }}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1="440"
                  y1="58"
                  x2="440"
                  y2="26"
                  stroke={LARANJA}
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform={`rotate(${a} 440 58)`}
                />
              ))}
            </g>
          </g>

          {/* raios do sol até cada telhado */}
          {[
            "M415,80 L200,140",
            "M400,88 L180,152",
            "M465,80 L680,140",
            "M480,88 L700,152",
          ].map((d) => (
            <path
              key={d}
              d={d}
              stroke={LARANJA}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="5 12"
              fill="none"
              className={fluxo(!apagao)}
            />
          ))}

          {/* ---------- poste da rede ---------- */}
          <g style={{ opacity: apagao ? 0.4 : 1, transition: "opacity 600ms ease" }}>
            <rect x="435" y="150" width="10" height="210" rx="2" fill={CINZA} />
            <rect x="405" y="162" width="70" height="8" rx="4" fill={CINZA} />
            <circle cx="412" cy="180" r="5" fill={apagao ? "#c2c4e0" : LARANJA} />
            <circle cx="468" cy="180" r="5" fill={apagao ? "#c2c4e0" : LARANJA} />
          </g>
          {apagao && (
            <g>
              <circle cx="440" cy="120" r="17" fill="#fee2e2" />
              <path
                d="M432 112 L448 128 M448 112 L432 128"
                stroke="#dc2626"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ================= CASA ON-GRID ================= */}
          <g>
            {/* corpo */}
            <polygon points="95,205 215,130 335,205" fill={CINZA} />
            <rect x="115" y="205" width="200" height="155" fill="white" stroke={CINZA} strokeWidth="4" />
            <rect x="195" y="300" width="40" height="60" rx="2" fill={CINZA} />
            <rect x="140" y="232" width="44" height="40" rx="2" style={janela(!apagao)} stroke={CINZA} strokeWidth="3" />
            <rect x="248" y="232" width="44" height="40" rx="2" style={janela(!apagao)} stroke={CINZA} strokeWidth="3" />

            {/* placas com os microinversores embaixo */}
            <g transform="translate(155 167) rotate(-32)">
              <g style={micro(levantado)}>
                {[-42, -13, 16].map((x) => (
                  <rect key={x} x={x} y="-14" width="26" height="13" rx="3" fill={LARANJA} />
                ))}
              </g>
              <g style={placas(levantado)}>
                {[-42, -13, 16].map((x) => (
                  <rect
                    key={x}
                    x={x}
                    y="-30"
                    width="26"
                    height="30"
                    rx="2"
                    fill="#1f2059"
                    stroke={LARANJA}
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            </g>

            {/* caminho das placas até o inversor, e do inversor pra casa e pra rede */}
            <path d="M170,176 L215,208 L330,252" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(!apagao)} />
            <rect x="322" y="250" width="26" height="40" rx="4" fill="white" stroke={CINZA} strokeWidth="3" />
            <circle cx="335" cy="270" r="5" fill={apagao ? "#c2c4e0" : LARANJA} style={{ transition: "fill 600ms ease" }} />
            <path d="M322,278 L262,310 L235,310" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(fluxoCasa && !apagao)} />
            <path d="M348,258 L425,196" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(fluxoRede)} />

            <text x="215" y="392" textAnchor="middle" fontSize="17" fontWeight="700" fill={CINZA}>
              On-grid
            </text>
            <text x="215" y="412" textAnchor="middle" fontSize="13" fill={apagao ? "#dc2626" : "#7b7cae"}>
              {apagao ? "sem energia" : "microinversores"}
            </text>
          </g>

          {/* ================= CASA HÍBRIDA ================= */}
          <g>
            <polygon points="545,205 665,130 785,205" fill={CINZA} />
            <rect x="565" y="205" width="200" height="155" fill="white" stroke={CINZA} strokeWidth="4" />
            <rect x="645" y="300" width="40" height="60" rx="2" fill={CINZA} />
            <rect x="588" y="232" width="44" height="40" rx="2" style={janela(true)} stroke={CINZA} strokeWidth="3" />
            <rect x="696" y="232" width="44" height="40" rx="2" style={janela(true)} stroke={CINZA} strokeWidth="3" />

            {/* aqui as placas não escondem microinversor: a conversão é central */}
            <g transform="translate(725 167) rotate(32)">
              <g style={placas(levantado)}>
                {[-42, -13, 16].map((x) => (
                  <rect
                    key={x}
                    x={x}
                    y="-30"
                    width="26"
                    height="30"
                    rx="2"
                    fill="#1f2059"
                    stroke={LARANJA}
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            </g>

            <path d="M710,176 L665,208 L552,252" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(!apagao)} />

            {/* inversor híbrido e banco de baterias */}
            <rect x="530" y="250" width="28" height="42" rx="4" fill="white" stroke={CINZA} strokeWidth="3" />
            <circle cx="544" cy="271" r="5" fill={LARANJA} />
            <g style={{ filter: levantado ? "drop-shadow(0 0 6px rgba(255,106,26,0.55))" : "none", transition: "filter 400ms ease" }}>
              <rect x="524" y="302" width="40" height="52" rx="7" fill="white" stroke={CINZA} strokeWidth="3.5" />
              <rect x="529" y="307" width="30" height="10" rx="3" fill={CINZA} />
              <path d="M548 320 L536 340h7l-4 15 18-22h-7l4-13Z" fill={LARANJA} className={apagao ? "animate-battery-bolt" : ""} />
            </g>

            {/* inversor -> bateria, inversor -> casa, inversor -> rede, bateria -> casa no apagão */}
            <path d="M544,292 L544,302" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="5 6" className={fluxo(!apagao)} />
            <path d="M558,278 L620,310 L648,310" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(fluxoCasa && !apagao)} />
            <path d="M530,258 L455,196" stroke={LARANJA} strokeWidth="3" fill="none" strokeDasharray="7 9" className={fluxo(fluxoRede)} />
            <path d="M564,328 L640,328" stroke={LARANJA} strokeWidth="4" fill="none" strokeDasharray="7 9" className={fluxo(apagao)} />

            <text x="665" y="392" textAnchor="middle" fontSize="17" fontWeight="700" fill={CINZA}>
              Híbrido
            </text>
            <text x="665" y="412" textAnchor="middle" fontSize="13" fill={apagao ? "#16a34a" : "#7b7cae"}>
              {apagao ? "continua ligada" : "inversor + bateria"}
            </text>
          </g>
        </svg>
      </div>

      {/* ---------- legenda e navegação ---------- */}
      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <h3 className="text-lg font-extrabold text-brand-navy">{FASES[fase].titulo}</h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-navy/65">
            {FASES[fase].texto}
          </p>
        </div>
        <div className="flex gap-2 sm:justify-end">
          {FASES.map((f, i) => (
            <button
              key={f.titulo}
              type="button"
              onClick={() => {
                setFase(i);
                setManual(true);
              }}
              aria-label={f.titulo}
              aria-current={i === fase}
              className={`h-2 rounded-full transition-all ${
                i === fase ? "w-8 bg-brand-orange" : "w-4 bg-brand-navy/20 hover:bg-brand-navy/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
