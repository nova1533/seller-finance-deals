"use client";

import { useRef, useState } from "react";
import { saveProperty, generateDescription, createPhotoUploadUrl } from "@/app/admin/actions";
import { photoUrl, supabasePublic } from "@/lib/supabase/public";
import type { Property } from "@/lib/types";

interface UploadingFile {
  id: string;
  name: string;
  status: "uploading" | "error";
  error?: string;
}

export default function PropertyForm({ property }: { property?: Property }) {
  const [photos, setPhotos] = useState<string[]>(property?.photos ?? []);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const uploadPrefixRef = useRef(property?.slug ?? crypto.randomUUID());

  function removePhoto(path: string) {
    setPhotos((prev) => prev.filter((p) => p !== path));
  }

  function setCover(path: string) {
    setPhotos((prev) => [path, ...prev.filter((p) => p !== path)]);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow selecting the same file again later

    for (const file of files) {
      const id = crypto.randomUUID();
      setUploading((prev) => [...prev, { id, name: file.name, status: "uploading" }]);

      try {
        const { path, token } = await createPhotoUploadUrl(uploadPrefixRef.current, file.name);
        const { error } = await supabasePublic()
          .storage.from("property-photos")
          .uploadToSignedUrl(path, token, file);
        if (error) throw new Error(error.message);

        setPhotos((prev) => [...prev, path]);
        setUploading((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
              : u
          )
        );
      }
    }
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

  const stillUploading = uploading.some((u) => u.status === "uploading");

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setSubmitting(true);
        setSaveError(null);
        try {
          await saveProperty(formData);
        } catch (err) {
          // Next's redirect() on success works by throwing a special signal —
          // let that pass through so navigation actually happens, and only
          // treat anything else as a real failure to show the user.
          if (
            err &&
            typeof err === "object" &&
            "digest" in err &&
            typeof (err as { digest?: unknown }).digest === "string" &&
            (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
          ) {
            throw err;
          }
          setSaveError(err instanceof Error ? err.message : "Something went wrong saving. Try again.");
          setSubmitting(false);
        }
      }}
      className="space-y-8 max-w-2xl"
    >
      {property && <input type="hidden" name="id" value={property.id} />}
      {property && <input type="hidden" name="slug" value={property.slug} />}
      {property?.photos.map((p) => (
        <input key={p} type="hidden" name="original_photos" value={p} />
      ))}
      {photos.map((p) => (
        <input key={p} type="hidden" name="photos" value={p} />
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

        {(photos.length > 0 || uploading.length > 0) && (
          <div className="grid grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <div key={p} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl(p)}
                  alt=""
                  className="h-24 w-full rounded-lg border border-rule object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(p)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-xs font-bold text-cream hover:bg-clay-deep"
                >
                  ×
                </button>
                <label className="absolute bottom-1 left-1 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                  <input
                    type="radio"
                    name="cover_display_only"
                    checked={i === 0}
                    onChange={() => setCover(p)}
                    className="h-3 w-3"
                  />
                  Cover
                </label>
              </div>
            ))}
            {uploading.map((u) => (
              <div
                key={u.id}
                className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed border-rule bg-cream-2 p-2 text-center"
              >
                {u.status === "uploading" ? (
                  <span className="text-xs text-ink-mute">Uploading…</span>
                ) : (
                  <span className="text-xs text-clay-deep">{u.error ?? "Upload failed"}</span>
                )}
                <span className="mt-1 truncate text-[10px] text-ink-mute w-full">{u.name}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-ink-mute">
          Pick which photo is the cover (used as the main thumbnail), or remove one with the ×.
          Photos upload as soon as you select them below.
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm"
        />
      </section>

      {saveError && (
        <p className="rounded-lg border border-clay-deep bg-clay-soft/30 px-4 py-3 text-sm text-clay-deep">
          {saveError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || stillUploading}
        className="rounded-full bg-forest px-6 py-3 font-semibold text-cream hover:bg-forest-deep disabled:opacity-60"
      >
        {submitting ? "Saving…" : stillUploading ? "Waiting for photos…" : "Save Property"}
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
