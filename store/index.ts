import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "@/store/slices/productsSlice";
import { categoriesReducer } from "@/store/slices/categoriesSlice";
import { usersReducer } from "@/store/slices/usersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

