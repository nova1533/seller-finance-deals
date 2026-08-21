"use client";

import { useState } from "react";
import { saveProperty } from "@/app/admin/actions";
import { photoUrl } from "@/lib/supabase/public";
import type { Property } from "@/lib/types";

export default function PropertyForm({ property }: { property?: Property }) {
  const [keptPhotos, setKeptPhotos] = useState<string[]>(property?.photos ?? []);
  const [submitting, setSubmitting] = useState(false);

  function togglePhoto(path: string) {
    setKeptPhotos((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  }

  return (
    <form
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
            <label className="block text-sm font-medium text-ink-soft mb-1">Category</label>
            <select
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
          <label className="block text-sm font-medium text-ink-soft mb-1">Description</label>
          <textarea
            name="description"
            rows={5}
            defaultValue={property?.description ?? ""}
            className="w-full rounded-lg border border-rule px-3 py-2"
          />
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
      <label className="block text-sm font-medium text-ink-soft mb-1">{label}</label>
      <input
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
