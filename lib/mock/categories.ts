import type { Category } from "@/types/inventory";

let categories: Category[] = [
  {
    id: "c_laptops",
    name: "Laptops",
  },
  {
    id: "c_monitors",
    name: "Monitors",
  },
  {
    id: "c_accessories",
    name: "Accessories",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockFetchCategories(): Promise<Category[]> {
  await delay(300);
  return [...categories];
}

export type NewCategoryInput = Omit<Category, "id">;

export async function mockCreateCategory(
  input: NewCategoryInput,
): Promise<Category> {
  await delay(300);
  const created: Category = {
    id: `c_${Date.now()}`,
    ...input,
  };
  categories = [created, ...categories];
  return created;
}

export type UpdateCategoryInput = {
  id: string;
  data: Partial<NewCategoryInput>;
};

export async function mockUpdateCategory(
  input: UpdateCategoryInput,
): Promise<Category> {
  await delay(300);
  const index = categories.findIndex((c) => c.id === input.id);
  if (index === -1) {
    throw new Error("Category not found");
  }
  const updated: Category = {
    ...categories[index],
    ...input.data,
  };
  categories[index] = updated;
  return updated;
}

export async function mockDeleteCategory(id: string): Promise<string> {
  await delay(200);
  const exists = categories.some((c) => c.id === id);
  if (!exists) {
    throw new Error("Category not found");
  }
  categories = categories.filter((c) => c.id !== id);
  return id;
}

export function getCategories(): Category[] {
  return [...categories];
}

