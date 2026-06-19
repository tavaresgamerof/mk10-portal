"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Clock, Search } from "lucide-react";
import { ImageUpload } from "@/components/upload/ImageUpload";

interface News {
  id: number;
  title: string;
  author: string;
  category: string;
  content: string;
  status: string;
  date: string;
  views: number;
  image: string;
}

const STORAGE_KEY = "mk10_news";

function loadNews(): News[] {
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

function saveNews(list: News[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

const getStatusClass = (status: string) => {
  if (status === "publicado") return "bg-blue-500/10 text-blue-400";
  if (status === "agendado") return "bg-yellow-500/10 text-yellow-400";
  return "bg-gray-500/10 text-gray-400";
};

export default function AdminNewsPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newsList, setNewsList] = useState<News[]>([]);
  const [form, setForm] = useState({ title: "", author: "", category: "Brasileirao", content: "", image: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setNewsList(loadNews()); }, []);

  const filtered = newsList.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!form.title || !form.author) return;
    if (editingId !== null) {
      const updated = newsList.map((n) => n.id === editingId ? { ...n, title: form.title, author: form.author, category: form.category, content: form.content, image: form.image } : n);
      setNewsList(updated);
      saveNews(updated);
      setEditingId(null);
    } else {
      const updated = [
        { id: Date.now(), title: form.title, author: form.author, category: form.category, content: form.content, status: "rascunho", date: new Date().toLocaleDateString("pt-BR"), views: 0, image: form.image },
        ...newsList,
      ];
      setNewsList(updated);
      saveNews(updated);
    }
    setForm({ title: "", author: "", category: "Brasileirao", content: "", image: "" });
    setShowForm(false);
  };

  const handleEdit = (item: News) => {
    setForm({ title: item.title, author: item.author, category: item.category, content: item.content || "", image: item.image });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const updated = newsList.filter((n) => n.id !== id);
    setNewsList(updated);
    saveNews(updated);
  };

  const handlePublish = (id: number) => {
    const updated = newsList.map((n) => n.id === id ? { ...n, status: n.status === "publicado" ? "rascunho" : "publicado" } : n);
    setNewsList(updated);
    saveNews(updated);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Noticias</h1>
          <p className="text-text-muted">Crie, edite e gerencie suas noticias</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={16} /> Nova Noticia
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">{editingId !== null ? "Editar Noticia" : "Nova Noticia"}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Titulo da noticia" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
                <input type="text" placeholder="Autor" value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
                <option>Brasileirao</option>
                <option>Europa</option>
                <option>Transferencias</option>
                <option>Selecao</option>
                <option>Libertadores</option>
                <option>Copa do Brasil</option>
                <option>Destaque</option>
              </select>
              <textarea placeholder="Conteudo da noticia..." rows={6} value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none" />
            </div>
            <div>
              <ImageUpload value={form.image} onChange={(img) => setForm({...form, image: img})} label="Imagem da Noticia" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleCreate} className="bg-primary hover:bg-primary-dark text-background font-bold px-6 py-2.5 rounded-xl text-sm transition-all">{editingId !== null ? "Salvar Alteracoes" : "Publicar"}</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ title: "", author: "", category: "Brasileirao", content: "", image: "" }); }} className="bg-dark-surface border border-dark-border text-text-muted px-6 py-2.5 rounded-xl text-sm transition-all hover:text-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar noticias..." className="w-full bg-dark-card border border-dark-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-6 py-4 text-text-muted font-medium">Noticia</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium hidden md:table-cell">Autor</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium hidden lg:table-cell">Categoria</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium">Status</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium hidden md:table-cell">Views</th>
                <th className="text-right px-6 py-4 text-text-muted font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-dark-surface rounded-lg flex items-center justify-center">
                          <span className="text-text-muted text-xs">Sem foto</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium line-clamp-1">{item.title}</p>
                        <p className="text-text-muted text-xs flex items-center gap-1 mt-1"><Clock size={10} />{item.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted hidden md:table-cell">{item.author}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-lg">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handlePublish(item.id)} className={"text-xs px-2 py-1 rounded-lg font-medium cursor-pointer transition-all hover:opacity-80 " + getStatusClass(item.status)}>
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-text-muted hidden md:table-cell">
                    <span className="flex items-center gap-1"><Eye size={12} />{item.views.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    {search ? "Nenhuma noticia encontrada" : "Nenhuma noticia cadastrada"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
