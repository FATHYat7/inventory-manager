"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { createProduct } from "@/store/slices/productsSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  productCategories,
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validation/productForm";

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
      categoryId: "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      await dispatch(
        createProduct({
          name: values.name,
          sku: values.sku,
          price: values.price,
          stock: values.stock,
          categoryId: values.categoryId,
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "Product created",
        message: `${values.name} (${values.sku}) was added.`,
      });

      reset();
      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to create product.";
      toast.push({ kind: "error", title: "Create failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add product"
      description="Create a new inventory item with basic details."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="sku" className="text-sm font-medium">
              SKU
            </label>
            <Input
              id="sku"
              type="text"
              {...register("sku")}
            />
            {errors.sku && (
              <p className="text-xs text-red-600">{errors.sku.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-600">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="stock" className="text-sm font-medium">
              Stock
            </label>
            <Input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && (
              <p className="text-xs text-red-600">{errors.stock.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="categoryId" className="text-sm font-medium">
              Category
            </label>
            <select
              id="categoryId"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400"
              {...register("categoryId")}
            >
              <option value="">Select a category</option>
              {productCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            onClick={onClose}
            size="sm"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="sm"
          >
            {isSubmitting ? "Saving…" : "Save product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

