import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../service/auth";
import type { User, RegisterData, LoginData } from "../types";


interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (userData: RegisterData, { rejectWithValue }) => {
        try {
            const response = await AuthService.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginData, { rejectWithValue }) => {
        try {
            const result = await AuthService.login(credentials);
            localStorage.setItem("token", result.data.token);
            return result.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            return await AuthService.getCurrentUser();

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem("token");
            return null;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }


    },

    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === "string" ? action.payload : JSON.stringify(action.payload);
        })

        .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === "string" ? action.payload : JSON.stringify(action.payload);
        })
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === "string" ? action.payload : JSON.stringify(action.payload);
        });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;