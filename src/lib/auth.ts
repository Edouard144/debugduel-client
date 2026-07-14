// Auth store with localStorage persistence
type AuthListener = (token: string | null) => void;

let accessToken: string | null = null;
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem("bugcombat_access");
}
let refreshToken: string | null = null;
if (typeof window !== "undefined") {
  refreshToken = localStorage.getItem("bugcombat_refresh");
}

let currentUser: {
  id?: number;
  username?: string;
  email?: string;
  bio?: string;
  total_duels?: number;
  wins?: number;
  losses?: number;
  created_at?: string;
} | null = null;
const listeners = new Set<AuthListener>();

export const auth = {
  get token() { return accessToken; },
  get refresh() { return refreshToken; },
  get user() { return currentUser; },
  setTokens(access: string, refresh?: string) {
    accessToken = access;
    if (typeof window !== "undefined") localStorage.setItem("bugcombat_access", access);
    if (refresh) {
      refreshToken = refresh;
      if (typeof window !== "undefined") localStorage.setItem("bugcombat_refresh", refresh);
    }
    listeners.forEach((l) => l(accessToken));
  },
  setUser(u: typeof currentUser) { currentUser = u; },
  clear() {
    accessToken = null;
    refreshToken = null;
    currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("bugcombat_access");
      localStorage.removeItem("bugcombat_refresh");
    }
    listeners.forEach((l) => l(null));
  },
  subscribe(fn: AuthListener): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
};

export const API_BASE = "https://bugcomboo.onrender.com";
export const WS_BASE = "wss://bugcomboo.onrender.com";

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false && accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg = (data && (data.detail || data.message || JSON.stringify(data))) || res.statusText;
    throw new Error(msg);
  }
  return data as T;
}

function safeJson(s: string) {
  try { return JSON.parse(s); } catch { return s; }
}
