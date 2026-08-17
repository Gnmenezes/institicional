import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminDepoimentosPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">Depoimentos</h1>
        <Link
          href="/admin/depoimentos/novo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange-dark"
        >
          + Novo depoimento
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="mt-10 text-sm text-brand-navy/50">Nenhum depoimento cadastrado ainda.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm"
            >
              <div>
                <p className="font-semibold text-brand-navy">
                  {testimonial.authorName}
                  {testimonial.authorLocation ? (
                    <span className="ml-2 font-normal text-brand-navy/50">
                      {testimonial.authorLocation}
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-brand-navy/40">
                    {testimonial.featured ? "· exibido no site" : "· oculto"}
                  </span>
                </p>
                <p className="mt-2 max-w-xl text-sm text-brand-navy/60">{testimonial.text}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/depoimentos/${testimonial.id}`}
                  className="text-sm font-semibold text-brand-orange hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/testimonials/${testimonial.id}`}
                  confirmMessage={`Excluir o depoimento de "${testimonial.authorName}"?`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
