"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CompanyData {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  phoneRaw: string;
  whatsappLink: string;
  whatsappMessage?: string;
  rating: number;
  reviewCount: number;
  mapsEmbed: string;
  mapsLink: string;
}

interface Review {
  name: string;
  text: string;
  stars: number;
}

interface ScheduleItem {
  day: string;
  hours: string;
  open: boolean;
}

interface Product {
  emoji: string;
  name: string;
  description: string;
}

interface AboutFeature {
  emoji: string;
  title: string;
  description: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface SiteData {
  companyData: CompanyData;
  schedule: ScheduleItem[];
  reviews: Review[];
  products: Product[];
  aboutFeatures: AboutFeature[];
  navLinks: NavLink[];
}

const defaults: SiteData = {
  companyData: {
    name: "Agrocomercial Carvalho",
    slogan: "Sua parceira no campo desde sempre",
    address: "R. Ernesto Wild, 250 – Industrial, Vera Cruz – RS, 96880-000",
    phone: "(51) 99731-3009",
    phoneRaw: "5551997313009",
    whatsappLink: "https://wa.me/5551997313009?text=Ol%C3%A1%2C%20Quero%20saber%20mais%20de%20como%20funciona%20!",
    rating: 4.7,
    reviewCount: 92,
    mapsEmbed: "https://maps.google.com/maps?q=R.+Ernesto+Wild,+250,+Vera+Cruz+RS&output=embed",
    mapsLink: "https://www.google.com/maps/search/R.+Ernesto+Wild,+250,+Vera+Cruz+RS",
  },
  schedule: [],
  reviews: [],
  products: [],
  aboutFeatures: [],
  navLinks: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Produtos", href: "#produtos" },
    { label: "Serviços", href: "#servicos" },
    { label: "Horários", href: "#horarios" },
    { label: "Avaliações", href: "#avaliacoes" },
    { label: "Contato", href: "#contato" },
  ],
};

const DataContext = createContext<SiteData>(defaults);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaults);

  useEffect(() => {
    fetch("/api/site-data")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .catch(() => {});
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useSiteData() {
  return useContext(DataContext);
}
