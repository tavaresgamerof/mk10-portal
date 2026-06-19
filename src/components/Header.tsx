"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useSiteSettings } from "@/lib/SiteSettingsContext";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/ao-vivo", label: "Ao Vivo" },
  { href: "/news", label: "Notícias" },
  { href: "/galeria", label: "Galeria" },
  { href: "/patrocinadores", label: "Patrocinadores" },
  { href: "/transmita", label: "Seja Parceiro" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/vip", label: "VIP" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pathname change should close mobile menu
    if (mobileOpen) setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dark-card/98 backdrop-blur-md shadow-lg border-b border-dark-border"
          : "bg-dark-card/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/logo-mk10.png"
              alt="MK10 Tv"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-contain bg-dark-surface"
            />
            <span className="text-lg sm:text-xl font-bold shrink-0">
              <span className="text-foreground">MK10</span>
              <span className="text-primary">TV</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/ao-vivo"
              className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-live" />
              AO VIVO
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-foreground/70 hover:text-foreground"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-dark-surface border-t border-dark-border animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/ao-vivo"
              className="flex items-center justify-center gap-1.5 bg-red-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold mt-2"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-live" />
              AO VIVO
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
