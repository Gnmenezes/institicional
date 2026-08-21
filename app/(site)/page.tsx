import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroCarousel from "@/components/HeroCarousel";
import ScrollCta from "@/components/ScrollCta";
import CountUp from "@/components/CountUp";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Reveal from "@/components/Reveal";
import {
  SunPanelIcon,
  BatteryIcon,
  HomeUsageIcon,
} from "@/components/illustrations/SolarIcons";
import {
  getCalculatorCities,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getHeroPhotos,
  getVideos,
} from "@/lib/data";
import {
  INSTALLED_KWP_FLOOR,
  PROJECTS_FLOOR,
  RESPONSE_TIME,
  getYearsInBusiness,
} from "@/lib/company";
import { getFinancingRate } from "@/lib/settings";
import SavingsCalculator from "@/components/SavingsCalculator";
import JsonLd from "@/components/JsonLd";
import { FAQ, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Energia Solar em Juiz de Fora e Região",
  description:
    "Sistema de energia solar com bateria que mantém sua casa ligada na queda de energia, ou on-grid com microinversores, o de menor investimento. Simule sua economia e peça orçamento sem custo em Juiz de Fora, Guiricema e região de Ubá.",
  alternates: { canonical: "/" },
};

const HERO_TRUST = [
  "Equipe capacitada",
  "Projeto sob medida",
  "Suporte pós-instalação",
];

const PAIN_MOMENTS = [
  {
    image: "/momentos/jogo.jpg",
    alt: "Torcedores no escuro durante uma queda de energia no meio do jogo",
    title: "O jogo decisivo",
    text: "Aquele jogo que não pode ficar pela metade.",
  },
  {
    image: "/momentos/amigos.jpg",
    alt: "Amigos reunidos à luz de vela e lanterna após a energia cair",
    title: "O encontro com amigos",
    text: "A resenha não pode parar por falta de luz.",
  },
  {
    image: "/momentos/natal.jpg",
    alt: "Família na ceia de Natal iluminada apenas por velas e lanterna",
    title: "A ceia de Natal",
    text: "A família reunida merece uma noite sem sustos.",
  },
  {
    image: "/momentos/ano-novo.jpg",
    alt: "Festa de Ano Novo no escuro depois de uma queda de energia",
    title: "A virada de Ano Novo",
    text: "A contagem regressiva não espera a energia voltar.",
  },
];

// A dor de quem chega pela conta cara, e nao pela queda de energia: o
// dinheiro que sai todo ano e nao volta em nada.
const UNSPENT_DREAMS = [
  {
    title: "A reforma que fica pra depois",
    text: "Aquele cômodo que você adiaria mais um ano — de novo.",
  },
  {
    title: "A viagem em família",
    text: "A que todo mundo quer e nunca cabe no orçamento.",
  },
  {
    title: "A troca do carro",
    text: "A entrada que parece longe, mas é menor do que você imagina.",
  },
  {
    title: "A reserva que nunca sobra",
    text: "O dinheiro guardado que dá tranquilidade pro resto.",
  },
];

const INVESTMENT_POINTS = [
  {
    title: "Economia desde a primeira conta",
    text: "Nos dois sistemas, sua conta de luz já cai na primeira fatura depois da instalação.",
  },
  {
    title: "O on-grid se paga antes",
    text: "É o de menor investimento, então a economia acumulada cobre o valor aplicado mais rápido.",
  },
  {
    title: "O híbrido não deixa no escuro",
    text: "Custa um pouco mais por causa da bateria — e em troca sua casa continua funcionando quando a rede cai.",
  },
  {
    title: "Dá para financiar",
    text: "A economia na conta ajuda a cobrir a parcela. O valor depende de análise de crédito — simule o seu caso.",
  },
];

// Faixas reais de garantia de fábrica: variam conforme o equipamento
// escolhido, por isso o site mostra o intervalo e remete à proposta.
const WARRANTIES = [
  {
    term: "12 a 15 anos",
    title: "Módulos fotovoltaicos",
    text: "Garantia de fábrica dos painéis, conforme o modelo definido no projeto.",
  },
  {
    term: "5 a 25 anos",
    title: "Inversores",
    text: "O prazo varia bastante entre fabricantes — a gente explica a diferença antes de você escolher.",
  },
  {
    term: "Pós-obra",
    title: "Suporte da Sumart",
    text: "Seguimos disponíveis para manutenção, revisão e dúvidas depois da instalação.",
  },
];

