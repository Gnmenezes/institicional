import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects, CATEGORY_LABELS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfólio de obras",
  description:
    "Confira projetos de energia solar já instalados pela Sumart em Juiz de Fora, Guiricema e região de Ubá (MG).",
};

const CATEGORIES = ["RESIDENCIAL", "COMERCIAL", "RURAL"];

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const allProjects = await getAllProjects();

  const filtered = categoria
    ? allProjects.filter((p) => p.category === categoria)
    : allProjects;

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Portfólio"
        title="Obras já instaladas pela Sumart"
        description="Projetos residenciais, comerciais e rurais realizados na nossa região de atuação."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/portfolio"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            !categoria
              ? "bg-brand-orange text-white"
              : "bg-brand-navy-light text-brand-navy hover:bg-brand-navy/10"
          }`}
        >
          Todos
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/portfolio?categoria=${cat}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              categoria === cat
                ? "bg-brand-orange text-white"
                : "bg-brand-navy-light text-brand-navy hover:bg-brand-navy/10"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
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
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-brand-navy/20 p-12 text-center text-brand-navy/50">
          Ainda não há obras cadastradas nesta categoria. Novos projetos são
          adicionados regularmente pelo painel administrativo.
        </div>
      )}
    </div>
  );
}
