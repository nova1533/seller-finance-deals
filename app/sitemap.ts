import { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";

const PRIORITY: Record<string, number> = {
  available: 0.9,
  coming_soon: 0.7,
  sold: 0.5,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://commongroundhomesok.com";
  const properties = await getProperties();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...properties.map((p) => ({
      url: `${base}/properties/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: PRIORITY[p.category] ?? 0.6,
    })),
  ];
}
