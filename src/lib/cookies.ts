/**
 * Cookie Utilities for ShineDe Nails
 * Handles persistent session authentication and user consent so customers stay logged in.
 */

import { UserSession } from "@/types";

export const COOKIE_CONSENT_KEY = "shinede_cookie_consent";
export const COOKIE_AUTH_USER_KEY = "shinede_auth_session";
export const COOKIE_MEASUREMENTS_KEY = "shinede_saved_sizes";

/**
 * Set a cookie with expiration in days
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax${secure}`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${encodeURIComponent(name)}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return null;
}

/**
 * Delete a cookie by expiring it immediately
 */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/**
 * Check if the user has accepted cookies
 */
export function hasCookieConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const val = getCookie(COOKIE_CONSENT_KEY) || localStorage.getItem(COOKIE_CONSENT_KEY);
  if (val === "accepted") return true;
  if (val === "declined") return false;
  return null;
}

/**
 * Save user cookie consent choice
 */
export function setCookieConsent(accepted: boolean): void {
  const val = accepted ? "accepted" : "declined";
  setCookie(COOKIE_CONSENT_KEY, val, 365);
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, val);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Persist user auth session in cookies so they don't need to log in again
 */
export function saveUserCookieSession(user: { id: string; email: string; fullName?: string; avatarUrl?: string }): void {
  try {
    const serialized = JSON.stringify(user);
    // Keep user logged in for 365 days
    setCookie(COOKIE_AUTH_USER_KEY, serialized, 365);
    localStorage.setItem(COOKIE_AUTH_USER_KEY, serialized);
  } catch (err) {
    console.error("Error saving persistent user cookie session:", err);
  }
}

/**
 * Retrieve user auth session from cookies
 */
export function getUserCookieSession(): { id: string; email: string; fullName?: string; avatarUrl?: string } | null {
  try {
    const raw = getCookie(COOKIE_AUTH_USER_KEY) || (typeof window !== "undefined" ? localStorage.getItem(COOKIE_AUTH_USER_KEY) : null);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear persistent user auth session
 */
export function clearUserCookieSession(): void {
  deleteCookie(COOKIE_AUTH_USER_KEY);
  try {
    localStorage.removeItem(COOKIE_AUTH_USER_KEY);
  } catch {
    // Ignore
  }
}
