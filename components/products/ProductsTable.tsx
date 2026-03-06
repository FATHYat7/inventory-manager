"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";
import type { Product } from "@/types/inventory";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const categoryLabels: Record<string, string> = {
  c_laptops: "Laptops",
  c_monitors: "Monitors",
  c_accessories: "Accessories",
};

type ProductsTableProps = {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  canManage?: boolean;
};

export function ProductsTable({
  onEdit,
  onDelete,
  canManage = true,
}: ProductsTableProps) {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!items.length) {
      void dispatch(fetchProducts());
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
        <div className="font-medium">Failed to load products</div>
        <div className="mt-1">{error}</div>
        <div className="mt-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => dispatch(fetchProducts())}
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
        title="No products yet"
        message="Create your first product to start tracking inventory."
      />
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = items.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead className="bg-zinc-50">
          <tr className="text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((product) => {
            const sku = product.sku;
            const category =
              categoryLabels[product.categoryId] ?? product.categoryId;

            return (
              <tr
                key={product.id}
                className="border-t border-zinc-100 hover:bg-zinc-50"
              >
                <td className="px-4 py-3 text-zinc-900">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {sku}
                </td>
                <td className="px-4 py-3 text-zinc-700">{category}</td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-800">
                  {product.stock}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-800">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(product)}
                      disabled={!canManage}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(product)}
                      disabled={!canManage}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-xs text-zinc-600">
        <div>
          Rows{" "}
          <span className="font-medium text-zinc-900">
            {startIndex + 1}–{endIndex}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-900">{totalItems}</span>
        </div>
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-7 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-1 text-[11px] text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex h-7 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

