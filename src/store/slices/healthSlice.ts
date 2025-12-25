import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import type { HealthData, HealthState } from "@/types/Health";

const initialState: HealthState = {
  status: null,
  loading: false,
  error: null,
  lastChecked: null,
};

let pollingStarted = false; 
export const checkSystemHealth = createAsyncThunk<
  HealthData,
  void,
  { rejectValue: string }
>("health/check", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/health-check");
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Health check failed");
  }
});

export const startHealthPolling = createAsyncThunk(
  "health/startPolling",
  async (_, { dispatch }) => {
    if (pollingStarted) return;
    pollingStarted = true;

    dispatch(checkSystemHealth());

    setInterval(() => {
      if (document.visibilityState === "visible") {
        dispatch(checkSystemHealth());
      }
    }, 30000);
  }
);

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkSystemHealth.pending, (state) => {
        if (!state.status) state.loading = true;
      })
      .addCase(checkSystemHealth.fulfilled, (state, action) => {
        state.status = action.payload;
        state.loading = false;
        state.error = null;
        state.lastChecked = Date.now();
      })
      .addCase(checkSystemHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Health check failed";
      });
  },
});

export default healthSlice.reducer;
