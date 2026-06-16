"use client";

import { useState } from "react";
import { Star, Crown, Play, BarChart3, Users, Lock, Mail, Eye, EyeOff, LogOut, Check } from "lucide-react";
import { useVip } from "@/lib/VipContext";

const plans = [
  {
    plan: "Basico",
    price: "R$ 19,90",
    period: "/mes",
    features: ["Jogos ao vivo em HD", "Chat exclusivo", "Noticias premium", "Sem anuncios"],
    popular: false,
    borderColor: "border-dark-border",
    btnClass: "bg-dark-surface border border-dark-border text-foreground hover:border-primary/30",
  },
  {
    plan: "Premium",
    price: "R$ 39,90",
    period: "/mes",
    features: ["Tudo do Basico", "Jogos em Full HD", "Estatisticas avancadas", "Entrevistas exclusivas", "Acesso antecipado", "Downloads de conteudo"],
    popular: true,
    borderColor: "border-primary/50",
    btnClass: "bg-primary text-background hover:bg-primary-dark",
  },
  {
    plan: "Ultra",
    price: "R$ 69,90",
    period: "/mes",
    features: ["Tudo do Premium", "4K Ultra HD", "Camera tatica", "Dados avancados", "Conteudo behind the scenes", "Suporte prioritario", "Downloads ilimitados"],
    popular: false,
    borderColor: "border-gold/50",
    btnClass: "bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30",
  },
];

const benefits = [
  { icon: Play, title: "Jogos Exclusivos", desc: "Acesso a partidas que nao sao transmitidas em outros canais." },
  { icon: BarChart3, title: "Estatisticas Avancadas", desc: "Dados detalhados em tempo real de todos os jogos." },
  { icon: Users, title: "Comunidade VIP", desc: "Grupo exclusivo com torcedores selecionados." },
  { icon: Lock, title: "Conteudo Premium", desc: "Entrevistas e analises disponiveis apenas para assinantes." },
];

export default function VipPage() {
  const { isVip, user, login, logout } = useVip();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
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

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-gold/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Crown size={18} />
            AREA VIP
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Conteudo Exclusivo</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Assine e tenha acesso a tudo o que o MK10TV tem de melhor.
          </p>

          {isVip && user && (
            <div className="mt-8 bg-dark-card border border-primary/30 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Check size={20} />
                <span className="font-bold">Voce ja esta logado como VIP!</span>
              </div>
              <p className="text-text-muted text-sm mb-1">{user.email}</p>
              <p className="text-gold text-sm font-semibold capitalize mb-4">Plano: {user.plan}</p>
              <button
                onClick={logout}
                className="flex items-center gap-2 mx-auto bg-dark-surface border border-dark-border text-foreground px-4 py-2 rounded-xl text-sm hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                <LogOut size={14} />
                Sair da conta
              </button>
            </div>
          )}

          {!isVip && (
            <div className="mt-8">
              {!showLoginForm ? (
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold px-6 py-3 rounded-xl font-bold text-sm hover:bg-gold/30 transition-all"
                >
                  <Mail size={16} />
                  Ja sou VIP - Fazer Login
                </button>
              ) : (
                <div className="max-w-md mx-auto bg-dark-card border border-gold/30 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Login VIP</h3>
                  <form onSubmit={handleLogin} className="space-y-4">
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
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gold hover:bg-gold-light text-background font-bold py-3 rounded-xl transition-all glow-gold disabled:opacity-50"
                      >
                        {loading ? "Entrando..." : "Entrar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowLoginForm(false); setEmail(""); setPassword(""); setError(""); }}
                        className="bg-dark-surface border border-dark-border text-foreground px-4 py-3 rounded-xl text-sm hover:border-primary/30 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={"bg-dark-card border " + plan.borderColor + " rounded-2xl p-8 relative card-hover " + (plan.popular ? "ring-2 ring-primary/30 scale-105" : "")}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background text-xs font-bold px-4 py-1 rounded-full">
                  MAIS POPULAR
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-2">{plan.plan}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-text-muted text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                    <Star size={14} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={"w-full py-3 rounded-xl font-bold text-sm transition-all " + plan.btnClass}>
                Assinar Agora
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">O que voce recebe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center card-hover">
                  <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-gold" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
