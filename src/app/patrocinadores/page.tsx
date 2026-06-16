"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Medal, Handshake, Users } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  tier: string;
  site: string;
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

const tierConfig: Record<string, { label: string; icon: typeof Trophy; color: string; bgColor: string; borderColor: string }> = {
  Master: { label: "Patrocinador Master", icon: Trophy, color: "text-gold", bgColor: "bg-gold/10", borderColor: "border-gold/30" },
  Ouro: { label: "Patrocinador Ouro", icon: Star, color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/30" },
  Prata: { label: "Patrocinador Prata", icon: Medal, color: "text-gray-400", bgColor: "bg-gray-400/10", borderColor: "border-gray-400/30" },
  Parceiro: { label: "Parceiros", icon: Handshake, color: "text-blue-neon", bgColor: "bg-blue-neon/10", borderColor: "border-blue-neon/30" },
};

export default function PatrocinadoresPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration
  useEffect(() => { setSponsors(loadSponsors()); }, []);

  const grouped = sponsors.reduce((acc, s) => {
    if (!acc[s.tier]) acc[s.tier] = [];
    acc[s.tier].push(s);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ["Master", "Ouro", "Prata", "Parceiro"];

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Nossos Patrocinadores</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Empresas que acreditam no nosso projeto e fazem parte desta familia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sponsors.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg mb-2">Nenhum patrocinador cadastrado</p>
            <p className="text-text-muted text-sm">Os patrocinadores aparecerao aqui depois de cadastrados no painel admin.</p>
          </div>
        ) : (
          tierOrder.map((tier) => {
            const list = grouped[tier];
            if (!list || list.length === 0) return null;
            const config = tierConfig[tier];
            const Icon = config.icon;
            return (
              <div key={tier} className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className={"w-12 h-12 " + config.bgColor + " border " + config.borderColor + " rounded-xl flex items-center justify-center"}>
                    <Icon size={24} className={config.color} />
                  </div>
                  <div>
                    <h2 className={"text-2xl font-bold " + config.color}>{config.label}</h2>
                    <p className="text-text-muted text-sm">{list.length} {list.length === 1 ? "patrocinador" : "patrocinadores"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((sponsor) => (
                    <div key={sponsor.id} className={"bg-dark-card border " + config.borderColor + " rounded-2xl p-6 card-hover group"}>
                      <div className="h-20 flex items-center justify-center mb-4">
                        {sponsor.logo ? (
                          <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 object-contain" />
                        ) : (
                          <span className="text-xl font-bold text-text-muted">{sponsor.name}</span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 text-center">{sponsor.name}</h3>
                      {sponsor.site && (
                        <a href={sponsor.site} target="_blank" rel="noopener noreferrer" className="block text-center bg-dark-surface border border-dark-border rounded-xl py-2.5 text-sm text-text-muted hover:text-primary hover:border-primary/30 transition-all">
                          Visitar Site
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        <div className="bg-gradient-to-r from-primary/10 via-dark-card to-primary/10 border border-primary/20 rounded-2xl p-10 text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">Seja Nosso Patrocinador</h3>
          <p className="text-text-muted text-lg mb-6 max-w-xl mx-auto">
            Divulgue sua marca para milhares de torcedores apaixonados.
          </p>
          <a href="/propostas" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-8 py-4 rounded-xl text-lg transition-all glow-green">
            Enviar Proposta
          </a>
        </div>
      </div>
    </div>
  );
}
