"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  BarChart3,
  Package,
  MessageCircle,
  Users,
  LogOut,
  ExternalLink,
  RefreshCw,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminAnalyticsChart } from "@/components/admin/AdminAnalyticsChart";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { NailConsultationChat } from "@/components/chat/NailConsultationChat";
import { CustomOrder, OrderStatus, UserProfile } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [activeTab, setActiveTab] = React.useState<"analytics" | "orders" | "chat" | "users">("analytics");
  const [orders, setOrders] = React.useState<CustomOrder[]>([]);
  const [profiles, setProfiles] = React.useState<Array<UserProfile & { _count?: { customOrders?: number } }>>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [selectedChatOrder, setSelectedChatOrder] = React.useState<CustomOrder | null>(null);

  // Check admin session on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("shinede_admin_session");
      const cookieMatches = document.cookie.includes("shinede_admin_session=authenticated");
      if (stored === "authenticated" || cookieMatches) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch all orders and users once authenticated
  const loadAdminData = React.useCallback(async () => {
    try {
      setIsLoadingData(true);

      // 1. Fetch all orders
      const ordersRes = await fetch("/api/orders");
      const ordersJson = await ordersRes.json();
      if (ordersJson.success && Array.isArray(ordersJson.data)) {
        const mappedOrders: CustomOrder[] = ordersJson.data.map((o: any) => ({
          id: o.id,
          order_number: o.orderNumber || o.order_number,
          user_id: o.userId || o.user_id,
          customer_name: o.customerName || o.customer_name || "Guest Client",
          customer_email: o.customerEmail || o.customer_email || "customer@example.com",
          customer_phone: o.customerPhone || o.customer_phone,
          image_url: o.imageUrl || o.image_url,
          shape: o.shape,
          length: o.length,
          finish: o.finish,
          sizing_type: o.sizingType || o.sizing_type,
          size_data: o.sizeData || o.size_data,
          notes: o.notes,
          status: o.status,
          total_price: Number(o.totalPrice || o.total_price || 1499),
          payment_status: o.paymentStatus || o.payment_status || "paid",
          created_at: o.createdAt || o.created_at || new Date().toISOString(),
        }));
        setOrders(mappedOrders);
        if (mappedOrders.length > 0 && !selectedChatOrder) {
          setSelectedChatOrder(mappedOrders[0]);
        }
      }

      // 2. Fetch all user profiles
      const usersRes = await fetch("/api/profile");
      const usersJson = await usersRes.json();
      if (usersJson.success && Array.isArray(usersJson.data)) {
        const mappedProfiles = usersJson.data.map((p: any) => ({
          id: p.id,
          email: p.email,
          full_name: p.fullName || p.full_name,
          phone: p.phone,
          saved_measurements: p.savedMeasurements || p.saved_measurements,
          created_at: p.createdAt || p.created_at,
          _count: p._count,
        }));
        setProfiles(mappedProfiles);
      }
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedChatOrder]);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, loadAdminData]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("shinede_admin_session");
      document.cookie = "shinede_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
  };

  const handleUpdateStatus = async (orderId: string, orderNumber: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 1. Loading Skeleton
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            Connecting to ShineDe Studio...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Show Admin Login
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 3. Authenticated Admin Portal
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg subtle-sparkle-bg flex flex-col transition-colors pb-16">
      {/* Top Admin Studio Header */}
      <header className="sticky top-0 z-40 w-full border-b border-pink-200/80 dark:border-brand-dark-border bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo & Studio Identifier */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-brand-primary/40 shadow-sm flex items-center justify-center bg-white">
                <Image
                  src="/logo.jpeg"
                  alt="ShineDe Nails Logo"
                  width={36}
                  height={36}
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold text-brand-primary">
                    ShineDe Nails
                  </span>
                  <span className="text-[10px] font-bold bg-brand-primary text-white px-2 py-0.5 rounded-full">
                    Artist Portal
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                  PRESS. SLAY. REPEAT. · 🇳🇵 Kathmandu
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={loadAdminData}
              title="Refresh Live Data"
              className="p-2 rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin text-brand-primary" : ""}`} />
            </button>

            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 h-9 text-xs border-pink-200">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Customer Site</span>
              </Button>
            </Link>

            <Button
              variant="white"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 h-9 text-xs border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-pink-100 dark:border-brand-dark-border/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "analytics"
                  ? "bg-brand-primary text-white shadow-pink-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Earnings & Growth</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "orders"
                  ? "bg-brand-primary text-white shadow-pink-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Custom Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "chat"
                  ? "bg-brand-primary text-white shadow-pink-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultation Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === "users"
                  ? "bg-brand-primary text-white shadow-pink-sm"
                  : "text-gray-600 dark:text-brand-dark-muted hover:text-brand-primary"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clients & Sizing ({profiles.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 flex-1 w-full">
        {/* TAB 1: Analytics & Early/Earnings Chart */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Studio Revenue & Production Analytics
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-brand-dark-muted">
                  Interactive sales breakdown for custom press-on sets in Kathmandu, Nepal
                </p>
              </div>

              <span className="self-start sm:self-auto text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200">
                ● Live Database Feed
              </span>
            </div>

            <AdminAnalyticsChart orders={orders} />
          </div>
        )}

        {/* TAB 2: Orders Table */}
        {activeTab === "orders" && (
          <AdminOrdersTable
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onOpenChat={(order) => {
              setSelectedChatOrder(order);
              setActiveTab("chat");
            }}
          />
        )}

        {/* TAB 3: Client Nail Consultation Chat */}
        {activeTab === "chat" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Client Design Consultations
              </h2>
              <p className="text-xs text-gray-500 dark:text-brand-dark-muted">
                Direct two-way messaging with customers to discuss nail shape, length, rhinestones, and custom millimeter fit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Order Selector List */}
              <div className="lg:col-span-4 rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface p-4 shadow-sm h-[520px] overflow-y-auto space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 block mb-2">
                  Active Custom Orders ({orders.length})
                </span>

                {orders.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-400">
                    No orders to chat with yet.
                  </div>
                ) : (
                  orders.map((order) => {
                    const isSelected = selectedChatOrder?.id === order.id;

                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => setSelectedChatOrder(order)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? "bg-pink-100/70 dark:bg-pink-950/60 border-brand-primary shadow-xs"
                            : "bg-pink-50/40 dark:bg-brand-dark-card border-pink-100 dark:border-brand-dark-border hover:border-pink-300"
                        }`}
                      >
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-pink-200 shrink-0 bg-pink-100">
                          {order.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={order.image_url}
                              alt="Inspo"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                              Nails
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
                              {order.customer_name}
                            </span>
                            <span className="text-[10px] font-mono text-brand-primary">
                              {order.order_number}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-brand-dark-muted truncate capitalize">
                            {order.shape} · {order.length} · {order.status}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: Chat Window */}
              <div className="lg:col-span-8">
                {selectedChatOrder ? (
                  <NailConsultationChat
                    orderId={selectedChatOrder.id}
                    orderNumber={selectedChatOrder.order_number}
                    customerName={selectedChatOrder.customer_name}
                    customerEmail={selectedChatOrder.customer_email}
                    shape={selectedChatOrder.shape}
                    length={selectedChatOrder.length}
                    inspoImage={selectedChatOrder.image_url}
                    currentUserRole="admin"
                    currentUserName="ShineDe Nail Artist"
                  />
                ) : (
                  <div className="h-[520px] rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface flex items-center justify-center text-center p-6 text-gray-400">
                    <div>
                      <MessageCircle className="w-12 h-12 text-pink-300 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        Select an order to open consultation chat
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Users & Sizing Profiles */}
        {activeTab === "users" && <AdminUsersTable profiles={profiles} />}
      </main>
    </div>
  );
}
