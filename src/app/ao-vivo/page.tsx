"use client";

import { useState, useEffect } from "react";
import { Play, MessageSquare, Radio, ExternalLink, Clock } from "lucide-react";
import type { YouTubeChannelState, YouTubeVideo } from "@/lib/youtube";

export default function AoVivoPage() {
  const [chatInput, setChatInput] = useState("");
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
  const recentVideos = channelData?.recentVideos ?? [];

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`
    : `https://www.youtube.com/embed/live_stream?channel=UCwehhoJDFXjg7bcKB22JS2g&autoplay=1&mute=1&rel=0&modestbranding=1`;

  function formatPublishedDate(dateStr: string) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) return "Agora mesmo";
      if (hours < 24) return `Ha ${hours}h`;
      const days = Math.floor(hours / 24);
      return `Ha ${days}d`;
    } catch {
      return "";
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {isLive ? (
            <span className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
              <Radio size={16} className="animate-pulse-live" />
              AO VIVO
            </span>
          ) : (
            <span className="flex items-center gap-2 bg-dark-surface border border-dark-border text-text-muted px-4 py-2 rounded-lg text-sm font-bold">
              <Radio size={16} />
              {loading ? "Carregando..." : "Canal offline"}
            </span>
          )}
          <a
            href="https://www.youtube.com/channel/UCwehhoJDFXjg7bcKB22JS2g"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ExternalLink size={14} />
            @mk10produtora
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  src={embedUrl}
                  title={videoTitle}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 max-w-[80%]">
                  <h3 className="text-white font-bold text-lg line-clamp-1">{videoTitle}</h3>
                </div>

                {isLive && (
                  <div className="absolute top-4 right-4 bg-red-600 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
                    <span className="text-sm text-white font-bold">LIVE</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-dark-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isLive ? (
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse-live" />
                        AO VIVO
                      </span>
                    ) : (
                      <span className="bg-dark-surface text-text-muted text-xs font-bold px-3 py-1 rounded-lg">
                        OFFLINE
                      </span>
                    )}
                    <span className="text-white text-sm font-medium">{videoTitle}</span>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-primary text-sm flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink size={12} />
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Radio size={18} className={isLive ? "text-red-500" : "text-text-muted"} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{isLive ? "Transmitindo Agora" : "Canal Offline"}</p>
                  <p className="text-text-muted text-xs">@mk10produtora</p>
                </div>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Ultimo video</p>
                  <p className="text-text-muted text-xs">{formatPublishedDate(channelData?.latestVideo?.publishedAt ?? "")}</p>
                </div>
              </div>
            </div>

            {recentVideos.length > 0 && (
              <div className="mt-6 bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Videos Recentes do Canal</h3>
                <div className="space-y-3">
                  {recentVideos.map((video: YouTubeVideo) => (
                    <a
                      key={video.videoId}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-surface transition-colors group"
                    >
                      <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        {video.isLive && (
                          <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-live" />
                            LIVE
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
                        <p className="text-text-muted text-xs mt-1">{formatPublishedDate(video.publishedAt)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border rounded-2xl h-full flex flex-col" style={{ minHeight: "400px", height: "calc(100vh - 160px)" }}>
              <div className="p-4 border-b border-dark-border flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                <h3 className="text-white font-bold">Chat Ao Vivo</h3>
                <span className="text-text-muted text-xs ml-auto">Chat do YouTube</span>
              </div>

              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare size={40} className="text-text-muted/30 mx-auto mb-4" />
                  <p className="text-text-muted text-sm mb-4">O chat esta disponivel diretamente no YouTube</p>
                  <a
                    href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : "https://www.youtube.com/channel/UCwehhoJDFXjg7bcKB22JS2g"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                  >
                    <Play size={16} fill="currentColor" />
                    Abrir no YouTube
                  </a>
                </div>
              </div>

              <div className="p-4 border-t border-dark-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Comente no YouTube..."
                    className="flex-1 bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    readOnly
                  />
                  <a
                    href={videoId ? `https://www.youtube.com/watch?v=${videoId}` : "https://www.youtube.com/channel/UCwehhoJDFXjg7bcKB22JS2g"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex-shrink-0"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
