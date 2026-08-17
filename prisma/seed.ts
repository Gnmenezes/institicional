import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.project.createMany({
    data: [
      {
        slug: "exemplo-residencial",
        title: "[Exemplo] Instalação residencial — substitua por uma obra real",
        description:
          "Este é um projeto de EXEMPLO criado automaticamente para mostrar como o portfólio fica preenchido. Edite ou exclua este item em /admin/portfolio e cadastre uma obra real, com fotos, cidade e potência instalada corretas.",
        city: "Juiz de Fora",
        state: "MG",
        category: "RESIDENCIAL",
        powerKwp: 5.4,
        featured: true,
        order: 1,
      },
      {
        slug: "exemplo-comercial",
        title: "[Exemplo] Instalação comercial — substitua por uma obra real",
        description:
          "Este é um projeto de EXEMPLO criado automaticamente para mostrar como o portfólio fica preenchido. Edite ou exclua este item em /admin/portfolio e cadastre uma obra real.",
        city: "Ubá",
        state: "MG",
        category: "COMERCIAL",
        powerKwp: 22,
        featured: true,
        order: 2,
      },
      {
        slug: "exemplo-rural",
        title: "[Exemplo] Instalação rural — substitua por uma obra real",
        description:
          "Este é um projeto de EXEMPLO criado automaticamente para mostrar como o portfólio fica preenchido. Edite ou exclua este item em /admin/portfolio e cadastre uma obra real.",
        city: "Guiricema",
        state: "MG",
        category: "RURAL",
        powerKwp: 8.1,
        featured: true,
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.testimonial.createMany({
    data: [
      {
        authorName: "Cliente de exemplo",
        authorLocation: "Substitua por um depoimento real",
        text: "Este é um depoimento de EXEMPLO criado automaticamente para mostrar como a seção fica preenchida no site. Edite ou exclua este item em /admin/depoimentos e adicione depoimentos reais de clientes.",
        rating: 5,
        featured: true,
        order: 1,
      },
      {
        authorName: "Cliente de exemplo 2",
        authorLocation: "Substitua por um depoimento real",
        text: "Outro depoimento de EXEMPLO. Peça para seus clientes reais avaliarem o serviço e cadastre os depoimentos verdadeiros no painel administrativo.",
        rating: 5,
        featured: true,
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed concluído: 3 obras de exemplo e 2 depoimentos de exemplo criados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
