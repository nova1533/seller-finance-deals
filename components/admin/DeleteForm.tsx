"use client";

import { deleteProperty } from "@/app/admin/actions";

export default function DeleteForm({ id, photos }: { id: string; photos: string[] }) {
  return (
    <form
      action={deleteProperty}
      onSubmit={(e) => {
        if (!confirm("Delete this property? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {photos.map((photo) => (
        <input key={photo} type="hidden" name="photos" value={photo} />
      ))}
      <button type="submit" className="text-sm font-medium text-clay-deep hover:underline">
        Delete
      </button>
    </form>
  );
}
