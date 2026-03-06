import { NewProductForm } from "@/components/products/NewProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Add product</h1>
        <p className="text-sm text-zinc-600">
          Capture core product details with validation.
        </p>
      </div>
      <NewProductForm />
    </div>
  );
}

