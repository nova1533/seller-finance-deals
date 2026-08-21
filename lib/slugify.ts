export function slugify(address: string): string {
  const base = address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}
