"use client";

import { buildWhatsappUrl } from "@/lib/whatsapp";
import { useWhatsappNumber } from "@/components/WhatsAppNumberProvider";

const DEFAULT_MESSAGE =
  "Olá! Vim pelo site e gostaria de solicitar um orçamento de energia solar.";

export default function WhatsAppButton({
  message = DEFAULT_MESSAGE,
  className = "",
  children,
}: {
  message?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const number = useWhatsappNumber();

  return (
    <a
      href={buildWhatsappUrl(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
