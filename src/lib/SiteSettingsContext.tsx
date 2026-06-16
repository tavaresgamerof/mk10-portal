"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteSettings, defaultSettings } from "@/types/site-settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateColors: (colors: Partial<SiteSettings["colors"]>) => void;
  updateSocial: (social: Partial<SiteSettings["social"]>) => void;
  updateLogo: (logo: Partial<SiteSettings["logo"]>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "mk10_site_settings";
const COLORS_VERSION_KEY = "mk10_colors_version";
const CURRENT_COLORS_VERSION = "2";

function loadSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const storedVersion = localStorage.getItem(COLORS_VERSION_KEY);
    if (storedVersion !== CURRENT_COLORS_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(COLORS_VERSION_KEY, CURRENT_COLORS_VERSION);
      return defaultSettings;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    }
  } catch {}
  return defaultSettings;
}

function saveSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function applyColors(colors: SiteSettings["colors"]) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", colors.primary);
  root.style.setProperty("--color-primary-dark", colors.primaryDark);
  root.style.setProperty("--color-secondary", colors.secondary);
  root.style.setProperty("--color-accent", colors.accent);
  root.style.setProperty("--color-background", colors.background);
  root.style.setProperty("--color-surface", colors.surface);
  root.style.setProperty("--color-card", colors.card);
  root.style.setProperty("--color-border", colors.border);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    applyColors(settings.colors);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: one-time client mount flag
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loaded) {
      saveSettings(settings);
      applyColors(settings.colors);
    }
  }, [settings, loaded]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateColors = (colors: Partial<SiteSettings["colors"]>) => {
    setSettings((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  };

  const updateSocial = (social: Partial<SiteSettings["social"]>) => {
    setSettings((prev) => ({
      ...prev,
      social: { ...prev.social, ...social },
    }));
  };

  const updateLogo = (logo: Partial<SiteSettings["logo"]>) => {
    setSettings((prev) => ({
      ...prev,
      logo: { ...prev.logo, ...logo },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applyColors(defaultSettings.colors);
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, updateSettings, updateColors, updateSocial, updateLogo, resetSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
