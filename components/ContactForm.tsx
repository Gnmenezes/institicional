"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useWhatsappNumber } from "@/components/WhatsAppNumberProvider";
import { RESPONSE_TIME } from "@/lib/company";

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
  const searchParams = useSearchParams();
  // A calculadora manda conta e cidade na URL, pra pessoa não digitar de novo.
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_STATE,
    billAmount: searchParams.get("conta") ?? "",
    city: searchParams.get("cidade") ?? "",
  }));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [whatsappUrl, setWhatsappUrl] = useState("");

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

      // Guarda a URL antes de limpar o form: a tela de sucesso depende dela.
      const url = buildWhatsappUrl(whatsappNumber, buildWhatsappMessage(form));
      setWhatsappUrl(url);
      setStatus("success");
      // Tentativa automática: funciona no desktop, mas no celular o navegador
      // costuma bloquear window.open disparado depois do await (sem gesto do
      // usuário). Por isso a tela de sucesso traz o botão como caminho real.
      window.open(url, "_blank", "noopener,noreferrer");
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
          Seus dados já chegaram pra gente. Para adiantar seu atendimento,
          continue a conversa no WhatsApp — a mensagem já está pronta.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-orange-dark"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.5-.4z" />
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
          </svg>
          Abrir WhatsApp
        </a>
        <p className="mt-4 text-xs text-brand-navy/50">
          Prefere esperar? Sem problema — respondemos em até {RESPONSE_TIME}.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 block w-full text-sm font-semibold text-brand-orange hover:underline"
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
        {status === "loading" ? "Enviando..." : "Quero meu estudo gratuito"}
      </button>

      <p className="text-center text-xs leading-relaxed text-brand-navy/50">
        Visita técnica e estudo de economia <strong className="font-semibold text-brand-navy/70">gratuitos</strong> e
        sem compromisso. Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}
