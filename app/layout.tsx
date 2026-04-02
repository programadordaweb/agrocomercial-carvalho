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

const baseUrl = "https://agrocomercialcarvalho.laqualabs.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Agrocomercial Carvalho | Produtos Agropecuários em Vera Cruz – RS",
    template: "%s | Agrocomercial Carvalho",
  },
  description:
    "Agrocomercial Carvalho: sua loja de produtos agropecuários em Vera Cruz – RS. Sementes, fertilizantes, rações, defensivos, EPIs, ferramentas, calçados e vestuário rural. Nota 4.7 no Google.",
  keywords: [
    "agropecuária Vera Cruz",
    "loja agropecuária",
    "Agrocomercial Carvalho",
    "produtos agrícolas Vera Cruz RS",
    "sementes",
    "fertilizantes",
    "rações animais",
    "defensivos agrícolas",
    "EPIs agrícolas",
    "ferramentas agrícolas",
    "calçados rurais",
    "vestuário rural",
    "loja de rações Vera Cruz",
    "agropecuária RS",
    "insumos agrícolas",
    "pet shop Vera Cruz",
    "pesca Vera Cruz RS",
  ],
  authors: [{ name: "Agrocomercial Carvalho" }],
  creator: "Agrocomercial Carvalho",
  publisher: "Agrocomercial Carvalho",
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Agrocomercial Carvalho | Produtos Agropecuários em Vera Cruz – RS",
    description:
      "Sua parceira no campo. Sementes, fertilizantes, rações, EPIs, ferramentas e muito mais em Vera Cruz – RS. Nota 4.7 no Google.",
    url: baseUrl,
    siteName: "Agrocomercial Carvalho",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Agrocomercial Carvalho - Produtos Agropecuários em Vera Cruz RS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agrocomercial Carvalho | Produtos Agropecuários",
    description:
      "Sua loja agropecuária de confiança em Vera Cruz – RS. Sementes, fertilizantes, rações, EPIs e mais.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Agropecuária",
};

// Schema.org JSON-LD
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Agrocomercial Carvalho",
  description:
    "Loja de produtos agropecuários em Vera Cruz – RS. Sementes, fertilizantes, rações, defensivos, EPIs, ferramentas, calçados e vestuário rural.",
  url: baseUrl,
  logo: `${baseUrl}/logo.jpg`,
  image: `${baseUrl}/opengraph-image.png`,
  telephone: "+5551997313009",
  email: "carvalho_cc09@hotmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R. Ernesto Wild, 250",
    addressLocality: "Vera Cruz",
    addressRegion: "RS",
    postalCode: "96880-000",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -29.714,
    longitude: -52.494,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "92",
    bestRating: "5",
    worstRating: "1",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "BRL",
  paymentAccepted: "Dinheiro, Cartão de Crédito, Cartão de Débito, Pix",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -29.714,
      longitude: -52.494,
    },
    geoRadius: "50000",
  },
  sameAs: [
    "https://www.facebook.com/LojaAgrocomercialCarvalho/",
    "https://www.instagram.com/agrocarvalho_filial/",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Produtos Agropecuários",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Sementes" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Fertilizantes" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Defensivos Agrícolas" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Rações" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "EPIs" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Ferramentas Agrícolas" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Calçados Rurais" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Vestuário Rural" } },
    ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-cream text-foreground">
        {children}
      </body>
    </html>
  );
}
