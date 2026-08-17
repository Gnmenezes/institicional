"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useWhatsappNumber } from "@/components/WhatsAppNumberProvider";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  billAmount: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  billAmount: "",
  message: "",
};

function buildWhatsappMessage(data: FormState) {
  const lines = [
    "Olá! Vim pelo site e gostaria de solicitar um orçamento de energia solar.",
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    data.city ? `Cidade: ${data.city}` : null,
    data.billAmount ? `Valor médio da conta de luz: ${data.billAmount}` : null,
    data.message ? `Mensagem: ${data.message}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

export default function ContactForm() {
  const whatsappNumber = useWhatsappNumber();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Falha ao enviar");

      setStatus("success");
      window.open(
        buildWhatsappUrl(whatsappNumber, buildWhatsappMessage(form)),
        "_blank",
        "noopener,noreferrer"
      );
      setForm(INITIAL_STATE);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange-light p-8 text-center">
        <h3 className="text-lg font-bold text-brand-navy">Recebemos seu pedido!</h3>
        <p className="mt-2 text-sm text-brand-navy/70">
          Abrimos o WhatsApp com sua mensagem pronta para envio. Se não abriu
          automaticamente, verifique se seu navegador bloqueou a nova aba.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-brand-orange hover:underline"
        >
          Enviar outro pedido
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-brand-navy">
            Nome completo *
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-brand-navy">
            Telefone / WhatsApp *
          </label>
          <input
            id="phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(32) 90000-0000"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-brand-navy">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium text-brand-navy">
            Cidade
          </label>
          <input
            id="city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Juiz de Fora, Guiricema, Ubá..."
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      <div>
        <label htmlFor="billAmount" className="text-sm font-medium text-brand-navy">
          Valor médio da conta de luz
        </label>
        <input
          id="billAmount"
          value={form.billAmount}
          onChange={(e) => update("billAmount", e.target.value)}
          placeholder="Ex: R$ 350"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-brand-navy">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Não foi possível enviar seu pedido agora. Tente novamente ou fale
          direto pelo WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
      >
        {status === "loading" ? "Enviando..." : "Solicitar orçamento"}
      </button>
    </form>
  );
}
