export interface PromoCode {
  code: string;
  type: "flat" | "percentage";
  value: number; // e.g. 100 for Rs. 100 flat, or 10 for 10%
  description: string;
  minOrder?: number;
}

export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  NAILFIE100: {
    code: "NAILFIE100",
    type: "flat",
    value: 100,
    description: "Rs. 100 off community Nailfie reward",
    minOrder: 1000,
  },
  FIRSTSET: {
    code: "FIRSTSET",
    type: "flat",
    value: 150,
    description: "Rs. 150 off first custom set in Nepal",
    minOrder: 1200,
  },
  SHINEDE10: {
    code: "SHINEDE10",
    type: "percentage",
    value: 10,
    description: "10% VIP client discount",
    minOrder: 1400,
  },
  DASHAIN: {
    code: "DASHAIN",
    type: "percentage",
    value: 15,
    description: "15% Festive Dashain luxury savings",
    minOrder: 1400,
  },
  TEEJ: {
    code: "TEEJ",
    type: "flat",
    value: 150,
    description: "Rs. 150 Teej Festival festive gift",
    minOrder: 1200,
  },
};

export function validatePromoCode(
  inputCode: string,
  currentSubtotal: number
): {
  isValid: boolean;
  message: string;
  discount: number;
  promo?: PromoCode;
} {
  const cleanCode = inputCode.trim().toUpperCase();

  if (!cleanCode) {
    return { isValid: false, message: "Please enter a promo code.", discount: 0 };
  }

  const promo = VALID_PROMO_CODES[cleanCode];
  if (!promo) {
    return {
      isValid: false,
      message: `Code "${cleanCode}" is invalid or expired. Try NAILFIE100 or SHINEDE10!`,
      discount: 0,
    };
  }

  if (promo.minOrder && currentSubtotal < promo.minOrder) {
    return {
      isValid: false,
      message: `Code ${cleanCode} requires a minimum order of Rs. ${promo.minOrder}.`,
      discount: 0,
    };
  }

  let discount = 0;
  if (promo.type === "flat") {
    discount = promo.value;
  } else if (promo.type === "percentage") {
    discount = Math.round((currentSubtotal * promo.value) / 100);
  }

  // Ensure discount does not exceed subtotal
  discount = Math.min(discount, currentSubtotal);

  return {
    isValid: true,
    message: `Promo applied: ${promo.description} (-Rs. ${discount})`,
    discount,
    promo,
  };
}
