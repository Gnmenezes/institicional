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
    default: "Sumart Energia Solar — Sistemas Híbridos com Bateria",
    template: "%s | Sumart Energia Solar",
  },
  description:
    "Sistemas híbridos de energia solar com armazenamento em bateria em Juiz de Fora, Guiricema e região de Ubá (MG). Economize na conta de luz e tenha energia mesmo em quedas da rede.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
