import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agrocomercial Carvalho | Produtos Agropecuários em Vera Cruz – RS",
  description:
    "Agrocomercial Carvalho: sua loja de produtos agropecuários em Vera Cruz – RS. Sementes, fertilizantes, rações, EPIs, ferramentas e muito mais. Avaliação 4.7 no Google.",
  keywords: [
    "agropecuária",
    "Vera Cruz RS",
    "produtos agrícolas",
    "sementes",
    "fertilizantes",
    "rações",
    "defensivos",
    "EPIs",
    "ferramentas agrícolas",
    "Agrocomercial Carvalho",
  ],
  openGraph: {
    title: "Agrocomercial Carvalho | Produtos Agropecuários",
    description:
      "Sua parceira no campo. Sementes, fertilizantes, rações, EPIs e mais em Vera Cruz – RS.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${openSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-brand-cream text-foreground">
        {children}
      </body>
    </html>
  );
}
