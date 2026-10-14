"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Ruler,
  UploadCloud,
  Scissors,
  Star,
  ShieldCheck,
  Zap,
  Sparkle,
  Heart,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { NailfieReviewWall } from "@/components/home/NailfieReviewWall";
import { NailJournalNotebook } from "@/components/home/NailJournalNotebook";
import { NailDesign, fetchNailDesigns } from "@/lib/nail-designs";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const [nailDesigns, setNailDesigns] = React.useState<NailDesign[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = React.useState(true);

  React.useEffect(() => {
    fetchNailDesigns()
      .then((data) => setNailDesigns(data))
      .catch((err) => console.warn("Could not load nail designs:", err))
      .finally(() => setIsLoadingDesigns(false));
  }, []);

  // Scroll parallax transforms for ambient luxury elements
  const yParallaxGlow = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yParallaxSparkleLeft = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yParallaxSparkleRight = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const rotateGlow = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const steps = [
    {
      number: "01",
      title: "Measure Your Nails",
      desc: "Use clear tape and a millimeter ruler in 2 minutes. Enter standard sizes or your exact 5-finger millimeters.",
      icon: Ruler,
    },
    {
      number: "02",
      title: "Upload Your Inspo",
      desc: "Found a look on Pinterest, Instagram, or TikTok? Drop the screenshot or photo directly into our custom order creator.",
      icon: UploadCloud,
    },
    {
      number: "03",
      title: "Choose Shape & Length",
      desc: "Customize your set with your favorite silhouette: Almond, Coffin, Square, Stiletto, or Oval.",
      icon: Scissors,
    },
    {
      number: "04",
      title: "Slay & Repeat",
      desc: "We handcraft your set with premium salon gel. Apply in 10 minutes, wear for 3+ weeks, and reuse up to 5 times.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col subtle-sparkle-bg transition-colors relative overflow-hidden">
      {/* Scroll-responsive ambient floating stars / sparkles in background */}
      <motion.div
        style={{ y: yParallaxSparkleLeft, rotate: rotateGlow }}
        className="hidden md:block absolute top-40 left-8 pointer-events-none z-0 text-pink-300/40 dark:text-pink-600/30"
      >
        <Sparkle className="w-10 h-10 animate-pulse-slow" />
      </motion.div>

      <motion.div
        style={{ y: yParallaxSparkleRight }}
        className="hidden md:block absolute top-96 right-10 pointer-events-none z-0 text-rose-300/40 dark:text-rose-600/30"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24">
        {/* Parallax glow backdrop circle */}
        <motion.div
          style={{ y: yParallaxGlow }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center">
          {/* Subtle floating brand tag */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 dark:border-brand-dark-border bg-white/90 dark:bg-brand-dark-card/90 px-4 py-1.5 text-xs font-bold text-brand-primary shadow-sm backdrop-blur-md mb-6 hover:scale-105 transition-transform"
          >
            <Sparkles className="h-4 w-4 text-brand-primary animate-spin-slow" />
            <span>Luxury Handcrafted Press-On Nails in Nepal</span>
            <span className="hidden sm:inline text-pink-300 dark:text-pink-700">|</span>
            <span className="hidden sm:inline text-gray-500 dark:text-brand-dark-muted font-semibold">Delivery Across Nepal</span>
          </motion.div>

          {/* Main Brand Title & Tagline matching Logo.jpeg */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-primary leading-[1.08] max-w-4xl mx-auto"
          >
            ShineDe Nails
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-base sm:text-xl font-bold tracking-[0.25em] text-brand-primary/80 uppercase"
          >
            PRESS. SLAY. REPEAT.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-6 text-base sm:text-lg text-gray-600 dark:text-brand-dark-muted max-w-2xl mx-auto leading-relaxed"
          >
            Salon-quality gel nails without the 3-hour appointment or nail damage. Send us your dream Pinterest inspo, choose your specs, and receive bespoke reusable press-ons handcrafted in Kathmandu.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link href="/custom-order" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2.5 text-base shadow-pink-md group transition-all duration-300 hover:shadow-pink-lg hover:-translate-y-0.5">
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Design Your Custom Set (From Rs. 700)</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>

            <Link href="/how-to-measure" className="w-full sm:w-auto">
              <Button
                variant="white"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base text-gray-800 dark:text-brand-dark-text dark:bg-brand-dark-surface dark:border-brand-dark-border hover:text-brand-primary hover:-translate-y-0.5 transition-all"
              >
                <Ruler className="h-4 w-4 text-brand-primary" />
                <span>How to Measure</span>
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof Trust Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 pt-8 border-t border-pink-200/60 dark:border-brand-dark-border max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 dark:text-brand-dark-muted font-medium"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-900 dark:text-white">5.0 Star Rated in Nepal</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-primary" />
              <span>Free Prep Kit with Every Order</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-brand-primary" />
              <span>Reusable 5+ Times</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. "How It Works" Section with Scroll Reveal */}
      <section className="py-16 sm:py-24 bg-white/70 dark:bg-brand-dark-surface/60 border-y border-pink-200/60 dark:border-brand-dark-border transition-colors relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
              Seamless 4-Step Process
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-brand-dark-muted">
              Getting custom bespoke press-on nails has never been this effortless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative flex flex-col rounded-3xl border border-pink-100 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card dark:shadow-dark-card hover:shadow-pink-md dark:hover:border-brand-primary/50 transition-all group cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-pink-300 dark:text-pink-800 group-hover:text-brand-primary transition-colors">
                      {step.number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Inline CTA in How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link href="/custom-order">
              <Button size="lg" className="shadow-pink-md hover:shadow-pink-lg transition-all hover:scale-105">
                Start Step 1: Upload Your Inspo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. Trending Custom Styles & Inspo Gallery with Scroll Reveal */}
      <section className="py-16 sm:py-24 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 text-center sm:text-left gap-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
                Artist Spotlight · Nepal
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Trending Custom Creations
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-brand-dark-muted">
                Browse recent client orders handcrafted by our nail technicians in Nepal.
              </p>
            </div>
            <Link href="/custom-order">
              <Button variant="outline" size="sm" className="gap-1.5 self-center sm:self-auto hover:bg-brand-primary hover:text-white transition-all">
                <span>Create Your Own Set</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>

          {isLoadingDesigns ? (
            <div className="py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading custom nail creations...</p>
            </div>
          ) : nailDesigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nailDesigns.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-3xl border border-pink-100 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card shadow-card dark:shadow-dark-card hover:shadow-pink-md dark:hover:border-brand-primary/50 transition-all flex flex-col"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-pink-50 dark:bg-brand-dark-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-brand-dark-surface/90 backdrop-blur-md text-[11px] font-bold text-brand-primary px-2.5 py-1 rounded-full border border-pink-200 dark:border-brand-dark-border shadow-xs">
                      {item.shape || "Almond"} · {item.length || "Medium"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-brand-primary font-bold mt-1">Starting from Rs. {item.price}</p>
                    </div>
                    <Link
                      href={`/custom-order?shape=${encodeURIComponent(item.shape?.toLowerCase() || "almond")}&length=${encodeURIComponent(item.length?.toLowerCase() || "medium")}`}
                      className="mt-3 pt-3 border-t border-pink-100 dark:border-brand-dark-border"
                    >
                      <span className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        <span>Customize this set</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white/80 dark:bg-brand-dark-card/80 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary shadow-sm">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Handcrafted Bespoke Press-On Nails
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted leading-relaxed">
                  Every set at ShineDe Nails is custom-sculpted by our artists in Kathmandu to your exact sizing and inspiration photo. Base price begins at just <strong>Rs. 700</strong>!
                </p>
              </div>
              <Link href="/custom-order" className="inline-block pt-1">
                <Button size="lg" className="shadow-pink-md gap-2">
                  <span>Design Your Custom Set (From Rs. 700)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Community Nailfies & 5-Star Reviews Wall */}
      <NailfieReviewWall />

      {/* 5. The Nail Artist's Interactive Notebook Diary (taliahhh.com inspired) */}
      <NailJournalNotebook />

      {/* 6. Instagram Feed & Community Banner with Scroll Zoom */}
      <section className="py-12 bg-gradient-to-r from-pink-100/60 via-pink-50 to-pink-100/60 dark:from-brand-dark-card dark:via-brand-dark-surface dark:to-brand-dark-card border-t border-pink-200 dark:border-brand-dark-border transition-colors relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl px-4 sm:px-6 text-center"
        >
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border shadow-pink-sm mb-3">
            <InstagramIcon className="w-7 h-7 text-brand-primary" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Join the ShineDe Community in Nepal
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted mt-1 max-w-md mx-auto">
            Tag us in your nail selfies for a chance to be featured and win free custom sets each month!
          </p>
          <a
            href="https://instagram.com/shine.denails"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-pink-md hover:bg-brand-primary-hover transition-all hover:scale-105 active:scale-95"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @shine.denails</span>
          </a>
        </motion.div>
      </section>
    </div>
  );
}
