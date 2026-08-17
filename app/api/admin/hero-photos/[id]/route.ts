import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const heroPhotoUpdateSchema = z.object({
  caption: z.string().trim().min(1).max(200),
  order: z.number().int(),
});

type Params = { id: string };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = heroPhotoUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const photo = await prisma.heroPhoto.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ photo });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  await prisma.heroPhoto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
