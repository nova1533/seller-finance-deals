import { supabasePublic } from "@/lib/supabase/public";
import type { Property } from "@/lib/types";

export async function getProperties(): Promise<Property[]> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = supabasePublic();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
