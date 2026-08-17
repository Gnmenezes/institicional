import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { WhatsAppNumberProvider } from "@/components/WhatsAppNumberProvider";
import { getSiteSettings } from "@/lib/settings";

// As páginas públicas leem do banco (WhatsApp, portfólio, depoimentos) via
// este layout — precisam renderizar a cada requisição pra refletir mudanças
// feitas no /admin sem precisar de um novo deploy.
export const dynamic = "force-dynamic";

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
