import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import type { AuditLog, AuditLogState, AuditLogResponse } from "@/types/Auditlog";

const initialState: AuditLogState = {
    logs: [],
    selectedLog: null,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        page: 1,
        limit: 50
    }
};

// --- Thunks ---

// GET /api/auditlog - Fetch all logs (with optional query params)
export const fetchAuditLogs = createAsyncThunk<AuditLogResponse, { page?: number; limit?: number } | void, { rejectValue: string }>(
    "auditLog/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get<AuditLogResponse>("/auditlog", { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch audit logs");
        }
    }
);

// GET /api/auditlog/user/{id} - Fetch logs for a specific user
export const fetchUserAuditLogs = createAsyncThunk<AuditLog[], string, { rejectValue: string }>(
    "auditLog/fetchByUser",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: AuditLog[] }>(`/auditlog/user/${userId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch user logs");
        }
    }
);

// GET /api/auditlog/{id} - Get specific log details
export const fetchAuditLogById = createAsyncThunk<AuditLog, string, { rejectValue: string }>(
    "auditLog/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: AuditLog }>(`/auditlog/${id}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Log not found");
        }
    }
);

// --- Slice ---

const auditLogSlice = createSlice({
    name: "auditLog",
    initialState,
    reducers: {
        clearSelectedLog: (state) => {
            state.selectedLog = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload.data as AuditLog[];
                if (action.payload.meta) {
                    state.pagination = action.payload.meta;
                }
            })
            .addCase(fetchUserAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditLogById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLog = action.payload;
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

export const { clearSelectedLog } = auditLogSlice.actions;
export default auditLogSlice.reducer;