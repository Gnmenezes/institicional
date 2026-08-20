import { prisma } from "@/lib/prisma";

export function getFeaturedProjects(take = 3) {
  return prisma.project.findMany({
    where: { featured: true },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { order: "asc" },
    take,
  });
}

export function getAllProjects() {
  return prisma.project.findMany({
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

/** Slugs de todas as obras, para prerenderizar as páginas de detalhe. */
export function getProjectSlugs() {
  return prisma.project.findMany({ select: { slug: true } });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

export function getHeroPhotos() {
  return prisma.heroPhoto.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export function getVideos() {
  return prisma.video.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export function getFeaturedTestimonials(take = 6) {
  return prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take,
  });
}

/** Cidades do seletor da calculadora, com a irradiação de cada uma. */
export function getCalculatorCities() {
  return prisma.city.findMany({
    where: { active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { name: true, state: true, hsp: true },
  });
}

export const CATEGORY_LABELS: Record<string, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
  RURAL: "Rural",
};
