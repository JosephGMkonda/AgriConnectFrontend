import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "../service/api";

export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like/`);
      return { postId, ...response.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      const { postId, is_liked, like_count } = action.payload;

      
      const post = state.posts?.list?.find((p: any) => p.id === postId);
      if (post) {
        post.is_liked = is_liked;
        post.like_count = like_count;
      }
    });
  },
});

export default likeSlice.reducer;
