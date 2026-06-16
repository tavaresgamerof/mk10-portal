"use client";

import { useState, useEffect } from "react";
import { Play, Eye } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "./animations/ScrollReveal";

interface Video {
  id: number;
  title: string;
  category: string;
  duration: string;
  views: number;
  videoId: string;
  thumbnail: string;
}

function loadVideos(): Video[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("mk10_videos");
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

export function VideoHighlights() {
  const [videos, setVideos] = useState<Video[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setVideos(loadVideos()); }, []);

  if (videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Destaques em Video</h2>
            <p className="text-text-muted">Os melhores momentos e analises</p>
          </div>
          <Link href="/galeria" className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors">
            Ver Todos
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.slice(0, 4).map((video) => {
          const thumb = video.thumbnail || (video.videoId ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` : "");
          return (
            <div key={video.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover group cursor-pointer h-full">
              <div className="relative h-44 overflow-hidden">
                {thumb ? (
                  <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-dark-surface flex items-center justify-center text-text-muted text-sm">Sem thumbnail</div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center glow-primary">
                    <Play size={24} fill="currentColor" className="text-background ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Eye size={12} />
                  <span>{formatViews(video.views)} visualizacoes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
