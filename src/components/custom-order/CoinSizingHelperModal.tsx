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
  Plus,
  Minus,
  Camera,
  UploadCloud,
  X,
  ExternalLink,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NailMeasurements } from "@/types";
import { uploadInspirationImage } from "@/lib/orders";

interface CoinSizingHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeasurements?: NailMeasurements;
  onApplyMeasurements: (measurements: NailMeasurements) => void;
  onApplyCoinPhoto?: (photoUrl: string) => void;
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
  onApplyCoinPhoto,
}: CoinSizingHelperModalProps) {
  const [activeTab, setActiveTab] = React.useState<"screen_caliper" | "coin_photo_upload" | "photo_guide">("screen_caliper");
  const [selectedCoin, setSelectedCoin] = React.useState<CoinType>("rs1");

  // Calibration state (pixel width of chosen reference object on screen)
  // Default estimate: 96 DPI screen (~3.78 px/mm). For a 20mm Rs 1 coin, ~76px.
  const [calibratedPx, setCalibratedPx] = React.useState<number>(76);

  // Caliper measurement (gap in px between left and right boundary)
  const [caliperWidthPx, setCaliperWidthPx] = React.useState<number>(60);
  const [activeFinger, setActiveFinger] = React.useState<keyof NailMeasurements>("thumb");

  // Photo upload state
  const [coinPhotoUrl, setCoinPhotoUrl] = React.useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState<boolean>(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

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

  // Adjust caliper size up or down (in millimeters)
  const adjustMm = (delta: number) => {
    const target = Math.max(6, Math.min(26, Math.round((currentMm + delta) * 2) / 2));
    setCaliperWidthPx(target * pxPerMm);
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
      const nextFinger = order[curIdx + 1];
      setActiveFinger(nextFinger);
      setCaliperWidthPx(measuredValues[nextFinger] * pxPerMm);
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

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const url = await uploadInspirationImage(file);
      setCoinPhotoUrl(url);
    } catch (err) {
      console.error("Coin photo upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleApplyUploadedPhoto = () => {
    if (!coinPhotoUrl) {
      alert("Please upload a photo of your hand with a coin first.");
      return;
    }
    if (onApplyCoinPhoto) {
      onApplyCoinPhoto(coinPhotoUrl);
    }
    onClose();
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
            <Coins className="w-3.5 h-3.5" /> Nepal Coin Sizing Suite
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Smart Coin Sizing Options
          </h2>
          <p className="text-xs text-gray-600 dark:text-brand-dark-muted mt-0.5">
            Use the on-screen live caliper method, or upload a photo with your hand &amp; coin for our studio artist to measure.
          </p>
        </div>
      </div>

      {/* Tabs: Caliper vs Photo Upload vs Guide */}
      <div className="grid grid-cols-3 gap-2 my-4">
        <button
          type="button"
          onClick={() => setActiveTab("screen_caliper")}
          className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "screen_caliper"
              ? "bg-brand-primary text-white shadow-pink-sm"
              : "bg-pink-50/60 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:border-brand-primary/50"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="truncate">Live Caliper</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("coin_photo_upload")}
          className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "coin_photo_upload"
              ? "bg-brand-primary text-white shadow-pink-sm"
              : "bg-pink-50/60 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:border-brand-primary/50"
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-brand-primary" />
          <span className="truncate">Upload Hand+Coin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("photo_guide")}
          className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "photo_guide"
              ? "bg-brand-primary text-white shadow-pink-sm"
              : "bg-pink-50/60 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:border-brand-primary/50"
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="truncate">Coin Guide</span>
        </button>
      </div>

      {/* TAB 1: Live On-Screen Caliper (Usual Coin Method) */}
      {activeTab === "screen_caliper" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Step 1: Reference Object Calibration */}
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] text-white">1</span>
                <span>Select Calibration Coin</span>
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
                Place physical <strong>{coinData.name}</strong> over the circle. Adjust slider until circle matches coin:
              </p>

              <div className="flex items-center justify-center py-1 min-h-[100px]">
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

          {/* Step 2: Live Finger Caliper measurement (INCREASE/DECREASE BUTTONS MOVED UP) */}
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] text-white">2</span>
                <span>Adjust Width &amp; Match Bare Nail Bed</span>
              </span>
              <span className="text-xs font-mono font-bold text-brand-primary bg-pink-100 dark:bg-brand-primary/20 px-2.5 py-0.5 rounded-full">
                Active: <span className="uppercase">{activeFinger}</span>
              </span>
            </div>

            <div className="bg-white dark:bg-brand-dark-surface p-4 sm:p-5 rounded-2xl border border-pink-100 dark:border-brand-dark-border text-center space-y-3 select-none">
              {/* SIZE INCREASE / DECREASE BUTTONS POSITIONED UP (ABOVE GUIDE) */}
              <div className="bg-pink-50/80 dark:bg-brand-dark-card/80 p-3 rounded-2xl border border-pink-200 dark:border-brand-dark-border max-w-sm mx-auto space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Size Controls (Adjust Above)
                </span>

                <div className="flex items-center justify-between gap-2">
                  {/* Decrease Button (UP) */}
                  <button
                    type="button"
                    onClick={() => adjustMm(-0.5)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-brand-primary font-bold hover:bg-pink-100 dark:hover:bg-brand-dark-card active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1 text-xs"
                    aria-label="Decrease width by 0.5 mm"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                    <span>Decrease (-0.5)</span>
                  </button>

                  {/* Current Millimeter Size Value */}
                  <div className="px-3 py-1 bg-white dark:bg-brand-dark-surface rounded-xl border border-pink-200 dark:border-brand-dark-border shrink-0 min-w-[90px]">
                    <span className="text-xl font-bold font-mono text-brand-primary block leading-tight">
                      {currentMm} <span className="text-xs">mm</span>
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">({Math.round(caliperWidthPx)}px)</span>
                  </div>

                  {/* Increase Button (UP) */}
                  <button
                    type="button"
                    onClick={() => adjustMm(0.5)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-brand-primary font-bold hover:bg-pink-100 dark:hover:bg-brand-dark-card active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1 text-xs"
                    aria-label="Increase width by 0.5 mm"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Increase (+0.5)</span>
                  </button>
                </div>

                {/* Caliper Slider also UP */}
                <div className="pt-1 space-y-1">
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
                    <span className="text-brand-primary font-bold">Slider Control (UP)</span>
                    <span>24 mm</span>
                  </div>
                </div>
              </div>

              {/* DOWN: Virtual Caliper Visualizer Guide where finger rests */}
              <div className="pt-2">
                <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted mb-2">
                  Place your natural <strong>{activeFinger}</strong> flat between the guide boundaries below:
                </p>

                <div className="flex items-center justify-center py-2">
                  <div
                    style={{ width: `${caliperWidthPx}px` }}
                    className="relative h-20 border-x-4 border-brand-primary bg-gradient-to-r from-pink-200/50 via-pink-100/60 to-pink-200/50 dark:from-brand-primary/20 dark:via-brand-primary/10 dark:to-brand-primary/20 rounded-lg flex flex-col items-center justify-center transition-all shadow-sm"
                  >
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                      Place Nail Bed Here
                    </span>
                    <span className="text-xl font-bold font-mono text-brand-primary">
                      {currentMm} mm
                    </span>
                  </div>
                </div>
              </div>

              {/* Record Button for Active Finger */}
              <div className="pt-1">
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
              <span className="text-[11px] text-gray-500 font-normal">Click any finger to adjust</span>
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

      {/* TAB 2: Upload Picture with Coin & Hand Photo */}
      {activeTab === "coin_photo_upload" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-primary text-white shadow-xs">
                <Camera className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Upload Photo of Hand with Coin
                </h3>
                <p className="text-xs text-gray-600 dark:text-brand-dark-muted">
                  No measuring needed from you! Our Kathmandu nail artist will calculate your exact millimeter sizes from your coin photo.
                </p>
              </div>
            </div>

            {/* Visual Guide on how to take the photo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="bg-white dark:bg-brand-dark-surface p-3 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
                <span className="font-bold text-brand-primary block text-xs mb-1">1. Flat Coin Placement</span>
                <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                  Place a Nepali Rs. 1 or Rs. 2 coin flat on a table right next to your fingers.
                </p>
              </div>
              <div className="bg-white dark:bg-brand-dark-surface p-3 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
                <span className="font-bold text-brand-primary block text-xs mb-1">2. Top-Down Camera</span>
                <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                  Hold phone directly above at a 90° bird&apos;s eye angle in clear, bright lighting.
                </p>
              </div>
              <div className="bg-white dark:bg-brand-dark-surface p-3 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
                <span className="font-bold text-brand-primary block text-xs mb-1">3. Show All Nails</span>
                <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                  Make sure all 5 nails and the full circle of the coin are crisp and visible.
                </p>
              </div>
            </div>
          </div>

          {/* Photo Upload Zone */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handlePhotoUpload(e.target.files[0]);
              }
            }}
          />

          {coinPhotoUrl ? (
            <div className="p-4 rounded-3xl bg-white dark:bg-brand-dark-surface border-2 border-brand-primary/40 shadow-pink-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Hand &amp; Coin Photo Ready
                </span>
                <button
                  type="button"
                  onClick={() => setCoinPhotoUrl("")}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Remove &amp; Retake
                </button>
              </div>

              <div className="relative aspect-video max-h-56 rounded-2xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coinPhotoUrl}
                  alt="Hand with coin measurement photo"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted text-center">
                Our artist will calibrate measurements using the coin diameter before crafting.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-brand-primary"
                >
                  Change Photo
                </button>

                <Button
                  type="button"
                  onClick={handleApplyUploadedPhoto}
                  className="gap-2 shadow-pink-md px-6"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo For Order Sizing</span>
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => photoInputRef.current?.click()}
              className="p-8 rounded-3xl border-2 border-dashed border-pink-300 dark:border-brand-dark-border hover:border-brand-primary bg-pink-50/30 dark:bg-brand-dark-surface/50 text-center cursor-pointer transition-all hover:bg-pink-50/70"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-brand-primary/20 text-brand-primary mx-auto mb-3 shadow-xs">
                {isUploadingPhoto ? (
                  <div className="h-6 w-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="h-7 w-7" />
                )}
              </div>

              <p className="font-serif text-base font-bold text-gray-900 dark:text-white mb-1">
                {isUploadingPhoto ? "Uploading your hand photo..." : "Tap to upload or take a photo"}
              </p>
              <p className="text-xs text-gray-500 dark:text-brand-dark-muted max-w-sm mx-auto">
                Snap a clear photo showing your hand next to a Nepali Rs. 1 or Rs. 2 coin. PNG, JPG, or WEBP.
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-bold shadow-pink-sm">
                <Camera className="w-3.5 h-3.5" />
                <span>Snap or Browse Photo</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
            <button
              type="button"
              onClick={() => setActiveTab("screen_caliper")}
              className="text-brand-primary font-bold hover:underline"
            >
              ← Or use the live on-screen coin caliper
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Coin Reference Guide */}
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
                  Use the Live Caliper tab above, or upload your photo directly for our nail artist to measure!
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

          <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
            <Button
              type="button"
              onClick={() => setActiveTab("screen_caliper")}
              className="gap-2 shadow-pink-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Use Live Screen Caliper</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab("coin_photo_upload")}
              className="gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Camera className="w-4 h-4" />
              <span>Upload Hand &amp; Coin Photo</span>
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
