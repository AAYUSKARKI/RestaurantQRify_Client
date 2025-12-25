import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { MenuItem, MenuItemState, MenuItemResponse } from "@/types/MenuItem";

const initialState: MenuItemState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchMenuItems = createAsyncThunk<MenuItem[], void, { rejectValue: string }>(
    "menuItem/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: MenuItem[] }>("/menu-item");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch menu items");
        }
    }
);

export const createMenuItem = createAsyncThunk<MenuItem, any, { rejectValue: string }>(
    "menuItem/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<MenuItemResponse>("/menu-item", data);
            toast.success("Item created successfully");
            return response.data.data as MenuItem;
        } catch (error: any) {
            const message = error.response?.data?.message || "Creation failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateMenuItem = createAsyncThunk<MenuItem, { id: string; data: any }, { rejectValue: string }>(
    "menuItem/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<MenuItemResponse>(`/menu-item/${id}`, data);
            toast.success("Item updated successfully");
            return response.data.data as MenuItem;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteMenuItem = createAsyncThunk<string, string, { rejectValue: string }>(
    "menuItem/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/menu-item/${id}`);
            toast.success("Item deleted");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateMenuItemImage = createAsyncThunk<MenuItem, { id: string; formData: FormData }, { rejectValue: string }>(
    "menuItem/updateImage",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.put<MenuItemResponse>(`/menu-item/${id}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Image updated");
            return response.data.data as MenuItem;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Image upload failed");
        }
    }
);

// --- Slice ---

const menuItemSlice = createSlice({
    name: "menuItem",
    initialState,
    reducers: {
        selectItem: (state, action: PayloadAction<MenuItem | null>) => {
            state.selectedItem = action.payload;
        },
    },
    extraReducers: (builder) => {
    builder
        // 1. ALL .addCase calls MUST be first
        .addCase(fetchMenuItems.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        .addCase(createMenuItem.fulfilled, (state, action) => {
            state.loading = false;
            state.items.push(action.payload);
        })
        .addCase(deleteMenuItem.fulfilled, (state, action) => {
            state.loading = false;
            state.items = state.items.filter((item) => item.id !== action.payload);
        })

        // 2. Then add your .addMatcher calls
        .addMatcher(
            (action) => action.type.endsWith("/update/fulfilled") || action.type.endsWith("/updateImage/fulfilled"),
            (state, action: PayloadAction<MenuItem>) => {
                state.loading = false;
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
                if (state.selectedItem?.id === action.payload.id) state.selectedItem = action.payload;
            }
        )
        .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
            state.loading = true;
            state.error = null;
        })
        .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });
},
});

export const { selectItem } = menuItemSlice.actions;
export default menuItemSlice.reducer;