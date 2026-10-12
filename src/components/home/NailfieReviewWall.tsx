"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  CheckCircle2,
  Camera,
  Heart,
  Copy,
  Check,
  Upload,
  ArrowRight,
  Filter,
  Gift,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/ui/icons";

interface NailfieItem {
  id: string;
  name: string;
  location: string;
  handle: string;
  image: string;
  rating: number;
  shape: string;
  length: string;
  styleTag: "Almond" | "Coffin & Square" | "Aura & Chrome" | "Bridal & Events";
  comment: string;
  date: string;
  likes: number;
}

const INITIAL_NAILFIES: NailfieItem[] = [
  {
    id: "1",
    name: "Pooja S.",
    location: "Kathmandu",
    handle: "@pooja.glam",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Almond",
    length: "Medium",
    styleTag: "Aura & Chrome",
    comment: "Literally obsession! Nobody believed these were press-ons and thought I spent 4 hours at a salon in Durbar Marg. Lasted 3.5 weeks flawlessly!",
    date: "2 days ago",
    likes: 48,
  },
  {
    id: "2",
    name: "Aashna K.",
    location: "Lalitpur",
    handle: "@aashna_k",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Coffin",
    length: "Long",
    styleTag: "Coffin & Square",
    comment: "The custom millimeter sizing fit like magic! My nail beds are super petite (XS) and drugstore nails never fit. ShineDe is now my holy grail!",
    date: "4 days ago",
    likes: 35,
  },
  {
    id: "3",
    name: "Smriti T.",
    location: "Pokhara",
    handle: "@smriti.t",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Oval",
    length: "Short",
    styleTag: "Almond",
    comment: "Ordered Glazed Donut tips for my graduation in Pokhara. Delivery was within 48 hours and packaging came with a complete prep kit!",
    date: "1 week ago",
    likes: 62,
  },
  {
    id: "4",
    name: "Diya M.",
    location: "Bhaktapur",
    handle: "@diya_m",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Stiletto",
    length: "Long",
    styleTag: "Bridal & Events",
    comment: "The velvet cat-eye noir finish reflects light like pure diamonds. Reused them 3 times already and they still look brand new!",
    date: "1 week ago",
    likes: 29,
  },
  {
    id: "5",
    name: "Shristi B.",
    location: "Kathmandu",
    handle: "@shristi.b",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Almond",
    length: "Medium",
    styleTag: "Almond",
    comment: "Sent a Pinterest screenshot on WhatsApp and they recreated it 100% identically down to the pearl chrome accent. Artist is so talented!",
    date: "2 weeks ago",
    likes: 54,
  },
  {
    id: "6",
    name: "Anjali P.",
    location: "Thamel",
    handle: "@anjali.p",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80",
    rating: 5,
    shape: "Square",
    length: "Medium",
    styleTag: "Coffin & Square",
    comment: "Zero damage on removal! Soaked them in warm soapy water with baby oil and they slid right off. Real nails are completely healthy.",
    date: "2 weeks ago",
    likes: 41,
  },
];

