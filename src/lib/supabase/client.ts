import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder-shinede") ||
    !supabaseUrl.startsWith("https://")
  ) {
    return false;
  }

  // Ensure anon key matches the project reference in supabaseUrl
  try {
    const parts = supabaseAnonKey.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(
        typeof atob === "function"
          ? atob(parts[1])
          : Buffer.from(parts[1], "base64").toString("utf-8")
      );
      const urlHost = new URL(supabaseUrl).hostname;
      if (payload.ref && !urlHost.startsWith(payload.ref)) {
        return false;
      }
    }
  } catch {
    // Ignore decode error
  }

  return true;
};

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    // Return standard browser client or mock-safe handler
    return createBrowserClient(
      supabaseUrl || "https://placeholder-shinede.supabase.co",
      supabaseAnonKey || "placeholder-anon-key"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
