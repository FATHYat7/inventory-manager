  "use client";
           import { useState } from "react"
         import { AddProductModal } from "@/components/products/AddProductModal";
      import { EditProductModal } from "@/components/products/EditProductModal";
       import { RoleGate } from "@/components/auth/RoleGate";
     import { ProductsTable } from "@/components/products/ProductsTable";
       import type { Product } from "@/types/inventory";
     import { useAppDispatch } from "@/store/hooks";
     import { deleteProduct } from "@/store/slices/productsSlice";
    import { useSession } from "next-auth/react";
   import { useToast } from "@/components/ui/Toast";

     export function ProductsPageClient() {
        const dispatch = useAppDispatch();
          const toast = useToast();
        const { data } = useSession();
      const role = data?.user?.role;
    const canManage = role === "admin" || role === "manager";
     const [showAddModal, setShowAddModal] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
 async function handleDelete(product: Product) {
     if (!canManage) return;
        const confirmed = window.confirm(
          `Delete product "${product.name}" (${product.sku})?`,
           );
           if (!confirmed) return;
 try {
       await dispatch(deleteProduct(product.id)).unwrap();
       toast.push({
          kind: "success",
          title: "Product deleted",
          message: `${product.name} (${product.sku}) was removed.`,
 });
   } catch (e) {
    const message = typeof e === "string" ? e : "Failed to delete product.";
    toast.push({ kind: "error", title: "Delete failed", message });
          }
    }
return (
       <>
           <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
             <div className="space-y-1">
             <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                <p className="text-sm text-zinc-600">
                   Manage your inventory catalog (CRUD).
                </p>
             </div>
            <div className="flex items-center gap-2">
 <RoleGate
                                                                                                                          allowed={["admin", "manager"]}
                                                                                                                          fallback={
                                                                                                                            <button
                                                                                                                              type="button"
                                                                                                                              disabled
                                                                                                                              title="You don’t have permission to bulk import."
                                                                                                                              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 opacity-60"
                                                                                                                          >
                                                                                                                            Bulk import (restricted)
                                                                                                                          </button>
                                                                                                                        }
                                                                                                                      >
                                                                                                                        <button
                                                                                                                          type="button"
                                                                                                                          className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                                                                                                                        >
                                                                                                                          Bulk import (restricted)
                                                                                                                        </button>
                                                                                                                      </RoleGate>
                                                                                                                      <button
                                                                                                                        type="button"
                                                                                                                        onClick={() => setShowAddModal(true)}
                                                                                                                        className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                                                                                                                      >
                                                                                                                        Add product
                                                                                                                      </button>
                                                                                                                    </div>
                                                                                                                  </div>

                                                                                                                  <ProductsTable
                                                                                                                    onEdit={(product) => setEditingProduct(product)}
                                                                                                                    onDelete={handleDelete}
                                                                                                                    canManage={canManage}
                                                                                                                  />
                                                                                                                </div>

                                                                                                                <AddProductModal
                                                                                                                  open={showAddModal}
                                                                                                                  onClose={() => setShowAddModal(false)}
                                                                                                                />
                                                                                                                <EditProductModal
                                                                                                                  open={Boolean(editingProduct)}
                                                                                                                  product={editingProduct}
                                                                                                                  onClose={() => setEditingProduct(null)}
                                                                                                                />
                                                                                                              </>
                                                                                                            );
                                                                                                          }

