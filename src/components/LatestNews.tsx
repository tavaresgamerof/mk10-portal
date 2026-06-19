"use client";

import { useState, useEffect } from "react";
import { Eye, User, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "./animations/ScrollReveal";

interface News {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  views: number;
  image: string;
}

function loadNews(): News[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("mk10_news");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function formatViews(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export function LatestNews() {
  const [news, setNews] = useState<News[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setNews(loadNews()); }, []);

  if (news.length === 0) return null;

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Ultimas Noticias</h2>
            <p className="text-text-muted">Fique por dentro de tudo</p>
          </div>
          <Link href="/news" className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors">
            Ver Todas <ChevronRight size={16} />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <article className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover group cursor-pointer">
          <Link href={`/news/${featured.id}`} className="block">
            <div className="relative h-64 overflow-hidden">
            {featured.image ? (
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-dark-surface flex items-center justify-center text-text-muted">Sem imagem</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-primary/90 text-background text-xs font-bold px-3 py-1.5 rounded-lg">{featured.category}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-bold text-2xl leading-tight mb-2 group-hover:text-primary transition-colors">{featured.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User size={12} />{featured.author}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{featured.date}</span>
                <span className="flex items-center gap-1"><Eye size={12} />{formatViews(featured.views)}</span>
              </div>
            </div>
            </div>
          </Link>
        </article>

        {rest.slice(0, 2).map((item) => (
          <Link href={`/news/${item.id}`} key={item.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover group cursor-pointer flex h-full">
            <div className="relative w-48 flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-dark-surface flex items-center justify-center text-text-muted text-xs">Sem foto</div>
              )}
            </div>
            <div className="p-5 flex flex-col justify-center">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded w-fit mb-2">{item.category}</span>
              <h3 className="text-white font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><User size={10} />{item.author}</span>
                <span className="flex items-center gap-1"><Eye size={10} />{formatViews(item.views)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
