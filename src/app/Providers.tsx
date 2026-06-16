"use client";

import { ReactNode } from "react";
import { SiteSettingsProvider } from "@/lib/SiteSettingsContext";
import { VipProvider } from "@/lib/VipContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { VipLoginModal } from "@/components/VipLoginModal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteSettingsProvider>
      <VipProvider>
        <Header />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
        <VipLoginModal />
      </VipProvider>
    </SiteSettingsProvider>
  );
}
