import type { AdminToken } from "./types";

export const ADMIN_TOKEN_KEY = "portfolio.admin-token.v1";
export const ADMIN_SESSION_EVENT = "portfolio:auth-changed";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "123456";

const SESSION_TTL = 1000 * 60 * 60 * 8;

function createToken(username: string): string {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `adm_${Date.now().toString(36)}_${randomPart.replace(/-/g, "")}`;
}

function parseToken(raw: string): AdminToken | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const source = parsed as Record<string, unknown>;
    if (
      typeof source.username !== "string" ||
      typeof source.token !== "string" ||
      typeof source.issuedAt !== "number" ||
      typeof source.expiresAt !== "number"
    ) {
      return null;
    }
    return {
      username: source.username,
      token: source.token,
      issuedAt: source.issuedAt,
      expiresAt: source.expiresAt,
    };
  } catch {
    return null;
  }
}

export function login(username: string, password: string): AdminToken | null {
  if (typeof window === "undefined") return null;
  if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return null;
  }
  const now = Date.now();
  const session: AdminToken = {
    username: ADMIN_USERNAME,
    token: createToken(ADMIN_USERNAME),
    issuedAt: now,
    expiresAt: now + SESSION_TTL,
  };
  window.localStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
  return session;
}

export function getAdminSession(): AdminToken | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!raw) return null;
    const session = parseToken(raw);
    if (!session) {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      return null;
    }
    if (session.expiresAt <= Date.now()) {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export function subscribeAuth(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === ADMIN_TOKEN_KEY) {
      listener();
    }
  };
  window.addEventListener(ADMIN_SESSION_EVENT, listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(ADMIN_SESSION_EVENT, listener);
    window.removeEventListener("storage", handleStorage);
  };
}
