import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { MenuItemAllergenState, LinkAllergensRequest } from "@/types/MenuItemAllergen";
import type { Allergen } from "@/types/Allergen";

const initialState: MenuItemAllergenState = {
    linkedAllergens: [],
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchAllergensByMenuItem = createAsyncThunk<Allergen[], string, { rejectValue: string }>(
    "menuItemAllergen/fetchByItem",
    async (menuItemId, { rejectWithValue }) => {
        try {
            // Your API returns the list of allergens for a specific item
            const response = await api.get<{ data: Allergen[] }>(`/menu-item-allergen/item/${menuItemId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch linked allergens");
        }
    }
);

export const linkAllergensToItem = createAsyncThunk<Allergen[], LinkAllergensRequest, { rejectValue: string }>(
    "menuItemAllergen/link",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<{ data: Allergen[]; message: string }>("/menu-item-allergen/link", data);
            toast.success(response.data.message || "Allergens linked successfully");
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Linking failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const unlinkAllergenFromItem = createAsyncThunk<string, { menuItemId: string; allergenId: string }, { rejectValue: string }>(
    "menuItemAllergen/unlink",
    async ({ menuItemId, allergenId }, { rejectWithValue }) => {
        try {
            await api.delete(`/menu-item-allergen/item/${menuItemId}/allergen/${allergenId}`);
            toast.success("Allergen unlinked");
            return allergenId;
        } catch (error: any) {
            const message = error.response?.data?.message || "Unlinking failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const menuItemAllergenSlice = createSlice({
    name: "menuItemAllergen",
    initialState,
    reducers: {
        clearLinkedAllergens: (state) => {
            state.linkedAllergens = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Set the allergens for the current menu item
            .addCase(fetchAllergensByMenuItem.fulfilled, (state, action) => {
                state.loading = false;
                state.linkedAllergens = action.payload;
            })
            // Update state after linking new ones
            .addCase(linkAllergensToItem.fulfilled, (state, action) => {
                state.loading = false;
                state.linkedAllergens = action.payload; 
            })
            // Remove a specific allergen from the local list
            .addCase(unlinkAllergenFromItem.fulfilled, (state, action) => {
                state.loading = false;
                state.linkedAllergens = state.linkedAllergens.filter(
                    (allergen) => allergen.id !== action.payload
                );
            })
            // Matchers
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

export const { clearLinkedAllergens } = menuItemAllergenSlice.actions;
export default menuItemAllergenSlice.reducer;