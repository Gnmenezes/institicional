"use client";

import { useEffect, useRef, useState } from "react";
import {
  CeramicRoof,
  FiberCementRoof,
  GroundMount,
  MetalRoof,
  SlabRoof,
  UnknownRoof,
} from "@/components/illustrations/RoofTypes";

/**
 * Seletor de telhado que abre imagens em vez de uma lista de nomes.
 *
 * Muita gente não sabe dizer se o telhado é de fibrocimento ou cerâmica, mas
 * reconhece o próprio de olhar. Fechado, o campo se comporta como um select
 * comum e mostra o nome escolhido; aberto, expande uma grade de ilustrações
 * dentro do próprio formulário.
 */

export type RoofOption = {
  value: string;
  short: string;
  Illustration: (props: { className?: string }) => React.ReactElement;
};

export const ROOF_OPTIONS: RoofOption[] = [
  {
    value: "Telha cerâmica (colonial ou romana)",
    short: "Cerâmica",
    Illustration: CeramicRoof,
  },
  { value: "Telha de fibrocimento", short: "Fibrocimento", Illustration: FiberCementRoof },
  { value: "Telha metálica", short: "Metálica", Illustration: MetalRoof },
  { value: "Laje", short: "Laje", Illustration: SlabRoof },
  { value: "No solo", short: "No solo", Illustration: GroundMount },
  { value: "Ainda não sei", short: "Não sei", Illustration: UnknownRoof },
];

export default function RoofPicker({
  value,
  onChange,
  error,
  id = "roofType",
}: {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  id?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora e no Esc, como um select de verdade.
  useEffect(() => {
    if (!aberto) return;
    const foraDoCampo = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", foraDoCampo);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", foraDoCampo);
      document.removeEventListener("keydown", escape);
    };
  }, [aberto]);

  return (
    <div ref={containerRef}>
      <button
        id={id}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="listbox"
        className={`mt-1.5 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left text-sm outline-none transition-colors ${
          error ? "border-red-400" : "border-black/10 focus:border-brand-orange"
        } ${aberto ? "border-brand-orange" : ""}`}
      >
        <span className={value ? "text-brand-navy" : "text-brand-navy/45"}>
          {value || "Selecione"}
        </span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-brand-navy/45 transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5z" />
        </svg>
      </button>

      {aberto && (
        <div
          role="listbox"
          aria-label="Tipo de telhado"
          className="mt-2 grid grid-cols-2 gap-2.5 rounded-xl border border-black/10 bg-white p-3"
        >
          {ROOF_OPTIONS.map((option) => {
            const escolhido = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={escolhido}
                onClick={() => {
                  onChange(option.value);
                  setAberto(false);
                }}
                title={option.value}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all hover:-translate-y-0.5 ${
                  escolhido
                    ? "border-brand-orange bg-brand-orange-light"
                    : "border-black/10 hover:border-brand-orange/50"
                }`}
              >
                <option.Illustration className="h-auto w-full" />
                <span className="text-xs font-semibold text-brand-navy">{option.short}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          Escolha o tipo de telhado para a gente dimensionar a estrutura.
        </p>
      )}
    </div>
  );
}
