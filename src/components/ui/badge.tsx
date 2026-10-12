import * as React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "status";
  status?: OrderStatus;
}

export function Badge({
  className,
  variant = "default",
  status,
  children,
  ...props
}: BadgeProps) {
  if (status) {
    const statusStyles: Record<OrderStatus, string> = {
      Pending: "bg-amber-100 text-amber-800 border-amber-200",
      Designing: "bg-purple-100 text-purple-800 border-purple-200",
      Shipped: "bg-blue-100 text-blue-800 border-blue-200",
      Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Cancelled: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
          statusStyles[status],
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
        {children || status}
      </div>
    );
  }

  const variants = {
    default: "bg-brand-primary text-white border-transparent",
    secondary: "bg-brand-primary-light text-brand-primary border-pink-200",
    outline: "text-brand-primary border-brand-primary",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    status: "bg-pink-100 text-brand-primary border-pink-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
