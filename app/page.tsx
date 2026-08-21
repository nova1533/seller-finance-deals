import { getProperties } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const properties = await getProperties();
  const available = properties.filter((p) => p.category === "available");
  const comingSoon = properties.filter((p) => p.category === "coming_soon");
  const sold = properties.filter((p) => p.category === "sold");

  return (
    <div>
      <section className="border-b border-rule bg-cream-2">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-forest-deep">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
            Every home below is available on contract for deed — a straightforward path to
            ownership without a traditional bank loan.
          </p>
        </div>
      </section>

      <section id="available" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-2xl text-ink mb-6">Available Now</h2>
        {available.length === 0 ? (
          <p className="text-ink-soft">
            Nothing available this moment — check back soon, or see what&apos;s coming below.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </section>

      {comingSoon.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 border-t border-rule">
          <h2 className="font-serif text-2xl text-ink mb-6">Coming Soon</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {sold.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 border-t border-rule">
          <h2 className="font-serif text-2xl text-ink mb-6">Recently Sold</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sold.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      <section id="how-it-works" className="border-t border-rule bg-cream-2">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-serif text-2xl text-ink mb-8 text-center">How It Works</h2>
          <ol className="grid gap-6 sm:grid-cols-2">
            {[
              ["1. Schedule a showing", "Walk through the home in person before you decide."],
              ["2. Get approved", "No bank required — we work directly with you."],
              ["3. Sign your contract", "Agree on price, down payment, and monthly terms."],
              ["4. Move in", "Start building equity in your own home."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-2xl border border-rule bg-white p-6">
                <p className="font-serif text-lg text-forest-deep">{title}</p>
                <p className="mt-2 text-sm text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
