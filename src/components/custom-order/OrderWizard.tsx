"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ImageIcon,
  Scissors,
  Ruler,
  FileText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step1Upload } from "./Step1Upload";
import { Step2ShapeLength } from "./Step2ShapeLength";
import { Step3Sizing } from "./Step3Sizing";
import { Step4OrderDetails } from "./Step4OrderDetails";
import { Step5ReviewCheckout } from "./Step5ReviewCheckout";
import { OrderSuccessModal } from "./OrderSuccessModal";
import {
  NailShape,
  NailLength,
  NailFinish,
  SizingType,
  StandardSize,
  NailMeasurements,
  CustomOrder,
} from "@/types";
import { generateOrderNumber, formatCurrency } from "@/lib/utils";
import { submitCustomOrder } from "@/lib/orders";

const STEPS = [
  { id: 1, label: "Inspiration", icon: ImageIcon },
  { id: 2, label: "Shape & Length", icon: Scissors },
  { id: 3, label: "Sizing", icon: Ruler },
  { id: 4, label: "Details", icon: FileText },
  { id: 5, label: "Checkout", icon: CreditCard },
];

export function OrderWizard() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [direction, setDirection] = React.useState(1);

  // Form State
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [shape, setShape] = React.useState<NailShape>("almond");
  const [length, setLength] = React.useState<NailLength>("medium");
  const [finish, setFinish] = React.useState<NailFinish>("glossy");
  const [sizingType, setSizingType] = React.useState<SizingType>("standard");
  const [standardSize, setStandardSize] = React.useState<StandardSize>("M");
  const [measurements, setMeasurements] = React.useState<NailMeasurements>({
    thumb: 16,
    index: 12,
    middle: 13,
    ring: 11,
    pinky: 9,
  });
  const [notes, setNotes] = React.useState<string>("");
  const [customerName, setCustomerName] = React.useState<string>("");
  const [customerEmail, setCustomerEmail] = React.useState<string>("");
  const [customerPhone, setCustomerPhone] = React.useState<string>("");

  const searchParams = useSearchParams();

  // Pre-fill specs from Quiz if available
  React.useEffect(() => {
    if (!searchParams) return;
    const shapeParam = searchParams.get("shape")?.toLowerCase();
    const lengthParam = searchParams.get("length")?.toLowerCase();

    if (shapeParam && ["almond", "coffin", "square", "stiletto", "oval"].includes(shapeParam)) {
      setShape(shapeParam as NailShape);
    }
    if (lengthParam && ["short", "medium", "long", "extra_long"].includes(lengthParam)) {
      setLength(lengthParam as NailLength);
    }
  }, [searchParams]);

  // UI state
  const [stepErrors, setStepErrors] = React.useState<{
    image?: string;
    customerName?: string;
    customerEmail?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdOrder, setCreatedOrder] = React.useState<CustomOrder | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // Price Calculation in Nepalese Rupees (NPR)
  const calculateTotal = React.useMemo(() => {
    let base = 1499;
    if (length === "medium") base += 150;
    if (length === "long") base += 300;
    if (length === "extra_long") base += 450;
    return base;
  }, [length]);

  // Validation before advancing
  const validateStep = (step: number): boolean => {
    const errors: typeof stepErrors = {};

    if (step === 1) {
      if (!imageUrl) {
        errors.image = "Please upload an inspiration photo to continue.";
        setStepErrors(errors);
        return false;
      }
    }

    if (step === 4) {
      if (!customerName.trim()) {
        errors.customerName = "Please enter your name.";
      }
      if (!customerEmail.trim() || !customerEmail.includes("@")) {
        errors.customerEmail = "Please enter a valid email address.";
      }
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return false;
      }
    }

    setStepErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitOrder = async (discountedPrice?: number, promoCodeUsed?: string) => {
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    try {
      setIsSubmitting(true);
      const orderNotes = promoCodeUsed
        ? notes
          ? `${notes} [Promo Code Applied: ${promoCodeUsed}]`
          : `[Promo Code Applied: ${promoCodeUsed}]`
        : notes;

      const newOrder = await submitCustomOrder({
        order_number: generateOrderNumber(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        image_url: imageUrl,
        shape,
        length,
        finish,
        sizing_type: sizingType,
        size_data:
          sizingType === "standard"
            ? { type: "standard", standardSize }
            : { type: "custom", measurements },
        notes: orderNotes,
        status: "Pending",
        total_price: discountedPrice ?? calculateTotal,
        payment_status: "paid", // Mock payment processed
      });

      setCreatedOrder(newOrder);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to submit custom order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      {/* Multi-step progress bar */}
      <div className="mb-8">
        {/* Mobile Mini Step indicator */}
        <div className="flex sm:hidden items-center justify-between mb-3 bg-white dark:bg-brand-dark-surface p-3 rounded-2xl border border-pink-200 dark:border-brand-dark-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
              {currentStep}
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-brand-primary">
            {Math.round((currentStep / STEPS.length) * 100)}%
          </span>
        </div>

        {/* Desktop / Tablet Step Track */}
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-pink-200 dark:bg-brand-dark-border z-0" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-brand-primary transition-all duration-300 z-0"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 92}%`,
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < currentStep) {
                    setDirection(-1);
                    setCurrentStep(s.id);
                  }
                }}
                disabled={s.id > currentStep}
                className="relative z-10 flex flex-col items-center group cursor-pointer disabled:cursor-not-allowed"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? "bg-brand-primary border-brand-primary text-white shadow-pink-sm"
                      : isCurrent
                      ? "bg-white dark:bg-brand-dark-surface border-brand-primary text-brand-primary ring-4 ring-brand-primary/20 scale-110 shadow-pink-md"
                      : "bg-white dark:bg-brand-dark-card border-pink-200 dark:border-brand-dark-border text-gray-400 dark:text-brand-dark-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 stroke-[3]" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-bold transition-colors ${
                    isCurrent
                      ? "text-brand-primary"
                      : isCompleted
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-brand-dark-muted"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Form Body with Animated Transitions */}
      <div className="rounded-4xl border border-pink-200/80 dark:border-brand-dark-border bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-sm p-5 sm:p-8 md:p-10 shadow-pink-md dark:shadow-dark-card min-h-[480px] flex flex-col justify-between">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-1"
          >
            {currentStep === 1 && (
              <Step1Upload
                imageUrl={imageUrl}
                onImageChange={setImageUrl}
                onSuggestedFinishChange={setFinish}
                error={stepErrors.image}
              />
            )}

            {currentStep === 2 && (
              <Step2ShapeLength
                shape={shape}
                length={length}
                onShapeChange={setShape}
                onLengthChange={setLength}
              />
            )}

            {currentStep === 3 && (
              <Step3Sizing
                sizingType={sizingType}
                standardSize={standardSize}
                measurements={measurements}
                onSizingTypeChange={setSizingType}
                onStandardSizeChange={setStandardSize}
                onMeasurementsChange={setMeasurements}
              />
            )}

            {currentStep === 4 && (
              <Step4OrderDetails
                finish={finish}
                notes={notes}
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                onFinishChange={setFinish}
                onNotesChange={setNotes}
                onCustomerNameChange={setCustomerName}
                onCustomerEmailChange={setCustomerEmail}
                onCustomerPhoneChange={setCustomerPhone}
                errors={stepErrors}
              />
            )}

            {currentStep === 5 && (
              <Step5ReviewCheckout
                imageUrl={imageUrl}
                shape={shape}
                length={length}
                finish={finish}
                sizingType={sizingType}
                standardSize={standardSize}
                measurements={measurements}
                notes={notes}
                customerName={customerName}
                customerEmail={customerEmail}
                totalPrice={calculateTotal}
                isSubmitting={isSubmitting}
                onSubmitOrder={handleSubmitOrder}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop/Tablet Bottom Control Actions */}
        <div className="mt-8 pt-6 border-t border-pink-100 dark:border-brand-dark-border flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 px-8 shadow-pink-md"
            >
              <span>Continue to {STEPS[currentStep].label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-xs text-gray-400 dark:text-brand-dark-muted hidden sm:inline">
              Final Step: Review specs & place custom order
            </span>
          )}
        </div>
      </div>

      {/* Mobile Sticky Navigation Action Bar */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-md border-t border-pink-200 dark:border-brand-dark-border p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-pink-50 dark:bg-brand-dark-card text-brand-primary shrink-0 active:scale-95"
            aria-label="Previous step"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1 h-12 text-sm justify-center gap-2 shadow-pink-md"
          >
            <span>Next: {STEPS[currentStep].label}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => handleSubmitOrder()}
            isLoading={isSubmitting}
            className="flex-1 h-12 text-sm justify-center gap-2 shadow-pink-md"
          >
            <span>Place Order ({formatCurrency(calculateTotal)})</span>
            <Sparkles className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Success Celebration Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        order={createdOrder}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
