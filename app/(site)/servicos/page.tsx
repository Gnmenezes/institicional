import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";
import HybridSystemIllustration from "@/components/illustrations/HybridSystemIllustration";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sistemas híbridos de energia solar com armazenamento em bateria, instalação residencial, comercial, industrial e rural, além de manutenção e monitoramento.",
};

const SERVICES = [
  {
    title: "Sistemas híbridos com bateria",
    highlight: true,
    description:
      "A solução mais completa: gera energia solar, armazena o excedente em bateria e usa quando você precisar — inclusive durante quedas na rede elétrica. Ideal para quem quer economia e mais autonomia.",
    items: [
      "Armazenamento em bateria para uso a qualquer hora",
      "Energia disponível mesmo em quedas de energia",
      "Dimensionamento do banco de baterias conforme sua necessidade",
      "Instalação por equipe especializada em sistemas híbridos",
    ],
  },
  {
    title: "Instalação residencial",
    description:
      "Projeto e instalação de sistemas fotovoltaicos para casas e apartamentos, híbridos com bateria ou convencionais com microinversores, dimensionados para o seu consumo médio de energia.",
    items: [
      "Visita técnica e análise do telhado",
      "Dimensionamento do sistema conforme consumo",
      "Instalação híbrida (com bateria) ou convencional (microinversores)",
      "Homologação junto à distribuidora de energia",
    ],
  },
  {
    title: "Comercial e industrial",
    description:
      "Sistemas de maior porte para empresas, indústrias e comércios que buscam reduzir custos de energia, ganhar previsibilidade no orçamento e, com bateria, evitar perdas em quedas de energia.",
    items: [
      "Estudo de viabilidade e retorno do investimento",
      "Projetos de médio e grande porte, com ou sem bateria",
      "Instalação em telhados, estruturas metálicas ou solo",
      "Acompanhamento da geração de energia",
    ],
  },
  {
    title: "Rural",
    description:
      "Soluções para propriedades rurais, incluindo geração de energia para a sede, sistemas híbridos com bateria e bombeamento solar.",
    items: [
      "Geração de energia para propriedades remotas",
      "Sistemas híbridos para regiões com fornecimento instável",
      "Bombeamento solar para irrigação e abastecimento",
      "Sistemas adaptados à realidade do campo",
    ],
  },
  {
    title: "Manutenção e monitoramento",
    description:
      "Acompanhamento pós-instalação para garantir que o seu sistema — híbrido ou convencional — continue gerando e armazenando energia com o desempenho esperado.",
    items: [
      "Revisão periódica de painéis, inversores e baterias",
      "Monitoramento de geração e armazenamento de energia",
      "Suporte técnico em caso de falhas",
      "Troca ou upgrade de microinversores e baterias",
    ],
  },
];

export default async function ServicosPage() {
  const videos = await getVideos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Serviços"
        title="Sistemas híbridos e soluções sob medida"
        description="Do armazenamento em bateria ao suporte pós-venda, cuidamos de todas as etapas do seu sistema de energia solar."
      />

      <div className="mt-12 space-y-6">
        {SERVICES.map((service) => (
          <div
            key={service.title}
            className={`grid gap-6 rounded-2xl border p-8 md:grid-cols-[1fr_1.4fr] ${
              service.highlight
                ? "border-brand-orange/30 bg-brand-orange-light"
                : "border-black/5"
            }`}
          >
            <div>
              {service.highlight && (
                <>
                  <span className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                    Em destaque
                  </span>
                  <HybridSystemIllustration className="my-3 h-28 w-auto" />
                </>
              )}
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

      <div id="elevador" className="mt-16 scroll-mt-24 rounded-2xl border border-brand-orange/30 bg-brand-orange-light p-8 sm:p-10">
        <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
          Nosso diferencial
        </span>
        <h2 className="mt-3 text-2xl font-bold text-brand-navy">
          Instalação com elevador de placas
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-navy/70">
          Usamos um elevador próprio para subir os painéis solares até o telhado —
          mais segurança para a equipe, menos risco de dano aos equipamentos durante
          o transporte, e uma instalação mais ágil. É um jeito de trabalhar que poucas
          instaladoras da região oferecem.
        </p>

        {videos.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id}>
                <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
                <p className="mt-2 text-sm font-medium text-brand-navy">{video.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-brand-navy/50">
            Vídeos do elevador em ação chegando em breve.
          </p>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-brand-navy-light p-10 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">
          Não sabe se o sistema híbrido é pra você?
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
