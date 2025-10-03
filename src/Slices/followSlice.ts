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
    
      const response = await api.post('/Follow/', { following: userId });
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get('/Follow/', {
        params: {following: userId}
      })

      const followRelationships = response.data;
      const userFollow = followRelationships.find((follow: any) => 
        follow.following === userId
      )

      if(!userFollow){
        throw new Error('Follow relationship not found');
      }


      await api.delete(`/Follow/${userFollow.id}/`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




export const fetchFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.get('/Follow/', {
        params: { follower: userId }, 
      });
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

      syncFollowStatus: (state, action) => {
        const {userId,isFollowing,followId} = action.payload;
        const existingIndex = state.following.findIndex(f => f.userId === userId)

        if(isFollowing && existingIndex === -1){
          state.following.push({
            userId,
            followId: followId || Date.now()
          });
        } else if (!isFollowing && existingIndex !== -1){
          state.following.splice(existingIndex, 1)
        }
    

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
  const {id, following} = action.payload;
  const exists = state.following.some(f => f.userId === following);
  if(!exists){
     state.following.push({
    followId: id,
    userId: following, 
  });

  }

 
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

export const { clearFollowError,syncFollowStatus } = followSlice.actions;
export default followSlice.reducer;
