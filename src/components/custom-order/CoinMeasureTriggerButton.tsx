"use client";

import * as React from "react";
import { Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinSizingHelperModal } from "./CoinSizingHelperModal";

export function CoinMeasureTriggerButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-gradient-to-r from-pink-50 via-pink-100/40 to-pink-50 dark:from-brand-dark-card dark:via-brand-dark-surface dark:to-brand-dark-card p-6 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-pink-sm shrink-0">
            <Coins className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-white dark:bg-brand-dark-surface px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-brand-dark-border">
              Alternative Method: No Ruler Required
            </span>
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mt-1">
              On-Screen Coin & Caliper Sizing Tool
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted mt-0.5">
              Place a standard Nepali Rs. 1 or Rs. 2 coin on your screen to calibrate and measure all 5 fingers in 60 seconds!
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="gap-2 shadow-pink-md shrink-0 w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Coin Caliper</span>
        </Button>
      </div>

      <CoinSizingHelperModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onApplyMeasurements={() => {
          window.location.href = "/custom-order";
        }}
      />
    </>
  );
}
