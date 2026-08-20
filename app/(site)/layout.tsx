import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { WhatsAppNumberProvider } from "@/components/WhatsAppNumberProvider";
import { getSiteSettings } from "@/lib/settings";

// As páginas públicas leem do banco (WhatsApp, portfólio, depoimentos) via
// este layout, mas esse conteúdo muda raramente: em vez de renderizar a cada
// visita, ficam em cache por 15 dias. O que é gravado no /admin aparece na
// hora mesmo assim — as rotas de gravação chamam `revalidatePublicPages()`,
// em lib/revalidate.ts. O número precisa ser literal para o Next enxergar.
export const revalidate = 1296000; // 15 dias

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <WhatsAppNumberProvider number={settings.whatsappNumber}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </WhatsAppNumberProvider>
  );
}
