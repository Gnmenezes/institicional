"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

type HeroPhotoFormValues = {
  id?: string;
  url: string;
  caption: string;
  order: number;
};

export default function HeroPhotoForm({
  initial,
}: {
  initial?: Partial<HeroPhotoFormValues> & { id: string };
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.url ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url) {
      setError("Envie uma foto antes de salvar.");
      return;
    }

    setSaving(true);
    setError(null);

    const endpoint = initial?.id
      ? `/api/admin/hero-photos/${initial.id}`
      : "/api/admin/hero-photos";
    const method = initial?.id ? "PATCH" : "POST";
    const payload = initial?.id ? { caption, order } : { url, caption, order };

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      setSaving(false);
      return;
    }

    router.push("/admin/carrossel");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      {!initial?.id && (
        <ImageUploader
          label="Foto"
          value={url ? [url] : []}
          onChange={(urls) => setUrl(urls[0] ?? "")}
        />
      )}

      <div>
        <label htmlFor="caption" className="text-sm font-medium text-brand-navy">
          Legenda *
        </label>
        <input
          id="caption"
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Nome do cliente - Cidade UF"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div>
        <label htmlFor="order" className="text-sm font-medium text-brand-navy">
          Ordem de exibição
        </label>
        <input
          id="order"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar foto"}
      </button>
    </form>
  );
}
