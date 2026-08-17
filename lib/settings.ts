import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "" },
  });
  return settings;
}

export function sanitizeWhatsappNumber(input: string) {
  return input.replace(/\D/g, "");
}
