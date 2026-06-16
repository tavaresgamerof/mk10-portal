"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { ImageUpload } from "@/components/upload/ImageUpload";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  site: string;
  logo: string;
  logoText: string;
}

const STORAGE_KEY = "mk10_sponsors";

function loadSponsors(): Sponsor[] {
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

function saveSponsors(list: Sponsor[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

const tierColorMap: Record<string, string> = {
  Master: "bg-gold/10 text-gold border-gold/30",
  Ouro: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  Prata: "bg-gray-400/10 text-gray-400 border-gray-400/30",
  Parceiro: "bg-blue-neon/10 text-blue-neon border-blue-neon/30",
};

export default function AdminPatrocinadoresPage() {
  const [list, setList] = useState<Sponsor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", tier: "Prata", site: "", logo: "" });

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setList(loadSponsors()); }, []);

  const handleCreate = () => {
    if (!form.name) return;
    const updated = [{ id: Date.now(), name: form.name, tier: form.tier, site: form.site, logo: form.logo, logoText: form.name }, ...list];
    setList(updated);
    saveSponsors(updated);
    setForm({ name: "", tier: "Prata", site: "", logo: "" });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    const updated = list.filter((s) => s.id !== id);
    setList(updated);
    saveSponsors(updated);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Patrocinadores</h1>
          <p className="text-text-muted">Adicione e gerencie seus patrocinadores</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={16} /> Novo Patrocinador
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Novo Patrocinador</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Nome da empresa" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
              <select value={form.tier} onChange={(e) => setForm({...form, tier: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
                <option>Master</option>
                <option>Ouro</option>
                <option>Prata</option>
                <option>Parceiro</option>
              </select>
              <input type="url" placeholder="Site oficial" value={form.site} onChange={(e) => setForm({...form, site: e.target.value})} className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
            </div>
            <div>
              <ImageUpload value={form.logo} onChange={(img) => setForm({...form, logo: img})} label="Logo do Patrocinador" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleCreate} className="bg-primary hover:bg-primary-dark text-background font-bold px-6 py-2.5 rounded-xl text-sm transition-all">Salvar</button>
            <button onClick={() => setShowForm(false)} className="bg-dark-surface border border-dark-border text-text-muted px-6 py-2.5 rounded-xl text-sm transition-all hover:text-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((sponsor) => (
          <div key={sponsor.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-dark-surface rounded-xl flex items-center justify-center overflow-hidden">
                {sponsor.logo ? (
                  <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-text-muted font-bold text-sm">{sponsor.logoText}</span>
                )}
              </div>
              <span className={"text-xs px-2.5 py-1 rounded-lg font-medium border " + tierColorMap[sponsor.tier]}>
                {sponsor.tier}
              </span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">{sponsor.name}</h3>
            {sponsor.site && (
              <a href={sponsor.site} target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs flex items-center gap-1 hover:text-primary transition-colors">
                <ExternalLink size={12} />{sponsor.site}
              </a>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 bg-dark-surface border border-dark-border text-text-muted hover:text-primary py-2 rounded-xl text-xs font-medium transition-all hover:border-primary/30 flex items-center justify-center gap-1">
                <Edit size={12} /> Editar
              </button>
              <button onClick={() => handleDelete(sponsor.id)} className="flex-1 bg-dark-surface border border-dark-border text-text-muted hover:text-red-400 py-2 rounded-xl text-xs font-medium transition-all hover:border-red-400/30 flex items-center justify-center gap-1">
                <Trash2 size={12} /> Remover
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
            <p className="text-text-muted">Nenhum patrocinador cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
