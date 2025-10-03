import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../service/api";

interface SuggestedUser {
  id: number;
  username: string;
  avatar_url?: string;
  farm_type?: string;
  is_following?: boolean;
  follower_count: number;
}

interface SuggestedUsersState {
  users: SuggestedUser[];
  loading: boolean;
  error: string | null;
}

const initialState: SuggestedUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchSuggestedUsers = createAsyncThunk(
  "suggested/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/Follow/suggested/");
      console.log("sugested user ", res)
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


export const followUser = createAsyncThunk(
  "suggested/followUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.post("/Follow/", { following: userId });
      return { userId, data: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const suggestedUsersSlice = createSlice({
  name: "suggested",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchSuggestedUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      })
      
      .addCase(followUser.fulfilled, (s, a) => {
        s.users = s.users.map((u) =>
          u.id === a.payload.userId ? { ...u, is_following: true } : u
        );
      });
  },
});

export default suggestedUsersSlice.reducer;
