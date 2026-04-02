"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteData } from "@/lib/DataContext";

function CountUpNumber({ end, decimals = 0 }: { end: number; decimals?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const animatedRef = useRef(false);

  useEffect(() => {
    if (inView && !animatedRef.current) {
      animatedRef.current = true;
      const duration = 1500;
      const startTime = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(parseFloat((eased * end).toFixed(decimals)));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, decimals]);

  return <span ref={ref}>{count}</span>;
}

export default function HeroSection() {
  const { companyData } = useSiteData();
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      const handleCanPlay = () => setLoaded(true);
      video.addEventListener("canplaythrough", handleCanPlay);
      // Fallback in case event doesn't fire
      const timer = setTimeout(() => setLoaded(true), 2000);
      return () => {
        video.removeEventListener("canplaythrough", handleCanPlay);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[100vh] flex items-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, rgba(26, 60, 26, 0.85) 0%, rgba(26, 60, 26, 0.5) 35%, rgba(26, 60, 26, 0.3) 70%)`,
        }}
      />

      {/* Top gradient for header readability */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(26,60,26,0.5) 0%, transparent 100%)",
        }}
      />

      {/* Loading overlay — fades out when loaded */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 z-[2] bg-brand-dark flex items-center justify-center ${loaded ? "pointer-events-none" : ""}`}
      >
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-white/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Carregando...</p>
        </div>
      </motion.div>

      {/* Content overlay — left side */}
      <div className="relative z-[3] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-2xl"
          >
            Agrocomercial{" "}
            <span className="text-brand-gold drop-shadow-lg">Carvalho</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed drop-shadow-md"
          >
            Sua loja agropecuária de confiança em Vera Cruz – RS
          </motion.p>

          {/* CTA + Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href={companyData.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold px-7 py-3.5 rounded-xl text-base transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/30 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
              Fale Conosco
            </a>

            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/15 px-5 py-3 rounded-xl shadow-lg">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-white text-sm">
                <span className="font-bold"><CountUpNumber end={companyData.rating} decimals={1} /></span>
                <span className="text-white/50 ml-1">
                  / <CountUpNumber end={companyData.reviewCount} decimals={0} /> reviews
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 z-[4]">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
          <path d="M0 80V40C240 10 480 0 720 10C960 20 1200 50 1440 40V80H0Z" fill="#f5f5f0" />
        </svg>
      </div>
    </section>
  );
}
