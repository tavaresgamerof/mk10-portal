"use client";

import Link from "next/link";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-dark-surface border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-mk10.png" alt="MK10 Tv" className="h-7 w-7 rounded object-contain" />
              <span className="text-lg font-bold">
                <span className="text-foreground">MK10</span>
                <span className="text-primary">TV</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              {settings.siteDescription || "A paixao pelo esporte de base fala mais alto!"}
            </p>
            <div className="flex gap-2 mt-4">
              {settings.social.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="h-8 px-3 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center text-text-muted text-xs hover:text-primary hover:border-primary/30 transition-all">
                  Instagram
                </a>
              )}
              {settings.social.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="h-8 px-3 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center text-text-muted text-xs hover:text-primary hover:border-primary/30 transition-all">
                  YouTube
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold text-sm mb-3">Links</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { href: "/", label: "Início" },
                { href: "/ao-vivo", label: "Ao Vivo" },
                { href: "/news", label: "Notícias" },
                { href: "/galeria", label: "Galeria" },
                { href: "/sobre", label: "Sobre" },
                { href: "/contato", label: "Contato" },
                { href: "/patrocinadores", label: "Patrocinadores" },
                { href: "/propostas", label: "Propostas" },
                { href: "/vip", label: "VIP" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-text-muted text-sm hover:text-primary transition-colors py-0.5">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold text-sm mb-3">Contato</h3>
            <ul className="space-y-1.5 text-text-muted text-sm">
              {settings.contactEmail && <li>{settings.contactEmail}</li>}
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              {settings.address && <li>{settings.address}</li>}
              {!settings.contactEmail && !settings.contactPhone && !settings.address && (
                <li>Sem dados de contato</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} MK10TV
          </p>
          <div className="flex gap-4 text-text-muted text-xs">
            <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
            <a href="#" className="hover:text-foreground transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
