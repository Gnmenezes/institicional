-- Parcela real por prazo, do mesmo financiamento.
-- Tabela nova: nao altera nada existente.
CREATE TABLE "FinancingSample" (
    "id" TEXT NOT NULL,
    "term" INTEGER NOT NULL,
    "installment" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancingSample_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FinancingSample_term_key" ON "FinancingSample"("term");
