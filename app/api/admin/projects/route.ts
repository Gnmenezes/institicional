import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPages } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  city: z.string().trim().min(1).max(200),
  state: z.string().trim().min(1).max(10).default("MG"),
  category: z.enum(["RESIDENCIAL", "COMERCIAL", "INDUSTRIAL", "RURAL"]),
  powerKwp: z.number().positive().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  photos: z.array(z.string().url()).default([]),
});

async function uniqueSlug(base: string) {
  const baseSlug = slugify(base) || "obra";
  let slug = baseSlug;
  let i = 2;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }
  return slug;
}

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { photos: { orderBy: { order: "asc" } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { photos, ...data } = parsed.data;
  const slug = await uniqueSlug(data.title);

  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
      photos: {
        create: photos.map((url, index) => ({ url, order: index })),
      },
    },
    include: { photos: true },
  });

  revalidatePublicPages();
  return NextResponse.json({ project }, { status: 201 });
}
