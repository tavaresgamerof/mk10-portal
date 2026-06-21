"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, Video, Radio, Handshake, FileText, LogOut, Menu, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/news", label: "Noticias", icon: Newspaper },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/transmissoes", label: "Transmissoes", icon: Radio },
  { href: "/admin/patrocinadores", label: "Patrocinadores", icon: Handshake },
  { href: "/admin/propostas", label: "Propostas", icon: FileText },
  { href: "/admin/settings", label: "Configuracoes", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin";
  const [authed, setAuthed] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;
    const isAuthed = localStorage.getItem("mk10_admin_auth") === "true";
    if (!isAuthed) {
      router.replace("/admin");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration on mount
    setAuthed(isAuthed);
  }, [router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authed) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-text-muted">Carregando...</div>
      </div>
    );
  }

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    if (isActive) return "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary/10 text-primary";
    return "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-foreground hover:bg-white/5";
  };

  return (
    <div className="pt-16 min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 bg-dark-surface border-r border-dark-border flex-col fixed top-16 bottom-0">
        <div className="p-4 border-b border-dark-border">
          <h2 className="text-white font-bold text-lg">Painel Admin</h2>
          <p className="text-text-muted text-xs">Gerencie seu portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-dark-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-foreground hover:bg-white/5 transition-all">
            <LogOut size={18} />
            Voltar ao Site
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("mk10_admin_auth");
              localStorage.removeItem("mk10_admin_user");
              router.replace("/admin");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sair do Painel
          </button>
        </div>
      </aside>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-dark-card border border-dark-border p-2 rounded-lg text-text-muted"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-dark-surface h-full p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white font-bold text-lg mb-4">Painel Admin</h2>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className={getLinkClass(link.href)}>
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
