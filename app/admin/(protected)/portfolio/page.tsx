import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/data";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPortfolioPage() {
  const projects = await prisma.project.findMany({
    include: { photos: { take: 1, orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Portfólio de obras</h1>
        <Link
          href="/admin/portfolio/novo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange-dark"
        >
          + Nova obra
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-sm text-brand-navy/50">Nenhuma obra cadastrada ainda.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brand-navy/40">
              <tr>
                <th className="px-6 py-3">Obra</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Cidade</th>
                <th className="px-6 py-3">Destaque</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 font-medium text-brand-navy">{project.title}</td>
                  <td className="px-6 py-4 text-brand-navy/60">
                    {CATEGORY_LABELS[project.category] ?? project.category}
                  </td>
                  <td className="px-6 py-4 text-brand-navy/60">
                    {project.city} - {project.state}
                  </td>
                  <td className="px-6 py-4 text-brand-navy/60">{project.featured ? "Sim" : "Não"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/portfolio/${project.id}`}
                        className="text-sm font-semibold text-brand-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/projects/${project.id}`}
                        confirmMessage={`Excluir a obra "${project.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
