import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env["VITE_SUPABASE_URL"] as string,
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string,
  { auth: { persistSession: true, autoRefreshToken: true } },
);

/** Server-only: publishable key, koi user session nahi (public reads ke liye). */
export function createServerPublicClient() {
  return createClient(
    process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"] || "",
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      "",
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
