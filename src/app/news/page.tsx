"use client";

import { useState, useEffect } from "react";
import { Eye, User, Search, Clock, Tag, Newspaper } from "lucide-react";
import Link from "next/link";

interface News {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  views: number;
  image: string;
  content: string;
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

export default function NewsPage() {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setAllNews(loadNews()); }, []);

  const categories = ["Todos", ...Array.from(new Set(allNews.map((n) => n.category)))];

  const filtered = allNews.filter((n) => {
    const matchCategory = activeCategory === "Todos" || n.category === activeCategory;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Noticias</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
            Fique por dentro de tudo que acontece no mundo do esporte de base.
          </p>
          {allNews.length > 0 && (
            <div className="max-w-xl mx-auto relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar noticias..."
                className="w-full bg-dark-card border border-dark-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {allNews.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-2">Nenhuma noticia publicada</p>
            <p className="text-text-muted text-sm">As noticias aparecerao aqui depois que forem publicadas no painel admin.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activeCategory === cat ? "bg-primary text-background" : "bg-dark-card border border-dark-border text-text-muted hover:text-foreground hover:border-primary/30")}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover group cursor-pointer">
                  <div className="relative h-52 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-dark-surface flex items-center justify-center text-text-muted">Sem imagem</div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary/90 text-background text-xs font-bold px-2.5 py-1 rounded-lg">{item.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><User size={12} />{item.author}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{item.date}</span>
                      </div>
                      <span className="flex items-center gap-1"><Eye size={12} />{formatViews(item.views)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Tag size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-muted text-lg">Nenhuma noticia encontrada.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
