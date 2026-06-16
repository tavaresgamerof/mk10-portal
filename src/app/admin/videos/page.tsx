"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react";
import { VideoUpload } from "@/components/upload/VideoUpload";
import { ImageUpload } from "@/components/upload/ImageUpload";

interface Video {
  id: number;
  title: string;
  category: string;
  duration: string;
  views: number;
  featured: boolean;
  videoId: string;
  thumbnail: string;
  videoFile: string;
}

const STORAGE_KEY = "mk10_videos";

function loadVideos(): Video[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveVideos(list: Video[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

export default function AdminVideosPage() {
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Melhores Momentos", videoId: "", thumbnail: "", videoFile: "" });
  const [uploadMode, setUploadMode] = useState<"youtube" | "upload">("youtube");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setVideosList(loadVideos()); }, []);

  const handleCreate = () => {
    if (!form.title) return;
    if (uploadMode === "youtube" && !form.videoId) return;
    if (uploadMode === "upload" && !form.videoFile) return;
    const updated = [
      { id: Date.now(), title: form.title, category: form.category, duration: "00:00", views: 0, featured: false, videoId: form.videoId, thumbnail: form.thumbnail, videoFile: form.videoFile },
      ...videosList,
    ];
    setVideosList(updated);
    saveVideos(updated);
    setForm({ title: "", category: "Melhores Momentos", videoId: "", thumbnail: "", videoFile: "" });
    setShowForm(false);
  };

  const toggleFeatured = (id: number) => {
    const updated = videosList.map((v) => v.id === id ? { ...v, featured: !v.featured } : v);
    setVideosList(updated);
    saveVideos(updated);
  };

  const handleDelete = (id: number) => {
    const updated = videosList.filter((v) => v.id !== id);
    setVideosList(updated);
    saveVideos(updated);
  };

  const getVideoThumb = (video: Video) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.videoId) return `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
    return "";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Videos</h1>
          <p className="text-text-muted">Adicione e gerencie seus videos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={16} /> Novo Video
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Novo Video</h3>
          <div className="flex gap-2 mb-6">
            <button onClick={() => setUploadMode("youtube")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${uploadMode === "youtube" ? "bg-primary text-background" : "bg-dark-surface text-text-muted hover:text-foreground"}`}>
              YouTube
            </button>
            <button onClick={() => setUploadMode("upload")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${uploadMode === "upload" ? "bg-primary text-background" : "bg-dark-surface text-text-muted hover:text-foreground"}`}>
              Enviar Video
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Titulo do video" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
                <option>Melhores Momentos</option>
                <option>Entrevistas</option>
                <option>Compilacoes</option>
                <option>Analises</option>
              </select>
              {uploadMode === "youtube" ? (
                <input type="text" placeholder="ID do video YouTube" value={form.videoId} onChange={(e) => setForm({...form, videoId: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              ) : (
                <VideoUpload value={form.videoFile} onChange={(v) => setForm({...form, videoFile: v})} label="Video" />
              )}
            </div>
            <div>
              <ImageUpload value={form.thumbnail} onChange={(img) => setForm({...form, thumbnail: img})} label="Thumbnail (opcional)" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleCreate} className="bg-primary hover:bg-primary-dark text-background font-bold px-6 py-2.5 rounded-xl text-sm transition-all">Adicionar</button>
            <button onClick={() => setShowForm(false)} className="bg-dark-surface border border-dark-border text-text-muted px-6 py-2.5 rounded-xl text-sm transition-all hover:text-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videosList.map((video) => (
          <div key={video.id} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex gap-4 card-hover">
            <div className="w-40 h-24 bg-dark-surface rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
              {getVideoThumb(video) ? (
                <img src={getVideoThumb(video)} alt={video.title} className="w-full h-full object-cover" />
              ) : video.videoFile ? (
                <video src={video.videoFile} className="w-full h-full object-cover" />
              ) : (
                <span className="text-text-muted text-xs">Sem thumbnail</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm line-clamp-1">{video.title}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{video.category}</span>
                <span>{video.duration}</span>
                <span className="flex items-center gap-1"><Eye size={12} />{video.views.toLocaleString()}</span>
                {video.videoFile && <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Arquivo local</span>}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => toggleFeatured(video.id)} className={"p-1.5 rounded-lg transition-all " + (video.featured ? "bg-gold/20 text-gold" : "bg-dark-surface text-text-muted hover:text-gold")}>
                  <Star size={14} fill={video.featured ? "currentColor" : "none"} />
                </button>
                <button className="p-1.5 bg-dark-surface text-text-muted hover:text-primary rounded-lg transition-all"><Edit size={14} /></button>
                <button onClick={() => handleDelete(video.id)} className="p-1.5 bg-dark-surface text-text-muted hover:text-red-400 rounded-lg transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {videosList.length === 0 && (
          <div className="col-span-full bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
            <p className="text-text-muted">Nenhum video cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
