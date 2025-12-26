import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import type { AuthResponse, AuthState, LoginUser, User } from "@/types/Auth";

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk<User, any, { rejectValue: string }>(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/user", data);
            toast.success(response.data.message);
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk<User, any, { rejectValue: string }>(
    "auth/login",
    async (data: LoginUser, { rejectWithValue }) => {
        try {
            const response = await api.post<AuthResponse>("/user/login", data);
            const { accessToken, user } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            toast.success(response.data.message);
            return user;
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const forgotPassword = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
    "auth/forgotPassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post("/user/forgot-password", data);
            toast.success(response.data.message || "Reset link sent to email");
        } catch (error: any) {
            const message = error.response?.data?.message || "Action failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const resetPassword = createAsyncThunk<void, { token: string; data: any }, { rejectValue: string }>(
    "auth/resetPassword",
    async ({ token, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/user/reset-password/${token}`, data);
            toast.success(response.data.message || "Password updated successfully");
        } catch (error: any) {
            const message = error.response?.data?.message || "Reset failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const refreshSession = createAsyncThunk<string, void, { rejectValue: string }>(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/user/refresh");
            const { accessToken } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            return accessToken;
        } catch (error: any) {
            return rejectWithValue("Session expired");
        }
    }
);

export const updateProfile = createAsyncThunk<User, { id: string; data: any }, { rejectValue: string }>(
    "auth/updateProfile",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<{ data: User }>(`/user/${id}`, data);
            toast.success("Profile updated successfully");
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Update failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/user/logout");
            localStorage.removeItem("accessToken");
            toast.success(response.data.message || "Logged out successfully");
        } catch (error: any) {
            const message = error.response?.data?.message || "Logout failed";
            return rejectWithValue(message);
        }
    }
);

export const getMe = createAsyncThunk<User, void, { rejectValue: string }>(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: User }>("/user/me"); // Corrected endpoint to match your /api/user/{id} pattern or profile
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue("Session expired");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMe.rejected, (state) => {
                state.user = null;
                localStorage.removeItem("accessToken");
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    if (
                        action.type.includes("login") ||
                        action.type.includes("register") ||
                        action.type.includes("getMe")
                    ) {
                        state.user = action.payload;
                    }
                    if (action.type.includes("logout")) {
                        state.user = null;
                    }
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action: PayloadAction<string | undefined>) => {
                    state.loading = false;
                    if (!action.type.includes("getMe")) {
                        state.error = action.payload || "An unknown error occurred";
                    }
                }
            );
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;