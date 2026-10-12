import { createClient, isSupabaseConfigured } from "./supabase/client";
import { uploadFileToUploadcare } from "./uploadcare";
import { CustomOrder, SizeData } from "@/types";
import { setCookie, getCookie, COOKIE_MEASUREMENTS_KEY } from "./cookies";

const LOCAL_STORAGE_ORDERS_KEY = "shinede_custom_orders";
const LOCAL_STORAGE_PROFILE_KEY = "shinede_user_profile";

// Sample initial orders for fallback / demo experience
const INITIAL_DEMO_ORDERS: CustomOrder[] = [
  {
    id: "demo-ord-1",
    order_number: "SDN-8492-PINK",
    customer_name: "Aastha Sharma",
    customer_email: "aastha@example.com",
    customer_phone: "+977 9841-234567",
    image_url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    shape: "almond",
    length: "medium",
    finish: "glossy",
    sizing_type: "standard",
    size_data: {
      type: "standard",
      standardSize: "S",
    },
    notes: "Rose quartz crystal French tips with gold foil line art.",
    status: "Designing",
    total_price: 1649.0,
    payment_status: "paid",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "demo-ord-2",
    order_number: "SDN-3918-CHIC",
    customer_name: "Pooja Shrestha",
    customer_email: "pooja@example.com",
    customer_phone: "+977 9801-987654",
    image_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
    shape: "coffin",
    length: "long",
    finish: "matte",
    sizing_type: "custom",
    size_data: {
      type: "custom",
      measurements: {
        thumb: 16,
        index: 12,
        middle: 13,
        ring: 12,
        pinky: 9,
      },
    },
    notes: "All matte pastel cherry red with pearlescent chrome aura.",
    status: "Shipped",
    total_price: 1799.0,
    payment_status: "paid",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export async function uploadInspirationImage(file: File): Promise<string> {
  // 1. Primary: Upload directly to Uploadcare CDN
  try {
    const uploadcareUrl = await uploadFileToUploadcare(file);
    if (uploadcareUrl) {
      return uploadcareUrl;
    }
  } catch (err) {
    console.warn("Uploadcare direct upload failed, checking fallbacks:", err);
  }

  // 2. Secondary fallback: Supabase Storage
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `custom-designs/${fileName}`;

  if (isSupabaseConfigured()) {
    try {
      const { error: uploadError } = await supabase.storage
        .from("nail-inspirations")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("nail-inspirations")
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (err) {
      console.warn("Storage upload failed, falling back to local data URL:", err);
    }
  }

  // 3. Final Fallback: Convert file to data URL so it can be saved and displayed anywhere
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

export async function submitCustomOrder(order: Omit<CustomOrder, "id" | "created_at">): Promise<CustomOrder> {
  const newOrder: CustomOrder = {
    ...order,
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  try {
    // 1. Send to Next.js API backed by Prisma + Supabase Postgres
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        const savedOrder: CustomOrder = {
          id: result.data.id,
          order_number: result.data.orderNumber || result.data.order_number,
          customer_name: result.data.customerName || result.data.customer_name,
          customer_email: result.data.customerEmail || result.data.customer_email,
          customer_phone: result.data.customerPhone || result.data.customer_phone,
          image_url: result.data.imageUrl || result.data.image_url,
          shape: result.data.shape,
          length: result.data.length,
          finish: result.data.finish,
          sizing_type: result.data.sizingType || result.data.sizing_type,
          size_data: result.data.sizeData || result.data.size_data,
          notes: result.data.notes,
          status: result.data.status,
          total_price: Number(result.data.totalPrice || result.data.total_price),
          payment_status: result.data.paymentStatus || result.data.payment_status,
          created_at: result.data.createdAt || result.data.created_at,
        };
        saveOrderToLocalStorage(savedOrder);
        return savedOrder;
      }
    }
  } catch (err) {
    console.warn("API database submission error, using local storage cache:", err);
  }

  // Fallback to local storage if offline
  saveOrderToLocalStorage(newOrder);
  return newOrder;
}

export function saveOrderToLocalStorage(order: CustomOrder) {
  if (typeof window === "undefined") return;
  try {
    const existing = getOrdersFromLocalStorage();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving order to localStorage:", err);
  }
}

export function getOrdersFromLocalStorage(): CustomOrder[] {
  if (typeof window === "undefined") return INITIAL_DEMO_ORDERS;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!stored) {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(stored);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
}

export async function fetchUserOrders(email?: string): Promise<CustomOrder[]> {
  if (!email) return [];

  try {
    const url = `/api/orders?email=${encodeURIComponent(email)}`;
    const res = await fetch(url);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const mapped: CustomOrder[] = result.data.map((item: any) => ({
          id: item.id,
          order_number: item.orderNumber || item.order_number,
          customer_name: item.customerName || item.customer_name,
          customer_email: item.customerEmail || item.customer_email,
          customer_phone: item.customerPhone || item.customer_phone,
          image_url: item.imageUrl || item.image_url,
          shape: item.shape,
          length: item.length,
          finish: item.finish,
          sizing_type: item.sizingType || item.sizing_type,
          size_data: item.sizeData || item.size_data,
          notes: item.notes,
          status: item.status,
          total_price: Number(item.totalPrice || item.total_price),
          payment_status: item.paymentStatus || item.payment_status,
          created_at: item.createdAt || item.created_at,
        }));

        if (mapped.length > 0) {
          return mapped;
        }
      }
    }
  } catch (err) {
    console.warn("Failed to fetch orders from Prisma API, checking local storage:", err);
  }

  // Check locally saved orders for this specific user
  const localOrders = getOrdersFromLocalStorage();
  const userFiltered = localOrders.filter(
    (o) => o.customer_email?.trim().toLowerCase() === email.trim().toLowerCase()
  );

  // If this is the demo VIP account, include sample orders
  if (email.toLowerCase().includes("chloe") || email.toLowerCase().includes("demo")) {
    return localOrders;
  }

  return userFiltered;
}

export function getSavedMeasurements(email?: string): SizeData | null {
  if (typeof window === "undefined") return null;
  try {
    const key = email ? `${LOCAL_STORAGE_PROFILE_KEY}_${email.trim().toLowerCase()}` : LOCAL_STORAGE_PROFILE_KEY;
    const raw =
      localStorage.getItem(key) ||
      localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY) ||
      getCookie(COOKIE_MEASUREMENTS_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.saved_measurements || null;
    }
  } catch {
    // Ignore
  }
  return null;
}

export async function saveMeasurementsLocally(measurements: SizeData, email: string = "chloe@example.com") {
  if (typeof window === "undefined") return;
  try {
    const key = `${LOCAL_STORAGE_PROFILE_KEY}_${email.trim().toLowerCase()}`;
    const payload = { saved_measurements: measurements, email };
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(payload));
    setCookie(COOKIE_MEASUREMENTS_KEY, JSON.stringify(payload), 365);

    // Also persist to Supabase Postgres via Prisma API
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, saved_measurements: measurements }),
    }).catch((err) => console.warn("Prisma profile sync warning:", err));
  } catch (err) {
    console.error("Error saving measurements to localStorage:", err);
  }
}
