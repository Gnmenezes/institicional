"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  endpoint,
  confirmMessage = "Tem certeza que deseja excluir?",
}: {
  endpoint: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    const response = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (response.ok) {
      router.refresh();
    } else {
      window.alert("Não foi possível excluir.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
