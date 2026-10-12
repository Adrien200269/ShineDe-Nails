"use client";

import * as React from "react";
import { Sparkles, Palette, Check, Wand2, Copy, Sparkle } from "lucide-react";
import { NailFinish } from "@/types";

interface AIInspoPaletteExtractorProps {
  imageUrl: string;
  onApplySuggestedFinish?: (finish: NailFinish) => void;
}

interface PaletteAnalysis {
  colors: string[];
  aestheticVibe: string;
  suggestedFinish: NailFinish;
  finishReason: string;
}

export function AIInspoPaletteExtractor({
  imageUrl,
  onApplySuggestedFinish,
}: AIInspoPaletteExtractorProps) {
  const [analysis, setAnalysis] = React.useState<PaletteAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);
  const [hasAppliedFinish, setHasAppliedFinish] = React.useState(false);

  React.useEffect(() => {
    if (!imageUrl) {
      setAnalysis(null);
      return;
    }

    let isMounted = true;
    setIsAnalyzing(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Scale down for fast sampling
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);

        const imgData = ctx.getImageData(0, 0, 64, 64).data;
        const colorCounts: Record<string, number> = {};
        let totalR = 0,
          totalG = 0,
          totalB = 0,
          totalPixels = 0;

        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a > 128) {
            // Quantize to step of 24
            const qr = Math.round(r / 24) * 24;
            const qg = Math.round(g / 24) * 24;
            const qb = Math.round(b / 24) * 24;

            const hex = `#${Math.min(255, qr).toString(16).padStart(2, "0")}${Math.min(255, qg).toString(16).padStart(2, "0")}${Math.min(255, qb).toString(16).padStart(2, "0")}`.toUpperCase();

            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            totalR += r;
            totalG += g;
            totalB += b;
            totalPixels++;
          }
        }

        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map((entry) => entry[0])
          .slice(0, 4);

        // Fallbacks if image is monochromatic or too small
        const defaultPalette = ["#F8C8DC", "#FFB6C1", "#E6E6FA", "#F5E1DA"];
        const finalColors = sortedColors.length >= 4 ? sortedColors : defaultPalette;

        // Brightness and tone analysis
        const avgR = totalPixels > 0 ? totalR / totalPixels : 200;
        const avgG = totalPixels > 0 ? totalG / totalPixels : 180;
        const avgB = totalPixels > 0 ? totalB / totalPixels : 190;
        const brightness = (avgR * 299 + avgG * 587 + avgB * 114) / 1000;

        let vibe = "Pink Aura Jelly & Pearl";
        let finish: NailFinish = "glossy";
        let reason = "High-shine glass finish enhances pearlescent jelly glazes.";

        if (brightness < 90) {
          vibe = "Velvet Noir & Cat-Eye";
          finish = "matte";
          reason = "Velvet matte topcoat creates an ultra-chic contrast with deep tones.";
        } else if (brightness > 210) {
          vibe = "Clean Girl Glazed Donut";
          finish = "glossy";
          reason = "Ultra glossy glass topcoat mirrors Hailey Bieber chrome tips.";
        } else if (Math.abs(avgR - avgB) > 40) {
          vibe = "Y2K Chrome & 3D Accent Pop";
          finish = "mixed";
          reason = "Mixed finish pairs best with multiple charm accents and foil.";
        }

        if (isMounted) {
          setAnalysis({
            colors: finalColors,
            aestheticVibe: vibe,
            suggestedFinish: finish,
            finishReason: reason,
          });
          setIsAnalyzing(false);
        }
      } catch {
        if (isMounted) {
          setAnalysis({
            colors: ["#F8C8DC", "#E5E4E2", "#FF6584", "#2D232E"],
            aestheticVibe: "Aura Chrome & Rose Jelly",
            suggestedFinish: "glossy",
            finishReason: "Ultra high-shine topcoat recommended for gel depth.",
          });
          setIsAnalyzing(false);
        }
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setAnalysis({
          colors: ["#F8C8DC", "#FF6584", "#E5E4E2", "#4A2234"],
          aestheticVibe: "ShineDe Signature Gel Vibe",
          suggestedFinish: "glossy",
          finishReason: "Salon-quality ultra glossy topcoat.",
        });
        setIsAnalyzing(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  if (!imageUrl) return null;

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleApplyFinish = () => {
    if (analysis && onApplySuggestedFinish) {
      onApplySuggestedFinish(analysis.suggestedFinish);
      setHasAppliedFinish(true);
      setTimeout(() => setHasAppliedFinish(false), 3000);
    }
  };

  return (
    <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-gradient-to-r from-pink-50/70 via-white to-pink-50/70 dark:from-brand-dark-card dark:via-brand-dark-surface dark:to-brand-dark-card p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-primary text-white shadow-xs">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>AI Inspo Color &amp; Style Analysis</span>
              <span className="text-[10px] font-bold bg-pink-100 dark:bg-brand-primary/20 text-brand-primary px-2 py-0.2 rounded-full">
                Auto-Extracted
              </span>
            </span>
          </div>
        </div>

        {analysis && (
          <span className="text-[11px] font-bold text-brand-primary bg-white dark:bg-brand-dark-surface px-2.5 py-1 rounded-full border border-pink-200 dark:border-brand-dark-border shadow-xs">
            {analysis.aestheticVibe}
          </span>
        )}
      </div>

      {isAnalyzing ? (
        <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          <span>Sampling photo palette &amp; lighting tones...</span>
        </div>
      ) : analysis ? (
        <div className="space-y-3">
          {/* 4 Extracted Color Chips */}
          <div className="grid grid-cols-4 gap-2">
            {analysis.colors.map((hex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopy(hex)}
                className="group relative flex flex-col items-center p-2 rounded-2xl bg-white dark:bg-brand-dark-surface border border-pink-100 dark:border-brand-dark-border hover:border-brand-primary transition-all shadow-xs cursor-pointer"
                title={`Click to copy ${hex}`}
              >
                <div
                  style={{ backgroundColor: hex }}
                  className="h-8 w-full rounded-xl border border-black/10 shadow-inner mb-1.5 transition-transform group-hover:scale-105"
                />
                <span className="text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300">
                  {hex}
                </span>
                <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedHex === hex ? "Copied!" : "Copy"}
                </span>
              </button>
            ))}
          </div>

          {/* AI Recommended Finish Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-brand-dark-surface border border-pink-100 dark:border-brand-dark-border text-xs">
            <div>
              <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-brand-primary" />
                <span>Recommended Finish: <span className="capitalize text-brand-primary font-serif font-bold">{analysis.suggestedFinish} Topcoat</span></span>
              </p>
              <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted mt-0.5">
                {analysis.finishReason}
              </p>
            </div>

            {onApplySuggestedFinish && (
              <button
                type="button"
                onClick={handleApplyFinish}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all shrink-0 self-start sm:self-auto border border-pink-200 dark:border-brand-primary/30"
              >
                {hasAppliedFinish ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{hasAppliedFinish ? "Applied to Order!" : `Pre-set ${analysis.suggestedFinish}`}</span>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
