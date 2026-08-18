import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroCarousel from "@/components/HeroCarousel";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Reveal from "@/components/Reveal";
import { SunPanelIcon, BatteryIcon, HomeUsageIcon } from "@/components/illustrations/SolarIcons";
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

const HERO_TRUST = ["Equipe capacitada", "Projeto sob medida", "Suporte pós-instalação"];

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

const INVESTMENT_POINTS = [
  {
    title: "Economia todo mês",
    text: "Sua conta de luz cai já a partir da primeira fatura depois da instalação.",
  },
  {
    title: "O sistema se paga",
    text: "Com o tempo, a economia acumulada cobre o valor investido no projeto.",
  },
  {
    title: "Rende por décadas",
    text: "Depois de se pagar, o sistema segue gerando economia e autonomia.",
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
    cons: ["Desliga junto com a rede em caso de queda de energia, por segurança"],
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
    cons: ["Investimento inicial um pouco maior, por causa do banco de baterias"],
  },
];

const SERVICES = [
  {
    title: "Residencial",
    description: "Sistemas fotovoltaicos para casas e apartamentos, reduzindo sua conta de luz.",
  },
  {
    title: "Comercial e industrial",
    description: "Projetos para empresas, indústrias e comércios com maior demanda de energia.",
  },
  {
    title: "Rural",
    description: "Soluções para propriedades rurais, incluindo bombeamento solar e geração remota.",
  },
];

