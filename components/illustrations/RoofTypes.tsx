/**
 * Ilustrações dos tipos de telhado para o seletor do formulário.
 *
 * São close-ups da superfície, e não silhuetas de telhado inteiro: em
 * miniatura, o que distingue cerâmica de fibrocimento é a textura, não o
 * formato. Três telhados desenhados por inteiro viram três triângulos
 * parecidos.
 *
 * Desenho em vez de foto porque o traço isola essa característica — uma foto
 * real traria casa, árvore e céu disputando a atenção.
 */
const TRACO = "#353693";
const LARANJA = "#ff6a1a";

type Props = { className?: string };

function Base({ children, className = "" }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 84" className={className} fill="none" aria-hidden="true">
      <rect x="0" y="0" width="120" height="84" rx="8" fill="#f6f7fc" />
      {children}
    </svg>
  );
}

/** Telhas curvas em fileiras, no vermelho característico. */
export function CeramicRoof({ className }: Props) {
  return (
    <Base className={className}>
      {[0, 1, 2, 3].map((linha) => (
        <g key={linha} transform={`translate(0 ${14 + linha * 17})`}>
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <path
              key={col}
              d={`M${8 + col * 16} 18 v-9 a8 8 0 0 1 16 0 v9 z`}
              fill="#e8734a"
              stroke="#c04a24"
              strokeWidth="1.5"
            />
          ))}
        </g>
      ))}
    </Base>
  );
}

/** Ondas largas e contínuas, cinza-claro. */
export function FiberCementRoof({ className }: Props) {
  return (
    <Base className={className}>
      <rect x="6" y="12" width="108" height="60" rx="3" fill="#c3c7da" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${12 + i * 18} 12 v60`}
          stroke="#9096b4"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={`b${i}`} d={`M${21 + i * 18} 12 v60`} stroke="#eceef7" strokeWidth="3" opacity="0.8" />
      ))}
    </Base>
  );
}

/** Vincos retos e angulosos, com brilho metálico. */
export function MetalRoof({ className }: Props) {
  return (
    <Base className={className}>
      <rect x="6" y="12" width="108" height="60" rx="3" fill="#98a0bf" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={10 + i * 18} y="12" width="7" height="60" fill="#6f7899" />
          <rect x={17 + i * 18} y="12" width="3" height="60" fill="#e9ecf7" />
        </g>
      ))}
    </Base>
  );
}

/** Superfície plana de concreto, com juntas discretas. */
export function SlabRoof({ className }: Props) {
  return (
    <Base className={className}>
      <rect x="6" y="12" width="108" height="60" rx="3" fill="#d3d6e6" />
      <path d="M6 42 h108 M60 12 v60" stroke="#a9aec8" strokeWidth="2" />
      <rect x="16" y="20" width="30" height="14" rx="2" fill="#c0c4d8" />
      <rect x="74" y="50" width="30" height="14" rx="2" fill="#c0c4d8" />
    </Base>
  );
}

/** Placas montadas em estrutura no chão, sobre grama. */
export function GroundMount({ className }: Props) {
  return (
    <Base className={className}>
      <rect x="0" y="58" width="120" height="26" rx="0" fill="#dcefd6" />
      <g transform="translate(60 36) rotate(-16)">
        <rect x="-44" y="-16" width="88" height="32" rx="2" fill="#1f2059" stroke={LARANJA} strokeWidth="2" />
        <path d="M-15 -16 v32 M14 -16 v32" stroke={LARANJA} strokeWidth="1.5" opacity="0.55" />
        <path d="M-44 0 h88" stroke={LARANJA} strokeWidth="1.5" opacity="0.55" />
      </g>
      <path d="M30 52 v14 M90 46 v20" stroke={TRACO} strokeWidth="5" strokeLinecap="round" />
    </Base>
  );
}

/** Resposta legítima para quem não sabe identificar. */
export function UnknownRoof({ className }: Props) {
  return (
    <Base className={className}>
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fontSize="44"
        fontWeight="800"
        fill={TRACO}
        opacity="0.4"
      >
        ?
      </text>
    </Base>
  );
}
