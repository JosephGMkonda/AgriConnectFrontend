import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../service/api'




interface FollowState {
  following: { followId: number; userId: number }[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowState = {
  following: [],
  loading: false,
  error: null,
};


export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      // ✅ must send { following: userId }
      const response = await api.post('/Follow/', { following: userId });
      return response.data; // includes id, follower, following
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (followId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/Follow/${followId}/`);
      return followId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




export const fetchFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Follow/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    clearFollowError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
  state.loading = false;
  state.following.push({
    followId: action.payload.id,
    userId: action.payload.following, 
  });
})
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
  state.loading = false;
  state.following = state.following.filter(f => f.followId !== action.payload);
})
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
  state.following = action.payload.map((follow: any) => ({
    followId: follow.id,
    userId: follow.following,
  }));
});
  },
});

export const { clearFollowError } = followSlice.actions;
export default followSlice.reducer;
