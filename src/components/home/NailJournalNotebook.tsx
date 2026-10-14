"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pin,
  Send,
  CheckCircle2,
  BookOpen,
  Scissors,
  Ruler,
  Star,
  Smile,
  ArrowRight,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

interface GuestbookNote {
  id: string;
  name: string;
  location: string;
  message: string;
  sticker: string;
  date: string;
  color: string;
  rotation: number;
}

const INITIAL_NOTES: GuestbookNote[] = [
  {
    id: "note-1",
    name: "Shreya T.",
    location: "Kathmandu",
    message: "The chrome almond set survived my entire cousin's 3-day wedding in Pokhara! 10/10 obsession 💅✨",
    sticker: "💖",
    date: "Yesterday",
    color: "bg-pink-100 border-pink-200 text-pink-950",
    rotation: -2,
  },
  {
    id: "note-2",
    name: "Aayusha K.",
    location: "Lalitpur",
    message: "Never sitting 3 hours in a salon again. Applied in 8 minutes before a dinner party and got 20 compliments!",
    sticker: "🌸",
    date: "3 days ago",
    color: "bg-amber-100 border-amber-200 text-amber-950",
    rotation: 2.5,
  },
  {
    id: "note-3",
    name: "Binita M.",
    location: "Baneshwor",
    message: "The sizing guide is so accurate! Short oval fits my small nail beds like a glove. Reused twice already 🎀",
    sticker: "🎀",
    date: "Last week",
    color: "bg-rose-100 border-rose-200 text-rose-950",
    rotation: -1.5,
  },
];

const TABS = [
  { id: 0, label: "01 • Studio Diary", short: "Diary", color: "bg-rose-200 text-rose-900 border-rose-300" },
  { id: 1, label: "02 • Inspo & Shapes", short: "Inspo", color: "bg-pink-200 text-pink-900 border-pink-300" },
  { id: 2, label: "03 • The Wear Bible", short: "Care", color: "bg-amber-200 text-amber-900 border-amber-300" },
  { id: 3, label: "04 • Client Love", short: "Reviews", color: "bg-purple-200 text-purple-900 border-purple-300" },
  { id: 4, label: "05 • Guestbook", short: "Guestbook", color: "bg-emerald-200 text-emerald-900 border-emerald-300" },
];

const STICKER_OPTIONS = ["💖", "💅", "✨", "🎀", "🌸", "🦋", "🧸", "💋"];

