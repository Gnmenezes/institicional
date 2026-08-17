import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const heroPhotoSchema = z.object({
  url: z.string().url(),
  caption: z.string().trim().min(1).max(200),
  order: z.number().int().default(0),
});

export async function GET() {
  const photos = await prisma.heroPhoto.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = heroPhotoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const photo = await prisma.heroPhoto.create({ data: parsed.data });
  return NextResponse.json({ photo }, { status: 201 });
}
