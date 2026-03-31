import { SESSION_COOKIE_NAME, TOKEN_KEY, USER_KEY } from "./constants";
import type { Role } from "./roles";

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  district: string;
  city: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveSession(token: string, user: SessionUser): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function getToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): SessionUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