const SYSTEM_COMPARISON = [
  {
    name: "On-Grid (convencional)",
    tagline: "Conectado direto à rede, com microinversores",
    highlight: false,
    steps: [
      { label: "Gera", Icon: SunPanelIcon },
      { label: "Usa", Icon: HomeUsageIcon },
    ],
    pros: [
      "Investimento inicial menor",
      "Reduz bastante a conta de luz",
      "Instalação mais simples",
      "Ótimo custo-benefício pra quem não sofre com quedas de energia",
    ],
    cons: [
      "Desliga junto com a rede em caso de queda de energia, por segurança",
    ],
  },
  {
    name: "Híbrido (com bateria)",
    tagline: "Gera, armazena em bateria e continua funcionando sem rede",
    highlight: true,
    steps: [
      { label: "Gera", Icon: SunPanelIcon },
      { label: "Armazena", Icon: BatteryIcon },
      { label: "Usa", Icon: HomeUsageIcon },
    ],
    pros: [
      "Continua com energia durante quedas na rede",
      "Armazena o excedente gerado para usar depois",
      "Mais economia e mais autonomia",
      "Ideal pra quem sofre com quedas de energia frequentes",
    ],
    cons: [
      "Investimento inicial um pouco maior, por causa do banco de baterias",
    ],
  },
];

const SERVICES = [
  {
    title: "Residencial",
    description:
      "Sistemas fotovoltaicos para casas e apartamentos, reduzindo sua conta de luz.",
  },
  {
    title: "Comercial e industrial",
    description:
      "Projetos para empresas, indústrias e comércios com maior demanda de energia.",
  },
  {
    title: "Rural",
    description:
      "Soluções para propriedades rurais, incluindo bombeamento solar e geração remota.",
  },
];

