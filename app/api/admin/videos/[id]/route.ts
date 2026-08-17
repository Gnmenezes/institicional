import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/youtube";

const videoUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.string().trim().min(1),
  order: z.number().int(),
});

type Params = { id: string };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = videoUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const youtubeId = extractYoutubeId(parsed.data.url);
  if (!youtubeId) {
    return NextResponse.json(
      { error: "Não consegui reconhecer esse link do YouTube. Cole o link completo do vídeo." },
      { status: 400 }
    );
  }

  const video = await prisma.video.update({
    where: { id },
    data: { title: parsed.data.title, order: parsed.data.order, youtubeId },
  });

  return NextResponse.json({ video });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
