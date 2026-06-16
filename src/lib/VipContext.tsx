"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface VipUser {
  email: string;
  plan: "basico" | "premium" | "ultra";
}

interface VipContextType {
  isVip: boolean;
  user: VipUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const VipContext = createContext<VipContextType | undefined>(undefined);

const VIP_STORAGE_KEY = "mk10_vip_auth";

const VIP_USERS: { email: string; password: string; plan: VipUser["plan"] }[] = [
  { email: "vip@mk10.com", password: "mk10vip", plan: "premium" },
  { email: "teste@teste.com", password: "123456", plan: "basico" },
  { email: "admin@mk10.com", password: "mk10admin", plan: "ultra" },
];

function loadInitialUser(): VipUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(VIP_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveVipUser(user: VipUser | null) {
  try {
    if (user) {
      localStorage.setItem(VIP_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(VIP_STORAGE_KEY);
    }
  } catch {}
}

export function VipProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VipUser | null>(loadInitialUser);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = useCallback((email: string, password: string) => {
    const found = VIP_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const vipUser: VipUser = { email: found.email, plan: found.plan };
      setUser(vipUser);
      saveVipUser(vipUser);
      setShowLoginModal(false);
      return { success: true };
    }
    return { success: false, error: "Credenciais invalidas" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveVipUser(null);
  }, []);

  return (
    <VipContext.Provider
      value={{
        isVip: !!user,
        user,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </VipContext.Provider>
  );
}

export function useVip() {
  const context = useContext(VipContext);
  if (!context) {
    throw new Error("useVip must be used within a VipProvider");
  }
  return context;
}
