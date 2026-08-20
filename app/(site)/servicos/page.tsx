import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import WhatsAppButton from "@/components/WhatsAppButton";
import HybridSystemIllustration from "@/components/illustrations/HybridSystemIllustration";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { getVideos } from "@/lib/data";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import {
  INSTALLED_KWP_FLOOR,
  PROJECTS_FLOOR,
  RESPONSE_TIME,
  getYearsInBusiness,
} from "@/lib/company";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Sistemas híbridos de energia solar com armazenamento em bateria, instalação residencial, comercial, industrial e rural, além de manutenção e monitoramento.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    images: ["/opengraph-image"],
    url: "/servicos",
    title: "Serviços | Sumart Energia Solar",
    description:
      "Sistemas híbridos de energia solar com armazenamento em bateria, instalação residencial, comercial, industrial e rural, além de manutenção e monitoramento.",
  },
};

/**
 * Perfis de cliente — e não tipos de sistema.
 *
 * A versão anterior misturava os dois eixos: "sistemas híbridos" aparecia como
 * alternativa a "instalação residencial", mas uma casa pode ter híbrido. Aqui a
 * pessoa se localiza pelo que ela é, e a escolha entre híbrido e on-grid
 * aparece uma vez só, antes da lista.
 */
const AUDIENCES = [
  {
    title: "Para a sua casa",
    description:
      "Casas e apartamentos, com bateria ou sem. A conta cai já na primeira fatura depois da instalação.",
    items: [
      "Visita técnica e análise do telhado",
      "Dimensionamento pelo seu histórico de consumo",
      "Homologação junto à distribuidora",
    ],
  },
  {
    title: "Para a sua empresa",
    description:
      "Comércio, indústria e prestadores de serviço. Além da economia, entra previsibilidade de custo no orçamento.",
    items: [
      "Estudo de viabilidade e retorno do investimento",
      "Projetos de médio e grande porte",
      "Telhado, estrutura metálica ou solo",
    ],
  },
  {
    title: "Para a sua propriedade rural",
    description:
      "Sede, irrigação e abastecimento — inclusive onde o fornecimento da rede é instável.",
    items: [
      "Geração para propriedades remotas",
      "Bombeamento solar para irrigação",
      "Híbrido para regiões com queda frequente",
    ],
  },
];

export default async function ServicosPage() {
  const videos = await getVideos();
  const stats = [
    { count: PROJECTS_FLOOR, prefix: "+", label: "obras entregues" },
    { count: INSTALLED_KWP_FLOOR, prefix: "+", label: "kWp instalados" },
    { count: getYearsInBusiness(), suffix: " anos", label: "de mercado" },
    { text: RESPONSE_TIME, label: "para responder" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Serviços"
          title="O que a gente faz pelo seu telhado"
          description="Do primeiro cálculo à homologação na distribuidora — e continuamos por perto depois que o sistema está gerando."
          wide
        />
      </Reveal>

      {/* Quem chega aqui pelo Google não passou pela home: os números da
          empresa precisam existir nesta página também. */}
      <div className="mt-9 grid grid-cols-2 gap-6 border-y border-black/5 py-7 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90}>
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-brand-navy sm:text-3xl">
                {stat.count !== undefined ? (
                  <CountUp value={stat.count} prefix={stat.prefix} suffix={stat.suffix} />
                ) : (
                  stat.text
                )}
              </span>
              <span className="mt-0.5 block text-xs text-brand-navy/55">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ---------- A ESCOLHA ---------- */}
      <Reveal>
        <div className="mt-14 grid items-center gap-8 rounded-3xl border border-brand-orange/30 bg-brand-orange-light p-8 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Nossa especialidade
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-brand-navy sm:text-3xl">
              Com bateria ou sem: os dois somos nós
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-navy/75 sm:text-base">
              O <strong className="font-semibold text-brand-navy">on-grid</strong> é o
              caminho de menor investimento e o que se paga mais rápido. O{" "}
              <strong className="font-semibold text-brand-navy">híbrido</strong> guarda
              energia em bateria e mantém sua casa funcionando quando a rede cai — é a
              nossa especialidade, e o que poucas instaladoras da região dominam.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-navy/60">
              Qual faz mais sentido depende do seu consumo e de quanto a falta de luz
              te atrapalha. A gente decide isso junto, na visita técnica.
            </p>
            <Link
              href="/#calculadora"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:gap-2.5"
            >
              Ver quanto eu economizaria
              <span className="transition-all">→</span>
            </Link>
          </div>
          <HybridSystemIllustration className="mx-auto h-36 w-auto md:h-44" />
        </div>
      </Reveal>

      {/* ---------- DIFERENCIAL ---------- */}
      <Reveal>
        <div id="elevador" className="mt-14 scroll-mt-24">
          <SectionHeading
            eyebrow="Nosso diferencial"
            title="Instalação com elevador de placas"
            description="Um elevador próprio sobe os painéis até o telhado. Menos risco de quebrar suas telhas, menos risco de dano ao equipamento e obra mais rápida — um jeito de trabalhar que poucas instaladoras da região oferecem."
            wide
          />

          {videos.length > 0 ? (
            <div className={`mt-8 grid gap-6 ${videos.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-xs"}`}>
              {videos.map((video) => (
                <div key={video.id}>
                  <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
                  <p className="mt-2 text-sm font-medium text-brand-navy">{video.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-brand-navy/50">
              Vídeos do elevador em ação chegando em breve.
            </p>
          )}
        </div>
      </Reveal>

      {/* ---------- PARA QUEM ---------- */}
      <Reveal>
        <div className="mt-14">
          <SectionHeading
            eyebrow="Para quem instalamos"
            title="Cada telhado tem um projeto diferente"
            wide
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {AUDIENCES.map((audience) => (
              <div
                key={audience.title}
                className="card-lift shadow-brand flex h-full flex-col rounded-2xl bg-white p-7"
              >
                <h3 className="text-lg font-bold text-brand-navy">{audience.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                  {audience.description}
                </p>
                <ul className="mt-5 space-y-2 border-t border-black/5 pt-5">
                  {audience.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-brand-navy/75"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---------- DEPOIS DA OBRA ---------- */}
      <Reveal>
        <div className="mt-14 rounded-2xl bg-brand-navy-light p-8 sm:p-10">
          <h2 className="text-xl font-extrabold text-brand-navy sm:text-2xl">
            A gente não some depois que a obra acaba
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-navy/70">
            Seguimos disponíveis para revisão de painéis, inversores e baterias,
            acompanhamento da geração, suporte quando algo falha e upgrade de
            equipamento quando seu consumo cresce.
          </p>
        </div>
      </Reveal>

      {/* ---------- FECHAMENTO ---------- */}
      <Reveal>
        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-black/5 p-10 text-center">
          <h2 className="text-2xl font-extrabold text-brand-orange sm:text-3xl">
            Vamos ver os números do seu caso?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-brand-navy/65">
            A visita técnica e o estudo de economia são sem custo e sem compromisso —
            seja para on-grid ou híbrido. Se preferir começar sozinho, a calculadora dá
            uma estimativa em segundos.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="shadow-glow-orange rounded-full bg-brand-orange px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
            >
              Solicitar meu orçamento
            </Link>
            <Link
              href="/#calculadora"
              className="rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              Calcular minha economia
            </Link>
            <WhatsAppButton className="rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
