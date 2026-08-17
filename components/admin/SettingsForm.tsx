"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialWhatsappNumber }: { initialWhatsappNumber: string }) {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsappNumber }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      return;
    }

    const data = await response.json();
    setWhatsappNumber(data.settings.whatsappNumber);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="whatsappNumber" className="text-sm font-medium text-brand-navy">
          Número de WhatsApp da empresa
        </label>
        <input
          id="whatsappNumber"
          required
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="+55 32 99141-8802"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
        <p className="mt-2 text-xs text-brand-navy/50">
          Pode digitar com DDI, DDD, espaços, parênteses ou hífen — o site guarda
          só os números. Esse é o número usado no botão flutuante, no cabeçalho,
          no rodapé e no redirecionamento do formulário de orçamento.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Salvo com sucesso.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
