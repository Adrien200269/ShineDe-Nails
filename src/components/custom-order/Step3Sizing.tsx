"use client";

import * as React from "react";
import { Sparkles, HelpCircle, Bookmark, Check, Coins } from "lucide-react";
import { SizingType, StandardSize, NailMeasurements } from "@/types";
import { HowToMeasureModal } from "./HowToMeasureModal";
import { CoinSizingHelperModal } from "./CoinSizingHelperModal";
import { Button } from "@/components/ui/button";
import { getSavedMeasurements, saveMeasurementsLocally } from "@/lib/orders";
import { cn } from "@/lib/utils";

interface Step3SizingProps {
  sizingType: SizingType;
  standardSize?: StandardSize;
  measurements?: NailMeasurements;
  onSizingTypeChange: (type: SizingType) => void;
  onStandardSizeChange: (size: StandardSize) => void;
  onMeasurementsChange: (measurements: NailMeasurements) => void;
}

export function Step3Sizing({
  sizingType,
  standardSize = "M",
  measurements = { thumb: 16, index: 12, middle: 13, ring: 11, pinky: 9 },
  onSizingTypeChange,
  onStandardSizeChange,
  onMeasurementsChange,
}: Step3SizingProps) {
  const [isMeasureModalOpen, setIsMeasureModalOpen] = React.useState(false);
  const [isCoinModalOpen, setIsCoinModalOpen] = React.useState(false);
  const [hasSavedProfile, setHasSavedProfile] = React.useState(false);
  const [saveToProfile, setSaveToProfile] = React.useState(true);

  React.useEffect(() => {
    const saved = getSavedMeasurements();
    if (saved) {
      setHasSavedProfile(true);
    }
  }, []);

  const handleLoadSaved = () => {
    const saved = getSavedMeasurements();
    if (saved) {
      onSizingTypeChange(saved.type);
      if (saved.type === "standard" && saved.standardSize) {
        onStandardSizeChange(saved.standardSize);
      } else if (saved.type === "custom" && saved.measurements) {
        onMeasurementsChange(saved.measurements);
      }
    }
  };

  const handleFingerChange = (finger: keyof NailMeasurements, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = {
      ...measurements,
      [finger]: num,
    };
    onMeasurementsChange(updated);

    if (saveToProfile) {
      saveMeasurementsLocally({
        type: "custom",
        measurements: updated,
      });
    }
  };

  const standardSizes: Array<{
    id: StandardSize;
    name: string;
    mmDescription: string;
    description: string;
  }> = [
    {
      id: "XS",
      name: "Extra Small (XS)",
      mmDescription: "14 / 11 / 12 / 10 / 8 mm",
      description: "Petite nail beds or delicate hands.",
    },
    {
      id: "S",
      name: "Small (S)",
      mmDescription: "15 / 12 / 13 / 11 / 8 mm",
      description: "Slender natural nails, very popular.",
    },
    {
      id: "M",
      name: "Medium (M)",
      mmDescription: "16 / 12 / 13 / 11 / 9 mm",
      description: "Most common standard fit.",
    },
    {
      id: "L",
      name: "Large (L)",
      mmDescription: "18 / 13 / 14 / 12 / 10 mm",
      description: "Broader or wider natural nail beds.",
    },
  ];

  const fingers: Array<{
    key: keyof NailMeasurements;
    label: string;
    short: string;
    avg: number;
  }> = [
    { key: "thumb", label: "Thumb", short: "T", avg: 16 },
    { key: "index", label: "Index", short: "I", avg: 12 },
    { key: "middle", label: "Middle", short: "M", avg: 13 },
    { key: "ring", label: "Ring", short: "R", avg: 11 },
    { key: "pinky", label: "Pinky", short: "P", avg: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Step 3: Exact Sizing
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
            Nail Fit & Measurements
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Choose standard sizing or enter custom millimeter widths for a glove-like fit.
          </p>
        </div>

        {/* How to Measure & Coin Helper Action Buttons */}
        <div className="flex items-center gap-2 self-center sm:self-auto flex-wrap justify-center">
          <button
            type="button"
            onClick={() => setIsCoinModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-primary text-white px-4 py-2 text-xs font-bold shadow-pink-sm hover:bg-brand-primary-hover hover:scale-105 active:scale-95 transition-all"
          >
            <Coins className="w-4 h-4 animate-bounce" />
            <span>Coin Sizing Helper</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMeasureModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-pink-300 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface px-4 py-2 text-xs font-bold text-gray-700 dark:text-brand-dark-text shadow-sm hover:border-brand-primary hover:text-brand-primary transition-all"
          >
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span>Tape & Ruler Guide</span>
          </button>
        </div>
      </div>

      {/* Sizing Method Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-pink-100/70 dark:bg-brand-dark-surface rounded-2xl border border-pink-200 dark:border-brand-dark-border">
        <button
          type="button"
          onClick={() => onSizingTypeChange("standard")}
          className={cn(
            "py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all",
            sizingType === "standard"
              ? "bg-white dark:bg-brand-dark-card text-brand-primary shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-brand-primary"
          )}
        >
          Option A: Standard Sizes (XS-L)
        </button>
        <button
          type="button"
          onClick={() => onSizingTypeChange("custom")}
          className={cn(
            "py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all",
            sizingType === "custom"
              ? "bg-white dark:bg-brand-dark-card text-brand-primary shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-brand-primary"
          )}
        >
          Option B: Custom Measurements (mm)
        </button>
      </div>

      {/* Saved Measurements Fast Loader */}
      {hasSavedProfile && (
        <div className="flex items-center justify-between bg-white dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border p-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              You have previously saved nail measurements!
            </span>
          </div>
          <button
            type="button"
            onClick={handleLoadSaved}
            className="text-xs font-bold text-brand-primary hover:underline bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full"
          >
            Load My Sizes
          </button>
        </div>
      )}

      {/* Option A: Standard Sizing */}
      {sizingType === "standard" && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {standardSizes.map((s) => {
              const isSelected = standardSize === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStandardSizeChange(s.id)}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border p-4 text-left transition-all bg-white dark:bg-brand-dark-card cursor-pointer",
                    isSelected
                      ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-pink-md bg-pink-50/20 dark:bg-brand-primary/10"
                      : "border-pink-200 dark:border-brand-dark-border hover:border-brand-primary/50"
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-base font-bold font-serif text-gray-900 dark:text-white">
                      {s.name}
                    </span>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="mt-1 text-xs font-mono font-semibold text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-2 py-0.5 rounded-md">
                    {s.mmDescription}
                  </span>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{s.description}</p>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center sm:text-left pt-1">
            * Finger sequence order: Thumb · Index · Middle · Ring · Pinky. If between sizes, enter custom millimeters!
          </p>
        </div>
      )}

      {/* Option B: Custom Measurements */}
      {sizingType === "custom" && (
        <div className="space-y-4 rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-5 sm:p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                Enter Custom Finger Widths (in mm)
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                Input the width of each nail bed at its widest point.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsCoinModalOpen(true)}
              className="gap-1.5 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white self-start sm:self-auto text-xs"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Calibrate with Coin (Auto-mm)</span>
            </Button>
          </div>

          {/* Interactive Coin Helper Highlight Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-brand-dark-surface dark:to-brand-dark-card border border-pink-200 dark:border-brand-dark-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary text-white shrink-0 shadow-sm">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Don&apos;t have a tape measure or ruler?
                </p>
                <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                  Place a Nepali Rs. 1 or Rs. 2 coin on your screen to calibrate and calculate exact millimeters automatically!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCoinModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline shrink-0 bg-white dark:bg-brand-dark-surface px-3 py-1.5 rounded-xl border border-pink-200 dark:border-brand-dark-border shadow-xs"
            >
              <span>Launch Caliper</span>
              <Sparkles className="w-3 h-3 text-brand-primary" />
            </button>
          </div>

          {/* Visual 5-finger input grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {fingers.map((f) => {
              const val = measurements[f.key] || "";
              return (
                <div
                  key={f.key}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border border-pink-100 dark:border-brand-dark-border bg-pink-50/50 dark:bg-brand-dark-surface hover:bg-white dark:hover:bg-brand-dark-card transition-colors text-center"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white mb-2 shadow-sm">
                    {f.short}
                  </div>
                  <label
                    htmlFor={`measure-${f.key}`}
                    className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1"
                  >
                    {f.label}
                  </label>
                  <div className="relative w-full">
                    <input
                      id={`measure-${f.key}`}
                      type="number"
                      step="0.5"
                      min="6"
                      max="24"
                      value={val}
                      onChange={(e) => handleFingerChange(f.key, e.target.value)}
                      className="w-full text-center rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card py-2 px-1 text-sm font-bold text-brand-primary dark:text-white focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-inner"
                      placeholder={`${f.avg}`}
                    />
                    <span className="text-[10px] text-gray-400 absolute right-2 top-2.5 pointer-events-none">
                      mm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save to profile checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="saveMeasurements"
              checked={saveToProfile}
              onChange={(e) => setSaveToProfile(e.target.checked)}
              className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary border-pink-300 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface"
            />
            <label htmlFor="saveMeasurements" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              Remember these custom measurements for my next order
            </label>
          </div>
        </div>
      )}

      {/* Tape & Ruler Pop up modal */}
      <HowToMeasureModal
        isOpen={isMeasureModalOpen}
        onClose={() => setIsMeasureModalOpen(false)}
      />

      {/* Coin Sizing Helper Modal */}
      <CoinSizingHelperModal
        isOpen={isCoinModalOpen}
        onClose={() => setIsCoinModalOpen(false)}
        initialMeasurements={measurements}
        onApplyMeasurements={(newMeasurements) => {
          onMeasurementsChange(newMeasurements);
          onSizingTypeChange("custom");
          if (saveToProfile) {
            saveMeasurementsLocally({
              type: "custom",
              measurements: newMeasurements,
            });
          }
        }}
      />
    </div>
  );
}
