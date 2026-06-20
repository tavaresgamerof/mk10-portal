"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Trophy, Eye, Globe, Calendar, Tv, Megaphone, CheckCircle, Send,
  ChevronLeft, ChevronRight, Users, Zap, Target,
  TrendingUp, Award, Smartphone, MonitorPlay, Camera, FileText,
  Handshake, Play, Star,
} from "lucide-react";

const STORAGE_KEY = "mk10_sponsorship_proposals";
const NUMBERS_KEY = "mk10_sponsorship_numbers";

interface SponsorshipProposal {
  id: number; nome: string; empresa: string; cidade: string;
  telefone: string; whatsapp: string; email: string;
  plano: string; mensagem: string; status: string; date: string;
}

interface SiteNumbers {
  inscritos: string; jogos: string; atletas: string;
  familias: string; visualizacoes: string;
}

const defaultNumbers: SiteNumbers = {
  inscritos: "1300", jogos: "150", atletas: "500",
  familias: "5000", visualizacoes: "200000",
};

function loadNumbers(): SiteNumbers {
  if (typeof window === "undefined") return defaultNumbers;
  try {
    const saved = localStorage.getItem(NUMBERS_KEY);
    if (saved) return { ...defaultNumbers, ...JSON.parse(saved) };
  } catch {}
  return defaultNumbers;
}

function loadProposals(): SponsorshipProposal[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveProposals(proposals: SponsorshipProposal[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals)); } catch {}
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return n.toString();
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-4xl lg:text-5xl font-bold gradient-gold mb-2">
      {formatNumber(count)}{suffix}
    </div>
  );
}

const whyItems = [
  { icon: Users, title: "Publico Altamente Engajado", description: "Nossa audiencia e formada por familias e torcedores fieis que acompanham cada jogo e noticia." },
  { icon: Globe, title: "Alcance Regional", description: "Presentes em toda a regiao Centro-Sul do RS, conectando marcas a comunidades locais." },
  { icon: Calendar, title: "Presenca Digital o Ano Inteiro", description: "Seu branding aparece durante todo o ano, nao apenas em eventos pontuais." },
  { icon: Tv, title: "Conteudo Esportivo Exclusivo", description: "Transmissoes ao vivo, entrevistas, noticias e destaques do futebol de base." },
  { icon: Megaphone, title: "Exposicao Multi-Canal", description: "Sua marca em TV, site, Instagram, Facebook, YouTube e muito mais." },
  { icon: TrendingUp, title: "Retorno sobre Investimento", description: "Midia regional com custo-beneficio superior e impacto mensuravel na sua comunidade." },
];

const exposureChannels = [
  { icon: MonitorPlay, label: "Site MK10TV", description: "Banner e logo no site oficial" },
  { icon: Play, label: "Transmissoes ao Vivo", description: "Logo durante jogos ao vivo" },
  { icon: Camera, label: "Instagram", description: "Stories e posts exclusivos" },
  { icon: Play, label: "YouTube", description: "Mencoes nos videos" },
  { icon: FileText, label: "Noticias Esportivas", description: "Materias patrocinadas" },
  { icon: Camera, label: "Entrevistas", description: "Entrevistas patrocinadas" },
  { icon: Award, label: "Destaques da Rodada", description: "Presenca nos destaques semanais" },
  { icon: Target, label: "Eventos e Campeonatos", description: "Cobertura de eventos especiais" },
  { icon: Smartphone, label: "Facebook", description: "Divulgacao nas redes sociais" },
];

