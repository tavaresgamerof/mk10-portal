"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";

interface Broadcast {
  id: number;
  homeTeam: string;
  awayTeam: string;
  championship: string;
  date: string;
  time: string;
  status: string;
}

function loadBroadcasts(): Broadcast[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("mk10_broadcasts");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function NextMatches() {
  const [matches, setMatches] = useState<Broadcast[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setMatches(loadBroadcasts()); }, []);

  if (matches.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Proximas Transmissoes</h2>
            <p className="text-text-muted">Nao perca nenhum jogo</p>
          </div>
          <a href="/ao-vivo" className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors">
            Ver Todos
          </a>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {matches.slice(0, 4).map((match) => (
          <div key={match.id} className="bg-dark-card border border-dark-border rounded-2xl p-5 card-hover h-full">
            <div className="flex items-center justify-between text-xs text-text-muted mb-4">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{match.championship}</span>
              {match.status === "ao_vivo" && (
                <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-md font-medium">AO VIVO</span>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-lg">{match.homeTeam[0]}</span>
                </div>
                <p className="text-white text-sm font-semibold">{match.homeTeam}</p>
              </div>
              <span className="text-text-muted text-xs font-bold px-2">VS</span>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-lg">{match.awayTeam[0]}</span>
                </div>
                <p className="text-white text-sm font-semibold">{match.awayTeam}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-text-muted border-t border-dark-border pt-3">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{match.date}</span>
              </div>
              <span className="text-primary font-bold">{match.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
