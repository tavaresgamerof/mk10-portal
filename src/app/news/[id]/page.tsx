"use client";

import { useState, useEffect, use } from "react";
import { Eye, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface News {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
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

function incrementViews(id: number): News | null {
  const news = loadNews();
  const item = news.find((n) => n.id === id);
  if (!item) return null;
  const updated = news.map((n) => n.id === id ? { ...n, views: n.views + 1 } : n);
  try { localStorage.setItem("mk10_news", JSON.stringify(updated)); } catch {}
  return { ...item, views: item.views + 1 };
}

export default function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<News | null>(null);

  useEffect(() => {
    const found = incrementViews(Number(id));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    setArticle(found);
  }, [id]);

  if (!article) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">Noticia nao encontrada</p>
          <Link href="/news" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2 justify-center">
            <ArrowLeft size={16} /> Voltar as noticias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/news" className="text-text-muted hover:text-foreground text-sm font-medium flex items-center gap-2 mb-6 transition-colors">
            <ArrowLeft size={16} /> Voltar as noticias
          </Link>
          <span className="bg-primary/90 text-background text-xs font-bold px-3 py-1.5 rounded-lg">{article.category}</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mt-4 mb-4 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5"><User size={14} />{article.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} />{article.date}</span>
            <span className="flex items-center gap-1.5"><Eye size={14} />{article.views.toLocaleString()} visualizacoes</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {article.image && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-dark-border">
            <img src={article.image} alt={article.title} className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        {article.content ? (
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-base">{article.content}</div>
          </div>
        ) : (
          <p className="text-text-muted italic">Esta noticia ainda nao possui conteudo completo.</p>
        )}

        <div className="mt-12 pt-8 border-t border-dark-border">
          <Link href="/news" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Ver todas as noticias
          </Link>
        </div>
      </div>
    </div>
  );
}
