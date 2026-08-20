import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import { RESPONSE_TIME } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contato e orçamento",
  description:
    "Solicite um orçamento gratuito de sistema híbrido com bateria ou energia solar convencional com a Sumart em Juiz de Fora, Guiricema e região de Ubá (MG).",
  alternates: { canonical: "/contato" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    images: ["/opengraph-image"],
    url: "/contato",
    title: "Contato | Sumart Energia Solar",
    description:
      "Solicite um orçamento gratuito de sistema híbrido com bateria ou energia solar convencional com a Sumart em Juiz de Fora, Guiricema e região de Ubá (MG).",
  },
};

const QUOTE_INCLUDES = [
  "Visita técnica para avaliar seu telhado e seu consumo",
  "Dimensionamento do sistema ideal para o seu caso",
  "Estimativa de economia mensal e de retorno do investimento",
  "Simulação de financiamento, se fizer sentido pra você",
  "Proposta detalhada, item por item, sem compromisso",
];

export default function ContatoPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1fr_1.2fr]">
      <div>
        <SectionHeading
          eyebrow="Contato"
          title="Solicite seu orçamento gratuito"
          description="Preencha o formulário com seus dados. Ao enviar, você também será direcionado ao nosso WhatsApp com a mensagem pronta."
        />

        <div className="mt-8 rounded-2xl border border-brand-orange/30 bg-brand-orange-light p-6">
          <span className="inline-block rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Sem custo
          </span>
          <h2 className="mt-3 text-base font-bold text-brand-navy">
            Visita técnica e estudo de economia gratuitos
          </h2>
          <ul className="mt-4 space-y-2.5">
            {QUOTE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-brand-navy/75">
                <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" fill="currentColor" aria-hidden="true">
                  <path d="M8.2 13.4 5.6 10.8l-1.2 1.2 3.8 3.8 8-8-1.2-1.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-4 text-sm text-brand-navy/70">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
              Prazo de resposta
            </span>
            Respondemos em até {RESPONSE_TIME} e já agendamos a reunião de
            apresentação da proposta.
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
              Área de atendimento
            </span>
            Juiz de Fora, Guiricema e região do polo moveleiro de Ubá — MG
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-navy/40">
              E-mail
            </span>
            <a href="mailto:contato@sumart.com.br" className="hover:text-brand-orange">
              contato@sumart.com.br
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 p-6 shadow-sm sm:p-8">
        {/* ContactForm lê a query string pra pré-preencher os dados vindos da
            calculadora, e useSearchParams exige este limite de Suspense. */}
        <Suspense fallback={<div className="h-96" />}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
