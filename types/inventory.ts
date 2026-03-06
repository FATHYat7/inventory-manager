export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

