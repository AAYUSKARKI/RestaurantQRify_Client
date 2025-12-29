import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { Table, TableState, TableResponse, TableStatus } from "@/types/Table";

const initialState: TableState = {
    tables: [],
    table: null,
    loading: false,
    error: null,
};

// --- Thunks ---

export const fetchTables = createAsyncThunk<Table[], void, { rejectValue: string }>(
    "table/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Table[] }>("/table");
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch tables");
        }
    }
);

export const fetchTable = createAsyncThunk<Table, string, { rejectValue: string }>(
    "table/fetch",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Table }>(`/table/${id}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch table");
        }
    }
);

export const createTable = createAsyncThunk<Table, any, { rejectValue: string }>(
    "table/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<TableResponse>("/table", data);
            toast.success("Table created successfully");
            return response.data.data as Table;
        } catch (error: any) {
            const message = error.response?.data?.message || "Creation failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateTable = createAsyncThunk<Table, { id: string; data: any }, { rejectValue: string }>(
    "table/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<TableResponse>(`/table/${id}`, data);
            toast.success("Table updated");
            return response.data.data as Table;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const assignWaiter = createAsyncThunk<Table, { id: string; userId: string }, { rejectValue: string }>(
    "table/assign",
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const response = await api.patch<TableResponse>(`/table/assign/${id}`, { userId });
            toast.success("Waiter assigned");
            return response.data.data as Table;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Assignment failed");
        }
    }
);

export const updateTableStatus = createAsyncThunk<Table, { id: string; status: TableStatus }, { rejectValue: string }>(
    "table/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch<TableResponse>(`/table/status/${id}`, { status });
            return response.data.data as Table;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Status update failed");
        }
    }
);

export const deleteTable = createAsyncThunk<string, string, { rejectValue: string }>(
    "table/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/table/${id}`);
            toast.success("Table removed");
            return id;
        } catch (error: any) {
            const message = error.response?.data?.message || "Delete failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// --- Slice ---

const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Specific Cases
            .addCase(fetchTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload;
            })
            .addCase(fetchTable.fulfilled, (state, action) => {
                state.loading = false;
                state.table = action.payload;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables.push(action.payload);
            })
            .addCase(deleteTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = state.tables.filter((t) => t.id !== action.payload);
            })
            // Matcher for all updates (PUT and PATCHes return the updated Table)
            .addMatcher(
                (action) => 
                    action.type.endsWith("/update/fulfilled") || 
                    action.type.endsWith("/assign/fulfilled") || 
                    action.type.endsWith("/updateStatus/fulfilled"),
                (state, action: PayloadAction<Table>) => {
                    state.loading = false;
                    const index = state.tables.findIndex((t) => t.id === action.payload.id);
                    if (index !== -1) state.tables[index] = action.payload;
                }
            )
            .addMatcher((action) => action.type.endsWith("/pending"), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher((action) => action.type.endsWith("/rejected"), (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || "Error occurred";
            });
    },
});

export default tableSlice.reducer;