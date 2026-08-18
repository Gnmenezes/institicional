"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect só existe no cliente; no servidor cai pro useEffect sem avisar no console.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Anima o conteúdo entrando ao rolar a página.
 *
 * O conteúdo nasce VISÍVEL. Só escondemos depois que o JS confirma que o
 * elemento está abaixo da dobra — assim, se o JS falhar ou o
 * IntersectionObserver não disparar, o texto continua na tela. Um timer de
 * segurança revela tudo caso o observer nunca responda.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Já está na tela? Deixa visível, sem animar.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setHidden(true);

    const reveal = () => setHidden(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);

    // Rede de segurança: se o observer não responder, mostra assim mesmo.
    const failsafe = window.setTimeout(reveal, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: hidden ? "0ms" : `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