const plans = [
  {
    name: "Plano Parceiro Regional", price: "R$ 199", period: "/mes",
    description: "Ideal para pequenas empresas que buscam visibilidade local",
    features: ["Logo no site MK10TV", "Stories patrocinados no Instagram", "Presenca nas artes oficiais", "Link para redes sociais"],
    highlighted: false, borderColor: "border-dark-border", glowClass: "",
    btnClass: "bg-dark-surface border border-dark-border text-foreground hover:border-primary/30", badge: "",
  },
  {
    name: "Plano Destaque Regional", price: "R$ 399", period: "/mes",
    description: "Para empresas que querem se destacar na regiao",
    features: ["Tudo do Plano Parceiro", "Logo nas transmissoes ao vivo", "Postagem exclusiva mensal", "Destaque na pagina de parceiros", "Mencao nas noticias da semana"],
    highlighted: true, borderColor: "border-primary/50", glowClass: "ring-2 ring-primary/30",
    btnClass: "bg-primary text-background hover:bg-primary-dark", badge: "MAIS POPULAR",
  },
  {
    name: "Plano Master MK10TV", price: "R$ 799", period: "/mes",
    description: "Exposicao maxima para marcas que querem lideranca",
    features: ["Exposicao maxima em todos os canais", "Vinheta personalizada nas transmissoes", "Entrevistas patrocinadas", "Banner principal no site", "Destaque em todos os eventos", "Prioridade em campanhas especiais", "Relatorios mensais de alcance"],
    highlighted: false, borderColor: "border-gold/50", glowClass: "ring-2 ring-gold/30",
    btnClass: "bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30", badge: "",
  },
];

const partnerLogos = [
  { name: "Loja Exemplo", logo: "" }, { name: "Auto Pecas RS", logo: "" },
  { name: "Farmacia Central", logo: "" }, { name: "Supermercado Bom Preco", logo: "" },
  { name: "Oficina do Carro", logo: "" }, { name: "Construtora Alfa", logo: "" },
  { name: "Pizzaria Napolitana", logo: "" }, { name: "Clinica Saude+", logo: "" },
];

const testimonials = [
  { name: "Carlos Silva", role: "Empresario - Camaqua", text: "Desde que me tornei patrocinador da MK10TV, minha loja ganhou muito mais visibilidade na regiao. Excelente retorno!" },
  { name: "Maria Fernandes", role: "Mae de atleta", text: "A MK10TV da visibilidade para nossos filhos. E uma plataforma que realmente valoriza o esporte de base." },
  { name: "Joao Pereira", role: "Treinador - Sao Gabriel", text: "Parceria profissional e comprometida. Os jovens atletas da regiao tem ganhado muito destaque." },
  { name: "Ana Costa", role: "Organizadora de campeonatos", text: "A cobertura da MK10TV eleva a qualidade dos campeonatos. Patrocinadores ficam satisfeitos com a exposicao." },
  { name: "Roberto Lima", role: "Empresario - Chuvisca", text: "Investimento que vale cada centavo. Minha marca aparece para milhares de pessoas todas as semanas." },
  { name: "Fernanda Souza", role: "Diretora de clube", text: "A MK10TV e fundamental para divulgar nosso trabalho com a base. Profissionalismo e paixao pelo esporte." },
];

