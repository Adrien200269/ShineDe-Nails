export interface NailDesign {
  id: string;
  title: string;
  image: string;
  price: number;
  shape?: string;
  length?: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "shinede_admin_nail_designs";

export async function fetchNailDesigns(): Promise<NailDesign[]> {
  try {
    const res = await fetch("/api/nail-designs", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
        }
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Error fetching nail designs from API, checking local storage:", err);
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
  }
  return [];
}

export async function createNailDesign(data: {
  title: string;
  image: string;
  price: number;
  shape?: string;
  length?: string;
}): Promise<NailDesign> {
  const res = await fetch("/api/nail-designs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to create nail design");
  }

  return json.data;
}

export async function deleteNailDesign(id: string): Promise<void> {
  const res = await fetch(`/api/nail-designs?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to delete nail design");
  }
}

export async function updateNailDesign(data: {
  id: string;
  title?: string;
  image?: string;
  price?: number;
  shape?: string;
  length?: string;
}): Promise<NailDesign> {
  const res = await fetch("/api/nail-designs", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to update nail design");
  }

  return json.data;
}
