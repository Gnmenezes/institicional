import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function EditarDepoimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Editar depoimento</h1>
      <div className="mt-6">
        <TestimonialForm
          initial={{
            id: testimonial.id,
            authorName: testimonial.authorName,
            authorLocation: testimonial.authorLocation ?? "",
            text: testimonial.text,
            rating: testimonial.rating,
            photoUrl: testimonial.photoUrl ?? "",
            featured: testimonial.featured,
            order: testimonial.order,
          }}
        />
      </div>
    </div>
  );
}
