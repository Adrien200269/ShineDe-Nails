"use client";

import * as React from "react";
import { Sparkles, MessageSquare, Paintbrush, User, Lock, CheckCircle2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NailFinish, UserSession } from "@/types";
import { cn } from "@/lib/utils";
import { MixAndMatchStudio } from "./MixAndMatchStudio";

interface Step4OrderDetailsProps {
  finish: NailFinish;
  notes: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  user?: UserSession | null;
  onOpenAuthModal?: () => void;
  onFinishChange: (finish: NailFinish) => void;
  onNotesChange: (notes: string) => void;
  onCustomerNameChange: (name: string) => void;
  onCustomerEmailChange: (email: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
  errors?: {
    customerName?: string;
    customerEmail?: string;
  };
}

export function Step4OrderDetails({
  finish,
  notes,
  customerName,
  customerEmail,
  customerPhone,
  user,
  onOpenAuthModal,
  onFinishChange,
  onNotesChange,
  onCustomerNameChange,
  onCustomerEmailChange,
  onCustomerPhoneChange,
  errors,
}: Step4OrderDetailsProps) {
  const finishes: Array<{
    id: NailFinish;
    title: string;
    desc: string;
  }> = [
    {
      id: "glossy",
      title: "Ultra Glossy Topcoat",
      desc: "High-shine glass finish that mimics fresh salon gel.",
    },
    {
      id: "matte",
      title: "Velvet Matte Topcoat",
      desc: "Soft silky velvety texture with zero glare.",
    },
    {
      id: "mixed",
      title: "Mixed / Accent Combo",
      desc: "Combine matte & glossy (detail your vision in notes).",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Step 4: Finish & Custom Instructions
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Personalize Every Detail
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Tell us about specific accents, charms, color swaps, or matte/glossy preferences.
        </p>
      </div>

      {/* Finish Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-2.5 flex items-center gap-1.5">
          <Paintbrush className="w-4 h-4 text-brand-primary" />
          <span>Preferred Finish Topcoat</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {finishes.map((f) => {
            const isSelected = finish === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFinishChange(f.id)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-2xl border text-left transition-all bg-white dark:bg-brand-dark-card cursor-pointer",
                  isSelected
                    ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-pink-md bg-pink-50/20 dark:bg-brand-primary/10"
                    : "border-pink-200 dark:border-brand-dark-border hover:border-brand-primary/50"
                )}
              >
                <span className={cn("text-sm font-bold", isSelected ? "text-brand-primary" : "text-gray-900 dark:text-white")}>
                  {f.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Mix & Match Accent Studio */}
      <MixAndMatchStudio
        onAutoSelectMixedFinish={() => {
          if (finish !== "mixed") {
            onFinishChange("mixed");
          }
        }}
        onSyncToNotes={(accentSummary) => {
          // Remove previous [Custom Finger Accents: ...] tag if present and replace with fresh one
          const cleanNotes = notes.replace(/\[Custom Finger Accents: [^\]]+\]\s*/g, "").trim();
          const combined = cleanNotes ? `${accentSummary}\n${cleanNotes}` : accentSummary;
          onNotesChange(combined);
        }}
      />

      {/* Custom Notes */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="order-notes"
            className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-brand-primary" />
            <span>Specific Customization Notes</span>
          </label>
          <span className="text-[11px] text-gray-400">Optional</span>
        </div>
        <Textarea
          id="order-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="e.g., 'Please make the middle finger matte and the rest glossy. Add silver star chrome charms to the thumbs. Base color a slightly warmer blush nude.'"
          className="min-h-[120px]"
        />
        <p className="text-[11px] text-gray-500 dark:text-gray-400 pl-1">
          Feel free to specify nail charms, chrome powder color, aura gradient intensity, or 3D gel line art!
        </p>
      </div>

      {/* Customer Contact Information */}
      <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-brand-primary" />
            <span>Customer Contact Details</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We will send order confirmation, design mockups, and tracking to this address.
          </p>
        </div>

        {/* Authentication Status Callout */}
        {user ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 dark:bg-brand-primary/10 border border-pink-200 dark:border-brand-dark-border text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </span>
              <span className="text-gray-700 dark:text-brand-dark-text">
                Linked to account: <strong className="text-brand-primary">{user.email}</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Logged In
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <Lock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Login Required to Order:</strong> You must log in to submit this custom order and track production.
              </span>
            </div>
            {onOpenAuthModal && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onOpenAuthModal}
                className="text-xs h-8 border-amber-300 dark:border-amber-700 bg-white dark:bg-brand-dark-card hover:bg-amber-100 self-start sm:self-auto shrink-0"
              >
                Log In / Register
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="cust-name"
            label="Your Full Name"
            placeholder="e.g. Ariana Grande"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            error={errors?.customerName}
            required
          />

          <Input
            id="cust-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            error={errors?.customerEmail}
            required
          />
        </div>

        <Input
          id="cust-phone"
          type="tel"
          label="Phone / WhatsApp (Optional for Nepal Shipping Updates)"
          placeholder="+977 9800000000"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
        />
      </div>
    </div>
  );
}
