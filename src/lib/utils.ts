import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Nepalese Rupees (NPR / Rs.)
 * e.g. Rs. 1,499
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString("en-IN")}`;
}

export function generateOrderNumber(): string {
  const prefix = "SDN";
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const datePart = Date.now().toString().slice(-4);
  return `${prefix}-${datePart}-${randomPart}`;
}
