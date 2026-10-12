"use client";

import * as React from "react";
import {
  Sparkles,
  Coins,
  Check,
  Ruler,
  HelpCircle,
  RotateCcw,
  Smartphone,
  Info,
  ArrowRight,
  Upload,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NailMeasurements } from "@/types";

interface CoinSizingHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeasurements?: NailMeasurements;
  onApplyMeasurements: (measurements: NailMeasurements) => void;
}

type CoinType = "rs1" | "rs2" | "card";

interface CoinInfo {
  id: CoinType;
  name: string;
  diameterMm: number;
  label: string;
}

const COIN_TYPES: CoinInfo[] = [
  { id: "rs1", name: "Rs. 1 Coin (Nepal)", diameterMm: 20.0, label: "20 mm standard coin" },
  { id: "rs2", name: "Rs. 2 Coin (Nepal)", diameterMm: 22.0, label: "22 mm standard coin" },
  { id: "card", name: "ATM / Identity Card", diameterMm: 85.6, label: "85.6 mm card width" },
];

export function CoinSizingHelperModal({
  isOpen,
  onClose,
  initialMeasurements,
  onApplyMeasurements,
}: CoinSizingHelperModalProps) {
  const [activeTab, setActiveTab] = React.useState<"screen_caliper" | "photo_guide">("screen_caliper");
  const [selectedCoin, setSelectedCoin] = React.useState<CoinType>("rs1");

  // Calibration state (pixel width of chosen reference object on screen)
  // Default estimate: 96 DPI screen (~3.78 px/mm). For a 20mm Rs 1 coin, ~76px.
  const [calibratedPx, setCalibratedPx] = React.useState<number>(76);
  const [isCalibrated, setIsCalibrated] = React.useState<boolean>(true);

  // Caliper measurement (gap in px between left and right boundary)
  const [caliperWidthPx, setCaliperWidthPx] = React.useState<number>(60);
  const [activeFinger, setActiveFinger] = React.useState<keyof NailMeasurements>("thumb");

  // Measured state
  const [measuredValues, setMeasuredValues] = React.useState<NailMeasurements>({
    thumb: initialMeasurements?.thumb || 16,
    index: initialMeasurements?.index || 12,
    middle: initialMeasurements?.middle || 13,
    ring: initialMeasurements?.ring || 11,
    pinky: initialMeasurements?.pinky || 9,
  });

  const [recordedFingers, setRecordedFingers] = React.useState<Record<keyof NailMeasurements, boolean>>({
    thumb: !!initialMeasurements?.thumb,
    index: !!initialMeasurements?.index,
    middle: !!initialMeasurements?.middle,
    ring: !!initialMeasurements?.ring,
    pinky: !!initialMeasurements?.pinky,
  });

  // Calculate current millimeter width based on calibrated scale
  const coinData = COIN_TYPES.find((c) => c.id === selectedCoin) || COIN_TYPES[0];
  const pxPerMm = calibratedPx / coinData.diameterMm;
  const currentMm = Math.max(6, Math.min(26, Math.round((caliperWidthPx / pxPerMm) * 2) / 2));

  // Sync calibrated pixels when changing coin type
  const handleCoinChange = (coin: CoinType) => {
    setSelectedCoin(coin);
    const targetCoin = COIN_TYPES.find((c) => c.id === coin) || COIN_TYPES[0];
    if (coin === "card") {
      setCalibratedPx(280); // card width default
    } else {
      setCalibratedPx(targetCoin.diameterMm * 3.8);
    }
  };

  const handleRecordFinger = (finger: keyof NailMeasurements) => {
    const updated = {
      ...measuredValues,
      [finger]: currentMm,
    };
    setMeasuredValues(updated);
    setRecordedFingers((prev) => ({ ...prev, [finger]: true }));

    // Move to next finger automatically for quick recording
    const order: Array<keyof NailMeasurements> = ["thumb", "index", "middle", "ring", "pinky"];
    const curIdx = order.indexOf(finger);
    if (curIdx < order.length - 1) {
      setActiveFinger(order[curIdx + 1]);
    }
  };

  const handleSaveAll = () => {
    onApplyMeasurements(measuredValues);
    onClose();
  };

  const resetCalibration = () => {
    const targetCoin = COIN_TYPES.find((c) => c.id === selectedCoin) || COIN_TYPES[0];
    setCalibratedPx(targetCoin.diameterMm * 3.8);
    setCaliperWidthPx(60);
  };

  const fingersList: Array<{ key: keyof NailMeasurements; label: string; defaultVal: number }> = [
    { key: "thumb", label: "Thumb", defaultVal: 16 },
    { key: "index", label: "Index", defaultVal: 12 },
    { key: "middle", label: "Middle", defaultVal: 13 },
    { key: "ring", label: "Ring", defaultVal: 11 },
    { key: "pinky", label: "Pinky", defaultVal: 9 },
  ];

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-pink-100 dark:border-brand-dark-border">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-pink-100 dark:bg-pink-950/60 px-3 py-0.5 rounded-full mb-1">
            <Coins className="w-3.5 h-3.5" /> Nepal Coin & Screen Caliper
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Smart Nail Sizing Helper
          </h2>
          <p className="text-xs text-gray-600 dark:text-brand-dark-muted mt-0.5">
            Measure your nail width directly on your screen using a Nepali coin for 100% precision fit.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 my-4">
        <button
          type="button"
          onClick={() => setActiveTab("screen_caliper")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "screen_caliper"
              ? "bg-brand-primary text-white shadow-pink-sm"
              : "bg-pink-50/60 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Screen Caliper</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("photo_guide")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "photo_guide"
              ? "bg-brand-primary text-white shadow-pink-sm"
              : "bg-pink-50/60 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text"
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Coin Measurement Guide</span>
        </button>
      </div>

      {/* TAB 1: Live On-Screen Caliper */}
      {activeTab === "screen_caliper" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Step 1: Reference Object Calibration */}
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] text-white">1</span>
                <span>Select Your Calibration Reference</span>
              </span>
              <button
                type="button"
                onClick={resetCalibration}
                className="text-[11px] text-brand-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Coin Selector */}
            <div className="grid grid-cols-3 gap-2">
              {COIN_TYPES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCoinChange(c.id)}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    selectedCoin === c.id
                      ? "border-brand-primary bg-white dark:bg-brand-dark-surface text-brand-primary font-bold shadow-xs"
                      : "border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text bg-white/60 dark:bg-brand-dark-surface/50"
                  }`}
                >
                  <div className="text-xs font-bold">{c.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{c.diameterMm} mm</div>
                </button>
              ))}
            </div>

            {/* Interactive Coin Calibration Visualizer */}
            <div className="bg-white dark:bg-brand-dark-surface p-4 rounded-2xl border border-pink-100 dark:border-brand-dark-border text-center space-y-3">
              <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                Place your actual <strong>{coinData.name}</strong> flat on the screen circle below. Adjust the slider until the pink ring perfectly fits your physical coin:
              </p>

              <div className="flex items-center justify-center py-2 min-h-[110px]">
                <div
                  style={{
                    width: `${calibratedPx}px`,
                    height: `${calibratedPx}px`,
                  }}
                  className="rounded-full border-4 border-dashed border-brand-primary bg-pink-100/50 dark:bg-brand-primary/10 flex items-center justify-center text-[11px] font-bold text-brand-primary transition-all shadow-inner relative"
                >
                  <Coins className="w-5 h-5 text-brand-primary/60 mb-0.5" />
                  <span className="text-[9px] font-mono absolute bottom-2">
                    {coinData.diameterMm}mm
                  </span>
                </div>
              </div>

              {/* Calibration Slider */}
              <div className="max-w-xs mx-auto space-y-1">
                <input
                  type="range"
                  min={coinData.id === "card" ? 180 : 50}
                  max={coinData.id === "card" ? 380 : 120}
                  value={calibratedPx}
                  onChange={(e) => setCalibratedPx(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Smaller</span>
                  <span className="text-brand-primary font-bold">Scale: {(pxPerMm).toFixed(2)} px/mm</span>
                  <span>Larger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Live Finger Caliper measurement */}
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] text-white">2</span>
                <span>Place Natural Nail Bed Between Guides</span>
              </span>
              <span className="text-xs font-mono font-bold text-brand-primary bg-pink-100 dark:bg-brand-primary/20 px-2.5 py-0.5 rounded-full">
                Active: <span className="uppercase">{activeFinger}</span>
              </span>
            </div>

            {/* Virtual Caliper Visualizer */}
            <div className="bg-white dark:bg-brand-dark-surface p-5 rounded-2xl border border-pink-100 dark:border-brand-dark-border text-center space-y-3 select-none">
              <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                Rest your bare <strong>{activeFinger}</strong> flat over the pink zone. Drag the slider to match the left and right widest edges of your nail:
              </p>

              {/* Visual Caliper Guides */}
              <div className="flex items-center justify-center py-4">
                <div
                  style={{ width: `${caliperWidthPx}px` }}
                  className="relative h-20 border-x-4 border-brand-primary bg-gradient-to-r from-pink-200/40 via-pink-100/50 to-pink-200/40 dark:from-brand-primary/20 dark:to-brand-primary/20 rounded-lg flex flex-col items-center justify-center transition-all shadow-sm"
                >
                  <span className="text-[10px] uppercase font-bold text-gray-400">Nail Width</span>
                  <span className="text-xl font-bold font-mono text-brand-primary">
                    {currentMm} mm
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium">({caliperWidthPx}px)</span>
                </div>
              </div>

              {/* Caliper Slider */}
              <div className="max-w-sm mx-auto space-y-1">
                <input
                  type="range"
                  min={30}
                  max={120}
                  value={caliperWidthPx}
                  onChange={(e) => setCaliperWidthPx(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>6 mm</span>
                  <span className="text-brand-primary font-bold">{currentMm} mm</span>
                  <span>24 mm</span>
                </div>
              </div>

              {/* Record Button for Active Finger */}
              <div className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleRecordFinger(activeFinger)}
                  className="gap-2 px-6 shadow-pink-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Save {currentMm} mm for {activeFinger.toUpperCase()}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 5-Finger Measurement Summary Badges */}
          <div className="p-4 rounded-3xl bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white">
              <span>Your Calibrated Measurements:</span>
              <span className="text-[11px] text-gray-500 font-normal">Click any finger to measure next</span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {fingersList.map((f) => {
                const isActive = activeFinger === f.key;
                const isRecorded = recordedFingers[f.key];
                const val = measuredValues[f.key];

                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setActiveFinger(f.key);
                      // Set caliper width to match existing value
                      setCaliperWidthPx(val * pxPerMm);
                    }}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      isActive
                        ? "border-brand-primary bg-pink-100/70 dark:bg-brand-primary/20 text-brand-primary ring-2 ring-brand-primary/20"
                        : "border-pink-100 dark:border-brand-dark-border bg-pink-50/40 dark:bg-brand-dark-card hover:border-pink-300"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-gray-500">
                      {f.label}
                    </span>
                    <span className="text-sm font-bold font-mono text-gray-900 dark:text-white block mt-0.5">
                      {val} <span className="text-[9px]">mm</span>
                    </span>
                    {isRecorded && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-600 font-semibold mt-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Saved
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white px-3 py-2"
            >
              Cancel
            </button>

            <Button
              type="button"
              onClick={handleSaveAll}
              className="gap-2 shadow-pink-md px-6"
            >
              <span>Apply Sizes to Custom Order</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: Photo / Coin Measurement Guide */}
      {activeTab === "photo_guide" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-brand-primary" />
              <span>How the Coin Sizing Method Works</span>
            </h3>

            <p className="text-xs text-gray-600 dark:text-brand-dark-muted leading-relaxed">
              If you don&apos;t have a tape measure, a standard <strong>Nepali Rs. 1 or Rs. 2 coin</strong> provides an exact physical scale benchmark that never lies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-white dark:bg-brand-dark-surface rounded-2xl border border-pink-100 dark:border-brand-dark-border text-xs space-y-1">
                <span className="font-bold text-brand-primary block text-sm">Step 1: Place Coin</span>
                <p className="text-gray-600 dark:text-brand-dark-muted text-[11px]">
                  Place a clean Rs. 1 or Rs. 2 coin flat on a table right next to your fingers.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-brand-dark-surface rounded-2xl border border-pink-100 dark:border-brand-dark-border text-xs space-y-1">
                <span className="font-bold text-brand-primary block text-sm">Step 2: Snap Direct Photo</span>
                <p className="text-gray-600 dark:text-brand-dark-muted text-[11px]">
                  Take a photo directly from above (90° bird&apos;s eye angle) in good natural lighting.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-brand-dark-surface rounded-2xl border border-pink-100 dark:border-brand-dark-border text-xs space-y-1">
                <span className="font-bold text-brand-primary block text-sm">Step 3: Measure or Send</span>
                <p className="text-gray-600 dark:text-brand-dark-muted text-[11px]">
                  Use the Live Caliper tab above, or send your photo directly to our nail artist on WhatsApp!
                </p>
              </div>
            </div>
          </div>

          {/* Standard Coin Reference Table */}
          <div className="p-4 rounded-3xl bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border space-y-2">
            <span className="text-xs font-bold text-gray-900 dark:text-white block">
              Official Reference Dimensions in Nepal:
            </span>
            <div className="text-xs text-gray-700 dark:text-brand-dark-text divide-y divide-pink-100 dark:divide-brand-dark-border">
              <div className="flex justify-between py-2">
                <span>Nepal 1 Rupee Coin (Rs. 1)</span>
                <span className="font-mono font-bold text-brand-primary">Exact Diameter: 20.0 mm</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Nepal 2 Rupee Coin (Rs. 2)</span>
                <span className="font-mono font-bold text-brand-primary">Exact Diameter: 22.0 mm</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Standard Bank / ATM Card</span>
                <span className="font-mono font-bold text-brand-primary">Exact Width: 85.6 mm</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Button
              type="button"
              onClick={() => setActiveTab("screen_caliper")}
              className="gap-2 shadow-pink-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Switch to Live Screen Caliper to Measure Now</span>
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
