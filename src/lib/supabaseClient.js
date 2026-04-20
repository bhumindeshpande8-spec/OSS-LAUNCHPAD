import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(value) {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
}

function hasValidSupabaseUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

const normalizedSupabaseUrl = normalizeSupabaseUrl(supabaseUrl);

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  hasValidSupabaseUrl(supabaseUrl) &&
  !supabaseAnonKey.includes("your-supabase") &&
  !supabaseAnonKey.includes("your_supabase");

export const supabase = isSupabaseConfigured
  ? createClient(normalizedSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add your real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart Vite."
    );
  }
  return supabase;
}
