import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          bg: "#FDF1F8",
          surface: "#FFFFFF",
          text: "#1F2937",
          primary: "#E93F66",
          "primary-hover": "#D32F55",
          "primary-light": "#FEE8F0",
          "primary-subtle": "#FFF5F8",
          secondary: "#B8234B",
          dark: "#1A1A24",
          muted: "#6B7280",
          accent: "#FF6584",
          border: "#F7D6E6",
          // Dark mode specific colors
          "dark-bg": "#120A10",
          "dark-surface": "#1D111A",
          "dark-card": "#261522",
          "dark-border": "#3E1E34",
          "dark-text": "#FDF2F7",
          "dark-muted": "#B592A7",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        handwriting: ["Caveat", "Gochi Hand", "cursive"],
        journal: ["Gochi Hand", "Schoolbell", "Caveat", "cursive"],
        schoolbell: ["Schoolbell", "cursive"],
      },
      boxShadow: {
        "pink-sm": "0 2px 8px -1px rgba(233, 63, 102, 0.12)",
        "pink-md": "0 8px 24px -4px rgba(233, 63, 102, 0.18)",
        "pink-lg": "0 16px 36px -6px rgba(233, 63, 102, 0.22)",
        glow: "0 0 20px rgba(233, 63, 102, 0.35)",
        card: "0 4px 20px rgba(233, 63, 102, 0.08)",
        "dark-card": "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
