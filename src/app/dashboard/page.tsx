"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Package,
  Ruler,
  Save,
  CheckCircle2,
  Calendar,
  HelpCircle,
  LogIn,
  LogOut,
  Lock,
  ShieldCheck,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomOrder, NailMeasurements, StandardSize, SizeData } from "@/types";
import {
  fetchUserOrders,
  getSavedMeasurements,
  saveMeasurementsLocally,
} from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";
import { HowToMeasureModal } from "@/components/custom-order/HowToMeasureModal";
import { NailConsultationChat } from "@/components/chat/NailConsultationChat";
import { useAuth } from "@/lib/supabase/auth-context";

export default function DashboardPage() {
  const { user, isLoading, signOut, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"orders" | "measurements">("orders");
  const [orders, setOrders] = React.useState<CustomOrder[]>([]);
  const [measurements, setMeasurements] = React.useState<NailMeasurements>({
    thumb: 16,
    index: 12,
    middle: 13,
    ring: 11,
    pinky: 9,
  });
  const [standardSize, setStandardSize] = React.useState<StandardSize>("M");
  const [sizingType, setSizingType] = React.useState<"custom" | "standard">("custom");
  const [isSavedNotice, setIsSavedNotice] = React.useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = React.useState(false);
  const [chatOrder, setChatOrder] = React.useState<CustomOrder | null>(null);

  React.useEffect(() => {
    if (!user?.email) return;

    async function loadData() {
      const userOrders = await fetchUserOrders(user?.email);
      setOrders(userOrders);

      // Load saved sizing for this specific user
      const saved = getSavedMeasurements(user?.email);
      if (saved) {
        setSizingType(saved.type);
        if (saved.measurements) setMeasurements(saved.measurements);
        if (saved.standardSize) setStandardSize(saved.standardSize);
      }
    }
    loadData();
  }, [user]);

  const handleSaveMeasurements = () => {
    if (!user?.email) return;
    const dataToSave: SizeData = {
      type: sizingType,
      standardSize: sizingType === "standard" ? standardSize : undefined,
      measurements: sizingType === "custom" ? measurements : undefined,
    };
    saveMeasurementsLocally(dataToSave, user.email);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleFingerChange = (finger: keyof NailMeasurements, val: string) => {
    const num = parseFloat(val) || 0;
    setMeasurements((prev) => ({
      ...prev,
      [finger]: num,
    }));
  };

  const fingers: Array<{ key: keyof NailMeasurements; label: string; short: string }> = [
    { key: "thumb", label: "Thumb", short: "T" },
    { key: "index", label: "Index", short: "I" },
    { key: "middle", label: "Middle", short: "M" },
    { key: "ring", label: "Ring", short: "R" },
    { key: "pinky", label: "Pinky", short: "P" },
  ];

  // 1. Loading Session Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg flex items-center justify-center p-6 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            Loading Your ShineDe Account...
          </p>
        </div>
      </div>
    );
  }

  // 2. Protected Screen: Must be Logged In to see orders and sizing history
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg py-16 px-4 sm:px-6 flex items-center justify-center transition-colors">
        <div className="max-w-md w-full rounded-4xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-7 sm:p-9 shadow-pink-md dark:shadow-dark-card text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary shadow-pink-sm">
            <Lock className="h-8 w-8" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-pink-100 dark:bg-pink-950/60 px-3 py-0.5 rounded-full mb-2 border border-pink-200 dark:border-pink-900/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Authentication Required
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              Log In to View Orders & Sizes
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted mt-2 leading-relaxed">
              Your custom press-on order history and millimeter sizing profile are strictly private. Please sign in to access your dashboard.
            </p>
          </div>

          {/* Feature Teasers */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-pink-50/70 dark:bg-brand-dark-card p-3.5 rounded-2xl border border-pink-100 dark:border-brand-dark-border">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="text-gray-800 dark:text-brand-dark-text font-medium">Orders & Status Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="text-gray-800 dark:text-brand-dark-text font-medium">Saved Millimeter Sizes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            {/* Google OAuth Login */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card py-3 px-4 text-xs sm:text-sm font-bold text-gray-800 dark:text-brand-dark-text hover:bg-pink-50 dark:hover:bg-brand-dark-surface hover:border-brand-primary transition-all shadow-sm active:scale-[0.99]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Link to Auth Page */}
            <Link href="/auth">
              <Button className="w-full gap-2 shadow-pink-md h-12">
                <LogIn className="w-4 h-4" />
                <span>Log In with Gmail Code or Password</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated User View
  const userEmail = user.email;
  const userName = user.fullName || (user.email ? user.email.split("@")[0] : "VIP Member");

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg py-8 px-4 sm:px-6 transition-colors">
      <div className="mx-auto max-w-5xl">
        {/* User Profile Header Card */}
        <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-xl font-bold font-serif text-white shadow-pink-sm shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20 px-2.5 py-0.5 rounded-full">
                  ShineDe VIP Member · Nepal 🇳🇵
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {userName}
              </h1>
              <p className="text-xs text-gray-500 dark:text-brand-dark-muted">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-pink-200 dark:border-brand-dark-border text-xs font-semibold text-gray-600 dark:text-brand-dark-muted hover:text-red-500 hover:border-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <Link href="/custom-order">
              <Button size="sm" className="gap-1.5 shadow-pink-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Custom Order</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-pink-200 dark:border-brand-dark-border pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "orders"
                ? "bg-brand-primary text-white shadow-pink-sm"
                : "bg-white dark:bg-brand-dark-surface text-gray-700 dark:text-brand-dark-text hover:text-brand-primary border border-pink-100 dark:border-brand-dark-border"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("measurements")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "measurements"
                ? "bg-brand-primary text-white shadow-pink-sm"
                : "bg-white dark:bg-brand-dark-surface text-gray-700 dark:text-brand-dark-text hover:text-brand-primary border border-pink-100 dark:border-brand-dark-border"
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Saved Sizing & Measurements</span>
          </button>
        </div>

        {/* TAB 1: Order History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-12 text-center shadow-card">
                <Package className="w-12 h-12 text-pink-300 dark:text-pink-800 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                  No Custom Orders Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-brand-dark-muted mt-1 max-w-sm mx-auto">
                  You haven&apos;t placed any custom press-on orders yet. Ready to design your handcrafted set?
                </p>
                <Link href="/custom-order" className="mt-5 inline-block">
                  <Button className="gap-2 shadow-pink-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Design Your First Custom Set</span>
                  </Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-5 sm:p-6 shadow-card dark:shadow-dark-card hover:shadow-pink-md dark:hover:border-brand-primary/50 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    {/* Inspo Thumbnail */}
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-50 dark:bg-brand-dark-card shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.image_url}
                        alt="Order inspiration"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-brand-primary">
                          {order.order_number}
                        </span>
                        <Badge status={order.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-brand-dark-text font-medium">
                        <span className="capitalize font-bold text-gray-900 dark:text-white">
                          {order.shape} ({order.length})
                        </span>
                        <span>•</span>
                        <span>
                          {order.sizing_type === "standard"
                            ? `Size ${order.size_data.standardSize}`
                            : "Custom mm Fit"}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{order.finish} Finish</span>
                      </div>

                      {order.notes && (
                        <p className="text-xs text-gray-500 dark:text-brand-dark-muted line-clamp-1 italic max-w-md">
                          &ldquo;{order.notes}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-brand-dark-muted pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Pipeline & Price */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-pink-100 dark:border-brand-dark-border gap-2">
                    <span className="text-xl font-bold font-serif text-gray-900 dark:text-white">
                      {formatCurrency(order.total_price)}
                    </span>

                    {/* Progress Track */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 dark:text-brand-dark-muted bg-pink-50 dark:bg-brand-dark-card px-3 py-1.5 rounded-full border border-pink-100 dark:border-brand-dark-border">
                      <span className={order.status === "Pending" ? "text-amber-500 font-extrabold" : "text-brand-primary"}>
                        ● Received
                      </span>
                      <span>→</span>
                      <span
                        className={
                          ["Designing", "Shipped", "Delivered"].includes(order.status)
                            ? "text-brand-primary font-extrabold"
                            : ""
                        }
                      >
                        ● Designing
                      </span>
                      <span>→</span>
                      <span
                        className={
                          ["Shipped", "Delivered"].includes(order.status)
                            ? "text-brand-primary font-extrabold"
                            : ""
                        }
                      >
                        ● Shipped
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setChatOrder(order)}
                      className="mt-2 text-xs gap-1.5 border-pink-200 hover:border-brand-primary text-brand-primary w-full sm:w-auto"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat with Nail Artist</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: Saved Sizing & Measurements Profile */}
        {activeTab === "measurements" && (
          <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-6 sm:p-8 shadow-card dark:shadow-dark-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100 dark:border-brand-dark-border">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Your Saved Nail Measurements
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted mt-0.5">
                  Save your measurements once. We will auto-fill them every time you place a new custom order!
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMeasureModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline self-start sm:self-auto"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Need sizing help?</span>
              </button>
            </div>

            {/* Sizing Preference Mode */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSizingType("custom")}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                  sizingType === "custom"
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:bg-pink-50 dark:hover:bg-brand-dark-card"
                }`}
              >
                Use Custom Millimeters (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setSizingType("standard")}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                  sizingType === "standard"
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                    : "border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:bg-pink-50 dark:hover:bg-brand-dark-card"
                }`}
              >
                Use Standard Size (XS-L)
              </button>
            </div>

            {sizingType === "custom" ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {fingers.map((f) => (
                  <div
                    key={f.key}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl border border-pink-100 dark:border-brand-dark-border bg-pink-50/50 dark:bg-brand-dark-card text-center"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white mb-2 shadow-sm">
                      {f.short}
                    </div>
                    <label className="text-xs font-bold text-gray-800 dark:text-brand-dark-text uppercase tracking-wider mb-1">
                      {f.label}
                    </label>
                    <div className="relative w-full">
                      <input
                        type="number"
                        step="0.5"
                        min="6"
                        max="24"
                        value={measurements[f.key] || ""}
                        onChange={(e) => handleFingerChange(f.key, e.target.value)}
                        className="w-full text-center rounded-xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface py-2 px-1 text-sm font-bold text-brand-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-inner"
                      />
                      <span className="text-[10px] text-gray-400 absolute right-2 top-2.5 pointer-events-none">
                        mm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["XS", "S", "M", "L"] as StandardSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setStandardSize(sz)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      standardSize === sz
                        ? "border-brand-primary bg-pink-50 dark:bg-brand-primary/20 text-brand-primary font-bold shadow-sm"
                        : "border-pink-200 dark:border-brand-dark-border text-gray-700 dark:text-brand-dark-text hover:border-brand-primary/40"
                    }`}
                  >
                    <span className="text-lg font-serif font-bold">Size {sz}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 flex items-center justify-between border-t border-pink-100 dark:border-brand-dark-border">
              <Button onClick={handleSaveMeasurements} className="gap-2 shadow-pink-sm">
                <Save className="w-4 h-4" />
                <span>Save Measurement Profile</span>
              </Button>

              {isSavedNotice && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Measurements Saved to Supabase!</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        <HowToMeasureModal
          isOpen={isMeasureModalOpen}
          onClose={() => setIsMeasureModalOpen(false)}
        />

        {/* Customer Consultation Chat Modal */}
        {chatOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-brand-dark-surface rounded-4xl max-w-xl w-full p-4 sm:p-6 border border-pink-200 dark:border-brand-dark-border shadow-pink-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-brand-dark-border">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                    Live Nail Artist Studio · Kathmandu
                  </span>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                    Order #{chatOrder.order_number}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOrder(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <NailConsultationChat
                orderId={chatOrder.id}
                orderNumber={chatOrder.order_number}
                customerName={chatOrder.customer_name}
                customerEmail={chatOrder.customer_email}
                shape={chatOrder.shape}
                length={chatOrder.length}
                inspoImage={chatOrder.image_url}
                currentUserRole="customer"
                currentUserName={user?.fullName || user?.email?.split("@")[0] || "Customer"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
