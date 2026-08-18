import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const citySchema = z.object({
  active: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = citySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const city = await prisma.city
    .update({ where: { id }, data: { active: parsed.data.active } })
    .catch(() => null);

  if (!city) {
    return NextResponse.json({ error: "Cidade não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ city });
}
