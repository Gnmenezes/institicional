"use client";

import { useEffect } from "react";
import Image from "next/image";

/**
 * Seletor de telhado que abre imagens em vez de uma lista de nomes.
 *
 * Muita gente não sabe dizer se o telhado é de fibrocimento ou cerâmica, mas
 * reconhece o próprio de olhar.
 *
 * Vem partido em duas peças de propósito: o campo continua ao lado do valor
 * da conta, na grade de duas colunas, enquanto a grade de imagens ocupa a
 * largura inteira do formulário logo abaixo. Se o painel morasse dentro da
 * célula do campo, ficaria espremido em metade da largura.
 */

export type RoofOption = {
  value: string;
  short: string;
  image: string;
  alt: string;
};

export const ROOF_OPTIONS: RoofOption[] = [
  {
    value: "Telha cerâmica (colonial ou romana)",
    short: "Cerâmica",
    image: "/telhados/ceramica.jpg",
    alt: "Telhado de telhas cerâmicas curvas",
  },
  {
    value: "Telha de fibrocimento",
    short: "Fibrocimento",
    image: "/telhados/fibrocimento.jpg",
    alt: "Telhado de telhas onduladas de fibrocimento",
  },
  {
    value: "Telha metálica",
    short: "Metálica",
    image: "/telhados/metalica.jpg",
    alt: "Telhado de telhas metálicas trapezoidais",
  },
  {
    value: "Laje",
    short: "Laje",
    image: "/telhados/laje.jpg",
    alt: "Laje plana de concreto",
  },
  {
    value: "No solo",
    short: "No solo",
    image: "/telhados/solo.jpg",
    alt: "Placas solares montadas em estrutura no solo",
  },
  {
    value: "Ainda não sei",
    short: "Não sei",
    image: "/telhados/nao-sei.jpg",
    alt: "Ponto de interrogação",
  },
];

/**
 * Fecha ao clicar fora e no Esc, como um select de verdade.
 *
 * O campo e a grade vivem em pontos diferentes da árvore, então o que define
 * "dentro" é o atributo `data-roof-picker`, e não um ref só.
 */
export function useRoofPickerDismiss(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const clique = (e: MouseEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (!alvo?.closest("[data-roof-picker]")) close();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", clique);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", clique);
      document.removeEventListener("keydown", tecla);
    };
  }, [open, close]);
}

/** O campo em si — fica onde um select comum ficaria. */
export function RoofTrigger({
  value,
  open,
  onToggle,
  error,
  id = "roofType",
}: {
  value: string;
  open: boolean;
  onToggle: () => void;
  error?: boolean;
  id?: string;
}) {
  return (
    <button
      id={id}
      data-roof-picker
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls="roof-options"
      className={`mt-1.5 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm outline-none transition-colors ${
        error ? "border-red-400" : "border-black/10 focus:border-brand-orange"
      } ${open ? "border-brand-orange" : ""}`}
    >
      <span className={value ? "text-brand-navy" : "text-brand-navy/45"}>
        {value || "Selecione"}
      </span>
      <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 shrink-0 text-brand-navy/45 transition-transform ${
          open ? "rotate-180" : ""
        }`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.5 7.5 10 12l4.5-4.5z" />
      </svg>
    </button>
  );
}

/** A grade de imagens — ocupa a largura inteira do formulário. */
export function RoofOptions({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      id="roof-options"
      data-roof-picker
      role="listbox"
      aria-label="Tipo de telhado"
      // auto-fit em vez de número fixo de colunas: o formulário aparece com
      // 824px dentro da calculadora e 510px na página de contato.
      className="grid gap-2.5 rounded-xl border border-black/10 bg-white p-3 [grid-template-columns:repeat(auto-fit,minmax(80px,1fr))]"
    >
      {ROOF_OPTIONS.map((option) => {
        const escolhido = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={escolhido}
            onClick={() => onChange(option.value)}
            title={option.value}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all hover:-translate-y-0.5 ${
              escolhido
                ? "border-brand-orange bg-brand-orange-light"
                : "border-black/10 hover:border-brand-orange/50"
            }`}
          >
            <span className="relative block aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={option.image}
                alt={option.alt}
                fill
                sizes="140px"
                className="object-cover"
              />
            </span>
            <span className="text-xs font-semibold text-brand-navy">{option.short}</span>
          </button>
        );
      })}
    </div>
  );
}
