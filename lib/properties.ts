import { supabasePublic } from "@/lib/supabase/public";
import type { Property } from "@/lib/types";

// True once the one-time `supabase/schema.sql` setup hasn't been run yet —
// lets pages render an empty state instead of a hard error before launch.
function isMissingTable(message: string): boolean {
  return message.includes("Could not find the table");
}

export async function getProperties(): Promise<Property[]> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    if (isMissingTable(error.message)) return [];
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error.message)) return null;
    throw new Error(error.message);
  }
  return data;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error.message)) return null;
    throw new Error(error.message);
  }
  return data;
}
