-- Amostra de financiamento real usada para derivar a taxa efetiva da calculadora.
-- Puramente aditivo: nenhuma coluna existente é alterada ou removida.
ALTER TABLE "SiteSettings" ADD COLUMN "financingAmount" DOUBLE PRECISION;
ALTER TABLE "SiteSettings" ADD COLUMN "financingInstallment" DOUBLE PRECISION;
ALTER TABLE "SiteSettings" ADD COLUMN "financingTerm" INTEGER;
ALTER TABLE "SiteSettings" ADD COLUMN "financingMarginPp" DOUBLE PRECISION NOT NULL DEFAULT 0.25;
ALTER TABLE "SiteSettings" ADD COLUMN "financingUpdatedAt" TIMESTAMP(3);
