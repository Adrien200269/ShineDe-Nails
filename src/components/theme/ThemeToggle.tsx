"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-10 w-10 rounded-full border border-pink-200/50 bg-white/50", className)} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full p-2 transition-all duration-300",
        "border border-pink-200 dark:border-brand-dark-border",
        "bg-white dark:bg-brand-dark-surface shadow-sm hover:shadow-pink-sm",
        "text-gray-700 dark:text-brand-dark-text hover:text-brand-primary dark:hover:text-brand-primary",
        "active:scale-95 cursor-pointer",
        className
      )}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="h-5 w-5 text-brand-primary rotate-0 transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold tracking-wide">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
