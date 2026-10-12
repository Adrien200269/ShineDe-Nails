"use client";

import * as React from "react";
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  Gift,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NailShape, NailLength, NailFinish, SizingType, StandardSize, NailMeasurements } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

interface Step5ReviewCheckoutProps {
  imageUrl: string;
  shape: NailShape;
  length: NailLength;
  finish: NailFinish;
  sizingType: SizingType;
  standardSize?: StandardSize;
  measurements?: NailMeasurements;
  notes?: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  isSubmitting: boolean;
  onSubmitOrder: () => void;
}

export function Step5ReviewCheckout({
  imageUrl,
  shape,
  length,
  finish,
  sizingType,
  standardSize,
  measurements,
  notes,
  customerName,
  customerEmail,
  totalPrice,
  isSubmitting,
  onSubmitOrder,
}: Step5ReviewCheckoutProps) {
  const [paymentOption, setPaymentOption] = React.useState<"esewa" | "card" | "cod">("esewa");
  const [cardNumber, setCardNumber] = React.useState("•••• •••• •••• 4242");
  const [cardExp, setCardExp] = React.useState("12/28");
  const [cardCvc, setCardCvc] = React.useState("789");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Step 5: Final Review & Checkout
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Ready to Slay in Nepal? 🇳🇵
        </h2>
        <p className="text-sm text-gray-600 dark:text-brand-dark-muted mt-1">
          Review your custom specifications before we dispatch your order to our nail artist bench.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Summary & Inspo Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-5 sm:p-6 shadow-card dark:shadow-dark-card">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-pink-100 dark:border-brand-dark-border flex items-center justify-between">
              <span>Your Custom Nail Specs</span>
              <span className="text-xs font-sans font-bold bg-pink-100 dark:bg-pink-950/60 text-brand-primary px-2.5 py-0.5 rounded-full">
                Handcrafted · Kathmandu
              </span>
            </h3>

            {/* Inspiration Image & Specs preview */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative w-full sm:w-36 aspect-square rounded-2xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-50 dark:bg-brand-dark-card shrink-0">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Custom Inspo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-full">
                  Inspo Photo
                </div>
              </div>

              <div className="space-y-2 flex-1 text-xs text-gray-800 dark:text-brand-dark-text">
                <div className="flex justify-between py-1 border-b border-pink-50 dark:border-brand-dark-border/50">
                  <span className="text-gray-500 dark:text-brand-dark-muted uppercase font-semibold">Shape:</span>
                  <span className="font-bold capitalize">{shape}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-pink-50 dark:border-brand-dark-border/50">
                  <span className="text-gray-500 dark:text-brand-dark-muted uppercase font-semibold">Length:</span>
                  <span className="font-bold capitalize">
                    {length.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-pink-50 dark:border-brand-dark-border/50">
                  <span className="text-gray-500 dark:text-brand-dark-muted uppercase font-semibold">Finish:</span>
                  <span className="font-bold capitalize">{finish}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-pink-50 dark:border-brand-dark-border/50">
                  <span className="text-gray-500 dark:text-brand-dark-muted uppercase font-semibold">Sizing:</span>
                  <span className="font-bold text-brand-primary">
                    {sizingType === "standard"
                      ? `Standard Size ${standardSize}`
                      : "Custom Millimeter Fit"}
                  </span>
                </div>

                {sizingType === "custom" && measurements && (
                  <div className="pt-1 text-[11px] font-mono text-gray-600 dark:text-brand-dark-muted bg-pink-50/60 dark:bg-brand-dark-card p-2 rounded-xl">
                    <span>T:{measurements.thumb}mm · I:{measurements.index}mm · M:{measurements.middle}mm · R:{measurements.ring}mm · P:{measurements.pinky}mm</span>
                  </div>
                )}
              </div>
            </div>

            {notes && (
              <div className="mt-3 p-3 bg-pink-50/50 dark:bg-brand-dark-card rounded-2xl border border-pink-100 dark:border-brand-dark-border text-xs">
                <span className="font-bold text-brand-primary block mb-0.5">Special Notes:</span>
                <p className="text-gray-700 dark:text-brand-dark-text italic leading-relaxed">&ldquo;{notes}&rdquo;</p>
              </div>
            )}

            {/* Complimentary Prep Kit Bonus */}
            <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-brand-dark-card dark:to-brand-dark-surface border border-pink-200 dark:border-brand-dark-border">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm shrink-0">
                <Gift className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-900 dark:text-white">Complimentary Deluxe Kit Included (Worth Rs. 350)</p>
                <p className="text-gray-600 dark:text-brand-dark-muted">Includes strong salon glue, jelly tabs, cuticle pusher, mini buffer & alcohol wipes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown & Payment Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-5 sm:p-6 shadow-pink-md dark:shadow-dark-card">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-pink-100 dark:border-brand-dark-border">
              Order Summary (NPR)
            </h3>

            <div className="space-y-2 text-xs text-gray-600 dark:text-brand-dark-muted">
              <div className="flex justify-between">
                <span>Handcrafted Custom Set</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(1499)}</span>
              </div>
              {length !== "short" && (
                <div className="flex justify-between">
                  <span>Length ({length.replace("_", " ")})</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    +{formatCurrency(length === "medium" ? 150 : length === "long" ? 300 : 450)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Custom Sizing & Sculpting</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Full Application Kit</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Nepal Delivery (Kathmandu & Nationwide)</span>
                <span className="font-semibold">FREE</span>
              </div>

              <div className="pt-3 mt-3 border-t border-pink-200 dark:border-brand-dark-border flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900 dark:text-white text-base font-serif">Total Due</span>
                <span className="font-bold text-2xl text-brand-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Payment Options (Nepal Local + Card) */}
            <div className="mt-6 pt-4 border-t border-pink-100 dark:border-brand-dark-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                  <Wallet className="w-4 h-4 text-brand-primary" />
                  <span>Payment Method</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-brand-dark-muted font-semibold">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Secure & Verified</span>
                </div>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOption("esewa")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all",
                    paymentOption === "esewa"
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                      : "border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-700 dark:text-brand-dark-text"
                  )}
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider">eSewa / Khalti</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Instant QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption("card")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all",
                    paymentOption === "card"
                      ? "border-brand-primary bg-pink-50/60 dark:bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20"
                      : "border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-700 dark:text-brand-dark-text"
                  )}
                >
                  <CreditCard className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Debit / Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption("cod")}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all",
                    paymentOption === "cod"
                      ? "border-brand-primary bg-pink-50/60 dark:bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20"
                      : "border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-700 dark:text-brand-dark-text"
                  )}
                >
                  <span className="text-[10px]">COD</span>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">Inside Valley</span>
                </button>
              </div>

              {/* Payment Details Body */}
              {paymentOption === "esewa" && (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 p-3 text-xs space-y-1.5 text-gray-700 dark:text-brand-dark-text">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">eSewa / Khalti Digital Payment</p>
                  <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                    Your order will be logged into Supabase. You can pay via QR code on confirmation or upon design approval!
                  </p>
                </div>
              )}

              {paymentOption === "card" && (
                <div className="rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-pink-50/40 dark:bg-brand-dark-card p-3.5 space-y-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-brand-dark-muted block mb-1">
                      Card Number
                    </label>
                    <div className="flex items-center bg-white dark:bg-brand-dark-surface rounded-xl border border-pink-200 dark:border-brand-dark-border px-3 py-2 text-xs font-mono">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-transparent outline-none text-gray-800 dark:text-white"
                      />
                      <span className="text-[10px] font-bold text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-1.5 py-0.5 rounded">
                        VISA / MC
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-brand-dark-muted block mb-1">
                        Expires (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-white dark:bg-brand-dark-surface rounded-xl border border-pink-200 dark:border-brand-dark-border px-3 py-2 text-xs font-mono outline-none text-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-brand-dark-muted block mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white dark:bg-brand-dark-surface rounded-xl border border-pink-200 dark:border-brand-dark-border px-3 py-2 text-xs font-mono outline-none text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentOption === "cod" && (
                <div className="rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-pink-50/40 dark:bg-brand-dark-card p-3 text-xs space-y-1 text-gray-700 dark:text-brand-dark-text">
                  <p className="font-bold">Cash on Delivery (Kathmandu, Lalitpur, Bhaktapur)</p>
                  <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                    Pay {formatCurrency(totalPrice)} in cash when your handcrafted custom set is delivered to your doorstep.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-gray-500 dark:text-brand-dark-muted flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-brand-primary shrink-0" />
                <span>
                  Placed by: <strong>{customerName || "Valued Client"}</strong> ({customerEmail})
                </span>
              </div>

              {/* Submit CTA */}
              <Button
                type="button"
                onClick={onSubmitOrder}
                isLoading={isSubmitting}
                className="w-full mt-3 h-13 text-base shadow-pink-md gap-2"
              >
                <span>Place Custom Order ({formatCurrency(totalPrice)})</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
