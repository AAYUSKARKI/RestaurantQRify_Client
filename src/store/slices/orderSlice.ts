import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { 
    Order, 
    OrderState, 
    CreateOrderRequest, 
    UpdateOrderRequest, 
} from "@/types/Order";

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    "order/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Order[] }>("/order");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const createOrder = createAsyncThunk<Order, CreateOrderRequest, { rejectValue: string }>(
    "order/create",
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await api.post<{ data: Order; message: string }>("/order", orderData);
            toast.success(response.data.message || "Order placed successfully");
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to place order";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateOrder = createAsyncThunk<Order, { id: string; data: UpdateOrderRequest }, { rejectValue: string }>(
    "order/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<{ data: Order }>(`/order/${id}`, data);
            toast.success("Order updated");
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteOrder = createAsyncThunk<string, string, { rejectValue: string }>(
    "order/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/order/${id}`);
            toast.success("Order removed");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) state.orders[index] = action.payload;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((o) => o.id !== action.payload);
            })
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

export const { resetOrderError } = orderSlice.actions;
export default orderSlice.reducer;