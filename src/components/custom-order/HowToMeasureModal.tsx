"use client";

import { Dialog } from "@/components/ui/dialog";
import { Ruler, Sparkles } from "lucide-react";

interface HowToMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToMeasureModal({ isOpen, onClose }: HowToMeasureModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="How to Measure Your Nails"
      description="Follow these easy steps to get your exact custom fit in millimeters (mm)."
    >
      <div className="space-y-6 pt-2 text-sm text-gray-700 dark:text-gray-300">
        {/* Step 1 */}
        <div className="flex items-start gap-3.5 bg-pink-50/70 dark:bg-brand-dark-surface p-3.5 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
            1
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Apply Clear Tape</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
              Place a piece of transparent tape horizontally across the widest part of your natural nail bed, pressing firmly into the side walls.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3.5 bg-pink-50/70 dark:bg-brand-dark-surface p-3.5 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
            2
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Mark the Edges</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
              Using a fine-tip pen or marker, draw a line on both the left and right edges where your nail meets the skin.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3.5 bg-pink-50/70 dark:bg-brand-dark-surface p-3.5 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
            3
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Measure on a Ruler (mm)</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
              Peel the tape off, lay it flat on a ruler, and count the millimeter lines between your two marks. Record for all 5 fingers.
            </p>
          </div>
        </div>

        {/* Standard Size Guide Table */}
        <div className="border border-pink-200 dark:border-brand-dark-border rounded-2xl p-4 bg-white dark:bg-brand-dark-surface">
          <h4 className="font-bold text-xs uppercase tracking-wider text-brand-primary mb-2 flex items-center gap-1.5">
            <Ruler className="w-4 h-4" />
            <span>Standard Sizing Reference (Thumb to Pinky)</span>
          </h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-pink-100 dark:border-brand-dark-border text-gray-500 dark:text-gray-400">
                  <th className="py-1.5 pr-2">Size</th>
                  <th className="py-1.5 px-2">Thumb</th>
                  <th className="py-1.5 px-2">Index</th>
                  <th className="py-1.5 px-2">Middle</th>
                  <th className="py-1.5 px-2">Ring</th>
                  <th className="py-1.5 pl-2">Pinky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 dark:divide-brand-dark-border text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="py-1.5 pr-2 font-bold text-brand-primary">XS (3, 6, 5, 7, 9)</td>
                  <td className="py-1.5 px-2">14mm</td>
                  <td className="py-1.5 px-2">11mm</td>
                  <td className="py-1.5 px-2">12mm</td>
                  <td className="py-1.5 px-2">10mm</td>
                  <td className="py-1.5 pl-2">8mm</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-bold text-brand-primary">S (2, 5, 4, 6, 9)</td>
                  <td className="py-1.5 px-2">15mm</td>
                  <td className="py-1.5 px-2">12mm</td>
                  <td className="py-1.5 px-2">13mm</td>
                  <td className="py-1.5 px-2">11mm</td>
                  <td className="py-1.5 pl-2">8mm</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-bold text-brand-primary">M (1, 5, 4, 6, 8)</td>
                  <td className="py-1.5 px-2">16mm</td>
                  <td className="py-1.5 px-2">12mm</td>
                  <td className="py-1.5 px-2">13mm</td>
                  <td className="py-1.5 px-2">11mm</td>
                  <td className="py-1.5 pl-2">9mm</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-bold text-brand-primary">L (0, 4, 3, 5, 7)</td>
                  <td className="py-1.5 px-2">18mm</td>
                  <td className="py-1.5 px-2">13mm</td>
                  <td className="py-1.5 px-2">14mm</td>
                  <td className="py-1.5 px-2">12mm</td>
                  <td className="py-1.5 pl-2">10mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip Box */}
        <div className="flex items-center gap-2 text-xs text-brand-primary font-medium bg-pink-100/60 dark:bg-brand-primary/10 p-3 rounded-xl border border-pink-200 dark:border-brand-primary/30">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Pro tip: When in doubt between two millimeter measurements, size up! You can always gently file the sides down.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-brand-primary py-2.5 text-xs font-bold text-white hover:bg-brand-primary-hover shadow-pink-sm"
        >
          Got It, Let&apos;s Size
        </button>
      </div>
    </Dialog>
  );
}
