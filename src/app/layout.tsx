import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { HelloKittyCursorTrail } from "@/components/layout/HelloKittyCursorTrail";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ShineDe Nails | Custom Press-On Nails — PRESS. SLAY. REPEAT.",
  description: "Custom luxury press-on nails made to your exact measurements and design inspiration. Handcrafted, salon-quality, reusable nail sets delivered across Nepal.",
  keywords: ["custom press-on nails Nepal", "nail art Kathmandu", "ShineDe Nails", "luxury nails NPR", "press-on nails Nepal"],
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "ShineDe Nails | Custom Press-On Nails",
    description: "PRESS. SLAY. REPEAT. Upload your dream nail inspo and get tailored salon-quality press-ons.",
    images: ["/logo.jpeg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E93F66",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakartaSans.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen font-sans bg-brand-bg dark:bg-brand-dark-bg text-brand-text dark:text-brand-dark-text flex flex-col selection:bg-brand-primary/20 selection:text-brand-primary transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <ScrollProgressBar />
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <ScrollToTop />
            <HelloKittyCursorTrail />
            <CookieConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
