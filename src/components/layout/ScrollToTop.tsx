"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";

export function ScrollToTop() {
  const [show, setShow] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 group flex items-center justify-center h-12 w-12 rounded-full bg-white/90 dark:bg-brand-dark-surface/90 backdrop-blur-md border border-pink-200 dark:border-brand-dark-border shadow-pink-md dark:shadow-dark-card hover:border-brand-primary/60 dark:hover:border-brand-primary text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          {/* Subtle circular SVG progress ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5" viewBox="0 0 36 36">
            <path
              className="text-pink-100 dark:text-pink-950/40"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-brand-primary transition-all duration-150 ease-out"
              strokeDasharray={`${scrollPercent}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Icon with hover switch to sparkle */}
          <div className="relative flex items-center justify-center">
            <ArrowUp className="w-5 h-5 text-brand-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
