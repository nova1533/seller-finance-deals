import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin-only — uses the Supabase secret key, which can write and bypasses
// row-level security. Never import this into a client component.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin access is not configured — set SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
