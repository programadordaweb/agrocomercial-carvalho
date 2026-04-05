"use client";

import { createContext, useContext } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import ServicesSection from "@/components/ServicesSection";
import ScheduleSection from "@/components/ScheduleSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Analytics from "@/components/Analytics";

export interface SiteData {
  companyData: {
    name: string; slogan: string; address: string; phone: string; phoneRaw: string;
    whatsappLink: string; whatsappMessage: string; rating: number; reviewCount: number;
    mapsEmbed: string; mapsLink: string;
  };
  schedule: { day: string; hours: string; open: boolean }[];
  reviews: { name: string; text: string; stars: number }[];
  products: { emoji: string; name: string; description: string }[];
  aboutFeatures: { emoji: string; title: string; description: string }[];
  navLinks: { label: string; href: string }[];
}

const DataCtx = createContext<SiteData>(null!);
export const useSiteData = () => useContext(DataCtx);

export default function SiteClient({ data }: { data: SiteData }) {
  return (
    <DataCtx.Provider value={data}>
      <main className="flex-1">
        <Analytics />
        <Header />
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <ServicesSection />
        <ScheduleSection />
        <ReviewsSection />
        <ContactSection />
        <Footer />
        <WhatsAppButton />
      </main>
    </DataCtx.Provider>
  );
}
