"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Esporte de Base",
    subtitle: "Valorizando talentos",
    description: "O MK10TV nasceu para contar historias do esporte de base. Assista nossas transmissoes e entrevistas exclusivas.",
    cta: "Assistir Agora",
    ctaLink: "/ao-vivo",
    gradient: "from-red-900/80 via-rose-900/60 to-transparent",
    badge: "MK10TV",
  },
  {
    title: "Papo de Base",
    subtitle: "Entrevistas exclusivas",
    description: "Conversamos com jovens atletas, treinadores e lideres do esporte base brasileiro.",
    cta: "Ver Videos",
    ctaLink: "/galeria",
    gradient: "from-blue-900/80 via-indigo-900/60 to-transparent",
    badge: "ENTREVISTAS",
  },
  {
    title: "Seja Nosso Parceiro",
    subtitle: "Divulgue seu esporte",
    description: "Leve seu time ou escolinha para milhares de torcedores. Parcerias que transformam o esporte de base.",
    cta: "Saiba Mais",
    ctaLink: "/transmita",
    gradient: "from-slate-900/80 via-blue-900/60 to-transparent",
    badge: "PARCERIAS",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: client-only mount flag
    setMounted(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  if (!mounted) {
    return (
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-rose-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4">
              MK10TV
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-white leading-tight mb-2">
              {slides[0].title}
            </h2>
            <p className="text-lg lg:text-2xl text-gold font-semibold mb-4">
              {slides[0].subtitle}
            </p>
            <p className="text-text-muted text-base sm:text-lg mb-6 sm:mb-8 max-w-xl">
              {slides[0].description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80')`,
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4"
            >
              {slide.badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-6xl font-bold text-white leading-tight mb-2"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg lg:text-2xl text-gold font-semibold mb-4"
            >
              {slide.subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-text-muted text-base sm:text-lg mb-6 sm:mb-8 max-w-xl"
            >
              {slide.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={slide.ctaLink}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg transition-all glow-green"
              >
                <Play size={20} fill="currentColor" />
                {slide.cta}
              </Link>
              <Link
                href="/ao-vivo"
                className="flex items-center gap-2 border border-dark-border bg-dark-card/50 backdrop-blur-sm text-foreground font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg hover:border-primary/30 transition-all"
              >
                <Calendar size={20} />
                Ver Agenda
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-4 bg-dark-border hover:bg-dark-border/80"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-full flex items-center justify-center text-foreground hover:border-primary/30 hover:scale-110 transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-full flex items-center justify-center text-foreground hover:border-primary/30 hover:scale-110 transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
