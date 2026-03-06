import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types/inventory";
import {
  mockCreateCategory,
  mockDeleteCategory,
  mockFetchCategories,
  mockUpdateCategory,
  type NewCategoryInput,
  type UpdateCategoryInput,
} from "@/lib/mock/categories";

export type CategoriesState = {
  items: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
};

type RejectValue = string;

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: RejectValue }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    return await mockFetchCategories();
  } catch (error) {
    return rejectWithValue("Failed to fetch categories.");
  }
});

export const createCategory = createAsyncThunk<
  Category,
  NewCategoryInput,
  { rejectValue: RejectValue }
>("categories/createCategory", async (input, { rejectWithValue }) => {
  try {
    return await mockCreateCategory(input);
  } catch (error) {
    return rejectWithValue("Failed to create category.");
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  UpdateCategoryInput,
  { rejectValue: RejectValue }
>("categories/updateCategory", async (input, { rejectWithValue }) => {
  try {
    return await mockUpdateCategory(input);
  } catch (error) {
    return rejectWithValue("Failed to update category.");
  }
});

export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>("categories/deleteCategory", async (id, { rejectWithValue }) => {
  try {
    return await mockDeleteCategory(id);
  } catch (error) {
    return rejectWithValue("Failed to delete category.");
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch categories.";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create category.";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update category.";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete category.";
      });
  },
});

export const { setCategories, clearError } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;

