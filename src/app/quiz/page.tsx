"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Scissors,
  Laptop,
  Dumbbell,
  Sparkle,
  Star,
  Flame,
  Crown,
  Heart,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizOption {
  label: string;
  desc: string;
  shapePoints: Record<string, number>;
  lengthPoints: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: "How would you describe your natural nail beds & hands?",
    subtitle: "Your anatomy determines which silhouette creates the most flattering elongation.",
    options: [
      {
        label: "Petite / Narrow Nail Beds",
        desc: "Smaller hands and delicate, compact fingers.",
        shapePoints: { almond: 3, oval: 3, square: 1 },
        lengthPoints: { short: 3, medium: 2 },
      },
      {
        label: "Wide or Broader Nail Beds",
        desc: "Looking to slenderize and visually lengthen fingers.",
        shapePoints: { almond: 4, coffin: 3, stiletto: 2 },
        lengthPoints: { medium: 3, long: 2 },
      },
      {
        label: "Long, Slender Fingers",
        desc: "Already have elongated hands and can rock dramatic silhouettes.",
        shapePoints: { coffin: 4, stiletto: 3, square: 2 },
        lengthPoints: { long: 4, extra_long: 3, medium: 1 },
      },
      {
        label: "Straight / Average Nail Beds",
        desc: "Balanced proportion looking for clean, symmetrical lines.",
        shapePoints: { square: 3, almond: 2, oval: 2 },
        lengthPoints: { short: 2, medium: 3 },
      },
    ],
  },
  {
    id: 2,
    title: "What does your typical daily routine look like?",
    subtitle: "We ensure your set is comfortable for work, studies, and workouts.",
    options: [
      {
        label: "Heavy Typing / Laptop Work",
        desc: "Fast typing on keyboards or touchscreens all day.",
        shapePoints: { almond: 3, oval: 4, square: 2 },
        lengthPoints: { short: 4, medium: 2 },
      },
      {
        label: "Active & Hands-on Lifestyle",
        desc: "Gym workouts, sports, cooking, housework, or crafting.",
        shapePoints: { oval: 4, almond: 3, square: 2 },
        lengthPoints: { short: 4, medium: 1 },
      },
      {
        label: "Balanced Chic / Student / Casual",
        desc: "Everyday elegance with light screen typing and daily errands.",
        shapePoints: { almond: 4, coffin: 3, square: 2 },
        lengthPoints: { medium: 4, short: 2 },
      },
      {
        label: "Events, Photoshoots & Nightlife",
        desc: "Weekend glam, graduation, festivals, or high-fashion aesthetic.",
        shapePoints: { stiletto: 4, coffin: 4, almond: 2 },
        lengthPoints: { long: 4, extra_long: 3 },
      },
    ],
  },
  {
    id: 3,
    title: "Which dream nail aesthetic speaks to your soul?",
    subtitle: "Pick the mood board that matches your personal style.",
    options: [
      {
        label: "Clean Girl / Glazed Donut Pearl",
        desc: "Hailey Bieber glazed chrome, natural blush jelly, understated luxury.",
        shapePoints: { almond: 4, oval: 3 },
        lengthPoints: { short: 3, medium: 3 },
      },
      {
        label: "Cyber Y2K / Baddie Statement",
        desc: "Silver chrome drip, 3D charms, French ombre, bold presence.",
        shapePoints: { coffin: 4, square: 3 },
        lengthPoints: { long: 4, medium: 2 },
      },
      {
        label: "Fierce High-Fashion / Cat-Eye Noir",
        desc: "Deep velvet magnetic gels, piercing silhouette, runway mood.",
        shapePoints: { stiletto: 4, almond: 3 },
        lengthPoints: { long: 4, extra_long: 3 },
      },
      {
        label: "Timeless Classic French & Retro Elegance",
        desc: "Crisp white smiling smile lines, clean geometry, never goes out of style.",
        shapePoints: { square: 4, almond: 3, oval: 2 },
        lengthPoints: { short: 3, medium: 3 },
      },
    ],
  },
  {
    id: 4,
    title: "What is your comfort level with nail length?",
    subtitle: "Be honest! Press-on nails should empower you, not get in your way.",
    options: [
      {
        label: "Beginner / Practical (Keep it easy)",
        desc: "First time or prefer total freedom to text and type without adjusting.",
        shapePoints: { oval: 3, almond: 2, square: 2 },
        lengthPoints: { short: 5, medium: 1 },
      },
      {
        label: "Sweet Spot (Balanced drama)",
        desc: "Noticeably elegant length that still lets you handle car keys and phones easily.",
        shapePoints: { almond: 4, coffin: 3, square: 2 },
        lengthPoints: { medium: 5, short: 1 },
      },
      {
        label: "Drama Queen (Maximum glam)",
        desc: "I love the satisfying tap-tap sound on phone screens and full baddie energy.",
        shapePoints: { coffin: 4, stiletto: 4 },
        lengthPoints: { long: 5, extra_long: 3 },
      },
    ],
  },
];

