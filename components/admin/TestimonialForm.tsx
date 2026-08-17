"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

type TestimonialFormValues = {
  id?: string;
  authorName: string;
  authorLocation: string;
  text: string;
  rating: number;
  photoUrl: string;
  featured: boolean;
  order: number;
};

const EMPTY: TestimonialFormValues = {
  authorName: "",
  authorLocation: "",
  text: "",
  rating: 5,
  photoUrl: "",
  featured: true,
  order: 0,
};

export default function TestimonialForm({
  initial,
}: {
  initial?: Partial<TestimonialFormValues> & { id: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof TestimonialFormValues>(
    key: K,
    value: TestimonialFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const endpoint = initial?.id
      ? `/api/admin/testimonials/${initial.id}`
      : "/api/admin/testimonials";
    const method = initial?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Não foi possível salvar.");
      setSaving(false);
      return;
    }

    router.push("/admin/depoimentos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="authorName" className="text-sm font-medium text-brand-navy">
            Nome do cliente *
          </label>
          <input
            id="authorName"
            required
            value={form.authorName}
            onChange={(e) => update("authorName", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="authorLocation" className="text-sm font-medium text-brand-navy">
            Cidade / bairro
          </label>
          <input
            id="authorLocation"
            value={form.authorLocation}
            onChange={(e) => update("authorLocation", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div>
        <label htmlFor="text" className="text-sm font-medium text-brand-navy">
          Depoimento *
        </label>
        <textarea
          id="text"
          required
          rows={4}
          value={form.text}
          onChange={(e) => update("text", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rating" className="text-sm font-medium text-brand-navy">
            Nota (1 a 5)
          </label>
          <input
            id="rating"
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => update("rating", Number(e.target.value))}
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
            value={form.order}
            onChange={(e) => update("order", Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-brand-navy">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="h-4 w-4 rounded border-black/20 text-brand-orange focus:ring-brand-orange"
        />
        Exibir na página inicial
      </label>

      <ImageUploader
        label="Foto do cliente (opcional)"
        value={form.photoUrl ? [form.photoUrl] : []}
        onChange={(urls) => update("photoUrl", urls[0] ?? "")}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar depoimento"}
      </button>
    </form>
  );
}
