import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { solveMonthlyRate } from "@/lib/solar";

const financingSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  installment: z.number().positive().max(1_000_000),
  term: z.number().int().min(2).max(240),
  marginPp: z.number().min(0).max(5),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = financingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { amount, installment, term, marginPp } = parsed.data;

  // Só aceita uma amostra que descreva um financiamento possível — senão a
  // calculadora do site passaria a exibir uma taxa sem sentido.
  const baseRate = solveMonthlyRate(amount, installment, term);
  if (baseRate === null) {
    return NextResponse.json(
      {
        error:
          "Esses valores não formam um financiamento válido. Confira se a parcela e o prazo correspondem ao valor financiado.",
      },
      { status: 400 }
    );
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      financingAmount: amount,
      financingInstallment: installment,
      financingTerm: term,
      financingMarginPp: marginPp,
      financingUpdatedAt: new Date(),
    },
    create: {
      id: "singleton",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
      financingAmount: amount,
      financingInstallment: installment,
      financingTerm: term,
      financingMarginPp: marginPp,
      financingUpdatedAt: new Date(),
    },
  });

  return NextResponse.json({
    baseRate,
    monthlyRate: baseRate + marginPp / 100,
  });
}