export function NailfieReviewWall() {
  const [nailfies, setNailfies] = React.useState<NailfieItem[]>(INITIAL_NAILFIES);
  const [selectedTag, setSelectedTag] = React.useState<string>("All");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [likedMap, setLikedMap] = React.useState<Record<string, boolean>>({});

  // Form state for submit modal
  const [formName, setFormName] = React.useState("");
  const [formLocation, setFormLocation] = React.useState("Kathmandu");
  const [formHandle, setFormHandle] = React.useState("");
  const [formComment, setFormComment] = React.useState("");
  const [formImage, setFormImage] = React.useState("");
  const [formShape, setFormShape] = React.useState("Almond");
  const [formLength, setFormLength] = React.useState("Medium");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const filterTags = ["All", "Almond", "Coffin & Square", "Aura & Chrome", "Bridal & Events"];

  const filteredNailfies = React.useMemo(() => {
    if (selectedTag === "All") return nailfies;
    return nailfies.filter((n) => n.styleTag === selectedTag);
  }, [nailfies, selectedTag]);

  const handleLike = (id: string) => {
    setLikedMap((prev) => {
      const wasLiked = !!prev[id];
      const nextLiked = !wasLiked;
      setNailfies((items) =>
        items.map((item) =>
          item.id === id ? { ...item, likes: item.likes + (nextLiked ? 1 : -1) } : item
        )
      );
      return { ...prev, [id]: nextLiked };
    });
  };

  const handleNailfieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const newNailfie: NailfieItem = {
      id: Date.now().toString(),
      name: formName,
      location: formLocation || "Nepal",
      handle: formHandle.startsWith("@") ? formHandle : `@${formHandle || "beauty.lover"}`,
      image: formImage || "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80",
      rating: 5,
      shape: formShape,
      length: formLength,
      styleTag: formShape === "Almond" ? "Almond" : "Aura & Chrome",
      comment: formComment,
      date: "Just now",
      likes: 1,
    };

    setNailfies((prev) => [newNailfie, ...prev]);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#E93F66", "#FF6584", "#F472B6", "#FFD700"],
      });
    } catch {
      // Ignore
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("NAILFIE100");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <section className="py-16 sm:py-24 bg-white/50 dark:bg-brand-dark-surface/40 border-t border-pink-200/60 dark:border-brand-dark-border transition-colors relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-center md:text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
              <Camera className="w-3.5 h-3.5" /> Community Gallery · Nepal
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              The ShineDe Nailfie Wall
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-brand-dark-muted max-w-lg">
              Real client photos, genuine 5-star reviews, and handcrafted press-ons spotted in Kathmandu and across Nepal.
            </p>
          </div>

          {/* Incentive CTA Button */}
          <div className="self-center md:self-auto flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setIsSubmitModalOpen(true);
              }}
              className="gap-2 shadow-pink-md hover:scale-105 transition-all text-xs sm:text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Submit Nailfie (Get Rs. 100 OFF)</span>
            </Button>
          </div>
        </div>

        {/* Incentive Perk Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-4 rounded-3xl bg-gradient-to-r from-pink-100/80 via-pink-50 to-pink-100/80 dark:from-brand-dark-card dark:via-brand-dark-surface dark:to-brand-dark-card border border-pink-200 dark:border-brand-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Share your nail selfie & get Rs. 100 discount coupon!
              </p>
              <p className="text-[11px] text-gray-600 dark:text-brand-dark-muted">
                Tag <span className="font-bold text-brand-primary">@shine.denails</span> on Instagram or submit your photo directly below to unlock code <span className="font-mono font-bold text-brand-primary">NAILFIE100</span>.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setIsSubmitModalOpen(true);
            }}
            className="text-xs font-bold text-brand-primary hover:underline shrink-0 bg-white dark:bg-brand-dark-surface px-4 py-2 rounded-xl border border-pink-200 dark:border-brand-dark-border shadow-xs"
          >
            Claim Rs. 100 Coupon →
          </button>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {filterTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-brand-primary text-white shadow-pink-sm"
                  : "bg-white dark:bg-brand-dark-card border border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:border-brand-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid of Client Nailfies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNailfies.map((item, idx) => {
            const isLiked = likedMap[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="group rounded-3xl border border-pink-100 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card shadow-card dark:shadow-dark-card hover:shadow-pink-md transition-all flex flex-col overflow-hidden"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-square w-full overflow-hidden bg-pink-50 dark:bg-brand-dark-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${item.name} custom nails`}
                    className="h-full w-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />

                  {/* Top Left Verified Client Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-md text-[10px] font-bold text-gray-800 dark:text-white px-2.5 py-1 rounded-full border border-pink-200/80 dark:border-brand-dark-border shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-100" />
                    <span>Verified Client</span>
                  </div>

                  {/* Top Right Shape/Length Pill */}
                  <div className="absolute top-3 right-3 bg-brand-primary/90 text-white backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {item.shape} · {item.length}
                  </div>

                  {/* Instagram Tag Overlay */}
                  <a
                    href="https://instagram.com/shine.denails"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md hover:bg-black transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>{item.handle}</span>
                  </a>
                </div>

                {/* Content Body */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    {/* Stars and Client info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>

                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.date}
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-brand-dark-text leading-relaxed italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  </div>

                  {/* Footer with Client Name and Likes */}
                  <div className="pt-3 border-t border-pink-100 dark:border-brand-dark-border flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-xs text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-brand-dark-muted">
                        {item.location}, Nepal
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                        isLiked
                          ? "bg-pink-50 border-brand-primary text-brand-primary"
                          : "border-pink-200 dark:border-brand-dark-border text-gray-500 dark:text-brand-dark-muted hover:border-pink-300"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-brand-primary" : ""}`} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Submit Nailfie Modal */}
      <Dialog
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        className="max-w-md p-6 sm:p-7"
      >
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <form onSubmit={handleNailfieSubmit} className="space-y-4">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary-light text-brand-primary mb-2 shadow-pink-sm">
                  <Camera className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                  Post Your Nail Selfie
                </h3>
                <p className="text-xs text-gray-600 dark:text-brand-dark-muted mt-1">
                  Share your press-on look and receive an instant <strong>Rs. 100 promo code</strong> for your next custom set!
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                      City in Nepal
                    </label>
                    <input
                      type="text"
                      placeholder="Kathmandu"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      placeholder="@yourhandle"
                      value={formHandle}
                      onChange={(e) => setFormHandle(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                      Nail Shape
                    </label>
                    <select
                      value={formShape}
                      onChange={(e) => setFormShape(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                    >
                      <option value="Almond">Almond</option>
                      <option value="Coffin">Coffin</option>
                      <option value="Square">Square</option>
                      <option value="Stiletto">Stiletto</option>
                      <option value="Oval">Oval</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                      Length
                    </label>
                    <select
                      value={formLength}
                      onChange={(e) => setFormLength(e.target.value)}
                      className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                    >
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                      <option value="Extra Long">Extra Long</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                    Photo Image URL (or Pinterest/Instagram photo link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (leave blank to use sample photo)"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-brand-dark-text block mb-1">
                    Your Review & Experience
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell other nail lovers how long they lasted, how they fit, or what compliment you got!"
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-2.5 text-xs outline-none focus:border-brand-primary text-gray-800 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full shadow-pink-md gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Post Nailfie & Unlock Rs. 100 Coupon</span>
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Nailfie Posted Successfully!
              </span>

              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                Here is your Rs. 100 Discount Code!
              </h3>

              <p className="text-xs text-gray-600 dark:text-brand-dark-muted">
                Use this code in custom checkout to save Rs. 100 on your next handcrafted press-on set.
              </p>

              {/* Coupon Code Pill */}
              <div className="p-4 rounded-2xl bg-pink-50 dark:bg-brand-dark-card border border-brand-primary/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Promo Code</span>
                  <span className="font-mono text-xl font-bold text-brand-primary">
                    NAILFIE100
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="gap-1.5 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    window.location.href = "/custom-order";
                  }}
                  className="w-full shadow-pink-md gap-2"
                >
                  <span>Use Code on Custom Order</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </Dialog>
    </section>
  );
}
