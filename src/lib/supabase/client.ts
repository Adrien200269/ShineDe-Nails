import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("placeholder-shinede") &&
    supabaseUrl.startsWith("https://")
  );
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
