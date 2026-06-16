"use client";

import { useState, useEffect } from "react";
import { Radio, Handshake, Newspaper, Video, FileText, TrendingUp } from "lucide-react";

function countStorage(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.length;
    }
  } catch {}
  return 0;
}

function getProposalsByStatus(status: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const saved = localStorage.getItem("mk10_proposals");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed.filter((p: { status: string }) => p.status === status).length;
    }
  } catch {}
  return 0;
}

function getRecentItems(): { text: string; time: string; type: string }[] {
  if (typeof window === "undefined") return [];
  const items: { text: string; time: string; type: string }[] = [];

  try {
    const news = JSON.parse(localStorage.getItem("mk10_news") || "[]");
    if (Array.isArray(news)) {
      news.slice(0, 2).forEach((n: { title: string; date: string }) => {
        items.push({ text: `Noticia: ${n.title}`, time: n.date, type: "news" });
      });
    }
  } catch {}

  try {
    const videos = JSON.parse(localStorage.getItem("mk10_videos") || "[]");
    if (Array.isArray(videos)) {
      videos.slice(0, 2).forEach((v: { title: string }) => {
        items.push({ text: `Video: ${v.title}`, time: "Video adicionado", type: "video" });
      });
    }
  } catch {}

  try {
    const broadcasts = JSON.parse(localStorage.getItem("mk10_broadcasts") || "[]");
    if (Array.isArray(broadcasts)) {
      broadcasts.slice(0, 2).forEach((b: { homeTeam: string; awayTeam: string; date: string }) => {
        items.push({ text: `Transmissao: ${b.homeTeam} x ${b.awayTeam}`, time: b.date, type: "live" });
      });
    }
  } catch {}

  try {
    const sponsors = JSON.parse(localStorage.getItem("mk10_sponsors") || "[]");
    if (Array.isArray(sponsors)) {
      sponsors.slice(0, 2).forEach((s: { name: string }) => {
        items.push({ text: `Patrocinador: ${s.name}`, time: "Cadastrado", type: "sponsor" });
      });
    }
  } catch {}

  try {
    const proposals = JSON.parse(localStorage.getItem("mk10_proposals") || "[]");
    if (Array.isArray(proposals)) {
      proposals.slice(0, 2).forEach((p: { empresa: string; status: string }) => {
        items.push({ text: `Proposta: ${p.empresa} (${p.status})`, time: "Recebida", type: "proposal" });
      });
    }
  } catch {}

  return items.slice(0, 8);
}

interface DashboardStats {
  news: number;
  videos: number;
  broadcasts: number;
  sponsors: number;
  proposalsPending: number;
  proposalsApproved: number;
  proposalsRejected: number;
  proposalsTotal: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    news: 0, videos: 0, broadcasts: 0, sponsors: 0,
    proposalsPending: 0, proposalsApproved: 0, proposalsRejected: 0, proposalsTotal: 0,
  });
  const [recentActivity, setRecentActivity] = useState<{ text: string; time: string; type: string }[]>([]);

  const refresh = () => {
    setStats({
      news: countStorage("mk10_news"),
      videos: countStorage("mk10_videos"),
      broadcasts: countStorage("mk10_broadcasts"),
      sponsors: countStorage("mk10_sponsors"),
      proposalsPending: getProposalsByStatus("pendente"),
      proposalsApproved: getProposalsByStatus("aprovado"),
      proposalsRejected: getProposalsByStatus("rejeitado"),
      proposalsTotal: countStorage("mk10_proposals"),
    });
    setRecentActivity(getRecentItems());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: "Noticias", value: stats.news, icon: Newspaper, color: "text-blue-neon" },
    { label: "Videos", value: stats.videos, icon: Video, color: "text-purple-400" },
    { label: "Transmissoes", value: stats.broadcasts, icon: Radio, color: "text-red-400" },
    { label: "Patrocinadores", value: stats.sponsors, icon: Handshake, color: "text-gold" },
    { label: "Propostas Pendentes", value: stats.proposalsPending, icon: FileText, color: "text-yellow-400" },
    { label: "Propostas Aprovadas", value: stats.proposalsApproved, icon: FileText, color: "text-green-400" },
    { label: "Propostas Rejeitadas", value: stats.proposalsRejected, icon: FileText, color: "text-red-400" },
    { label: "Total Propostas", value: stats.proposalsTotal, icon: TrendingUp, color: "text-primary" },
  ];

  const typeColorMap: Record<string, string> = {
    news: "bg-blue-neon",
    video: "bg-purple-400",
    live: "bg-red-400",
    sponsor: "bg-gold",
    proposal: "bg-yellow-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-text-muted">Visao geral do portal MK10TV</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-dark-surface rounded-xl flex items-center justify-center">
                  <Icon size={20} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-text-muted text-sm mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Atividade Recente</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeColorMap[a.type] || "bg-primary"}`} />
                <div>
                  <p className="text-foreground text-sm">{a.text}</p>
                  <p className="text-text-muted text-xs">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">Nenhuma atividade registrada</p>
        )}
      </div>
    </div>
  );
}
