import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HeroPhotoForm from "@/components/admin/HeroPhotoForm";

export default async function EditarFotoCarrosselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await prisma.heroPhoto.findUnique({ where: { id } });

  if (!photo) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Editar foto do carrossel</h1>
      <div className="mt-6">
        <HeroPhotoForm
          initial={{
            id: photo.id,
            url: photo.url,
            caption: photo.caption,
            order: photo.order,
          }}
        />
      </div>
    </div>
  );
}