export function NailJournalNotebook() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [guestNotes, setGuestNotes] = React.useState<GuestbookNote[]>(INITIAL_NOTES);
  const [newNoteName, setNewNoteName] = React.useState("");
  const [newNoteLocation, setNewNoteLocation] = React.useState("");
  const [newNoteMessage, setNewNoteMessage] = React.useState("");
  const [selectedSticker, setSelectedSticker] = React.useState("💖");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [floatingStickers, setFloatingStickers] = React.useState<
    Array<{ id: number; emoji: string; x: number; y: number; rot: number }>
  >([]);

  // Load guestbook notes from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("shinede_notebook_guestbook");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGuestNotes(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Play soft paper flip sound effect via Web Audio API synthesizer
  const playPageTurnSound = React.useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      osc.type = "sine";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio might be blocked by user gesture policy
    }
  }, [soundEnabled]);

  const goToNextPage = () => {
    if (currentPage < TABS.length - 1) {
      playPageTurnSound();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      playPageTurnSound();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToTab = (index: number) => {
    if (index !== currentPage) {
      playPageTurnSound();
      setCurrentPage(index);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  // Drop sticker onto the guestbook page
  const handleDropSticker = (emoji: string) => {
    const newSticker = {
      id: Date.now(),
      emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      rot: (Math.random() - 0.5) * 35,
    };
    setFloatingStickers((prev) => [...prev.slice(-12), newSticker]);
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.8 },
      colors: ["#E93F66", "#F9A8D4", "#FDE047", "#A7F3D0"],
    });
  };

  // Handle submitting guestbook note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteName.trim() || !newNoteMessage.trim()) return;

    setIsSubmitting(true);
    const colorStyles = [
      "bg-pink-100 border-pink-200 text-pink-950",
      "bg-amber-100 border-amber-200 text-amber-950",
      "bg-rose-100 border-rose-200 text-rose-950",
      "bg-purple-100 border-purple-200 text-purple-950",
      "bg-emerald-100 border-emerald-200 text-emerald-950",
    ];

    const noteItem: GuestbookNote = {
      id: `note-${Date.now()}`,
      name: newNoteName.trim(),
      location: newNoteLocation.trim() || "Nepal",
      message: newNoteMessage.trim(),
      sticker: selectedSticker,
      date: "Just now",
      color: colorStyles[Math.floor(Math.random() * colorStyles.length)],
      rotation: (Math.random() - 0.5) * 6,
    };

    const updated = [noteItem, ...guestNotes];
    setGuestNotes(updated);
    try {
      localStorage.setItem("shinede_notebook_guestbook", JSON.stringify(updated.slice(0, 20)));
    } catch {
      // ignore
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ["#E93F66", "#F472B6", "#FDE047"],
    });

    setNewNoteName("");
    setNewNoteLocation("");
    setNewNoteMessage("");
    setIsSubmitting(false);
    setHasSubmitted(true);
    setTimeout(() => setHasSubmitted(false), 4000);
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-[#FAF6F2] dark:bg-[#150D14] transition-colors border-t border-pink-200/60 dark:border-brand-dark-border">
      {/* Background aesthetic decor & sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 notebook-grid-pattern" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-pink-200/40 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/50 text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Studio Diary</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            The Nail Artist&apos;s <span className="font-journal text-brand-primary text-4xl sm:text-5xl md:text-6xl not-italic ml-1">Notebook</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted font-sans leading-relaxed">
            Inspired by our personal junk journals in Kathmandu. Flip through our handwritten notes, secret sizing guide, client polaroids, and leave your own love note!
          </p>
        </div>

        {/* Notebook Planner Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Top Sticky Index Tabs (Tabs sticking out from the top of the binder) */}
          <div className="flex items-end justify-center sm:justify-start gap-1 sm:gap-2 px-2 sm:px-12 -mb-1 relative z-20 overflow-x-auto no-scrollbar">
            {TABS.map((tab, idx) => {
              const isActive = currentPage === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => goToTab(idx)}
                  className={`relative group px-3 sm:px-5 py-2 sm:py-2.5 rounded-t-xl text-xs sm:text-sm font-bold font-journal tracking-wide border-t border-x transition-all duration-200 select-none shadow-xs flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? `${tab.color} -translate-y-1.5 shadow-md z-30 font-extrabold scale-102`
                      : "bg-[#F5ECE5] dark:bg-[#251822] text-gray-600 dark:text-gray-300 border-[#E5D7CE] dark:border-[#3D2536] hover:-translate-y-0.5 hover:text-brand-primary"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="inline sm:hidden">{tab.short}</span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-ribbon"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-brand-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* Sound Toggle Button */}
            <div className="ml-auto hidden md:flex items-center gap-1 pb-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute paper flip sound" : "Enable paper flip sound"}
                className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-brand-dark-card/80 px-2.5 py-1 rounded-full border border-pink-200 dark:border-brand-dark-border hover:text-brand-primary transition-colors shadow-xs"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3 text-brand-primary" />
                    <span>Flip Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* The Book Body with Open Leather Cover, Paper Pages & Metallic Rings Spine */}
          <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-4 bg-gradient-to-b from-[#2B1B17] via-[#211411] to-[#1A0F0D] border-4 border-[#3D2822] dark:border-[#1E1119]">
            {/* Leather texture stitch overlay */}
            <div className="absolute inset-2 sm:inset-3 border border-dashed border-[#5A3E36] pointer-events-none rounded-xl sm:rounded-2xl" />

            {/* Notebook Ring Binder Cover Image if available */}
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] dark:bg-[#1E141D] min-h-[580px] sm:min-h-[640px] md:min-h-[680px] shadow-inner flex flex-col justify-between">
              
              {/* Central Metallic 6-Ring Binder Spine (Desktop & Tablet) */}
              <div
                className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-10 lg:w-12 h-full"
                style={{
                  backgroundImage: "url('/notebook/spine.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
                }}
              />

              {/* Mobile center binder line */}
              <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-pink-200 dark:bg-pink-900/40 pointer-events-none z-30" />

              {/* Pages Content Area with Page Turn Animation */}
              <div className="relative z-10 flex-1 p-3 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, rotateY: 4, scale: 0.985 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: -4, scale: 0.985 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    {/* SPREAD 0: Studio Diary */}
                    {currentPage === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 h-full">
                        {/* Left Page */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between notebook-lined-pattern">
                          {/* Vintage Washi Tape in corner */}
                          <div className="absolute -top-3 left-6 w-24 h-6 bg-pink-300/60 dark:bg-pink-700/40 backdrop-blur-xs -rotate-2 border-y border-pink-400/40 shadow-xs pointer-events-none" />

                          {/* Nepal Post Stamp */}
                          <div className="absolute top-3 right-3 sm:right-6 border-2 border-dashed border-rose-300 dark:border-rose-700/60 rounded px-2 py-1 text-center rotate-3 pointer-events-none">
                            <span className="block text-[9px] font-bold tracking-widest text-rose-500 uppercase font-sans">
                              Kathmandu
                            </span>
                            <span className="block text-[8px] text-gray-500 font-sans">Studio #01</span>
                          </div>

                          <div className="space-y-4 pt-4">
                            <div className="text-xs font-sans text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">
                              Entry 01 • The Beginning
                            </div>
                            <h3 className="font-journal text-2xl sm:text-3xl font-bold text-gray-900 dark:text-pink-100 leading-snug">
                              Dear Nail Babe, <br />
                              Welcome to our little craft room! 🌸
                            </h3>

                            <p className="font-handwriting text-lg sm:text-xl text-gray-700 dark:text-pink-100/90 leading-relaxed">
                              I founded ShineDe Nails right here in Kathmandu because I was so exhausted from 4-hour salon visits, painful drills, and chipped acrylics that wrecked my natural nails.
                            </p>

                            <p className="font-handwriting text-lg sm:text-xl text-gray-700 dark:text-pink-100/90 leading-relaxed">
                              Every set in this scrapbook is handcrafted with 5 layers of salon-grade builder gel. They look like a million bucks, pop on in 10 minutes, and can be reused up to 5 times.
                            </p>

                            <p className="font-handwriting text-xl text-brand-primary font-bold">
                              PRESS. SLAY. REPEAT. ✨
                            </p>
                          </div>

                          <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                            <div className="font-journal text-base sm:text-lg text-gray-800 dark:text-pink-200">
                              — Shristi &amp; the ShineDe Artists 💌
                            </div>
                            <div className="text-xl">💅</div>
                          </div>
                        </div>

                        {/* Right Page */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col items-center justify-center">
                          {/* Washi Tape on top */}
                          <div className="absolute -top-3 right-10 w-28 h-6 bg-amber-200/70 dark:bg-amber-800/40 backdrop-blur-xs rotate-3 border-y border-amber-400/40 shadow-xs pointer-events-none" />

                          {/* Polaroid Photo */}
                          <motion.div
                            whileHover={{ rotate: 0, scale: 1.03 }}
                            className="bg-white p-3 pb-8 rounded-sm shadow-xl border border-gray-200 max-w-[280px] sm:max-w-[320px] -rotate-2 transition-transform duration-300"
                          >
                            <div className="relative aspect-square w-full overflow-hidden bg-pink-100 rounded-xs mb-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80"
                                alt="Studio Handcrafting Session"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                                Kathmandu Studio 🌙
                              </div>
                            </div>
                            <div className="text-center font-handwriting text-xl text-gray-800">
                              Midnight Chrome Sculpting ✨
                            </div>
                          </motion.div>

                          {/* Sticky Note Snippet */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mt-6 bg-yellow-100 dark:bg-yellow-950/70 border border-yellow-300 dark:border-yellow-700/60 p-3.5 rounded-lg shadow-md max-w-xs rotate-1 text-center"
                          >
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-yellow-900 dark:text-yellow-200 uppercase tracking-wide">
                              <Pin className="w-3.5 h-3.5 text-brand-primary" />
                              <span>Artist Guarantee</span>
                            </div>
                            <p className="mt-1 font-handwriting text-base sm:text-lg text-yellow-950 dark:text-yellow-100">
                              &ldquo;We never use cheap plastic printed tips. Real gel polish, hand-painted details, 100% reusable.&rdquo;
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* SPREAD 1: Inspo & Shapes */}
                    {currentPage === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 h-full">
                        {/* Left Page: Silhouette Swatch Guide */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between notebook-grid-pattern">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">
                                Page 02 • Silhouette Studio
                              </span>
                              <Scissors className="w-4 h-4 text-brand-primary" />
                            </div>

                            <h3 className="font-journal text-2xl sm:text-3xl font-bold text-gray-900 dark:text-pink-100">
                              Pick Your Dream Shape 💅
                            </h3>
                            <p className="font-handwriting text-lg text-gray-700 dark:text-pink-200">
                              Every set can be sculpted in your ideal silhouette &amp; length:
                            </p>

                            <div className="space-y-2 pt-1 font-sans">
                              {[
                                { shape: "Almond", desc: "Elongates fingers, feminine, #1 bridal pick", tag: "Most Loved" },
                                { shape: "Short Oval", desc: "Easy for typing, college, keyboard work", tag: "Everyday" },
                                { shape: "Coffin", desc: "Trendy, bold Y2K edge, statement silhouette", tag: "Edgy" },
                                { shape: "Square", desc: "Crisp 90s French tip aesthetic", tag: "Classic" },
                                { shape: "Stiletto", desc: "Ultra-dramatic, head-turning glam", tag: "Glam" },
                              ].map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white/80 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-gray-900 dark:text-white mr-1.5">{item.shape}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{item.desc}</span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-brand-primary/20 text-brand-primary text-[10px] font-bold">
                                    {item.tag}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-pink-100 dark:border-pink-900/40 font-handwriting text-base text-gray-600 dark:text-pink-300">
                            💡 Tip: If you have small or curved nail beds, Short Almond is magic!
                          </div>
                        </div>

                        {/* Right Page: Visual Polaroids with Washi Tape */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between">
                          <div className="text-center mb-2">
                            <span className="font-journal text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                              Trending Studio Swatches ✨
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:gap-4 my-auto">
                            {/* Polaroid 1 */}
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 0 }}
                              className="bg-white p-2 sm:p-2.5 pb-5 rounded shadow-lg border border-gray-200 -rotate-3 text-center"
                            >
                              <div className="relative aspect-square w-full overflow-hidden bg-pink-50 rounded-xs mb-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80"
                                  alt="Glazed Donut Inspo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-handwriting text-sm sm:text-base font-bold text-gray-800">
                                Glazed Aura Almond
                              </span>
                            </motion.div>

                            {/* Polaroid 2 */}
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 0 }}
                              className="bg-white p-2 sm:p-2.5 pb-5 rounded shadow-lg border border-gray-200 rotate-3 text-center"
                            >
                              <div className="relative aspect-square w-full overflow-hidden bg-pink-50 rounded-xs mb-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80"
                                  alt="Cyber Chrome Inspo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-handwriting text-sm sm:text-base font-bold text-gray-800">
                                Silver Chrome Stiletto
                              </span>
                            </motion.div>
                          </div>

                          {/* CTA to custom order */}
                          <div className="text-center pt-3">
                            <Link
                              href="/custom-order"
                              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-primary text-white text-xs sm:text-sm font-bold shadow-pink-md hover:bg-brand-primary-hover transition-transform hover:scale-105"
                            >
                              <span>Customize Your Dream Set (From Rs. 700)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SPREAD 2: The Wear Bible & Sizing Secrets */}
                    {currentPage === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 h-full">
                        {/* Left Page: 4 Steps to 3+ Weeks */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between notebook-lined-pattern">
                          <div className="space-y-4">
                            <span className="text-xs font-sans text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">
                              Page 03 • Application Secret
                            </span>
                            <h3 className="font-journal text-2xl sm:text-3xl font-bold text-gray-900 dark:text-pink-100">
                              4 Steps to 3+ Weeks of Wear ⏱️
                            </h3>

                            <div className="space-y-3 font-handwriting text-lg sm:text-xl text-gray-800 dark:text-pink-100/90 pt-1">
                              <div className="flex items-start gap-2.5">
                                <span className="font-bold text-brand-primary text-xl">1.</span>
                                <div>
                                  <strong>Push Cuticles &amp; Buff:</strong> Use the wooden stick to push cuticles, then lightly buff natural shine away so glue grips tight.
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <span className="font-bold text-brand-primary text-xl">2.</span>
                                <div>
                                  <strong>Alcohol Cleanse:</strong> Wipe each nail thoroughly with the included alcohol pad to strip natural skin oils.
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <span className="font-bold text-brand-primary text-xl">3.</span>
                                <div>
                                  <strong>45° Angle Placement:</strong> Slide the press-on base right under cuticle at 45 degrees to avoid air bubbles.
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <span className="font-bold text-brand-primary text-xl">4.</span>
                                <div>
                                  <strong>30s Pressure:</strong> Press firmly for a full 30 seconds. Done!
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-pink-100/80 dark:bg-pink-950/60 rounded-lg border border-pink-200 dark:border-pink-800 text-xs text-brand-primary font-bold">
                            ⚠️ Golden Rule: Avoid hot showers and washing dishes for 2 hours post-application!
                          </div>
                        </div>

                        {/* Right Page: Millimeter Sizing Cheat Sheet */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-journal text-2xl font-bold text-gray-900 dark:text-white">
                                Sizing Cheat Sheet 📏
                              </span>
                              <Ruler className="w-5 h-5 text-brand-primary" />
                            </div>
                            <p className="font-sans text-xs text-gray-600 dark:text-gray-300">
                              Measure with clear tape across the widest part of your natural nail bed (in millimeters):
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                              <div className="p-2.5 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30">
                                <div className="font-bold text-brand-primary">Size XS (Petite)</div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">14 · 11 · 12 · 10 · 8 mm</div>
                              </div>
                              <div className="p-2.5 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30">
                                <div className="font-bold text-brand-primary">Size S (Small)</div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">15 · 12 · 13 · 11 · 8 mm</div>
                              </div>
                              <div className="p-2.5 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30">
                                <div className="font-bold text-brand-primary">Size M (Regular)</div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">16 · 12 · 13 · 11 · 9 mm</div>
                              </div>
                              <div className="p-2.5 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30">
                                <div className="font-bold text-brand-primary">Size L (Wide)</div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">18 · 13 · 14 · 12 · 10 mm</div>
                              </div>
                            </div>

                            {/* Custom Sizing Callout */}
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs">
                              <span className="font-bold text-amber-900 dark:text-amber-200">Have unique sizes?</span>
                              <p className="text-amber-800/80 dark:text-amber-300 mt-0.5">
                                No worries! In our order form you can type your exact 5-finger millimeters for a 100% custom fit.
                              </p>
                            </div>
                          </div>

                          <div className="text-center pt-3">
                            <Link
                              href="/how-to-measure"
                              className="text-xs font-bold text-brand-primary hover:underline inline-flex items-center gap-1.5"
                            >
                              <span>Read Full 2-Minute Measuring Guide</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SPREAD 3: Client Love & Nailfies */}
                    {currentPage === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 h-full">
                        {/* Left Page: Customer Love Letter */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between notebook-lined-pattern">
                          <div className="space-y-4">
                            <span className="text-xs font-sans text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">
                              Page 04 • Real Babes of ShineDe
                            </span>
                            <div className="flex items-center gap-1 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400" />
                              ))}
                            </div>

                            <h3 className="font-journal text-2xl sm:text-3xl font-bold text-gray-900 dark:text-pink-100">
                              &ldquo;Survived a 4-Day Wedding in Pokhara!&rdquo; 💍
                            </h3>

                            <p className="font-handwriting text-xl text-gray-800 dark:text-pink-100/90 leading-relaxed">
                              &ldquo;I was genuinely terrified they would pop off during mehendi and dancing, but they stayed glued solid through water, luggage, and endless photos. Everyone thought I went to a high-end salon in Kathmandu. I am officially converted!&rdquo;
                            </p>
                          </div>

                          <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-sm text-gray-900 dark:text-white">Pooja Sharma</div>
                              <div className="text-xs text-gray-500">Kathmandu, Nepal • Almond Chrome Set</div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Verified Order
                            </span>
                          </div>
                        </div>

                        {/* Right Page: Polaroid & Rating Badge */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col items-center justify-between">
                          <motion.div
                            whileHover={{ rotate: 0, scale: 1.03 }}
                            className="bg-white p-3 pb-6 rounded shadow-xl border border-gray-200 rotate-2 max-w-[260px] sm:max-w-[280px]"
                          >
                            <div className="relative aspect-square w-full overflow-hidden bg-pink-100 rounded-xs mb-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"
                                alt="Client Nailfie"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-center font-handwriting text-lg text-gray-800">
                              @pooja.glam wearing Custom Aura ✨
                            </div>
                          </motion.div>

                          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 rounded-xl text-center w-full max-w-sm mt-3">
                            <div className="font-journal text-lg font-bold text-brand-primary">
                              98.6% Five-Star Rating in Nepal
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                              Over 500+ handcrafted custom sets delivered across Kathmandu, Pokhara, Chitwan, &amp; Butwal.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SPREAD 4: Interactive Guestbook & Sticker Board */}
                    {currentPage === 4 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 h-full">
                        {/* Left Page: Leave a Note Form */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between notebook-lined-pattern">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-sans text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">
                                Page 05 • Scrapbook Guestbook
                              </span>
                              <Heart className="w-4 h-4 text-brand-primary fill-brand-primary" />
                            </div>

                            <h3 className="font-journal text-2xl sm:text-3xl font-bold text-gray-900 dark:text-pink-100">
                              Leave Your Love Note! 💌
                            </h3>
                            <p className="font-handwriting text-base sm:text-lg text-gray-600 dark:text-pink-200 mt-1">
                              Write a sweet message, review, or your dream nail design to pin on our studio wall!
                            </p>

                            <form onSubmit={handleAddNote} className="space-y-3 mt-3">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Your name / handle"
                                  value={newNoteName}
                                  onChange={(e) => setNewNoteName(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface focus:outline-none focus:border-brand-primary"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="City (e.g. Kathmandu)"
                                  value={newNoteLocation}
                                  onChange={(e) => setNewNoteLocation(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface focus:outline-none focus:border-brand-primary"
                                />
                              </div>

                              <textarea
                                placeholder="Write your love note or nail dream here..."
                                rows={3}
                                value={newNoteMessage}
                                onChange={(e) => setNewNoteMessage(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface focus:outline-none focus:border-brand-primary resize-none font-sans"
                                required
                              />

                              {/* Pick a Sticker */}
                              <div>
                                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block mb-1">
                                  Pick your seal sticker:
                                </span>
                                <div className="flex gap-1.5 flex-wrap">
                                  {STICKER_OPTIONS.map((stk) => (
                                    <button
                                      type="button"
                                      key={stk}
                                      onClick={() => setSelectedSticker(stk)}
                                      className={`w-7 h-7 rounded-full text-sm flex items-center justify-center transition-transform ${
                                        selectedSticker === stk
                                          ? "scale-125 bg-pink-200 dark:bg-pink-900 border border-brand-primary shadow-xs"
                                          : "hover:scale-110 bg-white dark:bg-brand-dark-surface"
                                      }`}
                                    >
                                      {stk}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 px-4 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-1.5 shadow-pink-md disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Pin Note to Scrapbook Wall</span>
                              </button>
                              {hasSubmitted && (
                                <p className="text-center text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Pinned to our studio guestbook!</span>
                                </p>
                              )}
                            </form>
                          </div>

                          {/* Quick Interactive Sticker Dropper */}
                          <div className="pt-3 border-t border-pink-100 dark:border-pink-900/40">
                            <span className="text-[11px] font-sans text-gray-500 dark:text-gray-400 block mb-1.5">
                              Or click to drop interactive stickers on the board:
                            </span>
                            <div className="flex items-center gap-2">
                              {["💖", "💅", "✨", "🎀", "🌸"].map((emoji) => (
                                <button
                                  type="button"
                                  key={emoji}
                                  onClick={() => handleDropSticker(emoji)}
                                  className="px-2 py-1 bg-white/80 dark:bg-pink-950/60 hover:bg-pink-100 rounded-full border border-pink-200 text-xs shadow-xs hover:scale-125 transition-transform"
                                >
                                  {emoji} Stick
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Page: Pinned Scrapbook Notes Board */}
                        <div className="relative p-4 sm:p-6 rounded-xl bg-white/70 dark:bg-[#251822]/80 border border-amber-100 dark:border-pink-900/30 shadow-xs flex flex-col justify-between overflow-hidden">
                          {/* Board Heading */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-journal text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              <Pin className="w-4 h-4 text-brand-primary" />
                              <span>Kathmandu Studio Board</span>
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {guestNotes.length} Love Notes
                            </span>
                          </div>

                          {/* Interactive Floating Stickers dropped by user */}
                          {floatingStickers.map((stk) => (
                            <motion.div
                              key={stk.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute z-20 text-2xl select-none pointer-events-none drop-shadow-md"
                              style={{
                                left: `${stk.x}%`,
                                top: `${stk.y}%`,
                                transform: `rotate(${stk.rot}deg)`,
                              }}
                            >
                              {stk.emoji}
                            </motion.div>
                          ))}

                          {/* Scrollable Pinned Notes Stack */}
                          <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1.5 no-scrollbar">
                            {guestNotes.map((note) => (
                              <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`relative p-3 rounded-lg border shadow-xs transition-transform hover:scale-102 hover:z-20 ${note.color}`}
                                style={{ transform: `rotate(${note.rotation}deg)` }}
                              >
                                {/* Tape effect */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-pink-300/40 backdrop-blur-xs border-y border-pink-400/30" />

                                <div className="flex items-center justify-between mb-1 pt-1">
                                  <div className="flex items-center gap-1">
                                    <span className="font-bold text-xs">{note.name}</span>
                                    <span className="text-[10px] opacity-70">({note.location})</span>
                                  </div>
                                  <span className="text-sm">{note.sticker}</span>
                                </div>
                                <p className="font-handwriting text-base sm:text-lg leading-snug">
                                  &ldquo;{note.message}&rdquo;
                                </p>
                                <div className="text-[9px] opacity-60 text-right mt-1 font-mono">
                                  {note.date}
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <div className="pt-2 text-center text-[10px] text-gray-500 font-sans">
                            ✨ Notes stored locally on your device for our Kathmandu guestbook.
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Navigation Bar inside the book */}
              <div className="relative z-20 px-4 sm:px-8 py-3 bg-[#EDE3DA]/80 dark:bg-[#1A0E18]/80 backdrop-blur-xs border-t border-[#DFD1C5] dark:border-[#2D1627] flex items-center justify-between">
                {/* Prev Page Button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-journal font-bold text-gray-700 dark:text-gray-300 hover:text-brand-primary disabled:opacity-30 disabled:pointer-events-none transition-transform hover:-translate-x-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/notebook/nav.png"
                    alt="Previous"
                    className="w-6 h-3 sm:w-8 sm:h-4 transition-transform group-hover:scale-115"
                  />
                  <span>Previous Page</span>
                </button>

                {/* Page dots indicator */}
                <div className="flex items-center gap-1.5">
                  {TABS.map((tab, idx) => (
                    <button
                      key={tab.id}
                      onClick={() => goToTab(idx)}
                      title={tab.label}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPage === idx
                          ? "w-6 bg-brand-primary"
                          : "w-2 bg-gray-300 dark:bg-gray-700 hover:bg-pink-300"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 ml-2">
                    {currentPage + 1} / {TABS.length}
                  </span>
                </div>

                {/* Next Page Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === TABS.length - 1}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-journal font-bold text-gray-700 dark:text-gray-300 hover:text-brand-primary disabled:opacity-30 disabled:pointer-events-none transition-transform hover:translate-x-1"
                >
                  <span>Next Page</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/notebook/nav.png"
                    alt="Next"
                    className="w-6 h-3 sm:w-8 sm:h-4 scale-x-[-1] transition-transform group-hover:scale-115"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
