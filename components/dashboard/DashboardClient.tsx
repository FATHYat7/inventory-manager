"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

import { Package, AlertTriangle, Clock } from "lucide-react";

const LOW_STOCK_THRESHOLD = 5;

export function DashboardClient() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const stats = useMemo(() => {
    const total = items.length;

    const lowStock = items.filter(
      (p) => p.stock < LOW_STOCK_THRESHOLD
    ).length;

    const recent = [...items]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);

    return { total, lowStock, recent };
  }, [items]);

  return (
    <div className="space-y-6">

      {/* header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of inventory health and recent activity
        </p>
      </div>

      {/* stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Products</CardDescription>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {loading ? "..." : stats.total}
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Low Stock</CardDescription>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {loading ? "..." : stats.lowStock}
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Recent Updates</CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {loading ? "..." : stats.recent.length}
            </CardTitle>
          </CardContent>
        </Card>

      </div>

      {/* error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-medium">Failed to load dashboard data</div>
          <div className="mt-1">{error}</div>

          <button
            onClick={() => dispatch(fetchProducts())}
            className="mt-3 text-xs underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* low stock */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
          <CardDescription>
            Products below stock threshold ({LOW_STOCK_THRESHOLD})
          </CardDescription>
        </CardHeader>

        <CardContent>

          {stats.lowStock === 0 ? (
            <p className="text-sm text-muted-foreground">
              No low-stock products
            </p>
          ) : (
            <ul className="space-y-2">

              {items
                .filter((p) => p.stock < LOW_STOCK_THRESHOLD)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 6)
                .map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.sku}
                      </div>
                    </div>

                    <div className="text-sm font-medium">
                      {p.stock} left
                    </div>
                  </li>
                ))}

            </ul>
          )}

        </CardContent>
      </Card>

      {/* recent products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Last 5 updated products</CardDescription>
        </CardHeader>

        <CardContent>

          {stats.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products yet
            </p>
          ) : (
            <div className="space-y-2">

              {stats.recent.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.sku}
                    </div>
                  </div>

                  <div className="text-sm font-medium">
                    {p.stock}
                  </div>
                </div>
              ))}

            </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}