"use client";

import { Eye, Maximize2, Volume2, VolumeX, Radio, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import type { YouTubeChannelState } from "@/lib/youtube";

export function LiveIndicator() {
  const [isMuted, setIsMuted] = useState(true);
  const [channelData, setChannelData] = useState<YouTubeChannelState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("/api/youtube", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setChannelData(data);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  const isLive = channelData?.isLive ?? false;
  const videoId = channelData?.liveVideoId ?? channelData?.latestVideo?.videoId;
  const videoTitle = channelData?.latestVideo?.title ?? "MK10 Tv";

  const embedUrl = isLive && videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`
    : videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`
      : `https://www.youtube.com/embed/live_stream?channel=UCwehhoJDFXjg7bcKB22JS2g&autoplay=1&mute=1&rel=0&modestbranding=1`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-16">
      <div className={`bg-dark-card border rounded-2xl overflow-hidden glow-primary ${isLive ? "border-red-500/40" : "border-dark-border"}`}>
        <div className="p-4 border-b border-dark-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse-live" />
                AO VIVO
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-dark-surface border border-dark-border text-text-muted px-4 py-2 rounded-lg text-sm font-bold">
                <Radio size={14} />
                {loading ? "Carregando..." : "Offline"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-text-muted">
            {isLive && (
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>Assistindo agora</span>
              </div>
            )}
            <a
              href={`https://www.youtube.com/channel/UCwehhoJDFXjg7bcKB22JS2g`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink size={12} />
              <span>@mk10produtora</span>
            </a>
          </div>
        </div>

        <div className="relative aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={videoTitle}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 max-w-[70%]">
            <h3 className="text-white font-bold text-lg line-clamp-1">{videoTitle}</h3>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/90 transition-all"
              title={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-black/90 transition-all"
              title="Tela cheia"
              onClick={() => {
                const iframe = document.querySelector('iframe[title="' + videoTitle + '"]') as HTMLIFrameElement;
                if (iframe?.requestFullscreen) iframe.requestFullscreen();
              }}
            >
              <Maximize2 size={18} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isLive && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
                    LIVE
                  </span>
                )}
                <span className="text-white text-sm font-medium line-clamp-1">{videoTitle}</span>
              </div>
              <a
                href="/ao-vivo"
                className="bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2 rounded-lg text-sm transition-all flex-shrink-0"
              >
                Tela Cheia
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
