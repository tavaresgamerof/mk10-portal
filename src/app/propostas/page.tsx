"use client";

import { useState, useRef } from "react";
import { Send, CheckCircle, Upload, X, Image as ImageIcon } from "lucide-react";

const STORAGE_KEY = "mk10_proposals";

interface Proposal {
  id: number;
  empresa: string;
  responsavel: string;
  whatsapp: string;
  email: string;
  site: string;
  tipo: string;
  orcamento: string;
  mensagem: string;
  logo: string;
  status: string;
  date: string;
}

function loadProposals(): Proposal[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveProposals(proposals: Proposal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  } catch {}
}

export default function PropostasPage() {
  const [submitted, setSubmitted] = useState(false);
  const [logoMode, setLogoMode] = useState<"upload" | "url">("upload");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    empresa: "", responsavel: "", whatsapp: "", email: "", site: "", tipo: "", orcamento: "", mensagem: "",
  });

  const logo = logoMode === "upload" ? logoBase64 : logoUrl;

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem muito grande. Maximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const clearLogo = () => {
    setLogoBase64("");
    setLogoUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const newProposal: Proposal = {
      id: Date.now(),
      empresa: form.empresa,
      responsavel: form.responsavel,
      whatsapp: form.whatsapp,
      email: form.email,
      site: form.site,
      tipo: form.tipo,
      orcamento: form.orcamento,
      mensagem: form.mensagem,
      logo,
      status: "pendente",
      date: dateStr,
    };

    const existing = loadProposals();
    existing.unshift(newProposal);
    saveProposals(existing);

    setSubmitted(true);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-gold/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Propostas Comerciais</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Interessado em patrocinar ou se tornar parceiro? Preencha o formulario abaixo.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submitted ? (
          <div className="bg-dark-card border border-primary/30 rounded-2xl p-10 text-center glow-green">
            <CheckCircle size={64} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Proposta Enviada!</h2>
            <p className="text-text-muted">Recebemos sua proposta. Entraremos em contato em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Logo da Empresa</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setLogoMode("upload")}
                  className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border " + (logoMode === "upload" ? "bg-primary/10 border-primary/30 text-primary" : "bg-dark-surface border-dark-border text-text-muted hover:text-foreground")}
                >
                  <Upload size={12} /> Enviar arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode("url")}
                  className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border " + (logoMode === "url" ? "bg-primary/10 border-primary/30 text-primary" : "bg-dark-surface border-dark-border text-text-muted hover:text-foreground")}
                >
                  <ImageIcon size={12} /> URL da imagem
                </button>
              </div>

              {logoMode === "upload" ? (
                logoBase64 ? (
                  <div className="relative w-full h-40 bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                    <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={clearLogo}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={"w-full h-40 bg-dark-surface border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all " + (dragActive ? "border-primary bg-primary/5" : "border-dark-border hover:border-primary/50")}
                  >
                    <Upload size={32} className="text-text-muted mb-2" />
                    <p className="text-text-muted text-sm">Arraste ou clique para enviar</p>
                    <p className="text-text-muted/60 text-xs mt-1">PNG, JPG, WebP (max 5MB)</p>
                  </div>
                )
              ) : (
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="https://www.empresa.com/logo.png"
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  value={form.empresa}
                  onChange={(e) => setForm({...form, empresa: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Sua empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome do Responsavel *</label>
                <input
                  type="text"
                  required
                  value={form.responsavel}
                  onChange={(e) => setForm({...form, responsavel: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="Responsavel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => setForm({...form, whatsapp: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="(11) 99999-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">E-mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="email@empresa.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Site da Empresa</label>
              <input
                type="url"
                value={form.site}
                onChange={(e) => setForm({...form, site: e.target.value})}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                placeholder="https://www.empresa.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Parceria *</label>
                <select
                  required
                  value={form.tipo}
                  onChange={(e) => setForm({...form, tipo: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="">Selecione</option>
                  <option value="master">Patrocinador Master</option>
                  <option value="ouro">Patrocinador Ouro</option>
                  <option value="prata">Patrocinador Prata</option>
                  <option value="parceiro">Parceiro</option>
                  <option value="banner">Anuncio em Banner</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Orcamento Mensal</label>
                <select
                  value={form.orcamento}
                  onChange={(e) => setForm({...form, orcamento: e.target.value})}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="">Selecione</option>
                  <option value="1k">Ate R$ 1.000</option>
                  <option value="5k">R$ 1.000 - R$ 5.000</option>
                  <option value="10k">R$ 5.000 - R$ 10.000</option>
                  <option value="50k">R$ 10.000 - R$ 50.000</option>
                  <option value="50k+">Acima de R$ 50.000</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mensagem *</label>
              <textarea
                required
                rows={5}
                value={form.mensagem}
                onChange={(e) => setForm({...form, mensagem: e.target.value})}
                className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none"
                placeholder="Descreva sua proposta..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-background font-bold px-8 py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2 glow-green"
            >
              <Send size={20} />
              Solicitar Proposta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
