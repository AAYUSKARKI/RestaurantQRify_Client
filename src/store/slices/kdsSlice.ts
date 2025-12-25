import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { 
    KdsEvent, 
    KdsPerformance, 
    KdsState, 
    CreateKdsEventRequest 
} from "@/types/Kds";
import type{ Order } from "@/types/Order";

const initialState: KdsState = {
    queue: [],
    orderTimeline: [],
    performance: null,
    loading: false,
    error: null,
};

// --- Thunks ---

// GET /api/kds/queue - Active kitchen orders
export const fetchKdsQueue = createAsyncThunk<Order[], void, { rejectValue: string }>(
    "kds/fetchQueue",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Order[] }>("/kds/queue");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch kitchen queue");
        }
    }
);

// POST /api/kds/status - Transition order status (Start Cooking, Ready, etc.)
export const transitionOrderStatus = createAsyncThunk<Order, CreateKdsEventRequest, { rejectValue: string }>(
    "kds/transitionStatus",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post<{ data: Order; message: string }>("/kds/status", payload);
            toast.success(response.data.message || `Order ${payload.status}`);
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Status transition failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// GET /api/kds-event/order/{orderId} - Get timeline
export const fetchOrderTimeline = createAsyncThunk<KdsEvent[], string, { rejectValue: string }>(
    "kds/fetchTimeline",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: KdsEvent[] }>(`/kds-event/order/${orderId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch timeline");
        }
    }
);

// GET /api/kds/performance - Efficiency reports
export const fetchKdsPerformance = createAsyncThunk<KdsPerformance, void, { rejectValue: string }>(
    "kds/fetchPerformance",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: KdsPerformance }>("/kds/performance");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch metrics");
        }
    }
);

// --- Slice ---

const kdsSlice = createSlice({
    name: "kds",
    initialState,
    reducers: {
        clearKdsTimeline: (state) => {
            state.orderTimeline = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchKdsQueue.fulfilled, (state, action) => {
                state.loading = false;
                state.queue = action.payload;
            })
            .addCase(transitionOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update or remove from queue based on finality
                const updatedOrder = action.payload;
                const index = state.queue.findIndex(o => o.id === updatedOrder.id);
                
                // If status is COMPLETED or CANCELLED, remove from kitchen queue
                if (["COMPLETED", "CANCELLED", "SERVED"].includes(updatedOrder.status)) {
                    state.queue = state.queue.filter(o => o.id !== updatedOrder.id);
                } else if (index !== -1) {
                    state.queue[index] = updatedOrder;
                } else {
                    state.queue.push(updatedOrder);
                }
            })
            .addCase(fetchOrderTimeline.fulfilled, (state, action) => {
                state.loading = false;
                state.orderTimeline = action.payload;
            })
            .addCase(fetchKdsPerformance.fulfilled, (state, action) => {
                state.loading = false;
                state.performance = action.payload;
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

export const { clearKdsTimeline } = kdsSlice.actions;
export default kdsSlice.reducer;