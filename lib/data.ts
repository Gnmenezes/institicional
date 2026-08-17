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

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

export function getFeaturedTestimonials(take = 6) {
  return prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take,
  });
}

export const CATEGORY_LABELS: Record<string, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  RURAL: "Rural",
};
