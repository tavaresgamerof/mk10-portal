"use client";

import { useState, useEffect } from "react";
import { Camera, Play, Download, Crown, Lock } from "lucide-react";
import { useVip } from "@/lib/VipContext";

interface GalleryVideo {
  id: number;
  title: string;
  category: string;
  duration: string;
  videoId: string;
  thumbnail: string;
}

function loadVideos(): GalleryVideo[] {
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

function DownloadButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex items-center gap-1.5 bg-gold hover:bg-gold-light text-background text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
      title={label}
    >
      <Download size={12} />
      {label}
    </button>
  );
}

function VipBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
      <Crown size={10} />
      VIP
    </span>
  );
}

export default function GaleriaPage() {
  const [tab, setTab] = useState<"fotos" | "videos">("fotos");
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const { isVip, setShowLoginModal } = useVip();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setVideos(loadVideos()); }, []);

  const handleDownloadVideo = (video: GalleryVideo) => {
    if (!isVip) {
      setShowLoginModal(true);
      return;
    }
    window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
  };

  const getTabButtonClass = (tabName: "fotos" | "videos") => {
    const base = "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ";
    if (tab === tabName) return base + "bg-primary text-background";
    return base + "bg-dark-card border border-dark-border text-text-muted hover:text-foreground";
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-blue-neon/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Galeria</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Fotos e videos dos melhores momentos do esporte de base.
          </p>
          {!isVip && videos.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-xl text-sm">
              <Lock size={14} />
              <span>Fique VIP para baixar conteudo em alta qualidade</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center gap-4 mb-10">
          <button onClick={() => setTab("fotos")} className={getTabButtonClass("fotos")}>
            <Camera size={18} /> Fotos
          </button>
          <button onClick={() => setTab("videos")} className={getTabButtonClass("videos")}>
            <Play size={18} /> Videos
          </button>
        </div>

        {tab === "videos" && (
          videos.length === 0 ? (
            <div className="text-center py-20">
              <Play size={48} className="text-text-muted mx-auto mb-4" />
              <p className="text-text-muted text-lg mb-2">Nenhum video na galeria</p>
              <p className="text-text-muted text-sm">Os videos aparecerao aqui depois de cadastrados no painel admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const thumb = video.thumbnail || (video.videoId ? `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg` : "");
                return (
                  <div key={video.id} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden card-hover group cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-dark-surface flex items-center justify-center text-text-muted">Sem thumbnail</div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center glow-primary">
                          <Play size={24} fill="currentColor" className="text-background ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <VipBadge />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm group-hover:text-primary transition-colors mb-3">{video.title}</h3>
                      <div className="flex items-center gap-2">
                        <DownloadButton
                          onClick={() => handleDownloadVideo(video)}
                          label={isVip ? "Baixar" : "VIP para baixar"}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === "fotos" && (
          <div className="text-center py-20">
            <Camera size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-2">Galeria de fotos em breve</p>
            <p className="text-text-muted text-sm">Fotos dos bastidores e jogos serao disponibilizadas em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
