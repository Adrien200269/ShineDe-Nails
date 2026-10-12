"use client";

import * as React from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Home, Eye } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { CustomOrder } from "@/types";
import { createWhatsAppOrderLink } from "@/lib/utils";

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: CustomOrder | null;
  onClose: () => void;
}

export function OrderSuccessModal({ isOpen, order, onClose }: OrderSuccessModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      // Trigger festive pink & gold confetti blast
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E93F66", "#FF6584", "#F472B6", "#FFD700", "#FFFFFF"],
        });
      } catch (e) {
        console.error("Confetti error", e);
      }
    }
  }, [isOpen]);

  if (!order) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-md text-center p-6 sm:p-8">
      {/* Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary mb-4 shadow-pink-sm animate-bounce">
        <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
      </div>

      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-brand-primary bg-pink-100 dark:bg-brand-primary/20 px-3 py-1 rounded-full mb-2">
        <Sparkles className="w-3.5 h-3.5" /> Order Successfully Placed
      </span>

      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
        You&apos;re About to Slay! ✨
      </h2>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
        Thank you <strong className="text-gray-900 dark:text-white">{order.customer_name}</strong>! Your custom order has been logged and our nail artist is reviewing your design inspo.
      </p>

      {/* Order Badge */}
      <div className="my-5 rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-pink-50/70 dark:bg-brand-dark-card p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
          Order Confirmation Number
        </span>
        <span className="font-mono text-lg font-bold text-brand-primary tracking-wide">
          {order.order_number}
        </span>
        <span className="block text-[11px] text-gray-500 dark:text-gray-400 mt-1">
          Status: <strong className="text-amber-600 dark:text-amber-400">Pending Review</strong>
        </span>
      </div>

      {/* Next Steps Timeline */}
      <div className="text-left space-y-2.5 my-5 text-xs bg-white dark:bg-brand-dark-surface p-3.5 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <div className="h-2 w-2 rounded-full bg-brand-primary" />
          <span>1. Nail artist matches gels & charms to your photo</span>
        </div>
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <div className="h-2 w-2 rounded-full bg-pink-300 dark:bg-pink-700" />
          <span>2. Handcrafted to your shape ({order.shape}) & measurements</span>
        </div>
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <div className="h-2 w-2 rounded-full bg-pink-300 dark:bg-pink-700" />
          <span>3. Quality cured, boxed with application kit & shipped</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <a
          href={createWhatsAppOrderLink({
            orderNumber: order.order_number,
            shape: order.shape,
            length: order.length,
            finish: order.finish,
            sizingType: order.sizing_type,
            standardSize: order.size_data?.standardSize,
            measurements: order.size_data?.measurements,
            imageUrl: order.image_url,
            totalPrice: Number(order.total_price),
            customerName: order.customer_name,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <WhatsAppIcon className="w-4 h-4 fill-current" />
          <span>Send Order Summary to WhatsApp</span>
        </a>

        <Link href="/dashboard" onClick={onClose}>
          <Button variant="outline" className="w-full gap-2 border-pink-200">
            <Eye className="w-4 h-4" />
            <span>Track in My Orders Dashboard</span>
          </Button>
        </Link>

        <Link href="/" onClick={onClose}>
          <Button variant="white" className="w-full gap-2 border-pink-100 text-gray-600">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </Dialog>
  );
}
