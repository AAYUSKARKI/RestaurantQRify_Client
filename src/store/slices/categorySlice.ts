import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { Category, CategoryState, CategoryResponse } from "@/types/Category";

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Category[] }>("/category");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
        }
    }
);

export const createCategory = createAsyncThunk<Category, any, { rejectValue: string }>(
    "category/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<CategoryResponse>("/category", data);
            toast.success("Category created successfully");
            return response.data.data as Category;
        } catch (error: any) {
            const message = error.response?.data?.message || "Creation failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateCategory = createAsyncThunk<Category, { id: string; data: any }, { rejectValue: string }>(
    "category/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<CategoryResponse>(`/category/${id}`, data);
            toast.success("Category updated successfully");
            return response.data.data as Category;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
    "category/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/category/${id}`);
            toast.success("Category deleted");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 1. Specific Cases First
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((cat) => cat.id !== action.payload);
            })
            // 2. Generic Matchers Last
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action: PayloadAction<string | undefined>) => {
                    state.loading = false;
                    state.error = action.payload || "An unexpected error occurred";
                }
            );
    },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;