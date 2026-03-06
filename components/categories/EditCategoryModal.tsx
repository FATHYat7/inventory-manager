"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { updateCategory } from "@/store/slices/categoriesSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/validation/categoryForm";
import type { Category } from "@/types/inventory";

type EditCategoryModalProps = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
};

export function EditCategoryModal({
  open,
  category,
  onClose,
}: EditCategoryModalProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
      });
    }
  }, [category, open, reset]);

  async function onSubmit(values: CategoryFormValues) {
    if (!category) return;

    try {
      await dispatch(
        updateCategory({
          id: category.id,
          data: {
            name: values.name,
          },
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "Category updated",
        message: `${values.name} was saved.`,
      });

      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to update category.";
      toast.push({ kind: "error", title: "Update failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit category"
      description={category ? `Update details for ${category.name}.` : undefined}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="edit-category-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="edit-category-name"
            type="text"
            placeholder="e.g., Electronics"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
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

