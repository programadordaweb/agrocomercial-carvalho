"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSiteData } from "@/components/SiteClient";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
};

const avatarColors = [
  "bg-brand-main",
  "bg-brand-gold",
  "bg-brand-earth",
  "bg-brand-light",
  "bg-brand-dark",
];

export default function ReviewsSection() {
  const { reviews } = useSiteData();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = useCallback((dir: number) => {
    setCurrent(([prev]) => [(prev + dir + reviews.length) % reviews.length, dir]);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => paginate(1), 4500);
    return () => clearInterval(timer);
  }, [inView, paginate]);

  const review = reviews[current];

  return (
    <section id="avaliacoes" className="py-20 sm:py-28 bg-brand-dark relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            O que nossos clientes dizem
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full" />
        </motion.div>

        {/* Carousel */}
        <div className="relative min-h-[260px] flex items-center justify-center">
          {/* Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 hidden sm:flex"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10 hidden sm:flex"
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" as const }}
              className="w-full"
            >
              <div className="bg-brand-main/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-10 max-w-lg mx-auto text-center">
                {/* Avatar */}
                <div
                  className={`w-14 h-14 ${avatarColors[current % avatarColors.length]} rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white/10`}
                >
                  <span className="text-white font-bold text-lg">
                    {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>

                <p className="text-white/90 text-lg italic mb-5 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-brand-gold font-semibold text-sm uppercase tracking-wider">
                  {review.name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-brand-gold w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Avaliação ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
