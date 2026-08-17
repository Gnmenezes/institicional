import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getFeaturedProjects, getFeaturedTestimonials } from "@/lib/data";

const VALUE_PROPS = [
  {
    title: "Projeto sob medida",
    description:
      "Dimensionamento do sistema de acordo com o seu consumo real, sem exagero de equipamentos.",
  },
  {
    title: "Equipe especializada",
    description:
      "Instalação de painéis solares e microinversores feita por uma equipe própria e experiente.",
  },
  {
    title: "Acompanhamento completo",
    description:
      "Da homologação junto à distribuidora até a colocação em funcionamento do sistema.",
  },
  {
    title: "Suporte pós-instalação",
    description: "Ficamos disponíveis para manutenção e monitoramento depois da instalação.",
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
  const [featuredProjects, featuredTestimonials] = await Promise.all([
    getFeaturedProjects(3),
    getFeaturedTestimonials(3),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-orange shadow-sm">
              Energia solar em Juiz de Fora e região
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-brand-navy sm:text-5xl">
              Reduza sua conta de luz com energia solar de verdade
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-brand-navy/70">
              A Sumart instala painéis solares e microinversores para residências,
              empresas e propriedades rurais em Juiz de Fora, Guiricema e região do
              polo moveleiro de Ubá.
            </p>
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

          <div className="grid grid-cols-2 gap-4">
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Serviços"
          title="Soluções em energia solar para cada necessidade"
          description="Atendemos projetos residenciais, comerciais/industriais e rurais, do dimensionamento à manutenção."
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
            Pronto para economizar na conta de luz?
          </h2>
          <p className="mt-4 text-white/70">
            Fale com a Sumart e receba uma proposta personalizada para o seu perfil
            de consumo.
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
