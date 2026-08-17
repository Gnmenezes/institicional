import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VideoForm from "@/components/admin/VideoForm";

export default async function EditarVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });

  if (!video) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Editar vídeo</h1>
      <div className="mt-6">
        <VideoForm
          initial={{
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.youtubeId}`,
            order: video.order,
          }}
        />
      </div>
    </div>
  );
}
