import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { solveMonthlyRate } from "@/lib/solar";

const financingSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  marginPp: z.number().min(0).max(5),
  installments: z
    .array(
      z.object({
        term: z.number().int().min(2).max(240),
        installment: z.number().positive().max(1_000_000),
      })
    )
    .min(1),
});

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = financingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { amount, marginPp, installments } = parsed.data;

  // Só aceita amostras que descrevam um financiamento possível — senão a
  // calculadora do site passaria a exibir uma taxa sem sentido.
  const invalid = installments.filter(
    (i) => solveMonthlyRate(amount, i.installment, i.term) === null
  );
  if (invalid.length > 0) {
    return NextResponse.json(
      {
        error: `Os valores de ${invalid
          .map((i) => `${i.term}x`)
          .join(", ")} não formam um financiamento válido. Confira se a parcela corresponde ao valor financiado.`,
      },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        financingAmount: amount,
        financingMarginPp: marginPp,
        financingUpdatedAt: new Date(),
      },
      create: {
        id: "singleton",
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
        financingAmount: amount,
        financingMarginPp: marginPp,
        financingUpdatedAt: new Date(),
      },
    }),
    // Substitui as amostras: prazo que saiu do formulário deixa de valer.
    prisma.financingSample.deleteMany({
      where: { term: { notIn: installments.map((i) => i.term) } },
    }),
    ...installments.map((i) =>
      prisma.financingSample.upsert({
        where: { term: i.term },
        update: { installment: i.installment },
        create: { term: i.term, installment: i.installment },
      })
    ),
  ]);

  return NextResponse.json({
    rates: installments.map((i) => ({
      term: i.term,
      baseRate: solveMonthlyRate(amount, i.installment, i.term),
    })),
  });
}
