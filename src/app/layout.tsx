import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MK10TV | Esporte de Base Ao Vivo & Notícias",
  description: "Canal MK10 - A paixão pelo esporte de base fala mais alto! Transmissões ao vivo, entrevistas, papo de base e muito mais.",
  keywords: "esporte de base, futebol ao vivo, transmissão, MK10TV, mk10produtora",
  icons: {
    icon: [
      { url: "/logo-mk10.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MK10TV | Esporte de Base Ao Vivo & Notícias",
    description: "Canal MK10 - A paixão pelo esporte de base fala mais alto!",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
