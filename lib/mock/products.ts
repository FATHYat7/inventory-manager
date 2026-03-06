import type { Product } from "@/types/inventory";

let products: Product[] = [
  {
    id: "p_1",
    name: "MacBook Pro 14”",
    sku: "MBP-14",
    price: 1999,
    stock: 5,
    categoryId: "c_laptops",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p_2",
    name: "Dell Ultrasharp 27” Monitor",
    sku: "DELL-U27",
    price: 499,
    stock: 2,
    categoryId: "c_monitors",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p_3",
    name: "Logitech MX Master 3S",
    sku: "MXM-3S",
    price: 129,
    stock: 25,
    categoryId: "c_accessories",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockFetchProducts(): Promise<Product[]> {
  await delay(400);
  return [...products];
}

export type NewProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

export async function mockCreateProduct(
  input: NewProductInput,
): Promise<Product> {
  await delay(300);
  const now = new Date().toISOString();
  const created: Product = {
    id: `p_${Date.now()}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  products = [created, ...products];
  return created;
}

export type UpdateProductInput = {
  id: string;
  data: Partial<NewProductInput>;
};

export async function mockUpdateProduct(
  input: UpdateProductInput,
): Promise<Product> {
  await delay(300);
  const index = products.findIndex((p) => p.id === input.id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  const now = new Date().toISOString();
  const updated: Product = {
    ...products[index],
    ...input.data,
    updatedAt: now,
  };
  products[index] = updated;
  return updated;
}

export async function mockDeleteProduct(id: string): Promise<string> {
  await delay(200);
  const exists = products.some((p) => p.id === id);
  if (!exists) {
    throw new Error("Product not found");
  }
  products = products.filter((p) => p.id !== id);
  return id;
}

