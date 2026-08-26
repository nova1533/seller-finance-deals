"use client";

import { useRef, useState } from "react";
import { saveProperty, generateDescription } from "@/app/admin/actions";
import { photoUrl } from "@/lib/supabase/public";
import type { Property } from "@/lib/types";

export default function PropertyForm({ property }: { property?: Property }) {
  const [keptPhotos, setKeptPhotos] = useState<string[]>(property?.photos ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  function togglePhoto(path: string) {
    setKeptPhotos((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }

  async function handleGenerateDescription() {
    if (!formRef.current) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const data = new FormData(formRef.current);
      const text = await generateDescription({
        address: String(data.get("address") || ""),
        city: String(data.get("city") || ""),
        state: String(data.get("state") || ""),
        zip: String(data.get("zip") || ""),
        price: String(data.get("price") || ""),
        down_payment: String(data.get("down_payment") || ""),
        monthly_payment: String(data.get("monthly_payment") || ""),
        term_years: String(data.get("term_years") || ""),
        beds: String(data.get("beds") || ""),
        baths: String(data.get("baths") || ""),
        sqft: String(data.get("sqft") || ""),
        lot_size: String(data.get("lot_size") || ""),
        year_built: String(data.get("year_built") || ""),
        category: String(data.get("category") || ""),
      });
      if (descriptionRef.current) descriptionRef.current.value = text;
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setSubmitting(true);
        await saveProperty(formData);
      }}
      className="space-y-8 max-w-2xl"
    >
      {property && <input type="hidden" name="id" value={property.id} />}
      {property && <input type="hidden" name="slug" value={property.slug} />}
      {property?.photos.map((p) => (
        <input key={p} type="hidden" name="original_photos" value={p} />
      ))}
      {keptPhotos.map((p) => (
        <input key={p} type="hidden" name="existing_photos" value={p} />
      ))}

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Address</h2>
        <Field label="Street Address" name="address" defaultValue={property?.address} required />
        <div className="grid grid-cols-3 gap-4">
          <Field label="City" name="city" defaultValue={property?.city} required />
          <Field label="State" name="state" defaultValue={property?.state ?? "OK"} required />
          <Field label="Zip" name="zip" defaultValue={property?.zip} required />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Terms</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Price"
            name="price"
            type="number"
            defaultValue={property?.price}
            required
          />
          <Field
            label="Down Payment"
            name="down_payment"
            type="number"
            defaultValue={property?.down_payment}
            required
          />
          <Field
            label="Monthly Payment"
            name="monthly_payment"
            type="number"
            defaultValue={property?.monthly_payment}
            required
          />
          <Field
            label="Term (years)"
            name="term_years"
            type="number"
            defaultValue={property?.term_years ?? undefined}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Beds" name="beds" type="number" defaultValue={property?.beds ?? undefined} />
          <Field
            label="Baths"
            name="baths"
            type="number"
            step="0.5"
            defaultValue={property?.baths ?? undefined}
          />
          <Field label="Sqft" name="sqft" type="number" defaultValue={property?.sqft ?? undefined} />
          <Field label="Lot Size" name="lot_size" defaultValue={property?.lot_size ?? undefined} />
          <Field
            label="Year Built"
            name="year_built"
            type="number"
            defaultValue={property?.year_built ?? undefined}
          />
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-ink-soft mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={property?.category ?? "available"}
              className="w-full rounded-lg border border-rule px-3 py-2"
            >
              <option value="available">Available Now</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="description" className="block text-sm font-medium text-ink-soft">
              Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generating}
              className="text-sm font-medium text-forest-deep hover:underline disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            id="description"
            name="description"
            ref={descriptionRef}
            rows={5}
            defaultValue={property?.description ?? ""}
            className="w-full rounded-lg border border-rule px-3 py-2"
          />
          {generateError && <p className="mt-1 text-sm text-clay-deep">{generateError}</p>}
          <p className="mt-1 text-xs text-ink-mute">
            Fill in the fields above first, then generate. Always review before saving, it can be
            edited like normal text.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Photos</h2>
        {property && property.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {property.photos.map((p) => (
              <label key={p} className="relative block cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl(p)}
                  alt=""
                  className={`h-24 w-full rounded-lg object-cover ${
                    keptPhotos.includes(p) ? "" : "opacity-30"
                  }`}
                />
                <input
                  type="checkbox"
                  checked={keptPhotos.includes(p)}
                  onChange={() => togglePhoto(p)}
                  className="absolute right-1 top-1 h-4 w-4"
                />
              </label>
            ))}
          </div>
        )}
        <p className="text-xs text-ink-mute">
          Uncheck a photo to remove it. Add new photos below.
        </p>
        <input type="file" name="photos" accept="image/*" multiple className="block w-full text-sm" />
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-forest px-6 py-3 font-semibold text-cream hover:bg-forest-deep disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save Property"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  step,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  defaultValue?: string | number;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink-soft mb-1">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        step={step}
        defaultValue={defaultValue as string | number | undefined}
        required={required}
        className="w-full rounded-lg border border-rule px-3 py-2"
      />
    </div>
  );
}
