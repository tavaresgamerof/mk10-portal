"use client";

import { Radio, Users, BarChart3, Globe, Shield, Zap, Target, CheckCircle, ArrowRight, Mail, ExternalLink, Heart } from "lucide-react";

const plans = [
  {
    name: "Parceiro Basico",
    price: "Gratuito",
    description: "Para times e atletas que querem divulgar seu trabalho",
    features: [
      "Divulgacao no canal MK10TV",
      "Entrevista no Papo de Base",
      "Destaque nas redes sociais",
      "Acesso a comunidade de base",
    ],
    highlighted: false,
    btnClass: "bg-dark-surface border border-dark-border text-foreground hover:border-primary/30",
  },
  {
    name: "Parceiro Pro",
    price: "R$ 99",
    period: "/mes",
    description: "Para clubes e escolinhas que querem mais visibilidade",
    features: [
      "Tudo do plano Basico",
      "Transmissao ao vivo de jogos",
      "Cobertura completa do time",
      "Entrevistas exclusivas com jogadores",
      "Relatorios de desempenho",
      "Suporte prioritario",
    ],
    highlighted: true,
    btnClass: "bg-primary text-background hover:bg-primary-dark",
  },
  {
    name: "Parceiro Ultra",
    price: "Sob consulta",
    description: "Para federacoes e grandes projetos de base",
    features: [
      "Tudo do plano Pro",
      "Cobertura multi-cameras",
      "Documentarios exclusivos",
      "Acesso a eventos especiais",
      "Conteudo personalizado",
      "Gerente de conta dedicado",
      "Parceria de longo prazo",
    ],
    highlighted: false,
    btnClass: "bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30",
  },
];

const steps = [
  { icon: Target, title: "1. Entre em Contato", description: "Envie uma mensagem para nosso Instagram @mk10tv ou pelo formulario de contato." },
  { icon: Zap, title: "2. Apresentacao", description: "Apresente seu time, escolinha ou projeto de esporte de base para nossa equipe." },
  { icon: Radio, title: "3. Parceria", description: "Definimos juntos a melhor forma de divulgar e transmitir seu esporte." },
  { icon: BarChart3, title: "4. Crescimento", description: "Seu time ganha visibilidade e alcance de milhoes de torcedores." },
];

const benefits = [
  { icon: Globe, title: "Alcance Nacional", description: "Seu esporte de base alcancando torcedores de todo o Brasil." },
  { icon: Users, title: "Comunidade de Base", description: "Conecte-se com atletas, treinadores e lideres do esporte base." },
  { icon: Shield, title: "Credibilidade", description: "Associacao com o maior canal de esporte de base do Brasil." },
  { icon: Heart, title: "Impacto Social", description: "Valorizacao de jovens atletas e historias inspiradoras." },
];

const stats = [
  { value: "500+", label: "Atletas Destacados" },
  { value: "200+", label: "Entrevistas Realizadas" },
  { value: "1.3K", label: "Inscritos no Canal" },
  { value: "100%", label: "Foco na Base" },
];

export default function TransmitaPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Radio size={18} />
            PARCERIA MK10TV
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            Divulgue seu esporte
            <span className="block gradient-text">de base</span>
            <span className="block">com a gente</span>
          </h1>
          <p className="text-text-muted text-lg max-w-3xl mx-auto mb-8">
            O MK10TV nasceu para valorizar o esporte de base. Se voce treina um time, dirige uma
            escolinha ou e atleta, queremos contar sua historia e transmitir seus jogos para todo o Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#planos"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-8 py-4 rounded-xl text-lg transition-all glow-green"
            >
              Ver Planos
              <ArrowRight size={20} />
            </a>
            <a
              href="https://www.instagram.com/mk10tv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-dark-border bg-dark-card/50 backdrop-blur-sm text-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:border-primary/30 transition-all"
            >
              <ExternalLink size={18} />
              Fale no Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center card-hover">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div id="como-funciona" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Em 4 passos simples, voce comeca a divulgar e transmitir seu esporte de base
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative">
                  <div className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center card-hover h-full">
                    <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary">
                      <ArrowRight size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div id="planos" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Planos de Parceria</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Escolha o plano ideal para seu time ou projeto de esporte de base
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-dark-card border ${
                  plan.highlighted ? "border-primary/50 ring-2 ring-primary/30 scale-105" : "border-dark-border"
                } rounded-2xl p-8 relative card-hover`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-text-muted text-sm">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                      <CheckCircle size={14} className="text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.instagram.com/mk10tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${plan.btnClass}`}
                >
                  {plan.price === "Gratuito" ? "Comecar Agora" : "Falar com Consultor"}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 via-dark-card to-primary/10 border border-primary/20 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Pronto para comecar?</h2>
              <p className="text-text-muted text-lg mb-6">
                Entre em contato com a gente pelo Instagram @mk10tv ou envie uma proposta
                e descubra como podemos ajudar seu time a crescer.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/mk10tv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-6 py-3 rounded-xl transition-all"
                >
                  <ExternalLink size={18} />
                  @mk10tv no Instagram
                </a>
                <a
                  href="/contato"
                  className="flex items-center gap-2 border border-dark-border bg-dark-card/50 text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary/30 transition-all"
                >
                  <Mail size={18} />
                  Formulario de Contato
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-text-muted text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
