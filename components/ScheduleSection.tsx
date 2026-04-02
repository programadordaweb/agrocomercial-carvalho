"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { schedule } from "@/lib/data";

function useIsOpen() {
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

  return isOpen;
}

export default function ScheduleSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const isOpen = useIsOpen();

  // Collapse schedule: Mon-Fri grouped, Sat, Sun
  const grouped = [
    { day: "Segunda a Sexta", hours: "08:00 – 19:00", open: true },
    { day: "Sábado", hours: "08:00 – 17:00", open: true },
    { day: "Domingo", hours: "Fechado", open: false },
  ];

  return (
    <section id="horarios" className="py-20 sm:py-28 bg-brand-cream">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8 pb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark">
              Horário de Atendimento
            </h2>
            <div
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              {isOpen ? "ABERTO AGORA" : "FECHADO AGORA"}
            </div>
          </div>

          {/* Rows */}
          <div className="px-8 pb-8">
            {grouped.map((item, i) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                className={`flex items-center justify-between py-4 ${
                  i < grouped.length - 1 ? "border-b border-gray-100" : ""
                } will-change-transform`}
              >
                <span className={`font-medium ${item.open ? "text-brand-dark" : "text-gray-400"}`}>
                  {item.day}
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                    item.open
                      ? "bg-brand-lighter text-brand-main"
                      : "bg-red-50 text-red-400"
                  }`}
                >
                  {item.hours}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
