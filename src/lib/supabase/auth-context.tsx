"use client";

import * as React from "react";
import { createClient, isSupabaseConfigured } from "./client";
import {
  saveUserCookieSession,
  getUserCookieSession,
  clearUserCookieSession,
} from "../cookies";

export interface UserSession {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ error?: string }>;
  sendGmailOtp: (email: string, name?: string) => Promise<{ error?: string }>;
  signInWithOtpCode: (email: string, code: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInDemoUser: () => void;
  setDirectUser: (user: UserSession) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = "shinede_current_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const persistUser = React.useCallback((u: UserSession) => {
    setUser(u);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
    } catch {
      // Ignore
    }
    saveUserCookieSession(u);
  }, []);

  React.useEffect(() => {
    // 1. Check persistent cookie and local session so user doesn't have to log in repeatedly
    try {
      const cookieUser = getUserCookieSession();
      if (cookieUser) {
        setUser(cookieUser);
      } else {
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          saveUserCookieSession(parsed);
        }
      }
    } catch {
      // Ignore
    }

    // 2. If Supabase configured, listen to real session
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: UserSession = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            avatarUrl: session.user.user_metadata?.avatar_url,
          };
          persistUser(u);
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u: UserSession = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            avatarUrl: session.user.user_metadata?.avatar_url,
          };
          persistUser(u);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          try {
            localStorage.removeItem(LOCAL_USER_KEY);
          } catch {
            // Ignore
          }
          clearUserCookieSession();
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Google authentication error";
        return { error: msg };
      }
    } else {
      // Demo Google login
      const demoUser: UserSession = {
        id: "usr_google_demo",
        email: "chloe.denails@gmail.com",
        fullName: "Chloe Valentine",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
      return {};
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) return { error: error.message };
        if (data.user) {
          const u: UserSession = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          };
          persistUser(u);
        }
        return {};
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Sign in failed" };
      }
    } else {
      // Demo login
      const demoUser: UserSession = {
        id: `usr_${Date.now()}`,
        email,
        fullName: email.split("@")[0].toUpperCase(),
      };
      persistUser(demoUser);
      return {};
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: name },
          },
        });
        if (error) return { error: error.message };
        if (data.user) {
          const u: UserSession = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: name,
          };
          persistUser(u);
        }
        return {};
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Sign up failed" };
      }
    } else {
      // Demo sign up
      const demoUser: UserSession = {
        id: `usr_${Date.now()}`,
        email,
        fullName: name,
      };
      persistUser(demoUser);
      return {};
    }
  };

  const sendGmailOtp = async (email: string, name?: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Failed to send verification code." };
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Network error sending verification code" };
    }
  };

  const signInWithOtpCode = async (email: string, code: string, fullName?: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || "Invalid verification code." };
      }
      if (data.user) {
        const u: UserSession = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName || email.split("@")[0],
        };
        persistUser(u);
      }
      return {};
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Verification failed" };
    }
  };

  const setDirectUser = (newUser: UserSession) => {
    persistUser(newUser);
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    setUser(null);
    try {
      localStorage.removeItem(LOCAL_USER_KEY);
    } catch {
      // Ignore
    }
    clearUserCookieSession();
  };

  const signInDemoUser = () => {
    const demoUser: UserSession = {
      id: "usr_vip_demo",
      email: "chloe@example.com",
      fullName: "Chloe Valentine",
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendGmailOtp,
        signInWithOtpCode,
        signOut,
        signInDemoUser,
        setDirectUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
