"use client";

import { useState } from "react";
import { X, Lock, Mail, Crown, Eye, EyeOff } from "lucide-react";
import { useVip } from "@/lib/VipContext";

export function VipLoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useVip();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error ?? "Erro ao fazer login");
      }
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="w-full max-w-md bg-dark-card border border-gold/30 rounded-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gold/20 to-primary/10 p-6 text-center relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Crown size={28} className="text-gold" />
          </div>
          <h2 className="text-xl font-bold text-white">Acesso VIP</h2>
          <p className="text-text-muted text-sm mt-1">Entre com suas credenciais de assinante</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-12 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-all"
                placeholder="Sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-background font-bold py-3 rounded-xl transition-all glow-gold disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar como VIP"}
          </button>

          <p className="text-text-muted text-xs text-center">
            Ainda nao tem VIP?{" "}
            <a href="/vip" className="text-gold hover:underline">
              Assine agora
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
