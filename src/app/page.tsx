import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import { LiveIndicator } from "@/components/LiveIndicator";
import { NextMatches } from "@/components/NextMatches";
import { LatestNews } from "@/components/LatestNews";
import { VideoHighlights } from "@/components/VideoHighlights";
import { SponsorsBar } from "@/components/SponsorsBar";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <LiveIndicator />
      <SponsorsBar />
      <NextMatches />
      <LatestNews />
      <VideoHighlights />

      <section className="bg-gradient-to-r from-primary/10 via-dark-surface to-primary/10 border-y border-primary/20 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Torne-se Nosso Patrocinador
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
            Divulgue sua marca para o publico esportivo mais engajado do Brasil.
            Alcance milhoes de torcedores apaixonados.
          </p>
          <Link
            href="/propostas"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold px-8 py-4 rounded-xl text-lg transition-all glow-primary"
          >
            Enviar Proposta
          </Link>
        </div>
      </section>
    </div>
  );
}
