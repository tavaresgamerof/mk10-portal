export interface AdminUser {
  id: number;
  username: string;
  password: string;
  name: string;
}

const STORAGE_KEY = "mk10_admin_users";

const DEFAULT_ADMINS: AdminUser[] = [
  { id: 1, username: "admin", password: "mk10admin", name: "Admin" },
  { id: 2, username: "empwilliamtavares@gmail.com", password: "inf4j61imc5f15", name: "William" },
];

export function loadAdmins(): AdminUser[] {
  if (typeof window === "undefined") return DEFAULT_ADMINS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  saveAdmins(DEFAULT_ADMINS);
  return DEFAULT_ADMINS;
}

export function saveAdmins(admins: AdminUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admins));
  } catch {}
}

export function validateAdmin(username: string, password: string): AdminUser | null {
  const admins = loadAdmins();
  return admins.find((a) => a.username === username && a.password === password) ?? null;
}

export function addAdmin(username: string, password: string, name: string): AdminUser[] {
  const admins = loadAdmins();
  if (admins.some((a) => a.username === username)) return admins;
  const updated = [...admins, { id: Date.now(), username, password, name }];
  saveAdmins(updated);
  return updated;
}

export function removeAdmin(id: number): AdminUser[] {
  const admins = loadAdmins().filter((a) => a.id !== id);
  saveAdmins(admins);
  return admins;
}

export function updateAdmin(id: number, data: Partial<Pick<AdminUser, "username" | "password" | "name">>): AdminUser[] {
  const admins = loadAdmins().map((a) => a.id === id ? { ...a, ...data } : a);
  saveAdmins(admins);
  return admins;
}
