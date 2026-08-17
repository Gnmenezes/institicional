import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/youtube";

const videoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.string().trim().min(1),
  order: z.number().int().default(0),
});

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ videos });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = videoSchema.safeParse(body);

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

  const video = await prisma.video.create({
    data: { title: parsed.data.title, order: parsed.data.order, youtubeId },
  });

  return NextResponse.json({ video }, { status: 201 });
}