const SHAPE_DETAILS: Record<
  string,
  { name: string; title: string; desc: string; icon: string; tags: string[] }
> = {
  almond: {
    name: "Almond",
    title: "The Universally Flattering Royal Silhouette",
    desc: "Tapered gently along the side walls into a soft rounded apex. It elongates shorter fingers effortlessly while remaining sturdy and keyboard-friendly.",
    icon: "🌰",
    tags: ["#1 Best Seller", "Slenderizes Hands", "Natural Chic"],
  },
  coffin: {
    name: "Coffin / Ballerina",
    title: "The High-Glam Statement Architecture",
    desc: "Tapered side walls terminating in a razor-sharp, flat square tip. Perfect for modern Y2K nail art, 3D charms, and glamorous event looks.",
    icon: "💎",
    tags: ["Instagram Baddie", "Art Canvas", "Ultra Modern"],
  },
  square: {
    name: "Square",
    title: "Crisp Parisian Classic Symmetry",
    desc: "Crisp parallel side walls meeting a sharp 90-degree horizontal edge. The quintessential canvas for timeless French tips and bold modern geometry.",
    icon: "📐",
    tags: ["Classic French", "Symmetrical", "Sturdy Tip"],
  },
  oval: {
    name: "Oval",
    title: "Effortless Everyday Minimalist Luxury",
    desc: "A soft, organic curvature that mirrors your natural cuticle line. Ideal for keyboard typists, active routines, and the 'Clean Girl' aesthetic.",
    icon: "✨",
    tags: ["Keyboard Friendly", "Zero Snag", "Clean Girl"],
  },
  stiletto: {
    name: "Stiletto",
    title: "Fierce Runway Piercing Drama",
    desc: "Dramatic aggressive taper into a needle-sharp piercing tip. Guaranteed to turn heads, photograph like a dream, and make a fierce style statement.",
    icon: "⚡",
    tags: ["Runway Drama", "Fierce", "Photoshoot Queen"],
  },
};

