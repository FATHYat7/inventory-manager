"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import { createCategory } from "@/store/slices/categoriesSlice";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/validation/categoryForm";

type AddCategoryModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddCategoryModal({ open, onClose }: AddCategoryModalProps) {
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

  async function onSubmit(values: CategoryFormValues) {
    try {
      await dispatch(
        createCategory({
          name: values.name,
        }),
      ).unwrap();

      toast.push({
        kind: "success",
        title: "Category created",
        message: `${values.name} was added.`,
      });

      reset();
      onClose();
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to create category.";
      toast.push({ kind: "error", title: "Create failed", message });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add category"
      description="Create a new category to organize your products."
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="category-name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="category-name"
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
            variant="primary"
            size="sm"
          >
            {isSubmitting ? "Saving…" : "Save category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

