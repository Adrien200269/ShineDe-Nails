"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Lock, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = React.useState("shinede@admin.com");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check strictly against user provided credentials:
      // admin id: shinede@admin.com
      // password: nimdeeks
      if (cleanEmail === "shinede@admin.com" && cleanPass === "nimdeeks") {
        try {
          localStorage.setItem("shinede_admin_session", "authenticated");
          document.cookie = "shinede_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";
        } catch {
          // Ignore
        }
        onLoginSuccess();
      } else {
        setError("Invalid Artist ID or Password. Please check your credentials.");
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail("shinede@admin.com");
    setPassword("nimdeeks");
    setError("");
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg flex items-center justify-center p-4 sm:p-6 transition-colors relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-4xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-7 sm:p-9 shadow-pink-md dark:shadow-dark-card space-y-6">
          {/* Logo & Portal Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand-primary p-0.5 shadow-pink-sm mb-3 bg-white">
              <Image
                src="/logo.jpeg"
                alt="ShineDe Nails Logo"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-pink-100 dark:bg-pink-950/60 px-3 py-0.5 rounded-full border border-pink-200 dark:border-pink-900/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Nail Artist Studio Portal
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              ShineDe Nails Admin
            </h1>

            <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
              Kathmandu Studio · Order Management & Client Chat
            </p>
          </div>

          {/* Quick-fill helper button */}
          <div className="p-3 rounded-2xl bg-pink-50/70 dark:bg-brand-dark-card/70 border border-pink-100 dark:border-brand-dark-border flex items-center justify-between text-xs">
            <div className="text-gray-600 dark:text-brand-dark-muted">
              <span>Nail Artist ID: </span>
              <strong className="text-brand-primary font-mono">shinede@admin.com</strong>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-brand-primary hover:underline bg-white dark:bg-brand-dark-surface px-2.5 py-1 rounded-full border border-pink-200 shadow-xs"
            >
              Fill Credentials
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-brand-dark-muted mb-1.5">
                Admin ID / Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shinede@admin.com"
                className="w-full rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-brand-dark-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2 shadow-pink-md h-12 text-sm font-bold rounded-2xl mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Enter Artist Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
