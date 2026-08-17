import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getProjectBySlug, CATEGORY_LABELS } from "@/lib/data";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/portfolio" className="text-sm font-semibold text-brand-orange hover:underline">
        ← Voltar ao portfólio
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand-navy-light px-3 py-1 text-xs font-semibold text-brand-navy">
          {CATEGORY_LABELS[project.category] ?? project.category}
        </span>
        <span className="text-sm text-brand-navy/50">
          {project.city} — {project.state}
          {project.powerKwp ? ` · ${project.powerKwp} kWp instalados` : ""}
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{project.title}</h1>

      {project.photos.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {project.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy-light">
              <Image
                src={photo.url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-brand-navy/70">
        {project.description}
      </p>

      <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-brand-navy-light p-10 text-center">
        <h2 className="text-xl font-bold text-brand-navy">
          Quer um projeto parecido com este?
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contato"
            className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
          >
            Solicitar orçamento gratuito
          </Link>
          <WhatsAppButton className="rounded-full border border-brand-navy/15 bg-white px-7 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
            Falar no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
