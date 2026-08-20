"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Botão que rola suavemente até uma seção da própria página.
 *
 * Não usa <Link>: o roteador do Next faz o próprio scroll e ignora o
 * scroll-behavior do CSS, então o clique dava um salto seco.
 *
 * Com `floatWhenPassed`, quando a pessoa passa do botão sem clicar ele se
 * destaca e acompanha o rodapé da tela — some de volta quando ela chega ao
 * destino, porque ali o botão perdeu a função.
 */
export default function ScrollCta({
  targetId,
  children,
  className,
  floatWhenPassed = false,
  floatingLabel,
  offset = 80,
}: {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  floatWhenPassed?: boolean;
  /** Texto do botão flutuante, quando faz sentido ser mais curto. */
  floatingLabel?: React.ReactNode;
  /** Folga acima do destino, em pixels. O padrão livra o cabeçalho fixo. */
  offset?: number;
}) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [passed, setPassed] = useState(false);
  const [arrived, setArrived] = useState(false);
  // O botão flutuante vai para o body por portal: o Reveal que envolve a
  // seção aplica translate, e um transform em qualquer ancestral faz o
  // position:fixed se ancorar nele em vez de na janela.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function scrollToTarget(event: React.MouseEvent) {
    // Deixa passar cliques com modificador (abrir em nova aba, por exemplo).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();

    // Animação própria em vez de scrollIntoView({behavior:"smooth"}): o CSS
    // define scroll-behavior: smooth no html, e com isso cada window.scrollTo
    // vira uma nova rolagem suave que briga com a anterior. Aqui cada quadro
    // salta de propósito ("instant") e a suavidade vem da curva.
    const destino = Math.max(
      0,
      Math.round(target.getBoundingClientRect().top + window.scrollY - offset)
    );
    const inicio = window.scrollY;
    const distancia = destino - inicio;
    if (Math.abs(distancia) < 4) return;

    history.replaceState(null, "", `#${targetId}`);

    // Quem pede menos movimento recebe uma rolagem curta, e não um salto:
    // sem nenhuma animação a pessoa perde a noção de onde a página foi parar.
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duracao = reduzido
      ? 260
      : Math.min(1400, Math.max(550, Math.abs(distancia) * 0.22));

    let cancelado = false;
    const cancelar = () => {
      cancelado = true;
    };
    // Se a pessoa rolar no meio do caminho, a animação sai do caminho dela.
    window.addEventListener("wheel", cancelar, { passive: true, once: true });
    window.addEventListener("touchstart", cancelar, { passive: true, once: true });

    const partida = performance.now();
    const suavizar = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function quadro(agora: number) {
      if (cancelado) return;
      const t = Math.min(1, (agora - partida) / duracao);
      window.scrollTo({
        top: inicio + distancia * suavizar(t),
        behavior: "instant" as ScrollBehavior,
      });
      if (t < 1) requestAnimationFrame(quadro);
      else {
        window.removeEventListener("wheel", cancelar);
        window.removeEventListener("touchstart", cancelar);
      }
    }
    requestAnimationFrame(quadro);
  }

  useEffect(() => {
    if (!floatWhenPassed) return;
    const anchor = anchorRef.current;
    const target = document.getElementById(targetId);
    if (!anchor || !target) return;

    // Só flutua quando o botão saiu por cima — sair por baixo é a pessoa
    // ainda nem ter chegado nele.
    const watchAnchor = new IntersectionObserver(
      ([entry]) => setPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    const watchTarget = new IntersectionObserver(
      ([entry]) => setArrived(entry.isIntersecting),
      { threshold: 0 }
    );

    watchAnchor.observe(anchor);
    watchTarget.observe(target);
    return () => {
      watchAnchor.disconnect();
      watchTarget.disconnect();
    };
  }, [floatWhenPassed, targetId]);

  const floating = floatWhenPassed && passed && !arrived;

  return (
    <>
      <a ref={anchorRef} href={`#${targetId}`} onClick={scrollToTarget} className={className}>
        {children}
      </a>

      {floatWhenPassed && mounted && createPortal(
        <div
          // Deslocado para a esquerda no mobile: o botão do WhatsApp ocupa o
          // canto direito e os dois ficariam encostados.
          className={`fixed bottom-5 left-1/2 z-40 -translate-x-[60%] transition-all duration-300 sm:-translate-x-1/2 ${
            floating
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-16 opacity-0"
          }`}
          aria-hidden={!floating}
        >
          <a
            href={`#${targetId}`}
            onClick={scrollToTarget}
            data-floating="true"
            tabIndex={floating ? undefined : -1}
            className="shadow-glow-orange block whitespace-nowrap rounded-full bg-brand-orange px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand-orange-dark sm:px-7"
          >
            {floatingLabel ?? children}
          </a>
        </div>,
        document.body
      )}
    </>
  );
}
