export type PropertyCategory = "available" | "coming_soon" | "sold";

export interface Property {
  id: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  down_payment: number;
  monthly_payment: number;
  term_years: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot_size: string | null;
  year_built: number | null;
  description: string | null;
  category: PropertyCategory;
  photos: string[];
  created_at: string;
  updated_at: string;
}
