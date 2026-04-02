"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/lib/DataContext";

export default function Header() {
  const { companyData, navLinks } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className={`pointer-events-auto transition-all duration-500 ${
          scrolled
            ? "mt-3 mx-3 sm:mx-6 px-4 sm:px-6 py-2 max-w-4xl w-[calc(100%-24px)] sm:w-[calc(100%-48px)] bg-white/90 backdrop-blur-xl shadow-xl shadow-black/8 rounded-2xl border border-gray-200/60"
            : "mt-4 mx-4 sm:mx-8 px-5 sm:px-8 py-3 max-w-6xl w-[calc(100%-32px)] sm:w-[calc(100%-64px)] bg-white shadow-lg shadow-black/5 rounded-3xl border border-gray-100"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-10 sm:h-11" : "h-14 sm:h-16"
          }`}
        >
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group shrink-0">
            <div
              className={`rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500 ${
                scrolled ? "w-8 h-8 rounded-lg" : "w-10 h-10"
              }`}
            >
              <Image
                src="/logo.jpg"
                alt="Logo Agrocomercial Carvalho"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span
              className={`font-bold text-brand-dark tracking-tight transition-all duration-500 ${
                scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
              }`}
            >
              Agrocomercial Carvalho
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-2.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  activeSection === link.href
                    ? "text-brand-main bg-brand-lighter"
                    : "text-brand-earth/60 hover:text-brand-dark hover:bg-gray-50"
                }`}
              >
                {link.label}
                {activeSection === link.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-brand-main rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <OpenBadge />
            <a
              href={companyData.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-brand-main hover:bg-brand-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-main/20 ${
                scrolled ? "text-xs px-3.5 py-1.5 rounded-lg" : "text-[13px] px-4 py-2"
              }`}
            >
              Fale Conosco
            </a>
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-brand-dark p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 mt-2"
            >
              <div className="py-2 space-y-0.5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href
                        ? "text-brand-main bg-brand-lighter"
                        : "text-brand-earth/60 hover:text-brand-dark hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 px-3 flex items-center gap-2">
                  <OpenBadge />
                  <a
                    href={companyData.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-main text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Fale Conosco
                  </a>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}

function OpenBadge() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const time = now.getHours() * 60 + now.getMinutes();
      if (day === 0) setIsOpen(false);
      else if (day === 6) setIsOpen(time >= 480 && time < 1020);
      else setIsOpen(time >= 480 && time < 1140);
    };
    check();
    const i = setInterval(check, 60000);
    return () => clearInterval(i);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
      Aberto
    </div>
  );
}
