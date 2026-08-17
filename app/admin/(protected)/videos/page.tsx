import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Vídeos do elevador</h1>
          <p className="mt-1 text-sm text-brand-navy/50">
            Vídeos exibidos em Serviços e na home, mostrando a subida de placas com elevador.
          </p>
        </div>
        <Link
          href="/admin/videos/novo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange-dark"
        >
          + Novo vídeo
        </Link>
      </div>

      {videos.length === 0 ? (
        <p className="mt-10 text-sm text-brand-navy/50">Nenhum vídeo cadastrado ainda.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm"
            >
              <div>
                <p className="font-semibold text-brand-navy">{video.title}</p>
                <p className="text-xs text-brand-navy/40">
                  youtube.com/watch?v={video.youtubeId} · Ordem: {video.order}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/videos/${video.id}`}
                  className="text-sm font-semibold text-brand-orange hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  endpoint={`/api/admin/videos/${video.id}`}
                  confirmMessage={`Excluir o vídeo "${video.title}"?`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
