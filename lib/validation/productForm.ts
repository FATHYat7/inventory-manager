import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  sku: z.string().min(1, "SKU is required."),
  price: z.number().positive("Price must be greater than 0."),
  stock: z.number().min(0, "Stock cannot be negative."),
  categoryId: z.string().min(1, "Category is required."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productCategories = [
  { id: "c_laptops", name: "Laptops" },
  { id: "c_monitors", name: "Monitors" },
  { id: "c_accessories", name: "Accessories" },
] as const;

