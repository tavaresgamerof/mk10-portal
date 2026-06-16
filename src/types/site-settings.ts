export interface SiteColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  border: string;
}

export interface SiteLogo {
  url: string;
  alt: string;
}

export interface SiteSocial {
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  facebook: string;
  whatsapp: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: SiteLogo;
  colors: SiteColors;
  social: SiteSocial;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export const defaultSettings: SiteSettings = {
  siteName: "MK10 Tv",
  siteDescription: "A paixão pelo esporte de base fala mais alto! Valorizando talentos, contando histórias e fortalecendo o esporte.",
  logo: {
    url: "",
    alt: "MK10 Tv",
  },
  colors: {
    primary: "#c0392b",
    primaryDark: "#a93226",
    secondary: "#1c2a45",
    accent: "#2980b9",
    background: "#0d1520",
    surface: "#131d2e",
    card: "#1a2744",
    border: "#2c3e5a",
  },
  social: {
    instagram: "https://www.instagram.com/mk10tv/",
    youtube: "https://www.youtube.com/@mk10produtora",
    tiktok: "",
    twitter: "",
    facebook: "",
    whatsapp: "",
  },
  contactEmail: "",
  contactPhone: "",
  address: "",
};
