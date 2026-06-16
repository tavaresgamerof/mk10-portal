import { Target, Eye, Heart, Users, Play, Star } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-gradient-to-b from-primary/10 via-dark-surface to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Sobre o MK10 Tv</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            A paixão pelo esporte de base fala mais alto!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Nossa Historia</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                O MK10 nasceu com o proposito de valorizar talentos, contar historias e
                fortalecer o esporte de base. Acreditamos que cada jovem atleta merece
                ser reconhecido e ter a oportunidade de mostrar seu talento.
              </p>
              <p>
                Nosso canal no YouTube (@mk10produtora) e nosso Instagram (@mk10tv)
                sao os principais canais onde compartilhamos conteudo sobre esporte
                de base, transmissoes ao vivo, entrevistas e muito mais.
              </p>
              <p>
                Alem de transmissoes, produzimos conteudo como o &quot;Papo de Base MK10Tv&quot;,
                onde conversamos com jovens atletas, treinadores e lideres do esporte
                base brasileiro.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="https://www.youtube.com/@mk10produtora"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                <Play size={18} fill="currentColor" />
                YouTube
              </a>
              <a
                href="https://www.instagram.com/mk10tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                <Star size={18} />
                Instagram
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
                alt="Estadio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-dark-card border border-primary/30 rounded-2xl p-6 glow-green">
              <p className="text-3xl font-bold text-primary">MK10</p>
              <p className="text-text-muted text-sm">Esporte de Base</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            { icon: Target, title: "Missao", desc: "Valorizar talentos do esporte de base e contar historias que importam." },
            { icon: Eye, title: "Visao", desc: "Ser referencia em conteudo esportivo de base no Brasil." },
            { icon: Heart, title: "Valores", desc: "Paixao, autenticidade, compromisso com o jovem atleta e qualidade." },
            { icon: Users, title: "Comunidade", desc: "Conectar torcedores, atletas e profissionais do esporte base." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 card-hover text-center">
                <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Nossos Canais</h2>
          <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
            Acompanhe nosso conteudo nas principais plataformas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <a
              href="https://www.youtube.com/@mk10produtora"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-surface border border-dark-border rounded-xl p-6 card-hover text-center"
            >
              <Play size={40} className="text-red-500 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">YouTube</h3>
              <p className="text-text-muted text-sm">@mk10produtora</p>
            </a>
            <a
              href="https://www.instagram.com/mk10tv/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-surface border border-dark-border rounded-xl p-6 card-hover text-center"
            >
              <Star size={40} className="text-pink-500 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-1">Instagram</h3>
              <p className="text-text-muted text-sm">@mk10tv</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
