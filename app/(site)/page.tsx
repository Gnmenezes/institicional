import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroCarousel from "@/components/HeroCarousel";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SunPanelIcon, BatteryIcon, HomeUsageIcon } from "@/components/illustrations/SolarIcons";
import HybridSystemIllustration from "@/components/illustrations/HybridSystemIllustration";
import {
  getFeaturedProjects,
  getFeaturedTestimonials,
  getHeroPhotos,
  getVideos,
} from "@/lib/data";

const HOW_IT_WORKS = [
  {
    step: "1. Gera",
    text: "Os painéis solares captam energia do sol durante o dia.",
    Icon: SunPanelIcon,
  },
  {
    step: "2. Armazena",
    text: "O excedente gerado fica guardado na bateria do sistema.",
    Icon: BatteryIcon,
  },
  {
    step: "3. Usa",
    text: "Você consome essa energia quando precisar — inclusive se a rede cair.",
    Icon: HomeUsageIcon,
  },
];

const VALUE_PROPS = [
  {
    title: "Energia mesmo sem rede",
    description:
      "Sistemas híbridos com bateria mantêm o essencial funcionando durante quedas de energia.",
  },
  {
    title: "Projeto sob medida",
    description:
      "Dimensionamento do sistema — com ou sem bateria — de acordo com o seu consumo real.",
  },
  {
    title: "Equipe especializada",
    description:
      "Instalação de sistemas híbridos, microinversores e baterias por uma equipe própria e experiente.",
  },
  {
    title: "Suporte pós-instalação",
    description: "Ficamos disponíveis para manutenção e monitoramento depois da instalação.",
  },
];

const HYBRID_BENEFITS = [
  "Continue com energia durante quedas na rede elétrica",
  "Armazene o excedente gerado durante o dia para usar à noite",
  "Reduza ainda mais a dependência da distribuidora",
  "Também seguimos instalando sistemas convencionais com microinversores, quando é a melhor opção pro seu perfil",
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange shadow-sm">
              Sistemas híbridos com bateria · Juiz de Fora e região
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

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex items-start gap-3 rounded-2xl border border-black/5 p-6">
              <item.Icon className="h-10 w-10 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-brand-navy">{item.step}</p>
                <p className="mt-0.5 text-sm text-brand-navy/60">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow="Novidade"
              title="Sistemas híbridos com armazenamento em bateria"
              description="A forma mais completa de aproveitar a energia solar: gera, armazena e usa quando você mais precisa — inclusive sem rede elétrica."
            />
            <ul className="mt-6 space-y-3">
              {HYBRID_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-brand-navy/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Link
              href="/contato"
              className="mt-7 inline-block rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
            >
              Quero saber se o híbrido é pra mim
            </Link>
          </div>
          <div className="rounded-2xl bg-brand-navy-light p-8">
            <HybridSystemIllustration className="w-full h-auto" />
            <div className="mt-6 grid grid-cols-2 gap-4">
              {VALUE_PROPS.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-brand-navy">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-navy/60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
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
