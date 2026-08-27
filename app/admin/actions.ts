"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
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

  // Photos are uploaded client-side straight to Supabase Storage before this
  // action ever runs (see createPhotoUploadUrl) — Vercel's serverless
  // functions hard-cap request bodies at 4.5MB regardless of any app-level
  // config, so raw photo bytes can never come through here. What arrives in
  // "photos" is just the final ordered list of storage paths to keep.
  const originalPhotos = formData.getAll("original_photos") as string[];
  const photos = formData.getAll("photos") as string[];
  const removedPhotos = originalPhotos.filter((p) => !photos.includes(p));

  if (removedPhotos.length > 0) {
    await supabase.storage.from("property-photos").remove(removedPhotos);
  }

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

// Generates a short-lived signed URL the browser can upload a photo to
// directly, so the file bytes never pass through our own server (and never
// hit Vercel's 4.5MB request body cap).
export async function createPhotoUploadUrl(
  slugOrPrefix: string,
  fileName: string
): Promise<{ path: string; token: string }> {
  const supabase = supabaseAdmin();
  const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${slugOrPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const { data, error } = await supabase.storage.from("property-photos").createSignedUploadUrl(path);
  if (error) throw new Error(`Could not prepare photo upload: ${error.message}`);
  return { path: data.path, token: data.token };
}

export interface DescriptionInput {
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  down_payment: string;
  monthly_payment: string;
  term_years: string;
  beds: string;
  baths: string;
  sqft: string;
  lot_size: string;
  year_built: string;
  category: string;
}

export async function generateDescription(input: DescriptionInput): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("AI description generation isn't configured. Set ANTHROPIC_API_KEY.");
  }

  const facts: string[] = [];
  const addr = [input.address, input.city, input.state, input.zip].filter(Boolean).join(", ");
  if (addr) facts.push(`Address: ${addr}`);
  if (input.price) facts.push(`Price: $${input.price}`);
  if (input.down_payment) facts.push(`Down payment: $${input.down_payment}`);
  if (input.monthly_payment) facts.push(`Monthly payment: $${input.monthly_payment}`);
  if (input.term_years) facts.push(`Term: ${input.term_years} years`);
  if (input.beds) facts.push(`Bedrooms: ${input.beds}`);
  if (input.baths) facts.push(`Bathrooms: ${input.baths}`);
  if (input.sqft) facts.push(`Square footage: ${input.sqft}`);
  if (input.lot_size) facts.push(`Lot size: ${input.lot_size}`);
  if (input.year_built) facts.push(`Year built: ${input.year_built}`);
  if (input.category) facts.push(`Status: ${input.category}`);

  if (facts.length === 0) {
    throw new Error("Fill in some property details first, then generate a description.");
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content:
          "Write a short, warm, honest 3 to 4 sentence buyer-facing description for a home " +
          "being sold via seller financing in the Oklahoma City metro. Do not say \"contract " +
          "for deed\", since these deals are structured differently case by case, just say " +
          "seller finance or seller financing. " +
          "Use only the facts given below, never invent details like condition, renovations, " +
          "or neighborhood features that aren't listed. Do not use em dashes, use commas or " +
          "periods instead. Write plain prose only, no headers or bullet points.\n\n" +
          facts.join("\n"),
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  const text = block && "text" in block ? block.text.trim() : "";
  if (!text) throw new Error("The AI didn't return a description. Try again.");
  return text;
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
