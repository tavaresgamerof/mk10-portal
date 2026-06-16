"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { validateAdmin } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validateAdmin(username, password);
    if (valid) {
      localStorage.setItem("mk10_admin_auth", "true");
      localStorage.setItem("mk10_admin_user", valid.name || username);
      router.push("/admin/dashboard");
    } else {
      setError("Credenciais invalidas");
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-bold text-background text-3xl mx-auto mb-4">
            MK
          </div>
          <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-text-muted text-sm mt-1">Acesse o painel de gerenciamento</p>
        </div>

        <form onSubmit={handleLogin} className="bg-dark-card border border-dark-border rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                placeholder="admin ou email"
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
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-12 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Sua senha"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-background font-bold py-3 rounded-xl transition-all glow-primary">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
