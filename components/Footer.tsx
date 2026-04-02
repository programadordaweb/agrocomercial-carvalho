"use client";

import Image from "next/image";
import { useSiteData } from "@/lib/DataContext";

export default function Footer() {
  const { companyData } = useSiteData();
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="Logo Agrocomercial Carvalho"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-base">{companyData.name}</span>
              <p className="text-white/40 text-xs">
                Cultivando tradição e tecnologia para o desenvolvimento rural de Vera Cruz e região.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
            <a href="#inicio" className="hover:text-white transition-colors">Início</a>
            <span className="text-white/20">|</span>
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
            <span className="text-white/20">|</span>
            <a href="#produtos" className="hover:text-white transition-colors">Produtos</a>
            <span className="text-white/20">|</span>
            <a href="#contato" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {companyData.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
