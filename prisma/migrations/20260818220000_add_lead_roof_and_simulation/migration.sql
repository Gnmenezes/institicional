-- Tipo de telhado e resumo da simulacao feita na calculadora.
-- Aditivo e nulavel: leads existentes seguem validos.
ALTER TABLE "Lead" ADD COLUMN "roofType" TEXT;
ALTER TABLE "Lead" ADD COLUMN "simulation" TEXT;
