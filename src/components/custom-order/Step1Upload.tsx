"use client";

import * as React from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, X, Check, Camera } from "lucide-react";
import { uploadInspirationImage } from "@/lib/orders";
import { AIInspoPaletteExtractor } from "./AIInspoPaletteExtractor";
import { NailFinish } from "@/types";

interface Step1UploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  onSuggestedFinishChange?: (finish: NailFinish) => void;
  error?: string;
}

export function Step1Upload({
  imageUrl,
  onImageChange,
  onSuggestedFinishChange,
  error,
}: Step1UploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadInspirationImage(file);
      onImageChange(uploadedUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Step 1: Your Dream Design
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white">
          Upload Your Nail Inspiration
        </h2>
        <p className="text-sm text-gray-600 dark:text-brand-dark-muted mt-1">
          Screenshot from Pinterest, Instagram, or TikTok? Upload it here and our nail artists in Nepal will recreate it with premium salon gel.
        </p>
      </div>

      {/* Upload Dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      {imageUrl ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-brand-primary/40 bg-white dark:bg-brand-dark-card p-4 shadow-pink-md dark:shadow-dark-card animate-in fade-in duration-300">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-pink-50 dark:bg-brand-dark-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded nail inspiration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Inspiration Attached
              </span>
              <button
                type="button"
                onClick={() => onImageChange("")}
                className="flex items-center gap-1 rounded-full bg-red-600/80 backdrop-blur-md px-3 py-1 text-xs font-semibold hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Change Photo
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-brand-dark-muted px-1">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" /> Uploadcare CDN High-Res Ready
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-brand-primary font-bold hover:underline"
            >
              Upload another photo
            </button>
          </div>

          {/* AI Color Palette & Style Extractor */}
          <div className="mt-4">
            <AIInspoPaletteExtractor
              imageUrl={imageUrl}
              onApplySuggestedFinish={onSuggestedFinishChange}
            />
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white/80 dark:bg-brand-dark-card/80 hover:bg-white dark:hover:bg-brand-dark-card shadow-sm ${
            dragActive
              ? "border-brand-primary bg-brand-primary-light/40 dark:bg-brand-primary/20 scale-[1.01]"
              : "border-pink-300 dark:border-brand-dark-border hover:border-brand-primary hover:shadow-pink-md"
          } ${error ? "border-red-500 bg-red-50/20" : ""}`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
            {isUploading ? (
              <svg
                className="animate-spin h-7 w-7 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <UploadCloud className="h-8 w-8" />
            )}
          </div>

          <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">
            {isUploading ? "Uploading Your Inspiration..." : "Tap to Upload or Drag & Drop"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-brand-dark-muted max-w-xs">
            Upload any screenshot or photo from your camera roll (PNG, JPG, HEIC up to 15MB).
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border px-3 py-1 text-xs font-semibold text-brand-primary">
              <Camera className="w-3.5 h-3.5" /> Take Photo
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border px-3 py-1 text-xs font-semibold text-brand-primary">
              <ImageIcon className="w-3.5 h-3.5" /> Photo Library
            </span>
          </div>

          {error && (
            <p className="mt-3 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/50">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
