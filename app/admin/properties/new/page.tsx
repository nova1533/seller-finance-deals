import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-serif text-2xl text-ink mb-8">Add Property</h1>
      <PropertyForm />
    </div>
  );
}
