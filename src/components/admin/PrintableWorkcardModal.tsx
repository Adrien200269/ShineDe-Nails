"use client";

import * as React from "react";
import { Printer, X, Sparkles, CheckSquare, Scissors, Ruler, Paintbrush, Camera } from "lucide-react";
import { CustomOrder } from "@/types";
import { Button } from "@/components/ui/button";

interface PrintableWorkcardModalProps {
  order: CustomOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintableWorkcardModal({
  order,
  isOpen,
  onClose,
}: PrintableWorkcardModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCoinPhoto = order.size_data?.type === "coin_photo" || order.sizing_type === "coin_photo" || !!order.size_data?.coinPhotoUrl;
  const isCustom = order.size_data?.type === "custom" && order.size_data.measurements;
  const measurements = order.size_data?.measurements;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Print-only CSS rules */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-production-workcard,
          #printable-production-workcard * {
            visibility: visible;
          }
          #printable-production-workcard {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 16px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 2px solid black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-brand-dark-surface rounded-4xl max-w-xl w-full p-5 sm:p-7 border border-pink-200 dark:border-brand-dark-border shadow-pink-lg space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-brand-dark-border no-print">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary bg-pink-100 dark:bg-pink-950/60 px-2.5 py-0.5 rounded-full">
              Studio Bench Workcard (4x6 Slip)
            </span>
            <span className="text-xs text-gray-500 font-mono">#{order.order_number}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 shadow-pink-sm text-xs bg-brand-primary text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE WORKCARD BODY */}
        <div
          id="printable-production-workcard"
          className="p-5 sm:p-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white text-gray-900 space-y-4 print:border-black print:p-4"
        >
          {/* Workcard Title Header */}
          <div className="flex items-start justify-between border-b-2 border-gray-900 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-brand-primary print:text-black">
                  ShineDe Nails
                </span>
                <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5 rounded">
                  STUDIO SLIP
                </span>
              </div>
              <p className="text-[11px] font-bold text-gray-600 print:text-black mt-0.5">
                PRESS. SLAY. REPEAT. · Kathmandu Studio
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-sm font-black text-brand-primary print:text-black block">
                {order.order_number}
              </span>
              <span className="text-[10px] text-gray-500 print:text-black">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Client Details Row */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-pink-50/50 print:bg-gray-100 p-2.5 rounded-xl border border-pink-100 print:border-black">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 print:text-black block">
                Client Name:
              </span>
              <span className="font-bold text-gray-900 print:text-black text-sm">
                {order.customer_name}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 print:text-black block">
                Contact:
              </span>
              <span className="font-mono text-gray-800 print:text-black">
                {order.customer_phone || order.customer_email}
              </span>
            </div>
          </div>

          {/* Photo & Architecture Row */}
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Inspo Image thumbnail */}
            <div className="col-span-1 aspect-square rounded-xl overflow-hidden border-2 border-gray-900 bg-gray-100 relative">
              {order.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={order.image_url}
                  alt="Inspo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">
                  No Image
                </div>
              )}
            </div>

            {/* Architecture Specs */}
            <div className="col-span-2 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200 print:border-black">
                <span className="font-bold uppercase text-gray-500 print:text-black text-[11px]">Shape:</span>
                <span className="font-black text-sm uppercase text-brand-primary print:text-black">
                  {order.shape}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 print:border-black">
                <span className="font-bold uppercase text-gray-500 print:text-black text-[11px]">Length:</span>
                <span className="font-black text-sm uppercase text-gray-900 print:text-black">
                  {order.length.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 print:border-black">
                <span className="font-bold uppercase text-gray-500 print:text-black text-[11px]">Finish:</span>
                <span className="font-bold capitalize text-gray-900 print:text-black">
                  {order.finish || "Glossy"} Topcoat
                </span>
              </div>
            </div>
          </div>

          {/* EXACT 5-FINGER MILLIMETER BENCH CHART */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-900 print:text-black flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-brand-primary print:text-black" />
              <span>Exact Finger Sizing Blueprint (Thumb → Pinky)</span>
            </span>

            {isCoinPhoto ? (
              <div className="p-3 text-center rounded-xl bg-amber-50 print:bg-gray-100 border-2 border-gray-900 space-y-1">
                <div className="font-black text-sm text-gray-900 print:text-black flex items-center justify-center gap-1.5">
                  <Camera className="w-4 h-4 print:text-black" />
                  <span>Hand &amp; Coin Calibration Scale</span>
                </div>
                <div className="text-[10px] text-gray-600 print:text-black font-semibold">
                  Calibrate finger widths using the Rs. 1 (20mm) or Rs. 2 (22mm) coin benchmark before crafting.
                </div>
              </div>
            ) : isCustom && measurements ? (
              <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                <div className="p-2 rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900">
                  <div className="text-[9px] font-black uppercase text-gray-600 print:text-black">Thumb</div>
                  <div className="text-base font-black text-brand-primary print:text-black">{measurements.thumb}mm</div>
                </div>
                <div className="p-2 rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900">
                  <div className="text-[9px] font-black uppercase text-gray-600 print:text-black">Index</div>
                  <div className="text-base font-black text-brand-primary print:text-black">{measurements.index}mm</div>
                </div>
                <div className="p-2 rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900">
                  <div className="text-[9px] font-black uppercase text-gray-600 print:text-black">Middle</div>
                  <div className="text-base font-black text-brand-primary print:text-black">{measurements.middle}mm</div>
                </div>
                <div className="p-2 rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900">
                  <div className="text-[9px] font-black uppercase text-gray-600 print:text-black">Ring</div>
                  <div className="text-base font-black text-brand-primary print:text-black">{measurements.ring}mm</div>
                </div>
                <div className="p-2 rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900">
                  <div className="text-[9px] font-black uppercase text-gray-600 print:text-black">Pinky</div>
                  <div className="text-base font-black text-brand-primary print:text-black">{measurements.pinky}mm</div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 text-center rounded-xl bg-pink-100/70 print:bg-gray-100 border-2 border-gray-900 font-bold text-sm">
                Standard Size: <span className="text-brand-primary print:text-black font-black text-base">{order.size_data?.standardSize || "M"}</span>
              </div>
            )}
          </div>

          {/* Client Notes & Accent Directives */}
          {order.notes && (
            <div className="p-2.5 rounded-xl bg-yellow-50/80 print:bg-gray-50 border border-yellow-200 print:border-black text-xs space-y-0.5">
              <span className="font-bold text-[10px] uppercase text-gray-600 print:text-black block">
                Bench Notes &amp; Accent Specs:
              </span>
              <p className="font-semibold text-gray-900 print:text-black italic leading-tight">
                &ldquo;{order.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Artist Bench Checklist */}
          <div className="pt-2 border-t border-gray-300 print:border-black">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 print:text-black block mb-1">
              Quality Assurance Bench Sign-Off:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-gray-700 print:text-black">
              <span>[ ] 1. Tip Fit &amp; Prep</span>
              <span>[ ] 2. Gel Sculpt &amp; Art</span>
              <span>[ ] 3. Boxed with Kit</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 no-print">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2 shadow-pink-sm">
            <Printer className="w-4 h-4" />
            <span>Print Workcard (4x6 Slip)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
