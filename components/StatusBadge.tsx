import type { PropertyCategory } from "@/lib/types";

const LABELS: Record<PropertyCategory, string> = {
  available: "Available Now",
  coming_soon: "Coming Soon",
  sold: "Sold",
};

const STYLES: Record<PropertyCategory, string> = {
  available: "bg-forest text-cream",
  coming_soon: "bg-clay text-cream",
  sold: "bg-ink-mute text-cream",
};

export default function StatusBadge({ category }: { category: PropertyCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${STYLES[category]}`}
    >
      {LABELS[category]}
    </span>
  );
}
