"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  UploadCloud,
  Check,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Sparkle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NailDesign,
  fetchNailDesigns,
  createNailDesign,
  deleteNailDesign,
  updateNailDesign,
} from "@/lib/nail-designs";
import { uploadFileToUploadcare } from "@/lib/uploadcare";
import { formatCurrency } from "@/lib/utils";

export function AdminNailDesignsManager() {
  const [designs, setDesigns] = React.useState<NailDesign[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Form states
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState<number>(700);
  const [shape, setShape] = React.useState("Almond");
  const [length, setLength] = React.useState("Medium");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState("");

  // Edit price modal/state
  const [editingDesign, setEditingDesign] = React.useState<NailDesign | null>(null);
  const [editPriceInput, setEditPriceInput] = React.useState<number>(700);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadDesigns = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchNailDesigns();
      setDesigns(data);
    } catch (err) {
      console.warn("Failed to load nail designs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDesigns();
  }, [loadDesigns]);

  // Handle image file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setFormError("");

      // Instant local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);

      // Upload to Uploadcare CDN if configured
      const cdnUrl = await uploadFileToUploadcare(file);
      if (cdnUrl) {
        setImageUrl(cdnUrl);
        setImagePreview(cdnUrl);
      }
    } catch (err) {
      console.warn("Uploadcare error, using data url:", err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!title.trim()) {
      setFormError("Please enter a name/title for the nail design.");
      return;
    }

    if (!imageUrl.trim()) {
      setFormError("Please upload a picture of the nail or enter an image URL.");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 1) {
      setFormError("Please enter a valid price (minimum base price is Rs. 700).");
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createNailDesign({
        title: title.trim(),
        image: imageUrl.trim(),
        price: numericPrice,
        shape,
        length,
      });

      setDesigns((prev) => [created, ...prev]);
      setFormSuccess(`"${created.title}" published to customer page successfully.`);

      // Reset form
      setTitle("");
      setImageUrl("");
      setImagePreview("");
      setPrice(700);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => setFormSuccess(""), 4000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to publish nail design");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the customer page?`)) {
      return;
    }

    try {
      await deleteNailDesign(id);
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to delete design: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleSavePriceEdit = async () => {
    if (!editingDesign) return;
    try {
      const updated = await updateNailDesign({
        id: editingDesign.id,
        price: Number(editPriceInput) || 700,
      });
      setDesigns((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setEditingDesign(null);
    } catch (err) {
      alert("Failed to update price");
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 rounded-full">
            Customer Page Catalog
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Nail Pictures & Pricing Manager
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted">
            Insert pictures of nails and their prices. These show immediately in the customer homepage gallery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-pink-50 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border px-3 py-1.5 rounded-full text-brand-primary">
            Base Price: <strong>Rs. 700</strong>
          </span>
        </div>
      </div>

      {/* Insert Nail Design Form */}
      <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-5 sm:p-7 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 pb-3 border-b border-pink-100 dark:border-brand-dark-border">
          <Plus className="w-5 h-5 text-brand-primary" />
          <span>Insert New Nail Picture & Price</span>
        </h3>

        {formError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-300">
            <Check className="w-4 h-4 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleCreateDesign} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Upload & Preview */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-brand-dark-muted">
              Nail Photo
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-pink-200 dark:border-brand-dark-border hover:border-brand-primary dark:hover:border-brand-primary bg-pink-50/50 dark:bg-brand-dark-card flex flex-col items-center justify-center p-4 cursor-pointer transition-all overflow-hidden group"
            >
              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    Click to Change Photo
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary shadow-sm">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-gray-800 dark:text-white">
                    Click to Upload Nail Photo
                  </p>
                  <p className="text-[10px] text-gray-400">PNG, JPG, WEBP from your device</p>
                </div>
              )}

              {isUploadingImage && (
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Alternative: Image URL Input */}
            <div className="pt-1">
              <label className="text-[10px] text-gray-500 dark:text-brand-dark-muted block mb-1">
                Or paste direct Image URL:
              </label>
              <input
                type="url"
                value={imageUrl.startsWith("data:") ? "" : imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-800 dark:text-white outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Right Column: Title, Price, Shape, Length */}
          <div className="lg:col-span-7 space-y-4">
            <Input
              id="nail-title"
              label="Nail Set Title / Design Name"
              placeholder="e.g. Pink Aura Chrome French"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Price Input with NPR Currency indicator */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-brand-dark-muted mb-1.5">
                Set Price (Nepalese Rupees - NPR)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-brand-primary">
                  Rs.
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="700"
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary shadow-xs"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-brand-dark-muted mt-1">
                Base price starts at Rs. 700. Set whatever price you want for this design.
              </p>
            </div>

            {/* Shape and Length Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-brand-dark-muted mb-1.5">
                  Shape
                </label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="Almond">Almond</option>
                  <option value="Coffin">Coffin</option>
                  <option value="Square">Square</option>
                  <option value="Stiletto">Stiletto</option>
                  <option value="Oval">Oval</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-brand-dark-muted mb-1.5">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                  <option value="Extra Long">Extra Long</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-12 text-sm shadow-pink-md gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish to Customer Page</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Published Nail Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
            Currently Displayed on Customer Page ({designs.length})
          </h3>
          <span className="text-xs text-gray-500 dark:text-brand-dark-muted">
            Changes reflect live immediately
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading catalog...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-brand-dark-card text-brand-primary">
              <ImageIcon className="h-7 w-7" />
            </div>
            <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              No Nail Pictures Added Yet
            </h4>
            <p className="text-xs text-gray-500 dark:text-brand-dark-muted max-w-md mx-auto">
              You haven&apos;t added any nail designs to the customer page yet. Use the form above to upload pictures of your work and specify their prices!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {designs.map((design) => (
              <div
                key={design.id}
                className="group rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card overflow-hidden shadow-xs hover:shadow-pink-md transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square w-full bg-pink-50 dark:bg-brand-dark-surface overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.image}
                    alt={design.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      Rs. {design.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {design.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-brand-dark-muted">
                      <span>{design.shape || "Almond"}</span>
                      <span>•</span>
                      <span>{design.length || "Medium"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-pink-100 dark:border-brand-dark-border/60">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingDesign(design);
                        setEditPriceInput(design.price);
                      }}
                      className="flex-1 h-8 text-xs gap-1 border-pink-200"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Price</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(design.id, design.title)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Price Modal */}
      {editingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-dark-surface rounded-3xl p-6 max-w-sm w-full border border-pink-200 dark:border-brand-dark-border shadow-2xl space-y-4">
            <h4 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              Edit Price: {editingDesign.title}
            </h4>
            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-brand-dark-muted block mb-1">
                New Price (Rs.)
              </label>
              <input
                type="number"
                min="1"
                value={editPriceInput}
                onChange={(e) => setEditPriceInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-900 dark:text-white text-sm font-bold outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingDesign(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSavePriceEdit}
              >
                Save Price
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
