export type NailShape = "almond" | "coffin" | "square" | "stiletto" | "oval";

export type NailLength = "short" | "medium" | "long" | "extra_long";

export type NailFinish = "glossy" | "matte" | "mixed";

export type StandardSize = "XS" | "S" | "M" | "L";

export interface NailMeasurements {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export type SizingType = "standard" | "custom" | "coin_photo";

export interface SizeData {
  type: SizingType;
  standardSize?: StandardSize;
  measurements?: NailMeasurements;
  coinPhotoUrl?: string;
}

export type OrderStatus = "Pending" | "Designing" | "Shipped" | "Delivered" | "Cancelled";

export interface CustomOrder {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  image_url: string;
  shape: NailShape;
  length: NailLength;
  finish: NailFinish;
  sizing_type: SizingType;
  size_data: SizeData;
  notes?: string;
  status: OrderStatus;
  total_price: number;
  payment_status: "unpaid" | "paid";
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  saved_measurements?: SizeData | null;
  created_at: string;
  updated_at?: string;
}

export interface ShapeOption {
  id: NailShape;
  name: string;
  description: string;
  popular?: boolean;
}

export interface LengthOption {
  id: NailLength;
  name: string;
  measurement: string;
  description: string;
}

export interface UserSession {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