export default function PatrocinarPage() {
  const [numbers] = useState<SiteNumbers>(loadNumbers);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeChannel, setActiveChannel] = useState(0);
  const [partnerIdx, setPartnerIdx] = useState(0);
  const [testIdx, setTestIdx] = useState(0);
  const [form, setForm] = useState({
    nome: "", empresa: "", cidade: "", telefone: "",
    whatsapp: "", email: "", plano: "", mensagem: "",
  });

  const nextPartners = useCallback(() => setPartnerIdx((p) => (p + 1) % partnerLogos.length), []);
  const prevPartners = useCallback(() => setPartnerIdx((p) => (p - 1 + partnerLogos.length) % partnerLogos.length), []);
  const nextTest = useCallback(() => setTestIdx((p) => (p + 1) % testimonials.length), []);
  const prevTest = useCallback(() => setTestIdx((p) => (p - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const t1 = setInterval(nextPartners, 4000);
    const t2 = setInterval(nextTest, 5000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [nextPartners, nextTest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const proposal: SponsorshipProposal = { id: Date.now(), ...form, status: "pendente", date: dateStr };
    const existing = loadProposals();
    existing.unshift(proposal);
    saveProposals(existing);
    try { await fetch("/api/sponsorship", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(proposal) }); } catch {}
    setSending(false);
    setSubmitted(true);
  };

  const numberStats = [
    { key: "inscritos", label: "Inscritos", suffix: "+" },
    { key: "jogos", label: "Jogos Transmitidos", suffix: "+" },
    { key: "atletas", label: "Atletas Impactados", suffix: "+" },
    { key: "familias", label: "Familias Alcancadas", suffix: "+" },
    { key: "visualizacoes", label: "Visualizacoes Acumuladas", suffix: "+" },
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0e1a] via-dark-surface to-[#0a0e1a] py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('/logo-mk10.png')] bg-center bg-no-repeat bg-contain opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-gold/5" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/8 rounded-full blur-[150px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-5 py-2 rounded-full text-sm font-bold mb-8">
              <Trophy size={16} />PROGRAMA DE PATROCINIO MK10TV
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Conecte Sua Marca ao<span className="block gradient-text">Futebol de Base</span><span className="block">da Nossa Regiao</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-text-muted text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            A MK10TV leva sua empresa para milhares de familias apaixonadas por esporte atraves de transmissoes, noticias, entrevistas e conteudos exclusivos.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#planos" className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-background font-bold px-8 py-4 rounded-xl text-lg transition-all glow-primary hover:scale-105">
              <Zap size={20} />Quero Ser Patrocinador
            </a>
            <a href="#contato" className="flex items-center justify-center gap-2 border-2 border-gold/30 bg-gold/5 backdrop-blur-sm text-gold font-semibold px-8 py-4 rounded-xl text-lg hover:bg-gold/10 hover:border-gold/50 transition-all">
              <Send size={18} />Solicitar Proposta
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-6 text-text-muted text-sm">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" />Midia Regional Profissional</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" />Presenca Multi-Canal</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-primary" />ROI Mensuravel</div>
          </motion.div>
        </div>
      </section>

      {/* POR QUE ANUNCIAR */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Target size={16} />POR QUE ANUNCIAR
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Por que anunciar na <span className="gradient-text">MK10TV</span>?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-3xl mx-auto">
              A MK10TV nao e apenas um canal de transmissoes. Somos uma plataforma regional de midia esportiva focada no futebol de base da regiao Centro-Sul do Rio Grande do Sul.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-dark-card border border-dark-border rounded-2xl p-8 card-hover group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOSSOS NUMEROS */}
      <section className="py-20 bg-gradient-to-b from-dark-surface via-background to-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Eye size={16} />NOSSOS NUMEROS
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Numeros que <span className="gradient-gold">falam por si</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto">
              Acompanhe o crescimento da MK10TV e o impacto que sua marca pode ter na regiao.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {numberStats.map((stat, i) => (
              <motion.div key={stat.key} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center card-hover">
                <AnimatedCounter target={parseInt(numbers[stat.key as keyof SiteNumbers] || "0")} suffix={stat.suffix} />
                <div className="text-text-muted text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ONDE SUA MARCA APARECE */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-blue-neon/10 border border-blue-neon/20 text-blue-neon px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Globe size={16} />EXPOSICAO MULTI-CANAL
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Onde sua marca <span className="gradient-text">aparece</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto">
              Sua marca presente em todos os canais da MK10TV, garantindo exposicao continua e impactante.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exposureChannels.map((ch, i) => {
              const Icon = ch.icon;
              const isActive = activeChannel === i;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setActiveChannel(i)}
                  className={`relative bg-dark-card border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${isActive ? "border-primary/50 ring-2 ring-primary/20 bg-primary/5" : "border-dark-border hover:border-primary/30"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-primary/20 border border-primary/30" : "bg-dark-surface border border-dark-border"}`}>
                      <Icon size={22} className={isActive ? "text-primary" : "text-text-muted"} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{ch.label}</h4>
                      <p className="text-text-muted text-xs">{ch.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANOS DE PATROCINIO */}
      <section id="planos" className="py-20 bg-gradient-to-b from-dark-surface via-background to-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Award size={16} />PLANOS DE PATROCINIO
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Escolha o plano ideal para sua <span className="gradient-gold">empresa</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto">
              Investimento acessivel com retorno real para o seu negocio na regiao.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`relative bg-dark-card border ${plan.borderColor} ${plan.glowClass} rounded-2xl p-8 card-hover flex flex-col ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary-dark text-background text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">{plan.badge}</div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-2">{plan.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-text-muted text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                      <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-primary" : plan.borderColor.includes("gold") ? "text-gold" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contato" className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${plan.btnClass}`}>
                  Solicitar Proposta
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMPRESAS PARCEIRAS */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Handshake size={16} />EMPRESAS PARCEIRAS
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4">Quem ja acredita no projeto</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto">
              Empresas que acreditam no esporte e investem no futuro dos nossos jovens atletas.
            </motion.p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex gap-6 transition-transform duration-500" style={{ transform: `translateX(-${partnerIdx * 25}%)` }}>
                {[...partnerLogos, ...partnerLogos].map((p, i) => (
                  <div key={i} className="flex-shrink-0 w-full md:w-[calc(25%-18px)] bg-dark-card border border-dark-border rounded-2xl p-6 flex items-center justify-center hover:border-primary/30 transition-all min-h-[100px]">
                    <span className="text-text-muted font-bold text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevPartners} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all hidden md:flex">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextPartners} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all hidden md:flex">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-gradient-to-b from-dark-surface via-background to-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Star size={16} />DEPOIMENTOS
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4">O que dizem sobre nos</motion.h2>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${testIdx * 100}%)` }}>
                {testimonials.map((t, i) => (
                  <div key={i} className="flex-shrink-0 w-full bg-dark-card border border-dark-border rounded-2xl p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} className="text-gold fill-gold" />)}
                    </div>
                    <p className="text-foreground text-lg leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{t.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{t.name}</div>
                        <div className="text-text-muted text-xs">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              <button onClick={prevTest} className="w-10 h-10 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestIdx(i)} className={`h-2.5 rounded-full transition-all ${i === testIdx ? "bg-primary w-6" : "bg-dark-border w-2.5"}`} />
                ))}
              </div>
              <button onClick={nextTest} className="w-10 h-10 bg-dark-card border border-dark-border rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE CONTATO */}
      <section id="contato" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Send size={16} />FALE CONOSCO
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4">Receba uma proposta comercial</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-text-muted text-lg max-w-2xl mx-auto">
              Preencha o formulario e nossa equipe entrara em contato para personalizar a melhor solucao para sua empresa.
            </motion.p>
          </div>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-card border border-primary/30 rounded-2xl p-10 text-center glow-primary">
              <CheckCircle size={64} className="text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Proposta Enviada!</h2>
              <p className="text-text-muted">Recebemos sua mensagem. Nossa equipe entrara em contato em breve.</p>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome *</label>
                  <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Empresa *</label>
                  <input type="text" required value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Nome da empresa" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cidade *</label>
                  <input type="text" required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="Sua cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                  <input type="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="(55) 99999-0000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">WhatsApp *</label>
                  <input type="tel" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="(55) 99999-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">E-mail *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="email@empresa.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Plano de Interesse *</label>
                <select required value={form.plano} onChange={(e) => setForm({ ...form, plano: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all">
                  <option value="">Selecione um plano</option>
                  <option value="parceiro">Plano Parceiro Regional - R$ 199/mes</option>
                  <option value="destaque">Plano Destaque Regional - R$ 399/mes</option>
                  <option value="master">Plano Master MK10TV - R$ 799/mes</option>
                  <option value="personalizado">Plano Personalizado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mensagem</label>
                <textarea rows={4} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-3 text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all resize-none"
                  placeholder="Conte-nos mais sobre sua empresa e expectativas..." />
              </div>
              <button type="submit" disabled={sending}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-background font-bold px-8 py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2 glow-primary disabled:opacity-50">
                <Send size={20} />{sending ? "Enviando..." : "Receber Proposta Comercial"}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* RODAPE CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-dark-card to-gold/10 border-y border-primary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Patrocinar a MK10TV e investir no esporte, na comunidade e na visibilidade da sua marca.
            </h2>
            <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
              Junte-se as empresas que ja fazem parte deste projeto e multiplique o alcance da sua marca na regiao.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/5555999999999" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Zap size={20} />WhatsApp
              </a>
              <a href="https://www.instagram.com/mk10tv" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Star size={20} />Instagram
              </a>
              <a href="https://www.youtube.com/@mk10produtora" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all">
                <Play size={20} />YouTube
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
