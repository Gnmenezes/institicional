import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sumart.com.br"),
  title: {
    default: "Sumart Energia Solar — Instalação de Painéis Solares",
    template: "%s | Sumart Energia Solar",
  },
  description:
    "Instalação de painéis solares e microinversores em Juiz de Fora, Guiricema e região de Ubá (MG). Economize na conta de luz com a Sumart Energia Solar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