export default async function HomePage() {
  const yearsInBusiness = getYearsInBusiness();
  const CREDIBILITY_STATS = [
    { count: PROJECTS_FLOOR, prefix: "+", label: "obras entregues na região" },
    { count: INSTALLED_KWP_FLOOR, prefix: "+", label: "kWp de potência instalada" },
    { count: yearsInBusiness, suffix: " anos", label: "de mercado, desde 2021" },
    { text: RESPONSE_TIME, label: "é o nosso prazo de resposta" },
  ];

  const [
    featuredProjects,
    featuredTestimonials,
    heroPhotos,
    videos,
    financingRate,
    calculatorCities,
  ] = await Promise.all([
    getFeaturedProjects(3),
    getFeaturedTestimonials(3),
    getHeroPhotos(),
    getVideos(),
    getFinancingRate(),
    getCalculatorCities(),
  ]);
  const teaserVideo = videos[0];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-brand-navy-dark">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-40 h-[30rem] w-[30rem] rounded-full bg-brand-orange/25 blur-[130px]" />
          <div className="absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-brand-navy/70 blur-[130px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-14">
          <div>
            {/* Uma abertura só, em forma de pergunta. Antes eram dois
                slides, um para cada tipo de sistema — quem chegava tinha que
                escolher um lado antes de saber que os lados existiam. A
                pergunta faz o trabalho oposto: dá o contraste em duas frases
                e manda a pessoa descobrir de qual lado ela está. */}
            <div className="animate-hero-slide">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Bem-vindo à Sumart
              </span>

              <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
                Qual sistema de energia solar{" "}
                <span className="text-gradient-orange">é o certo pra sua casa?</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Um deles derruba sua conta de luz todo mês. O outro faz isso e
                ainda mantém sua casa acesa quando a energia cai. Vamos
                descobrir qual é o seu?
              </p>

              {/* A calculadora vem primeiro e em destaque: quem aceita o
                  convite da pergunta acima quer descobrir o próprio caso,
                  não pedir orçamento ainda. Quem já decidiu tem o orçamento
                  ao lado — e a própria calculadora termina no formulário. */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ScrollCta
                  targetId="calculadora"
                  className="shadow-glow-orange rounded-full bg-brand-orange px-8 py-4 text-center text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
                >
                  Calcular minha economia
                </ScrollCta>
                <Link
                  href="/contato"
                  className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-center text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  Solicitar orçamento
                </Link>
              </div>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {HERO_TRUST.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-brand-orange"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8.2 13.4 5.6 10.8l-1.2 1.2 3.8 3.8 8-8-1.2-1.2z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {heroPhotos.length > 0 && (
            // A largura precisa morar neste wrapper: o carrossel usa w-full e,
            // sem isso, o item do grid encolhe pra zero e as fotos somem.
            <div className="relative w-full max-w-sm justify-self-center md:justify-self-end">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-brand-orange/10 blur-2xl" />
              <HeroCarousel
                className="relative shadow-2xl"
                photos={heroPhotos.map((photo) => ({
                  src: photo.url,
                  alt: photo.caption,
                  caption: photo.caption,
                }))}
              />
            </div>
          )}
        </div>
      </section>

      {/* ---------- PROVA DE CREDIBILIDADE ---------- */}
      <section className="border-b border-black/5 bg-white py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4">
          {CREDIBILITY_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                {stat.count !== undefined ? (
                  <CountUp value={stat.count} prefix={stat.prefix} suffix={stat.suffix} />
                ) : (
                  stat.text
                )}
              </span>
              <span className="mt-1 block text-xs leading-snug text-brand-navy/55 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- A DOR ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="A dor é real"
              title="Os momentos que o sistema híbrido não deixa você perder"
              description="É nessas horas que a falta de energia dói mais — e é exatamente nelas que a bateria mantém sua casa funcionando."
              center
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {PAIN_MOMENTS.map((moment, i) => (
              <Reveal key={moment.title} delay={i * 90}>
                <div className="card-lift shadow-brand-lg group relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-navy-dark">
                  <Image
                    src={moment.image}
                    alt={moment.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 25vw"
                  />
                  {/* Escurece a base pra garantir leitura do texto sobre a foto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/55 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6">
                    <h3 className="text-sm font-bold leading-snug text-white sm:text-base">
                      {moment.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/70 sm:mt-1.5 sm:text-sm">
                      {moment.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- A ECONOMIA ---------- */}
      <section className="bg-brand-navy-light py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="O outro lado da conta"
              title="O que esse dinheiro poderia ter sido?"
              description="Uma conta de R$ 600 por mês são R$ 7.200 por ano. Em cinco anos, R$ 36.000 entregues à concessionária — dinheiro que sai da sua casa todo mês e não volta em nada."
              center
              wide
            />
          </Reveal>

          <div className="mx-auto mt-9 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UNSPENT_DREAMS.map((dream, i) => (
              <Reveal key={dream.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-brand-navy/10 bg-white/60 p-6">
                  <h3 className="text-base font-bold text-brand-navy">
                    {dream.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                    {dream.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={440}>
            <p className="mx-auto mt-9 max-w-2xl text-center text-lg font-semibold leading-relaxed text-brand-navy">
              A energia solar não faz esse dinheiro aparecer.{" "}
              <span className="text-brand-orange">
                Ela só impede que ele continue saindo.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- COMPARAÇÃO ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Qual é o ideal pra você?"
              title="Híbrido ou On-Grid"
              description="Cada sistema tem suas vantagens. Veja a diferença e escolha com a gente o que faz mais sentido pro seu consumo e orçamento."
              center
            />
          </Reveal>

          <div className="mx-auto mt-9 grid max-w-4xl items-start gap-6 sm:grid-cols-2">
            {SYSTEM_COMPARISON.map((system, i) => (
              <Reveal key={system.name} delay={i * 120}>
                <div
                  className={`relative h-full overflow-hidden rounded-3xl bg-white p-8 ${
                    system.highlight
                      ? "shadow-brand-lg ring-2 ring-brand-orange/40"
                      : "shadow-brand border border-black/5"
                  }`}
                >
                  {system.highlight && (
                    <>
                      <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-orange to-amber-400" />
                      <span className="absolute right-6 top-6 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                        Recomendado
                      </span>
                    </>
                  )}

                  <h3 className="mt-2 text-xl font-extrabold text-brand-navy">
                    {system.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-brand-navy/50">
                    {system.tagline}
                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-2xl bg-brand-navy-light/70 p-4">
                    {system.steps.map((step, index) => (
                      <div
                        key={step.label}
                        className="flex flex-1 items-center gap-2"
                      >
                        <div className="flex flex-1 flex-col items-center gap-1.5">
                          <step.Icon className="h-9 w-9" />
                          <span className="text-[11px] font-semibold text-brand-navy/70">
                            {step.label}
                          </span>
                        </div>
                        {index < system.steps.length - 1 && (
                          <span className="mb-5 text-lg text-brand-orange/40">
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {system.pros.map((pro) => (
                      <li
                        key={pro}
                        className="flex items-start gap-2.5 text-sm text-brand-navy/80"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8.2 13.4 5.6 10.8l-1.2 1.2 3.8 3.8 8-8-1.2-1.2z" />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 space-y-2 border-t border-black/5 pt-5">
                    {system.cons.map((con) => (
                      <li
                        key={con}
                        className="flex items-start gap-2.5 text-sm text-brand-navy/50"
                      >
                        <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-brand-navy/20" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-9 text-center">
              <p className="mx-auto max-w-2xl text-sm text-brand-navy/60">
                Não sabe qual dos dois combina com você? Comece vendo quanto
                economizaria — depois a gente decide junto.
              </p>
              <ScrollCta
                targetId="calculadora"
                floatWhenPassed
                floatingLabel="Calcular minha economia"
                className="shadow-glow-orange mt-5 inline-block rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
              >
                Calcular minha economia
              </ScrollCta>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- O INVESTIMENTO ---------- */}
      <section className="relative overflow-hidden bg-brand-navy-light py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-orange/10 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Não é gasto, é investimento"
              title="Seu sistema se paga — e depois continua rendendo"
              description="Os dois sistemas reduzem sua conta todos os meses e se pagam com o tempo. O que muda é o caminho: o on-grid chega lá mais rápido, porque custa menos; o híbrido pede um pouco mais e entrega junto a tranquilidade de nunca ficar no escuro."
              center
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INVESTMENT_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 110}>
                <div className="card-lift shadow-brand relative h-full overflow-hidden rounded-2xl bg-white p-7">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange/30" />
                  <span className="text-3xl font-extrabold text-brand-orange/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-brand-navy">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                    {point.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={480}>
            <p className="mt-7 text-center text-sm text-brand-navy/60">
              Quer ver a parcela do seu caso?{" "}
              <ScrollCta
                targetId="calculadora"
                className="font-bold text-brand-orange hover:underline"
              >
                Simular meu financiamento →
              </ScrollCta>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- GARANTIAS ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Segurança do investimento"
              title="Equipamento com garantia de fábrica"
              description="Trabalhamos com equipamentos de fabricantes reconhecidos. O prazo exato de cada item vem discriminado na sua proposta, antes de qualquer assinatura."
              center
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-4xl gap-5 sm:grid-cols-3">
            {WARRANTIES.map((warranty, i) => (
              <Reveal key={warranty.title} delay={i * 110}>
                <div className="shadow-brand h-full rounded-2xl bg-white p-7 text-center">
                  <span className="block text-2xl font-extrabold text-brand-orange">
                    {warranty.term}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-brand-navy">
                    {warranty.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                    {warranty.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PORTFÓLIO ---------- */}
      {featuredProjects.length > 0 && (
        <section className="bg-brand-navy-light py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <SectionHeading
                eyebrow="Portfólio"
                title="Obras que já instalamos"
                description="Alguns dos projetos realizados pela Sumart na região."
              />
            </Reveal>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 100}>
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    city={project.city}
                    state={project.state}
                    category={project.category}
                    powerKwp={project.powerKwp}
                    photoUrl={project.photos[0]?.url}
                  />
                </Reveal>
              ))}
            </div>
            <Reveal delay={180}>
              <div className="mt-9">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:gap-2.5"
                >
                  Ver algumas de nossas obras
                  <span className="transition-all">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- DIFERENCIAL: ELEVADOR ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal className={teaserVideo ? "" : "md:col-span-2"}>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Nosso diferencial
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
                Instalação com elevador de placas
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-navy/70 sm:text-lg">
                Usamos um elevador próprio para subir os painéis solares até o
                telhado — mais segurança pra equipe, menos risco de dano aos
                equipamentos, e uma instalação mais ágil.
              </p>
              <Link
                href="/servicos#elevador"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:gap-2.5"
              >
                Ver vídeos do elevador em ação
                <span className="transition-all">→</span>
              </Link>
            </Reveal>
            {teaserVideo && (
              <Reveal delay={120}>
                <YouTubeEmbed
                  youtubeId={teaserVideo.youtubeId}
                  title={teaserVideo.title}
                />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ---------- DEPOIMENTOS ---------- */}
      {featuredTestimonials.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <SectionHeading
                eyebrow="Depoimentos"
                title="O que nossos clientes dizem"
                center
              />
            </Reveal>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTestimonials.map((testimonial, i) => (
                <Reveal key={testimonial.id} delay={i * 100}>
                  <TestimonialCard
                    authorName={testimonial.authorName}
                    authorLocation={testimonial.authorLocation}
                    text={testimonial.text}
                    rating={testimonial.rating}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- CALCULADORA ---------- */}
      {/* Sem depoimentos cadastrados esta seção encosta no elevador, que tem
          fundo branco, e o respiro normal vale. Com depoimentos no meio o fundo
          repete e o espaço de cima vira buraco. */}
      <section
        id="calculadora"
        className={`scroll-mt-20 bg-brand-navy-light pb-12 sm:pb-16 ${
          featuredTestimonials.length > 0 ? "pt-2 sm:pt-4" : "pt-12 sm:pt-16"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Simule agora"
              title="Quer saber quanto você economizaria?"
              description="É só o valor da sua conta de luz. Em segundos você vê quanto sobraria no seu bolso todo ano, o sistema que atende seu consumo e em quanto tempo ele se paga."
              center
              wide
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9">
              <SavingsCalculator
                ratesByTerm={financingRate.ratesByTerm}
                defaultRate={financingRate.defaultRate}
                cities={calculatorCities}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Serviços"
              title="Soluções em energia solar para cada necessidade"
              description="Sistemas híbridos com bateria ou convencionais — atendemos projetos residenciais, comerciais, industriais e rurais, do dimensionamento à manutenção."
            />
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 100}>
                <div className="card-lift shadow-brand group h-full rounded-2xl bg-white p-7">
                  <h3 className="text-lg font-bold text-brand-navy">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-navy/60">
                    {service.description}
                  </p>
                  <span className="mt-5 block h-0.5 w-10 rounded-full bg-brand-orange transition-all duration-300 group-hover:w-16" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={180}>
            <div className="mt-9">
              <Link
                href="/servicos"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:gap-2.5"
              >
                Ver todos os serviços
                <span className="transition-all">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PERGUNTAS FREQUENTES ---------- */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Perguntas frequentes"
              title="O que as pessoas perguntam antes de fechar"
              center
              wide
            />
          </Reveal>
          <div className="mt-9 divide-y divide-black/5 rounded-2xl bg-white px-6 shadow-brand sm:px-8">
            {FAQ.map((item, i) => (
              <Reveal key={item.question} delay={i * 60}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-bold text-brand-navy">
                    {item.question}
                    <span className="shrink-0 text-brand-orange transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-navy/65">
                    {item.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden bg-brand-navy-dark py-12 text-center text-white sm:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-orange/20 blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-[2.7rem] sm:leading-tight">
            Ainda em dúvida sobre qual sistema é o seu?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Conte pra gente como é o seu consumo. A gente analisa e diz qual faz
            mais sentido no seu caso — on-grid ou híbrido — com os números na mão.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="shadow-glow-orange rounded-full bg-brand-orange px-8 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
            >
              Solicitar meu orçamento
            </Link>
            <WhatsAppButton className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10">
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
      <JsonLd data={faqJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Início", path: "/" }])}
      />
    </>
  );
}
