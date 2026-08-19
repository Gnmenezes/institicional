"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

export type HeroSlide = {
  eyebrow: string;
  /** Título em duas partes: a segunda sai destacada em laranja. */
  title: string;
  titleHighlight: string;
  paragraphs: string[];
};

const INTERVAL_MS = 10000;

export default function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    // Quem pediu menos animação não deve receber troca automática.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);



  return (
    <div
      ref={containerRef}
      // Parar enquanto a pessoa lê ou usa o teclado evita o texto sumir
      // no meio da leitura.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) setPaused(false);
      }}
      aria-roledescription="carrossel"
      aria-label="Soluções da Sumart"
    >
      {/* Todos os slides ocupam a mesma célula do grid, então o container fica
          sempre com a altura do maior — em qualquer largura de tela. Com
          altura mínima fixa os botões pulavam na troca, porque a altura do
          texto muda bastante entre breakpoints. */}
      <div className="grid">
        {slides.map((item, i) => {
          const active = i === index;
          return (
            <div
              key={item.eyebrow}
              className={`[grid-area:1/1] ${
                active ? "animate-hero-slide" : "invisible opacity-0"
              }`}
              aria-hidden={!active}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {item.eyebrow}
              </span>

              {/* Só o slide visível carrega o h1: dois h1 na página confundem
                  leitores de tela e o entendimento da página. */}
              {active ? (
                <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
                  {item.title} <span className="text-gradient-orange">{item.titleHighlight}</span>
                </h1>
              ) : (
                <p className="mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
                  {item.title} {item.titleHighlight}
                </p>
              )}

              <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-white/70">
                {item.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contato"
          className="shadow-glow-orange rounded-full bg-brand-orange px-8 py-4 text-center text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
        >
          Solicitar orçamento gratuito
        </Link>
        <Link
          href="#calculadora"
          className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-center text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
        >
          Calcular minha economia
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="mt-7 flex items-center gap-2.5">
          {slides.map((item, i) => (
            <button
              key={item.eyebrow}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver: ${item.eyebrow}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-brand-orange" : "w-4 bg-white/25 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
