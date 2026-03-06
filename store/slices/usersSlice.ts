import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";
import {
  mockCreateUser,
  mockDeleteUser,
  mockFetchUsers,
  mockUpdateUser,
  type NewUserInput,
  type UpdateUserInput,
  type SafeUser,
} from "@/lib/mock/users";

export type UsersState = {
  items: User[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  items: [],
  loading: false,
  error: null,
};

type RejectValue = string;

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: RejectValue }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const users = await mockFetchUsers();
    return users.map((u) => ({
      ...u,
      createdAt: new Date().toISOString(),
    }));
  } catch (error) {
    return rejectWithValue("Failed to fetch users.");
  }
});

export const createUser = createAsyncThunk<
  User,
  NewUserInput,
  { rejectValue: RejectValue }
>("users/createUser", async (input, { rejectWithValue }) => {
  try {
    const user = await mockCreateUser(input);
    return {
      ...user,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    return rejectWithValue("Failed to create user.");
  }
});

export const updateUser = createAsyncThunk<
  User,
  UpdateUserInput,
  { rejectValue: RejectValue }
>("users/updateUser", async (input, { rejectWithValue }) => {
  try {
    const user = await mockUpdateUser(input);
    return {
      ...user,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    return rejectWithValue("Failed to update user.");
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    return await mockDeleteUser(id);
  } catch (error) {
    return rejectWithValue("Failed to delete user.");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.items = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users.";
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create user.";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update user.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete user.";
      });
  },
});

export const { setUsers, clearError } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

