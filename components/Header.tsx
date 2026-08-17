"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo/sumart-icon.png"
            alt="Sumart Energia Solar"
            width={44}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-brand-navy">
              SUMART
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-orange">
              energia solar
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-navy/80 transition-colors hover:text-brand-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <WhatsAppButton className="rounded-full border border-brand-navy/15 px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
            WhatsApp
          </WhatsAppButton>
          <Link
            href="/contato"
            className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
          >
            Solicitar orçamento
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-brand-navy hover:bg-brand-navy-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <WhatsAppButton className="rounded-full border border-brand-navy/15 px-5 py-3 text-center text-sm font-semibold text-brand-navy">
              Falar no WhatsApp
            </WhatsAppButton>
            <Link
              href="/contato"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand-orange px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Solicitar orçamento
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
