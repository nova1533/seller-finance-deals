import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/properties";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-serif text-2xl text-ink mb-8">Edit Property</h1>
      <PropertyForm property={property} />
    </div>
  );
}
