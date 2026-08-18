import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroCarousel from "@/components/HeroCarousel";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SunPanelIcon, BatteryIcon, HomeUsageIcon } from "@/components/illustrations/SolarIcons";
import {
  getFeaturedProjects,
  getFeaturedTestimonials,
  getHeroPhotos,
  getVideos,
} from "@/lib/data";

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
  const [featuredProjects, featuredTestimonials, heroPhotos, videos] = await Promise.all([
    getFeaturedProjects(3),
    getFeaturedTestimonials(3),
    getHeroPhotos(),
    getVideos(),
  ]);
  const teaserVideo = videos[0];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:items-center md:py-14">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange shadow-sm">
              Sistemas híbridos com baterias
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-brand-navy sm:text-5xl">
              Nunca Mais Fique no Escuro e Economize na Conta!
            </h1>
            <div className="mt-5 max-w-lg space-y-4 text-lg leading-relaxed text-brand-navy/70">
              <p>
                Já imaginou ter energia solar e ainda assim ficar no escuro
                quando a rede cai?
              </p>
              <p>
                Isso acaba hoje. Com nosso sistema híbrido, você continua com
                luz mesmo durante apagões e ainda economiza na conta de luz. É
                energia de verdade, sem interrupções, sem surpresas e com o
                bolso cheio.
              </p>
              <p>Fale conosco e nunca mais dependa da rede!</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contato"
                className="rounded-full bg-brand-orange px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
              >
                Solicitar orçamento gratuito
              </Link>
              <WhatsAppButton className="rounded-full border border-brand-navy/15 bg-white px-7 py-3.5 text-center text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
                Falar no WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          {heroPhotos.length > 0 && (
            <HeroCarousel
              photos={heroPhotos.map((photo) => ({
                src: photo.url,
                alt: photo.caption,
                caption: photo.caption,
              }))}
            />
          )}
        </div>
      </section>

      <section className="bg-brand-navy-light py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Qual é o ideal pra você?"
            title="Híbrido ou On-Grid — nós instalamos os dois"
            description="Cada sistema tem suas vantagens. Veja a diferença e escolha com a gente o que faz mais sentido pro seu consumo e orçamento."
            center
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {SYSTEM_COMPARISON.map((system) => (
              <div
                key={system.name}
                className={`rounded-2xl border p-8 ${
                  system.highlight
                    ? "border-brand-orange/30 bg-white shadow-md"
                    : "border-black/5 bg-white"
                }`}
              >
                {system.highlight && (
                  <span className="mb-2 inline-block rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                    Com bateria
                  </span>
                )}
                <h3 className="text-lg font-bold text-brand-navy">{system.name}</h3>
                <p className="mt-1 text-sm text-brand-navy/50">{system.tagline}</p>

                <div className="mt-5 flex items-center gap-2">
                  {system.steps.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <step.Icon className="h-9 w-9" />
                        <span className="text-[11px] font-medium text-brand-navy/60">
                          {step.label}
                        </span>
                      </div>
                      {index < system.steps.length - 1 && (
                        <span className="mb-4 text-brand-navy/20">→</span>
                      )}
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-2 border-t border-black/5 pt-5">
                  {system.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-brand-navy/80">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                      {pro}
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 space-y-2 border-t border-black/5 pt-4">
                  {system.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-brand-navy/50">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy/20" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-brand-navy/60">
            Não sabe qual dos dois combina com você? A gente te ajuda a decidir
            sem compromisso.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/contato"
              className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
            >
              Solicitar orçamento gratuito
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Serviços"
          title="Soluções em energia solar para cada necessidade"
          description="Sistemas híbridos com bateria ou convencionais — atendemos projetos residenciais, comerciais, industriais e rurais, do dimensionamento à manutenção."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.title} className="rounded-2xl border border-black/5 p-6">
              <h3 className="font-semibold text-brand-navy">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/servicos" className="text-sm font-semibold text-brand-orange hover:underline">
            Ver todos os serviços →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className={teaserVideo ? "" : "md:col-span-2"}>
            <span className="inline-block rounded-full bg-brand-orange-light px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange">
              Nosso diferencial
            </span>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy">
              Instalação com elevador de placas
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-navy/70">
              Usamos um elevador próprio para subir os painéis solares até o
              telhado — mais segurança pra equipe, menos risco de dano aos
              equipamentos, e uma instalação mais ágil.
            </p>
            <Link
              href="/servicos#elevador"
              className="mt-6 inline-block text-sm font-semibold text-brand-orange hover:underline"
            >
              Ver vídeos do elevador em ação →
            </Link>
          </div>
          {teaserVideo && (
            <YouTubeEmbed youtubeId={teaserVideo.youtubeId} title={teaserVideo.title} />
          )}
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="bg-brand-navy-light py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Portfólio"
              title="Obras que já instalamos"
              description="Alguns dos projetos realizados pela Sumart na região."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  slug={project.slug}
                  title={project.title}
                  city={project.city}
                  state={project.state}
                  category={project.category}
                  powerKwp={project.powerKwp}
                  photoUrl={project.photos[0]?.url}
                />
              ))}
            </div>
            <div className="mt-8">
              <Link href="/portfolio" className="text-sm font-semibold text-brand-orange hover:underline">
                Ver portfólio completo →
              </Link>
            </div>
          </div>
        </section>
      )}

      {featuredTestimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading eyebrow="Depoimentos" title="O que nossos clientes dizem" center />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                authorName={testimonial.authorName}
                authorLocation={testimonial.authorLocation}
                text={testimonial.text}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </section>
      )}

      <section className="bg-brand-navy py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pronto para economizar e ter mais autonomia de energia?
          </h2>
          <p className="mt-4 text-white/70">
            Fale com a Sumart e descubra se um sistema híbrido com bateria é a
            melhor opção pro seu perfil de consumo.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contato"
              className="rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
            >
              Solicitar orçamento gratuito
            </Link>
            <WhatsAppButton className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40">
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
