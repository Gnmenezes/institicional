-- Aparelho novo que a pessoa pretende ligar, para o dimensionamento
-- considerar o consumo futuro e nao so o da conta de hoje.
-- Aditivo e nulavel: leads existentes seguem validos.
ALTER TABLE "Lead" ADD COLUMN "futureLoad" TEXT;
