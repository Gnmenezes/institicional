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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-brand-navy-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src="/logo/sumart-logo-reverse.png"
            alt="Sumart Energia Solar"
            width={220}
            height={72}
            className="h-14 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Instalação de painéis solares e microinversores para residências,
            empresas e propriedades rurais em Juiz de Fora, Guiricema e região
            do polo moveleiro de Ubá (MG).
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/60 hover:text-brand-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contato
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Juiz de Fora, Guiricema e região de Ubá — MG</li>
            <li>
              <WhatsAppButton className="hover:text-brand-orange">
                Falar no WhatsApp
              </WhatsAppButton>
            </li>
            <li>
              <a href="mailto:contato@sumart.com.br" className="hover:text-brand-orange">
                contato@sumart.com.br
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/40 sm:px-6">
        © {year} Sumart Energia Solar. Todos os direitos reservados.
      </div>
    </footer>
  );
}
