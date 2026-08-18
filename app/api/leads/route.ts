import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/lib/email";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  phone: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(200).optional().or(z.literal("")),
  billAmount: z.string().trim().max(100).optional().or(z.literal("")),
  systemType: z.enum(["ONGRID", "HIBRIDO", "INDEFINIDO"]).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { name, phone, email, city, billAmount, systemType, message } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email: email || null,
      city: city || null,
      billAmount: billAmount || null,
      systemType: systemType || null,
      message: message || null,
    },
  });

  try {
    await sendLeadNotification(lead);
  } catch (error) {
    console.error("Falha ao enviar e-mail de notificação de lead:", error);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
