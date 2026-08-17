import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/settings";

export default async function ConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Configurações</h1>
      <p className="mt-1 text-sm text-brand-navy/50">
        Ajustes gerais do site que você pode alterar sem precisar de um desenvolvedor.
      </p>
      <div className="mt-6">
        <SettingsForm initialWhatsappNumber={settings.whatsappNumber} />
      </div>
    </div>
  );
}
