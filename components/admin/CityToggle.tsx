"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CityToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(active);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !checked;
    setSaving(true);
    setChecked(next); // otimista: a lista inteira ficaria lenta esperando o servidor

    const response = await fetch(`/api/admin/cities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });

    setSaving(false);
    if (!response.ok) {
      setChecked(!next);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Remover do seletor do site" : "Incluir no seletor do site"}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-brand-orange" : "bg-brand-navy/20"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
