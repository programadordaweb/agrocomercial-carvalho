"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteData } from "@/components/SiteClient";

const featureIcons: Record<string, React.ReactNode> = {
  Qualidade: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Atendimento: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Variedade: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Confiança: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

export default function AboutSection() {
  const { aboutFeatures } = useSiteData();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Image with glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden relative">
              <Image
                src="/about-store.jpg"
                alt="Cristiano e Joelma Carvalho, fundadores da Agrocomercial Carvalho"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Glassmorphism overlay card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-[280px] bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-xl"
            >
              <p className="text-sm text-brand-earth leading-relaxed">
                <span className="font-bold text-brand-dark">Tradição e qualidade</span> que
                fazem a diferença no dia a dia do produtor rural gaúcho.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-brand-main font-semibold text-sm uppercase tracking-widest mb-2 block">
              Nossa História
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark leading-tight mb-6">
              Tradição cultivada com excelência.
            </h2>

            <div className="bg-brand-card rounded-2xl p-6 mb-8">
              <p className="text-brand-earth leading-relaxed">
                Localizada no coração de Vera Cruz, a Agrocomercial Carvalho é mais
                que uma loja: é o ponto de encontro de quem vive da terra. Oferecemos
                soluções completas para o produtor rural e para quem busca o melhor
                para sua casa e jardim.
              </p>
            </div>

            {/* 4 feature icons */}
            <div className="grid grid-cols-2 gap-4">
              {aboutFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 will-change-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-lighter flex items-center justify-center text-brand-main shrink-0">
                    {featureIcons[f.title]}
                  </div>
                  <span className="text-sm font-semibold text-brand-dark">{f.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
