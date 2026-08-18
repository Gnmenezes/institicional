-- Tipo de sistema de interesse informado no formulario de orcamento.
-- Aditivo e nulavel: leads existentes seguem validos sem o campo.
ALTER TABLE "Lead" ADD COLUMN "systemType" TEXT;
