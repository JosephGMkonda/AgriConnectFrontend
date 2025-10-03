
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../service/api'

interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string;
  farmType: string;
  location: string;
  bio?: string;
  phone_number?: string;
  score?: number;
  common_interests?: string[];
}

interface FriendsState {
  suggestedUsers: User[];
  loading: boolean;
  error: string | null;
  activeTab: 'suggested' | 'following';
}

const initialState: FriendsState = {
  suggestedUsers: [],
  loading: false,
  error: null,
  activeTab: 'suggested',
};


export const fetchFriendRecommendations = createAsyncThunk(
  'friends/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/userprofile/recommendations/');
      console.log("Fetching the friends", response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    removeSuggestion: (state, action) => {
      state.suggestedUsers = state.suggestedUsers.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedUsers = action.payload.suggested_users || [];
      })
      .addCase(fetchFriendRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveTab, clearError, removeSuggestion } = friendsSlice.actions;
export default friendsSlice.reducer;