"use client";

import { useState, useRef } from "react";
import { useSiteSettings } from "@/lib/SiteSettingsContext";
import { loadAdmins, addAdmin, removeAdmin, type AdminUser } from "@/lib/adminAuth";
import {
  Settings,
  Palette,
  Upload,
  Globe,
  RotateCcw,
  Save,
  Phone,
  Mail,
  MapPin,
  Hash,
  MessageCircle,
  Share2,
  Tv,
  X,
  Users,
  Trash2,
  Plus,
  Shield,
} from "lucide-react";

const colorLabels: Record<string, string> = {
  primary: "Cor Primaria",
  primaryDark: "Primaria Escura",
  secondary: "Cor Secundaria",
  accent: "Cor de Destaque",
  background: "Fundo",
  surface: "Superficie",
  card: "Cartoes",
  border: "Bordas",
};

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "Twitter / X",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

export default function AdminSettingsPage() {
  const { settings, updateSettings, updateColors, updateSocial, updateLogo, resetSettings } =
    useSiteSettings();
  const [activeTab, setActiveTab] = useState<"geral" | "cores" | "social" | "contato" | "admins">("geral");
  const [admins, setAdmins] = useState<AdminUser[]>(() => loadAdmins());
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAddAdmin = () => {
    setAdminError("");
    if (!newUsername || !newPassword || !newName) {
      setAdminError("Preencha todos os campos");
      return;
    }
    addAdmin(newUsername, newPassword, newName);
    setAdmins(loadAdmins());
    setNewUsername("");
    setNewPassword("");
    setNewName("");
  };

  const handleRemoveAdmin = (id: number) => {
    if (!confirm("Remover este administrador?")) return;
    setAdmins(removeAdmin(id));
  };
  const [saved, setSaved] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. Maximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateLogo({ url: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogoUrl = (url: string) => {
    updateLogo({ url });
  };

  const clearLogo = () => {
    updateLogo({ url: "" });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Tem certeza que deseja redefinir todas as configuracoes?")) {
      resetSettings();
    }
  };

  const tabs = [
    { id: "geral" as const, label: "Geral", icon: Settings },
    { id: "cores" as const, label: "Paleta de Cores", icon: Palette },
    { id: "social" as const, label: "Redes Sociais", icon: Globe },
    { id: "contato" as const, label: "Contato", icon: Mail },
    { id: "admins" as const, label: "Administradores", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuracoes do Site</h1>
          <p className="text-text-muted text-sm">Personalize a aparencia e informacoes do portal</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dark-border text-text-muted hover:text-foreground hover:bg-white/5 transition-all"
          >
            <RotateCcw size={16} />
            Redefinir
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-background font-bold transition-all"
          >
            <Save size={16} />
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-dark-surface border border-dark-border rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary"
                  : "text-text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "geral" && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings size={20} />
              Informacoes Gerais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome do Site</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateSettings({ siteName: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="MK10TV"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descricao</label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Seu portal esportivo favorito"
                />
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload size={20} />
              Logo do Site
            </h2>

            <div className="flex items-start gap-6">
              <div className="w-32 h-32 bg-dark-surface border border-dark-border rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {settings.logo.url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={settings.logo.url}
                      alt={settings.logo.alt}
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={clearLogo}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center font-bold text-background text-2xl mx-auto">
                      MK
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  {settings.logo.url ? (
                    <div className="w-full h-32 bg-dark-surface border border-dark-border rounded-xl overflow-hidden relative">
                      <img src={settings.logo.url} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleLogoDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-32 bg-dark-surface border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive ? "border-primary bg-primary/5" : "border-dark-border hover:border-primary/50"
                      }`}
                    >
                      <Upload size={28} className="text-text-muted mb-2" />
                      <p className="text-text-muted text-sm">Arraste ou clique para enviar</p>
                      <p className="text-text-muted/60 text-xs mt-1">PNG, JPG, WebP (max 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLogoFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Ou cole uma URL
                  </label>
                  <input
                    type="url"
                    value={settings.logo.url}
                    onChange={(e) => handleLogoUrl(e.target.value)}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Texto Alternativo
                  </label>
                  <input
                    type="text"
                    value={settings.logo.alt}
                    onChange={(e) => updateLogo({ alt: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="MK10TV"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cores" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette size={20} />
            Paleta de Cores
          </h2>
          <p className="text-text-muted text-sm">
            Personalize as cores do site. As mudancas sao aplicadas em tempo real.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(settings.colors) as Array<keyof typeof settings.colors>).map((key) => (
              <div key={key} className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  {colorLabels[key]}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.colors[key]}
                    onChange={(e) => updateColors({ [key]: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-dark-border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.colors[key]}
                    onChange={(e) => updateColors({ [key]: e.target.value })}
                    className="flex-1 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-foreground text-sm font-mono focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div
                  className="w-full h-8 rounded-lg border border-dark-border"
                  style={{ backgroundColor: settings.colors[key] }}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-dark-surface border border-dark-border rounded-xl">
            <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>
            <div className="flex gap-3">
              <div
                className="px-4 py-2 rounded-lg font-bold text-sm"
                style={{ backgroundColor: settings.colors.primary, color: settings.colors.background }}
              >
                Botao Primario
              </div>
              <div
                className="px-4 py-2 rounded-lg font-bold text-sm"
                style={{ backgroundColor: settings.colors.secondary, color: settings.colors.background }}
              >
                Botao Secundario
              </div>
              <div
                className="px-4 py-2 rounded-lg font-bold text-sm border"
                style={{ borderColor: settings.colors.accent, color: settings.colors.accent }}
              >
                Destaque
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe size={20} />
            Redes Sociais
          </h2>
          <p className="text-text-muted text-sm">
            Adicione os links das suas redes sociais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(socialLabels).map((key) => {
              const socialKey = key as keyof typeof settings.social;
              const IconMap: Record<string, typeof Globe> = {
                instagram: Hash,
                youtube: Tv,
                tiktok: Share2,
                twitter: MessageCircle,
                facebook: Globe,
                whatsapp: Phone,
              };
              const Icon = IconMap[key] || Globe;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark-surface border border-dark-border rounded-lg flex items-center justify-center text-text-muted">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      {socialLabels[key]}
                    </label>
                    <input
                      type="url"
                      value={settings.social[socialKey]}
                      onChange={(e) => updateSocial({ [socialKey]: e.target.value })}
                      className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                      placeholder={`URL do ${socialLabels[key]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "contato" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail size={20} />
            Informacoes de Contato
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail size={14} className="inline mr-2" />
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="contato@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Phone size={14} className="inline mr-2" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <MapPin size={14} className="inline mr-2" />
                Endereco
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => updateSettings({ address: e.target.value })}
                rows={4}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="Rua, Numero, Cidade - Estado"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "admins" && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={20} />
              Gerenciar Administradores
            </h2>
            <p className="text-text-muted text-sm">
              Adicione ou remova contas de administrador do painel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Nome do admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Usuario / Email</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="admin ou email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Senha de acesso"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddAdmin}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold py-3 rounded-xl transition-all"
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>
            </div>

            {adminError && (
              <p className="text-red-400 text-sm">{adminError}</p>
            )}

            <div className="space-y-2">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between bg-dark-surface border border-dark-border rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                      <Users size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{admin.name}</p>
                      <p className="text-text-muted text-sm">{admin.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
