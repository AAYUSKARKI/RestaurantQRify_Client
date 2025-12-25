import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { Reservation, ReservationState, ReservationResponse } from "@/types/Reservation";

const initialState: ReservationState = {
    reservations: [],
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchReservations = createAsyncThunk<Reservation[], void, { rejectValue: string }>(
    "reservation/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Reservation[] }>("/reservation");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reservations");
        }
    }
);

export const createReservation = createAsyncThunk<Reservation, any, { rejectValue: string }>(
    "reservation/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<ReservationResponse>("/reservation", data);
            toast.success("Reservation created successfully");
            return response.data.data as Reservation;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to create reservation";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateReservation = createAsyncThunk<Reservation, { id: string; data: any }, { rejectValue: string }>(
    "reservation/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<ReservationResponse>(`/reservation/${id}`, data);
            toast.success("Reservation updated successfully");
            return response.data.data as Reservation;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteReservation = createAsyncThunk<string, string, { rejectValue: string }>(
    "reservation/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/reservation/${id}`);
            toast.success("Reservation removed");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        clearReservationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 1. Specific Cases
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations.push(action.payload);
            })
            .addCase(updateReservation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reservations.findIndex((res) => res.id === action.payload.id);
                if (index !== -1) state.reservations[index] = action.payload;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = state.reservations.filter((res) => res.id !== action.payload);
            })
            // 2. Generic Matchers
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

export const { clearReservationError } = reservationSlice.actions;
export default reservationSlice.reducer;