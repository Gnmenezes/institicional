import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Sobre a Sumart",
  description:
    "Conheça a Sumart Energia Solar: instalação de painéis solares e microinversores em Juiz de Fora, Guiricema e região de Ubá (MG).",
};

const DIFERENCIAIS = [
  {
    title: "Atendimento próximo",
    description:
      "Acompanhamos cada cliente de perto, do primeiro contato até depois da instalação concluída.",
  },
  {
    title: "Transparência no orçamento",
    description:
      "Explicamos cada item do projeto para que você entenda exatamente o que está contratando.",
  },
  {
    title: "Equipe especializada",
    description: "Instalação feita por profissionais com conhecimento técnico em energia solar.",
  },
  {
    title: "Suporte pós-instalação",
    description:
      "Continuamos disponíveis depois da instalação para manutenção e dúvidas sobre o sistema.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Sobre a Sumart" title="Energia solar com atendimento próximo" />

      <div className="mt-8 space-y-5 text-base leading-relaxed text-brand-navy/70">
        <p>
          A Sumart Energia Solar trabalha com instalação de painéis solares e
          microinversores para residências, empresas e propriedades rurais.
          Nosso objetivo é ajudar cada cliente a reduzir a conta de luz com um
          sistema bem dimensionado para o seu consumo real — sem exagero de
          equipamentos e com equipamentos de qualidade.
        </p>
        <p>
          Acompanhamos todo o processo: da visita técnica e dimensionamento do
          sistema até a instalação e a homologação junto à distribuidora de
          energia. Depois da instalação, seguimos disponíveis para manutenção
          e suporte.
        </p>
        <p>
          Atendemos Juiz de Fora, Guiricema e a região do polo moveleiro de Ubá,
          em Minas Gerais.
        </p>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold text-brand-navy">Nossos diferenciais</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {DIFERENCIAIS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/5 p-6">
              <h3 className="font-semibold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 rounded-2xl bg-brand-navy-light p-8 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Quer conhecer nosso trabalho?</h2>
        <p className="mt-2 text-sm text-brand-navy/60">
          Veja alguns dos projetos que já instalamos.
        </p>
        <Link
          href="/portfolio"
          className="mt-5 inline-block rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
        >
          Ver portfólio de obras
        </Link>
      </div>
    </div>
  );
}
