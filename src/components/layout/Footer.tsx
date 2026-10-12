"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Heart, ShieldCheck, Truck, Sparkle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  const pathname = usePathname();

  // Do not show customer footer on the admin portal
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface transition-colors">
      {/* Brand Perks Strip */}
      <div className="border-b border-pink-100 dark:border-brand-dark-border bg-brand-primary-light/40 dark:bg-brand-dark-card/60 py-5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-full bg-white dark:bg-brand-dark-surface text-brand-primary shadow-sm border border-pink-200 dark:border-brand-dark-border">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">100% Handcrafted</p>
                <p className="text-xs text-gray-600 dark:text-brand-dark-muted">Salon-quality salon gel & durable tips</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-full bg-white dark:bg-brand-dark-surface text-brand-primary shadow-sm border border-pink-200 dark:border-brand-dark-border">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Reusable Up to 5+ Times</p>
                <p className="text-xs text-gray-600 dark:text-brand-dark-muted">Gentle on real nails, zero salon damage</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-full bg-white dark:bg-brand-dark-surface text-brand-primary shadow-sm border border-pink-200 dark:border-brand-dark-border">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Fast Nepal Delivery</p>
                <p className="text-xs text-gray-600 dark:text-brand-dark-muted">Kathmandu Valley & nationwide shipping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-primary block">
              ShineDe Nails
            </span>
            <p className="text-xs font-semibold tracking-widest text-brand-primary/80 uppercase">
              Bespoke Handcrafted Studio · Kathmandu, Nepal
            </p>
            <p className="text-xs text-gray-600 dark:text-brand-dark-muted leading-relaxed">
              Elevating press-on nails in Nepal with bespoke luxury designs, premium materials, and custom-tailored sizing in NPR that fits your lifestyle.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white mb-3">Shop & Create</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-brand-dark-muted">
              <li>
                <Link href="/custom-order" className="hover:text-brand-primary transition-colors flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Design Custom Set (NPR)</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-brand-primary transition-colors">
                  Find My Shape Quiz (30s)
                </Link>
              </li>
              <li>
                <Link href="/how-to-measure" className="hover:text-brand-primary transition-colors">
                  Nail Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-primary transition-colors">
                  My Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white mb-3">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-brand-dark-muted">
              <li>
                <Link href="/how-to-measure" className="hover:text-brand-primary transition-colors">
                  Application & Removal Guide
                </Link>
              </li>
              <li>
                <span className="text-gray-500 dark:text-brand-dark-muted cursor-default">Turnaround: 3-5 Days (Kathmandu)</span>
              </li>
              <li>
                <span className="text-gray-500 dark:text-brand-dark-muted cursor-default">eSewa / Khalti / COD Accepted</span>
              </li>
              <li>
                <span className="text-gray-500 dark:text-brand-dark-muted cursor-default">Care Kit Included Free</span>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-primary transition-colors text-xs opacity-75 hover:opacity-100 flex items-center gap-1 pt-1">
                  <span>Nail Artist Portal (/admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 dark:text-white mb-3">Join The Nail Club</h4>
            <p className="text-xs text-gray-600 dark:text-brand-dark-muted mb-3">
              Follow our latest drops, custom sets, and nail art tutorials on Instagram.
            </p>
            <a
              href="https://instagram.com/shine.denails"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-pink-300 dark:border-brand-dark-border bg-brand-primary-light dark:bg-brand-primary/20 px-4 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@shine.denails</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-pink-100 dark:border-brand-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-brand-dark-muted gap-2">
          <p>© {new Date().getFullYear()} ShineDe Nails. All rights reserved · Handcrafted in Nepal.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" /> for nail lovers
          </p>
        </div>
      </div>

      {/* Signature Solid Bottom Banner directly matching Logo.jpeg */}
      <div className="w-full bg-[#E93F66] py-3 text-center text-white">
        <a
          href="https://instagram.com/shine.denails"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold tracking-widest uppercase hover:underline inline-flex items-center gap-2 transition-transform hover:scale-105"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>@shine.denails</span>
        </a>
      </div>
    </footer>
  );
}
