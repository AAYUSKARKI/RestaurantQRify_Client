import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { Allergen, AllergenState, AllergenResponse } from "@/types/Allergen";

const initialState: AllergenState = {
    allergens: [],
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchAllergens = createAsyncThunk<Allergen[], void, { rejectValue: string }>(
    "allergen/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Allergen[] }>("/allergen");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch allergens");
        }
    }
);

export const createAllergen = createAsyncThunk<Allergen, { name: string }, { rejectValue: string }>(
    "allergen/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<AllergenResponse>("/allergen", data);
            toast.success("Allergen added successfully");
            return response.data.data as Allergen;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to add allergen";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateAllergen = createAsyncThunk<Allergen, { id: string; name: string }, { rejectValue: string }>(
    "allergen/update",
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const response = await api.put<AllergenResponse>(`/allergen/${id}`, { name });
            toast.success("Allergen updated");
            return response.data.data as Allergen;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteAllergen = createAsyncThunk<string, string, { rejectValue: string }>(
    "allergen/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/allergen/${id}`);
            toast.success("Allergen removed");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const allergenSlice = createSlice({
    name: "allergen",
    initialState,
    reducers: {
        clearAllergenError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Standard Cases
            .addCase(fetchAllergens.fulfilled, (state, action) => {
                state.loading = false;
                state.allergens = action.payload;
            })
            .addCase(createAllergen.fulfilled, (state, action) => {
                state.loading = false;
                state.allergens.push(action.payload);
            })
            .addCase(updateAllergen.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.allergens.findIndex((a) => a.id === action.payload.id);
                if (index !== -1) state.allergens[index] = action.payload;
            })
            .addCase(deleteAllergen.fulfilled, (state, action) => {
                state.loading = false;
                state.allergens = state.allergens.filter((a) => a.id !== action.payload);
            })
            // Generic Matchers
            .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || "An error occurred";
            });
    },
});

export const { clearAllergenError } = allergenSlice.actions;
export default allergenSlice.reducer;