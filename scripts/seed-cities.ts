/**
 * Popula a tabela de cidades da calculadora com a irradiação local (HSP).
 *
 *   npx tsx scripts/seed-cities.ts
 *
 * Os valores vêm de prisma/cities-hsp.json, buscado na API de climatologia da
 * NASA POWER (média de 2001–2020). É seguro rodar de novo: atualiza o HSP das
 * cidades já cadastradas e cria só as que faltam, sem apagar nada.
 *
 * Para incluir uma cidade nova, acrescente ao JSON e rode de novo — ou
 * cadastre direto pelo painel, em /admin/cidades.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type Row = { name: string; state: string; lat: number; lon: number; hsp: number };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const file = join(process.cwd(), "prisma", "cities-hsp.json");
  const rows: Row[] = JSON.parse(readFileSync(file, "utf-8"));

  let created = 0;
  let updated = 0;

  for (const [index, row] of rows.entries()) {
    const existing = await prisma.city.findUnique({
      where: { name_state: { name: row.name, state: row.state } },
    });

    if (existing) {
      await prisma.city.update({
        where: { id: existing.id },
        data: { hsp: row.hsp, latitude: row.lat, longitude: row.lon },
      });
      updated += 1;
    } else {
      await prisma.city.create({
        data: {
          name: row.name,
          state: row.state,
          hsp: row.hsp,
          latitude: row.lat,
          longitude: row.lon,
          // Juiz de Fora primeiro: é a praça principal e o padrão do seletor.
          order: row.name === "Juiz de Fora" ? 0 : index + 1,
        },
      });
      created += 1;
    }
  }

  const total = await prisma.city.count();
  console.log(`${created} criadas, ${updated} atualizadas — ${total} cidades no banco.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
