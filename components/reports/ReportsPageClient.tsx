"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ReportsPageClient() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const stats = useMemo(() => {
    const totalProducts = items.length;

    const lowStock = items.filter((p) => p.stock < 5);

    const bestProduct = items.reduce(
      (best, p) => (p.stock > (best?.stock ?? 0) ? p : best),
      items[0]
    );

    const totalStock = items.reduce((sum, p) => sum + p.stock, 0);

    return { totalProducts, lowStock, bestProduct, totalStock };
  }, [items]);

  const chartData = items.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-zinc-500">
          Inventory analytics and product insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? "..." : stats.totalProducts}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? "..." : stats.totalStock}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? "..." : stats.lowStock.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Product</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? "..." : stats.bestProduct?.name || "N/A"}
          </CardContent>
        </Card>

      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock by Product</CardTitle>
        </CardHeader>

        <CardContent>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" />
            </BarChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>

    </div>
  );
}