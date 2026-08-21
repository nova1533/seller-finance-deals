import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { photoUrl } from "@/lib/supabase/public";
import StatusBadge from "@/components/StatusBadge";

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.photos[0];

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-rule bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-cream-2">
        {cover ? (
          <Image
            src={photoUrl(cover)}
            alt={property.address}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-mute text-sm">
            Photos coming soon
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge category={property.category} />
        </div>
      </div>
      <div className="p-4">
        <p className="font-serif text-lg text-ink">{property.address}</p>
        <p className="text-sm text-ink-soft">
          {property.city}, {property.state} {property.zip}
        </p>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-xl font-semibold text-forest-deep">
            {formatCurrency(property.price)}
          </span>
          <span className="text-sm text-ink-soft">
            {formatCurrency(property.monthly_payment)}/mo
          </span>
        </div>
        <div className="mt-2 flex gap-3 text-sm text-ink-mute">
          {property.beds != null && <span>{property.beds} bd</span>}
          {property.baths != null && <span>{property.baths} ba</span>}
          {property.sqft != null && <span>{property.sqft.toLocaleString()} sqft</span>}
        </div>
      </div>
    </Link>
  );
}
