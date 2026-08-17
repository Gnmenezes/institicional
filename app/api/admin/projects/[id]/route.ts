import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const projectUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  city: z.string().trim().min(1).max(200),
  state: z.string().trim().min(1).max(10),
  category: z.enum(["RESIDENCIAL", "COMERCIAL", "RURAL"]),
  powerKwp: z.number().positive().nullable().optional(),
  featured: z.boolean(),
  order: z.number().int(),
  photos: z.array(z.string().url()).default([]),
});

type Params = { id: string };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { photos, ...data } = parsed.data;

  const project = await prisma.$transaction(async (tx) => {
    await tx.projectPhoto.deleteMany({ where: { projectId: id } });
    return tx.project.update({
      where: { id },
      data: {
        ...data,
        photos: { create: photos.map((url, index) => ({ url, order: index })) },
      },
      include: { photos: true },
    });
  });

  return NextResponse.json({ project });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
