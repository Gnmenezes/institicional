"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useWhatsappNumber } from "@/components/WhatsAppNumberProvider";
import { RESPONSE_TIME } from "@/lib/company";

type SystemType = "ONGRID" | "HIBRIDO" | "INDEFINIDO";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  billAmount: string;
  roofType: string;
  systemType: SystemType;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  billAmount: "",
  roofType: "",
  systemType: "INDEFINIDO",
  message: "",
};

/** Muda a estrutura de fixação e a mão de obra da instalação. */
export const ROOF_TYPES = [
  "Telha cerâmica (colonial ou romana)",
  "Telha de fibrocimento",
  "Telha metálica",
  "Laje",
  "No solo",
  "Ainda não sei",
];

const SYSTEM_OPTIONS: { value: SystemType; label: string; hint: string }[] = [
  {
    value: "HIBRIDO",
    label: "Híbrido, com bateria",
    hint: "Quero continuar com luz durante as quedas de energia",
  },
  {
    value: "ONGRID",
    label: "Convencional (on-grid)",
    hint: "Quero reduzir a conta de luz, sem bateria",
  },
  {
    value: "INDEFINIDO",
    label: "Ainda não sei",
    hint: "Quero que vocês me orientem sobre o melhor pro meu caso",
  },
];

const SYSTEM_LABELS: Record<SystemType, string> = {
  HIBRIDO: "Híbrido (com bateria)",
  ONGRID: "Convencional (on-grid)",
  INDEFINIDO: "Ainda não sei / quero orientação",
};

function buildWhatsappMessage(data: FormState, simulation?: string) {
  const lines = [
    "Olá! Vim pelo site e gostaria de solicitar um orçamento de energia solar.",
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    data.city ? `Cidade: ${data.city}` : null,
    data.billAmount ? `Valor médio da conta de luz: ${data.billAmount}` : null,
    data.roofType ? `Telhado: ${data.roofType}` : null,
    `Tipo de sistema: ${SYSTEM_LABELS[data.systemType]}`,
    simulation ? `Simulou no site: ${simulation}` : null,
    data.message ? `Mensagem: ${data.message}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}

export default function ContactForm({
  defaultBillAmount,
  defaultCity,
  simulation,
  compact = false,
}: {
  defaultBillAmount?: string;
  defaultCity?: string;
  /** Resumo do que a pessoa simulou, quando o formulário vem da calculadora. */
  simulation?: string;
  /** Layout mais enxuto, para uso embutido na calculadora. */
  compact?: boolean;
} = {}) {
  const whatsappNumber = useWhatsappNumber();
  const searchParams = useSearchParams();
  // Conta e cidade podem vir da calculadora — por props quando o formulário
  // está embutido nela, ou pela URL quando a pessoa chegou pelo botão.
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_STATE,
    billAmount: defaultBillAmount ?? searchParams.get("conta") ?? "",
    city: defaultCity ?? searchParams.get("cidade") ?? "",
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
        body: JSON.stringify({ ...form, simulation }),
      });

      if (!response.ok) throw new Error("Falha ao enviar");

      // Guarda a URL antes de limpar o form: a tela de sucesso depende dela.
      const url = buildWhatsappUrl(whatsappNumber, buildWhatsappMessage(form, simulation));
      setWhatsappUrl(url);
      setStatus("success");
      // Só conta depois de o lead ter sido gravado de fato.
      track("enviou_orcamento", {
        tipo_sistema: form.systemType,
        telhado: form.roofType,
        veio_da_calculadora: Boolean(simulation),
      });
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
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-5"}>
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
            E-mail <span className="text-brand-navy/45">(opcional)</span>
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

      <div className="grid gap-5 sm:grid-cols-2">
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
          <label htmlFor="roofType" className="text-sm font-medium text-brand-navy">
            Tipo de telhado *
          </label>
          <select
            id="roofType"
            required
            value={form.roofType}
            onChange={(e) => update("roofType", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          >
            <option value="">Selecione</option>
            {ROOF_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-brand-navy">
          Que tipo de sistema você quer orçar?
        </legend>
        <div className="mt-2.5 grid gap-2.5">
          {SYSTEM_OPTIONS.map((option) => {
            const selected = form.systemType === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  selected
                    ? "border-brand-orange bg-brand-orange-light"
                    : "border-black/10 hover:border-brand-orange/40"
                }`}
              >
                <input
                  type="radio"
                  name="systemType"
                  value={option.value}
                  checked={selected}
                  onChange={() => update("systemType", option.value)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand-orange"
                />
                <span>
                  <span className="block text-sm font-semibold text-brand-navy">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-brand-navy/55">
                    {option.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-brand-navy">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={compact ? 3 : 4}
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
        {status === "loading" ? "Enviando..." : "Quero meu orçamento personalizado"}
      </button>

      <p className="text-center text-xs leading-relaxed text-brand-navy/50">
        Visita técnica e estudo de economia <strong className="font-semibold text-brand-navy/70">gratuitos</strong> e
        sem compromisso. Seus dados não são compartilhados com terceiros.
      </p>
    </form>
  );
}
