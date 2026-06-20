"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Radio, Power, Clock } from "lucide-react";

interface Broadcast {
  id: number;
  homeTeam: string;
  awayTeam: string;
  championship: string;
  date: string;
  time: string;
  status: string;
  viewers: number;
}

const STORAGE_KEY = "mk10_broadcasts";

function loadBroadcasts(): Broadcast[] {
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

function saveBroadcasts(list: Broadcast[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

const getStatusStyle = (status: string) => {
  if (status === "ao_vivo") return "bg-red-500/10 text-red-400";
  if (status === "agendado") return "bg-yellow-500/10 text-yellow-400";
  return "bg-gray-500/10 text-gray-400";
};

const getStatusLabel = (status: string) => {
  if (status === "ao_vivo") return "AO VIVO";
  if (status === "agendado") return "Agendado";
  return "Finalizado";
};

export default function AdminTransmissoesPage() {
  const [list, setList] = useState<Broadcast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ homeTeam: "", awayTeam: "", championship: "Brasileirao Serie A", date: "", time: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setList(loadBroadcasts()); }, []);

  const handleCreate = () => {
    if (!form.homeTeam || !form.awayTeam) { alert("Preencha os dois times antes de agendar."); return; }
    if (editingId !== null) {
      const updated = list.map((b) => b.id === editingId ? { ...b, ...form } : b);
      setList(updated);
      saveBroadcasts(updated);
      setEditingId(null);
    } else {
      const updated = [{ id: Date.now(), ...form, status: "agendado", viewers: 0 }, ...list];
      setList(updated);
      saveBroadcasts(updated);
    }
    setForm({ homeTeam: "", awayTeam: "", championship: "Brasileirao Serie A", date: "", time: "" });
    setShowForm(false);
  };

  const handleEdit = (item: Broadcast) => {
    setForm({ homeTeam: item.homeTeam, awayTeam: item.awayTeam, championship: item.championship, date: item.date, time: item.time });
    setEditingId(item.id);
    setShowForm(true);
  };

  const toggleLive = (id: number) => {
    const updated = list.map((b) => {
      if (b.id !== id) return b;
      if (b.status === "ao_vivo") return { ...b, status: "finalizado", viewers: 0 };
      return { ...b, status: "ao_vivo", viewers: Math.floor(Math.random() * 15000) };
    });
    setList(updated);
    saveBroadcasts(updated);
  };

  const handleDelete = (id: number) => {
    const updated = list.filter((b) => b.id !== id);
    setList(updated);
    saveBroadcasts(updated);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Transmissoes</h1>
          <p className="text-text-muted">Crie e gerencie suas transmissoes ao vivo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
          <Plus size={16} /> Nova Transmissao
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">{editingId !== null ? "Editar Transmissao" : "Nova Transmissao"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input type="text" placeholder="Time da casa *" value={form.homeTeam} onChange={(e) => setForm({...form, homeTeam: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
            <input type="text" placeholder="Time visitante *" value={form.awayTeam} onChange={(e) => setForm({...form, awayTeam: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
            <select value={form.championship} onChange={(e) => setForm({...form, championship: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
              <option>Brasileirao Serie A</option>
              <option>Brasileirao Serie B</option>
              <option>Copa do Brasil</option>
              <option>Libertadores</option>
              <option>Champions League</option>
              <option>Premier League</option>
              <option>La Liga</option>
              <option>Serie A</option>
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="bg-primary hover:bg-primary-dark text-background font-bold px-6 py-2.5 rounded-xl text-sm transition-all">{editingId !== null ? "Salvar Alteracoes" : "Agendar"}</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ homeTeam: "", awayTeam: "", championship: "Brasileirao Serie A", date: "", time: "" }); }} className="bg-dark-surface border border-dark-border text-text-muted px-6 py-2.5 rounded-xl text-sm transition-all hover:text-foreground">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left px-6 py-4 text-text-muted font-medium">Jogo</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium hidden md:table-cell">Campeonato</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium">Data/Hora</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium">Status</th>
                <th className="text-left px-6 py-4 text-text-muted font-medium hidden md:table-cell">Viewers</th>
                <th className="text-right px-6 py-4 text-text-muted font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{item.homeTeam} x {item.awayTeam}</p>
                  </td>
                  <td className="px-6 py-4 text-text-muted hidden md:table-cell">{item.championship}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-text-muted text-xs"><Clock size={12} />{item.date} {item.time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={"text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 w-fit " + getStatusStyle(item.status)}>
                      {item.status === "ao_vivo" && <Radio size={10} className="animate-pulse-live" />}
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted hidden md:table-cell">{item.viewers.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleLive(item.id)} className={"p-2 rounded-lg transition-all " + (item.status === "ao_vivo" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-dark-surface text-text-muted hover:text-primary hover:bg-primary/10")}>
                        <Power size={14} />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-2 bg-dark-surface text-text-muted hover:text-primary rounded-lg transition-all hover:bg-primary/10"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 bg-dark-surface text-text-muted hover:text-red-400 rounded-lg transition-all hover:bg-red-400/10"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                    Nenhuma transmissao cadastrada
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
