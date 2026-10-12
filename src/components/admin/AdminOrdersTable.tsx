"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  Phone,
  Mail,
  User,
  Ruler,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Printer,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintableWorkcardModal } from "./PrintableWorkcardModal";
import { CustomOrder, OrderStatus } from "@/types";

interface AdminOrdersTableProps {
  orders: CustomOrder[];
  onUpdateStatus: (orderId: string, orderNumber: string, newStatus: OrderStatus) => Promise<void>;
  onOpenChat: (order: CustomOrder) => void;
}

export function AdminOrdersTable({
  orders,
  onUpdateStatus,
  onOpenChat,
}: AdminOrdersTableProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [selectedOrder, setSelectedOrder] = React.useState<CustomOrder | null>(null);
  const [workcardOrder, setWorkcardOrder] = React.useState<CustomOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState<string | null>(null);

  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_email?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "All" || o.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (order: CustomOrder, newStatus: OrderStatus) => {
    setIsUpdatingStatus(order.id);
    await onUpdateStatus(order.id, order.order_number, newStatus);
    setIsUpdatingStatus(null);
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Shape",
      "Length",
      "Finish",
      "Sizing Type",
      "Size Details",
      "Status",
      "Payment Status",
      "Total Price (NPR)",
      "Created Date",
      "Notes",
      "Image URL",
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredOrders.map((order) => {
      let sizeDetails = "";
      if (order.size_data?.type === "coin_photo" || order.sizing_type === "coin_photo") {
        sizeDetails = `Coin Photo (${order.size_data?.coinPhotoUrl ? "Attached" : "WhatsApp"})`;
      } else if (order.size_data?.type === "custom" && order.size_data.measurements) {
        const m = order.size_data.measurements;
        sizeDetails = `T:${m.thumb}mm I:${m.index}mm M:${m.middle}mm R:${m.ring}mm P:${m.pinky}mm`;
      } else {
        sizeDetails = `Size ${order.size_data?.standardSize || "M"}`;
      }

      return [
        escapeCSV(order.order_number),
        escapeCSV(order.customer_name),
        escapeCSV(order.customer_email),
        escapeCSV(order.customer_phone || ""),
        escapeCSV(order.shape),
        escapeCSV(order.length),
        escapeCSV(order.finish || "glossy"),
        escapeCSV(order.sizing_type),
        escapeCSV(sizeDetails),
        escapeCSV(order.status),
        escapeCSV(order.payment_status),
        escapeCSV(order.total_price),
        escapeCSV(new Date(order.created_at).toLocaleString()),
        escapeCSV(order.notes || ""),
        escapeCSV(order.image_url || ""),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `shinede_nails_orders_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200";
      case "Designing":
        return "bg-pink-100 text-brand-primary dark:bg-pink-950/60 dark:text-pink-300 border-pink-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filters, and Export Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, client name, email..."
            className="w-full rounded-full border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface pl-10 pr-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-primary shadow-xs"
          />
        </div>

        {/* Filter Pills & Export Button */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 justify-between lg:justify-end">
          <div className="flex items-center gap-1.5">
            {["All", "Pending", "Designing", "Shipped", "Delivered"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-brand-primary text-white shadow-pink-sm"
                    : "bg-white dark:bg-brand-dark-surface border border-pink-200 dark:border-brand-dark-border text-gray-600 dark:text-brand-dark-muted hover:border-brand-primary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Export to CSV Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 h-9 text-xs shadow-pink-sm shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
            title="Download Excel / CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredOrders.length})</span>
          </Button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-3xl border border-pink-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-pink-50/70 dark:bg-brand-dark-card/70 border-b border-pink-200/80 dark:border-brand-dark-border text-gray-500 dark:text-brand-dark-muted font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Order / Inspo</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Nail Specs</th>
                <th className="py-3.5 px-4">Sizing Fit</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100 dark:divide-brand-dark-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-brand-dark-muted">
                    No custom orders match your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const size = order.size_data;
                  const isCustom = size?.type === "custom" && size.measurements;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-pink-50/40 dark:hover:bg-brand-dark-card/40 transition-colors"
                    >
                      {/* Order & Inspo Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-100 shrink-0">
                            {order.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={order.image_url}
                                alt="Nail inspo"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                None
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white font-mono text-xs block">
                              {order.order_number}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                          {order.customer_name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-brand-dark-muted truncate max-w-[160px]">
                          {order.customer_email}
                        </div>
                        {order.customer_phone && (
                          <div className="text-[10px] text-brand-primary">
                            {order.customer_phone}
                          </div>
                        )}
                      </td>

                      {/* Nail Specs */}
                      <td className="py-3.5 px-4">
                        <div className="capitalize font-semibold text-gray-800 dark:text-brand-dark-text text-xs">
                          {order.shape} · {order.length?.replace("_", " ")}
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-brand-dark-muted capitalize">
                          {order.finish || "Glossy"} finish
                        </span>
                      </td>

                      {/* Sizing Fit */}
                      <td className="py-3.5 px-4">
                        {order.sizing_type === "coin_photo" || order.size_data?.coinPhotoUrl ? (
                          <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-md">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Coin Photo</span>
                          </span>
                        ) : isCustom ? (
                          <div className="text-[11px] font-mono text-brand-primary font-bold">
                            T:{size.measurements?.thumb} I:{size.measurements?.index} M:{size.measurements?.middle} R:{size.measurements?.ring} P:{size.measurements?.pinky}mm
                          </div>
                        ) : (
                          <span className="inline-block bg-pink-100 dark:bg-pink-950/60 text-brand-primary text-xs font-bold px-2 py-0.5 rounded-md">
                            Size {size?.standardSize || "M"}
                          </span>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white text-xs">
                        Rs. {Number(order.total_price).toLocaleString()}
                      </td>

                      {/* Status Dropdown/Selector */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            disabled={isUpdatingStatus === order.id}
                            onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Designing">Designing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Chat Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenChat(order)}
                            className="gap-1 h-8 text-xs border-pink-200 hover:bg-pink-50 dark:hover:bg-brand-dark-card hover:border-brand-primary text-brand-primary"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Chat</span>
                          </Button>

                          {/* View Detail Modal */}
                          <Button
                            size="sm"
                            variant="white"
                            onClick={() => setSelectedOrder(order)}
                            className="h-8 text-xs gap-1 border border-pink-200 text-gray-700 dark:text-brand-dark-text"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Details</span>
                          </Button>

                          {/* Print 4x6 Studio Workcard */}
                          <Button
                            size="sm"
                            variant="white"
                            onClick={() => setWorkcardOrder(order)}
                            className="h-8 text-xs gap-1 border border-pink-200 text-gray-700 dark:text-brand-dark-text hover:border-brand-primary hover:text-brand-primary"
                            title="Print 4x6 Bench Workcard"
                          >
                            <Printer className="w-3.5 h-3.5 text-brand-primary" />
                            <span className="hidden lg:inline">Workcard</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Full Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-dark-surface rounded-4xl max-w-lg w-full p-6 sm:p-8 border border-pink-200 dark:border-brand-dark-border shadow-pink-lg space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  Nail Set Blueprint
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  Order #{selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inspo Image Large */}
            {selectedOrder.image_url && (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedOrder.image_url}
                  alt="Full Insp"
                  className="w-full h-full object-cover"
                />
                <a
                  href={selectedOrder.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm hover:bg-black"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Full Inspo</span>
                </a>
              </div>
            )}

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-brand-dark-card/60 space-y-1.5 text-xs text-gray-700 dark:text-brand-dark-text border border-pink-100 dark:border-brand-dark-border">
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                {selectedOrder.customer_name}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-primary" />
                <span>{selectedOrder.customer_email}</span>
              </div>
              {selectedOrder.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{selectedOrder.customer_phone}</span>
                </div>
              )}
            </div>

            {/* Specs & 5-Finger Measurements */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-pink-100 dark:border-brand-dark-border">
                <span className="text-gray-500 font-semibold uppercase">Shape & Length:</span>
                <span className="font-bold capitalize">{selectedOrder.shape} · {selectedOrder.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-pink-100 dark:border-brand-dark-border">
                <span className="text-gray-500 font-semibold uppercase">Finish:</span>
                <span className="font-bold capitalize">{selectedOrder.finish || "Glossy"}</span>
              </div>

              {selectedOrder.size_data?.type === "coin_photo" || selectedOrder.sizing_type === "coin_photo" || selectedOrder.size_data?.coinPhotoUrl ? (
                <div className="pt-2 space-y-2">
                  <span className="text-gray-500 font-semibold uppercase block text-[11px]">
                    Client Hand &amp; Coin Calibration Photo:
                  </span>
                  {selectedOrder.size_data?.coinPhotoUrl ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-pink-200 dark:border-brand-dark-border bg-pink-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedOrder.size_data.coinPhotoUrl}
                        alt="Hand and coin for scale"
                        className="w-full h-full object-cover"
                      />
                      <a
                        href={selectedOrder.size_data.coinPhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm hover:bg-black"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open High-Res Coin Photo</span>
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600">Client chose coin photo (sent via WhatsApp / chat)</p>
                  )}
                </div>
              ) : selectedOrder.size_data?.type === "custom" && selectedOrder.size_data.measurements ? (
                <div className="pt-2">
                  <span className="text-gray-500 font-semibold uppercase block mb-1.5">
                    Exact Millimeter Sizes:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200">
                      <div className="text-[10px] text-gray-500">Thumb</div>
                      <div className="font-bold text-brand-primary">{selectedOrder.size_data.measurements.thumb}mm</div>
                    </div>
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200">
                      <div className="text-[10px] text-gray-500">Index</div>
                      <div className="font-bold text-brand-primary">{selectedOrder.size_data.measurements.index}mm</div>
                    </div>
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200">
                      <div className="text-[10px] text-gray-500">Middle</div>
                      <div className="font-bold text-brand-primary">{selectedOrder.size_data.measurements.middle}mm</div>
                    </div>
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200">
                      <div className="text-[10px] text-gray-500">Ring</div>
                      <div className="font-bold text-brand-primary">{selectedOrder.size_data.measurements.ring}mm</div>
                    </div>
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 border border-pink-200">
                      <div className="text-[10px] text-gray-500">Pinky</div>
                      <div className="font-bold text-brand-primary">{selectedOrder.size_data.measurements.pinky}mm</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between py-1 border-b border-pink-100 dark:border-brand-dark-border">
                  <span className="text-gray-500 font-semibold uppercase">Standard Sizing:</span>
                  <span className="font-bold text-brand-primary">Size {selectedOrder.size_data?.standardSize || "M"}</span>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="pt-2">
                  <span className="text-gray-500 font-semibold uppercase block mb-1">
                    Client Design Notes:
                  </span>
                  <p className="p-3 rounded-xl bg-pink-50/50 dark:bg-brand-dark-card text-gray-800 dark:text-brand-dark-text italic border border-pink-100">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setWorkcardOrder(selectedOrder);
                }}
                className="gap-2 border-pink-200"
              >
                <Printer className="w-4 h-4 text-brand-primary" />
                <span>Print Bench Slip</span>
              </Button>

              <Button
                onClick={() => {
                  const orderToChat = selectedOrder;
                  setSelectedOrder(null);
                  onOpenChat(orderToChat);
                }}
                className="flex-1 gap-2 shadow-pink-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Consultation Chat</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Printable 4x6 Bench Workcard Modal */}
      <PrintableWorkcardModal
        order={workcardOrder}
        isOpen={!!workcardOrder}
        onClose={() => setWorkcardOrder(null)}
      />
    </div>
  );
}
