"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring physics for a silky, luxury liquid feel
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Only show after user starts scrolling down a bit
      if (window.scrollY > 15) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-brand-primary via-pink-400 to-rose-500 shadow-[0_0_12px_rgba(233,63,102,0.7)]"
        style={{ scaleX }}
      />
    </div>
  );
}
