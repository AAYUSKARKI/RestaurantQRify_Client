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
            const response = await api.get<{ data: User }>("/users/me");
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
    },
    extraReducers: (builder) => {
        builder.addCase(getMe.rejected, (state) => {
            state.user = null;
            localStorage.removeItem("accessToken");
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
                    if (action.type.includes("login") || action.type.includes("register")) {
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
                    state.error = action.payload || "An unknown error occurred";
                }
            );
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;