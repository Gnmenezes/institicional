"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect roda antes da pintura, mas só existe no cliente.
const useAntesDePintar = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Número que conta até o valor final quando entra na tela.
 *
 * Serve para a barra de credibilidade: o movimento puxa o olho justamente
 * para a prova de que a empresa entrega. O número é o conteúdo, então quem
 * pede menos movimento recebe o valor final direto — sem animação, mas sem
 * perder a informação.
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1100,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useAntesDePintar(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Se o número já está na tela quando o JS assume, ele fica quieto.
    //
    // O HTML do servidor traz o valor final — é o certo para busca e para
    // quem não tem JS. Zerar depois faria a pessoa ver o total, ele cair
    // para zero e subir de novo: medi 676ms desse piscar. Animar só o que
    // chega rolando resolve, e é onde a contagem serve para algo, porque aí
    // ela puxa o olho no momento em que o número aparece.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setShown(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const partida = performance.now();
        const suavizar = (t: number) => 1 - Math.pow(1 - t, 3);
        const quadro = (agora: number) => {
          const t = Math.min(1, (agora - partida) / durationMs);
          if (t < 1) {
            setShown(Math.round(value * suavizar(t)));
            requestAnimationFrame(quadro);
          } else {
            setShown(value);
          }
        };
        requestAnimationFrame(quadro);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
