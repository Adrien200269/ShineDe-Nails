"use client";

import * as React from "react";

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  type: "sparkle" | "heart" | "dot";
  rotation: number;
}

export function HelloKittyCursorTrail() {
  const [particles, setParticles] = React.useState<SparkleParticle[]>([]);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const particleIdRef = React.useRef(0);
  const lastEmitTime = React.useRef(0);

  React.useEffect(() => {
    // Only enable on desktop pointer devices
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsDesktop(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  React.useEffect(() => {
    if (!isDesktop) return;

    const colors = ["#FF5E8E", "#E93F66", "#FFB6C1", "#FFD700", "#FF8DA1"];
    const types: Array<"sparkle" | "heart" | "dot"> = ["sparkle", "heart", "dot"];

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle sparkle creation so it's smooth and subtle (every 45ms)
      if (now - lastEmitTime.current < 45) return;
      lastEmitTime.current = now;

      // Small offset so sparkles emerge right behind Hello Kitty
      const newParticle: SparkleParticle = {
        id: ++particleIdRef.current,
        x: e.clientX + (Math.random() * 8 - 4),
        y: e.clientY + (Math.random() * 8 + 6),
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Burst of 4-5 sparkles upon clicking
      const burst: SparkleParticle[] = Array.from({ length: 4 }).map(() => ({
        id: ++particleIdRef.current,
        x: e.clientX + (Math.random() * 16 - 8),
        y: e.clientY + (Math.random() * 16 - 8),
        size: Math.random() * 10 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.5 ? "heart" : "sparkle",
        rotation: Math.random() * 360,
      }));

      setParticles((prev) => [...prev.slice(-15), ...burst]);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });

    // Clean up particles over time
    const interval = setInterval(() => {
      setParticles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 80);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      clearInterval(interval);
    };
  }, [isDesktop]);

  if (!isDesktop || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out animate-cursor-fade"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.type === "sparkle" && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="drop-shadow-[0_0_4px_rgba(233,63,102,0.6)]"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          )}
          {p.type === "heart" && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="drop-shadow-[0_0_3px_rgba(255,105,180,0.5)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === "dot" && (
            <span
              className="block rounded-full shadow-[0_0_4px_rgba(233,63,102,0.8)]"
              style={{
                width: `${p.size * 0.6}px`,
                height: `${p.size * 0.6}px`,
                backgroundColor: p.color,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
