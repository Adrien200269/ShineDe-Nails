"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Sparkles, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasCookieConsent, setCookieConsent, saveUserCookieSession } from "@/lib/cookies";
import { useAuth } from "@/lib/supabase/auth-context";

export function CookieConsentBanner() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  React.useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    // Check if user has already decided
    const consent = hasCookieConsent();
    if (consent === null) {
      // Delay showing banner slightly for pleasant initial page load experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleAccept = () => {
    setCookieConsent(true);
    if (user) {
      saveUserCookieSession(user);
    }
    setIsOpen(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-xl p-5 shadow-pink-lg dark:shadow-dark-card space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary shadow-pink-sm">
                <Cookie className="h-6 w-6" />
              </div>

              <div className="flex-1 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-base font-bold text-gray-900 dark:text-white">
                    Keep Me Logged In
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-primary bg-pink-100 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5" /> 365 Days
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-brand-dark-muted leading-relaxed">
                  We use cookies so you <strong className="text-brand-primary font-bold">don’t need to log in again and again</strong>, keeping your account active and saving your custom millimeter nail sizes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reassurance Badge */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-brand-dark-muted bg-pink-50/70 dark:bg-brand-dark-card/70 px-3 py-1.5 rounded-xl border border-pink-100 dark:border-brand-dark-border">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Safe & encrypted: your order history and sizing profile stay saved.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 gap-1.5 shadow-pink-md text-xs py-2.5 font-bold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept & Remember Me</span>
              </Button>

              <button
                type="button"
                onClick={handleDecline}
                className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-brand-dark-muted hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                Necessary Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
