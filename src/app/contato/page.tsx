"use client";

import { Globe, Share2, Tv, ExternalLink } from "lucide-react";

const contactItems = [
  { icon: Share2, title: "Instagram", info: "@mk10tv", link: "https://www.instagram.com/mk10tv/", color: "text-pink-400" },
  { icon: Tv, title: "YouTube", info: "@mk10produtora", link: "https://www.youtube.com/@mk10produtora", color: "text-red-400" },
  { icon: Globe, title: "Canal MK10", info: "youtube.com/@mk10produtora", link: "https://www.youtube.com/@mk10produtora", color: "text-primary" },
];

export default function ContatoPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contato</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Fale conosco por qualquer um dos canais abaixo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactItems.map((item, i) => {
            const Icon = item.icon;
            const isExternal = item.link.startsWith("http");
            return (
              <a
                key={i}
                href={item.link}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 card-hover group flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-dark-surface border border-dark-border rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-all">
                  <Icon size={24} className={item.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.info}</p>
                </div>
                {isExternal && (
                  <ExternalLink size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                )}
              </a>
            );
          })}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="aspect-video bg-dark-surface flex items-center justify-center">
            <div className="text-center">
              <Tv size={48} className="text-red-500 mx-auto mb-3" />
              <p className="text-white font-bold text-lg">MK10 Tv</p>
              <p className="text-text-muted text-sm">Esporte de Base</p>
              <a
                href="https://www.youtube.com/@mk10produtora"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-red-500 text-sm font-semibold hover:text-red-400 transition-colors"
              >
                <ExternalLink size={14} />
                Visitar Canal no YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
