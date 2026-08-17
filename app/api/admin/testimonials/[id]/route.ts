import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const testimonialUpdateSchema = z.object({
  authorName: z.string().trim().min(1).max(200),
  authorLocation: z.string().trim().max(200).optional().or(z.literal("")),
  text: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5),
  photoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean(),
  order: z.number().int(),
});

type Params = { id: string };

export async function PATCH(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = testimonialUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { photoUrl, authorLocation, ...data } = parsed.data;

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...data,
      photoUrl: photoUrl || null,
      authorLocation: authorLocation || null,
    },
  });

  return NextResponse.json({ testimonial });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
