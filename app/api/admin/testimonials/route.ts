import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  authorName: z.string().trim().min(1).max(200),
  authorLocation: z.string().trim().max(200).optional().or(z.literal("")),
  text: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
  photoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { photoUrl, authorLocation, ...data } = parsed.data;

  const testimonial = await prisma.testimonial.create({
    data: {
      ...data,
      photoUrl: photoUrl || null,
      authorLocation: authorLocation || null,
    },
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}
