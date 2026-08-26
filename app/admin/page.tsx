import Link from "next/link";
import { getProperties } from "@/lib/properties";
import { formatCurrency } from "@/lib/format";
import LogoutButton from "@/components/admin/LogoutButton";
import DeleteForm from "@/components/admin/DeleteForm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const properties = await getProperties();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-ink">Properties</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/properties/new"
            className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream hover:bg-forest-deep"
          >
            Add Property
          </Link>
          <LogoutButton />
        </div>
      </div>

      {properties.length === 0 ? (
        <p className="text-ink-soft">No properties yet, add your first one.</p>
      ) : (
        <div className="divide-y divide-rule rounded-2xl border border-rule bg-white">
          {properties.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium text-ink">{p.address}</p>
                <p className="text-sm text-ink-soft">
                  {p.city}, {p.state} {p.zip} · {formatCurrency(p.price)} · {p.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/properties/${p.id}/edit`}
                  className="text-sm font-medium text-forest-deep hover:underline"
                >
                  Edit
                </Link>
                <DeleteForm id={p.id} photos={p.photos} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
