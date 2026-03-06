"use client";

import { useState } from "react";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { EditCategoryModal } from "@/components/categories/EditCategoryModal";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import type { Category } from "@/types/inventory";
import { useAppDispatch } from "@/store/hooks";
import { deleteCategory } from "@/store/slices/categoriesSlice";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/Toast";

export function CategoriesPageClient() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { data } = useSession();
  const role = data?.user?.role;
  const canManage = role === "admin" || role === "manager";
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function handleDelete(category: Category) {
    if (!canManage) return;
    const confirmed = window.confirm(
      `Delete category "${category.name}"? This may affect products in this category.`,
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteCategory(category.id)).unwrap();
      toast.push({
        kind: "success",
        title: "Category deleted",
        message: `${category.name} was removed.`,
      });
    } catch (e) {
      const message = typeof e === "string" ? e : "Failed to delete category.";
      toast.push({ kind: "error", title: "Delete failed", message });
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
            <p className="text-sm text-zinc-600">
              Manage product categories.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={!canManage}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add category
          </button>
        </div>

        <CategoriesTable
          onEdit={(category) => setEditingCategory(category)}
          onDelete={handleDelete}
          canManage={canManage}
        />
      </div>

      <AddCategoryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      <EditCategoryModal
        open={Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />
    </>
  );
}

