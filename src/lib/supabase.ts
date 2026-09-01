import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClientInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Get client-safe or universal Supabase client using public anon key.
 * Lazy initialization prevents startup crashes if credentials are not yet set.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  const url =
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_URL as string | undefined)
      : undefined);

  const anonKey =
    (typeof process !== "undefined" ? process.env.SUPABASE_ANON_KEY : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
      : undefined);

  if (!url || !anonKey) {
    return null;
  }

  supabaseClientInstance = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseClientInstance;
}

/**
 * Server-only Supabase admin client (using service role key).
 * Bypasses RLS for administrative background jobs / tournament settlements.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() is strictly server-only and cannot be called from the browser.");
  }

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  supabaseAdminInstance = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseAdminInstance;
}

/**
 * Check if Supabase connection credentials are fully configured.
 */
export function isSupabaseConfigured(): boolean {
  const url =
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_URL as string | undefined)
      : undefined);

  const key =
    (typeof process !== "undefined" ? process.env.SUPABASE_ANON_KEY : undefined) ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
      : undefined);

  return Boolean(url && key);
}
