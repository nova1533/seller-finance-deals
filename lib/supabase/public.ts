import { createClient } from "@supabase/supabase-js";

// Safe to use in server components for reading — this is the publishable key,
// not a secret. Public listing data only; writes never go through this client.
export function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function photoUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/property-photos/${path}`;
}
