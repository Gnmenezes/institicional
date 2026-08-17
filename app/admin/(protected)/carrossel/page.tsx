import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCarrosselPage() {
  const photos = await prisma.heroPhoto.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Carrossel da home</h1>
          <p className="mt-1 text-sm text-brand-navy/50">
            Fotos que alternam automaticamente no topo da página inicial.
          </p>
        </div>
        <Link
          href="/admin/carrossel/novo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange-dark"
        >
          + Nova foto
        </Link>
      </div>

      {photos.length === 0 ? (
        <p className="mt-10 text-sm text-brand-navy/50">Nenhuma foto cadastrada ainda.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative aspect-[3/4] w-full bg-brand-navy-light">
                <Image src={photo.url} alt={photo.caption} fill className="object-cover" sizes="300px" />
              </div>
              <div className="flex items-center justify-between gap-2 p-4">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{photo.caption}</p>
                  <p className="text-xs text-brand-navy/40">Ordem: {photo.order}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/admin/carrossel/${photo.id}`}
                    className="text-sm font-semibold text-brand-orange hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    endpoint={`/api/admin/hero-photos/${photo.id}`}
                    confirmMessage={`Excluir a foto "${photo.caption}"?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
