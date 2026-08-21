"use client";

import { useState } from "react";
import Image from "next/image";
import { photoUrl } from "@/lib/supabase/public";

export default function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-2xl bg-cream-2 flex items-center justify-center text-ink-mute">
        Photos coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cream-2">
        <Image
          src={photoUrl(photos[active])}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 800px, 100vw"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-forest" : "border-transparent opacity-80"
              }`}
            >
              <Image src={photoUrl(photo)} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
