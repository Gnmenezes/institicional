import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sanitizeWhatsappNumber } from "@/lib/settings";

const settingsSchema = z.object({
  whatsappNumber: z.string().trim().min(8).max(20),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const whatsappNumber = sanitizeWhatsappNumber(parsed.data.whatsappNumber);
  if (whatsappNumber.length < 8) {
    return NextResponse.json({ error: "Número de WhatsApp inválido." }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { whatsappNumber },
    create: { id: "singleton", whatsappNumber },
  });

  return NextResponse.json({ settings });
}
