"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/lib/supabase/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Shape Quiz" },
    { href: "/how-to-measure", label: "Sizing Guide" },
    { href: "/dashboard", label: "My Orders & Sizes" },
  ];

  // Do not show the customer shop navbar on the admin studio portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-pink-200/80 dark:border-brand-dark-border bg-brand-bg/95 dark:bg-brand-dark-surface/95 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(233,63,102,0.12)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
          : "border-b border-pink-200/50 dark:border-brand-dark-border/60 bg-brand-bg/80 dark:bg-brand-dark-surface/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-primary/30 shadow-sm flex items-center justify-center bg-white dark:bg-brand-dark-card">
            <Image
              src="/logo.jpeg"
              alt="ShineDe Nails Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-primary group-hover:text-brand-primary-hover transition-colors">
                ShineDe Nails
              </span>
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-brand-primary/70 dark:text-brand-primary/80 -mt-1 hidden sm:inline">
              PRESS. SLAY. REPEAT.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-brand-primary py-1 relative",
                  isActive
                    ? "text-brand-primary font-bold"
                    : "text-gray-700 dark:text-brand-dark-text"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions / CTA / Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Auth indicator */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/dashboard">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-xs font-bold text-gray-800 dark:text-brand-dark-text hover:border-brand-primary transition-all shadow-sm"
                  title={user.email}
                >
                  <div className="h-5 w-5 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center">
                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.fullName?.split(" ")[0] || "Account"}</span>
                </button>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-pink-100 dark:hover:bg-brand-dark-card transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Button>
            </Link>
          )}

          {/* Custom Set CTA */}
          <Link href="/custom-order" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-1.5 shadow-pink-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Custom Set</span>
            </Button>
          </Link>

          {/* Mobile Profile Link */}
          <Link href={user ? "/dashboard" : "/auth"} className="inline-flex sm:hidden">
            <button
              className="p-2 text-gray-700 dark:text-brand-dark-text hover:text-brand-primary rounded-full hover:bg-pink-100 dark:hover:bg-brand-dark-card transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-brand-dark-text hover:text-brand-primary rounded-xl hover:bg-pink-100 dark:hover:bg-brand-dark-card transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-pink-200 dark:border-brand-dark-border bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors",
                    isActive
                      ? "bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary font-bold"
                      : "text-gray-800 dark:text-brand-dark-text hover:bg-pink-50 dark:hover:bg-brand-dark-card hover:text-brand-primary"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-pink-100 dark:border-brand-dark-border flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-bold text-gray-600 dark:text-brand-dark-muted">
                Theme Appearance
              </span>
              <ThemeToggle showLabel />
            </div>

            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-primary text-xs font-bold text-white flex items-center justify-center">
                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {user.fullName || "User"}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center gap-2 py-2.5 text-xs">
                  <LogIn className="w-4 h-4" />
                  <span>Log In / Sign Up</span>
                </Button>
              </Link>
            )}

            <Link href="/custom-order" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center gap-2 py-3 shadow-pink-md">
                <Sparkles className="w-4 h-4" />
                <span>Start Your Custom Set</span>
              </Button>
            </Link>

            <div className="text-center mt-2 flex items-center justify-center gap-2">
              <span className="text-xs text-brand-primary font-bold tracking-widest uppercase">
                @shine.denails
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">🇳🇵 Nepal</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
