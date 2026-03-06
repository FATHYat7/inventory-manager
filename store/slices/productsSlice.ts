import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/inventory";
import {
  mockCreateProduct,
  mockDeleteProduct,
  mockFetchProducts,
  mockUpdateProduct,
  type NewProductInput,
  type UpdateProductInput,
} from "@/lib/mock/products";

export type ProductsState = {
  items: Product[];
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

type RejectValue = string;

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: RejectValue }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await mockFetchProducts();
  } catch (error) {
    return rejectWithValue("Failed to fetch products.");
  }
});

export const createProduct = createAsyncThunk<
  Product,
  NewProductInput,
  { rejectValue: RejectValue }
>("products/createProduct", async (input, { rejectWithValue }) => {
  try {
    return await mockCreateProduct(input);
  } catch (error) {
    return rejectWithValue("Failed to create product.");
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductInput,
  { rejectValue: RejectValue }
>("products/updateProduct", async (input, { rejectWithValue }) => {
  try {
    return await mockUpdateProduct(input);
  } catch (error) {
    return rejectWithValue("Failed to update product.");
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    return await mockDeleteProduct(id);
  } catch (error) {
    return rejectWithValue("Failed to delete product.");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products.";
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create product.";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update product.";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete product.";
      });
  },
});

export const { setProducts, clearError } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;

