"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { updateProduct } from "@/store/slices/productsSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  productCategories,
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validation/productForm";
import type { Product } from "@/types/inventory";

type EditProductModalProps = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

export function EditProductModal({
  open,
  product,
  onClose,
}: EditProductModalProps) {
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

  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
      });
    }
  }, [product, open, reset]);

  async function onSubmit(values: ProductFormValues) {
    if (!product) return;

    try {
      await dispatch(
        updateProduct({
          id: product.id,
          data: {
            name: values.name,
            sku: values.sku,
            price: values.price,
            stock: values.stock,
            categoryId: values.categoryId,
          },
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "Product updated",
        message: `${values.name} (${values.sku}) was saved.`,
      });

      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to update product.";
      toast.push({ kind: "error", title: "Update failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit product"
      description={product ? `Update details for ${product.name}.` : undefined}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="edit-name"
              type="text"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="edit-sku" className="text-sm font-medium">
              SKU
            </label>
            <Input
              id="edit-sku"
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
            <label htmlFor="edit-price" className="text-sm font-medium">
              Price
            </label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-xs text-red-600">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="edit-stock" className="text-sm font-medium">
              Stock
            </label>
            <Input
              id="edit-stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && (
              <p className="text-xs text-red-600">{errors.stock.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="edit-categoryId" className="text-sm font-medium">
              Category
            </label>
            <select
              id="edit-categoryId"
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
            size="sm"
            variant="primary"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

