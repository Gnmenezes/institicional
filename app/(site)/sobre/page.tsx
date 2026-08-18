import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import {
  CNPJ,
  LEGAL_NAME,
  PROJECTS_COMPLETED,
  getYearsInBusiness,
} from "@/lib/company";

export const metadata: Metadata = {
  title: "Sobre a Sumart",
  description:
    "Conheça a Sumart Energia Solar: especialista em sistemas híbridos com armazenamento em bateria em Juiz de Fora, Guiricema e região de Ubá (MG).",
};

const DIFERENCIAIS = [
  {
    title: "Especialistas em híbrido",
    description:
      "Projetamos sistemas com armazenamento em bateria pensados pra economia e autonomia de energia.",
  },
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
    title: "Suporte pós-instalação",
    description:
      "Continuamos disponíveis depois da instalação para manutenção e dúvidas sobre o sistema.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Sobre a Sumart"
        title="Especialistas em sistemas híbridos com bateria"
      />

      <div className="mt-8 space-y-5 text-base leading-relaxed text-brand-navy/70">
        <p>
          A Sumart Energia Solar é especializada em sistemas híbridos de energia
          solar com armazenamento em bateria — a forma mais completa de reduzir a
          conta de luz e manter energia disponível mesmo durante quedas na rede.
          Também seguimos instalando sistemas convencionais com microinversores,
          para residências, empresas, indústrias e propriedades rurais.
        </p>
        <p>
          Acompanhamos todo o processo: da visita técnica e dimensionamento do
          sistema — incluindo o banco de baterias, quando faz parte do projeto —
          até a instalação e a homologação junto à distribuidora de energia.
          Depois da instalação, seguimos disponíveis para manutenção e suporte.
        </p>
        <p>
          Estamos no mercado desde agosto de 2021 — são {getYearsInBusiness()}{" "}
          anos e {PROJECTS_COMPLETED} obras entregues em Juiz de Fora, Guiricema
          e na região do polo moveleiro de Ubá, em Minas Gerais.
        </p>

        <p className="text-sm text-brand-navy/50">
          {LEGAL_NAME} — CNPJ {CNPJ}
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
