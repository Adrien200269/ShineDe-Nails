import { Metadata } from "next";
import Link from "next/link";
import {
  Ruler,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nail Sizing & Measurement Guide | ShineDe Nails",
  description: "Learn how to accurately measure your natural nails using a piece of clear tape and a millimeter ruler for a flawless custom press-on nail fit.",
};

export default function HowToMeasurePage() {
  return (
    <div className="min-h-screen bg-brand-bg subtle-sparkle-bg py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
            Precision Fit Guide
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            How to Measure Your Nails
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            A bespoke set begins with your exact measurements. Accurate sizing ensures your ShineDe Nails press-ons look seamless and feel like custom salon extensions.
          </p>
        </div>

        {/* 3 Step Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card hover:shadow-pink-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-lg font-bold font-serif text-white mb-4 shadow-sm">
              1
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
              Apply Clear Tape
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Place a piece of transparent tape across the widest part of your bare natural nail bed, pressing firmly into the side grooves.
            </p>
          </div>

          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card hover:shadow-pink-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-lg font-bold font-serif text-white mb-4 shadow-sm">
              2
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
              Mark Both Side Walls
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              With a fine-tip pen, draw a small line on both the left and right edges where your nail curves down into the lateral skin fold.
            </p>
          </div>

          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card hover:shadow-pink-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-lg font-bold font-serif text-white mb-4 shadow-sm">
              3
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">
              Measure Millimeters
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Peel the tape off, place it flat on a ruler, and count the millimeter lines between your two pen marks. Note all 5 fingers!
            </p>
          </div>
        </div>

        {/* Size Chart Reference */}
        <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-pink-100 dark:border-brand-dark-border">
            <Ruler className="w-5 h-5 text-brand-primary" />
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              Standard Sizing Chart (Thumb to Pinky)
            </h2>
          </div>

          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-pink-200 dark:border-brand-dark-border text-gray-500 dark:text-gray-400 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 pr-3">Size Name</th>
                  <th className="py-2.5 px-3">Thumb</th>
                  <th className="py-2.5 px-3">Index</th>
                  <th className="py-2.5 px-3">Middle</th>
                  <th className="py-2.5 px-3">Ring</th>
                  <th className="py-2.5 pl-3">Pinky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100 dark:divide-brand-dark-border text-gray-800 dark:text-gray-200">
                <tr>
                  <td className="py-3 pr-3 font-bold text-brand-primary">Extra Small (XS)</td>
                  <td className="py-3 px-3">14 mm</td>
                  <td className="py-3 px-3">11 mm</td>
                  <td className="py-3 px-3">12 mm</td>
                  <td className="py-3 px-3">10 mm</td>
                  <td className="py-3 pl-3">8 mm</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-bold text-brand-primary">Small (S)</td>
                  <td className="py-3 px-3">15 mm</td>
                  <td className="py-3 px-3">12 mm</td>
                  <td className="py-3 px-3">13 mm</td>
                  <td className="py-3 px-3">11 mm</td>
                  <td className="py-3 pl-3">8 mm</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-bold text-brand-primary">Medium (M)</td>
                  <td className="py-3 px-3">16 mm</td>
                  <td className="py-3 px-3">12 mm</td>
                  <td className="py-3 px-3">13 mm</td>
                  <td className="py-3 px-3">11 mm</td>
                  <td className="py-3 pl-3">9 mm</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-bold text-brand-primary">Large (L)</td>
                  <td className="py-3 px-3">18 mm</td>
                  <td className="py-3 px-3">13 mm</td>
                  <td className="py-3 px-3">14 mm</td>
                  <td className="py-3 px-3">12 mm</td>
                  <td className="py-3 pl-3">10 mm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-pink-50 dark:bg-brand-primary/10 border border-pink-200 dark:border-brand-primary/30 text-xs text-brand-primary font-medium flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              If your natural nail measurements do not match the standard sizes, don&apos;t worry! Select <strong>&quot;Option B: Custom Measurements&quot;</strong> in our custom order form and we will tailor each tip individually.
            </span>
          </div>
        </div>

        {/* Application & Removal Pro Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card space-y-3">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>How to Apply for 3+ Weeks Wear</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Gently push back cuticles with the included wooden wand.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Lightly buff the shine off your natural nail surface.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Wipe thoroughly with alcohol prep pads to eliminate all oils.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Apply glue to both your nail and the press-on; hold at 45° angle firmly for 30s.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card p-6 shadow-card space-y-3">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-primary" />
              <span>Damage-Free Removal & Reusing</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Soak hands in warm water with a few drops of dish soap and cuticle oil for 15 mins.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Gently wiggle nails from the sides; never pry from the top!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Store your nails back in their custom ShineDe box for reuse next time.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/custom-order">
            <Button size="lg" className="shadow-pink-md gap-2">
              <span>Ready? Design Your Custom Set Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
