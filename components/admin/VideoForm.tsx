"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type VideoFormValues = {
  id?: string;
  title: string;
  url: string;
  order: number;
};

export default function VideoForm({
  initial,
}: {
  initial?: Partial<VideoFormValues> & { id: string };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const endpoint = initial?.id ? `/api/admin/videos/${initial.id}` : "/api/admin/videos";
    const method = initial?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, order }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      setSaving(false);
      return;
    }

    router.push("/admin/videos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="title" className="text-sm font-medium text-brand-navy">
          Título *
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Subida de placas com elevador - Obra em Ubá"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div>
        <label htmlFor="url" className="text-sm font-medium text-brand-navy">
          Link do YouTube *
        </label>
        <input
          id="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
        <p className="mt-2 text-xs text-brand-navy/50">
          Suba o vídeo no YouTube (pode ser &ldquo;Não listado&rdquo;) e cole o
          link aqui.
        </p>
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
        {saving ? "Salvando..." : "Salvar vídeo"}
      </button>
    </form>
  );
}
