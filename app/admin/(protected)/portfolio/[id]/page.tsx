import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditarObraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Editar obra</h1>
      <div className="mt-6">
        <ProjectForm
          initial={{
            id: project.id,
            title: project.title,
            description: project.description,
            city: project.city,
            state: project.state,
            category: project.category,
            powerKwp: project.powerKwp?.toString() ?? "",
            featured: project.featured,
            order: project.order,
            photos: project.photos.map((p) => p.url),
          }}
        />
      </div>
    </div>
  );
}