export default function ShapeQuizPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [isFinished, setIsFinished] = React.useState(false);

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentStep] = optionIndex;
    setSelectedAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers([]);
    setCurrentStep(0);
    setIsFinished(false);
  };

  // Calculate scores
  const results = React.useMemo(() => {
    if (!isFinished) return null;

    const shapeScores: Record<string, number> = {
      almond: 0,
      coffin: 0,
      square: 0,
      oval: 0,
      stiletto: 0,
    };

    const lengthScores: Record<string, number> = {
      short: 0,
      medium: 0,
      long: 0,
      extra_long: 0,
    };

    selectedAnswers.forEach((ansIdx, qIdx) => {
      const q = QUESTIONS[qIdx];
      if (q && q.options[ansIdx]) {
        const opt = q.options[ansIdx];
        Object.entries(opt.shapePoints).forEach(([shape, pts]) => {
          shapeScores[shape] = (shapeScores[shape] || 0) + pts;
        });
        Object.entries(opt.lengthPoints).forEach(([length, pts]) => {
          lengthScores[length] = (lengthScores[length] || 0) + pts;
        });
      }
    });

    const winningShape = Object.entries(shapeScores).sort((a, b) => b[1] - a[1])[0][0];
    const winningLength = Object.entries(lengthScores).sort((a, b) => b[1] - a[1])[0][0];

    return {
      shape: winningShape,
      length: winningLength,
      shapeInfo: SHAPE_DETAILS[winningShape] || SHAPE_DETAILS.almond,
    };
  }, [isFinished, selectedAnswers]);

  return (
    <div className="min-h-screen bg-brand-bg subtle-sparkle-bg py-10 px-4 sm:px-6 flex flex-col justify-center">
      <div className="mx-auto max-w-2xl w-full">
        {!isFinished ? (
          <div className="space-y-6">
            {/* Header & Progress Bar */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> 30-Second Silhouette Matcher
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Find Your Ideal Nail Shape
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted max-w-md mx-auto">
                Question {currentStep + 1} of {QUESTIONS.length}
              </p>

              {/* Progress Bar Track */}
              <div className="w-full bg-pink-100 dark:bg-brand-dark-border h-2 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
                <motion.div
                  className="bg-brand-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-4xl border border-pink-200/80 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-6 sm:p-8 shadow-pink-md dark:shadow-dark-card space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {QUESTIONS[currentStep].title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-brand-dark-muted mt-1">
                  {QUESTIONS[currentStep].subtitle}
                </p>
              </div>

              {/* Options Stack */}
              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between group ${
                        isSelected
                          ? "border-brand-primary bg-pink-50/70 dark:bg-pink-950/60 ring-2 ring-brand-primary/20 shadow-sm"
                          : "border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card hover:border-brand-primary/60 hover:bg-pink-50/30"
                      }`}
                    >
                      <div className="pr-3">
                        <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">
                          {opt.label}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-brand-dark-muted mt-0.5 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? "bg-brand-primary border-brand-primary text-white"
                            : "border-pink-300 dark:border-brand-dark-border"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation Back */}
              <div className="pt-2 flex items-center justify-between border-t border-pink-100 dark:border-brand-dark-border">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="gap-1.5 text-xs border-pink-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Question</span>
                  </Button>
                ) : (
                  <div />
                )}

                <Link href="/custom-order" className="text-xs font-bold text-gray-400 hover:text-brand-primary">
                  Skip directly to order →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* RESULT SCREEN */
          results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 98% Compatibility Match Found!
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                  Your Signature Silhouette
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted">
                  Handcrafted specifically for your daily routine and hand proportions.
                </p>
              </div>

              <div className="rounded-4xl border border-brand-primary/40 bg-white dark:bg-brand-dark-surface p-6 sm:p-8 shadow-pink-lg dark:shadow-dark-card space-y-6 text-center sm:text-left">
                {/* Result Title Card */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-pink-100 dark:border-brand-dark-border">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-primary-light to-pink-100 dark:from-brand-primary/20 dark:to-brand-dark-card border-2 border-brand-primary/30 text-4xl shadow-pink-sm shrink-0">
                    {results.shapeInfo.icon}
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      {results.shapeInfo.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold bg-pink-100 dark:bg-pink-950/60 text-brand-primary px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {results.shapeInfo.name} · {results.length.replace("_", " ").toUpperCase()}
                    </h2>

                    <p className="text-xs font-bold text-brand-primary">
                      {results.shapeInfo.title}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-brand-dark-text leading-relaxed">
                  <p>{results.shapeInfo.desc}</p>
                </div>

                {/* Match Summary Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">
                      Recommended Shape
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                      {results.shape}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-brand-dark-card border border-pink-100 dark:border-brand-dark-border">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">
                      Recommended Length
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm capitalize">
                      {results.length.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={`/custom-order?shape=${results.shape}&length=${results.length}`}
                    className="w-full sm:flex-1"
                  >
                    <Button size="lg" className="w-full gap-2 shadow-pink-md">
                      <Sparkles className="w-4 h-4" />
                      <span>Design This Set Now ({results.shapeInfo.name})</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleRestart}
                    className="gap-2 w-full sm:w-auto border-pink-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
