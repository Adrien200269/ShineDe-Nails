"use client";

import * as React from "react";
import {
  Sparkles,
  Paintbrush,
  Gem,
  Eye,
  Brush,
  Palette,
  Sun,
  Star,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccentOptionItem {
  id: string;
  name: string;
  Icon: React.ElementType;
  desc: string;
}

export const ACCENT_OPTIONS: AccentOptionItem[] = [
  { id: "base", name: "Base Color Only", Icon: Palette, desc: "Solid matching base gel" },
  { id: "french", name: "French Tip", Icon: Brush, desc: "Crisp classic or colored smile line" },
  { id: "chrome", name: "Chrome Powder", Icon: Sun, desc: "Mirror metallic glazed sheen" },
  { id: "cateye", name: "Velvet Cat-Eye", Icon: Eye, desc: "Magnetic shimmering velvet light" },
  { id: "3d_art", name: "3D Art", Icon: Paintbrush, desc: "Sculpted gel lines, drops or textures" },
  { id: "rhinestone", name: "Rhinestone Gem", Icon: Gem, desc: "Sparkling crystal cluster accents" },
  { id: "aura", name: "Aura Gradient", Icon: CircleDot, desc: "Airbrushed center glow bloom" },
  { id: "gold_silver_art", name: "Gold / Silver Art", Icon: Star, desc: "Delicate metallic leaf and line art" },
];

interface MixAndMatchStudioProps {
  onSyncToNotes: (summary: string) => void;
  onAutoSelectMixedFinish?: () => void;
}

export function MixAndMatchStudio({
  onSyncToNotes,
  onAutoSelectMixedFinish,
}: MixAndMatchStudioProps) {
  const [selectedFinger, setSelectedFinger] = React.useState<"thumb" | "index" | "middle" | "ring" | "pinky">("ring");

  const [accents, setAccents] = React.useState<Record<string, string>>({
    thumb: "base",
    index: "base",
    middle: "base",
    ring: "3d_art",
    pinky: "base",
  });

  const fingers: Array<{ id: "thumb" | "index" | "middle" | "ring" | "pinky"; label: string; height: string }> = [
    { id: "thumb", label: "Thumb", height: "h-20" },
    { id: "index", label: "Index", height: "h-24" },
    { id: "middle", label: "Middle", height: "h-28" },
    { id: "ring", label: "Ring", height: "h-26" },
    { id: "pinky", label: "Pinky", height: "h-18" },
  ];

  const handleSelectAccent = (accentId: string) => {
    const updated = {
      ...accents,
      [selectedFinger]: accentId,
    };
    setAccents(updated);

    // Format summary string
    const summaryList = fingers.map((f) => {
      const opt = ACCENT_OPTIONS.find((a) => a.id === updated[f.id]) || ACCENT_OPTIONS[0];
      return `${f.label}: ${opt.name}`;
    });

    const summaryText = `[Custom Finger Accents: ${summaryList.join(" | ")}]`;
    onSyncToNotes(summaryText);

    // If any accent is selected, auto-select mixed finish
    if (Object.values(updated).some((a) => a !== "base")) {
      onAutoSelectMixedFinish?.();
    }
  };

  const getAccentInfo = (accentId: string) => {
    return ACCENT_OPTIONS.find((a) => a.id === accentId) || ACCENT_OPTIONS[0];
  };

  return (
    <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-100 dark:border-brand-dark-border">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Studio Customizer</span>
          </span>
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
            Accent Nail Customizer
          </h3>
          <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
            Tap any finger below to assign custom 3D art, chrome powder, or French tips individually.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-brand-primary bg-pink-50 dark:bg-brand-dark-surface px-3 py-1 rounded-xl border border-pink-100 dark:border-brand-dark-border self-start sm:self-auto">
          Editing: <span className="uppercase">{selectedFinger}</span>
        </span>
      </div>

      {/* 5-Finger Interactive Virtual Hand Diagram */}
      <div className="bg-pink-50/50 dark:bg-brand-dark-surface p-6 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
        <div className="flex items-end justify-center gap-3 sm:gap-6 min-h-[140px] pt-4">
          {fingers.map((f) => {
            const isSelected = selectedFinger === f.id;
            const accent = getAccentInfo(accents[f.id]);
            const hasAccent = accents[f.id] !== "base";
            const AccentIcon = accent.Icon;

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFinger(f.id)}
                className="flex flex-col items-center group cursor-pointer transition-all duration-200"
              >
                {/* Accent Badge on top of nail */}
                <div
                  className={cn(
                    "mb-2 text-xs h-7 w-7 rounded-full flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-brand-primary text-white scale-110 shadow-pink-sm ring-2 ring-brand-primary/30"
                      : hasAccent
                      ? "bg-pink-200 dark:bg-brand-primary/30 text-brand-primary dark:text-white"
                      : "bg-white dark:bg-brand-dark-card text-gray-400 border border-pink-200 dark:border-brand-dark-border"
                  )}
                  title={`${f.label}: ${accent.name}`}
                >
                  <AccentIcon className="w-3.5 h-3.5" />
                </div>

                {/* Finger silhouette shape */}
                <div
                  className={cn(
                    "w-9 sm:w-12 rounded-t-full transition-all duration-300 border-2 flex flex-col items-center justify-start pt-2",
                    f.height,
                    isSelected
                      ? "bg-gradient-to-b from-brand-primary to-pink-500 border-brand-primary shadow-pink-md scale-105"
                      : hasAccent
                      ? "bg-gradient-to-b from-pink-300 to-pink-200 dark:from-brand-primary/40 dark:to-brand-primary/20 border-pink-300 dark:border-brand-primary/50"
                      : "bg-white dark:bg-brand-dark-card border-pink-200 dark:border-brand-dark-border group-hover:border-brand-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 sm:w-6 h-6 rounded-t-full border transition-all",
                      isSelected
                        ? "bg-white/40 border-white/60"
                        : "bg-pink-100/60 dark:bg-brand-dark-surface/60 border-pink-200 dark:border-brand-dark-border"
                    )}
                  />
                </div>

                {/* Finger Name & Current Accent */}
                <span
                  className={cn(
                    "mt-2 text-xs font-bold transition-colors",
                    isSelected ? "text-brand-primary" : "text-gray-700 dark:text-brand-dark-text"
                  )}
                >
                  {f.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-brand-dark-muted truncate max-w-[65px] text-center">
                  {accent.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Choices Selector for the Active Finger */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
            Choose Accent for {selectedFinger.toUpperCase()}
          </label>
          <span className="text-xs text-brand-primary font-bold">
            Current: {getAccentInfo(accents[selectedFinger]).name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACCENT_OPTIONS.map((opt) => {
            const isCurrent = accents[selectedFinger] === opt.id;
            const OptionIcon = opt.Icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAccent(opt.id)}
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all",
                  isCurrent
                    ? "border-brand-primary bg-pink-50 dark:bg-brand-primary/10 text-brand-primary font-bold shadow-xs ring-1 ring-brand-primary/30"
                    : "border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface hover:border-pink-300 text-gray-700 dark:text-brand-dark-text"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl shrink-0 transition-colors",
                    isCurrent
                      ? "bg-brand-primary text-white"
                      : "bg-pink-100/70 dark:bg-brand-dark-card text-brand-primary"
                  )}
                >
                  <OptionIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate">{opt.name}</span>
                  <span className="text-[10px] text-gray-400 dark:text-brand-dark-muted line-clamp-1">
                    {opt.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
