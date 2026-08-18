"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

type ProjectFormValues = {
  id?: string;
  title: string;
  description: string;
  city: string;
  state: string;
  category: "RESIDENCIAL" | "COMERCIAL" | "INDUSTRIAL" | "RURAL";
  powerKwp: string;
  featured: boolean;
  order: number;
  photos: string[];
};

const EMPTY: ProjectFormValues = {
  title: "",
  description: "",
  city: "",
  state: "MG",
  category: "RESIDENCIAL",
  powerKwp: "",
  featured: false,
  order: 0,
  photos: [],
};

export default function ProjectForm({
  initial,
}: {
  initial?: Partial<ProjectFormValues> & { id: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormValues>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      city: form.city,
      state: form.state,
      category: form.category,
      powerKwp: form.powerKwp ? Number(form.powerKwp) : null,
      featured: form.featured,
      order: Number(form.order) || 0,
      photos: form.photos,
    };

    const endpoint = initial?.id ? `/api/admin/projects/${initial.id}` : "/api/admin/projects";
    const method = initial?.id ? "PATCH" : "POST";

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

    router.push("/admin/portfolio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="title" className="text-sm font-medium text-brand-navy">
          Título da obra *
        </label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-brand-navy">
          Descrição *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="text-sm font-medium text-brand-navy">
            Cidade *
          </label>
          <input
            id="city"
            required
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="state" className="text-sm font-medium text-brand-navy">
            UF
          </label>
          <input
            id="state"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="text-sm font-medium text-brand-navy">
            Categoria
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value as ProjectFormValues["category"])}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          >
            <option value="RESIDENCIAL">Residencial</option>
            <option value="COMERCIAL">Comercial</option>
            <option value="INDUSTRIAL">Industrial</option>
            <option value="RURAL">Rural</option>
          </select>
        </div>
        <div>
          <label htmlFor="powerKwp" className="text-sm font-medium text-brand-navy">
            Potência (kWp)
          </label>
          <input
            id="powerKwp"
            type="number"
            step="0.01"
            min="0"
            value={form.powerKwp}
            onChange={(e) => update("powerKwp", e.target.value)}
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
        Destacar na página inicial
      </label>

      <ImageUploader
        value={form.photos}
        onChange={(photos) => update("photos", photos)}
        allowCover
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar obra"}
        </button>
      </div>
    </form>
  );
}
