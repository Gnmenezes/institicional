import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import {
  KEYWORDS,
  SITE_NAME,
  SITE_URL,
  localBusinessJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Energia Solar em Juiz de Fora e Região | Sumart Energia Solar",
    template: "%s | Sumart Energia Solar",
  },
  description:
    "Instalação de energia solar em Juiz de Fora, Guiricema e região de Ubá (MG). Sistemas híbridos com bateria, que mantêm sua casa ligada na queda de energia, e on-grid com microinversores. Orçamento e visita técnica sem custo.",
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  category: "Energia solar",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Energia Solar em Juiz de Fora e Região | Sumart Energia Solar",
    description:
      "Sistemas híbridos com bateria e on-grid com microinversores na Zona da Mata mineira. Simule sua economia e peça um orçamento sem custo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energia Solar em Juiz de Fora e Região | Sumart Energia Solar",
    description:
      "Sistemas híbridos com bateria e on-grid com microinversores na Zona da Mata mineira. Simule sua economia e peça um orçamento sem custo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Identidade da empresa e do site: é a partir daqui que o Google
            monta o painel de conhecimento e entende a área atendida. */}
        <JsonLd data={localBusinessJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
