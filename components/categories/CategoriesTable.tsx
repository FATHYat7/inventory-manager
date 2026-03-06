"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import type { Category } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type CategoriesTableProps = {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  canManage?: boolean;
};

export function CategoriesTable({
  onEdit,
  onDelete,
  canManage = true,
}: CategoriesTableProps) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!items.length) {
      void dispatch(fetchCategories());
    }
  }, [dispatch, items.length]);

  if (loading && !items.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 space-y-2">
          <div className="h-8 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-8 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-8 w-full animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
        <div className="font-medium">Failed to load categories</div>
        <div className="mt-1">{error}</div>
        <div className="mt-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => dispatch(fetchCategories())}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No categories yet"
        message="Create your first category to organize your products."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead className="bg-zinc-50">
          <tr className="text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((category) => (
            <tr
              key={category.id}
              className="border-t border-zinc-100 hover:bg-zinc-50"
            >
              <td className="px-4 py-3 text-zinc-900">{category.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                {category.id}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(category)}
                    disabled={!canManage}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(category)}
                    disabled={!canManage}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

