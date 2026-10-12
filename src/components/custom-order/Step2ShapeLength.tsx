"use client";

import * as React from "react";
import { Sparkles, Check } from "lucide-react";
import { NailShape, NailLength } from "@/types";
import { cn } from "@/lib/utils";

interface Step2ShapeLengthProps {
  shape: NailShape;
  length: NailLength;
  onShapeChange: (shape: NailShape) => void;
  onLengthChange: (length: NailLength) => void;
}

export function Step2ShapeLength({
  shape,
  length,
  onShapeChange,
  onLengthChange,
}: Step2ShapeLengthProps) {
  const shapes: Array<{
    id: NailShape;
    name: string;
    description: string;
    popular?: boolean;
    // SVG silhouette path
    renderIcon: (isSelected: boolean) => React.ReactNode;
  }> = [
    {
      id: "almond",
      name: "Almond",
      description: "Tapered sides with a softly rounded apex. Slenderizes fingers.",
      popular: true,
      renderIcon: (isSelected) => (
        <svg viewBox="0 0 40 80" className="w-8 h-16 drop-shadow-sm transition-transform">
          <path
            d="M 12 75 C 12 50, 10 32, 20 5 C 30 32, 28 50, 28 75 Z"
            fill={isSelected ? "#E93F66" : "#FCE7F3"}
            stroke={isSelected ? "#D32F55" : "#F472B6"}
            strokeWidth="2"
          />
          <path
            d="M 17 65 C 17 50, 16 35, 20 20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isSelected ? "0.7" : "0.5"}
          />
        </svg>
      ),
    },
    {
      id: "coffin",
      name: "Coffin / Ballerina",
      description: "Tapered side walls terminating in a sharp, flat square tip.",
      popular: true,
      renderIcon: (isSelected) => (
        <svg viewBox="0 0 40 80" className="w-8 h-16 drop-shadow-sm transition-transform">
          <path
            d="M 10 75 L 14 10 L 26 10 L 30 75 Z"
            fill={isSelected ? "#E93F66" : "#FCE7F3"}
            stroke={isSelected ? "#D32F55" : "#F472B6"}
            strokeWidth="2"
          />
          <path
            d="M 16 65 L 18 20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isSelected ? "0.7" : "0.5"}
          />
        </svg>
      ),
    },
    {
      id: "square",
      name: "Square",
      description: "Crisp straight parallel edges with a razor-straight horizontal edge.",
      renderIcon: (isSelected) => (
        <svg viewBox="0 0 40 80" className="w-8 h-16 drop-shadow-sm transition-transform">
          <path
            d="M 11 75 L 11 10 L 29 10 L 29 75 Z"
            fill={isSelected ? "#E93F66" : "#FCE7F3"}
            stroke={isSelected ? "#D32F55" : "#F472B6"}
            strokeWidth="2"
          />
          <path
            d="M 16 65 L 16 20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isSelected ? "0.7" : "0.5"}
          />
        </svg>
      ),
    },
    {
      id: "stiletto",
      name: "Stiletto",
      description: "Dramatically tapered into a piercing, fierce pointed tip.",
      renderIcon: (isSelected) => (
        <svg viewBox="0 0 40 80" className="w-8 h-16 drop-shadow-sm transition-transform">
          <path
            d="M 11 75 L 20 4 L 29 75 Z"
            fill={isSelected ? "#E93F66" : "#FCE7F3"}
            stroke={isSelected ? "#D32F55" : "#F472B6"}
            strokeWidth="2"
          />
          <path
            d="M 18 65 L 20 20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isSelected ? "0.7" : "0.5"}
          />
        </svg>
      ),
    },
    {
      id: "oval",
      name: "Oval",
      description: "Gentle curved parallel sides with a classic soft rounded contour.",
      renderIcon: (isSelected) => (
        <svg viewBox="0 0 40 80" className="w-8 h-16 drop-shadow-sm transition-transform">
          <path
            d="M 11 75 C 11 40, 12 12, 20 12 C 28 12, 29 40, 29 75 Z"
            fill={isSelected ? "#E93F66" : "#FCE7F3"}
            stroke={isSelected ? "#D32F55" : "#F472B6"}
            strokeWidth="2"
          />
          <path
            d="M 16 65 C 16 45, 17 25, 20 20"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isSelected ? "0.7" : "0.5"}
          />
        </svg>
      ),
    },
  ];

  const lengths: Array<{
    id: NailLength;
    name: string;
    mm: string;
    description: string;
    barHeight: string;
  }> = [
    {
      id: "short",
      name: "Short",
      mm: "14 - 16 mm",
      description: "Practical everyday chic, keyboard & workout friendly.",
      barHeight: "h-6",
    },
    {
      id: "medium",
      name: "Medium",
      mm: "18 - 20 mm",
      description: "The crowd favorite: balanced drama and effortless elegance.",
      barHeight: "h-10",
    },
    {
      id: "long",
      name: "Long",
      mm: "22 - 24 mm",
      description: "High glam statement length that makes every gesture pop.",
      barHeight: "h-14",
    },
    {
      id: "extra_long",
      name: "Extra Long",
      mm: "26 - 28 mm",
      description: "Ultimate luxury baddie length for photoshoots and events.",
      barHeight: "h-18",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Step 2: Shape & Architecture
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Pick Your Nail Silhouette
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Select the exact nail shape and desired length for your handcrafted press-on set.
        </p>
      </div>

      {/* Shapes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            1. Select Nail Shape
          </h3>
          <span className="text-xs text-brand-primary font-bold">
            Selected: <span className="capitalize">{shape}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {shapes.map((s) => {
            const isSelected = shape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onShapeChange(s.id)}
                className={cn(
                  "relative flex flex-col items-center justify-between rounded-3xl p-4 text-center transition-all duration-200 border bg-white dark:bg-brand-dark-card group cursor-pointer",
                  isSelected
                    ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-pink-md scale-[1.02]"
                    : "border-pink-200 dark:border-brand-dark-border hover:border-brand-primary/50 hover:shadow-pink-sm"
                )}
              >
                {s.popular && (
                  <span className="absolute -top-2.5 right-3 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Popular
                  </span>
                )}

                <div className="my-2 flex items-center justify-center h-20 w-full group-hover:scale-105 transition-transform">
                  {s.renderIcon(isSelected)}
                </div>

                <div className="w-full pt-1">
                  <div className="flex items-center justify-center gap-1">
                    <p className={cn("text-sm font-bold font-serif", isSelected ? "text-brand-primary" : "text-gray-900 dark:text-white")}>
                      {s.name}
                    </p>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" />}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">
                    {s.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lengths Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            2. Select Length
          </h3>
          <span className="text-xs text-brand-primary font-bold">
            Selected: <span className="capitalize">{length.replace("_", " ")}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {lengths.map((l) => {
            const isSelected = length === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onLengthChange(l.id)}
                className={cn(
                  "relative flex flex-col items-center justify-between rounded-3xl p-4 text-center transition-all duration-200 border bg-white dark:bg-brand-dark-card cursor-pointer group",
                  isSelected
                    ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-pink-md scale-[1.02]"
                    : "border-pink-200 dark:border-brand-dark-border hover:border-brand-primary/50 hover:shadow-pink-sm"
                )}
              >
                {/* Visual length bar */}
                <div className="h-20 w-full flex items-end justify-center pb-2">
                  <div className="w-8 rounded-t-xl bg-pink-100 dark:bg-brand-dark-surface flex flex-col justify-end overflow-hidden border border-pink-200 dark:border-brand-dark-border">
                    <div
                      className={cn(
                        "w-full rounded-t-xl transition-all duration-300",
                        l.barHeight,
                        isSelected ? "bg-brand-primary shadow-sm" : "bg-pink-300 dark:bg-pink-900/60 group-hover:bg-brand-primary/60"
                      )}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex items-center justify-center gap-1">
                    <p className={cn("text-sm font-bold", isSelected ? "text-brand-primary" : "text-gray-900 dark:text-white")}>
                      {l.name}
                    </p>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" />}
                  </div>
                  <span className="inline-block text-[10px] font-bold text-brand-primary/80 dark:text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-2 py-0.5 rounded-full mt-1">
                    {l.mm}
                  </span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight">
                    {l.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
