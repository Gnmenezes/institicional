import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Instalação de energia solar residencial, comercial/industrial e rural, além de manutenção e monitoramento de sistemas fotovoltaicos.",
};

const SERVICES = [
  {
    title: "Instalação residencial",
    description:
      "Projeto e instalação de sistemas fotovoltaicos para casas e apartamentos, dimensionados para o seu consumo médio de energia, reduzindo a conta de luz mês a mês.",
    items: [
      "Visita técnica e análise do telhado",
      "Dimensionamento do sistema conforme consumo",
      "Instalação de painéis e microinversores",
      "Homologação junto à distribuidora de energia",
    ],
  },
  {
    title: "Comercial e industrial",
    description:
      "Sistemas de maior porte para empresas, indústrias e comércios que buscam reduzir custos de energia e ganhar previsibilidade no orçamento.",
    items: [
      "Estudo de viabilidade e retorno do investimento",
      "Projetos de médio e grande porte",
      "Instalação em telhados, estruturas metálicas ou solo",
      "Acompanhamento da geração de energia",
    ],
  },
  {
    title: "Rural",
    description:
      "Soluções para propriedades rurais, incluindo geração de energia para a sede e sistemas de bombeamento solar.",
    items: [
      "Geração de energia para propriedades remotas",
      "Bombeamento solar para irrigação e abastecimento",
      "Sistemas adaptados à realidade do campo",
    ],
  },
  {
    title: "Manutenção e monitoramento",
    description:
      "Acompanhamento pós-instalação para garantir que o seu sistema continue gerando energia com o desempenho esperado.",
    items: [
      "Revisão periódica de painéis e inversores",
      "Monitoramento de geração de energia",
      "Suporte técnico em caso de falhas",
      "Troca ou upgrade de microinversores",
    ],
  },
];

export default function ServicosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Serviços"
        title="Energia solar para cada tipo de projeto"
        description="Da instalação residencial ao suporte pós-venda, cuidamos de todas as etapas do seu sistema fotovoltaico."
      />

      <div className="mt-12 space-y-6">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className="grid gap-6 rounded-2xl border border-black/5 p-8 md:grid-cols-[1fr_1.4fr]"
          >
            <div>
              <h2 className="text-xl font-bold text-brand-navy">{service.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-navy/60">
                {service.description}
              </p>
            </div>
            <ul className="grid gap-2 self-center sm:grid-cols-2">
              {service.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-navy/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-brand-navy-light p-10 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">
          Não sabe qual serviço é o ideal para você?
        </h2>
        <p className="max-w-xl text-sm text-brand-navy/60">
          Fale com a gente e receba uma recomendação personalizada, sem compromisso.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contato"
            className="rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
          >
            Solicitar orçamento gratuito
          </Link>
          <WhatsAppButton className="rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
            Falar no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
