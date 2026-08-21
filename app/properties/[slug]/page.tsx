import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPropertyBySlug } from "@/lib/properties";
import { formatAddress, formatCurrency } from "@/lib/format";
import PhotoGallery from "@/components/PhotoGallery";
import StatusBadge from "@/components/StatusBadge";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return {
    title: formatAddress(property),
    description: property.description ?? undefined,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const mapQuery = encodeURIComponent(formatAddress(property));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <PhotoGallery photos={property.photos} alt={property.address} />

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <StatusBadge category={property.category} />
          </div>
          <h1 className="font-serif text-3xl text-ink">{property.address}</h1>
          <p className="text-ink-soft">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>
        {property.category !== "sold" && (
          <a
            href={siteConfig.leadFormUrl || (siteConfig.phone ? `tel:${siteConfig.phone}` : "#")}
            className="rounded-full bg-clay px-6 py-3 font-semibold text-cream hover:bg-clay-deep"
          >
            Get More Info
          </a>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-rule bg-white p-6 sm:grid-cols-4">
        <Fact label="Price" value={formatCurrency(property.price)} />
        <Fact label="Down Payment" value={formatCurrency(property.down_payment)} />
        <Fact label="Monthly Payment" value={`${formatCurrency(property.monthly_payment)}/mo`} />
        <Fact label="Term" value={property.term_years ? `${property.term_years} years` : "—"} />
      </div>

      <div className="mt-4 flex flex-wrap gap-6 text-sm text-ink-soft">
        {property.beds != null && <span>{property.beds} bedrooms</span>}
        {property.baths != null && <span>{property.baths} baths</span>}
        {property.sqft != null && <span>{property.sqft.toLocaleString()} sqft</span>}
        {property.lot_size && <span>{property.lot_size} lot</span>}
        {property.year_built && <span>Built {property.year_built}</span>}
      </div>

      {property.description && (
        <div className="mt-10">
          <h2 className="font-serif text-xl text-ink mb-3">About This Home</h2>
          <p className="whitespace-pre-line text-ink-soft leading-relaxed">
            {property.description}
          </p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-serif text-xl text-ink mb-3">Location</h2>
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-rule">
          <iframe
            title="Property location"
            className="h-full w-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </div>
      </div>

      {property.category !== "sold" && (
        <div className="mt-10 rounded-2xl border border-rule bg-cream-2 p-8 text-center">
          <h2 className="font-serif text-xl text-ink">Interested in this home?</h2>
          <p className="mt-2 text-ink-soft">
            {siteConfig.phone
              ? `Call or text us at ${siteConfig.phone}, or send us your info and we'll follow up.`
              : "Send us your info and we'll follow up."}
          </p>
          <a
            href={siteConfig.leadFormUrl || (siteConfig.phone ? `tel:${siteConfig.phone}` : "#")}
            className="mt-4 inline-block rounded-full bg-forest px-6 py-3 font-semibold text-cream hover:bg-forest-deep"
          >
            Get More Info
          </a>
        </div>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-mute">{label}</p>
      <p className="font-serif text-lg text-forest-deep">{value}</p>
    </div>
  );
}
