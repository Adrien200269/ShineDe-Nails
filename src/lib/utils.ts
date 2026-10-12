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

export function createWhatsAppOrderLink({
  orderNumber,
  shape,
  length,
  finish,
  sizingType,
  standardSize,
  measurements,
  imageUrl,
  totalPrice,
  customerName,
}: {
  orderNumber?: string;
  shape: string;
  length: string;
  finish?: string;
  sizingType?: string;
  standardSize?: string;
  measurements?: { thumb: number; index: number; middle: number; ring: number; pinky: number };
  imageUrl?: string;
  totalPrice?: number;
  customerName?: string;
}) {
  // ShineDe Nails Kathmandu studio WhatsApp contact line
  const phone = "9779841000000";
  let sizeText = "";
  if (sizingType === "standard" && standardSize) {
    sizeText = `Size ${standardSize}`;
  } else if (measurements) {
    sizeText = `Custom mm (T:${measurements.thumb}, I:${measurements.index}, M:${measurements.middle}, R:${measurements.ring}, P:${measurements.pinky})`;
  } else {
    sizeText = standardSize ? `Size ${standardSize}` : "Custom Fit";
  }

  const capitalizedShape = shape ? shape.charAt(0).toUpperCase() + shape.slice(1) : "Almond";
  const formattedLength = length
    ? length
        .replace("_", " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Medium";
  const formattedFinish = finish ? finish.charAt(0).toUpperCase() + finish.slice(1) : "Glossy";

  let message = `Hi ShineDe Nails! I just configured a custom set: ${capitalizedShape}, ${formattedLength}, ${sizeText} (${formattedFinish}).`;
  if (orderNumber) {
    message += ` Order #${orderNumber}.`;
  }
  if (totalPrice) {
    message += ` Total: ${formatCurrency(totalPrice)}.`;
  }
  if (imageUrl) {
    message += ` Here is my inspo link: ${imageUrl}`;
  }
  if (customerName) {
    message += ` Customer: ${customerName}.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
