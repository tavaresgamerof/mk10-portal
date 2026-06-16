"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal } from "./animations/ScrollReveal";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  logo: string;
  logoText: string;
}

function loadSponsors(): Sponsor[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("mk10_sponsors");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function SponsorsBar() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setSponsors(loadSponsors()); }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="bg-dark-surface border-y border-dark-border py-8 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-6">
            <p className="text-text-muted text-sm tracking-wider uppercase">Nossos Patrocinadores</p>
          </div>
        </ScrollReveal>
        <div className="flex items-center justify-center flex-wrap gap-6">
          {sponsors.map((s) => (
            <Link key={s.id} href="/patrocinadores" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="h-10 px-4 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center overflow-hidden">
                {s.logo ? (
                  <img src={s.logo} alt={s.name} className="h-full object-contain" />
                ) : (
                  <span className="text-sm font-bold text-text-muted">{s.name}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
