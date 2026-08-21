"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

function num(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function saveProperty(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const existingSlug = (formData.get("slug") as string) || null;

  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "OK").trim();
  const zip = String(formData.get("zip") || "").trim();
  const category = String(formData.get("category") || "available");
  const description = String(formData.get("description") || "").trim() || null;
  const lot_size = String(formData.get("lot_size") || "").trim() || null;

  if (!address || !city || !zip) {
    throw new Error("Address, city, and zip are required.");
  }

  const price = num(formData, "price");
  const down_payment = num(formData, "down_payment");
  const monthly_payment = num(formData, "monthly_payment");
  if (price == null || down_payment == null || monthly_payment == null) {
    throw new Error("Price, down payment, and monthly payment are required.");
  }

  const slug = existingSlug || slugify(address);

  const supabase = supabaseAdmin();

  const originalPhotos = formData.getAll("original_photos") as string[];
  const keptPhotos = formData.getAll("existing_photos") as string[];
  const removedPhotos = originalPhotos.filter((p) => !keptPhotos.includes(p));

  if (removedPhotos.length > 0) {
    await supabase.storage.from("property-photos").remove(removedPhotos);
  }

  const newFiles = (formData.getAll("photos") as File[]).filter((f) => f && f.size > 0);
  const uploadedPaths: string[] = [];

  for (const file of newFiles) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${slug}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from("property-photos")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(`Photo upload failed: ${error.message}`);
    uploadedPaths.push(path);
  }

  const photos = [...keptPhotos, ...uploadedPaths];

  const record = {
    slug,
    address,
    city,
    state,
    zip,
    price,
    down_payment,
    monthly_payment,
    term_years: num(formData, "term_years"),
    beds: num(formData, "beds"),
    baths: num(formData, "baths"),
    sqft: num(formData, "sqft"),
    lot_size,
    year_built: num(formData, "year_built"),
    description,
    category,
    photos,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("properties").update(record).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("properties").insert(record);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath(`/properties/${slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProperty(formData: FormData) {
  const id = String(formData.get("id"));
  const photos = formData.getAll("photos") as string[];

  const supabase = supabaseAdmin();
  if (photos.length > 0) {
    await supabase.storage.from("property-photos").remove(photos);
  }
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