export default async function HomePage() {
  const yearsInBusiness = getYearsInBusiness();
  const CREDIBILITY_STATS = [
    { value: `+${PROJECTS_FLOOR}`, label: "obras entregues na região" },
    {
      value: `+${INSTALLED_KWP_FLOOR.toLocaleString("pt-BR")}`,
      label: "kWp de potência instalada",
    },
    { value: `${yearsInBusiness} anos`, label: "de mercado, desde 2021" },
    { value: RESPONSE_TIME, label: "é o nosso prazo de resposta" },
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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              Sistemas híbridos com baterias
            </span>

            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              A luz caiu bem na hora do jogo?{" "}
              <span className="text-gradient-orange">Ou no meio da ceia de Natal?</span>
            </h1>

            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-white/70">
              <p>
                Todo mundo já passou por isso: a energia falta justo no jogo
                decisivo, na virada de Ano Novo ou no jantar em família — e a
                festa acaba no escuro.
              </p>
              <p>
                Com um sistema híbrido de energia solar, isso não acontece
                mais. Sua casa continua com luz nos momentos que mais importam,
                mesmo com a rede caída.
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contato"
                className="shadow-glow-orange rounded-full bg-brand-orange px-8 py-4 text-center text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
              >
                Solicitar orçamento gratuito
              </Link>
              <Link
                href="#calculadora"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-center text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
              >
                Calcular minha economia
              </Link>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              {HERO_TRUST.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-orange" fill="currentColor" aria-hidden="true">
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
                {stat.value}
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
              title="Os momentos que você não pode perder"
              description="É nesses momentos que a falta de energia dói mais."
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
                    <h3 className="text-sm font-bold leading-snug text-white sm:text-base">{moment.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/70 sm:mt-1.5 sm:text-sm">{moment.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
              description="Além de acabar com a preocupação de ficar no escuro, o sistema reduz sua conta de luz todos os meses. Com o tempo, o valor investido se paga sozinho."
              center
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-4xl gap-5 sm:grid-cols-3">
            {INVESTMENT_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 110}>
                <div className="card-lift shadow-brand relative h-full overflow-hidden rounded-2xl bg-white p-7">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange to-brand-orange/30" />
                  <span className="text-3xl font-extrabold text-brand-orange/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-brand-navy">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">{point.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={220}>
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-brand-orange/30 bg-white p-7 sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange-light px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-orange">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Financiamento
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-brand-navy sm:text-2xl">
                Dá para começar sem tirar o valor todo do bolso
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-navy/70 sm:text-base">
                Trabalhamos com linhas de financiamento para energia solar. Na
                maioria dos projetos on-grid, é possível buscar uma parcela
                próxima do que você já paga de luz hoje — ou seja, a economia
                gerada ajuda a custear o próprio sistema, e quando o
                financiamento termina a economia fica inteira pra você.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-brand-navy/45">
                O valor da parcela depende de análise de crédito, prazo, taxa do
                banco e do seu consumo — por isso simulamos o seu caso antes de
                qualquer compromisso.
              </p>
              <Link
                href="#calculadora"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:gap-2.5"
              >
                Simular meu financiamento
                <span className="transition-all">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CALCULADORA ---------- */}
      {/* Continua o mesmo fundo da seção de investimento, então o respiro de
          cima seria buraco no meio de um bloco só — o de baixo dela basta. */}
      <section id="calculadora" className="scroll-mt-20 bg-brand-navy-light pb-12 pt-2 sm:pb-16 sm:pt-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Simule agora"
              title="Quanto você economizaria por mês?"
              description="Coloque o valor da sua conta de luz e veja uma estimativa do sistema, da economia e de quanto tempo o investimento leva pra se pagar."
              center
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-9">
              <SavingsCalculator
                monthlyRate={financingRate.monthlyRate}
                cities={calculatorCities}
              />
            </div>
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

                  <h3 className="mt-2 text-xl font-extrabold text-brand-navy">{system.name}</h3>
                  <p className="mt-1.5 text-sm text-brand-navy/50">{system.tagline}</p>

                  <div className="mt-6 flex items-center gap-2 rounded-2xl bg-brand-navy-light/70 p-4">
                    {system.steps.map((step, index) => (
                      <div key={step.label} className="flex flex-1 items-center gap-2">
                        <div className="flex flex-1 flex-col items-center gap-1.5">
                          <step.Icon className="h-9 w-9" />
                          <span className="text-[11px] font-semibold text-brand-navy/70">
                            {step.label}
                          </span>
                        </div>
                        {index < system.steps.length - 1 && (
                          <span className="mb-5 text-lg text-brand-orange/40">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {system.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2.5 text-sm text-brand-navy/80">
                        <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" fill="currentColor" aria-hidden="true">
                          <path d="M8.2 13.4 5.6 10.8l-1.2 1.2 3.8 3.8 8-8-1.2-1.2z" />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 space-y-2 border-t border-black/5 pt-5">
                    {system.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2.5 text-sm text-brand-navy/50">
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
                Não sabe qual dos dois combina com você? A gente te ajuda a
                decidir sem compromisso.
              </p>
              <Link
                href="/contato"
                className="shadow-glow-orange mt-5 inline-block rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
              >
                Solicitar orçamento gratuito
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section className="bg-brand-navy-light py-12 sm:py-16">
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
                  <h3 className="text-lg font-bold text-brand-navy">{service.title}</h3>
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
                <YouTubeEmbed youtubeId={teaserVideo.youtubeId} title={teaserVideo.title} />
              </Reveal>
            )}
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

      {/* ---------- DEPOIMENTOS ---------- */}
      {featuredTestimonials.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <SectionHeading eyebrow="Depoimentos" title="O que nossos clientes dizem" center />
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

      {/* ---------- GARANTIAS ---------- */}
      {/* Sem depoimentos cadastrados, esta seção encosta direto no portfólio,
          que tem o mesmo fundo — aí o respiro de cima vira buraco. Com
          depoimentos no meio existe troca de cor e o espaço normal se justifica. */}
      <section
        className={`bg-brand-navy-light pb-12 sm:pb-16 ${
          featuredTestimonials.length > 0 ? "pt-12 sm:pt-16" : "pt-2 sm:pt-4"
        }`}
      >
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
                  <h3 className="mt-2 text-base font-bold text-brand-navy">{warranty.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                    {warranty.text}
                  </p>
                </div>
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
            Pronto para nunca mais ficar no escuro?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Fale com a Sumart e descubra se um sistema híbrido com bateria é a
            melhor opção pro seu perfil de consumo.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="shadow-glow-orange rounded-full bg-brand-orange px-8 py-4 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-orange-dark"
            >
              Solicitar orçamento gratuito
            </Link>
            <WhatsAppButton className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10">
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
