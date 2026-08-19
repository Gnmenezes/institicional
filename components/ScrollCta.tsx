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
}: {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  floatWhenPassed?: boolean;
  /** Texto do botão flutuante, quando faz sentido ser mais curto. */
  floatingLabel?: React.ReactNode;
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    // Mantém o endereço compartilhável sem provocar um segundo salto.
    history.replaceState(null, "", `#${targetId}`);
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
