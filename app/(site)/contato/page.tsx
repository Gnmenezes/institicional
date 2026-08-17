import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contato e orçamento",
  description:
    "Solicite um orçamento gratuito de sistema híbrido com bateria ou energia solar convencional com a Sumart em Juiz de Fora, Guiricema e região de Ubá (MG).",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.2fr]">
      <div>
        <SectionHeading
          eyebrow="Contato"
          title="Solicite seu orçamento gratuito"
          description="Preencha o formulário com seus dados. Ao enviar, você também será direcionado ao nosso WhatsApp com a mensagem pronta."
        />

        <div className="mt-10 space-y-4 text-sm text-brand-navy/70">
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
        <ContactForm />
      </div>
    </div>
  );
}
