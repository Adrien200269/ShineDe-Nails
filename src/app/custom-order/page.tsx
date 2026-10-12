import { Metadata } from "next";
import { Suspense } from "react";
import { OrderWizard } from "@/components/custom-order/OrderWizard";

export const metadata: Metadata = {
  title: "Design Your Custom Set | ShineDe Nails",
  description: "Upload your dream nail inspiration, pick shape and length, input your custom measurements, and order your bespoke press-on nails.",
};

export default function CustomOrderPage() {
  return (
    <div className="relative min-h-screen bg-brand-bg subtle-sparkle-bg pb-24 sm:pb-16 pt-4">
      {/* Decorative top background blur */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FF80B5] to-[#E93F66] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <Suspense fallback={<div className="min-h-[500px] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" /></div>}>
        <OrderWizard />
      </Suspense>
    </div>
  );
}
